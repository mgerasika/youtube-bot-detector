import { typeOrmMutationAsync, typeOrmQueryAsync, } from "@server/sql/type-orm-async.util";
import { getStatisticByChannelDetailedAsync, } from "./statistic-by-channel-detailed";
import { getStatisticByVideoAsync, } from "./statistic-by-video";
import { getStatisticInfoAsync, } from "./statistic-info";
import { IStatisticDto, StatisticDto, } from "@server/dto/statistic.dto";
import { IAsyncPromiseResult, } from "@common/interfaces/async-promise-result.interface";
import { ILogger, } from "@common/utils/create-logger.utils";
import { sqlQueryAsync, } from "@server/sql/sql-async.util";
import {ICollection} from '@common/interfaces/collection.interface'
import { getStatisticByChannelAsync } from "./statistic-by-channel";

export interface IStatisticInternalInfo {
    all_keys:number;
}
const getStatisticInternalInfoAsync = async (logger: ILogger): IAsyncPromiseResult<IStatisticInternalInfo> => {
    const [list, listError] = await sqlQueryAsync<IStatisticInternalInfo[]>(async (client) => {
        const { rows } = await client.query<IStatisticInternalInfo[]>(` 
           SELECT 
            (SELECT COUNT(*)      FROM statistic    )::int AS all_keys;`);
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

const getStatisticListAsync = async ( logger: ILogger) : IAsyncPromiseResult<StatisticDto[]>=> {
    return await sqlQueryAsync<StatisticDto[]>(async (client) => {
        const { rows } = await client.query<StatisticDto[]>(`select * from statistic order by comment_count desc`);
        return rows;
    }, logger);
};

// WHERE (hash is null OR (uploaded_at_time > NOW() - INTERVAL '96 hours')) and comment_count >= 25 
const getStatisticWithoutHashListAsync = async (page_size:number, page: number, logger: ILogger) : IAsyncPromiseResult<ICollection<StatisticDto>>=> {
    return await sqlQueryAsync<ICollection<StatisticDto>>(async (client) => {
        const { rows } = await client.query<(StatisticDto & {total_count: number})[]>(`
          SELECT 
            s.*, 
            (
                SELECT COUNT(*) 
                FROM statistic 
                WHERE hash IS NULL AND comment_count >= 25
            ) AS total_count
        FROM statistic AS s
        WHERE s.hash IS NULL AND s.comment_count >= 25
        ORDER BY s.comment_count DESC
        LIMIT ${page_size} OFFSET (${page}) * ${page_size};
        `);

        return {
            page:page,
            total_count: rows.length ? rows[0].total_count : 0,
            items:rows.map((row) => {
                const {total_count, ...rest} = row;
                return {
                        ...rest
                }
            })
        };
    }, logger);
};

const getStatisticDetailsAsync = async (channel_id: string, logger: ILogger): IAsyncPromiseResult<IStatisticDto> => {
    return typeOrmQueryAsync<StatisticDto>(async (client) => {
        const entity = await client.getRepository(StatisticDto).findOne({ where: { channel_id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    }, logger);
};

 const postStatisticAsync = async (statistic: IStatisticDto[], logger: ILogger) : IAsyncPromiseResult<IStatisticDto[]> => {
    return typeOrmMutationAsync<StatisticDto[]>(async (client) => {
        return [await client.getRepository(StatisticDto).save(statistic)];
    }, logger);
};

export const statistic = {
    getStatisticInternalInfoAsync,
    getStatisticDetailsAsync,
    postStatisticAsync,
    getStatisticByChannelAsync: getStatisticByChannelDetailedAsync,
    getStatisticByVideoAsync,
    getStatisticInfoAsync,
    getStatisticListAsync,
    getStatisticWithoutHashListAsync,
    getStatisticByChannelForOneAsync: getStatisticByChannelAsync
}