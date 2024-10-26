import { ENV, RABBIT_MQ_ENV } from '@server/env';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import { toQuery } from '@common/utils/to-query.util';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { getChannelInfoAsync } from '@server/controller/youtube/get-channel-info/get-channel-info.service';
import { IFullScanChannelInfoBody, IScanVideosBody } from '@common/interfaces/scan.interface';

export const fullScanChannelInfoAsync = async (body: IFullScanChannelInfoBody): IAsyncPromiseResult<string> => {
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
        if(success) {
            
            rabbitMQ_sendDataAsync<IScanVideosBody>(RABBIT_MQ_ENV, 'scanVideosAsync',{
                channelId: body.channelId
            })
        }
    }

    return [,error];
};