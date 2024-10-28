import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import { toQuery } from '@common/utils/to-query.util';
import { allServices } from '@server/controller/all-services';
import { ILogger } from '@common/utils/create-logger.utils';
import { getRabbitMqMessageId } from '@common/utils/rabbit-mq';
import { connectToRedisAsync, redis_setAsync } from '@common/utils/redis';
import { ENV } from '@server/env';
import { IScanVideoInfoBody } from '@common/model';

// redis expiration should be max value (several years I think)
export const scanVideoInfoAsync = async (body: IScanVideoInfoBody, logger: ILogger): IAsyncPromiseResult<string> => {
    const redis = await connectToRedisAsync(ENV.redis_url, logger)
    const messageId = getRabbitMqMessageId<IScanVideoInfoBody>('scanVideoInfoAsync', {videoId:body.videoId})

    const available = await redis.exists(messageId);
    if(available) {
        return ['already exist in redis, skip ' + body.videoId];
    }

    const [info, ] = await toQuery(() => api.videoIdGet(body.videoId));
    if (info?.data?.id === body.videoId) {
        const redis = await connectToRedisAsync(ENV.redis_url, logger);
        const messageId = getRabbitMqMessageId<IScanVideoInfoBody>('scanVideoInfoAsync', { videoId: body.videoId });
        await redis_setAsync(redis, messageId);

        return ['already exist in database, skip ' + body.videoId];
    }
    // probadly not found, then add
    const [data, error] = await allServices.youtube.getVideoInfoAsync({ videoId: body.videoId }, logger);
    if (error) {
        return [, error];
    }

    if (data === undefined) {
        return ['Video not found, probadly deleted'];
    }
    if (data) {
        const [, apiError] = await toQuery(() =>
            api.videoPost({
                videos: [
                    { published_at: data.publishedAt, id: data.videoId, title: data.title, channel_id: data.channelId },
                ],
            }),
        );
        if (apiError) {
            return [, apiError];
        }
    }

    return [, error];
};
