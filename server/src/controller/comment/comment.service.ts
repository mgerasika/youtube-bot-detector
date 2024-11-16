import { IAsyncPromiseResult, } from "@common/interfaces/async-promise-result.interface";
import { sqlAsync, } from "@server/sql/sql-async.util";
import { sql_and, sql_where, } from "@server/sql/sql.util";
import { typeOrmAsync, } from "@server/sql/type-orm-async.util";
import { ILogger, } from "@common/utils/create-logger.utils";
import { CommentDto, ICommentDto, } from "@server/dto/comment.dto";

export interface ICommentInfo {
    all_keys:number;
}
const getCommentsInfoAsync = async (logger: ILogger): IAsyncPromiseResult<ICommentInfo> => {
    const [list, listError] = await sqlAsync<ICommentInfo[]>(async (client) => {
        const { rows } = await client.query<ICommentInfo[]>(` 
           SELECT 
            (SELECT COUNT(*)      FROM comment    )::int AS all_keys;`);
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

const getLastCommentDateAsync = async ({video_id}: {video_id?:string}, logger: ILogger) : IAsyncPromiseResult<Date | undefined>=> {
    return await sqlAsync<Date | undefined>(async (client) => {
        const data = await client.query<{published_at_time:Date}[]>(`select published_at_time from comment ${sql_where('video_id', video_id)} ORDER BY published_at_time DESC LIMIT 1`);
        let res = data?.rows?.length ? data.rows[0].published_at_time : undefined;
        if(!res) {
            const data = await client.query<{published_at:Date}[]>(`select published_at from comment ${sql_where('video_id', video_id)} ORDER BY published_at DESC LIMIT 1`);
            res = data?.rows?.length ? data.rows[0].published_at : undefined;
        }
        return res;
    }, logger);
};
  const getCommentListAllAsync = async ({comment_id, author_id}: {comment_id?:string, author_id?: string}, logger: ILogger) : IAsyncPromiseResult<ICommentDto[]>=> {
    return await sqlAsync<ICommentDto[]>(async (client) => {
        const { rows } = await client.query<ICommentDto[]>(`select * from comment ${sql_where('id', comment_id)} ${sql_and('author_id', author_id)} order by published_at_time DESC limit 100`);
        return rows;
    }, logger);
};


 const getAutorsIds = async (logger: ILogger) : IAsyncPromiseResult<string[]>=> {
    return await sqlAsync<string[]>(async (client) => {
        const { rows } = await client.query<{author_id:string}[]>(`SELECT DISTINCT author_id
FROM comment
WHERE author_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM channel
    WHERE channel.id = comment.author_id
);
`);
        return rows.map((i)=>i.author_id);
    }, logger);
};

 const getCommentDetailsAsync = async (id: string, logger: ILogger): IAsyncPromiseResult<ICommentDto> => {
    return typeOrmAsync<CommentDto>(async (client) => {
        const entity = await client.getRepository(CommentDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    }, logger);
};

 const postCommentAsync = async (comments: ICommentDto[], logger: ILogger) : IAsyncPromiseResult<ICommentDto[]> => {
    return typeOrmAsync<CommentDto[]>(async (client) => {
        return [await client.getRepository(CommentDto).save(comments)];
    }, logger);
};



export const comment = {
    getCommentsInfoAsync,
     getCommentListAllAsync,
     getCommentDetailsAsync,
     postCommentAsync,
     getLastCommentDateAsync,
     getAutorsIds,
}