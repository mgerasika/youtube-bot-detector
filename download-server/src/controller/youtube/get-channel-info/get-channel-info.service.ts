import { AxiosError } from 'axios';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { toQuery } from '@common/utils/to-query.util';
import { getYoutube, processYoutubeErrorAsync } from '@server/youtube';
import { ILogger } from '@common/utils/create-logger.utils';
import { groupArray } from '@common/utils/group-array.util';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';

export interface IGetChannelInfoBody {
    channelId: string;
}

// TODO add support string | null in code generator.
export interface IChannelInfo {
    channelId: string;
    publishedAt: string;
    photo?: string;
    title: string;
    authorUrl?: string;
    viewCount?: string;
    subscriberCount?: string;
    hasHiddenSubscriberCount?: boolean;
    videoCount?: string;
}

export const getChannelInfoAsync = async (
    body: IGetChannelInfoBody,
    logger: ILogger,
): IAsyncPromiseResult<IChannelInfo[] | undefined> => {
    logger.log('getChannelInfoAsync start', body)

    const [youtube, youtubeError] = await getYoutube(undefined, logger);
    if (!youtube || youtubeError) {
        return [, youtubeError];
    }

    const [response, responseError] = await toQuery(() =>
        youtube.channels.list({
            part: [
                //  'auditDetails', DONT HAVE PERMISSION
                // 'brandingSettings',
                // 'contentDetails',
                // 'contentOwnerDetails',
                'id',
                // 'localizations',
                'snippet',
                'statistics',
                'status',
                // 'topicDetails',
            ],
            id: body.channelId.includes(',') ? body.channelId.split(',') : [body.channelId || ''],
        }),
    );

    if (responseError) {
        return await processYoutubeErrorAsync(responseError as AxiosError, logger);
    }

    if (response?.data.items && response.data.items.length > 0) {
        const res = response.data.items.map((channel): IChannelInfo => {
            return {
                title: channel.snippet?.title || '',
                channelId: channel.id || '',
                publishedAt: channel.snippet?.publishedAt || '',
                authorUrl: channel.snippet?.customUrl || '',
                viewCount: channel.statistics?.videoCount || undefined,
                subscriberCount: channel.statistics?.subscriberCount || undefined,
                hasHiddenSubscriberCount: channel.statistics?.hiddenSubscriberCount || undefined,
                videoCount: channel.statistics?.videoCount || undefined,
                photo: channel.snippet?.thumbnails?.medium?.url || undefined,
            };
        });
        return [res];
    } else {
        logger.log('No channel found for the provided name, probadly deleted');
        // implement this https://www.youtube.com/channel/UC-gIX2RdnTumzuxmMWPo0uw
    }
    logger.log('getChannelInfoAsync end')
    return [,];
};
