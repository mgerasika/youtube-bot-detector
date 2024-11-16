import { ILogger } from "@common/utils/create-logger.utils";
import { IAsyncPromiseResult } from "./async-promise-result.interface";
import { IFullScanChannelInfoBody, IScanChannelInfoBody, IScanVideosBody, IScanCommentsBody, IScanVideoInfoBody, IAddYoutubeKeyBody, IDownloadServerTestBody, IFullScanVideoInfoBody, IScanCommentsReturn } from "@common/model/download-server.model";
import { IScanReturn } from "./rabbitm-mq-return";


export interface IDownloadServerRabbitMq {
    fullScanChannelInfoAsync:(body: IFullScanChannelInfoBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    fullScanVideoInfoAsync:(body: IFullScanVideoInfoBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    
    scanVideoInfoAsync : (body: IScanVideoInfoBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    scanChannelInfoAsync:(body: IScanChannelInfoBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    scanVideosAsync: (body: IScanVideosBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    scanCommentsAsync : (body: IScanCommentsBody, logger: ILogger) => IAsyncPromiseResult<IScanCommentsReturn>;
    addYoutubeKeyAsync: (body: IAddYoutubeKeyBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    testAsync: (body: IDownloadServerTestBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
};