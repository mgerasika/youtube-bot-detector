/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { ILogger } from '@common/utils/create-logger.utils';
import axios from 'axios';

// Your Perspective API key
const API_KEY = 'AIzaSyBkHXhaSG0tbjBjtDEmGnLoCQhMoFCxiBo';

// The URL for the Perspective API
const PERSPECTIVE_API_URL = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

export interface IPerspectiveApiReturn {
    toxicity: number;
    profanity: number;
    severe_toxity:number;
    insult: number;
}
export async function perspectiveApiAsync(comments: string[], logger: ILogger): IAsyncPromiseResult<IPerspectiveApiReturn> {
  // Prepare the request body
  const requestBody = {
    comment: {
      text: comments.join('\n'), // Join comments with newlines to send in one request
    },
    requestedAttributes: {
      TOXICITY: {},
      SEVERE_TOXICITY: {},
      INSULT: {},
      PROFANITY: {},
      // Add more attributes if needed
    },
  };

  try {
    // Send the request to Perspective API
    const response = await axios.post(
      `${PERSPECTIVE_API_URL}?key=${API_KEY}`,
      requestBody
    );

    // Output the results
    logger.log('Analysis Results:', response.data);
    return [{
        toxicity: +response.data?.attributeScores?.TOXICITY?.summaryScore?.value,
        severe_toxity: +response.data?.attributeScores?.SEVERE_TOXICITY?.summaryScore?.value,
        insult: +response.data?.attributeScores?.INSULT?.summaryScore?.value,
        profanity: +response.data?.attributeScores?.PROFANITY?.summaryScore?.value,
    } ]
  } catch (error:any) {
    logger.log('Error analyzing comments:', error?.message);
    return [,'error ' + error]
  }
}


