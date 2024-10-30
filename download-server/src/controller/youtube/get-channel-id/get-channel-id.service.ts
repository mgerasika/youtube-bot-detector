import axios from 'axios';
import * as cheerio from 'cheerio';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { ILogger } from '@common/utils/create-logger.utils';

export interface IGetChannelIdBody {
    channelName: string;
}


export const getChannelIdAsync = async (channelName: string, logger: ILogger): IAsyncPromiseResult<string> => {
  logger.log('getChannelIdAsync start', channelName)
    const channelId = await requestChannelIdAsync(channelName, logger);
    if(!channelId) {
        return [,'channel id not found']
    }
    logger.log('getChannelIdAsync end')
    return [channelId];
};


async function requestChannelIdAsync(channelName: string, logger: ILogger): Promise<string | undefined> {
    try {
      // Make a request to the YouTube page of the handle
      const url = `https://www.youtube.com/${channelName}`;
      const response = await axios.get(url);
  
      // Load the HTML into Cheerio
      const $ = cheerio.load(response.data);
  
      // Convert page HTML to text and search for the channelId using a regular expression
      const pageSource: string = $.html();
  
      // Regular expression to match the "channelId" pattern
      const canonicalLinkRegex = /<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[\w-]+)"/;

    // Search for the first occurrence of the canonical link
    const match = pageSource.match(canonicalLinkRegex);
      if (match && match[1]) {
        const channelId = match[1];
        logger.log(`Channel ID: ${channelId}`);
        return channelId;
      } else {
        logger.log('Channel ID not found.');
      }
    } catch (error) {
      logger.log(`Error fetching page or parsing data: ${(error as Error).message}`);
    }
  }

