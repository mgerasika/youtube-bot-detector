import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { nameOf } from '@common/utils/name-of';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { ENV, RABBIT_MQ_ENV } from '@server/env';
import { allServices } from '../all-services';
import { IAddYoutubeKeyBody, IScan, IScanCommentsBody } from '@common/interfaces/scan.interface';

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
const getScanByVideoAsync = async (video_id?: string): IAsyncPromiseResult<IScanInfo[]> => {
    rabbitMQ_sendDataAsync<IScanCommentsBody>(
        RABBIT_MQ_ENV,
           'scanCommentsAsync',
                {
                    videoId: video_id || '',
                }
    );

    return await [[]];
};

const getScanByChannelAsync = async (channel_id?: string, channel_url?: string): IAsyncPromiseResult<IScanInfo[]> => {
    return await allServices.statistic.getStatisticByChannelAsync(channel_id, channel_url);
};

const addYoutubeKey = async (email: string, key: string): IAsyncPromiseResult<void> => {
    const arg: IAddYoutubeKeyBody = {
        email,
        key,
    };
    rabbitMQ_sendDataAsync<IAddYoutubeKeyBody>(
        RABBIT_MQ_ENV,
        'addYoutubeKeyAsync',{
            email,
            key,
        }
    );
    return [,];
};

export const scan = {
    getScanByVideoAsync,
    getScanByChannelAsync,
    addYoutubeKey,
};
