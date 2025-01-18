import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { ILogger, } from '@common/utils/create-logger.utils';
import { IUploadStatisticBody, serializeFirebaseBody, } from '@common/model/statistic-server.model';
import { IScanReturn, } from '@common/interfaces/rabbitm-mq-return';
import { toQuery, } from '@common/utils/to-query.util';
import { api, IStatisticDto, } from '@server/api.generated';
import { firebase, } from '../../../services/firebase/firebase.service';
import { redisService, } from '@common/services/redis';
import { cryptoService, } from '@common/services/crypto.service';
import { IFirebaseFile, } from '../../../../../common/src/model/statistic-server.model';

// 25 hours
const CACHE_TIME_IN_SECCONDS = 25*60*60
export const uploadStatisticAsync = async (
    body: IUploadStatisticBody,
    logger: ILogger
): IAsyncPromiseResult<IScanReturn> => {
    logger.log('uploadStatisticAsync start', body);

    const exist = await redisService.existsAsync(redisService.getMessageId('statistic', body.channel_id))
    if(exist) {
        return [{message:logger.log('already exist in redis, skip statistic ', body.channel_id)}]
    }

    const now = new Date();
    const [prevInfo, prevInfoError] = await toQuery(() => api.statisticIdGet(body.channel_id))
    if(prevInfoError) {
        logger.log('no prev info', prevInfo);
    }
    if (prevInfo && prevInfo.data.uploaded_at_time) {
        const prevDate = new Date(prevInfo.data.uploaded_at_time);
        const diffInSecconds = (now.getTime() - prevDate.getTime()) / (1000 )
        logger.log('Statistic already exist, previous data', prevDate, ' now' , now,  ' diff in secconds ', diffInSecconds);
        
        // skip update if in cache with some delay
        if (diffInSecconds < CACHE_TIME_IN_SECCONDS) {
            logger.log(`Different from prefious statistic lest than ${CACHE_TIME_IN_SECCONDS} secconds, skip `, diffInSecconds)
            return [{}]
        }
    }
    
    const firebaseFileContent: IFirebaseFile = {
        v:'v1',
        b: serializeFirebaseBody(body),
    }

    const hash = cryptoService.hashJson(firebaseFileContent);
    if(prevInfo?.data.hash === hash) {
        return [{message:logger.log('Same hash already exist in database, skip upload to firebase', firebaseFileContent)}]
    }

    logger.log('before upload to firebase')
    const cacheFileTimeoutInSecconds = 3600*24;
    // if((body.frequency >= 2 || body.frequency_tick > 3) && body.comment_count >= 100) {
    //     cacheFileTimeoutInSecconds = cacheFileTimeoutInSecconds * 30;
    // }
    const [uploadResult, uploadError] = await  firebase.uploadJsonAndMakePublic(firebaseFileContent,
         `${body.channel_id}.json`, cacheFileTimeoutInSecconds, logger)
    if (uploadError) {
        return [, logger.log(uploadError)]
    }
    logger.log('after upload to firebase', uploadResult)

    const statistic: IStatisticDto = {
        ...body,
        uploaded_at_time: new Date(),
        hash,
    }
    logger.log('before post to database', statistic)
    const [success, postError] = await toQuery(() => api.statisticPost({
        statistics: [
            statistic,
        ],
    }))
    if (postError) {
        return [, logger.log(postError)]
    }
    logger.log('post to db success', success?.data)
    await redisService.setAsync(redisService.getMessageId('statistic', body.channel_id), CACHE_TIME_IN_SECCONDS)

    logger.log('uploadStatisticAsync end');
    return [{}];
};
