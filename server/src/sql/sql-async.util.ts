const { Pool } = require('pg');
import { ENV, } from '@server/env';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { ILogger, } from '@common/utils/create-logger.utils';
import {parseConnectionString} from '@common/utils/parse-connection-string.util'
// create a new PostgreSQL pool with your database configuration
let _pool: typeof Pool | undefined = undefined;

const getPool = (): typeof Pool => {
    const connectionProps = parseConnectionString(ENV.db_master || '')
    if (_pool) {
        return _pool;
    }
    _pool = new Pool({
        user: connectionProps.user,
        host: connectionProps.host,
        database: connectionProps.database,
        password: connectionProps.password,
        port: connectionProps.port,
        max: 100,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
    return _pool;
};

interface IPg {
    query: <T>(sql: string) => {rows:T}
}
class QueryClientAdapter {
	_original: IPg = {} as IPg;  
    _logger: ILogger;
	constructor(client: IPg, logger: ILogger) {
		this._original = client;
        this._logger = logger;
	}

	query<T>(sql: string): {rows:T} {
		// this._logger.log('sql=' + sql)
        const lowerSql = sql.toLowerCase();
        if(lowerSql.startsWith('insert ') || lowerSql.startsWith('updatae ') || lowerSql.startsWith('delete ')) {
            throw 'not possible insert/update/delete in query'
        }
        if(!lowerSql.startsWith('select ') ) {
            throw 'select should start only from select word'
        }
		return this._original.query(sql);
	}
}

class MutationClientAdapter {
	_original: IPg = {} as IPg;  
    _logger: ILogger;
	constructor(client: IPg, logger: ILogger) {
		this._original = client;
        this._logger = logger;
	}

	mutation<T>(sql: string): {rows:T} {
		// this._logger.log('sql=' + sql)
        const lowerSql = sql.toLowerCase();
        if(lowerSql.startsWith('select ') ) {
            throw 'mutation can not start from select word'
        }
        if(!lowerSql.startsWith('insert into') && !lowerSql.startsWith('update') && !lowerSql.startsWith('delete') ) {
            throw 'mutation should start only from specific words - insert into, update, delete'
        }
		return this._original.query(sql);
	}
}

export async function queryAsync<T>(callback: (client: QueryClientAdapter) => Promise<T>, logger: ILogger): IAsyncPromiseResult<T> {
    let client;
    try {
        client = await getPool().connect();
        const data = (await callback(new QueryClientAdapter(client, logger)  )) as T;
        client?.release();
        return [data];
    } catch (ex) {
        client?.release();
        return [, String(ex || '')];
    }
}

export async function mutationAsync<T>(callback: (client: MutationClientAdapter) => Promise<T>, logger: ILogger): IAsyncPromiseResult<T> {
    let client;
    try {
        client = await getPool().connect();
        const data = (await callback(new MutationClientAdapter(client, logger)  )) as T;
        client?.release();
        return [data];
    } catch (ex) {
        client?.release();
        return [, String(ex || '')];
    }
}