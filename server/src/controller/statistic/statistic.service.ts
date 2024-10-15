import { ApiKeyDto, IApiKeyDto } from "@server/dto/api-key.dto";
import { IAsyncPromiseResult } from "@server/interfaces/async-promise-result.interface";
import { sqlAsync } from "@server/utils/sql-async.util";
import { sql_escape } from "@server/utils/sql.util";


export interface IStatistic {
    comment_count: number;
    author_id: number;
    author_url: number;
}
 const getStatisticByVideoAsync = async (video_id?:string): IAsyncPromiseResult<IStatistic[]> => {
    const [list, error] = await sqlAsync<IApiKeyDto[]>(async (client) => {
        const { rows } = await client.query(`SELECT COUNT(*) AS comment_count, comment.author_id, channel.author_url
FROM comment
left outer join channel on channel.id = comment.author_id
WHERE comment.video_id = ${sql_escape(video_id)}
GROUP BY comment.author_id, channel.id  order by comment_count desc;`);
        return rows;
    });
    return [list as any]
};

const getStatisticByChannelAsync = async (channel_id?:string): IAsyncPromiseResult<IStatistic[]> => {
    const [list, error] = await sqlAsync<IApiKeyDto[]>(async (client) => {
        const { rows } = await client.query(`SELECT COUNT(*) AS comment_count, comment.author_id, channel.author_url
FROM comment
inner join video on video.id = comment.video_id
left outer join channel on channel.id = comment.author_id
WHERE video.channel_id = ${sql_escape(channel_id)}
GROUP BY comment.author_id, channel.id order by comment_count desc;`);
        return rows;
    });
    return [list as any]
};

export const statistic = {
    getStatisticByVideoAsync,
    getStatisticByChannelAsync
}