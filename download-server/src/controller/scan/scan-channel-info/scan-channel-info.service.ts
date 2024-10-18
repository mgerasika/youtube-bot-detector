import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { google, youtube_v3 } from 'googleapis';
import { AxiosResponse } from 'axios';
import { ENV } from '@server/constants/env';
import { allServices } from '@server/controller/all-services';
import { IAsyncPromiseResult } from '@server/interfaces/async-promise-result.interface';
import { api, IChannelDto } from '@server/api.generated';
import { toQuery } from '@server/utils/to-query.util';
import { rabbitMQ_sendDataAsync } from '@server/rabbit-mq';
import { IScanVideosBody } from '../scan-videos/scan-videos.service';
import { nameOf } from '@server/utils/name-of';

export interface IScanChannelInfoBody {
    channelId: string;
    scan_videos: boolean;
}


export const scanChannelInfoAsync = async (body: IScanChannelInfoBody): IAsyncPromiseResult<void> => {
    const [data,error] = await allServices.youtube.getChannelInfoAsync({channelId: body.channelId});

    if (data) {
        const [success, apiError] = await toQuery(() =>
            api.channelPost({
                published_at: new Date(data.publishedAt),
                id: data.channelId,
                title: data.title,
                author_url: data.authorUrl || '',
                subscriber_count: +(data.subscriberCount || 0),
                video_count: +(data.videoCount || 0),
                viewCount: +(data.viewCount || 0),
            }),
        );
        if(apiError) {
            return [, apiError]
        }
        if(success && body.scan_videos) {
            const arg: IScanVideosBody = {
                channelId: body.channelId
            }
            rabbitMQ_sendDataAsync({msg:{methodName:  nameOf<typeof allServices.scan>('scanVideosAsync'), methodArgumentsJson: arg}})
        }
    }

    return [,error];
};