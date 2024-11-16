import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { allServices, } from '@server/controller/all-services';
import { ILogger, } from '@common/utils/create-logger.utils';
import { IDownloadServerTestBody, } from '@common/model/download-server.model';
import { IScanReturn, } from '@common/interfaces/rabbitm-mq-return';

// 1. scan channel by id. start rabbit mq queue with scanVideosByChannelId
export const testAsync = async (
    body: IDownloadServerTestBody,
    logger: ILogger
): IAsyncPromiseResult<IScanReturn> => {

    logger.log('test async');


    return [{}];
};
