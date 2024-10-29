import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { allServices } from '@server/controller/all-services';
import { ILogger } from '@common/utils/create-logger.utils';
import { ITestBody } from '@common/model';
import { IScanReturn } from '@common/interfaces/scan.interface';

// 1. scan channel by id. start rabbit mq queue with scanVideosByChannelId
export const testAsync = async (
    body: ITestBody,
    logger: ILogger,
): IAsyncPromiseResult<IScanReturn> => {

    logger.log('fix async');

    await allServices.scan.scanChannelInfoAsync({channelId:body.authorIds?.join(',') || ''}, logger)

    return [{}];
};
