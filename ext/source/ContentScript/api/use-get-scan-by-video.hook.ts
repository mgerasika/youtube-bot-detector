import axios from 'axios';
import { ENV } from '../../env';
import { useQuery } from 'react-query';

export const useGetScanByVideo = (videoId: string) => {
    return useQuery({
        queryKey: `scan-by-video-${videoId}`,
        refetchInterval: 10 * 1000,
        queryFn: () => axios.get(`${ENV.api_server_url}/api/scan/by-video?video_id=${videoId}`).then(response => {
            return response.data;

        })
    })
}