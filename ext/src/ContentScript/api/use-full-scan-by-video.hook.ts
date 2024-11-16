import axios from 'axios';
import { ENV } from '../../env';
import { useQuery } from 'react-query';

export const useFullScanByVideo = (videoId: string) => {
    return useQuery({
        queryKey: ['useFullScanByVideo', videoId],
        enabled: !!videoId ,
        retry: false,
        refetchOnMount: false,
        queryFn: () => axios.get(`${ENV.api_server_url}/api/scan/full-by-video?video_id=${videoId}`).then(response => {
            return response.data;
        })
        
    })
}