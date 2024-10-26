import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api, IStatistic } from '@server/api.generated';
import { toQuery } from '@common/utils/to-query.util';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { nameOf } from '@common/utils/name-of';
import { scan } from '../services';
import { ENV, RABBIT_MQ_ENV } from '@server/env';
import { IScanAuthorsBody, IScanChannelInfoBody } from '@common/interfaces/scan.interface';


export const scanAuthorsAsync = async (body: IScanAuthorsBody): IAsyncPromiseResult<string> => {
    const [items, error] = await getItemsAsync(body);
    if (error) {
        return [, error]
    }
    items?.map(statistic => {
        rabbitMQ_sendDataAsync<IScanChannelInfoBody>(
            RABBIT_MQ_ENV,
            'scanChannelInfoAsync',{
                channelId: statistic.author_id,
                scan_videos: false
            })
    })

    return [, error];
};

export const getItemsAsync = async (body: IScanAuthorsBody): IAsyncPromiseResult<IStatistic[]> => {
    if (body.videoId) {
        const [success, apiError] = await toQuery(() =>
            api.statisticByVideoGet({
                video_id: body.videoId
            }),
        );
        if (apiError) {
            return [, apiError]
        }
        return [success?.data || []];
    }
    if (body.channelId) {
        const [success, apiError] = await toQuery(() =>
            api.statisticByChannelGet({
                channel_id: body.channelId
            }),
        );
        if (apiError) {
            return [, apiError]
        }
        return [success?.data || []];
    }
    return [[]];

};