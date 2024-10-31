import { ENV, RABBIT_MQ_ENV } from '@server/env';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import {  getRedisMessageId, rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { groupArray } from '@common/utils/group-array.util';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';
import { toQuery } from '@common/utils/to-query.util';
import { getCommentsAsync } from '@server/controller/youtube/get-comments/get-comments.service';
import { getUniqueKeys } from '@common/utils/get-unique-keys.util';
import { createLogger, ILogger } from '@common/utils/create-logger.utils';
import { allServices } from '@server/controller/all-services';
import { IScanCommentsBody, IScanChannelInfoBody } from '@common/model';
import { connectToRedisAsync, redis_setAsync } from '@common/utils/redis';
import { IScanReturn } from '@common/interfaces/scan.interface';
import { filterAuthorIdsAsync } from '../scan-channel-info/scan-channel-info.service';

// scan all comments by videoId
// possible to use lastDate, but problem with reply comments
// remove from redis cache for rescan
// refactor and put commentIds here, no comments
export const scanCommentsAsync = async (body: IScanCommentsBody, logger: ILogger): IAsyncPromiseResult<IScanReturn> => {
    logger.log('scanCommentsAsync start', body)
    const [lastDate, lastDateError] = await toQuery(() => api.commentLastDateGet({ video_id: body.videoId }));
    if (lastDateError) {
        return [,logger.log(lastDateError)];
    }
    logger.log('last_date from db (last comment date) = ', lastDate?.data);

    logger.log('start download comments by videoId and lastDate')
    const [data, error] = await allServices.youtube.getCommentsAsync(
        { videoId: body.videoId, publishedAt: lastDate?.data?.toString() || '' },
        logger,
    );
    if(error || !data) {
        return [,logger.log(error)];
    }
    logger.log('end download comments ')
    logger.log('recieved comments count = ', data?.items.length);

    const comments = data.items.reverse();

    // start submit authors
    const uniqueAuthorIds = getUniqueKeys(comments, 'authorChannelId');
    const redisClient = await connectToRedisAsync(ENV.redis_url, logger);
    const [missedIds, missedIdsError] = await filterAuthorIdsAsync(uniqueAuthorIds, logger);
    if(missedIdsError) {
        return [,missedIdsError]
    }
    if(!missedIds) {
        return [,'missedIds empty']
    }

    //!!!Warning This method sync call scan chanels (no rabbit mq here) because need corectly post into database (foreing key problem)
    if (missedIds?.length) {
        logger.log('uniqueAuthorIds = ', uniqueAuthorIds.length, ' missedAuthorsIds = ', missedIds.length)
        const groups = groupArray(missedIds, 50);
        logger.log('start download channels by groups ', groups.length)
        await oneByOneAsync(groups, async (group) => {
            await allServices.scan.scanChannelInfoAsync({channelId: group.join(',')}, logger);
        });
        logger.log('end download channels')
    }
    // end submit authors

    logger.log('start push to database comments (after channels)')
    const groupedComments = groupArray(comments, 100);
    await oneByOneAsync(groupedComments, async (group) => {
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
                        video_id: body.videoId,
                    };
                }),
            }),
        );
        if(success) {
            logger.log('post to db comments', group.length)
            await oneByOneAsync(group, async (comment) => {
                await redis_setAsync(redisClient, getRedisMessageId('comment', comment.commentId))
            })
        }
        if (apiError) {
            logger.log('some error in forEach', apiError);
            throw apiError;
        }
    });
    
    logger.log(`total post to db comments ${comments.length}`)

    
    logger.log('scanCommentsAsync end')
    return [{ hasChanges:comments.length > 0 || missedIds.length > 0}];
};
