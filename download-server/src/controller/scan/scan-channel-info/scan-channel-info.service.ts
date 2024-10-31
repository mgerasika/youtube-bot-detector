import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import { toQuery } from '@common/utils/to-query.util';
import { allServices } from '@server/controller/all-services';
import { ILogger } from '@common/utils/create-logger.utils';
import { connectToRedisAsync, redis_setAsync } from '@common/utils/redis';
import { ENV } from '@server/env';
import { getRedisMessageId } from '@common/utils/rabbit-mq';
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
    const ids = body.channelId.includes(',') ? body.channelId.split(','): [body.channelId];

    const [missedInDb, errorInFilter] = await filterAuthorIdsAsync(ids, logger);
    if(errorInFilter) {
        return [,errorInFilter]
    }
    if(!missedInDb) {
        return [,'Missed in db is empty']
    }

    // probadly not found, then add
    const [data, error] = await allServices.youtube.getChannelInfoAsync({ channelId: missedInDb.join(',') }, logger);
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
    });

    logger.log('scanChannelInfoAsync end')
    return [{ hasChanges: channels.length > 0, message: logger.log('add to redis cache new channels = ', channels.length) }];
};


export async function filterAuthorIdsAsync(ids:string[], logger: ILogger): IAsyncPromiseResult<string[]> {
    const redisClient = await connectToRedisAsync(ENV.redis_url, logger);
    const missedInRedis: string[] = [];
    await oneByOneAsync(ids, async (id) => {
        const available = await redisClient.exists(getRedisMessageId('channel',id));
        if ( !available) {
            missedInRedis.push(id);
        }
    });

    if(missedInRedis.length == 0) {
        logger.log('no new authors after redis validation, already added in another thread ')
        return [[]];
    }

    const missedInDb: string[] = [];
   await oneByOneAsync(missedInRedis, async (id) => {

        const [info] = await toQuery(() => api.channelIdGet(id));
        if (info?.data?.id === id) {
            await redis_setAsync(redisClient, getRedisMessageId('channel', id));
        }
        else {
            missedInDb.push(id)
        }
   })
   if(missedInDb.length == 0) {
    logger.log('no new authors after db validation, already added in another thread ');
    return [[]]
}

   logger.log(`after filter input = ${ids.length} missedInRedis=${missedInRedis.length} missedInDb=${missedInDb.length}`)
   return [missedInDb];
}