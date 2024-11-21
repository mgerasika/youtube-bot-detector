import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { sqlQueryAsync, } from '@server/sql/sql-async.util';
import { sql_escape, } from '@server/sql/sql.util';
import { ILogger, } from '@common/utils/create-logger.utils';


export interface IStatisticByChannelForOne {
    published_at: Date;
    channel_url: string;
    channel_id: string;
    comment_count: number;
    min_published_at: Date;
    max_published_at: Date;
    days_tick: number;
    published_at_diff: number;
    frequency: number;
    frequency_tick: number;
}
export const getStatisticByChannelForOneAsync = async (author_id: string, logger: ILogger): IAsyncPromiseResult<IStatisticByChannelForOne> => {
    const [list, error] = await sqlQueryAsync<IStatisticByChannelForOne[]>(async (client) => {
        const { rows } = await client.query<IStatisticByChannelForOne[]>(`
            SELECT 
    *,
    ROUND(comment_count::numeric / GREATEST(published_at_diff, 1), 2)::float AS frequency,
    ROUND(comment_count::numeric / GREATEST(days_tick, 1), 2)::float AS frequency_tick
FROM (
            SELECT 
    *, 
    GREATEST((max_published_at::date - min_published_at::date)::int, 1) AS published_at_diff 
FROM (
    SELECT 
        channel.published_at AS published_at,
        channel.id as channel_id,
        channel.author_url AS channel_url,
        
        -- Total comments by this author
        (SELECT COUNT(c1.id)  
         FROM 
             comment AS c1
         INNER JOIN 
			video as v1 ON v1.id = c1.video_id		 
         WHERE 
              c1.author_id = channel.id and v1.channel_id <> c1.author_id
        )::int AS comment_count,
        
        -- Earliest comment published date
        (SELECT MIN(c1.published_at)  
         FROM 
             comment AS c1
         INNER JOIN 
			video as v1 ON v1.id = c1.video_id		 
         WHERE 
              c1.author_id = channel.id and v1.channel_id <> c1.author_id
        ) AS min_published_at,
        
        -- Latest comment published date
        (SELECT MAX(c1.published_at)  
         FROM 
             comment AS c1
         INNER JOIN 
			video as v1 ON v1.id = c1.video_id		 
         WHERE 
              c1.author_id = channel.id and v1.channel_id <> c1.author_id
        ) AS max_published_at,
	
	
	      (SELECT count(distinct(c1.published_at))  
         FROM 
             comment AS c1
         INNER JOIN 
			video as v1 ON v1.id = c1.video_id		 
         WHERE 
              c1.author_id = channel.id and v1.channel_id <> c1.author_id
        )::int AS days_tick

    FROM 
        channel 
    WHERE 
        channel.id = ${sql_escape(author_id)}
    GROUP BY 
        channel.id
) AS t1) as t2`);
        return rows;
    }, logger);
    if (!list?.length) {
        return [, logger.log('empty list, throw error ' + author_id)]
    }
    if (error) {
        return [, error]
    }
    return [list[0] as IStatisticByChannelForOne];
};


