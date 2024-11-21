import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { rabbitMqService, } from '@common/services/rabbit-mq'
import { RABBIT_MQ_DOWNLOAD_ENV, RABBIT_MQ_STATISTIC_ENV, } from '@server/env';
import { ILogger, } from '@common/utils/create-logger.utils';
import { IUploadStatisticBody } from '@common/model/statistic-server.model';
import { allServices } from '../all-services';
import { sqlMutationAsync, sqlQueryAsync } from '@server/sql/sql-async.util';
import fs from 'fs';
import path from 'path';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';
import { IFullScanChannelInfoBody } from '@common/model/download-server.model';

const channelToStatisticAsync = async (logger: ILogger): IAsyncPromiseResult<string> => {
    logger.log('channelToStatisticAsync start')

    const sqlFilePath = path.join(__dirname, 'channel-to-statistic.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    logger.log('start insert missed channels into statistic')
    const [data, error] = await sqlMutationAsync<string>(async (client) => {
        const { rows } = await client.mutation<string>(sql);
        return rows;
    }, logger);
    if (error) {
        return [, 'error in sql ' + error];
    }

    logger.log('end insert missed channels into statistic')
    logger.log('response from db', data)


    logger.log('channelToStatisticAsync end')
    return await [''];
};

const statisticToFirebaseAsync = async (logger: ILogger): IAsyncPromiseResult<string> => {
    logger.log('statisticToFirebaseAsync start')

    let page = 0;
    do {
        const [statisticList, statisticError] = await allServices.statistic.getStatisticWithoutHashListAsync(1000, page, logger)
        if (statisticError) {
            return [, logger.log(statisticError)]
        }
        if (!statisticList) {
            return [, 'statistic is empty']
        }

        logger.log('recieved new statistic total = ' + statisticList.total_count + ' items = ' + statisticList.items.length)
        await oneByOneAsync(statisticList.items, async statistic => {
            await rabbitMqService.sendDataAsync<IUploadStatisticBody>(
                RABBIT_MQ_STATISTIC_ENV,
                'uploadStatisticAsync',
                statistic,
                logger
            );
        })
        if (!statisticList.items.length) {
            break;
        }
        page++;
    }
    // eslint-disable-next-line no-constant-condition
    while (true)
    logger.log('statisticToFirebaseAsync end')
    return await [''];
};

const rescanChannelsAsync = async (logger: ILogger): IAsyncPromiseResult<string> => {
    logger.log('rescanChannelsAsync start')

    const [channelList, channelError] = await allServices.channel.getChannelListAllAsync({ is_scannable: true }, logger)
    if (channelError) {
        return [, logger.log(channelError)]
    }
    if (!channelList) {
        return [, 'channelList is empty']
    }
    logger.log('recieved channels to rescan', channelList.length, channelList.map(c=>c.author_url))

    await oneByOneAsync(channelList, async (channel) => {
        logger.log('channel to rescan ', channel.author_url)
        await rabbitMqService.sendDataAsync<IFullScanChannelInfoBody>(
            RABBIT_MQ_DOWNLOAD_ENV,
            'fullScanChannelInfoAsync',
            {
                channelId: channel.id,
                ignoreCommentsLastDate: false,
                ignoreVideoLastDate: false,
            },
            logger
        );
    })

    logger.log('rescanChannelsAsync end')
    return await [''];
};


export const task = {
    channelToStatisticAsync,
    statisticToFirebaseAsync,
    rescanChannelsAsync,
};


