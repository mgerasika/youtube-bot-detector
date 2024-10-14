import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { google, youtube_v3 } from 'googleapis';
import { AxiosResponse } from 'axios';
import { ENV } from '@server/constants/env';
import { IAsyncPromiseResult } from '@server/interfaces/async-promise-result.interface';
import { ICollection } from '@server/interfaces/collection';

export interface IGetCommentsBody {
    videoId: string;
}

export interface IShortCommentInfo {
    author: string;
    text: string;
    commentId: string;
    publishedAt: string;
    authorChannelId: string;
}
export const getCommentsAsync = async (body: IGetCommentsBody): IAsyncPromiseResult<ICollection<IShortCommentInfo>> => {
    const videos = await requestGetAllComments(body.videoId);
    if(!videos) {
        return [,'comments not found'];
    }
    return [videos];
};

const youtube = google.youtube({
    version: 'v3',
    auth: ENV.youtube_key,
});



async function requestGetAllComments(videoId: string): Promise<ICollection<IShortCommentInfo> | undefined> {
    let allComments: Array<IShortCommentInfo> = [];
    let nextPageToken: string | null | undefined = '';

    try {
        // Fetch comment threads in batches using nextPageToken
        do {
            const commentResponse = (await youtube.commentThreads.list({
                part: ['snippet', 'id', 'replies'],
                videoId: videoId,
                maxResults: 100, // Max is 100
                pageToken: nextPageToken || undefined,
                textFormat: 'plainText', // Retrieve comments as plain text
            })) as AxiosResponse<youtube_v3.Schema$CommentThreadListResponse>;

            if (commentResponse.data.items) {
                const comments = commentResponse.data.items.map(
                    (item: youtube_v3.Schema$CommentThread): IShortCommentInfo => {
                        return {
                            commentId: item.snippet?.topLevelComment?.id || '',
                            author: item.snippet?.topLevelComment?.snippet?.authorDisplayName || '',
                            authorChannelId: item.snippet?.topLevelComment?.snippet?.authorChannelId?.value || '',
                            text: item.snippet?.topLevelComment?.snippet?.textDisplay || '',
                            publishedAt: item.snippet?.topLevelComment?.snippet?.publishedAt || '',
                            
                        };
                    },
                );

                //   allComments = allComments.concat(comments);
                allComments = [...allComments, ...comments];
            }

            // Get the next page token (if available)
            nextPageToken = commentResponse.data.nextPageToken;
        } while (nextPageToken);

        console.log(`Total comments retrieved: ${allComments.length}`);
        console.log(allComments);
        return {
            total: allComments.length,
            items: allComments
        };
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}
