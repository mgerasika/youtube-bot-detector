import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { nameOf } from '@common/utils/name-of';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { ENV, RABBIT_MQ_ENV } from '@server/env';
import { allServices } from '../all-services';
import { IAddYoutubeKeyBody, IScan, IScanChannelInfoBody, IScanCommentsBody, IScanVideoInfoBody } from '@common/interfaces/scan.interface';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util'
import { ILogger } from '@common/utils/create-logger.utils';
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
        }, logger
    );

    rabbitMQ_sendDataAsync<IScanVideoInfoBody>(
        RABBIT_MQ_ENV,
        'scanVideoInfoAsync',
        {
            videoId: video_id || '',
        }, logger
    );

    return await [[]];
};

const getScanByChannelAsync = async (channel_id: string,   logger: ILogger): IAsyncPromiseResult<IScanInfo[]> => {
    rabbitMQ_sendDataAsync<IScanChannelInfoBody>(
        RABBIT_MQ_ENV,
        'scanChannelInfoAsync',
        {
            channelId: channel_id
        }, logger
    );

    return await allServices.statistic.getStatisticByChannelAsync(channel_id, logger);
};

const addYoutubeKey = async (email: string, key: string, logger: ILogger): IAsyncPromiseResult<void> => {
    rabbitMQ_sendDataAsync<IAddYoutubeKeyBody>(
        RABBIT_MQ_ENV,
        'addYoutubeKeyAsync', {
        email,
        key,
    } , logger
    );
    return [,];
};
  

const fixAsync = async ( logger: ILogger): IAsyncPromiseResult<string> => {
    const [data, error] = await allServices.comment.getAutorsIds(logger)
    if (error) {
        return [, error];
    }

    await oneByOneAsync<string>(data as string[], async (channelId) => {
        rabbitMQ_sendDataAsync<IScanChannelInfoBody>(
            RABBIT_MQ_ENV,
            'scanChannelInfoAsync', {
            channelId
        }, logger
        );
    });

    return ['add to rabbit mq scanChannelInfoAsync' + data?.length];
};

export const scan = {
    getScanByVideoAsync,
    getScanByChannelAsync,
    addYoutubeKey,
    fixAsync,
};
