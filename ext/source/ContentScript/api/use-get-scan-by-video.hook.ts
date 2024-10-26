import axios from 'axios';
import { ENV } from '../../env';
import { useQuery } from 'react-query';

export const useGetScanByVideo = (videoId: string) => {
    return useQuery(`scan-by-video-${videoId}`, () => axios.get(`${ENV.api_server_url}api/scan/by-video?video_id=${videoId}`).then(response => {
        console.log('scan by video = ', response.data)
        return response.data;

    }) )
}