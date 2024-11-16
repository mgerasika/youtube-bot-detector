/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import OpenAI from 'openai';
import { ILogger } from '@common/utils/create-logger.utils';
import { toQuery } from '@common/utils/to-query.util';
import { openAIAsync } from './open-ai.service';
import { perspectiveApiAsync } from './perspective-api.service';
import { sqlAsync } from '@server/sql/sql-async.util';
import { sql_escape } from '@server/sql/sql.util';
import { huggingFaceAsync } from './hugging-face.service';


// UC_PcSvU5ZczCqLRrIgzDrbg 4.81

export const testAsync = async (logger: ILogger): IAsyncPromiseResult<unknown> => {
    logger.log('testAsync start');

    const id = 'UCfppUojvDPTw1u2FjoEMMug'
    const [comment, commentError] = await sqlAsync<any>(async (client) => {
        const {rows} = await client.query<any>(`SELECT STRING_AGG(text, '\n') AS combined_text
        FROM (
            SELECT text
            FROM public.comment
            WHERE author_id = ${sql_escape(id)}
            ORDER BY RANDOM()
            LIMIT 10
        ) AS random_comments;`);
         if(!rows?.length) {
            return [,  'not found'] 
         }
        return rows[0].combined_text;
    }, logger)
    if(commentError) {
        return [,commentError]
    }
    logger.log('comment', comment)
    const  res = await huggingFaceAsync(comment, logger);
    return res as any;
};


