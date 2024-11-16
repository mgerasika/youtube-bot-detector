import { typeOrmAsync, } from "@server/sql/type-orm-async.util";
import { getStatisticByChannelAsync, } from "./statistic-by-channel";
import { getStatisticByVideoAsync, } from "./statistic-by-video";
import { getStatisticInfoAsync, } from "./statistic-info";
import { IStatisticDto, StatisticDto, } from "@server/dto/statistic.dto";
import { IAsyncPromiseResult, } from "@common/interfaces/async-promise-result.interface";
import { ILogger, } from "@common/utils/create-logger.utils";
import { sqlAsync, } from "@server/sql/sql-async.util";
import {ICollection} from '@common/interfaces/collection.interface'
import { getStatisticByChannelForOneAsync } from "./statistic-by-channel-for-one";

export interface IStatisticInternalInfo {
    all_keys:number;
}
const getStatisticInternalInfoAsync = async (logger: ILogger): IAsyncPromiseResult<IStatisticInternalInfo> => {
    const [list, listError] = await sqlAsync<IStatisticInternalInfo[]>(async (client) => {
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
    return await sqlAsync<StatisticDto[]>(async (client) => {
        const { rows } = await client.query<StatisticDto[]>(`select * from statistic order by comment_count desc`);
        return rows;
    }, logger);
};

// WHERE (hash is null OR (uploaded_at_time > NOW() - INTERVAL '96 hours')) and comment_count >= 25 
const getStatisticWithoutHashListAsync = async (page_size:number, page: number, logger: ILogger) : IAsyncPromiseResult<ICollection<StatisticDto>>=> {
    return await sqlAsync<ICollection<StatisticDto>>(async (client) => {
        const { rows } = await client.query<(StatisticDto & {total_count: number})[]>(`
            WITH total AS (
                SELECT COUNT(*) AS total_count FROM statistic 
                WHERE (hash is null) and comment_count >= 25
            )
            SELECT *, total.total_count
            FROM statistic, total
            WHERE (hash is null) and comment_count >= 25
            ORDER BY comment_count desc
            LIMIT ${page_size} OFFSET (${page} ) * ${page_size}`);

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
    return typeOrmAsync<StatisticDto>(async (client) => {
        const entity = await client.getRepository(StatisticDto).findOne({ where: { channel_id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    }, logger);
};

 const postStatisticAsync = async (statistic: IStatisticDto[], logger: ILogger) : IAsyncPromiseResult<IStatisticDto[]> => {
    return typeOrmAsync<StatisticDto[]>(async (client) => {
        return [await client.getRepository(StatisticDto).save(statistic)];
    }, logger);
};

export const statistic = {
    getStatisticInternalInfoAsync,
    getStatisticDetailsAsync,
    postStatisticAsync,
    getStatisticByChannelAsync,
    getStatisticByVideoAsync,
    getStatisticInfoAsync,
    getStatisticListAsync,
    getStatisticWithoutHashListAsync,
    getStatisticByChannelForOneAsync
}