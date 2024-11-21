import { ChannelDto, IChannelDto, } from "@server/dto/channel.dto";
import { IAsyncPromiseResult, } from "@common/interfaces/async-promise-result.interface";
import { sqlQueryAsync, } from "@server/sql/sql-async.util";
import { sql_and, sql_escape, sql_where, } from "@server/sql/sql.util";
import { typeOrmMutationAsync, typeOrmQueryAsync, } from "@server/sql/type-orm-async.util";
import { ILogger, } from "@common/utils/create-logger.utils";
import { groupArray, } from '@common/utils/group-array.util';
import { oneByOneAsync } from "@common/utils/one-by-one-async.util";
export interface IChannelInfo {
    all_keys:number;
}
const getChannelsInfoAsync = async (logger: ILogger): IAsyncPromiseResult<IChannelInfo> => {
    const [list, listError] = await sqlQueryAsync<IChannelInfo[]>(async (client) => {
        const { rows } = await client.query<IChannelInfo[]>(` 
           SELECT 
            (SELECT COUNT(*)      FROM channel    )::int AS all_keys;`);
        return rows;
    }, logger);
    if (listError) {
        return [, logger.log(listError)]
    }
    if (!list?.length) {
        return [, logger.log('sql activeKey not found')]
    }
    return [list[0]]
}

  const getChannelListAllAsync = async ({channel_id, is_scannable}: {channel_id?:string, is_scannable?:boolean}, logger: ILogger) : IAsyncPromiseResult<IChannelDto[]>=> {
    return await sqlQueryAsync<IChannelDto[]>(async (client) => {
        const { rows } = await client.query<IChannelDto[]>(`select * from channel ${sql_where('id', channel_id)} ${sql_and('is_scannable', String(is_scannable))}`);
        return rows;
    }, logger);
};


 const getChannelDetailsAsync = async (id: string, logger: ILogger): IAsyncPromiseResult<IChannelDto> => {
    return typeOrmQueryAsync<ChannelDto>(async (client) => {
        const entity = await client.getRepository(ChannelDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    }, logger);
};


 const postChannelAsync = async (channels: IChannelDto[], logger: ILogger) : IAsyncPromiseResult<IChannelDto[]> => {
    return typeOrmMutationAsync<ChannelDto[]>(async (client) => {
        return [await client.getRepository(ChannelDto).save(channels)];
    }, logger);
};


const existAsync = async (ids: string[], logger: ILogger) : IAsyncPromiseResult<string[]> => {
    let resultIds: string[] = [];
    const groups = groupArray(ids, 100);
   
    await oneByOneAsync(groups, async (group, cancelFn) => {
        const [idsResponse, error] = await existAsyncForGroup(group, logger)
        if(error || !idsResponse) {
            return cancelFn('error' + error)
        }
        resultIds = resultIds.concat(idsResponse)
    })
  
    return [resultIds];
};

const existAsyncForGroup = async (ids: string[], logger: ILogger) : IAsyncPromiseResult<string[]> => {
    const idsStr = ids.map(id => sql_escape(id)).join(',')
    return await sqlQueryAsync<string[]>(async (client) => {
        const { rows } = await client.query<{id:string}[]>(`SELECT id
            FROM channel
            WHERE id IN (${idsStr});`);
        return rows.map(row => row.id);
    }, logger);
};

export const channel = {
    getChannelListAllAsync,
    getChannelDetailsAsync,
    existAsync,
    getChannelsInfoAsync,
    postChannelAsync,
}