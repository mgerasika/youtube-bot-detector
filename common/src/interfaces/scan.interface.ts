export interface IScanVideosBody {
    channelId: string;
}

export interface IScanAuthorsBody {
    videoId?: string;
    channelId?: string;
}

export interface IScanChannelInfoBody {
    channelId: string;
    scan_videos: boolean;
}

export interface IScanCommentsBody {
    videoId: string;
}

export interface IScan {
    scanVideosAsync: any;
    scanCommentsAsync : any;
    scanChannelInfoAsync: any;
    scanAuthorsAsync: any;
};