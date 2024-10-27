import { google, youtube_v3 } from 'googleapis';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { AxiosError } from 'axios';
import { api } from './api.generated';
import { toQuery } from '@common/utils/to-query.util';
import { ILogger } from '@common/utils/create-logger.utils';

let _youtubeInstance: youtube_v3.Youtube | undefined;

export async function getYoutube(oldKey:string | undefined, logger: ILogger): IAsyncPromiseResult<youtube_v3.Youtube > {
    if (oldKey || !_youtubeInstance) {
        _youtubeInstance = undefined;        
        const [key, keyError] = await toQuery(() => api.keyActiveGet({old_key: oldKey}));
        if (keyError) {
            return [,keyError]

        }
        logger.log('youtube key', key?.data)
        _youtubeInstance = google.youtube({
            version: 'v3',
            auth: key?.data.youtube_key || '',
        });
    }
    return [_youtubeInstance as youtube_v3.Youtube];

}

export async function processYoutubeErrorAsync(youtubeError: AxiosError , logger: ILogger ): IAsyncPromiseResult<any> {
    if(youtubeError && !youtubeError?.message?.includes('has disabled comments') ) {
        logger.log('youtube quota error', youtubeError.message)
        const oldKey = _youtubeInstance?.youtube.context._options.auth
        await getYoutube(oldKey as string, logger);
        return [, 'youtube quota oldKey = ' + oldKey]
    }
    return [, youtubeError?.message]
    

}