import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { RABBIT_MQ_ENV } from '@server/env';
import { ILogger } from '@common/utils/create-logger.utils';
import { IScanVideoInfoBody, IFullScanChannelInfoBody, IScanCommentsBody, IFullScanVideoInfoBody } from '@common/model';

const getFullScanByVideoAsync = async (video_id: string,channel_id: string, logger: ILogger): IAsyncPromiseResult<string> => {
    // no need await here
    rabbitMQ_sendDataAsync<IFullScanVideoInfoBody>(
        RABBIT_MQ_ENV,
        'fullScanVideoInfoAsync',
        {
            videoId: video_id || '',
            channelId: channel_id || ''
        },
        logger,
    );

    return await ['',];
};

const getFullScanByChannelAsync = async (channel_id: string, logger: ILogger): IAsyncPromiseResult<string> => {
    // no need await here
    rabbitMQ_sendDataAsync<IFullScanChannelInfoBody>(
        RABBIT_MQ_ENV,
        'fullScanChannelInfoAsync',
        {
            channelId: channel_id,
        } as any,
        logger,
    );

    return ['']
};


export const scan = {
    getFullScanByVideoAsync,
    getFullScanByChannelAsync,
};
