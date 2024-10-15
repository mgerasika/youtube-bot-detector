import { ENV } from '@server/constants/env';
import { DataSource } from 'typeorm';
import { VideoDto } from '@server/dto/video.dto';
import { ChannelDto } from '@server/dto/channel.dto';
import { ApiKeyDto } from '@server/dto/api-key.dto';
import { CommentDto } from '@server/dto/comment.dto';
import { IAsyncPromiseResult } from '@server/interfaces/async-promise-result.interface';

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
        entities: [VideoDto,ChannelDto,CommentDto, ApiKeyDto],
        synchronize: true,
        poolSize: 10,
        logging: false,
    });
    return _dataSource;
};

export async function typeOrmAsync<T>(callback: (client: DataSource) => IAsyncPromiseResult<T>): IAsyncPromiseResult<T> {
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
        console.log('typeOrm error ', error);
        return [, error as Error];
    }
}
