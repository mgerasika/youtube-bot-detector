import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';
import { toQuery } from '@common/utils/to-query.util';
import { groupArray } from '@common/utils/group-array.util';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { getVideosAsync } from '@server/controller/youtube/get-videos/get-videos.service';
import { api } from '@server/api.generated';
import { RABBIT_MQ_ENV } from '@server/env';
import { IScanCommentsBody, IScanVideosBody } from '@common/interfaces/scan.interface';
import { createLogger, ILogger } from '@common/utils/create-logger.utils';

// scan all videos by channel id. Need to use Date cache
export const scanVideosAsync = async (body: IScanVideosBody, logger: ILogger): IAsyncPromiseResult<string> => {
    logger.log('scanVideosAsync', body);
   
    const channel_id = body.channelId;

    const [lastDate, lastDateError] = await toQuery(() => api.videoLastDateGet({ channel_id  }));
    if (lastDateError) {
        return [, lastDateError];
    }
    logger.log('last_date = ', lastDate?.data);

    const [data, error] = await getVideosAsync({channelId:body.channelId, publishedAt: lastDate?.data?.toString() || ''}, logger);
    logger.log('recieved videos count = ', data?.items.length);

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
            rabbitMQ_sendDataAsync<IScanCommentsBody>(RABBIT_MQ_ENV, 'scanCommentsAsync', {
                videoId: video.videoId
            }, logger)
        })

        // // remove videos from redis cache
        // const redisClient = await connectToRedisAsync(ENV.redis_url);
        // const messageId = getRabbitMqMessageId<IScanVideosBody>('scanVideosAsync',  {
        //     channelId: body.channelId
        // });
        // await redisClient.set(messageId, '', {
        //     EX: 60 // one minute
        // });

        return [`post to videos db ${videos.length}`];
    }

    return [, error];
};
