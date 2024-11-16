
import { ILogger, } from '@common/utils/create-logger.utils';
import { allServices, } from './all-services';
import { IDownloadServerRabbitMq, } from '@common/interfaces/download-server-rabbit-mq.interface';
import { IFullScanChannelInfoBody, IFullScanVideoInfoBody, IScanVideoInfoBody, IScanChannelInfoBody, IScanVideosBody, IScanCommentsBody, IAddYoutubeKeyBody, IDownloadServerTestBody, } from '@common/model/download-server.model';

export const downloadServerService: IDownloadServerRabbitMq = {
       fullScanChannelInfoAsync:(body: IFullScanChannelInfoBody, logger: ILogger) => {
              return allServices.scan.fullScanChannelInfoAsync(body, logger);
       },
       fullScanVideoInfoAsync:(body: IFullScanVideoInfoBody, logger: ILogger) => {
              return allServices.scan.fullScanVideoInfoAsync(body, logger)
       },
       
       scanVideoInfoAsync : (body: IScanVideoInfoBody, logger: ILogger) => {
              return allServices.scan.scanVideoInfoAsync(body, logger)
       },
       scanChannelInfoAsync:(body: IScanChannelInfoBody, logger: ILogger) =>{
              return allServices.scan.scanChannelInfoAsync(body, logger)
       },
       scanVideosAsync: (body: IScanVideosBody, logger: ILogger) => {
              return allServices.scan.scanVideosAsync(body, logger)
       },
       scanCommentsAsync : (body: IScanCommentsBody, logger: ILogger) => {
              return allServices.scan.scanCommentsAsync(body, logger)
       },
       addYoutubeKeyAsync: (body: IAddYoutubeKeyBody, logger: ILogger) =>{
              return allServices.scan.addYoutubeKeyAsync(body, logger)
       },
       testAsync: (body: IDownloadServerTestBody, logger: ILogger) => {
              return allServices.scan.testAsync(body, logger)
       },
       
};
