import { IAsyncPromiseResult } from '@server/interfaces/async-promise-result.interface';
import { api, IStatistic } from '@server/api.generated';
import { toQuery } from '@server/utils/to-query.util';
import { rabbitMQ_sendDataAsync } from '@server/utils/rabbit-mq';
import { nameOf } from '@server/utils/name-of';
import { IScanChannelInfoBody } from '../scan-channel-info/scan-channel-info.service';
import { scan } from '../services';

export interface IScanAuthorsBody {
    videoId?: string;
    channelId?: string;
}


export const scanAuthorsAsync = async (body: IScanAuthorsBody): IAsyncPromiseResult<void> => {
    const [items, error] = await getItemsAsync(body);
    if(error) {
        return [, error]
    }
    items?.map(statistic => {
        const arg: IScanChannelInfoBody = {
            channelId: statistic.author_id,
            scan_videos: false

        }
        rabbitMQ_sendDataAsync({msg:{methodName:  nameOf<typeof scan>('scanChannelInfoAsync'), methodArgumentsJson: arg}})
    })

    return [,error];
};

export const getItemsAsync = async (body: IScanAuthorsBody): IAsyncPromiseResult<IStatistic[]> => {
    if(body.videoId) {
        const [success, apiError] = await toQuery(() =>
            api.statisticByVideoGet({
                video_id: body.videoId
            }),
        );
        if(apiError) {
            return [, apiError]
        }
        return [success?.data || []];
    }
    if(body.channelId) {
        const [success, apiError] = await toQuery(() =>
            api.statisticByChannelGet({
                channel_id: body.channelId
            }),
        );
        if(apiError) {
            return [, apiError]
        }
        return [success?.data || []];
    }
    return [[]];

};