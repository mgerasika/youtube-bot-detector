import { ILogger, } from '@common/utils/create-logger.utils';
import { allServices, } from './all-services';
import { IStatisticServerRabbitMq, } from '@common/interfaces/statisic-server-rabbit-mq.interface';
import { IUploadToFirebaseBody, IStatisticServerTestBody, IUploadStatisticBody, } from '@common/model/statistic-server.model';

export const statisticServerService: IStatisticServerRabbitMq = {
       testAsync: (body: IStatisticServerTestBody, logger: ILogger) => {
              return allServices.statistic.testAsync(body, logger)
       },
       uploadStatisticAsync: (body: IUploadStatisticBody, logger: ILogger) => {
              return allServices.statistic.uploadStatisticAsync(body, logger)
       },
       uploadToFirebaseAsync: (body: IUploadToFirebaseBody, logger: ILogger) => {
              return allServices.uploadToFirebaseAsync(body, logger)
       },
       channelIdsToFirebaseAsync: (body: undefined, logger: ILogger) => {
              return allServices.channelIdsToFirebaseAsync(body, logger)
       },
};
