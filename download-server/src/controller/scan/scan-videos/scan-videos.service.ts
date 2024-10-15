import { IAsyncPromiseResult } from '@server/interfaces/async-promise-result.interface';
import { allServices } from '@server/controller/all-services';
import { api } from '@server/api.generated';
import { oneByOneAsync } from '@server/utils/one-by-one-async.util';
import { toQuery } from '@server/utils/to-query.util';
import { groupArray } from '@server/utils/group-array.util';
import { IScanCommentsBody } from '../scan-comments/scan-comments.service';
import { nameOf } from '@server/utils/name-of';
import { rabbitMQ_sendDataAsync } from '@server/rabbit-mq';

export interface IScanVideosBody {
    channelName: string;
}

export const scanVideosAsync = async (body: IScanVideosBody): IAsyncPromiseResult<string> => {
    console.log('scanVideosAsync', body);

    const [channelId, channelIdError] = await allServices.youtube.getChannelIdAsync(body.channelName);
    if (channelIdError) {
        return [, channelIdError];
    }
    const [lastDate, lastDateError] = await toQuery(() => api.videoLastDateGet({ channel_id: channelId || '' }));
    if (lastDateError) {
        return [, lastDateError];
    }
    console.log('last_date = ', lastDate?.data);

    const [data, error] = await allServices.youtube.getVideosAsync({channelName:body.channelName, publishedAt: lastDate?.data?.toString() || ''});
    console.log('recieved videos count = ', data?.items.length);

    if (data) {
        const videos = data.items.reverse();

        const groupedVideos = groupArray(videos, 100);
        await oneByOneAsync(groupedVideos, async (group) => {
            const [, apiError] = await toQuery(() =>
                api.videoPost({
                    videos: group.map((item) => {
                        return {
                            published_at: item.publishedAt,
                            id: item.videoId,
                            title: item.title,
                            channel_id: item.channelId,
                        };
                    }),
                }),
            );
            if (apiError) {
                throw apiError;
            } 
        });

        videos.map(video => {
            const arg: IScanCommentsBody = {
                videoId: video.videoId
            }
            rabbitMQ_sendDataAsync({msg:{methodName:  nameOf<typeof allServices.scan>('scanCommentsAsync'), methodArgumentsJson: arg}})
        })
        return [`post to videos db ${videos.length}`];
    }

    return [, error];
};
