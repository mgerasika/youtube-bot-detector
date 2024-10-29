import axios from 'axios';
import { ENV } from '../../env';
import { useQuery } from 'react-query';

export const useGetFullScanByVideo = (videoId: string,channelId:string) => {
    return useQuery({
        queryKey: ['useGetFullScanByVideo', videoId,channelId],
        enabled: !!videoId && !!channelId,
        queryFn: () => axios.get(`${ENV.api_server_url}/api/scan/full-by-video?video_id=${videoId}&channel_id=${channelId}`).then(response => {
            return response.data;
        })
        
    })
}