require('module-alias/register');

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env

import { ENV, } from '@server/env';
import { allServices, } from './controller/all-services';
import './controller/all-controllers';
import { createLogger, } from '@common/utils/create-logger.utils';

import {rabbitMqService,} from '@common/services/rabbit-mq'
import {redisService,} from '@common/services/redis'
import { downloadServerService, } from './controller/download-server.service';
import { app } from './express-app';
import { toQuery } from '@common/utils/to-query.util';
import { api } from './api.generated';
import {startCronJob} from '@common/services/cron.service'
const mainLogger = createLogger();
mainLogger.log('ENV=', ENV);

app.get('/', (req, res) => {
    res.send(JSON.stringify(allServices, null, 2));
});

const port = process.env.PORT || 8009;
if (ENV.rabbit_mq_url) {
    // deprecated
    rabbitMqService.subscribeAsync({
        channelName: 'youtube-bot-filter-queue-v3', 
        rabbit_mq_url: 'amqp://test:Zxc123=-@192.168.0.106:5672'},async (data, logger) => {
        if (data.msg) {
            const method = (downloadServerService as unknown as Record<string,Function>)[data.msg.methodName] as Function;
            if(method) {
                return await method.call(downloadServerService, data.msg.methodArgumentsJson, logger);
            }
        }
        return Promise.resolve();
    }, mainLogger);
    rabbitMqService.subscribeAsync({channelName: ENV.rabbit_mq_download_channel_name, rabbit_mq_url: ENV.rabbit_mq_url},async (data, logger) => {
        if (data.msg) {
            const method = (downloadServerService as unknown as Record<string,Function>)[data.msg.methodName] as Function;
            if(method) {
                return await method.call(downloadServerService, data.msg.methodArgumentsJson, logger);
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

startCronJob('server info', '*/10 * * * *', async () => {
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
    mainLogger.log('Download Server Started on port ' + port);
});
