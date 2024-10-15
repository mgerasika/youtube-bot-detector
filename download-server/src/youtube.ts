import { google, youtube_v3 } from 'googleapis';
import { IAsyncPromiseResult } from './interfaces/async-promise-result.interface';
import { AxiosError } from 'axios';
import { api } from './api.generated';
import { toQuery } from './utils/to-query.util';

let _youtubeInstance: youtube_v3.Youtube | undefined;

export async function getYoutube(newKey?:boolean): Promise<youtube_v3.Youtube> {
    if (newKey || !_youtubeInstance) {
        
        const [key, keyError] = await toQuery(() => api.keyActiveGet());
        if (keyError) {
            console.log('error get key');
        }
        console.log('youtube key', key?.data)
        _youtubeInstance = google.youtube({
            version: 'v3',
            auth: key?.data.youtube_key || '',
        });
    }

    return _youtubeInstance as youtube_v3.Youtube;

}

export async function processYoutubeErrorAsync(youtubeError: AxiosError | Error | undefined | string): IAsyncPromiseResult<any> {
    if(youtubeError ) {
        console.log('youtube quota')
        await getYoutube(true);
        return [, 'youtube quota']
    }
    return [, youtubeError]
    

}