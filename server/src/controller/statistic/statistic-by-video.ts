import { IApiKeyDto } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { sqlAsync } from '@server/sql/sql-async.util';
import { sql_escape } from '@server/sql/sql.util';
import { ILogger } from '@common/utils/create-logger.utils';

export interface IStatisticByVideo {
   isBot: boolean;
   channel_id: string;
   channel_url: string;
   comments_on_current_channel: number;
   comments_on_all_channels: number;
   comments_per_day_by_range_all: number;
   comments_per_day_by_range_current: number;
   comments_per_day_current: number;
   comments_per_day_all: number;
   comments_days_diff_currrent: number;
   comments_days_diff_all: number;
}

interface ISqlResponse {
  channel_id: string;
  channel_url: string;
  channel_published_at: Date;
  comments_on_current_channel: number;
  comments_on_all_channels: number;

  unique_days_on_current_channel :number;
  unique_days_on_all_channels:number;

  min_comment_published_at_on_current_channel :Date;
  max_comment_published_at_on_current_channel:Date;

  min_comment_published_at_on_all_channels :Date;
  max_comment_published_at_on_all_channels:Date;
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
       c1.author_id = comment.author_id and v1.channel_id = video.channel_id
) as unique_days_on_current_channel,

  (SELECT count(distinct c1.published_at) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
    WHERE 
      c1.author_id = comment.author_id 
) as unique_days_on_all_channels,



  (SELECT MIN(c1.published_at) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
    WHERE 
       c1.author_id = comment.author_id and v1.channel_id = video.channel_id
) as min_comment_published_at_on_current_channel,

  (SELECT MAX(c1.published_at) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
    WHERE 
       c1.author_id = comment.author_id and v1.channel_id = video.channel_id
) as max_comment_published_at_on_current_channel,

  (SELECT MIN(c1.published_at) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
    WHERE 
      c1.author_id = comment.author_id 
) as min_comment_published_at_on_all_channels,

  (SELECT MAX(c1.published_at) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
    WHERE 
      c1.author_id = comment.author_id 
) as max_comment_published_at_on_all_channels
  
FROM 
    comment 
INNER JOIN 
    video ON video.id = comment.video_id 
LEFT JOIN 
    channel AS channel_comment ON channel_comment.id = comment.author_id 
WHERE 
    comment.video_id  = ${sql_escape(video_id)}`);
        return rows;
    }, logger);
    if(error) {
        return [,error]
    }
    return [(list as []).map(item => calcStatistic(item))];
};

const calcStatistic = (sqlItem: ISqlResponse) : IStatisticByVideo => {
  const comments_days_diff_currrent = (new Date(sqlItem.max_comment_published_at_on_current_channel).getTime() - new Date(sqlItem.min_comment_published_at_on_current_channel).getTime())/(24*3600*1000);
  const comments_days_diff_all = (new Date(sqlItem.max_comment_published_at_on_all_channels).getTime() - new Date(sqlItem.min_comment_published_at_on_all_channels).getTime())/(24*3600*1000);
  const comments_per_day_by_range_all = sqlItem.comments_on_all_channels/comments_days_diff_all;
  const comments_per_day_by_range_current = sqlItem.comments_on_current_channel/comments_days_diff_currrent;
  const comments_per_day_all = sqlItem.comments_on_all_channels/sqlItem.unique_days_on_all_channels;
  const comments_per_day_current = sqlItem.comments_on_current_channel/sqlItem.unique_days_on_current_channel;
  let isBot = false;
  if(sqlItem.comments_on_all_channels > 100) {
    if(comments_per_day_by_range_current > 2 || comments_per_day_by_range_all > 2) {
      isBot = true;
    }
    if(comments_per_day_current >= 10 || comments_per_day_all >= 10) {
      isBot = true;
    }
  }
  return {
    channel_id: sqlItem.channel_id,
    channel_url: sqlItem.channel_url,
    isBot,
    comments_on_current_channel: sqlItem.comments_on_current_channel,
    comments_days_diff_currrent : Math.floor(comments_days_diff_currrent),
    comments_per_day_by_range_current:+(comments_per_day_by_range_current.toFixed(2)),

    comments_on_all_channels: sqlItem.comments_on_all_channels,
    comments_days_diff_all : Math.floor(comments_days_diff_all),
    comments_per_day_by_range_all:+(comments_per_day_by_range_all.toFixed(2)),

    comments_per_day_current:  +(comments_per_day_current.toFixed(2)),
    comments_per_day_all: +(comments_per_day_all.toFixed(2)),
  }
}