import axios from 'axios';
import { ENV } from '../../env';
import { useQuery } from 'react-query';

export const useGetFullScanByChannel = (channelId:string) => {
    return useQuery({
        queryKey: ['useGetFullScanByChannel', channelId],
        enabled:!!channelId,
        queryFn: () => axios.get(`${ENV.api_server_url}/api/scan/full-by-channel?channel_id=${channelId}`).then(response => {
            return response.data;
        })
        
    })
}