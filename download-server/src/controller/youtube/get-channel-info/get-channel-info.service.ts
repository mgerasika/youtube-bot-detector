import { AxiosError, } from 'axios';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { toQuery, } from '@common/utils/to-query.util';
import { getYoutubeApi, } from '@server/youtube';
import { ILogger, } from '@common/utils/create-logger.utils';

export interface IGetChannelInfoBody {
    channelId: string;
}

// TODO add support string | null in code generator.
export interface IChannelInfo {
    channelId: string;
    publishedAt: string;
    photo?: string;
    title: string;
    authorUrl?: string;
    viewCount?: string;
    subscriberCount?: string;
    hasHiddenSubscriberCount?: boolean;
    videoCount?: string;
    is_deleted:boolean;
}

export const getChannelInfoAsync = async (
    body: IGetChannelInfoBody,
    logger: ILogger
): IAsyncPromiseResult<IChannelInfo[] | undefined> => {
    logger.log('getChannelInfoAsync start', body)

    const [youtube, youtubeError] = await getYoutubeApi(undefined, undefined, logger);
    if (!youtube || youtubeError) {
        return [, youtubeError];
    }

    const ids = body.channelId.includes(',') ? body.channelId.split(',') : [body.channelId || ''];
    const [response, responseError] = await toQuery(() =>
        youtube.channels.list({
            part: [
                //  'auditDetails', DONT HAVE PERMISSION
                // 'brandingSettings',
                // 'contentDetails',
                // 'contentOwnerDetails',
                'id',
                // 'localizations',
                'snippet',
                'statistics',
                'status',
                // 'topicDetails',
            ],
            id: ids,
        })
    );

    if (responseError) {
        return [,responseError]
    }

    if (response?.data.items && response.data.items.length > 0) {
        const res = response.data.items.map((channel): IChannelInfo => {
            return {
                title: channel.snippet?.title || '',
                channelId: channel.id || '',
                publishedAt: channel.snippet?.publishedAt || '',
                authorUrl: channel.snippet?.customUrl || '',
                viewCount: channel.statistics?.videoCount || undefined,
                subscriberCount: channel.statistics?.subscriberCount || undefined,
                hasHiddenSubscriberCount: channel.statistics?.hiddenSubscriberCount || undefined,
                videoCount: channel.statistics?.videoCount || undefined,
                photo: channel.snippet?.thumbnails?.medium?.url || undefined,
                is_deleted: false
            };
        });
        // api don't return deleted, so return empty object
        if (res.length < ids.length) {
            const deletedChannels = ids.filter(id => !res.find(f => f.channelId === id)).map((id): IChannelInfo => {
                return {
                    title: 'deleted',
                    channelId: id,
                    publishedAt: new Date(1970).toISOString(),
                    authorUrl: undefined,
                    viewCount: undefined,
                    subscriberCount: undefined,
                    hasHiddenSubscriberCount: undefined,
                    videoCount: undefined,
                    photo: undefined,
                    is_deleted: true
                }
            })
            while (deletedChannels.length) {
                const deleted = deletedChannels.pop();
                if (deleted) {
                    res.push(deleted)
                }
            }
        }
        return [res];
    } else {
        logger.log('No channel found for the provided name, probadly deleted', ids);
        // implement this https://www.youtube.com/channel/UC-gIX2RdnTumzuxmMWPo0uw
        if (ids.length === 1) {
            const deletedChannels = ids.map((id): IChannelInfo => {
                return {
                    title: 'deleted',
                    channelId: id,
                    publishedAt: new Date(1970).toISOString(),
                    authorUrl: undefined,
                    viewCount: undefined,
                    subscriberCount: undefined,
                    hasHiddenSubscriberCount: undefined,
                    videoCount: undefined,
                    photo: undefined,
                    is_deleted: true
                }
            })
            return [deletedChannels]
        }
    }
    logger.log('getChannelInfoAsync end')
    return [,];
};
