import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { oneByOneAsync, } from '@common/utils/one-by-one-async.util';
import { toQuery, } from '@common/utils/to-query.util';
import { groupArray, } from '@common/utils/group-array.util';
import {rabbitMqService,} from '@common/services/rabbit-mq'
import {redisService,} from '@common/services/redis'
import { getVideosAsync, } from '@server/controller/youtube/get-videos/get-videos.service';
import { api, } from '@server/api.generated';
import { ENV, RABBIT_MQ_DOWNLOAD_ENV, } from '@server/env';
import { createLogger, ILogger, } from '@common/utils/create-logger.utils';
import { IScanVideosBody, IScanCommentsBody, } from '@common/model/download-server.model';
import { IScanReturn, } from '@common/interfaces/rabbitm-mq-return';

// scan all videos by channel id. Need to use Date cache
export const scanVideosAsync = async (body: IScanVideosBody, logger: ILogger): IAsyncPromiseResult<IScanReturn> => {
    logger.log('scanVideosAsync start', body);

    const channel_id = body.channelId;

    let lastDateStr = '';
    if (body.ignoreVideoLastDate) {
        logger.log('Ignore lastVideoDate beacuse flag set');
    } else {
        const [lastDate, lastDateError] = await toQuery(() => api.videoLastDateGet({ channel_id }));
        if (lastDateError) {
            return [, lastDateError];
        }
        logger.log('last_date from db (last video date) = ', lastDate?.data);
        lastDateStr = lastDate?.data?.toString() || '';
    }

    const [data, error] = await getVideosAsync({ channelId: body.channelId, publishedAt: lastDateStr }, logger);
    if (error) {
        return [, error];
    }
    if (!data) {
        return [, logger.log('recieved empty data')];
    }
    logger.log('recieved videos count = ', data?.items.length);

    const videos = data.items.reverse();

    const groupedVideos = groupArray(videos, 100);
    logger.log('before one by one groups = ', groupedVideos.length)
    await oneByOneAsync(groupedVideos, async (group, cancelFn) => {
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
            })
        );
        if (apiError) {
            return cancelFn(apiError);
        }
        logger.log('post videos count = ', group.length)
        
    });

    await oneByOneAsync(videos, async (video) => {
        await redisService.setAsync( redisService.getMessageId('video', video.videoId));
        await rabbitMqService.sendDataAsync<IScanCommentsBody>(
            RABBIT_MQ_DOWNLOAD_ENV,
            'scanCommentsAsync',
            {
                videoId: video.videoId,
                ignoreCommentsLastDate: body.ignoreCommentsLastDate,
            },
            logger
        );
    });

    logger.log('scanVideosAsync end');
    return [{ hasChanges: videos.length > 0, message: logger.log(`post to videos db ${videos.length}`) }];
};
