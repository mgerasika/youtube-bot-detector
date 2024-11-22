import { ApiKeyDto, IApiKeyDto, } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { sqlMutationAsync, sqlQueryAsync, } from '@server/sql/sql-async.util';
import { typeOrmMutationAsync, typeOrmQueryAsync, } from '@server/sql/type-orm-async.util';
import { ILogger, } from '@common/utils/create-logger.utils';
import { IServerInfoDto, ServerInfoDto } from '@server/dto/server-info.dto';
import {COMMON_CONST} from '@common/const'

const getServerInfoListAsync = async (logger: ILogger): IAsyncPromiseResult<IServerInfoDto[]> => {
    return await sqlQueryAsync<IServerInfoDto[]>(async (client) => {
        const { rows } = await client.query<IServerInfoDto[]>(`SELECT * 
FROM server_info 
WHERE updated_at_time > NOW() - INTERVAL '${COMMON_CONST.SERVER_INFO_UPDATE_MINUTES+1} minutes';
`);
        return rows;
    }, logger);
};


const postServerInfoAsync = async (data: IServerInfoDto, logger: ILogger): IAsyncPromiseResult<IServerInfoDto> => {
    await sqlMutationAsync(async (client) => await client.mutation(`DELETE FROM server_info 
        WHERE updated_at_time < NOW() - INTERVAL '${COMMON_CONST.SERVER_INFO_UPDATE_MINUTES+1} minutes';
        `), logger)
    return typeOrmMutationAsync<ServerInfoDto>(async (client) => {
        return [await client.getRepository(ServerInfoDto).save({ ...data, updated_at_time: new Date() })];
    }, logger);
};


export const allServerInfo = {
    getServerInfoListAsync,
    postServerInfoAsync
};
