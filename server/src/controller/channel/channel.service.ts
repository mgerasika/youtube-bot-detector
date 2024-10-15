import { ChannelDto, IChannelDto } from "@server/dto/channel.dto";
import { IAsyncPromiseResult } from "@server/interfaces/async-promise-result.interface";
import { sqlAsync } from "@server/utils/sql-async.util";
import { sql_where } from "@server/utils/sql.util";
import { typeOrmAsync } from "@server/utils/type-orm-async.util";


 export const getChannelListAllAsync = async ({channel_id}: {channel_id?:string}) : IAsyncPromiseResult<IChannelDto[]>=> {
    return await sqlAsync<IChannelDto[]>(async (client) => {
        const { rows } = await client.query(`select * from channel ${sql_where('id', channel_id)} `);
        return rows;
    });
};

 const getChannelDetailsAsync = async (id: string): IAsyncPromiseResult<IChannelDto> => {
    return typeOrmAsync<ChannelDto>(async (client) => {
        const entity = await client.getRepository(ChannelDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    });
};

 const deleteChannelAsync = async (id: string): IAsyncPromiseResult<ChannelDto> => {
    return typeOrmAsync<ChannelDto>(async (client) => {
        const entityToDelete = await client.getRepository(ChannelDto).findOne({ where: { id } });
        if (!entityToDelete) {
            return [undefined, 'entity not found'];
        }
        return [await client.getRepository(ChannelDto).remove(entityToDelete)];
    });
};

 const postChannelAsync = async (data: Omit<IChannelDto, 'id' >) : IAsyncPromiseResult<IChannelDto> => {
    return typeOrmAsync<ChannelDto>(async (client) => {
        return [await client.getRepository(ChannelDto).save(data)];
    });
};

 const putChannelAsync = async (id: string, data: Omit<Partial<ChannelDto>, 'id'>) : IAsyncPromiseResult<IChannelDto>=> {
    return typeOrmAsync<ChannelDto>(async (client) => {
        const entityToUpdate = await client.getRepository(ChannelDto).findOne({ where: { id } });
        if (!entityToUpdate) {
            return [, 'Entity not found'];
        }
        return [await client.getRepository(ChannelDto).save({ ...entityToUpdate, ...data })];
    });
};

export const channel = {
    getChannelListAllAsync,
    getChannelDetailsAsync,
    postChannelAsync,
    putChannelAsync,
    deleteChannelAsync
}