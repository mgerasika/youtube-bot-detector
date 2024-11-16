import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { ILogger } from '@common/utils/create-logger.utils';
import axios from 'axios';

function truncateText(text:string, maxLength = 512) {
    const words = text.split(' ');
    let truncatedText = '';
    
    for (let i = 0; i < words.length; i++) {
      if ((truncatedText + words[i]).length <= maxLength) {
        truncatedText += words[i] + ' ';
      } else {
        break;
      }
    }
  
    return truncatedText.trim();
  }

export async function huggingFaceAsync(content: string, logger: ILogger): IAsyncPromiseResult<string> {
    // const content = truncateText(input)
    const API_TOKEN = `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`;
  // URL для доступу до моделі "unitary/toxic-bert"
const MODEL_URL = 'https://api-inference.huggingface.co/models/unitary/toxic-bert';


    try {
        
        const response = await axios.post(
            MODEL_URL,
            { inputs: content },
            {
              headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json',
              },
            }
          );
      
          return response.data;
    } catch (error) {
        logger.log('Error generating haiku:', error);
        return [, '' + error];
    }
    return [''];
}
