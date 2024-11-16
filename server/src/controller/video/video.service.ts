import { IAsyncPromiseResult, } from "@common/interfaces/async-promise-result.interface";
import { sqlAsync, } from "@server/sql/sql-async.util";
import { sql_where, } from "@server/sql/sql.util";
import { typeOrmAsync, } from "@server/sql/type-orm-async.util";
import { ILogger, } from "@common/utils/create-logger.utils";
import { IVideoDto, VideoDto, } from "@server/dto/video.dto";

export interface IVideoInfo {
    all_keys:number;
}
const getVideoInfoAsync = async (logger: ILogger): IAsyncPromiseResult<IVideoInfo> => {
    const [list, listError] = await sqlAsync<IVideoInfo[]>(async (client) => {
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
    return await sqlAsync<Date | undefined>(async (client) => {
        const data = await client.query<{published_at_time: Date}[]>(`select published_at_time from video ${sql_where('channel_id', channel_id)} ORDER BY published_at_time DESC LIMIT 1`);
        let res = data?.rows?.length ? data.rows[0].published_at_time : undefined;
        if(!res) {
            const data = await client.query<{published_at: Date}[]>(`select published_at from video ${sql_where('channel_id', channel_id)} ORDER BY published_at DESC LIMIT 1`);
            res = data?.rows?.length ? data.rows[0].published_at : undefined;
        }
        return res;
    }, logger);
};

  const getVideoListAllAsync = async ({video_id}: {video_id?:string}, logger: ILogger) : IAsyncPromiseResult<IVideoDto[]>=> {
    return await sqlAsync<IVideoDto[]>(async (client) => {
        const { rows } = await client.query<IVideoDto[]>(`select * from video ${sql_where('id', video_id)} `);
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
    getVideoInfoAsync,
     getVideoListAllAsync,
     getVideoDetailsAsync,
     postVideoAsync,
     getLastVideoDateAsync,
}