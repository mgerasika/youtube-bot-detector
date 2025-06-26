import axios from 'axios';
import { useMutation } from 'react-query';

export const useAddToScanList = (channelId:string) => {
    return useMutation<string>({
        mutationKey: ['scan-full-by-channel', channelId],
        mutationFn: () => axios.get(`https://192.168.0.106:8078/api/scan/full-by-channel?channel_id=${channelId}`)
    })
}

