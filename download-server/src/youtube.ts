import { google, youtube_v3 } from 'googleapis';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { AxiosError } from 'axios';
import { api } from './api.generated';
import { toQuery } from '@common/utils/to-query.util';
import { ILogger } from '@common/utils/create-logger.utils';

let _youtubeInstance: youtube_v3.Youtube | undefined;

export async function getYoutube(oldKey:string | undefined, logger: ILogger): IAsyncPromiseResult<youtube_v3.Youtube | undefined > {
    if (oldKey || !_youtubeInstance) {
        _youtubeInstance = undefined;        
        const [key, keyError] = await toQuery(() => api.keyActiveGet({old_key: oldKey}));
        if (keyError) {
            return [, 'can not find valid youtube key ' + keyError?.message]

        }
        logger.log('youtube key', key?.data)
        if(key?.data.youtube_key.length) {
            _youtubeInstance = google.youtube({
                version: 'v3',
                auth: key?.data.youtube_key || '',
            });
        }
    }
   
    return [_youtubeInstance];

}

export async function processYoutubeErrorAsync(youtubeError: AxiosError , logger: ILogger ): IAsyncPromiseResult<any> {
    // youtube error Permission denied: Consumer 'api_key:AIzaSyCjWKCsfOwQItGPfrZ80uANaD3-JgU3eIY' has been suspended.
    logger.log('youtube error', youtubeError.message)
    if(youtubeError && !youtubeError?.message?.includes('has disabled comments') ) {
        logger.log('request new youtube key')
        const oldKey = _youtubeInstance?.youtube.context._options.auth
        await getYoutube(oldKey as string, logger);
        return [, 'youtube quota oldKey = ' + oldKey]
    }
    return [, youtubeError?.message]
    

}