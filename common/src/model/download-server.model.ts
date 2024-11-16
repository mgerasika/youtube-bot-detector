import { IScanReturn } from "@common/interfaces/rabbitm-mq-return";

export interface IAddYoutubeKeyBody {
    email: string;
    key: string;
}export interface IDownloadServerTestBody {
    authorIds?: string[];
}
export interface IFullScanChannelInfoBody {
    channelId: string;
    ignoreVideoLastDate:boolean;
    ignoreCommentsLastDate:boolean;
}

export interface IScanChannelInfoBody {
    channelIds: string[];
}

export interface IScanVideosBody {
    channelId: string;
    ignoreVideoLastDate:boolean;
    ignoreCommentsLastDate:boolean;
}

export interface IScanCommentsBody {
    videoId: string;
    ignoreCommentsLastDate:boolean;
}
export interface IScanCommentsReturn extends IScanReturn {
    missedChannelIds?: string[]
    uniqueChannelIds?: string[]
}

export interface IScanVideoInfoBody {
    videoId: string;
}

export interface IFullScanVideoInfoBody {
    video_id: string;
    ignoreCommentsLastDate: boolean;
}

