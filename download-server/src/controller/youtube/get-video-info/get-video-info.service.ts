import { AxiosError, } from 'axios';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { toQuery, } from '@common/utils/to-query.util';
import { getYoutube, processYoutubeErrorAsync, } from '@server/youtube';
import { ILogger, } from '@common/utils/create-logger.utils';
import { IShortVideoInfo, } from '../get-videos/get-videos.service';

export interface IGetVideoInfoBody {
    videoId: string;
}


export const getVideoInfoAsync = async (body: IGetVideoInfoBody, logger: ILogger): IAsyncPromiseResult<IShortVideoInfo | undefined> => {
    logger.log('getVideoInfoAsync start', body)
    const [youtube, youtubeError] = await getYoutube(undefined,undefined, logger);
    if(!youtube || youtubeError) {
        return [, youtubeError];
    }
    
    logger.log('before request video info in youtube', body.videoId)
    const [response, responseError] = await toQuery(() => youtube.videos.list({
        part: [
            'id',
            'snippet',
            'statistics',
            'status',
        ],
        id: [body.videoId || ''],
    }));
    logger.log('after request video info in youtube')
    if (responseError) {
       return await processYoutubeErrorAsync(responseError as AxiosError, logger);
    }
    logger.log('youtube response', response?.data)
    if (response?.data.items && response.data.items.length > 0) {
        const item = response.data.items[0];
        return [{
            title: item.snippet?.title || '',
            videoId: item?.id || '',
            publishedAt: new Date(item.snippet?.publishedAt || ''),
            channelId: item.snippet?.channelId || '',
            privacyStatus: item.status?.privacyStatus || '',
        }];
    } else {
        logger.log('No video found for the provided name');
        // implement this https://www.youtube.com/channel/UC-gIX2RdnTumzuxmMWPo0uw
    }

    logger.log('getVideoInfoAsync end')

    return [undefined]
}
