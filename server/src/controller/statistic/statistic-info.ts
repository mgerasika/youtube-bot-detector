import { ApiKeyDto, IApiKeyDto, } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';

import { sql_escape, } from '@server/sql/sql.util';
import { ENV, } from '@server/env';
import { ILogger, } from '@common/utils/create-logger.utils';
import { getStatisticByChannelDetailedAsync, } from './statistic-by-channel-detailed';
import { rabbitMqService, } from '@common/services/rabbit-mq'
import { apiKey, IYoutubeKeyInfo } from '../api-key/api-key.service';
import { allServices } from '../all-services';
import { IVideoInfo } from '../video/video.service';
import { ICommentInfo } from '../comment/comment.service';
import { IStatisticInternalInfo } from '.';
import { IChannelInfo } from '../channel/channel.service';
import { IServerInfoDto } from '@server/dto/server-info.dto';
import { IRabbitMqConnectionInfo } from '@common/model/rabbit-mq-connection-Info.interface';
export interface IStatisticInfo {
    video: IVideoInfo;
    comment: ICommentInfo;
    statistic: IStatisticInternalInfo;
    channel: IChannelInfo;
    missed_statistic_channels: number;
    youtube_key: IYoutubeKeyInfo;
    statistic_rabbit_mq: IRabbitMqConnectionInfo;
    download_rabbit_mq: IRabbitMqConnectionInfo;
    servers: IServerInfoDto[]
}

interface ISqlInfo {
    video_count: number,
    comment_count: number,
    statistic_count: number,
    channel_count: number,
}
export const getStatisticInfoAsync = async (logger: ILogger): IAsyncPromiseResult<IStatisticInfo> => {
    const download_server = await rabbitMqService.getInfoAsync({ channelName: ENV.rabbit_mq_download_channel_name, rabbit_mq_url: ENV.rabbit_mq_url }, logger);
    const statistic_server = await rabbitMqService.getInfoAsync({ channelName: ENV.rabbit_mq_statistic_channel_name, rabbit_mq_url: ENV.rabbit_mq_url }, logger);

    const [youtube_key, youtube_key_error] = await allServices.apiKey.getActiveKeyInfoAsync(logger)
    if (!youtube_key || youtube_key_error) {
        return [, 'invalid info ' + youtube_key_error]
    }

    const [video, video_error] = await allServices.video.getVideoInfoAsync(logger)
    if (!video || video_error) {
        return [, 'invalid info ' + video_error]
    }

    const [comment, comment_error] = await allServices.comment.getCommentsInfoAsync(logger)
    if (!comment || comment_error) {
        return [, 'invalid info ' + comment_error]
    }

    const [statistic, statistic_error] = await allServices.statistic.getStatisticInternalInfoAsync(logger)
    if (!statistic || statistic_error) {
        return [, 'invalid info ' + statistic_error]
    }

    const [channel, channel_error] = await allServices.channel.getChannelsInfoAsync(logger)
    if (!channel || channel_error) {
        return [, 'invalid info ' + channel_error]
    }

    const [serverInfo, serverInfoError] = await allServices.allServerInfo.getServerInfoListAsync(logger)
    if (!serverInfo || serverInfoError) {
        return [, 'invalid info ' + serverInfoError]
    }

    return [{
        video,
        comment,
        statistic,
        channel,
        missed_statistic_channels: (channel.all_keys - statistic.all_keys),
        youtube_key,
        download_rabbit_mq: download_server,
        statistic_rabbit_mq: statistic_server,
        servers: serverInfo
    }];
};
