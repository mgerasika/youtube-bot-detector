import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { sqlAsync } from '@server/sql/sql-async.util';
import { sql_escape } from '@server/sql/sql.util';
import { ILogger } from '@common/utils/create-logger.utils';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';

export interface IStatisticByChannel {
    published_at: Date;
    total_comment_count: number;
    channel_url: string;
    channel_id: string;
   
    comment_count: number;
    first_video_published_at: Date;
    last_video_published_at: Date;
}


 export const getStatisticByChannelAsync = async (author_id: string, logger: ILogger): IAsyncPromiseResult<IStatisticByChannel[]> => {
    const [list, error] = await sqlAsync<IStatisticByChannel[]>(async (client) => {
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


