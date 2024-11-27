const { Pool } = require('pg');
import { ENV, } from '@server/env';
import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { ILogger, } from '@common/utils/create-logger.utils';
import { getSqlPool } from './sql-pool';
import { EDbType } from '@server/enum/db-type.enum';

interface IPg {
    query: <T>(sql: string) => Promise<{rows:T}>
}
class QueryClientAdapter {
	_original: IPg = {} as IPg;  
    _logger: ILogger;
	constructor(client: IPg, logger: ILogger) {
		this._original = client;
        this._logger = logger;
	}

	query<T>(sql: string): Promise<{rows:T}> {
		// this._logger.log('sql=' + sql)
        const lowerSql = sql.toLowerCase().trim();
        if(lowerSql.startsWith('insert ') || lowerSql.startsWith('updatae ') || lowerSql.startsWith('delete ')) {
            this._logger.log('sql', lowerSql)
            throw 'not possible insert/update/delete in query' 
        }
        if(!lowerSql.startsWith('select ') ) {
            this._logger.log('sql', lowerSql)
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

	mutation<T>(sql: string): Promise<{rows:T}> {
		// this._logger.log('sql=' + sql)
        const lowerSql = sql.toLowerCase().trim();
        if(lowerSql.startsWith('select ') ) {
            this._logger.log('sql', lowerSql)
            throw 'mutation can not start from select word'
        }
        if(!lowerSql.startsWith('insert into') && !lowerSql.startsWith('update') && !lowerSql.startsWith('delete') ) {
            this._logger.log('sql', lowerSql)
            throw 'mutation should start only from specific words - insert into, update, delete'
        }
		return this._original.query(sql);
	}
}

export async function sqlQueryAsync<T>(callback: (client: QueryClientAdapter) => Promise<T>, logger: ILogger): IAsyncPromiseResult<T> {
    let client;
    try {
        client = await getSqlPool(EDbType.slave).connect();
        const data = (await callback(new QueryClientAdapter(client, logger)  )) as T;
        client?.release();
        return [data];
    } catch (ex) {
        client?.release();
        return [, String(ex || '')];
    }
}

async function sqlMutationInternalAsync<T>( type: EDbType, callback: (client: MutationClientAdapter) => Promise<T>, logger: ILogger): IAsyncPromiseResult<T> {
    let client;
    try {
        client = await getSqlPool(type).connect();
        const data = (await callback(new MutationClientAdapter(client, logger)  )) as T;
        client?.release();
        return [data];
    } catch (ex) {
        client?.release();
        return [, String(ex || '')];
    }
}

export async function sqlMutationAsync<T>(callback: (client: MutationClientAdapter) => Promise<T>, logger: ILogger): IAsyncPromiseResult<T> {
    const dt1 = new Date();
    await sqlMutationInternalAsync(EDbType.master, callback, logger)
    const dt2 = new Date();
    const res = await sqlMutationInternalAsync(EDbType.slave, callback, logger)
    const dt3 = new Date();
    logger.log('sqlMutationAsync on master/slave', (dt2.getTime() - dt1.getTime()) + 'ms', (dt3.getTime() - dt2.getTime()) + 'ms');
    return res;
}