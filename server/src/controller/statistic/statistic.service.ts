import { ApiKeyDto, IApiKeyDto } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult } from '@server/interfaces/async-promise-result.interface';
import { rabbit_mq_getMessageCountAsync, rabbitMQ_createChannelAsync, rabbitMQ_createConnectionAsync } from '@server/rabbit-mq';
import { sqlAsync } from '@server/utils/sql-async.util';
import { sql_escape } from '@server/utils/sql.util';

export interface IStatisticInfo {
    video_count: number;
    comment_count: number;
    channel_count: number;
    rabbitm_mq_messages_count: number;
}

const getStatisticInfoAsync = async (): IAsyncPromiseResult<IStatisticInfo> => {

    const messagesCount = await rabbit_mq_getMessageCountAsync();
    const [data, error] = await sqlAsync<any>(async (client) => {
        const { rows } = await client.query(`SELECT (SELECT COUNT(*) from video) AS video_count,
            (SELECT COUNT(*) from comment) AS comment_count,
            (SELECT COUNT(*) from channel) AS channel_count`);
        return rows.length ? rows[0]: undefined;
    });
    if(error) {
        return [,error]
    }
   
    
    return [{
        video_count: +data.video_count,
        comment_count: +data.comment_count,
        channel_count: +data.channel_count,
        rabbitm_mq_messages_count: messagesCount,

    }];
};

export interface IStatistic {
    comment_count: number;
    author_id: string;
    author_url: string;
}
const getStatisticByVideoAsync = async (video_id?: string): IAsyncPromiseResult<IStatistic[]> => {
    const [list, error] = await sqlAsync<IApiKeyDto[]>(async (client) => {
        const { rows } = await client.query(`SELECT COUNT(*) AS comment_count, comment.author_id, channel.author_url
FROM comment
left outer join channel on channel.id = comment.author_id
WHERE comment.video_id = ${sql_escape(video_id)}
GROUP BY comment.author_id, channel.id  order by comment_count desc;`);
        return rows;
    });
    if(error) {
        return [,error]
    }
    return [removeRowsWithoutAuthorUrl(list as [])];
};

const getStatisticByChannelAsync = async (channel_id?: string): IAsyncPromiseResult<IStatistic[]> => {
    const [list, error] = await sqlAsync<IApiKeyDto[]>(async (client) => {
        const { rows } = await client.query(`SELECT COUNT(*) AS comment_count, comment.author_id, channel.author_url
FROM comment
inner join video on video.id = comment.video_id
left outer join channel on channel.id = comment.author_id
WHERE video.channel_id = ${sql_escape(channel_id)}
GROUP BY comment.author_id, channel.id order by comment_count desc;`);
        return rows;
    });
    if(error) {
        return [,error]
    }
    return [removeRowsWithoutAuthorUrl(list as [])];
};

function removeRowsWithoutAuthorUrl(statistics: IStatistic[]):IStatistic[] {
    return statistics.filter(s => !s.author_url);
}

export const statistic = {
    getStatisticByVideoAsync,
    getStatisticByChannelAsync,
    getStatisticInfoAsync
};
