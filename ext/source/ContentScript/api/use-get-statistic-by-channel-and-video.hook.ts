import axios from 'axios';
import { ENV } from '../../env';
import { useQuery } from 'react-query';
import { IStatistic } from '../../api.generated';

export const useGetStatisticByChannelAndVideo = (channelId: string, videoId: string) => {
    return useQuery<IStatistic[]>({
        queryKey: `statistic-by-channel-${channelId}-and-video-${videoId}`,
        refetchInterval: 30 * 1000,
        queryFn: () => axios.get(`${ENV.api_server_url}/api/statistic/by-channel-and-video?channel_id=${channelId}&video_id=${videoId}`).then(response => {
            return response.data;

        })
    })
}