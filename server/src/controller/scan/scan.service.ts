import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { nameOf } from '@common/utils/name-of';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { ENV, RABBIT_MQ_ENV } from '@server/env';
import { allServices } from '../all-services';
import { ILogger } from '@common/utils/create-logger.utils';
import { groupArray } from '@common/utils/group-array.util';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';
import { IScanCommentsBody, IScanVideoInfoBody, IScanChannelInfoBody } from '@common/model';

export interface IScanInfo {
    comment_count: number;
    author_id: string;
    author_url: string;
    id: string;
    published_at: Date;
    video_count: number;
    subscriber_count: number;
    title: string;
}
const getScanByVideoAsync = async (video_id: string, logger: ILogger): IAsyncPromiseResult<IScanInfo[]> => {
    rabbitMQ_sendDataAsync<IScanCommentsBody>(
        RABBIT_MQ_ENV,
        'scanCommentsAsync',
        {
            videoId: video_id || '',
        },
        logger,
    );

    rabbitMQ_sendDataAsync<IScanVideoInfoBody>(
        RABBIT_MQ_ENV,
        'scanVideoInfoAsync',
        {
            videoId: video_id || '',
        },
        logger,
    );

    return await [[]];
};

const getScanByChannelAsync = async (channel_id: string, logger: ILogger): IAsyncPromiseResult<IScanInfo[]> => {
    rabbitMQ_sendDataAsync<IScanChannelInfoBody>(
        RABBIT_MQ_ENV,
        'scanChannelInfoAsync',
        {
            channelId: channel_id,
        },
        logger,
    );

    return await allServices.statistic.getStatisticByChannelAsync(channel_id, logger);
};





export const scan = {
    getScanByVideoAsync,
    getScanByChannelAsync,
};
