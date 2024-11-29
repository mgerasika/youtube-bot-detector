import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env

import { ENV, RABBIT_MQ_DOWNLOAD_ENV, RABBIT_MQ_STATISTIC_ENV, } from '@server/env';

import { allServices, } from './controller/all-services';
import { typeOrmQueryAsync, typeOrmQueryInternalAsync, } from './sql/type-orm-async.util';
import {rabbitMqService,} from '@common/services/rabbit-mq'
import https from 'https';
import { createLogger, } from '@common/utils/create-logger.utils';
import { app } from './express-app';
import { httpOptions } from '@common/create-express-app';
import { IExpressRequest } from '@common/interfaces/express.interface';
import {startCronJob} from '@common/services/cron.service'
import { toQuery } from '@common/utils/to-query.util';
import { telegramBot } from './telegram.service';
import { EDbType } from './enum/db-type.enum';
export * from './controller/all-controllers';
import {COMMON_CONST} from '@common/const'

const mainLogger = createLogger();
mainLogger.log('ENV=', ENV);

app.get('/', (_req: IExpressRequest, res: { send: (arg0: string) => void; }) => {
    res.send(JSON.stringify(allServices, null, 2));
});

if (process.env.NODE_ENV === 'development') {
    // sync database
    mainLogger.log('before sync orm')
    typeOrmQueryInternalAsync( EDbType.master, () => Promise.resolve(['']), mainLogger);
    typeOrmQueryInternalAsync( EDbType.slave, () => Promise.resolve(['']), mainLogger);
    mainLogger.log('after sync orm')
}

const port = process.env.PORT || 8007;
const ports = process.env.PORTS || 8008;
if (ENV.rabbit_mq_url) {
    rabbitMqService.createConnectionAsync(RABBIT_MQ_DOWNLOAD_ENV, mainLogger); 
    rabbitMqService.createConnectionAsync(RABBIT_MQ_STATISTIC_ENV, mainLogger); 
}

startCronJob('rescanChannelsAsync & channelToStatisticAsync & statisticToFirebaseAsync', '0 * * * *', async () => {
    await allServices.task.rescanChannelsAsync(mainLogger);
    await allServices.task.channelToStatisticAsync(mainLogger);
    await allServices.task.statisticToFirebaseAsync(mainLogger);
}, mainLogger)


telegramBot.subscribe(mainLogger);

startCronJob('server-info', `*/${COMMON_CONST.SERVER_INFO_UPDATE_MINUTES} * * * *`, async () => {
    const [serverInfo, serverInfoError] = await allServices.serverInfo.getServerInfoAsync(mainLogger)
    if(serverInfoError) {
        mainLogger.log('cron job serverInfo error ', serverInfoError)
    }
    if(serverInfo) {
        const ipWithPort = serverInfo.ipV4 + ':' + port
        const [, postError] = await allServices.allServerInfo.postServerInfoAsync({
            id: `${serverInfo.serverName} - ${ipWithPort}`,
            name: serverInfo.serverName ,
            ip: ipWithPort,
            memory_info: serverInfo.memory
        }, mainLogger);

        if(postError) {
            mainLogger.log('cron job serverInfo post error', postError)
        }
    }
}, mainLogger)

app.listen(port, function () {
    mainLogger.log('Server started on port ' + port);
});

https.createServer(httpOptions, app).listen(ports, () => {
    mainLogger.log('Https server started on port ' + ports);
});
