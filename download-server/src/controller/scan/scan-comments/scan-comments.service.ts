import { ENV, RABBIT_MQ_ENV } from '@server/env';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import { getRabbitMqMessageId, getRedisMessageId, rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { groupArray } from '@common/utils/group-array.util';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';
import { toQuery } from '@common/utils/to-query.util';
import { getCommentsAsync } from '@server/controller/youtube/get-comments/get-comments.service';
import { getUniqueKeys } from '@common/utils/get-unique-keys.util';
import { createLogger, ILogger } from '@common/utils/create-logger.utils';
import { allServices } from '@server/controller/all-services';
import { IScanCommentsBody, IScanChannelInfoBody } from '@common/model';
import { connectToRedisAsync, redis_setAsync } from '@common/utils/redis';

// scan all comments by videoId
// possible to use lastDate, but problem with reply comments
// remove from redis cache for rescan
export const scanCommentsAsync = async (body: IScanCommentsBody, logger: ILogger): IAsyncPromiseResult<string> => {
    const [lastDate, lastDateError] = await toQuery(() => api.commentLastDateGet({ video_id: body.videoId }));
    if (lastDateError) {
        return [, lastDateError];
    }
    logger.log('last_date = ', lastDate?.data);

    const [data, error] = await allServices.youtube.getCommentsAsync(
        { videoId: body.videoId, publishedAt: lastDate?.data?.toString() || '' },
        logger,
    );
    logger.log('recieved comments count = ', data?.items.length);

    if (data) {
        const comments = data.items.reverse();

        // start submit authors
        const uniqueAuthorIds = getUniqueKeys(comments, 'authorChannelId');
        const redis = await connectToRedisAsync(ENV.redis_url, logger);
        const missedAuthorsIds: string[] = [];
        await oneByOneAsync(uniqueAuthorIds, async (authorId) => {
            const available = await redis.exists(getRedisMessageId('channel',authorId));
            if (!available) {
                missedAuthorsIds.push(authorId);
            }
        });

        if (missedAuthorsIds.length) {
            logger.log('uniqueAuthorIds = ', uniqueAuthorIds.length, ' missedAuthorsIds = ', missedAuthorsIds.length)
            const groups = groupArray(missedAuthorsIds, 50);
            await oneByOneAsync(groups, async (group) => {
                await allServices.scan.scanChannelInfoAsync({channelId: group.join(',')}, logger);
            });
        }
        // end submit authors

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
                await oneByOneAsync(group, async (comment) => {
                    await redis_setAsync(redis, getRedisMessageId('comment', comment.commentId))
                })
                logger.log('add to redis cache comments = ', group.length )
            }
            if (apiError) {
                logger.log('some error in forEach', apiError);
                throw apiError;
            }
        });

        // remove comments from redis cache
        const redisClient = await connectToRedisAsync(ENV.redis_url, logger);
        const messageId = getRabbitMqMessageId<IScanCommentsBody>('scanCommentsAsync', {
            videoId: body.videoId,
        });
        await redisClient.set(messageId, '', {
            EX: 60,
        });

        return [`post to db comments ${comments.length}`];
    }

    return [, error];
};
