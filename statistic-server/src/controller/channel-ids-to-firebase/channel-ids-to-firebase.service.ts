import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { ILogger, } from '@common/utils/create-logger.utils';
import { IChannelIdsToFirebaseBody, IUploadStatisticBody, serializeFirebaseBody, } from '@common/model/statistic-server.model';
import { IScanReturn, } from '@common/interfaces/rabbitm-mq-return';
import { firebase, } from '../../services/firebase/firebase.service';

// 1 hour
const CACHE_TIME_IN_SECCONDS = 1*60*60
export const channelIdsToFirebaseAsync = async (
    body: IChannelIdsToFirebaseBody,
    logger: ILogger
): IAsyncPromiseResult<IScanReturn> => {
    logger.log('channelIdsToFirebaseAsync start', body);

    logger.log('before upload to firebase')
    const cacheFileTimeoutInSecconds = 3600*24;
   
    const firebaseFileContent = body;
    const [uploadResult, uploadError] = await  firebase.uploadJsonAndMakePublic(firebaseFileContent,
         `channel-ids.json`, cacheFileTimeoutInSecconds, logger)
    if (uploadError) {
        return [, logger.log(uploadError)]
    }
    logger.log('after upload to firebase', uploadResult)
   
    logger.log('channelIdsToFirebaseAsync end');
    return [{}];
};
