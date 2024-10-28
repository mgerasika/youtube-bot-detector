import { youtube_v3 } from 'googleapis';
import { AxiosError } from 'axios';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { ICollection } from '@common/interfaces/collection';
import { toQuery } from '@common/utils/to-query.util';
import { ILogger } from '@common/utils/create-logger.utils';
import { getYoutube, processYoutubeErrorAsync } from '@server/youtube';

export interface IGetCommentsBody {
    videoId: string;
    publishedAt: string;
}

export interface IShortCommentInfo {
    author: string;
    text: string;
    commentId: string;
    publishedAt: Date;
    authorChannelId: string;
    channelId: string;
}


export const getCommentsAsync = async ({videoId, publishedAt}: IGetCommentsBody, logger: ILogger): IAsyncPromiseResult<ICollection<IShortCommentInfo>> => {
    const [youtube, youtubeError] = await getYoutube(undefined, logger);
    if(!youtube || youtubeError) {
        return [, youtubeError];
    }
   
    let allComments: Array<IShortCommentInfo> = [];
    let nextPageToken: string | null | undefined = '';

    const publishedAtDate = publishedAt ? new Date(publishedAt) : new Date(1970);
    logger.log('publishedAtDate', publishedAtDate, publishedAt)
    do {
        const [commentResponse, commentsError] = await toQuery(() => youtube.commentThreads.list({
            part: ['snippet', 'id', 'replies'],
            videoId: videoId,
            maxResults: 100, // Max is 100
            pageToken: nextPageToken || undefined,
            textFormat: 'plainText', // Retrieve comments as plain text
        }));

        if((commentsError as any)?.message?.includes('has disabled comments')) {
            return [{items:[], total:0}]
        }

        if(commentsError) {
           return await processYoutubeErrorAsync(commentsError as AxiosError, logger);
        }

        if (commentResponse?.data.items) {
            const comments = commentResponse.data.items.map(
                (item: youtube_v3.Schema$CommentThread): IShortCommentInfo[] => {
                    const rootComment: IShortCommentInfo = {
                        commentId: item.snippet?.topLevelComment?.id || '',
                        author: item.snippet?.topLevelComment?.snippet?.authorDisplayName || '',
                        authorChannelId: item.snippet?.topLevelComment?.snippet?.authorChannelId?.value || '',
                        text: item.snippet?.topLevelComment?.snippet?.textDisplay || '',
                        publishedAt: new Date(item.snippet?.topLevelComment?.snippet?.publishedAt || ''),
                        channelId: item.snippet?.topLevelComment?.snippet?.channelId || ''

                    };
                    const replies = (item.replies?.comments || []).map((replyComment): IShortCommentInfo => {
                        return {
                            commentId: replyComment?.id || '',
                            author: replyComment.snippet?.authorDisplayName || '',
                            authorChannelId: replyComment.snippet?.authorChannelId?.value || '',
                            text: replyComment.snippet?.textDisplay || '',
                            publishedAt: new Date(replyComment.snippet?.publishedAt || ''),
                            channelId: item.snippet?.topLevelComment?.snippet?.channelId || ''
                        }
                    })
                    return replies?.concat(rootComment);
                },
            ).flat();

               allComments = allComments.concat(comments);
        }
        if (allComments.some(item => item.publishedAt > publishedAtDate)) {
            nextPageToken = commentResponse?.data.nextPageToken;
        }
        else {
            nextPageToken = undefined;
        }
        allComments = allComments.filter(item => item.publishedAt > publishedAtDate);

    } while (nextPageToken);

    logger.log(`Total comments retrieved: ${allComments.length}`);
    return [{
        total: allComments.length,
        items: allComments
    }];
}
