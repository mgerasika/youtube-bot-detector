import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { ILogger } from '@common/utils/create-logger.utils';
import { IFullScanChannelInfoBody, IFullScanVideoInfoBody } from '@common/model';
import { allServices } from '@server/controller/all-services';
import { IScanReturn } from '@common/interfaces/scan.interface';
import { connectToRedisAsync } from '@common/utils/redis';
import { getRabbitMqMessageId } from '@common/utils/rabbit-mq';
import { ENV } from '@server/env';

export const fullScanVideoInfoAsync = async (
    body: IFullScanVideoInfoBody,
    logger: ILogger,
): IAsyncPromiseResult<IScanReturn> => {
    
    logger.log('fullScanVideoInfoAsync start', body);
    const [channelResult, channelError] = await allServices.scan.scanChannelInfoAsync({channelId: body.channelId}, logger)
    if(channelError) {
        return [,channelError]
    }
    const [videoResult, videoError] = await allServices.scan.scanVideoInfoAsync({videoId: body.videoId}, logger)
    if(videoError) {
        return [,videoError]
    }
    const [commentResult, commentError] = await allServices.scan.scanCommentsAsync({videoId: body.videoId}, logger)
    if(commentError) {
        return [,commentError]
    }
    
    // add to cdn and post to database if something changed
    if(videoResult?.hasChanges || commentResult?.hasChanges || channelResult?.hasChanges) {
        logger.log('has changes, need upload to cdn')
    }
    else {
        logger.log('no changes, no need upload to cdn')
    }

    logger.log('finish full scan videoId = ', body.videoId)
    
    
    const redisClient = await connectToRedisAsync(ENV.redis_url, logger);
    const messageId = getRabbitMqMessageId<IFullScanVideoInfoBody>('fullScanVideoInfoAsync', body);
    await redisClient.set(messageId, '', {
        EX: 60,
    });
    logger.log('add to redis cache fullScanVideoInfoAsync', messageId);

     logger.log('fullScanVideoInfoAsync end');
    return [{}];
};
