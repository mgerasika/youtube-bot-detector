import { ENV, } from '@server/env';
import { DataSource} from 'typeorm';
import { ApiKeyDto, } from '@server/dto/api-key.dto';
import { ChannelDto, } from '@server/dto/channel.dto';
import { VideoDto, } from '@server/dto/video.dto';
import { CommentDto, } from '@server/dto/comment.dto';
import { StatisticDto, } from '@server/dto/statistic.dto';
import { ServerInfoDto } from '@server/dto/server-info.dto';
import { parseConnectionString } from '@common/utils/parse-connection-string.util';
import { EDbType } from '@server/enum/db-type.enum';

const IS_DEBUG = ENV.node_env === 'development';
const connectionStrings: Record<EDbType, string> = {
    [EDbType.master] : ENV.db_master || '',
    [EDbType.slave] : ENV.db_slave || '',
}
const _dataSources: Record<EDbType, DataSource | undefined> = {[EDbType.master]: undefined, [EDbType.slave] : undefined};
export const getTypeormPool = (type: EDbType): DataSource  => {
    const connectionProps = parseConnectionString(connectionStrings[type] || '')
    if (_dataSources[type]) {
        return _dataSources[type] as DataSource;
    }
    _dataSources[type] = new DataSource({
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
    return _dataSources[type] as DataSource;
};
