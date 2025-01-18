import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { sqlQueryAsync, } from '@server/sql/sql-async.util';
import { sql_escape, } from '@server/sql/sql.util';
import { ILogger, } from '@common/utils/create-logger.utils';
import { getStatisticByChannelAsync , IStatisticByChannel  } from './statistic-by-channel';


export interface IStatisticByChannelDetailed  {
    items: IStatisticByChannelInvdividual[];
    general:  IStatisticByChannel;
}

export const getStatisticByChannelDetailedAsync = async (author_id: string, logger: ILogger): IAsyncPromiseResult<IStatisticByChannelDetailed> => {
    const [individualItems, individualError] = await getStatisticByChannelIndividualAsync(author_id, logger)
    if (individualError || !individualItems) {
        return [, individualError]
    }

    const [general, generalError] = await getStatisticByChannelAsync(author_id, logger);
    if (generalError) {
        return [, generalError]
    }
    if(!general) {
        return [, logger.log('for all is null, error ' , author_id)]
    }

    return [{
        general: general,
        items:individualItems,
       
    }]

};

export interface IStatisticByChannelInvdividual {
    comment_count: number;
    channel_id: number;
    channel_url: string;
    published_at: Date;
    

    min_published_at: Date;
    max_published_at: Date;
    days_tick: number;
    published_at_diff: number;
}

const getStatisticByChannelIndividualAsync = async (author_id: string, logger: ILogger): IAsyncPromiseResult<IStatisticByChannelInvdividual[]> => {
    const [list, error] = await sqlQueryAsync<IStatisticByChannelInvdividual[]>(async (client) => {
        const { rows } = await client.query<IStatisticByChannelInvdividual[]>(`
SELECT 
    *,
    ROUND(comment_count::numeric / GREATEST(published_at_diff, 1), 2)::float AS frequency,
    ROUND(comment_count::numeric / GREATEST(days_tick, 1), 2)::float AS frequency_tick
FROM (
SELECT 
    *, 
   GREATEST((max_published_at::date - min_published_at::date)::int, 1) AS published_at_diff 
FROM (SELECT 
    COUNT(*)::int AS comment_count, 
    video.channel_id AS channel_id,
    channel_main.author_url AS channel_url,
	channel_main.published_at as published_at,

  -- Duplicated comments by this author
    (SELECT COUNT(*)
    FROM (
        SELECT c1.text
        FROM comment AS c1
        INNER JOIN video AS v1 ON v1.id = c1.video_id
       WHERE 
       c1.author_id = comment.author_id and v1.channel_id = video.channel_id and v1.channel_id <> c1.author_id
   GROUP BY c1.text
        HAVING COUNT(*) > 1
    ) AS duplicated_comments
    )::int AS duplicated_comment_count,

	
    (SELECT MIN(c1.published_at) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
    WHERE 
       c1.author_id = comment.author_id and v1.channel_id = video.channel_id and v1.channel_id <> c1.author_id
) as min_published_at,

    (SELECT MAX(c1.published_at) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
    WHERE 
       c1.author_id = comment.author_id and v1.channel_id = video.channel_id and v1.channel_id <> c1.author_id
) as max_published_at,

  (SELECT count(distinct c1.published_at) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
    WHERE 
       c1.author_id = comment.author_id and v1.channel_id = video.channel_id and v1.channel_id <> c1.author_id
)::int as days_tick

FROM 
    comment 
INNER JOIN 
    video ON video.id = comment.video_id
LEFT JOIN 
    channel AS channel_comment ON channel_comment.id = comment.author_id
LEFT JOIN 
    channel AS channel_main ON channel_main.id = video.channel_id
WHERE 
    comment.author_id = ${sql_escape(author_id)}  and video.channel_id <> comment.author_id
GROUP BY 
    video.channel_id, 
	comment.author_id,
    channel_main.published_at,
    channel_main.author_url)as t1)as t2`);
        return rows;
    }, logger);
    if (error) {
        return [, logger.log(error)]
    }
    return [list as []];
};


