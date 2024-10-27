import { IAsyncPromiseResult } from "@common/interfaces/async-promise-result.interface";
import { sqlAsync } from "@server/sql/sql-async.util";
import { sql_where } from "@server/sql/sql.util";
import { typeOrmAsync } from "@server/sql/type-orm-async.util";
import { ILogger } from "@common/utils/create-logger.utils";
import { IVideoDto, VideoDto } from "@server/dto/video.dto";

const getLastVideoDateAsync = async ({channel_id}: {channel_id?:string}, logger: ILogger) : IAsyncPromiseResult<Date>=> {
    return await sqlAsync<Date>(async (client) => {
        const {rows} = await client.query(`select published_at from video ${sql_where('channel_id', channel_id)} ORDER BY published_at DESC LIMIT 1`);
        return rows.length ? rows[0].published_at : undefined;
    }, logger);
};

  const getVideoListAllAsync = async ({video_id}: {video_id?:string}, logger: ILogger) : IAsyncPromiseResult<IVideoDto[]>=> {
    return await sqlAsync<IVideoDto[]>(async (client) => {
        const { rows } = await client.query(`select * from video ${sql_where('id', video_id)} `);
        return rows;
    }, logger);
};

 const getVideoDetailsAsync = async (id: string, logger: ILogger): IAsyncPromiseResult<IVideoDto> => {
    return typeOrmAsync<IVideoDto>(async (client) => {
        const entity = await client.getRepository(VideoDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    }, logger);
};



 const postVideoAsync = async (videos: IVideoDto[], logger: ILogger) : IAsyncPromiseResult<IVideoDto[]> => {
    return typeOrmAsync<IVideoDto[]>(async (client) => {
        return [await client.getRepository(VideoDto).save(videos)];
    }, logger);
};





export const video = {
     getVideoListAllAsync,
     getVideoDetailsAsync,
     postVideoAsync,
     getLastVideoDateAsync
}