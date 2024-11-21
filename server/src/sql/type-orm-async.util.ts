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

const IS_DEBUG = ENV.node_env === 'development';

let _dataSource: DataSource | undefined = undefined;
const getDataSource = (): DataSource => {
    const connectionProps = parseConnectionString(ENV.db_master || '')
    if (_dataSource) {
        return _dataSource;
    }
    _dataSource = new DataSource({
        type: 'postgres',
        username: IS_DEBUG ? ENV.db_owner_user : connectionProps.user,
        password: IS_DEBUG ? ENV.db_owner_password : connectionProps.password,
        host: connectionProps.host,
        database: connectionProps.database,
        port: connectionProps.port,
        entities: [ApiKeyDto, ChannelDto, VideoDto, CommentDto, StatisticDto, ServerInfoDto],
        synchronize: true,
        poolSize: 10,
        logging: false,
    });
    return _dataSource;
};

type QueryClient = {
    getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Pick<Repository<Entity>, 'findOne'>;
}
export async function typeOrmQueryAsync<T>(callback: (client: QueryClient) => IAsyncPromiseResult<T>, logger: ILogger): IAsyncPromiseResult<T> {
    let client = getDataSource();
    try {
        if (!client.isInitialized) {
            client = await getDataSource().initialize();
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


type MutationClient = {
    getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Pick<Repository<Entity>, 'save'>;
}
export async function typeOrmMutationAsync<T>(callback: (client: MutationClient) => IAsyncPromiseResult<T>, logger: ILogger): IAsyncPromiseResult<T> {
    let client = getDataSource();
    try {
        if (!client.isInitialized) {
            client = await getDataSource().initialize();
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
