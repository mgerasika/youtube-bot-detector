import { ICommentDto, CommentDto } from "@server/dto/comment.dto";
import { IAsyncPromiseResult } from "@common/interfaces/async-promise-result.interface";
import { sqlAsync } from "@server/sql/sql-async.util";
import { sql_where } from "@server/sql/sql.util";
import { typeOrmAsync } from "@server/sql/type-orm-async.util";
import { ILogger } from "@common/utils/create-logger.utils";

const getLastCommentDateAsync = async ({video_id}: {video_id?:string}, logger: ILogger) : IAsyncPromiseResult<Date>=> {
    return await sqlAsync<Date>(async (client) => {
        const {rows} = await client.query(`select published_at from comment ${sql_where('video_id', video_id)} ORDER BY published_at DESC LIMIT 1`);
        return rows.length ? rows[0].published_at : undefined;
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
        const { rows } = await client.query(`select distinct(author_id) from comment`);
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

 const postCommentAsync = async (data: ICommentDto[], logger: ILogger) : IAsyncPromiseResult<ICommentDto[]> => {
    return typeOrmAsync<CommentDto[]>(async (client) => {
        return [await client.getRepository(CommentDto).save(data)];
    }, logger);
};



export const comment = {
     getCommentListAllAsync,
     getCommentDetailsAsync,
     postCommentAsync,
     getLastCommentDateAsync,
     getAutorsIds
}