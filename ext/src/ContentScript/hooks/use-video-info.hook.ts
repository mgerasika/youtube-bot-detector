import { getChannelId } from "../utils/get-channel-id.util";
import { getChannelUrl } from "../utils/get-channel-url.util";
import { getVideoId } from "../utils/get-video-id.util";
import { useInfinitePolling } from "./use-infinite-pooling.hook";

interface IVideoInfo {
    videoId?: string;
    channelId?: string;
    channelUrl?: string;
}

export const useVideoInfo = () : IVideoInfo | undefined => {
    const info = useInfinitePolling<IVideoInfo>(() => {
        const search = window.location.search;
        
        const channelId = getChannelId();
        const channelUrl = getChannelUrl();
        const videoId = getVideoId(search); 
        
        if(videoId && channelId && channelUrl) {
           return {
            videoId,
            channelId,
            channelUrl
           }
        }

        return undefined;
    }, []) ;
    return info;
}
