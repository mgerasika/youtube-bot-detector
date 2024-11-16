import 'server-only'
import axios from "axios";
import { IStatisticInfo } from "@/api.generated";
import { ENV } from "../../env";
import { cache } from 'react'

interface IProps {
  commentsCount: number;
  channelsCount: number;
}

 export const getStatisticInfoAsync =  cache(async (): Promise<IProps> => {
  if(process.env.NODE_ENV === 'development') {
    return {
      channelsCount:0,
      commentsCount:0
    }
  }
  const response = await axios.get<IStatisticInfo>(ENV.api_server_url + '/api/statistic/info')
  return {
     channelsCount: response.data.channel.all_keys,
     commentsCount: response.data.comment.all_keys
  };
});