import { ENV, RABBIT_MQ_DOWNLOAD_ENV, } from '@server/env';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { api, } from '@server/api.generated';

import { groupArray, } from '@common/utils/group-array.util';
import { oneByOneAsync, } from '@common/utils/one-by-one-async.util';
import { toQuery, } from '@common/utils/to-query.util';
import { getCommentsAsync, IShortCommentInfo, } from '@server/controller/youtube/get-comments/get-comments.service';
import { getUniqueKeys, } from '@common/utils/get-unique-keys.util';
import { createLogger, ILogger, } from '@common/utils/create-logger.utils';
import { allServices, } from '@server/controller/all-services';
import { IScanCommentsBody, IScanChannelInfoBody, IScanCommentsReturn, } from '@common/model/download-server.model';
import { rabbitMqService, } from '@common/services/rabbit-mq'
import { redisService, } from '@common/services/redis'
import { IScanReturn, } from '@common/interfaces/rabbitm-mq-return';
import { filterAuthorIdsAsync, } from '../scan-channel-info/scan-channel-info.service';

// scan all comments by videoId
// possible to use lastDate, but problem with reply comments
// remove from redis cache for rescan
// refactor and put commentIds here, no comments
export const scanCommentsAsync = async (body: IScanCommentsBody, logger: ILogger): IAsyncPromiseResult<IScanCommentsReturn> => {
    logger.log('scanCommentsAsync start', body)

    let lastDateStr = '';
    if (body.ignoreCommentsLastDate) {
        logger.log('ignore comments last date by flag')
    }
    else {
        const [lastDate, lastDateError] = await toQuery(() => api.commentLastDateGet({ video_id: body.videoId }));
        if (lastDateError) {
            return [, logger.log(lastDateError)];
        }
        logger.log('last_date from db (last comment date) = ', lastDate?.data);
        lastDateStr = lastDate?.data?.toString() || ''
    }
    logger.log('start download comments by videoId and lastDate')
    const [data, error] = await allServices.youtube.getCommentsAsync(
        { videoId: body.videoId, publishedAt: lastDateStr },
        logger
    );
    if (error || !data) {
        return [, logger.log(error)];
    }
    logger.log('end download comments ')
    logger.log('recieved comments count = ', data?.items.length);

    const comments = data.items.reverse();

    // start submit authors
    // logger.log('beforeUniqueKeys', comments)
    const uniqueAuthorIds = getUniqueKeys(comments, 'authorChannelId');
    logger.log('uniqueAuthorIds = ', uniqueAuthorIds.length)

    const [missedIds, missedIdsError] = await filterAuthorIdsAsync(uniqueAuthorIds, logger);
    logger.log('missedAuthorsIds = ', missedIds?.length)
    if (missedIdsError) {
        return [, missedIdsError]
    }
    if (!missedIds) {
        return [, 'missedIds empty']
    }

    //!!!Warning This method sync call scan chanels (no rabbit mq here) because need corectly post into database (foreing key problem)
    if (missedIds?.length) {
        const groups = groupArray(missedIds, 50);
        logger.log('start download channels by groups ', groups.length)
        await oneByOneAsync(groups, async (group) => {
            await allServices.scan.scanChannelInfoAsync({ channelIds: group }, logger);
        });
        logger.log('end download channels')
    }
    // end submit authors

    if (comments.length === 0) {
        return [{ message: logger.log('no comments, skip') }]
    }
    logger.log('start push to database comments (after channels)', comments.length)

    let groupLength = 256;
    do {
        const groupedComments = groupArray(comments, groupLength);
        logger.log('Try post to db comments group length = ' + groupLength)
        const [postSuccess, postError] = await postGroupOfCommentsToDbAsync(body.videoId, groupedComments, logger)
        if (postSuccess) {
            logger.log('Success post with groupLength = ' + groupLength)
            break;
        }
        if (postError) {
            groupLength = Math.floor(groupLength / 2);
        }
    }
    while (groupLength > 0)
    logger.log(`total post to db comments ${comments.length}`)


    logger.log('scanCommentsAsync end')
    return [{ hasChanges: comments.length > 0 || missedIds.length > 0, missedChannelIds: missedIds || [], uniqueChannelIds: uniqueAuthorIds || [] }];
};




export const postGroupOfCommentsToDbAsync = async (video_id: string,groupedComments: IShortCommentInfo[][], logger: ILogger): IAsyncPromiseResult<IScanCommentsReturn> => {

    const [, oneByOneError] = await oneByOneAsync(groupedComments, async (group, cancel) => {
        const [success, apiError] = await toQuery(() =>
            api.commentPost({
                comments: group.map((item) => {
                    return {
                        published_at: item.publishedAt,
                        published_at_time: item.publishedAt,
                        id: item.commentId,
                        channel_id: item.channelId,
                        text: (item.text || '').replace(/[\u0000]/g, ''),
                        author_id: item.authorChannelId,
                        video_id: video_id,
                        parent_comment_id: item.parentCommentId,
                    };
                }),
            })
        );
        if (success) {
            logger.log('post to db comments', group.length)
            await oneByOneAsync(group, async (comment) => {
                await redisService.setAsync(redisService.getMessageId('comment', comment.commentId))
            })
        }
        if (apiError) {
            logger.log('some error in forEach', apiError);
            cancel(apiError)
        }
    });
    if (oneByOneError) {
        return [, logger.log(oneByOneError)]
    }
    return [{ hasChanges: true, message: 'Post comments to db success' }]

};
