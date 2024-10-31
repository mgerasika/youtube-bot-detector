import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import { toQuery } from '@common/utils/to-query.util';
import { allServices } from '@server/controller/all-services';
import { ILogger } from '@common/utils/create-logger.utils';
import { connectToRedisAsync, redis_setAsync } from '@common/utils/redis';
import { ENV } from '@server/env';
import { getRabbitMqMessageId, getRedisMessageId } from '@common/utils/rabbit-mq';
import { IScanChannelInfoBody } from '@common/model';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';
import { IScanReturn } from '@common/interfaces/scan.interface';

// redis expiration should be max value (several years I think)
export const scanChannelInfoAsync = async (
    body: IScanChannelInfoBody,
    logger: ILogger,
): IAsyncPromiseResult<IScanReturn> => {
    logger.log('scanChannelInfoAsync start', body)
    const redisClient = await connectToRedisAsync(ENV.redis_url, logger);

    const available = await redisClient.exists(getRedisMessageId('channel', body.channelId));
    if (available) {
        return [{ message: logger.log('channel already exist in redis, skip ' + body.channelId) }];
    }
    if (!body.channelId.includes(',')) {
        const [info] = await toQuery(() => api.channelIdGet(body.channelId));
        if (info?.data?.id === body.channelId) {
            await redis_setAsync(redisClient, getRedisMessageId('channel', body.channelId));

            return [
                { message: logger.log(logger.log('channel already exist in database, add to redis and skip ' + body.channelId)) },
            ];
        }
    }

    // probadly not found, then add
    const [data, error] = await allServices.youtube.getChannelInfoAsync({ channelId: body.channelId }, logger);
    if (error) {
        return [, error];
    }

    if (!data) {
        return [{ message: logger.log('Channel not found, probadly deleted, skip') }];
    }

    const channels = data.map((channel) => {
        return {
            published_at: new Date(channel.publishedAt),
            id: channel.channelId,
            title: channel.title,
            author_url: channel.authorUrl || '',
            subscriber_count: +(channel.subscriberCount || 0),
            video_count: +(channel.videoCount || 0),
            view_count: +(channel.viewCount || 0),
        };
    });
    const [success, apiError] = await toQuery(() => api.channelPost({ channels }));
    if (apiError) {
        return [, apiError];
    }
    if (!success) {
        return [, 'data is empty'];
    }
    if(channels.length) {
        logger.log('post to database new channels ',channels.length)
    }
    
    logger.log('Add to redis channels')
    await oneByOneAsync(channels, async (channel) => {
        await redis_setAsync(redisClient, getRedisMessageId('channel', channel.id));

        const messageId = getRabbitMqMessageId<IScanChannelInfoBody>('scanChannelInfoAsync', {channelId:channel.id});
             await redisClient.set(messageId, '', {
                EX: 60*60*24*12*10, // 10 years
            });
    });

    logger.log('scanChannelInfoAsync end')
    return [{ hasChanges: channels.length > 0, message: logger.log('add to redis cache new channels = ', channels.length) }];
};
