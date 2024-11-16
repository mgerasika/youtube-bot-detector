import { ENV, } from '@server/env';
import { DataSource, } from 'typeorm';
import { ApiKeyDto, } from '@server/dto/api-key.dto';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { ILogger, } from '@common/utils/create-logger.utils';
import { ChannelDto, } from '@server/dto/channel.dto';
import { VideoDto, } from '@server/dto/video.dto';
import { CommentDto, } from '@server/dto/comment.dto';
import { StatisticDto, } from '@server/dto/statistic.dto';
import { ServerInfoDto } from '@server/dto/server-info.dto';

const IS_DEBUG = ENV.node_env === 'development';

let _dataSource: DataSource | undefined = undefined;
const getDataSource = (): DataSource => {
    if (_dataSource) {
        return _dataSource;
    }
    _dataSource = new DataSource({
        type: 'postgres',
        username: IS_DEBUG ? ENV.owner_user : ENV.user,
        host: ENV.db_host,
        database: ENV.database,
        password: IS_DEBUG ? ENV.owner_password : ENV.password,
        port: ENV.port,
        entities: [ApiKeyDto, ChannelDto, VideoDto, CommentDto, StatisticDto, ServerInfoDto],
        synchronize: true,
        poolSize: 10,
        logging: false,
    });
    return _dataSource;
};

export async function typeOrmAsync<T>(callback: (client: DataSource) => IAsyncPromiseResult<T>, logger: ILogger): IAsyncPromiseResult<T> {
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
