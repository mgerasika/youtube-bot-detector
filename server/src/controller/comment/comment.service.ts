import { ICommentDto, CommentDto } from "@server/dto/comment.dto";
import { IAsyncPromiseResult } from "@server/interfaces/async-promise-result.interface";
import { sqlAsync } from "@server/utils/sql-async.util";
import { sql_where } from "@server/utils/sql.util";
import { typeOrmAsync } from "@server/utils/type-orm-async.util";

const getLastCommentDateAsync = async ({video_id}: {video_id?:string}) : IAsyncPromiseResult<Date>=> {
    return await sqlAsync<Date>(async (client) => {
        const {rows} = await client.query(`select published_at from comment ${sql_where('video_id', video_id)} ORDER BY published_at DESC LIMIT 1`);
        return rows.length ? rows[0].published_at : undefined;
    });
};
 export const getCommentListAllAsync = async ({comment_id}: {comment_id?:string}) : IAsyncPromiseResult<ICommentDto[]>=> {
    return await sqlAsync<ICommentDto[]>(async (client) => {
        const { rows } = await client.query(`select * from comment ${sql_where('id', comment_id)} `);
        return rows;
    });
};

 const getCommentDetailsAsync = async (id: string): IAsyncPromiseResult<ICommentDto> => {
    return typeOrmAsync<CommentDto>(async (client) => {
        const entity = await client.getRepository(CommentDto).findOne({ where: { id } });
        if (!entity) {
            return [, 'entity not found'];
        }
        return [entity];
    });
};

 const deleteCommentAsync = async (id: string): IAsyncPromiseResult<CommentDto> => {
    return typeOrmAsync<CommentDto>(async (client) => {
        const entityToDelete = await client.getRepository(CommentDto).findOne({ where: { id } });
        if (!entityToDelete) {
            return [undefined, 'entity not found'];
        }
        return [await client.getRepository(CommentDto).remove(entityToDelete)];
    });
};

 const postCommentAsync = async (data: ICommentDto[]) : IAsyncPromiseResult<ICommentDto[]> => {
    return typeOrmAsync<CommentDto[]>(async (client) => {
        return [await client.getRepository(CommentDto).save(data)];
    });
};

 const putCommentAsync = async (id: string, data: Omit<Partial<CommentDto>, 'id'>) : IAsyncPromiseResult<ICommentDto>=> {
    return typeOrmAsync<CommentDto>(async (client) => {
        const entityToUpdate = await client.getRepository(CommentDto).findOne({ where: { id } });
        if (!entityToUpdate) {
            return [, 'Entity not found'];
        }
        return [await client.getRepository(CommentDto).save({ ...entityToUpdate, ...data })];
    });
};

export const comment = {
     getCommentListAllAsync,
     getCommentDetailsAsync,
     postCommentAsync,
     putCommentAsync,
     deleteCommentAsync,
     getLastCommentDateAsync
}