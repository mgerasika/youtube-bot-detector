import { IAsyncPromiseResult } from "@common/interfaces/async-promise-result.interface";
import { sqlAsync } from "@server/sql/sql-async.util";
import { sql_where } from "@server/sql/sql.util";
import { typeOrmAsync } from "@server/sql/type-orm-async.util";
import { ILogger } from "@common/utils/create-logger.utils";
import { CommentDto, ICommentDto } from "@server/dto/comment.dto";

const getLastCommentDateAsync = async ({video_id}: {video_id?:string}, logger: ILogger) : IAsyncPromiseResult<Date>=> {
    return await sqlAsync<Date>(async (client) => {
        const data = await client.query(`select published_at_time from comment ${sql_where('video_id', video_id)} ORDER BY published_at_time DESC LIMIT 1`);
        let res = data?.rows?.length ? data.rows[0].published_at_time : undefined;
        if(!res) {
            const data = await client.query(`select published_at from comment ${sql_where('video_id', video_id)} ORDER BY published_at DESC LIMIT 1`);
            res = data?.rows?.length ? data.rows[0].published_at : undefined;
        }
        return res;
    }, logger);
};
  const getCommentListAllAsync = async ({comment_id}: {comment_id?:string}, logger: ILogger) : IAsyncPromiseResult<ICommentDto[]>=> {
    return await sqlAsync<ICommentDto[]>(async (client) => {
        const { rows } = await client.query(`select * from comment ${sql_where('id', comment_id)} `);
        return rows;
    }, logger);
};

 const getAutorsIds = async (logger: ILogger) : IAsyncPromiseResult<string[]>=> {
    return await sqlAsync<string[]>(async (client) => {
        const { rows } = await client.query(`SELECT DISTINCT author_id
FROM comment
WHERE author_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1
    FROM channel
    WHERE channel.id = comment.author_id
);
`);
        return rows.map((i:ICommentDto)=>i.author_id);
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
     getCommentListAllAsync,
     getCommentDetailsAsync,
     postCommentAsync,
     getLastCommentDateAsync,
     getAutorsIds
}