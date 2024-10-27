import { ChannelDto, IChannelDto } from "@server/dto/channel.dto";
import { IAsyncPromiseResult } from "@common/interfaces/async-promise-result.interface";
import { sqlAsync } from "@server/sql/sql-async.util";
import { sql_where } from "@server/sql/sql.util";
import { typeOrmAsync } from "@server/sql/type-orm-async.util";
import { ILogger } from "@common/utils/create-logger.utils";


 export const getChannelListAllAsync = async ({channel_id}: {channel_id?:string}, logger: ILogger) : IAsyncPromiseResult<IChannelDto[]>=> {
    return await sqlAsync<IChannelDto[]>(async (client) => {
        const { rows } = await client.query(`select * from channel ${sql_where('id', channel_id)} `);
        return rows;
    }, logger);
};

 const getChannelDetailsAsync = async (id: string, logger: ILogger): IAsyncPromiseResult<IChannelDto> => {
    return typeOrmAsync<ChannelDto>(async (client) => {
        const entity = await client.getRepository(ChannelDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    }, logger);
};


 const postChannelAsync = async (data: Omit<IChannelDto, 'id' >, logger: ILogger) : IAsyncPromiseResult<IChannelDto> => {
    return typeOrmAsync<ChannelDto>(async (client) => {
        return [await client.getRepository(ChannelDto).save(data)];
    }, logger);
};



export const channel = {
    getChannelListAllAsync,
    getChannelDetailsAsync,
    postChannelAsync,
}