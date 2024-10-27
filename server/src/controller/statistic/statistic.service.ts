import { ApiKeyDto, IApiKeyDto } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { rabbit_mq_getConnectionInfoAsync, rabbitMQ_createChannelAsync, rabbitMQ_createConnectionAsync } from '@common/utils/rabbit-mq';
import { sqlAsync } from '@server/sql/sql-async.util';
import { sql_escape } from '@server/sql/sql.util';
import { ENV } from '@server/env';
import { ILogger } from '@common/utils/create-logger.utils';

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
    comment_count: number;
    author_id: string;
    author_url: string;
    id: string;
    published_at: Date;
    video_count: number;
    subscriber_count: number;
    title: string;
}
const getStatisticByVideoAsync = async (video_id: string, logger: ILogger): IAsyncPromiseResult<IStatistic[]> => {
    const [list, error] = await sqlAsync<IApiKeyDto[]>(async (client) => {
        const { rows } = await client.query(`SELECT COUNT(*) AS comment_count, comment.author_id, channel.*
FROM comment
left outer join channel on channel.id = comment.author_id
WHERE comment.video_id = ${sql_escape(video_id)}
GROUP BY comment.author_id, channel.id  order by comment_count desc;`);
        return rows;
    }, logger);
    if(error) {
        return [,error]
    }
    return [getRowsOnlyWithAuthorUrl(list as [])];
};

const getStatisticByChannelAsync = async (channel_id: string, logger: ILogger): IAsyncPromiseResult<IStatistic[]> => {
    const [list, error] = await sqlAsync<IApiKeyDto[]>(async (client) => {
        const { rows } = await client.query(`SELECT COUNT(*) AS comment_count, comment.author_id, channel.*
FROM comment
inner join video on video.id = comment.video_id
left outer join channel on channel.id = comment.author_id
WHERE video.channel_id = ${sql_escape(channel_id)}
GROUP BY comment.author_id, channel.id order by comment_count desc;`);
        return rows;
    }, logger);
    if(error) {
        return [,error]
    }
    return [getRowsOnlyWithAuthorUrl(list as [])];
};

function getRowsOnlyWithAuthorUrl(statistics: IStatistic[]):IStatistic[] {
    return statistics.filter(s => s.author_url);
}

export const statistic = {
    getStatisticByVideoAsync,
    getStatisticByChannelAsync,
    getStatisticInfoAsync
};
