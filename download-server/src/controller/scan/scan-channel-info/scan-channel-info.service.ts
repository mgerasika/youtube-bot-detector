import { ENV } from '@server/env';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import { toQuery } from '@common/utils/to-query.util';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { nameOf } from '@common/utils/name-of';
import { scan } from '../services';
import { getChannelInfoAsync } from '@server/controller/youtube/get-channel-info/get-channel-info.service';
import { IScanChannelInfoBody, IScanVideosBody } from '@common/interfaces/scan.interface';




export const scanChannelInfoAsync = async (body: IScanChannelInfoBody): IAsyncPromiseResult<void> => {
    const [data,error] = await getChannelInfoAsync({channelId: body.channelId});

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
            rabbitMQ_sendDataAsync({
                channelName: ENV.rabbit_mq_channel_name,
                rabbit_mq_url: ENV.rabbit_mq_url,
                redis_url: ENV.redis_url
            }, {msg:{methodName:  nameOf<typeof scan>('scanVideosAsync'), methodArgumentsJson: arg}})
        }
    }

    return [,error];
};