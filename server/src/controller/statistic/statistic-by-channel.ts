import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { sqlAsync } from '@server/sql/sql-async.util';
import { sql_escape } from '@server/sql/sql.util';
import { ILogger } from '@common/utils/create-logger.utils';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';

export interface IGroupStatistic {
    author_id: string;
    author_url: string;
    author_published_at: string;
    items: IGroupStatisticItem[];
}

export interface IGroupStatisticItem {
    published_at: Date;
    total_comment_count: number;
    channel_url: string;
    channel_id: string;
   
    comment_count: number;
    first_video_published_at: Date;
    last_video_published_at: Date;
}

export const getStatisticByChannel = async (video_id: string, logger: ILogger): IAsyncPromiseResult<IGroupStatistic[]> => {

    // get unique author comments by video_id
    const [list, error] = await sqlAsync<{author_id:string, author_url:string,author_published_at: string}[]>(async (client) => {
        const { rows } = await client.query(`SELECT 
    distinct(comment.author_id), 
    channel_comment.author_url AS author_url,
    channel_comment.published_at as author_published_at
FROM 
    comment 
INNER JOIN 
    video ON video.id = comment.video_id 
LEFT JOIN 
    channel AS channel_comment ON channel_comment.id = comment.author_id 
WHERE 
    comment.video_id = ${sql_escape(video_id)};`);
        return rows;
    }, logger);
    if(error) {
        return [,error]
    }

    let res:IGroupStatistic[] = [];
    await oneByOneAsync(list || [], async (comment) => {
        const [items] = await getGroupStatisticItem(comment.author_id, logger)
        if(items) {
            res.push({
                author_id: comment.author_id,
                author_url: comment.author_url,
                author_published_at: comment.author_published_at ,
                items
            })
        }
    })

    return [res];
};

export const getGroupStatisticItem = async (author_id: string, logger: ILogger): IAsyncPromiseResult<IGroupStatisticItem[]> => {
    const [list, error] = await sqlAsync<IGroupStatisticItem[]>(async (client) => {
        const { rows } = await client.query(`SELECT 
    COUNT(*) AS comment_count, 
    SUM(COUNT(*)) OVER() AS total_comment_count,
    video.channel_id AS channel_id,
    channel_main.author_url AS channel_url,
	channel_main.published_at as published_at,
    MIN(video.published_at) AS first_video_published_at,
    MAX(video.published_at) AS last_video_published_at
FROM 
    comment 
INNER JOIN 
    video ON video.id = comment.video_id
LEFT JOIN 
    channel AS channel_comment ON channel_comment.id = comment.author_id
LEFT JOIN 
    channel AS channel_main ON channel_main.id = video.channel_id
WHERE 
    comment.author_id = ${sql_escape(author_id)}
GROUP BY 
    video.channel_id, 
	channel_comment.published_at,
    channel_main.published_at,
    channel_main.author_url;`);
        return rows;
    }, logger);
    if(error) {
        return [,error]
    }
    return [list as []];
};


