import axios from 'axios';
import { useQuery } from 'react-query';

export const useGetFirebaseChannelsList = () => {
    return useQuery<IChannelList | undefined>({
        queryKey: ['get-firabase-channels-list'],
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(10000 * 2 ** attemptIndex, 40000),  
        retryOnMount:false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        queryFn: () => axios.get(`https://storage.googleapis.com/youtube-bot-landing.firebasestorage.app/channel-ids.json?time=` + new Date().toLocaleDateString()).then(response => {
            return response.data;
        }).catch(() => Promise.resolve(undefined))
        
    })
}

export interface IChannelList {
    channel_ids: string[];
}



