import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { google, youtube_v3 } from 'googleapis';
import { AxiosError, AxiosResponse } from 'axios';
import { ENV } from '@server/constants/env';
import { allServices } from '@server/controller/all-services';
import { IAsyncPromiseResult } from '@server/interfaces/async-promise-result.interface';
import { toQuery } from '@server/utils/to-query.util';
import { getYoutube, processYoutubeErrorAsync } from '@server/youtube';

export interface IGetChannelInfoBody {
    channelId: string;
}

// TODO add support string | null in code generator.
export interface IShortChennelInfo {
    channelId: string;
    publishedAt: string;
    photo?: string;
    title: string;
    authorUrl?: string;
    viewCount?: string;
    subscriberCount?: string;
    hiddenSubscriberCount?: boolean;
    videoCount?: string;
}

export const getChannelInfoAsync = async (body: IGetChannelInfoBody): IAsyncPromiseResult<IShortChennelInfo> => {
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
            hiddenSubscriberCount: channel.statistics?.hiddenSubscriberCount || undefined,
            videoCount: channel.statistics?.videoCount || undefined,
            photo: channel.snippet?.thumbnails?.medium?.url || undefined,
        }];
    } else {
        console.log('No channel found for the provided name');
    }

    return [, 'error in getChannelInfoAsync']
}
