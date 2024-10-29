import { ApiKeyDto, IApiKeyDto } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { rabbit_mq_getConnectionInfoAsync, rabbitMQ_createChannelAsync, rabbitMQ_createConnectionAsync } from '@common/utils/rabbit-mq';
import { sqlAsync } from '@server/sql/sql-async.util';
import { sql_escape } from '@server/sql/sql.util';
import { ENV } from '@server/env';
import { ILogger } from '@common/utils/create-logger.utils';
import { getStatisticByGroup } from './group-statistic';

export interface IStatisticInfo {
    video_count: number;
    comment_count: number;
    channel_count: number;
    rabbitm_mq_messages_count: number;
    rabbitm_mq_consumer_count: number;
    youtube_accounts_count: number;
}

const getStatisticInfoAsync = async ( logger: ILogger): IAsyncPromiseResult<IStatisticInfo> => {
    const {consumerCount, messageCount} = await rabbit_mq_getConnectionInfoAsync({channelName: ENV.rabbit_mq_channel_name, rabbit_mq_url:ENV.rabbit_mq_url }, logger);
    const [data, error] = await sqlAsync<any>(async (client) => {
        const { rows } = await client.query(`SELECT (SELECT COUNT(*) from video) AS video_count,
            (SELECT COUNT(*) from comment) AS comment_count,
            (SELECT COUNT(*) from api_key) AS youtube_accounts_count,
            (SELECT COUNT(*) from channel) AS channel_count`);
        return rows.length ? rows[0]: undefined;
    }, logger);
    if(error) {
        return [,error]
    }
    
    return [{
        video_count: +data.video_count,
        comment_count: +data.comment_count,
        channel_count: +data.channel_count,
        youtube_accounts_count: +data.youtube_accounts_count,
        rabbitm_mq_messages_count: messageCount,
        rabbitm_mq_consumer_count: consumerCount,

    }];
};

export interface IStatistic {
    comments_on_all_channels: number;
    comments_on_current_channel: number;
   
    channel_id: string;
    channel_url: string;
    id: string;
    channel_published_at: Date;
    min_comment_publish_date: Date;
    max_comment_publish_date: Date;
    
}

const getStatisticByChannelAndVideoAsync = async (channel_id: string,video_id: string, logger: ILogger): IAsyncPromiseResult<IStatistic[]> => {
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
--     LEFT JOIN 
--       channel AS ch1 ON ch1.id = c1.author_id
--     LEFT JOIN 
--       channel AS chm ON chm.id = v1.channel_id
    WHERE 
      c1.author_id = comment.author_id and v1.channel_id = video.channel_id
  ) as comments_on_current_channel,



  (SELECT MIN(c1.published_at_time) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
--     LEFT JOIN 
--       channel AS ch1 ON ch1.id = c1.author_id
--     LEFT JOIN 
--       channel AS chm ON chm.id = v1.channel_id
    WHERE 
      c1.author_id = comment.author_id 
) as min_comment_publish_date,
  

  (SELECT MAX(c1.published_at_time) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
--     LEFT JOIN 
--       channel AS ch1 ON ch1.id = c1.author_id
--     LEFT JOIN 
--       channel AS chm ON chm.id = v1.channel_id
    WHERE 
      c1.author_id = comment.author_id 
) as max_comment_publish_date,

  (SELECT COUNT(*) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
--     LEFT JOIN 
--       channel AS ch1 ON ch1.id = c1.author_id
--     LEFT JOIN 
--       channel AS chm ON chm.id = v1.channel_id
    WHERE 
      c1.author_id = comment.author_id 
) as comments_on_all_channels
  
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
    return [getRowsOnlyWithAuthorUrl(list as [])];
};

const getStatisticByChannelAsync = async (channel_id: string, logger: ILogger): IAsyncPromiseResult<IStatistic[]> => {
    const [list, error] = await sqlAsync<IApiKeyDto[]>(async (client) => {
        const { rows } = await client.query(`WITH days_difference AS (
    SELECT 
        (MAX(published_at) - MIN(published_at)) AS days_difference
    FROM 
        video
    WHERE 
        channel_id = ${sql_escape(channel_id)}
),

comment_counts AS (
    SELECT 
        COUNT(*) AS comment_count, 
        comment.author_id, 
        channel.*
    FROM 
        comment
    INNER JOIN 
        video ON video.id = comment.video_id
    LEFT OUTER JOIN 
        channel ON channel.id = comment.author_id
    WHERE 
        video.channel_id = ${sql_escape(channel_id)}
    GROUP BY 
        comment.author_id, 
        channel.id
)

SELECT 
    (cc.comment_count::float / dd.days_difference) AS comment_frequency,
    dd.days_difference,
    cc.*
FROM 
    comment_counts cc
CROSS JOIN 
    days_difference dd
ORDER BY 
    comment_frequency DESC;
`);
        return rows;
    }, logger);
    if(error) {
        return [,error]
    }
    return [getRowsOnlyWithAuthorUrl(list as [])];
};

function getRowsOnlyWithAuthorUrl(statistics: IStatistic[]):IStatistic[] {
    return statistics.filter(s => s.channel_url);
}

export const statistic = {
    getStatisticByChannelAsync,
    getStatisticByChannelAndVideoAsync,
    getStatisticInfoAsync,
    getStatisticByGroup
};
