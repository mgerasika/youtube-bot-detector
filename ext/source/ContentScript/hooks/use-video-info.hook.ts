import { useRef } from "react";
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
    const cacheRef = useRef<Map<string,IVideoInfo>>(new Map());
    const info = useInfinitePolling<IVideoInfo>(() => {
        const search = window.location.search;
        
        const channelId = getChannelId();
        const channelUrl = getChannelUrl();
        const videoId = getVideoId(search); 
        
        if(videoId && channelId && channelUrl) {
            if(!cacheRef.current.has(videoId)) {
                cacheRef.current.set(videoId, {videoId})
            }

            const currentInfo = cacheRef.current.get(videoId)!;

            if(!hasKeyByValue(cacheRef.current, 'channelId', channelId)) {
               currentInfo.channelId = channelId;
            }

            if(!hasKeyByValue(cacheRef.current, 'channelUrl', channelUrl)) {
                currentInfo.channelUrl = channelUrl;
            }

            if (currentInfo.channelId && currentInfo.channelUrl) {
                return currentInfo;
            }
        }

        return undefined;
    }, []) ;
    return info;
}

function hasKeyByValue<TKey,T>(map:Map<TKey,T>,searchKey: keyof T, searchValue:string): boolean {
    for (const value of map.values()) {
        if (value[searchKey] === searchValue) {
            return true;
        }
    }
    return false;
}