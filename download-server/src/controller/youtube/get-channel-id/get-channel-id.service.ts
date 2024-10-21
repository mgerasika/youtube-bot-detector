import axios from 'axios';
import * as cheerio from 'cheerio';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';

export interface IGetChannelIdBody {
    channelName: string;
}


export const getChannelIdAsync = async (channelName: string): IAsyncPromiseResult<string> => {
    const channelId = await requestChannelIdAsync(channelName);
    if(!channelId) {
        return [,'channel id not found']
    }
    return [channelId];
};


async function requestChannelIdAsync(channelName: string): Promise<string | undefined> {
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
        console.log(`Channel ID: ${channelId}`);
        return channelId;
      } else {
        console.log('Channel ID not found.');
      }
    } catch (error) {
      console.error(`Error fetching page or parsing data: ${(error as Error).message}`);
    }
  }

