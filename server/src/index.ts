require('module-alias/register');
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env

import { ENV } from '@server/env';
import { rabbitMQ_createConnectionAsync, rabbitMQ_subscribeAsync } from '@common/utils/rabbit-mq';
import { allServices } from './controller/all-services';
import { app, httpOptions } from './express-app';
import { typeOrmAsync } from './sql/type-orm-async.util';
import { connectToRedisAsync } from '@common/utils/redis';
import https from 'https';
import { createLogger } from '@common/utils/create-logger.utils';
export * from './controller/all-controllers';

const logger = createLogger();
logger.log('ENV=', ENV);

app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
    res.send(JSON.stringify(allServices, null, 2));
});

if (process.env.NODE_ENV === 'development') {
    // sync database
    typeOrmAsync(() => Promise.resolve(['']), logger);
}

const port = process.env.PORT || 8007;
const ports = process.env.PORTS || 8008;
if (ENV.rabbit_mq_url) {
    // rabbitMQ_subscribeAsync((data) => {
    //     if (data.setupBody) {
    //         logger.log('Recived here')
    //     }
    //     return Promise.resolve('empty');
    // });

    
    rabbitMQ_createConnectionAsync({channelName: ENV.rabbit_mq_channel_name, rabbit_mq_url: ENV.rabbit_mq_url}, logger); 
    connectToRedisAsync(ENV.redis_url || '').then(async redis => {
        logger.log('Connected to Redis');
    });
}
app.listen(port, function () {
    logger.log('Server started on port ' + port);
});

https.createServer(httpOptions, app).listen(ports, () => {
    logger.log('Https server started on port ' + ports);
});
