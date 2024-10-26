import { IAsyncPromiseResult } from "./async-promise-result.interface";

export interface IFullScanChannelInfoBody {
    channelId: string;
}

export interface IScanChannelInfoBody {
    channelId: string;
    // deprecated
    scan_videos?: boolean;
}

export interface IScanVideosBody {
    channelId: string;
}


export interface IScanCommentsBody {
    videoId: string;
}

export interface IScanAuthorsBody {
    videoId?: string;
    channelId?: string;
}
export interface IAddYoutubeKeyBody {
    email:string;
    key:string;
}

export interface IScan {
    fullScanChannelInfoAsync:(body: IFullScanChannelInfoBody) => IAsyncPromiseResult<string>;
    scanChannelInfoAsync:(body: IScanChannelInfoBody) => IAsyncPromiseResult<string>;
    scanVideosAsync: (body: IScanVideosBody) => IAsyncPromiseResult<string>;
    scanCommentsAsync : (body: IScanCommentsBody) => IAsyncPromiseResult<string>;
    scanAuthorsAsync: (body: IScanAuthorsBody) => IAsyncPromiseResult<string>;
    addYoutubeKeyAsync: (body: IAddYoutubeKeyBody) => IAsyncPromiseResult<string>;
};