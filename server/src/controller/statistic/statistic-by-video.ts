import { IApiKeyDto } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { sqlAsync } from '@server/sql/sql-async.util';
import { sql_escape } from '@server/sql/sql.util';
import { ILogger } from '@common/utils/create-logger.utils';

export interface IStatisticByVideo {
    comments_on_all_channels: number;
    comments_on_current_channel: number;
   
    channel_id: string;
    channel_url: string;
    id: string;
    channel_published_at: Date;
    unique_days_on_channel :number;
    unique_days_all:number;
}

export const getStatisticByVideoAsync = async (video_id: string, logger: ILogger): IAsyncPromiseResult<IStatisticByVideo[]> => {
    const [list, error] = await sqlAsync<IApiKeyDto[]>(async (client) => {
        const { rows } = await client.query(`SELECT 
    distinct(comment.author_id) as channel_id, 
    channel_comment.author_url AS channel_url,
    channel_comment.published_at as channel_published_at,

  (SELECT COUNT(*)  
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
    WHERE 
      c1.author_id = comment.author_id and v1.channel_id = video.channel_id
  ) as comments_on_current_channel,

    (SELECT COUNT(*) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
    WHERE 
      c1.author_id = comment.author_id 
) as comments_on_all_channels,


  (SELECT count(distinct c1.published_at) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
    WHERE 
      c1.author_id = comment.author_id 
) as unique_days_all,

  (SELECT count(distinct c1.published_at) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
    WHERE 
       c1.author_id = comment.author_id and v1.channel_id = video.channel_id
) as unique_days_on_channel
  
FROM 
    comment 
INNER JOIN 
    video ON video.id = comment.video_id 
LEFT JOIN 
    channel AS channel_comment ON channel_comment.id = comment.author_id 
WHERE 
    comment.video_id = ${sql_escape(video_id)}`);
        return rows;
    }, logger);
    if(error) {
        return [,error]
    }
    return [(list as [])];
};