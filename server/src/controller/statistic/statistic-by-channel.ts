import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { sqlQueryAsync, } from '@server/sql/sql-async.util';
import { sql_escape, } from '@server/sql/sql.util';
import { ILogger, } from '@common/utils/create-logger.utils';
import { oneByOneAsync, } from '@common/utils/one-by-one-async.util';
import { getStatisticByChannelForOneAsync, IStatisticByChannelForOne } from './statistic-by-channel-for-one';


export interface ICalc {
    frequency: number;
    frequency_tick: number;
}


export interface IStatisticByChannel  {
    items: IStatisticByChannelInvividualWithCalc[];
    forOne: {
        db: IStatisticByChannelForOne,
        calc: ICalc
    }
}

export const getStatisticByChannelAsync = async (author_id: string, logger: ILogger): IAsyncPromiseResult<IStatisticByChannel> => {
    const [individual, individualError] = await getStatisticByChannelIndividualAsync(author_id, logger)
    if (individualError) {
        return [, individualError]
    }

    const [forAll, forAllError] = await getStatisticByChannelForOneAsync(author_id, logger);
    if (forAllError) {
        return [, forAllError]
    }
    if(!forAll) {
        return [, logger.log('for all is null, error ' , author_id)]
    }

    return [{
        forOne: {
            calc: {
                frequency: +(forAll.comment_count/(forAll.published_at_diff || 1)).toFixed(2),
                frequency_tick: +(forAll.comment_count/(forAll.days_tick || 1)).toFixed(2),
            },    
            db: forAll,
        },
    
        items: (individual || []).map(item => {
            return {
                calc: {
                    frequency: +(item.comment_count/(item.published_at_diff || 1)).toFixed(2),
                    frequency_tick: +(item.comment_count/(item.days_tick || 1)).toFixed(2),
                },
                db: item,
            }
        }),
       
    }]

};

export interface IStatisticByChannelInvividualWithCalc  {
    db: IStatisticByChannelInvdividual;
    calc: ICalc
}

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


