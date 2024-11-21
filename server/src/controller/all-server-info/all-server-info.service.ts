import { ApiKeyDto, IApiKeyDto, } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { queryAsync, } from '@server/sql/sql-async.util';
import { sql_escape, } from '@server/sql/sql.util';
import { typeOrmMutationAsync, typeOrmQueryAsync, } from '@server/sql/type-orm-async.util';
import { ILogger, } from '@common/utils/create-logger.utils';
import { RABBIT_MQ_DOWNLOAD_ENV, } from '@server/env';
import { rabbitMqService, } from '@common/services/rabbit-mq'
import { IAddYoutubeKeyBody, } from '@common/model/download-server.model';
import { IServerInfoDto, ServerInfoDto } from '@server/dto/server-info.dto';


const getServerInfoListAsync = async ( logger: ILogger) : IAsyncPromiseResult<IServerInfoDto[]>=> {
    return await queryAsync<IServerInfoDto[]>(async (client) => {
        const { rows } = await client.query<IServerInfoDto[]>(`select * from server_info`);
        return rows;
    }, logger);
};


const postServerInfoAsync = async (data: IServerInfoDto, logger: ILogger): IAsyncPromiseResult<IServerInfoDto> => {
    return typeOrmMutationAsync<ServerInfoDto>(async (client) => {
        return [await client.getRepository(ServerInfoDto).save(data)];
    }, logger);
};


export const allServerInfo = {
  getServerInfoListAsync,
  postServerInfoAsync
};
