import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { ILogger, } from '@common/utils/create-logger.utils';
import { IFullScanVideoInfoBody, } from '@common/model/download-server.model';
import { allServices, } from '@server/controller/all-services';
import { IScanReturn, } from '@common/interfaces/rabbitm-mq-return';
import { redisService } from '@common/services/redis';
import { toQuery } from '@common/utils/to-query.util';
import { api, IStatisticByChannelForOne } from '@server/api.generated';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';
import { rabbitMqService } from '@common/services/rabbit-mq';
import { RABBIT_MQ_DOWNLOAD_ENV, RABBIT_MQ_STATISTIC_ENV } from '@server/env';
import { IUploadStatisticBody } from '@common/model/statistic-server.model';
import { log } from 'console';

export const fullScanVideoInfoAsync = async (
    body: IFullScanVideoInfoBody,
    logger: ILogger
): IAsyncPromiseResult<IScanReturn> => {
    logger.log('fullScanVideoInfoAsync start', body);

    
    const available = await redisService.existsAsync(redisService.getMessageId('full-video', body.video_id));
    if(available) {
        return [{message:logger.log('full-video already exist in redis, skip ' + body.video_id)}];
    }
    else {
        logger.log('not available in redis full-video', body.video_id)
    }

    let channelId = '';

    logger.log('get channel id from db, if not found then from youtube api')
    const [info] = await toQuery(() => api.videoIdGet(body.video_id));
    if (info?.data?.id === body.video_id) {
        channelId = info.data.channel_id;
        logger.log('recived channel id from db', channelId)

    }
    else {
        const [youtubeVideo, youtubeError] = await allServices.youtube.getVideoInfoAsync({ videoId: body.video_id }, logger)
        if (youtubeError) {
            return [, youtubeError]
        }
        if (!youtubeVideo) {
            return [ {message: logger.log('video not found on youtube, probadly deleted', body.video_id)}]
        }
        channelId = youtubeVideo.channelId
        logger.log('recived channel id youtube api', channelId)
    }



    logger.log('ensure channel in database, call scanChannelInfoAsync', channelId);
    const [scanChannelData, scanChannelError] = await allServices.scan.scanChannelInfoAsync({ channelIds: [channelId] }, logger)
    if (scanChannelError) {
        return [, scanChannelError]
    }


    const [channel, channelError] = await toQuery(() => api.channelIdGet(channelId))
    if(channelError || !channel) {
        logger.log('delete from redis database, probadly problem with database sync, exist in redis but missed in postgresql, need rerun job', channelId)
        redisService.delAsync(redisService.getMessageId('channel', channelId));
        return [, 'error in channel get ' + channelError]
    }
    if(!channel.data.is_scannable) {
        logger.log('skip, donnot upload statistic for not scanable youtube channels, skip', channelId)
        return [{}];
        
    }
        
    logger.log('ensure video in database, call scanVideoInfoAsync', body.video_id);
    const [, videoError] = await allServices.scan.scanVideoInfoAsync({ videoId: body.video_id }, logger)
    if (videoError) {
        return [, videoError]
    }

    logger.log('start scanCommentsAsync', body)
    const [commentResult, commentError] = await allServices.scan.scanCommentsAsync({ videoId: body.video_id, ignoreCommentsLastDate:  body.ignoreCommentsLastDate }, logger)
    if (commentError) {
        return [, commentError]
    }
    logger.log('end scanCommentsAsync')

    
   

    const [statByVideo, statByVideoError] = await toQuery(() => api.statisticByVideoGet({video_id:body.video_id}))
    if(statByVideoError || !statByVideo?.data) {
        logger.log('error ' + statByVideoError)
        return [{}]
    }

    await oneByOneAsync(statByVideo.data, async (statistic) => {
        rabbitMqService.sendDataAsync<IUploadStatisticBody>(RABBIT_MQ_STATISTIC_ENV,'uploadStatisticAsync', statistic, logger)
    })

    // await oneByOneAsync(commentResult?.missedChannelIds || [], async (id, cancelFn) => {
    //     logger.log('before request statistic data ', id)
    //     const [statistic, statisticError] = await toQuery(() => api.statisticByChannelForOneGet({ channel_id: id }))
    //     if (statisticError) {
    //         return cancelFn(statisticError)
    //     }
        
    //     if(!statistic?.data) {
    //         return cancelFn('statistic can not be empty ' + id)
    //     }
    //     logger.log('after request statistic data ', statistic?.data)

    //     rabbitMqService.sendDataAsync<IUploadStatisticBody>(RABBIT_MQ_STATISTIC_ENV,'uploadStatisticAsync', statistic.data, logger)
    // })

   

    logger.log('Add to redis full-video')
    await redisService.setAsync( redisService.getMessageId('full-video', body.video_id), 60*60);

    logger.log('fullScanVideoInfoAsync end');
    return [{}];
};
