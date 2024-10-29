import { ILogger } from "@common/utils/create-logger.utils";
import { IAsyncPromiseResult } from "./async-promise-result.interface";
import { IFullScanChannelInfoBody, IScanChannelInfoBody, IScanVideosBody, IScanCommentsBody, IScanVideoInfoBody, IAddYoutubeKeyBody, ITestBody, IFullScanVideoInfoBody } from "@common/model";

export interface IScanReturn {
    hasChanges?: boolean;
    message?: string;
}
export interface IScan {
    fullScanChannelInfoAsync:(body: IFullScanChannelInfoBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    fullScanVideoInfoAsync:(body: IFullScanVideoInfoBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    
    scanVideoInfoAsync : (body: IScanVideoInfoBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    scanChannelInfoAsync:(body: IScanChannelInfoBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    scanVideosAsync: (body: IScanVideosBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    scanCommentsAsync : (body: IScanCommentsBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    addYoutubeKeyAsync: (body: IAddYoutubeKeyBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    testAsync: (body: ITestBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
};