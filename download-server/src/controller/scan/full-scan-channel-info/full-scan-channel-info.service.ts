import { ENV, RABBIT_MQ_ENV } from '@server/env';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import { toQuery } from '@common/utils/to-query.util';
import {  rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { allServices } from '@server/controller/all-services';
import { ILogger } from '@common/utils/create-logger.utils';
import { IFullScanChannelInfoBody, IFullScanVideoInfoBody, IScanVideosBody } from '@common/model';
import { IScanReturn } from '@common/interfaces/scan.interface';

// 1. scan channel by id. start rabbit mq queue with scanVideosByChannelId
export const fullScanChannelInfoAsync = async (
    body: IFullScanChannelInfoBody,
    logger: ILogger,
): IAsyncPromiseResult<IScanReturn> => {
    logger.log('fullScanChannelInfoAsync start',body);
    const [data, error] = await allServices.youtube.getChannelInfoAsync({ channelId: body.channelId }, logger);

    if(error) {
        return [, logger.log('error on fullScan', error)]
    }
    if(!data) {
        return [, logger.log('data is null on fullScan', data)]
    }
    const channels = data.map((channel) => {
        return {
            published_at: new Date(channel.publishedAt),
            id: channel.channelId,
            title: channel.title,
            author_url: channel.authorUrl || '',
            subscriber_count: +(channel.subscriberCount || 0),
            video_count: +(channel.videoCount || 0),
            view_count: +(channel.viewCount || 0),
        };
    });
    const [success, apiError] = await toQuery(() => api.channelPost({ channels }));
    if (apiError) {
        return [, apiError];
    }
    if (success) {
        rabbitMQ_sendDataAsync<IScanVideosBody>(
            RABBIT_MQ_ENV,
            'scanVideosAsync',
            {
                channelId: body.channelId,
            },
            logger,
        );
    }


    logger.log('fullScanChannelInfoAsync end');
    return [{},];
};
