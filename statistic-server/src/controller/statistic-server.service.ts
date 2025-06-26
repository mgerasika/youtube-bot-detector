import { ILogger, } from '@common/utils/create-logger.utils';
import { allServices, } from './all-services';
import { IStatisticServerRabbitMq, } from '@common/interfaces/statisic-server-rabbit-mq.interface';
import { IChannelIdsToFirebaseBody, IStatisticServerTestBody, IUploadStatisticBody, } from '@common/model/statistic-server.model';

export const statisticServerService: IStatisticServerRabbitMq = {
       testAsync: (body: IStatisticServerTestBody, logger: ILogger) => {
              return allServices.statistic.testAsync(body, logger)
       },
       uploadStatisticAsync: (body: IUploadStatisticBody, logger: ILogger) => {
              return allServices.statistic.uploadStatisticAsync(body, logger)
       },
       channelIdsToFirebaseAsync: (body: IChannelIdsToFirebaseBody, logger: ILogger) => {
              return allServices.statistic.channelIdsToFirebaseAsync(body, logger)
       },
};
