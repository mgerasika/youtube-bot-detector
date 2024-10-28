import { ENV, RABBIT_MQ_ENV } from '@server/env';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import { toQuery } from '@common/utils/to-query.util';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { getChannelInfoAsync } from '@server/controller/youtube/get-channel-info/get-channel-info.service';
import { allServices } from '@server/controller/all-services';
import { ILogger } from '@common/utils/create-logger.utils';
import { IFixBoxy } from '@common/model';

// 1. scan channel by id. start rabbit mq queue with scanVideosByChannelId
export const fixAsync = async (
    body: IFixBoxy,
    logger: ILogger,
): IAsyncPromiseResult<string> => {

    logger.log('fix async');

    await allServices.scan.scanChannelInfoAsync({channelId:body.authorIds?.join(',') || ''}, logger)

    return ['', ];
};
