import axios from 'axios';
import { useQuery } from 'react-query';

export const useGetFirebaseStatistic = (authorId:string,enabled:boolean) => {
    return useQuery<IFirebaseBody | undefined>({
        queryKey: ['get-firabase-statistic', authorId],
        enabled,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(10000 * 2 ** attemptIndex, 40000),  
        retryOnMount:false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        queryFn: () => axios.get(`https://storage.googleapis.com/youtube-bot-landing.firebasestorage.app/${authorId}.json?1`).then(response => {
            return deserealizeFirebaseBody(response.data.b);
        }).catch(() => Promise.resolve(undefined))
        
    })
}

export interface IFirebaseBody {
  comment_count: number, 
  published_at_diff: number, 
  days_tick: number, 
  frequency:number, 
  frequency_tick:number
}

export const deserealizeFirebaseBody = (numbers: number[]) : IFirebaseBody => {
  const [comment_count, published_at_diff, days_tick, frequency, frequency_tick] = numbers;
  return {
      comment_count, published_at_diff, days_tick, frequency, frequency_tick
  }

}

