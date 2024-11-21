import { ENV, } from '@server/env';
import { DataSource, EntityTarget, ObjectLiteral, Repository, } from 'typeorm';
import { ApiKeyDto, } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { ILogger, } from '@common/utils/create-logger.utils';
import { ChannelDto, } from '@server/dto/channel.dto';
import { VideoDto, } from '@server/dto/video.dto';
import { CommentDto, } from '@server/dto/comment.dto';
import { StatisticDto, } from '@server/dto/statistic.dto';
import { ServerInfoDto } from '@server/dto/server-info.dto';
import { parseConnectionString } from '@common/utils/parse-connection-string.util';
import { getTypeormPool } from './typeorm-pool';
import { EDbType } from '@server/enum/db-type.enum';



type QueryClient = {
    getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Pick<Repository<Entity>, 'findOne'>;
}

export async function typeOrmQueryInternalAsync<T>(type: EDbType, callback: (client: QueryClient) => IAsyncPromiseResult<T>, logger: ILogger): IAsyncPromiseResult<T> {
    let client = getTypeormPool(type);
    try {
        if (!client.isInitialized) {
            client = await client.initialize();
        }
        if (!client.isInitialized) {
            return [, 'Client is not Initialized'];
        }
        const data = (await callback(client));
        return data;
    } catch (error) {
        logger.log('typeOrm error ', error);
        return [, 'error in sql ' + (error as unknown as {detail:string})?.detail];
    }
}

export async function typeOrmQueryAsync<T>(callback: (client: QueryClient) => IAsyncPromiseResult<T>, logger: ILogger): IAsyncPromiseResult<T> {
   return await typeOrmQueryInternalAsync<T>(EDbType.slave, callback, logger)
}


type MutationClient = {
    getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Pick<Repository<Entity>, 'save'>;
}
export async function typeOrmMutationInternalAsync<T>(type: EDbType, callback: (client: MutationClient) => IAsyncPromiseResult<T>, logger: ILogger): IAsyncPromiseResult<T> {
    let client = getTypeormPool(type);
    try {
        if (!client.isInitialized) {
            client = await client.initialize();
        }
        if (!client.isInitialized) {
            return [, 'Client is not Initialized'];
        }
        const data = (await callback(client));
        return data;
    } catch (error) {
        logger.log('typeOrm error ', error);
        return [, 'error in sql ' + (error as unknown as {detail:string})?.detail];
    }
}
export async function typeOrmMutationAsync<T>(callback: (client: MutationClient) => IAsyncPromiseResult<T>, logger: ILogger): IAsyncPromiseResult<T> {
    await typeOrmMutationInternalAsync(EDbType.master, callback, logger);
    return await typeOrmMutationInternalAsync(EDbType.slave, callback, logger);
}
