import { ApiKeyDto, IApiKeyDto } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { rabbit_mq_getConnectionInfoAsync, rabbitMQ_createChannelAsync, rabbitMQ_createConnectionAsync } from '@common/utils/rabbit-mq';
import { sqlAsync } from '@server/sql/sql-async.util';
import { sql_escape } from '@server/sql/sql.util';
import { ENV } from '@server/env';
import { ILogger } from '@common/utils/create-logger.utils';
import { getStatisticByChannelAsync } from './statistic-by-channel';

export interface IStatisticInfo {
    video_count: number;
    comment_count: number;
    channel_count: number;
    rabbitm_mq_messages_count: number;
    rabbitm_mq_consumer_count: number;
    youtube_accounts_count: number;
}

export const getStatisticInfoAsync = async ( logger: ILogger): IAsyncPromiseResult<IStatisticInfo> => {
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
