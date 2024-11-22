import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import {rabbitMqService,} from '@common/services/rabbit-mq'
import { RABBIT_MQ_DOWNLOAD_ENV, } from '@server/env';
import { ILogger, } from '@common/utils/create-logger.utils';
import {  IFullScanChannelInfoBody, IFullScanVideoInfoBody, } from '@common/model/download-server.model';

const getFullScanByVideoAsync = async (video_id: string,logger: ILogger): IAsyncPromiseResult<string> => {
    // temporary disable untill scan finished
    return ['']

    // no need await here
    rabbitMqService.sendDataAsync<IFullScanVideoInfoBody>(
        RABBIT_MQ_DOWNLOAD_ENV,
        'fullScanVideoInfoAsync',
        {
            video_id: video_id || '',
            ignoreCommentsLastDate:false,
        },
        logger
    );

    return await ['started queue in rabbit-mq'];
};

const getFullScanByChannelAsync = async (channel_id: string, logger: ILogger): IAsyncPromiseResult<string> => {
    // temporary disable untill scan finished
    return ['']

    // no need await here
    rabbitMqService.sendDataAsync<IFullScanChannelInfoBody>(
        RABBIT_MQ_DOWNLOAD_ENV,
        'fullScanChannelInfoAsync',
        {
            channelId: channel_id,
            ignoreCommentsLastDate:false,
            ignoreVideoLastDate: false,
        } ,
        logger
    );

    return ['']
};


export const scan = {
    getFullScanByVideoAsync,
    getFullScanByChannelAsync,
};
