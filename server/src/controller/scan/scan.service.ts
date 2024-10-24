import { ApiKeyDto, IApiKeyDto } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { nameOf } from '@common/utils/name-of';
import {
    rabbit_mq_getConnectionInfoAsync,
    rabbitMQ_createChannelAsync,
    rabbitMQ_createConnectionAsync,
    rabbitMQ_sendDataAsync,
} from '@common/utils/rabbit-mq';
import { sqlAsync } from '@server/sql/sql-async.util';
import { sql_escape } from '@server/sql/sql.util';
import { ENV } from '@server/env';
import { allServices } from '../all-services';
import {IScan, IScanCommentsBody} from '@common/interfaces/scan.interface';

export interface IScanInfo {
    comment_count: number;
    author_id: string;
    author_url: string;
    id: string;
    published_at: Date;
    video_count: number;
    subscriber_count: number;
    title: string;
}
const getScanByVideoAsync = async (video_id?: string): IAsyncPromiseResult<IScanInfo[]> => {

    const arg: IScanCommentsBody = {
        videoId: video_id || ''
    };
    rabbitMQ_sendDataAsync(
        {
            channelName: ENV.rabbit_mq_channel_name,
            rabbit_mq_url: ENV.rabbit_mq_url,
            redis_url: ENV.redis_url,
        },
        {
            msg: {
                methodName: nameOf<IScan>('scanAuthorsAsync'),
                methodArgumentsJson: arg
            },
        },
    );

    return await allServices.statistic.getStatisticByVideoAsync(video_id);
};

const getScanByChannelAsync = async (channel_id?: string, channel_url?: string): IAsyncPromiseResult<IScanInfo[]> => {
    return await allServices.statistic.getStatisticByChannelAsync(channel_id, channel_url);
};

export const scan = {
    getScanByVideoAsync,
    getScanByChannelAsync,
};
