import { ApiKeyDto, IApiKeyDto } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { sqlAsync } from '@server/sql/sql-async.util';
import { sql_escape } from '@server/sql/sql.util';
import { typeOrmAsync } from '@server/sql/type-orm-async.util';
import { ILogger } from '@common/utils/create-logger.utils';
import { RABBIT_MQ_ENV } from '@server/env';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { IAddYoutubeKeyBody } from '@common/model';

const getActiveApiKeyAsync = async (old_key: string | undefined, logger: ILogger): IAsyncPromiseResult<IApiKeyDto> => {
    logger.log('OLD_KEY', old_key)
    if (old_key) {
        // update old key, set expired to NOW()
        const [, updateError] = await sqlAsync<IApiKeyDto[]>(async (client) => {
            const { rows } = await client.query(`UPDATE public.api_key
                SET expired=NOW()
                WHERE youtube_key = ${sql_escape(old_key)} and expired IS NULL`);
            return rows;
        }, logger);
        if (updateError) {
            return [, updateError];
        }
    }
    const [list, listError] = await sqlAsync<IApiKeyDto[]>(async (client) => {
        const { rows } = await client.query(`SELECT * 
FROM api_key 
WHERE (expired < NOW() AND NOW() - expired > INTERVAL '24 hours')
   OR expired IS NULL;`);
        return rows;
    }, logger);
    if(listError) {
        return [, listError];
    }
    const apiKeyObj = list && list.length > 0 ? getRandomElement(list) : undefined;
    if (apiKeyObj) {
        // reset apiKey after 1 hour (set expired to NULL)
        const [, updateError] = await sqlAsync<IApiKeyDto[]>(async (client) => {
            const { rows } = await client.query(`UPDATE public.api_key
                SET expired=NULL
                WHERE youtube_key = ${sql_escape(apiKeyObj.youtube_key)};`);
            return rows;
        }, logger);
        if (updateError) {
            return [, updateError];
        }
        return [apiKeyObj];
    }
    return [, 'no valid api key ' ];
};

const addYoutubeKey = async (email: string, key: string, logger: ILogger): IAsyncPromiseResult<void> => {
    rabbitMQ_sendDataAsync<IAddYoutubeKeyBody>(
        RABBIT_MQ_ENV,
        'addYoutubeKeyAsync',
        {
            email,
            key,
        },
        logger,
    );
    return [,];
};

const postApiKey = async (data: IApiKeyDto, logger: ILogger): IAsyncPromiseResult<IApiKeyDto> => {
    return typeOrmAsync<ApiKeyDto>(async (client) => {
        return [await client.getRepository(ApiKeyDto).save(data)];
    }, logger);
};

function getRandomElement(arr: IApiKeyDto[]) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

export const apiKey = {
    getActiveApiKeyAsync,
    postApiKey,
    addYoutubeKey
};
