import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { google, youtube_v3 } from 'googleapis';
import { AxiosResponse } from 'axios';
import { ENV } from '@server/constants/env';
import { allServices } from '@server/controller/all-services';
import { IAsyncPromiseResult } from '@server/interfaces/async-promise-result.interface';
import { api, IChannelDto, IStatistic } from '@server/api.generated';
import { toQuery } from '@server/utils/to-query.util';
import { rabbitMQ_sendDataAsync } from '@server/rabbit-mq';
import { IScanVideosBody } from '../scan-videos/scan-videos.service';
import { nameOf } from '@server/utils/name-of';
import { IScanChannelInfoBody } from '../scan-channel-info/scan-channel-info.service';

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
        rabbitMQ_sendDataAsync({msg:{methodName:  nameOf<typeof allServices.scan>('scanChannelInfoAsync'), methodArgumentsJson: arg}})
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