require('module-alias/register');

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env

import { ENV } from '@server/constants/env';
import { allServices } from './controller/all-services';
import { app } from './express-app';
import './controller/all-controllers';
import { rabbitMQ_subscribeAsync } from '@server/utils/rabbit-mq';
import { connectToRedisAsync } from '@server/utils/redis';

console.log('ENV=', ENV);

app.get('/', (req, res) => {
    res.send(JSON.stringify(allServices, null, 2));
});

const port = process.env.PORT || 8006;
if (ENV.rabbit_mq) {
    rabbitMQ_subscribeAsync((data) => {
        if (data.msg) {
            const method = (allServices.scan as any)[data.msg.methodName] as Function;
            if(method) {
                return  method.call(allServices.scan, data.msg.methodArgumentsJson);
            }
        }
        return Promise.resolve();
    });
}

connectToRedisAsync().then(async redis => {
    console.log('Connected to Redis');
});

// console.log('ENV = ', ENV);
const server = app.listen(port, function () {
    console.log('Download Server Started on port ' + port);
});
