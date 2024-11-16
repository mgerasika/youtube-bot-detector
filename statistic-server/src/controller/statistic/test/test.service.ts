import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { ILogger, } from '@common/utils/create-logger.utils';
import { IScanReturn, } from '@common/interfaces/rabbitm-mq-return';
import { IStatisticServerTestBody, } from '@common/model/statistic-server.model';

// 1. scan channel by id. start rabbit mq queue with scanVideosByChannelId
export const test2Async = async (
    body: IStatisticServerTestBody,
    logger: ILogger
): IAsyncPromiseResult<IScanReturn> => {

    logger.log('test async');


    return [{}];
};
