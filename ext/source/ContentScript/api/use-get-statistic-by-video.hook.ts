import axios from 'axios';
import { ENV } from '../../env';
import { useQuery } from 'react-query';
import { IStatistic } from '../../api.generated';

export const useGetStatisticByVideo = (videoId: string) => {
    return useQuery<IStatistic[]>({
        queryKey: `statistic-by-video-${videoId}`,
        refetchInterval: 10 * 1000,
        queryFn: () => axios.get(`${ENV.api_server_url}/api/statistic/by-video?video_id=${videoId}`).then(response => {
            return response.data;

        })
    })
}