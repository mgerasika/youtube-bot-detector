import axios from 'axios';
import * as cheerio from 'cheerio';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { ILogger } from '@common/utils/create-logger.utils';

export interface IGetShortChannelInfoBody {
    channelId: string;
}


// TODO add support string | null in code generator.
export interface IShortChannelInfo {
  channelId: string;
  publishedAt: string;
  photo?: string;
  title: string;
  authorUrl?: string;
}

export const getShortChannelInfoAsync = async (channelId: string, logger: ILogger): IAsyncPromiseResult<IShortChannelInfo> => {
    const channelInfo = await requestChannelInfoAsync(channelId, logger);
    if(!channelInfo) {
        return [,'channel id not found']
    }
    return [channelInfo];
};


async function requestChannelInfoAsync(channelId: string, logger: ILogger): Promise<IShortChannelInfo | undefined> {
    try {
      // Make a request to the YouTube page of the handle
      const url = `https://www.youtube.com/channel/${channelId}`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36'
        }
      });
  
      // Load the HTML into Cheerio
      const $ = cheerio.load(response.data);
  
      // Convert page HTML to text and search for the channelId using a regular expression
      // Extract channel name
    const channelName = $('meta[property="og:title"]').attr('content');

    // Extract avatar URL
    const avatarUrl = $('meta[property="og:image"]').attr('content');


    const publishedAtMatch = response.data.match(/"publishedAt":"(.*?)"/);
    const publishedAt = publishedAtMatch ? publishedAtMatch[1] : null;
    return {
      channelId: channelId,
      publishedAt: publishedAt,
      photo: avatarUrl,
      title: [channelName].join(' - '),
      authorUrl: getAuthorUrl(response.data),
    }
    } catch (error) {
      console.error(`Error fetching page or parsing data: ${(error as Error).message}`);
    }
  }

function getAuthorUrl(html:string): string | undefined {
  const regex = /"canonicalBaseUrl":"\/(@[a-zA-Z0-9_]+)"/;
const match = html.match(regex);

if (match) {
  const handle = match[1];
  return handle
} 
}