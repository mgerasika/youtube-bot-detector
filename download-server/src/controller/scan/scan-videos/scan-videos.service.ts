import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';
import { toQuery } from '@common/utils/to-query.util';
import { groupArray } from '@common/utils/group-array.util';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { getVideosAsync } from '@server/controller/youtube/get-videos/get-videos.service';
import { api } from '@server/api.generated';
import { RABBIT_MQ_ENV } from '@server/env';
import { createLogger, ILogger } from '@common/utils/create-logger.utils';
import { IScanVideosBody, IScanCommentsBody } from '@common/model';
import { IScanReturn } from '@common/interfaces/scan.interface';

// scan all videos by channel id. Need to use Date cache
export const scanVideosAsync = async (body: IScanVideosBody, logger: ILogger): IAsyncPromiseResult<IScanReturn> => {
    logger.log('scanVideosAsync', body);
   
    const channel_id = body.channelId;

    const [lastDate, lastDateError] = await toQuery(() => api.videoLastDateGet({ channel_id  }));
    if (lastDateError) {
        return [, lastDateError];
    }
    logger.log('last_date from db (last video date) = ', lastDate?.data);

    const [data, error] = await getVideosAsync({channelId:body.channelId, publishedAt: lastDate?.data?.toString() || ''}, logger);
    if(error) {
        return [,error]
    }
    if(!data) {
        return [,logger.log('recieved empty data')]
    }
    logger.log('recieved videos count = ', data?.items.length);

        const videos = data.items.reverse();

        const groupedVideos = groupArray(videos, 100);
        await oneByOneAsync(groupedVideos, async (group) => {
            const [, apiError] = await toQuery(() =>
                api.videoPost({
                    videos: group.map((item) => {
                        return {
                            published_at: item.publishedAt,
                            published_at_time: item.publishedAt,
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
            rabbitMQ_sendDataAsync<IScanCommentsBody>(RABBIT_MQ_ENV, 'scanCommentsAsync', {
                videoId: video.videoId
            }, logger)
        })

        return [{hasChanges: videos.length >0,  message:logger.log(`post to videos db ${videos.length}`)}];

};
