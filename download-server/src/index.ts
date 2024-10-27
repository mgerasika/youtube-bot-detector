require('module-alias/register');

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env

import { ENV } from '@server/env';
import { allServices } from './controller/all-services';
import { app } from './express-app';
import './controller/all-controllers';
import { rabbitMQ_subscribeAsync } from '@common/utils/rabbit-mq';
import { connectToRedisAsync } from '@common/utils/redis';
import { createLogger } from '@common/utils/create-logger.utils';

const logger = createLogger();
logger.log('ENV=', ENV);

app.get('/', (req, res) => {
    res.send(JSON.stringify(allServices, null, 2));
});

const port = process.env.PORT || 8009;
if (ENV.rabbit_mq_url) {
    rabbitMQ_subscribeAsync({channelName: ENV.rabbit_mq_channel_name, rabbit_mq_url: ENV.rabbit_mq_url},(data) => {
        if (data.msg) {
            const method = (allServices.scan as any)[data.msg.methodName] as Function;
            if(method) {
                return  method.call(allServices.scan, data.msg.methodArgumentsJson, createLogger());
            }
        }
        return Promise.resolve();
    }, logger);
}

if(ENV.redis_url) {
    connectToRedisAsync(ENV.redis_url).then(async redis => {
        logger.log('Connected to Redis');
    });
}

const server = app.listen(port, function () {
    logger.log('Download Server Started on port ' + port);
});
