import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { api, } from '@server/api.generated';
import { toQuery, } from '@common/utils/to-query.util';
import { allServices, } from '@server/controller/all-services';
import { ILogger, } from '@common/utils/create-logger.utils';
import {rabbitMqService,} from '@common/services/rabbit-mq'
import {redisService,} from '@common/services/redis'
import { ENV, } from '@server/env';
import { IScanVideoInfoBody, } from '@common/model/download-server.model';
import { IScanReturn, } from '@common/interfaces/rabbitm-mq-return';

// redis expiration should be max value (several years I think)
export const scanVideoInfoAsync = async (body: IScanVideoInfoBody, logger: ILogger): IAsyncPromiseResult<IScanReturn> => {
    logger.log('scanVideoInfoAsync start', body)
    
    const available = await redisService.existsAsync(redisService.getMessageId('video', body.videoId));
    if(available) {
        return [{message:logger.log('video already exist in redis, skip ' + body.videoId)}];
    }

    const [info ] = await toQuery(() => api.videoIdGet(body.videoId));
    if (info?.data?.id === body.videoId) {
        await redisService.setAsync( redisService.getMessageId('video', body.videoId));

        return [{message: logger.log('video already exist in database, add to redis and skip ' + body.videoId)}];
    }
    // probadly not found, then add
    const [data, error] = await allServices.youtube.getVideoInfoAsync({ videoId: body.videoId }, logger);
    if (error) {
        return [, error];
    }

    if (!data) {
       
        return [{message: logger.log('Video not found, probadly deleted, skip')}];
    }
    const [, apiError] = await toQuery(() =>
        api.videoPost({
            videos: [
                { published_at: data.publishedAt,
                published_at_time: data.publishedAt ,
                    id: data.videoId, title: data.title, channel_id: data.channelId },
            ],
        })
    );
    if (apiError) {
        return [, apiError];
    }
    await redisService.setAsync( redisService.getMessageId('video', body.videoId));

    logger.log('scanVideoInfoAsync end')
    return [{hasChanges:true}];
};
