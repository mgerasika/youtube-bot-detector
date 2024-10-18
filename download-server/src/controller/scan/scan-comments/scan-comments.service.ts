import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { google, youtube_v3 } from 'googleapis';
import { AxiosResponse } from 'axios';
import { ENV } from '@server/constants/env';
import { IAsyncPromiseResult } from '@server/interfaces/async-promise-result.interface';
import { ICollection } from '@server/interfaces/collection';
import { allServices } from '@server/controller/all-services';
import { api } from '@server/api.generated';
import { rabbitMQ_sendDataAsync } from '@server/rabbit-mq';
import { groupArray } from '@server/utils/group-array.util';
import { nameOf } from '@server/utils/name-of';
import { oneByOneAsync } from '@server/utils/one-by-one-async.util';
import { toQuery } from '@server/utils/to-query.util';
import { IScanChannelInfoBody } from '../scan-channel-info/scan-channel-info.service';
import { IScanAuthorsBody } from '../scan-auhors/scan-authors.service';

export interface IScanCommentsBody {
    videoId: string;
}

export const scanCommentsAsync = async (body: IScanCommentsBody): IAsyncPromiseResult<string> => {
    const [lastDate, lastDateError] = await toQuery(() => api.commentLastDateGet({ video_id: body.videoId }));
    if (lastDateError) {
        return [, lastDateError];
    }
    console.log('last_date = ', lastDate?.data);

    const [data, error] = await allServices.youtube.getCommentsAsync({videoId:body.videoId, publishedAt: lastDate?.data?.toString() || '' });
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
        
        rabbitMQ_sendDataAsync({msg:{methodName:  nameOf<typeof allServices.scan>('scanAuthorsAsync'), methodArgumentsJson: arg}})

     
        return [`post to db comments ${comments.length}`];
    }

    return [, error];
};




