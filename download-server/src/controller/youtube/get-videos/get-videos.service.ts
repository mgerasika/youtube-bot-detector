import {  youtube_v3 } from 'googleapis';
import { AxiosError, AxiosResponse } from 'axios';
import { ENV } from '@server/env';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { ICollection } from '@common/interfaces/collection';
import { toQuery } from '@common/utils/to-query.util';
import { getYoutube, processYoutubeErrorAsync } from '@server/youtube';

export interface IGetVideosBody {
    channelId: string;
    publishedAt: string;
}
export interface IShortVideoInfo {
    title: string;
    videoId: string;
    publishedAt: Date;
    channelId: string;
    privacyStatus: string;
}

export const getVideosAsync = async ({channelId, publishedAt}: IGetVideosBody): IAsyncPromiseResult<ICollection<IShortVideoInfo>> => {
    const [youtube, youtubeError] = await getYoutube();
    if(!youtube || youtubeError) {
        return [, youtubeError];
    }
    
    const publishedAtDate = publishedAt ? new Date(publishedAt) : new Date(1970);
    console.log('publishedAtDate', publishedAtDate, publishedAt)

    // Get the channel's uploads playlist ID
    const [channelResponse, channelError] = await toQuery(() => youtube.channels.list({
        part: ['contentDetails'],
        id: [channelId || '' ],
    }));

    
    if (channelError) {
        return await processYoutubeErrorAsync(channelError as AxiosError);
    }

    if (!channelResponse?.data.items || channelResponse.data.items.length === 0) {
        return [, 'No channel found'];
    }

    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
        return [, 'No uploads playlist found'];
    }

    const groupVideos = [];
    let nextPageToken: string | null | undefined = undefined;

    do {
        // Fetch the videos from the uploads playlist
        const [playlistItemsResponse, playListError] = await toQuery(() => youtube.playlistItems.list({
            part: ['snippet', 'id', 'status'],
            playlistId: uploadsPlaylistId,
            maxResults: 50, // Max is 50
            ...(nextPageToken ? { pageToken: nextPageToken } : undefined)
        }));

        if (playListError) {
            return await processYoutubeErrorAsync(playListError as AxiosError);
        }

        if (!playlistItemsResponse?.data.items || playlistItemsResponse.data.items.length === 0) {
            return [, 'No videos found'];
        }

        const videoIds = playlistItemsResponse.data.items.map(item => item.snippet?.resourceId?.videoId || '' )
        // const [videoStatisticItems, statError] = await getVideoStatsisticItems(videoIds);
        // if(statError) {
        //     return [,statError];
        // }
        const videos = playlistItemsResponse.data.items.map((item: youtube_v3.Schema$PlaylistItem): IShortVideoInfo => {
            // const videoStatistic = videoStatisticItems?.find(v => v.id === item.snippet?.resourceId?.videoId)
            return {
                title: item.snippet?.title || '',
                videoId: item.snippet?.resourceId?.videoId || '',
                publishedAt: new Date(item.snippet?.publishedAt || ''),
                channelId: channelId || '',
                privacyStatus: item.status?.privacyStatus || '',
            };
        }).filter(item => item.privacyStatus === 'public');

        if (true || videos.some(item => item.publishedAt > publishedAtDate)) {
            nextPageToken = playlistItemsResponse.data.nextPageToken;
        }
        else {
            nextPageToken = undefined;
        }
        // videos = videos.filter(item => item.publishedAt > publishedAtDate);
        groupVideos.push(videos);


    } while (nextPageToken);
    const allVideos = groupVideos.flat() as IShortVideoInfo[];
    return [{
        total: allVideos.length,
        items: allVideos
    }]
}

async function getVideoStatsisticItems(videoIds:string[]): IAsyncPromiseResult<youtube_v3.Schema$Video[]> {
    const [youtube, youtubeError] = await getYoutube();
    if(!youtube || youtubeError) {
        return [, youtubeError];
    }

    const [res, error] = await toQuery( () => youtube.videos.list({
      part: ['statistics'],
      id: videoIds,
    }));

    if (error) {
        return await processYoutubeErrorAsync(error as AxiosError);
    }

    return [res?.data?.items || []]
  }
