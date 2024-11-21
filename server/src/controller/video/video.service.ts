import { IAsyncPromiseResult, } from "@common/interfaces/async-promise-result.interface";
import { queryAsync, } from "@server/sql/sql-async.util";
import { sql_where, } from "@server/sql/sql.util";
import { typeOrmMutationAsync, typeOrmQueryAsync, } from "@server/sql/type-orm-async.util";
import { ILogger, } from "@common/utils/create-logger.utils";
import { IVideoDto, VideoDto, } from "@server/dto/video.dto";

export interface IVideoInfo {
    all_keys:number;
}
const getVideoInfoAsync = async (logger: ILogger): IAsyncPromiseResult<IVideoInfo> => {
    const [list, listError] = await queryAsync<IVideoInfo[]>(async (client) => {
        const { rows } = await client.query<IVideoInfo[]>(` 
           SELECT 
            (SELECT COUNT(*)      FROM video    )::int AS all_keys;`);
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

const getLastVideoDateAsync = async ({channel_id}: {channel_id?:string}, logger: ILogger) : IAsyncPromiseResult<Date | undefined>=> {
    return await queryAsync<Date | undefined>(async (client) => {
        const data = await client.query<{published_at_time: Date}[]>(`SELECT published_at_time from video ${sql_where('channel_id', channel_id)} ORDER BY published_at_time DESC LIMIT 1`);
        let res = data?.rows?.length ? data.rows[0].published_at_time : undefined;
        if(!res) {
            const data = await client.query<{published_at: Date}[]>(`SELECT published_at from video ${sql_where('channel_id', channel_id)} ORDER BY published_at DESC LIMIT 1`);
            res = data?.rows?.length ? data.rows[0].published_at : undefined;
        }
        return res;
    }, logger);
};

  const getVideoListAllAsync = async ({video_id}: {video_id?:string}, logger: ILogger) : IAsyncPromiseResult<IVideoDto[]>=> {
    return await queryAsync<IVideoDto[]>(async (client) => {
        const { rows } = await client.query<IVideoDto[]>(`SELECT * from video ${sql_where('id', video_id)} `);
        return rows;
    }, logger);
};

 const getVideoDetailsAsync = async (id: string, logger: ILogger): IAsyncPromiseResult<IVideoDto> => {
    return typeOrmQueryAsync<IVideoDto>(async (client) => {
        const entity = await client.getRepository(VideoDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    }, logger);
};

const postVideoAsync = async (videos: IVideoDto[], logger: ILogger) : IAsyncPromiseResult<IVideoDto[]> => {
    return typeOrmMutationAsync<IVideoDto[]>(async (client) => {
        return [await client.getRepository(VideoDto).save(videos)];
    }, logger);
};

export const video = {
    getVideoInfoAsync,
     getVideoListAllAsync,
     getVideoDetailsAsync,
     postVideoAsync,
     getLastVideoDateAsync,
}