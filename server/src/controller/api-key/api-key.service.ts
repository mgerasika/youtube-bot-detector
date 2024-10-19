import { ApiKeyDto, IApiKeyDto } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult } from '@server/interfaces/async-promise-result.interface';
import { sqlAsync } from '@server/utils/sql-async.util';
import { sql_escape } from '@server/utils/sql.util';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';

const getActiveApiKeyAsync = async (old_key: string | undefined): IAsyncPromiseResult<IApiKeyDto> => {
    console.log('OLD_KEY', old_key)
    if (old_key) {
        const [, updateError] = await sqlAsync<IApiKeyDto[]>(async (client) => {
            const { rows } = await client.query(`UPDATE public.api_key
                SET expired=NOW()
                WHERE youtube_key = ${sql_escape(old_key)} and expired IS NULL`);
            return rows;
        });
        if (updateError) {
            return [, updateError];
        }
    }
    const [list, listError] = await sqlAsync<IApiKeyDto[]>(async (client) => {
        const { rows } = await client.query(`SELECT * 
FROM api_key 
WHERE expired < NOW() 
AND NOW() - expired > INTERVAL '60 minutes';`);
        return rows;
    });
    if(listError) {
        return [, listError];
    }
    const apiKeyObj = list && list.length > 0 ? getRandomElement(list) : undefined;
    if (apiKeyObj) {
        const [, updateError] = await sqlAsync<IApiKeyDto[]>(async (client) => {
            const { rows } = await client.query(`UPDATE public.api_key
                SET expired=NULL
                WHERE youtube_key = ${sql_escape(apiKeyObj.youtube_key)};`);
            return rows;
        });
        if (updateError) {
            return [, updateError];
        }
        return [apiKeyObj];
    }
    return [, 'no valid api key ' ];
};

const postApiKey = async (data: IApiKeyDto): IAsyncPromiseResult<IApiKeyDto> => {
    return typeOrmAsync<ApiKeyDto>(async (client) => {
        return [await client.getRepository(ApiKeyDto).save(data)];
    });
};

function getRandomElement(arr: IApiKeyDto[]) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

export const apiKey = {
    getActiveApiKeyAsync,
    postApiKey,
};
