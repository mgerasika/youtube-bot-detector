import { google, youtube_v3, } from 'googleapis';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { AxiosError, } from 'axios';
import { api, } from './api.generated';
import { toQuery, } from '@common/utils/to-query.util';
import { ILogger, } from '@common/utils/create-logger.utils';
import { resolveWithDealyAsync, } from '@common/utils/resolve-with-delay.util';
import { GaxiosPromise } from 'googleapis/build/src/apis/abusiveexperiencereport';
import { Tracing } from 'trace_events';

let _youtubeInstance: youtube_v3.Youtube | undefined;
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

async function getYoutubeInstance(oldKey: string | undefined, oldStatus: string | undefined, logger: ILogger): IAsyncPromiseResult<youtube_v3.Youtube | undefined> {
    if (oldKey || !_youtubeInstance) {
        _youtubeInstance = undefined;
        logger.log('start request new youtube key oldKey ', oldKey, 'oldStatus', oldStatus)
        const [key, keyError] = await toQuery(() => api.keyActiveGet({ old_key: oldKey, old_status: oldStatus }));
        if (keyError) {
            return await resolveWithDealyAsync([, 'can not find valid youtube key ' + keyError?.message], 30 * 1000, logger)

        }
        logger.log('youtube key', key?.data)
        if (key?.data.youtube_key.length) {
            // eslint-disable-next-line require-atomic-updates
            _youtubeInstance = google.youtube({
                version: 'v3',
                auth: key?.data.youtube_key || '',
            });
        }
    }
    const key = _youtubeInstance?.youtube?.context?._options?.auth
    logger.log('youtubeKey', key)

    if (!_youtubeInstance) {
        return [, 'empty ']
    }

    return [_youtubeInstance];

}

const RETRIES_COUNT = 10;
export async function getYoutubeApi(oldKey: string | undefined, oldStatus: string | undefined, logger: ILogger): IAsyncPromiseResult<IYoutubeReturn | undefined> {
    const res: IYoutubeReturn = {
        channels: {
            list: async (args) => {
                return processRecursiveAsync(args, async (args) => {
                    const [youtube, error] = await getYoutubeInstance(oldKey, oldStatus, logger);
                    if (!youtube || error) {
                        throw 'youtube error ' + error;
                    }
                    return youtube.channels.list(args)
                }, logger, RETRIES_COUNT)
            }
        },
        commentThreads: {
            list: async (args) => {
                return processRecursiveAsync(args, async (args) => {
                    const [youtube, error] = await getYoutubeInstance(oldKey, oldStatus, logger);
                    if (!youtube || error) {
                        throw 'youtube error ' + error;
                    }
                    return youtube.commentThreads.list(args)
                }, logger, RETRIES_COUNT)
            }
        },
        videos: {
            list: async (args) => {
                return processRecursiveAsync(args, async (args) => {
                    const [youtube, error] = await getYoutubeInstance(oldKey, oldStatus, logger);
                    if (!youtube || error) {
                        throw 'youtube error ' + error;
                    }
                    return youtube.videos.list(args)
                }, logger, RETRIES_COUNT)
            }
        },
        playlistItems: {
            list: async (args) => {
                return processRecursiveAsync(args, async (args) => {
                    const [youtube, error] = await getYoutubeInstance(oldKey, oldStatus, logger);
                    if (!youtube || error) {
                        throw 'youtube error ' + error;
                    }
                    return youtube.playlistItems.list(args)
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
    const [response, youtubeError] = await toQuery(() => callback(arg));
    if (youtubeError) {
        const msg = String(youtubeError || '');
        logger.log('youtube error', msg)
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
        else if (retriesCount > 0) {
            logger.log('request new youtube key', youtubeError)
            let status = 'active';
            if (msg.includes('suspended')) {
                status = 'suspended'
            }
            logger.log('new youtube key status', status)
            const oldKey = _youtubeInstance?.youtube.context._options.auth
            const [, seccondError] = await getYoutubeInstance(oldKey as string, status, logger);
            if(seccondError) {
                throw seccondError;
            }

            return await processRecursiveAsync(arg, callback, logger, retriesCount--);
        }
        else {
            throw youtubeError;
        }

    }
    return response as unknown as GaxiosPromise<TRet>;
}


