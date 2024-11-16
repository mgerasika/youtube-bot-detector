import { useEffect } from "react";
import { useGetAuthorId } from "../api/use-get-author-id.hook";
import { IFirebaseBody, useGetFirebaseStatistic } from "../api/use-get-firebase-statistic.hook";
import { useChannelIndexedDB } from "./use-channel-index-db.hook";

interface IProps {
  channelUrl: string | undefined;
}
interface IReturn {
  authorId: string | undefined;
  statistic: IFirebaseBody | undefined;
}
export function useStatistic({channelUrl}: IProps): IReturn {
  const {fetchChannel,addChannel, channel, isConnected} = useChannelIndexedDB();
  // request authorId only if not found in indexDb
  const {data:idFromYoutubeRequest} = useGetAuthorId(channelUrl || '', channel === null)

  useEffect(() => {
    if(isConnected && channelUrl) {
      fetchChannel(channelUrl);
    }
  },[channelUrl, fetchChannel, isConnected]);

  
  useEffect(() =>{
    if(isConnected && idFromYoutubeRequest && channelUrl) {
      addChannel({channelId: idFromYoutubeRequest, channelUrl})
    }
  },[addChannel, idFromYoutubeRequest, channelUrl, isConnected])

 const authorId = channel?.channelId || idFromYoutubeRequest || '';
  const {data: statistic} = useGetFirebaseStatistic(authorId, !!authorId)
  return {
    authorId: authorId,
    statistic
  };
}
