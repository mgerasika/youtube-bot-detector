import { ENV } from '@server/env';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import { toQuery } from '@common/utils/to-query.util';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { getChannelInfoAsync } from '@server/controller/youtube/get-channel-info/get-channel-info.service';
import { IScanChannelInfoBody, IScanVideosBody } from '@common/interfaces/scan.interface';

export const scanChannelInfoAsync = async (body: IScanChannelInfoBody): IAsyncPromiseResult<string> => {
    const [info, channelError] = await toQuery(() => api.channelIdGet(body.channelId))
    if(channelError) {
        return [, channelError];
    }
    if(info?.data?.id === body.channelId) {
        return ['already exist in database, skip ' + body.channelId]
    }
    const [data,error] = await getChannelInfoAsync({channelId: body.channelId});

    if (data) {
        const [, apiError] = await toQuery(() =>
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
    }

    return [,error];
};