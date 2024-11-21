import { google, youtube_v3, } from 'googleapis';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { AxiosError, } from 'axios';
import { api, } from './api.generated';
import { toQuery, } from '@common/utils/to-query.util';
import { ILogger, } from '@common/utils/create-logger.utils';
import { resolveWithDealyAsync, } from '@common/utils/resolve-with-delay.util';

let _youtubeInstance: youtube_v3.Youtube | undefined;

export async function getYoutube(oldKey:string | undefined, oldStatus: string | undefined, logger: ILogger): IAsyncPromiseResult<youtube_v3.Youtube | undefined > {
    if (oldKey || !_youtubeInstance) {
        _youtubeInstance = undefined;     
        logger.log('start request new youtube key oldKey ', oldKey, 'oldStatus', oldStatus)   
        const [key, keyError] = await toQuery(() => api.keyActiveGet({old_key: oldKey, old_status: oldStatus }));
        if (keyError) {
            return await resolveWithDealyAsync( [, 'can not find valid youtube key ' + keyError?.message],10*1000, logger)

        }
        logger.log('youtube key', key?.data)
        if(key?.data.youtube_key.length) {
            // eslint-disable-next-line require-atomic-updates
            _youtubeInstance = google.youtube({
                version: 'v3',
                auth: key?.data.youtube_key || '',
            });
        }
    }
    const key = _youtubeInstance?.youtube?.context?._options?.auth
   logger.log('youtubeKey', key)
    return [_youtubeInstance];

}

export async function processYoutubeErrorAsync<T>(youtubeError: AxiosError , logger: ILogger ): IAsyncPromiseResult<T> {
    // youtube error Permission denied: Consumer 'api_key:AIzaSyCjWKCsfOwQItGPfrZ80uANaD3-JgU3eIY' has been suspended.
    const msg = String(youtubeError || '');
    logger.log('youtube error', msg)
    if(msg.includes('parameter could not be found')) {
        return [{items:[], total:0} as T] 
    }
    else if(msg.includes('has disabled comments')) {
        return [{items:[], total:0} as T]
    }
    else {
        logger.log('request new youtube key', youtubeError)
        let status = 'active';
        if(msg.includes('suspended')) {
            status = 'suspended'
        }
        logger.log('new youtube key status', status)
        const oldKey = _youtubeInstance?.youtube.context._options.auth
        await getYoutube(oldKey as string, status, logger);
        
        return await resolveWithDealyAsync([, 'youtube quota oldKey = ' + oldKey],10*1000, logger);
    }

}

export  function isQuotaError<T>(youtubeError: AxiosError , logger: ILogger ): boolean {
    // youtube error Permission denied: Consumer 'api_key:AIzaSyCjWKCsfOwQItGPfrZ80uANaD3-JgU3eIY' has been suspended.
    const msg = String(youtubeError || '');
    logger.log('youtube error', msg)
    if(msg.includes('youtube quota')) {
       return true;
    }
   return false;

}