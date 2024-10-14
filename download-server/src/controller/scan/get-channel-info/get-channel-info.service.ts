import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { google, youtube_v3 } from 'googleapis';
import { AxiosResponse } from 'axios';
import { ENV } from '@server/constants/env';
import { allServices } from '@server/controller/all-services';
import { IAsyncPromiseResult } from '@server/interfaces/async-promise-result.interface';

export interface IGetChannelInfoBody {
    channelName: string;
}

// TODO add support string | null in code generator.
export interface IShortChennelInfo {
    channelId: string;
    publishedAt: string;
    photo?: string;
    title: string;
    customUrl?: string;
    viewCount?: string ;
    subscriberCount?: string ;
    hiddenSubscriberCount?: boolean ;
    videoCount?: string ;
}

export const getChannelInfoAsync = async (body: IGetChannelInfoBody): IAsyncPromiseResult<IShortChennelInfo> => {
    const [channelId, channelIdError] = await allServices.scan.getChannelIdAsync(body.channelName);
    if (channelIdError) {
        return [, channelIdError];
    }
    const channelIinfo = await requestGetChanneInfoAsync(channelId || '');
    if (!channelIinfo) {
        return [, 'channel info not found'];
    }
    return [channelIinfo];
};

const youtube = google.youtube({
    version: 'v3',
    auth: ENV.youtube_key,
});

async function requestGetChanneInfoAsync(channelId: string): Promise<IShortChennelInfo | undefined | null> {
    try {
        // Search for the channel based on the custom name or username
        const response = await youtube.channels.list({
            part: [
                //  'auditDetails', DONT HAVE PERMISSION
                'brandingSettings',
                'contentDetails',
                'contentOwnerDetails',
                'id',
                'localizations',
                'snippet',
                'statistics',
                'status',
                'topicDetails',
            ],
            id: [channelId],
        });

        if (response.data.items && response.data.items.length > 0) {
            const channel = response.data.items[0];
            return {
                title: channel.snippet?.title || '',
                channelId: channel.id || '',
                publishedAt: channel.snippet?.publishedAt || '',
                customUrl: channel.snippet?.customUrl || '',
                viewCount: channel.statistics?.videoCount || undefined,
                subscriberCount: channel.statistics?.subscriberCount || undefined,
                hiddenSubscriberCount: channel.statistics?.hiddenSubscriberCount || undefined,
                videoCount: channel.statistics?.videoCount || undefined,
                photo: channel.snippet?.thumbnails?.medium?.url || undefined,
            };
        } else {
            console.log('No channel found for the provided name');
        }
    } catch (error) {
        console.error('Error fetching channel ID:', error);
    }
}
