import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { ILogger, } from '@common/utils/create-logger.utils';
import { IScanReturn, } from '@common/interfaces/rabbitm-mq-return';
import { firebase, } from '../../services/firebase/firebase.service';
import { redisService } from '@common/services/redis';
import { toQuery } from '@common/utils/to-query.util';
import { api } from '@server/api.generated';

// 1 hour
const CACHE_TIME_IN_SECCONDS =5;
export const channelIdsToFirebaseAsync = async (
    body: undefined,
    logger: ILogger
): IAsyncPromiseResult<IScanReturn> => {
    logger.log('channelIdsToFirebaseAsync start');

    const exist = await redisService.existsAsync(redisService.getMessageId('channel-ids',''))
    if(exist) {
        return [{message:logger.log('already exist in redis, skip channel_ids ','')}]
    }
    
    const [channels, channelsError] = await toQuery(() => api.channelGet({is_scannable:true}))
    if(channelsError) {
        logger.log('no channels with is_scannable flag', channels);
    }

    logger.log('before upload to firebase')
    const cacheFileTimeoutInSecconds = 3600*24;
   
    //`channel-ids.json`
    const channel_ids: string[] = channels?.data.map(c=>c.id) || [];
    const [uploadResult, uploadError] = await  firebase.uploadFileAndMakePublic({ jsonString : JSON.stringify({channel_ids}),
        customFileName: 'channel-ids.json', timeoutInSecconds: cacheFileTimeoutInSecconds, logger})
    if (uploadError) {
        return [, logger.log(uploadError)]
    }
    logger.log('after upload to firebase', uploadResult)
   
     await redisService.setAsync(redisService.getMessageId('channel-ids',''), CACHE_TIME_IN_SECCONDS)
     
    logger.log('channelIdsToFirebaseAsync   end');
    return [{}];
};
