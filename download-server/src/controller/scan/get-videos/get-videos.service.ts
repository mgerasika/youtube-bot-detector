import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { google, youtube_v3 } from 'googleapis';
import { AxiosResponse } from 'axios';
import { ENV } from '@server/constants/env';
import { IAsyncPromiseResult } from '@server/interfaces/async-promise-result.interface';
import { allServices } from '@server/controller/all-services';
import { ICollection } from '@server/interfaces/collection';

export interface IGetVideosBody {
    channelName: string;
}
export interface IShortVideoInfo {
  title: string;
  videoId: string;
  publishedAt: string;
}
export const getVideosAsync = async (body: IGetVideosBody) : IAsyncPromiseResult<ICollection<IShortVideoInfo>>=> {
    const [channelId, channelIdError] = await allServices.scan.getChannelIdAsync(body.channelName);
    if(channelIdError) {
        return [, channelIdError];
    }
    const videos = await requestGetChannelVideosAsync(channelId || '');
    if(!videos) {
        return [,'videos not found']
    }
    return [videos]
};

const youtube = google.youtube({
    version: 'v3',
    auth: ENV.youtube_key,
});


async function requestGetChannelVideosAsync(channelId: string): Promise<ICollection<IShortVideoInfo> | undefined> {
    try {
        // Get the channel's uploads playlist ID
        const channelResponse = await youtube.channels.list({
            part: ['contentDetails'],
            id: [channelId],
        });

        if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
            console.log('No channel found');
            return;
        }

        // "uploads": "PL_uploads_playlist_id",
        // "likes": "PL_likes_playlist_id",
        // "favorites": "PL_favorites_playlist_id"  // if applicable
        const uploadsPlaylistId = channelResponse.data.items[0].contentDetails?.relatedPlaylists?.uploads;

        if (!uploadsPlaylistId) {
            console.log('No uploads playlist found');
            return;
        }

        const groupVideos = [];
        let nextPageToken = undefined;
        do {
            // Fetch the videos from the uploads playlist
            const playlistItemsResponse = await youtube.playlistItems.list({
                part: ['snippet', 'id'],
                playlistId: uploadsPlaylistId,
                maxResults: 50, // Max is 50
                pageToken: nextPageToken
            }) as AxiosResponse<youtube_v3.Schema$PlaylistItemListResponse>;

            if (!playlistItemsResponse.data.items || playlistItemsResponse.data.items.length === 0) {
                console.log('No videos found');
                return;
            }

            const videos = playlistItemsResponse.data.items.map((item: youtube_v3.Schema$PlaylistItem): IShortVideoInfo => {
                return {
                    title: item.snippet?.title || '',
                    videoId: item.snippet?.resourceId?.videoId || '',
                    publishedAt: item.snippet?.publishedAt || '',
                } ;
            });
            groupVideos.push(videos);
            nextPageToken = playlistItemsResponse.data.nextPageToken;
        } while (nextPageToken);
        const allVideos = groupVideos.flat() as IShortVideoInfo[];
        return {
            total: allVideos.length,
            items: allVideos
        }
    } catch (error) {
        console.error('Error fetching channel videos:', error);
    }
}
