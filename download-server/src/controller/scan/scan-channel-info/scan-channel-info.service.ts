import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import { toQuery } from '@common/utils/to-query.util';
import { allServices } from '@server/controller/all-services';
import { ILogger } from '@common/utils/create-logger.utils';
import { connectToRedisAsync, redis_setAsync } from '@common/utils/redis';
import { ENV } from '@server/env';
import { getRabbitMqMessageId } from '@common/utils/rabbit-mq';
import { IScanChannelInfoBody } from '@common/model';

// redis expiration should be max value (several years I think)
export const scanChannelInfoAsync = async (body: IScanChannelInfoBody, logger: ILogger): IAsyncPromiseResult<string> => {

    const redis = await connectToRedisAsync(ENV.redis_url, logger)
    const messageId = getRabbitMqMessageId<IScanChannelInfoBody>('scanChannelInfoAsync', {channelId:body.channelId})

    const available = await redis.exists(messageId);
    if(available) {
        return ['already exist in redis, skip ' + body.channelId];
    }
    if (!body.channelId.includes(',')) {
        const [info] = await toQuery(() => api.channelIdGet(body.channelId));
        if (info?.data?.id === body.channelId) {
           
            await redis_setAsync(redis, messageId);
            return ['already exist in database, skip ' + body.channelId];
        }
    }

    // probadly not found, then add
    const [data, error] = await allServices.youtube.getChannelInfoAsync({ channelId: body.channelId }, logger);
    if (error) {
        return [, error];
    }

    if (data === undefined) {
        return ['Channel not found, probadly deleted'];
    }

    if (data) {
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
        const [, apiError] = await toQuery(() => api.channelPost({ channels }));
        if (apiError) {
            return [, apiError];
        }
    }

    return [, error];
};
