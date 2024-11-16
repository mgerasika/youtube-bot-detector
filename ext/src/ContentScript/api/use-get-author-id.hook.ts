import axios from 'axios';
import { useQuery } from 'react-query';

export const useGetAuthorId = (authorUrl:string, enabled: boolean) => {
    return useQuery<string>({
        queryKey: ['get-author-id', authorUrl],
        enabled,
        queryFn: () => axios.get(`https://www.youtube.com/${authorUrl}`).then(response => {
            const html = response.data;
            const canonicalLinkRegex = /<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]+)"/;

            // Search for the first occurrence of the canonical link
            const match = html.match(canonicalLinkRegex);
              if (match && match[1]) {
                
                const channelId = match[1];
                console.log('mylog-youtube id', channelId)
                return channelId;
              } else {
                return '';
              }
        })
        
    })
}

