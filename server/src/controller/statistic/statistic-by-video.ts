import { IApiKeyDto, } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { sqlQueryAsync, } from '@server/sql/sql-async.util';
import { sql_escape, } from '@server/sql/sql.util';
import { ILogger, } from '@common/utils/create-logger.utils';

export interface IStatisticByVideo {
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



export const getStatisticByVideoAsync = async (video_id: string, logger: ILogger): IAsyncPromiseResult<IStatisticByVideo[]> => {
    const [list, error] = await sqlQueryAsync<IStatisticByVideo[]>(async (client) => {
        const { rows } = await client.query<IStatisticByVideo[]>(`SELECT 
    *,
    ROUND(comment_count::numeric / GREATEST(published_at_diff, 1), 2)::float AS frequency,
    ROUND(comment_count::numeric / GREATEST(days_tick, 1), 2)::float AS frequency_tick
FROM (
    SELECT 
        *, 
        GREATEST((max_published_at::date - min_published_at::date)::int, 1) AS published_at_diff
    FROM (
        SELECT 
            DISTINCT comment.author_id AS channel_id, 
            channel_comment.author_url AS channel_url,
            channel_comment.published_at AS published_at,

            (
                SELECT COUNT(*) 
                FROM comment AS c1
                INNER JOIN video AS v1 ON v1.id = c1.video_id
                WHERE c1.author_id = comment.author_id AND v1.channel_id <> c1.author_id
            ) AS comment_count,

            (
                SELECT MIN(c1.published_at) 
                FROM comment AS c1
                INNER JOIN video AS v1 ON v1.id = c1.video_id
                WHERE c1.author_id = comment.author_id AND v1.channel_id <> c1.author_id
            ) AS min_published_at,

            (
                SELECT MAX(c1.published_at) 
                FROM comment AS c1
                INNER JOIN video AS v1 ON v1.id = c1.video_id
                WHERE c1.author_id = comment.author_id AND v1.channel_id <> c1.author_id
            ) AS max_published_at,

            (
                SELECT COUNT(DISTINCT c1.published_at) 
                FROM comment AS c1
                INNER JOIN video AS v1 ON v1.id = c1.video_id
                WHERE c1.author_id = comment.author_id AND v1.channel_id <> c1.author_id
            ) AS days_tick

        FROM 
            comment
        INNER JOIN 
            video ON video.id = comment.video_id
        LEFT JOIN 
            channel AS channel_comment ON channel_comment.id = comment.author_id
        FULL OUTER JOIN 
            statistic AS s1 ON comment.author_id = s1.channel_id
        WHERE 
            comment.video_id = ${sql_escape(video_id)}
            AND (s1.uploaded_at_time < NOW() - INTERVAL '24 hours' OR s1.channel_id IS NULL OR s1.hash is NULL)
    ) AS t1
) AS t2;
`);
        return rows;
    }, logger);
    if(error) {
        return [,error]
    }
    return [(list as [])];
};
