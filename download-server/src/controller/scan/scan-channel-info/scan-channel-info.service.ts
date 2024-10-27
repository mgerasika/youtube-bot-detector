import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import { toQuery } from '@common/utils/to-query.util';
import { IScanChannelInfoBody } from '@common/interfaces/scan.interface';
import { allServices } from '@server/controller/all-services';
import { createLogger, ILogger } from '@common/utils/create-logger.utils';

// redis expiration should be max value (several years I think)
export const scanChannelInfoAsync = async (body: IScanChannelInfoBody, logger: ILogger): IAsyncPromiseResult<string> => {
    const [info, channelError] = await toQuery(() => api.channelIdGet(body.channelId));
    if (channelError) {
        // probadly not found, then add
        const [data, error] = await allServices.youtube.getChannelInfoAsync({ channelId: body.channelId }, logger);
        if (error) {
            return [, error];
        }

        if(data === undefined) {
            return ['Channel not found, probadly deleted'];
        }
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
            if (apiError) {
                return [, apiError];
            }
        }

        return [, error];
    } else if (info?.data?.id === body.channelId) {
        return ['already exist in database, skip ' + body.channelId];
    }

    return [''];
};
