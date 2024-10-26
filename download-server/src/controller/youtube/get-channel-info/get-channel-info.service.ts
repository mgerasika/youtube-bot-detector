import { AxiosError } from 'axios';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { toQuery } from '@common/utils/to-query.util';
import { getYoutube, processYoutubeErrorAsync } from '@server/youtube';

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

export const getChannelInfoAsync = async (body: IGetChannelInfoBody): IAsyncPromiseResult<IChannelInfo> => {
    const [youtube, youtubeError] = await getYoutube();
    if(!youtube || youtubeError) {
        return [, youtubeError];
    }
    
    // Search for the channel based on the custom name or username
    const [response, responseError] = await toQuery(() => youtube.channels.list({
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
        id: [body.channelId || ''],
    }));

    if (responseError) {
       return await processYoutubeErrorAsync(responseError as AxiosError);
    }

    if (response?.data.items && response.data.items.length > 0) {
        const channel = response.data.items[0];
        return [{
            title: channel.snippet?.title || '',
            channelId: channel.id || '',
            publishedAt: channel.snippet?.publishedAt || '',
            authorUrl: channel.snippet?.customUrl || '',
            viewCount: channel.statistics?.videoCount || undefined,
            subscriberCount: channel.statistics?.subscriberCount || undefined,
            hasHiddenSubscriberCount: channel.statistics?.hiddenSubscriberCount || undefined,
            videoCount: channel.statistics?.videoCount || undefined,
            photo: channel.snippet?.thumbnails?.medium?.url || undefined,
        }];
    } else {
        console.log('No channel found for the provided name');
    }

    return [, 'error in getChannelInfoAsync']
}
