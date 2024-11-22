require('module-alias/register');

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env

import { ENV, } from '@server/env';
import { allServices, } from './controller/all-services';

import './controller/all-controllers';
import {rabbitMqService,} from '@common/services/rabbit-mq'
import {redisService,} from '@common/services/redis'
import { createLogger, } from '@common/utils/create-logger.utils';
import { statisticServerService, } from './controller/statistic-server.service';
import { app } from './express-app';
import {startCronJob} from '@common/services/cron.service'
import { toQuery } from '@common/utils/to-query.util';
import { api } from './api.generated';
import {COMMON_CONST} from '@common/const'

const mainLogger = createLogger();
mainLogger.log('ENV=', ENV);

app.get('/', (req, res) => {
    res.send(JSON.stringify(allServices, null, 2));
});

const port = process.env.PORT || 8003;
if (ENV.rabbit_mq_url) {
    rabbitMqService.subscribeAsync({channelName: ENV.rabbit_mq_statistic_channel_name, rabbit_mq_url: ENV.rabbit_mq_url},async (data, logger) => {
        if (data.msg) {
            const method = (statisticServerService as unknown as Record<string, Function>)[data.msg.methodName] as Function;
            if(method) {
                return await method.call(statisticServerService, data.msg.methodArgumentsJson, logger);
            }
        }
        return Promise.resolve();
    }, mainLogger);
}

if(ENV.redis_url) {
    redisService.connectAsync(ENV.redis_url, mainLogger).then(async redis => {
        mainLogger.log('Connected to Redis');
    });
}

startCronJob('server-info', `*/${COMMON_CONST.SERVER_INFO_UPDATE_MINUTES} * * * *`, async () => {
    const [serverInfo, serverInfoError] = await allServices.serverInfo.getServerInfoAsync(mainLogger)
    if(serverInfoError) {
        mainLogger.log('cron job serverInfo error ', serverInfoError)
    }
    if(serverInfo) {
        const ipWithPort = serverInfo.ipV4 + ':' + port
        
        const [,postError] = await toQuery(() => api.allServerInfoPost({ id: `${serverInfo.serverName} - ${ipWithPort}`,
            name: serverInfo.serverName ,
            ip: ipWithPort,
            memory_info: serverInfo.memory}));
       

        if(postError) {
            mainLogger.log('cron job serverInfo post error', postError)
        }
    }
}, mainLogger)

app.listen(port, function () {
    mainLogger.log('Statistic Server Started on port ' + port);
});
