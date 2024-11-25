import { ApiKeyDto, IApiKeyDto, } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { sqlMutationAsync, sqlQueryAsync, } from '@server/sql/sql-async.util';
import { sql_escape, sql_where, } from '@server/sql/sql.util';
import { typeOrmMutationAsync, typeOrmQueryAsync, } from '@server/sql/type-orm-async.util';
import { ILogger, } from '@common/utils/create-logger.utils';
import { RABBIT_MQ_DOWNLOAD_ENV, } from '@server/env';
import { rabbitMqService, } from '@common/services/rabbit-mq'
import { IAddYoutubeKeyBody, } from '@common/model/download-server.model';


export interface IYoutubeKeyInfo {
    active_keys: number;
    active_not_expired_keys: number;
    suspended_keys: number;
    all_keys:number;
}
const getActiveKeyInfoAsync = async (logger: ILogger): IAsyncPromiseResult<IYoutubeKeyInfo> => {

    const [list, listError] = await sqlQueryAsync<IYoutubeKeyInfo[]>(async (client) => {
        const { rows } = await client.query<IYoutubeKeyInfo[]>(` 
           SELECT 
    (SELECT COUNT(*) 
     FROM api_key 
     WHERE status = 'active' 
     AND ((expired < NOW() AND NOW() - expired > INTERVAL '25 hours') 
          OR (expired IS NULL AND status = 'active'))
    )::int AS active_not_expired_keys,
    (SELECT COUNT(*) 
     FROM api_key 
     WHERE status = 'active'
    )::int AS active_keys,
    (SELECT COUNT(*) 
     FROM api_key 
     WHERE status = 'suspended'
    )::int AS suspended_keys,
    (SELECT COUNT(*) 
     FROM api_key
    )::int AS all_keys;
`);
        return rows;
    }, logger);
    if (listError) {
        return [, logger.log(listError)]
    }
    if (!list?.length) {
        return [, logger.log('sql activeKey not found')]
    }
    return [list[0]]
}

const getKeysAsync = async (status: string, logger: ILogger): IAsyncPromiseResult<IApiKeyDto[]> => {
    const [list, listError] = await sqlQueryAsync<IApiKeyDto[]>(async (client) => {
        const { rows } = await client.query<IApiKeyDto[]>(`SELECT * from api_key ${sql_where('status', status)}`);
        return rows;
    }, logger);
    if (listError) {
        return [, logger.log(listError)]
    }
    if (!list?.length) {
        return [, logger.log('sql keys error')]
    }
    return [list]
}
const getActiveApiKeyAsync = async (old_key: string | undefined, old_status: string | undefined, logger: ILogger): IAsyncPromiseResult<IApiKeyDto> => {
    logger.log('OLD_KEY', old_key, old_status)
    if (old_key) {
        // update old key, set expired to NOW()
        const [, updateError] = await sqlMutationAsync<IApiKeyDto[]>(async (client) => {
            const { rows } = await client.mutation<IApiKeyDto[]>(`UPDATE public.api_key
                SET expired=NOW(),
                status=${sql_escape(old_status) || null}
                WHERE youtube_key = ${sql_escape(old_key)}`);
            return rows;
        }, logger);
        if (updateError) {
            return [, updateError];
        }
    }
    const [list, listError] = await sqlQueryAsync<IApiKeyDto[]>(async (client) => {
        const { rows } = await client.query<IApiKeyDto[]>(`SELECT * FROM api_key 
WHERE status = 'active' AND (expired < NOW() AND NOW() - expired > INTERVAL '25 hours') OR (expired IS NULL AND status = 'active');`);
        return rows;
    }, logger);
    if (listError) {
        return [, listError];
    }
    const apiKeyObj = list && list.length > 0 ? getRandomElement(list) : undefined;
    if (apiKeyObj) {
        // reset apiKey after 1 hour (set expired to NULL)
        const [, updateError] = await sqlMutationAsync<void>(async (client) => {
            await client.mutation<void>(`UPDATE public.api_key
                SET expired=NULL
                WHERE youtube_key = ${sql_escape(apiKeyObj.youtube_key)};`);
        }, logger);
        if (updateError) {
            return [, updateError];
        }
        return [apiKeyObj];
    }
    return [, 'no valid api key '];
};

const addYoutubeKey = async (email: string, key: string, logger: ILogger): IAsyncPromiseResult<void> => {
    rabbitMqService.sendDataAsync<IAddYoutubeKeyBody>(
        RABBIT_MQ_DOWNLOAD_ENV,
        'addYoutubeKeyAsync',
        {
            email,
            key,
        },
        logger
    );
    return [,];
};

const postApiKey = async (data: IApiKeyDto, logger: ILogger): IAsyncPromiseResult<IApiKeyDto> => {
    return typeOrmMutationAsync<ApiKeyDto>(async (client) => {
        return [await client.getRepository(ApiKeyDto).save(data)];
    }, logger);
};

function getRandomElement(arr: IApiKeyDto[]) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

export const apiKey = {
    getKeysAsync,
    getActiveApiKeyAsync,
    getActiveKeyInfoAsync,
    postApiKey,
    addYoutubeKey,
};
