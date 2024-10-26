import { ENV, RABBIT_MQ_ENV } from '@server/env';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import { getRabbitMqMessageId, rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { groupArray } from '@common/utils/group-array.util';
import { nameOf } from '@common/utils/name-of';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';
import { toQuery } from '@common/utils/to-query.util';
import { getCommentsAsync } from '@server/controller/youtube/get-comments/get-comments.service';
import { scan } from '../services';
import { IScanCommentsBody, IScanAuthorsBody, IScanChannelInfoBody } from '@common/interfaces/scan.interface';
import { connectToRedisAsync } from '@common/utils/redis';



export const scanCommentsAsync = async (body: IScanCommentsBody): IAsyncPromiseResult<string> => {
    const [lastDate, lastDateError] = await toQuery(() => api.commentLastDateGet({ video_id: body.videoId }));
    if (lastDateError) {
        return [, lastDateError];
    }
    console.log('last_date = ', lastDate?.data);

    const [data, error] = await getCommentsAsync({videoId:body.videoId, publishedAt: lastDate?.data?.toString() || '' });
    console.log('recieved comments count = ', data?.items.length);

    if (data) {
        const comments = data.items.reverse();

        const groupedComments = groupArray(comments, 100);
        await oneByOneAsync(groupedComments, async (group) => {
            const [, apiError] = await toQuery(() =>
                api.commentPost({
                    comments: group.map((item) => {
                        return {
                            published_at: item.publishedAt,
                            published_at_time: item.publishedAt,
                            id: item.commentId,
                            channel_id: item.channelId,
                            text: item.text,
                            author_id: item.authorChannelId,
                            video_id: body.videoId
                            
                        };
                    }),
                }),
            );
            if (apiError) {
                throw apiError;
            } 
        });

       
        // remove comments from redis cache
        const redisClient = await connectToRedisAsync(ENV.redis_url);
        const messageId = getRabbitMqMessageId<IScanCommentsBody>('scanCommentsAsync',  {
            videoId: body.videoId
        });
        await redisClient.set(messageId, '', {
            EX: 60
        });

       
        rabbitMQ_sendDataAsync<IScanAuthorsBody>(RABBIT_MQ_ENV, 'scanAuthorsAsync', {
            videoId: body.videoId
        })

     
        return [`post to db comments ${comments.length}`];
    }

    return [, error];
};




