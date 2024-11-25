import { google, youtube_v3, } from 'googleapis';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { AxiosError, } from 'axios';
import { api, } from './api.generated';
import { toQuery, } from '@common/utils/to-query.util';
import { ILogger, } from '@common/utils/create-logger.utils';
import { resolveWithDealyAsync, } from '@common/utils/resolve-with-delay.util';
import { GaxiosPromise } from 'googleapis/build/src/apis/abusiveexperiencereport';

let _youtubeInstance: youtube_v3.Youtube | undefined;
let _quota = 0;
interface IYoutubeReturn {
    channels: {
        list: (args: youtube_v3.Params$Resource$Channels$List) => GaxiosPromise<youtube_v3.Schema$ChannelListResponse>,
    },
    commentThreads: {
        list: (args: youtube_v3.Params$Resource$Commentthreads$List) => GaxiosPromise<youtube_v3.Schema$CommentThreadListResponse>,
    }
    videos: {
        list: (args: youtube_v3.Params$Resource$Videos$List) => GaxiosPromise<youtube_v3.Schema$VideoListResponse>,
    },
    playlistItems: {
        list: (args: youtube_v3.Params$Resource$Playlistitems$List) => GaxiosPromise<youtube_v3.Schema$PlaylistItemListResponse>,
    },
}

// Custom fetch implementation with timeout
const fetchWithTimeout = (url: RequestInfo, options: RequestInit, timeout: number = 10000): Promise<any> => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
      ),
    ]);
  };

async function getYoutubeInstanceAsync(oldKey: string | undefined, oldStatus: string | undefined, logger: ILogger): IAsyncPromiseResult<youtube_v3.Youtube | undefined> {
    if (oldKey || !_youtubeInstance) {
        _youtubeInstance = undefined;
        logger.log('start request new youtube key oldKey ', oldKey, 'oldStatus', oldStatus, ' oldquota = ', _quota)
        const [key, keyError] = await toQuery(() => api.keyActiveGet({ old_key: oldKey, old_status: oldStatus }));
        if (keyError) {
            return await resolveWithDealyAsync([, 'can not find valid youtube key ' + keyError?.message], 30 * 1000, logger)

        }
        logger.log('youtube key =', key?.data, ' quota = ' + _quota)
        if (key?.data.youtube_key.length) {
            logger.log('reset youtube quota', _quota)
            _quota = 0;
            // eslint-disable-next-line require-atomic-updates
            _youtubeInstance = google.youtube({
                version: 'v3',
                auth: key?.data.youtube_key || '',
                fetchImplementation: (url, options) => fetchWithTimeout(url, options as RequestInit, 10000),
            });

            logger.log('found new youtube key, but resolve with delay')
            return await resolveWithDealyAsync([_youtubeInstance], 1000, logger);
        }
    }
    const key = _youtubeInstance?.youtube?.context?._options?.auth
    logger.log('youtubeKey', key, 'quota = ', _quota)

    if (!_youtubeInstance) {
        return [, 'empty ']
    }

    return [_youtubeInstance];

}

const RETRIES_COUNT = 3;
export async function getYoutubeApi(oldKey: string | undefined, oldStatus: string | undefined, logger: ILogger): IAsyncPromiseResult<IYoutubeReturn | undefined> {
    const res: IYoutubeReturn = {
        channels: {
            list: async (args) => {
                return await processRecursiveAsync(args, async (args) => {
                    const [youtube, error] = await getYoutubeInstanceAsync(oldKey, oldStatus, logger);
                    if (!youtube || error) {
                        throw 'youtube error ' + error;
                    }
                    _quota++;
                    logger.log('Increase quota, start call channels list youtube.v3 api quota = ', _quota)
                    return await youtube.channels.list(args)
                }, logger, RETRIES_COUNT)
            }
        },
        commentThreads: {
            list: async (args) => {
                return await processRecursiveAsync(args, async (args) => {
                    const [youtube, error] = await getYoutubeInstanceAsync(oldKey, oldStatus, logger);
                    if (!youtube || error) {
                        throw 'youtube error ' + error;
                    }
                    _quota++;
                    logger.log('Increase quota, start call commentThreads list youtube.v3 api i quota = ', _quota)
                    return await youtube.commentThreads.list(args)
                }, logger, RETRIES_COUNT)
            }
        },
        videos: {
            list: async (args) => {
                return await processRecursiveAsync(args, async (args) => {
                    const [youtube, error] = await getYoutubeInstanceAsync(oldKey, oldStatus, logger);
                    if (!youtube || error) {
                        throw 'youtube error ' + error;
                    }
                    _quota++;
                    logger.log('Increase quota, start call videos list youtube.v3 api i quota = ', _quota)
                    return await youtube.videos.list(args)
                }, logger, RETRIES_COUNT)
            }
        },
        playlistItems: {
            list: async (args) => {
                return await processRecursiveAsync(args, async (args) => {
                    const [youtube, error] = await getYoutubeInstanceAsync(oldKey, oldStatus, logger);
                    if (!youtube || error) {
                        throw 'youtube error ' + error;
                    }
                    _quota++;
                    logger.log('Increase quota, start call playlistItems list youtube.v3 api i quota = ', _quota)
                    return await youtube.playlistItems.list(args)
                }, logger, RETRIES_COUNT)
            }
        },
    }
    return [res];

}

type TCallback<TArg, TRet> = (args: TArg) => GaxiosPromise<TRet>;

const processRecursiveAsync = async <TArg, TRet>(
    arg: TArg,
    callback: TCallback<TArg, TRet>,
    logger: ILogger,
    retriesCount: number
): GaxiosPromise<TRet> => {
    logger.log('processRecursiveAsync start')
    const [response, youtubeError] = await toQuery(() => callback(arg));
    logger.log('processRecursiveAsync after callback')
    if (youtubeError) {
        const msg = String(youtubeError || '');
        logger.log('youtube error in processRecursive', msg)
        if (msg.includes('parameter could not be found') || msg.includes('has disabled comments')) {
            return {
                config: {},
                headers: {},
                request: {} as any,
                status: 200,
                statusText: '',
                data: {
                    items: [],
                    total: 0
                } as unknown as TRet
            }
        }
        //  Error: API key expired. Please renew the API key
        //  Error: Permission denied: Consumer 'api_key:AIzaSyD_-FxHLGdeTNxt4ytG-Ce8-vJPsmXMzNs' has been suspended.
        //  Error: The request cannot be completed because you have exceeded your <a href="/youtube/v3/getting-started#quota">quota</a>.
        else if (retriesCount > 0 && (msg.includes('>quota</a>') ||  msg.includes('key expired'))) {
            logger.log('request new youtube key', youtubeError, 'quota', _quota)
            let status = 'active';
            if (msg.includes('has been suspended')) {
                status = 'suspended'
            }
            logger.log('new youtube key status', status)
            const oldKey = _youtubeInstance?.youtube.context._options.auth
            const [, seccondError] = await getYoutubeInstanceAsync(oldKey as string, status, logger);
            if(seccondError) {
                throw seccondError;
            }

            return await processRecursiveAsync(arg, callback, logger, retriesCount--);
        }
        else {
            throw youtubeError;
        }

    }
    logger.log('processRecursiveAsync end')
    return response as unknown as GaxiosPromise<TRet>;
}


