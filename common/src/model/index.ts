
export interface IAddYoutubeKeyBody {
    email: string;
    key: string;
}export interface IFixBoxy {
    authorIds?: string[];
}
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

