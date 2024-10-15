import { ApiKeyDto, IApiKeyDto } from "@server/dto/api-key.dto";
import { IAsyncPromiseResult } from "@server/interfaces/async-promise-result.interface";
import { sqlAsync } from "@server/utils/sql-async.util";
import { typeOrmAsync } from "@server/utils/type-orm-async.util";


 const getActiveApiKeyAsync = async (): IAsyncPromiseResult<IApiKeyDto> => {
    const [list, error] = await sqlAsync<IApiKeyDto[]>(async (client) => {
        const { rows } = await client.query(`select * from api_key `);
        return rows;
    });
    return list && list.length > 0 ? [getRandomElement(list)] : [,error]
};

 const postApiKey = async (data: IApiKeyDto) : IAsyncPromiseResult<IApiKeyDto> => {
    return typeOrmAsync<ApiKeyDto>(async (client) => {
        return [await client.getRepository(ApiKeyDto).save(data)];
    });
};

function getRandomElement(arr:IApiKeyDto[]) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

export const apiKey = {
     getActiveApiKeyAsync,
     postApiKey,
}