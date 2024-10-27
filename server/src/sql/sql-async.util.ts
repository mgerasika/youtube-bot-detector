const { Pool } = require('pg');
import { ENV } from '@server/env';
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { ILogger } from '@common/utils/create-logger.utils';
// create a new PostgreSQL pool with your database configuration
let _pool: typeof Pool | undefined = undefined;

const getPool = (): typeof Pool => {
    if (_pool) {
        return _pool;
    }
    _pool = new Pool({
        user: ENV.user,
        host: ENV.db_host,
        database: ENV.database,
        password: ENV.password,
        port: ENV.port,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
    return _pool;
};

class ClientAdapter {
	_original = {} as any;
    _logger: ILogger;
	constructor(client: any, logger: ILogger) {
		this._original = client;
        this._logger = logger;
	}

	query(sql: string) {
		this._logger.log('sql=' + sql)
		return this._original.query(sql);
	}
}

export async function sqlAsync<T>(callback: (client: any) => Promise<T>, logger: ILogger): IAsyncPromiseResult<T> {
    let client;
    try {
        client = await getPool().connect();
        const data = (await callback(new ClientAdapter(client, logger))) as T;
        client?.release();
        return [data];
    } catch (ex) {
        client?.release();
        return [, String(ex || '')];
    }
}
