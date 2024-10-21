import { ENV } from '@server/env';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { api } from '@server/api.generated';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { groupArray } from '@common/utils/group-array.util';
import { nameOf } from '@common/utils/name-of';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';
import { toQuery } from '@common/utils/to-query.util';
import { IScanAuthorsBody } from '../scan-auhors/scan-authors.service';
import { getCommentsAsync } from '@server/controller/youtube/get-comments/get-comments.service';
import { scan } from '../services';

export interface IScanCommentsBody {
    videoId: string;
}

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

        const arg: IScanAuthorsBody = {
            videoId: body.videoId
        }
        
        rabbitMQ_sendDataAsync({
            channelName: ENV.rabbit_mq_channel_name,
            rabbit_mq_url: ENV.rabbit_mq_url,
            redis_url: ENV.redis_url
        }, {msg:{methodName:  nameOf<typeof scan>('scanAuthorsAsync'), methodArgumentsJson: arg}})

     
        return [`post to db comments ${comments.length}`];
    }

    return [, error];
};




