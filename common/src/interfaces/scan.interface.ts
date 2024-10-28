import { ILogger } from "@common/utils/create-logger.utils";
import { IAsyncPromiseResult } from "./async-promise-result.interface";

export interface IFullScanChannelInfoBody {
    channelId: string;
}

export interface IScanChannelInfoBody {
    channelId: string;
}

export interface IScanVideosBody {
    channelId: string;
}


export interface IScanCommentsBody {
    videoId: string;
}

export interface IScanVideoInfoBody {
    videoId: string;
}

export interface IFixBoxy {
    authorIds?: string[];
}
export interface IAddYoutubeKeyBody {
    email:string;
    key:string;
}

export interface IScan {
    fullScanChannelInfoAsync:(body: IFullScanChannelInfoBody, logger: ILogger) => IAsyncPromiseResult<string>;
    scanChannelInfoAsync:(body: IScanChannelInfoBody, logger: ILogger) => IAsyncPromiseResult<string>;
    scanVideosAsync: (body: IScanVideosBody, logger: ILogger) => IAsyncPromiseResult<string>;
    scanCommentsAsync : (body: IScanCommentsBody, logger: ILogger) => IAsyncPromiseResult<string>;
    scanVideoInfoAsync : (body: IScanVideoInfoBody, logger: ILogger) => IAsyncPromiseResult<string>;
    addYoutubeKeyAsync: (body: IAddYoutubeKeyBody, logger: ILogger) => IAsyncPromiseResult<string>;
    fixAsync: (body: IFixBoxy, logger: ILogger) => IAsyncPromiseResult<string>;
};