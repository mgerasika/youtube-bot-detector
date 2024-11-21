const { Pool } = require('pg');
import { ENV, } from '@server/env';
import {parseConnectionString} from '@common/utils/parse-connection-string.util'
import { EDbType } from '@server/enum/db-type.enum';
type SqlPool = typeof Pool
const _pools: Record<EDbType, SqlPool | undefined> = {[EDbType.master]: undefined, [EDbType.slave] : undefined};

const connectionStrings: Record<EDbType, string> = {
    [EDbType.master] : ENV.db_master || '',
    [EDbType.slave] : ENV.db_slave || '',
}
export const getSqlPool = (type: EDbType): SqlPool => {
    const connectionProps = parseConnectionString( connectionStrings[type] || '')
    if (_pools[type]) {
        return _pools[type];
    }
    _pools[type] = new Pool({
        user: connectionProps.user,
        host: connectionProps.host,
        database: connectionProps.database,
        password: connectionProps.password,
        port: connectionProps.port,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
    return _pools[type];
};

