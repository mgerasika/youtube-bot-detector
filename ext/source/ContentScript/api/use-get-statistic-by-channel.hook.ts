import axios from 'axios';
import { ENV } from '../../env';
import { useQuery } from 'react-query';
import { IStatisticInfo } from '../../api.generated';

export const useGetStatisticByChannel = (channelId: string) => {
    return useQuery<IStatisticInfo[]>({
        queryKey: `statistic-by-channel-${channelId}`,
        refetchInterval: 30 * 1000,
        queryFn: () => axios.get(`${ENV.api_server_url}api/statistic/by-channel?channel_id=${channelId}`).then(response => {
            return response.data;

        })
    })
}