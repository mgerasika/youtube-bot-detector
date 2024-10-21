import { IVideoDto, VideoDto } from "@server/dto/video.dto";
import { IAsyncPromiseResult } from "@common/interfaces/async-promise-result.interface";
import { sqlAsync } from "@server/sql/sql-async.util";
import { sql_where } from "@server/sql/sql.util";
import { typeOrmAsync } from "@server/sql/type-orm-async.util";

const getLastVideoDateAsync = async ({channel_id}: {channel_id?:string}) : IAsyncPromiseResult<Date>=> {
    return await sqlAsync<Date>(async (client) => {
        const {rows} = await client.query(`select published_at from video ${sql_where('channel_id', channel_id)} ORDER BY published_at DESC LIMIT 1`);
        return rows.length ? rows[0].published_at : undefined;
    });
};

  const getVideoListAllAsync = async ({video_id}: {video_id?:string}) : IAsyncPromiseResult<IVideoDto[]>=> {
    return await sqlAsync<IVideoDto[]>(async (client) => {
        const { rows } = await client.query(`select * from video ${sql_where('id', video_id)} `);
        return rows;
    });
};

 const getVideoDetailsAsync = async (id: string): IAsyncPromiseResult<IVideoDto> => {
    return typeOrmAsync<IVideoDto>(async (client) => {
        const entity = await client.getRepository(VideoDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    });
};

 const deleteVideoAsync = async (id: string): IAsyncPromiseResult<IVideoDto> => {
    return typeOrmAsync<IVideoDto>(async (client) => {
        const entityToDelete = await client.getRepository(VideoDto).findOne({ where: { id } });
        if (!entityToDelete) {
            return [undefined, 'entity not found'];
        }
        return [await client.getRepository(VideoDto).remove(entityToDelete)];
    });
};

 const postVideoAsync = async (videos: IVideoDto[]) : IAsyncPromiseResult<IVideoDto[]> => {
    return typeOrmAsync<IVideoDto[]>(async (client) => {
        return [await client.getRepository(VideoDto).save(videos)];
    });
};



 const putVideoAsync = async (id: string, data: Omit<Partial<IVideoDto>, 'id'>) : IAsyncPromiseResult<IVideoDto>=> {
    return typeOrmAsync<IVideoDto>(async (client) => {
        const entityToUpdate = await client.getRepository(VideoDto).findOne({ where: { id } });
        if (!entityToUpdate) {
            return [, 'Entity not found'];
        }
        return [await client.getRepository(VideoDto).save({ ...entityToUpdate, ...data })];
    });
};

export const video = {
     getVideoListAllAsync,
     getVideoDetailsAsync,
     postVideoAsync,
     putVideoAsync,
     deleteVideoAsync,
     getLastVideoDateAsync
}