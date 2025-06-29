import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { ILogger, } from '@common/utils/create-logger.utils';
import { IUploadToFirebaseBody } from '@common/model/statistic-server.model';
import { IScanReturn, } from '@common/interfaces/rabbitm-mq-return';
import { firebase, } from '../../services/firebase/firebase.service';

// 1 hour
const CACHE_TIME_IN_SECCONDS = 1*60*60
export const uploadToFirebaseAsync = async (
    data: IUploadToFirebaseBody,
    logger: ILogger
): IAsyncPromiseResult<IScanReturn> => {
    logger.log('uploadToFirebaseAsync start', data);

    logger.log('before upload to firebase')
    const cacheFileTimeoutInSecconds = 3600*24;
   
    //`channel-ids.json`
    const [uploadResult, uploadError] = await  firebase.uploadFileAndMakePublic({ jsonString : data.bodyStr,
        customFileName: data.file_name, timeoutInSecconds: cacheFileTimeoutInSecconds, logger})
    if (uploadError) {
        return [, logger.log(uploadError)]
    }
    logger.log('after upload to firebase', uploadResult)
   
    logger.log('uploadToFirebaseAsync   end');
    return [{}];
};
