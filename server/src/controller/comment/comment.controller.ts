import { API_URL, } from "@server/api-url.constant";
import {IExpressRequest, IExpressResponse} from '@common/interfaces/express.interface';
import { app } from "@server/express-app";
import { allServices, } from "../all-services";
import { createLogger, } from "@common/utils/create-logger.utils";
import { ICommentDto, } from "@server/dto/comment.dto";


interface IGetLastCommentDateRequest extends IExpressRequest {
    query: {
        video_id?: string;
    };
}

interface IGetLastCommentDateResponse extends IExpressResponse<Date, void> {}

app.get(API_URL.api.comment.lastDate.toString(), async (req: IGetLastCommentDateRequest, res: IGetLastCommentDateResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.comment.getLastCommentDateAsync(req.query, logger);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

interface IAuthorIdsRequest extends IExpressRequest {
  
}

interface IAuthorIdsResponse extends IExpressResponse<Date, void> {}

app.get(API_URL.api.comment.authorIds.toString(), async (req: IAuthorIdsRequest, res: IAuthorIdsResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.comment.getAutorsIds(logger);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});


interface IListRequest extends IExpressRequest {
    query: {
        comment_id?: string;
        author_id?: string;
    };
}

interface IListResponse extends IExpressResponse<ICommentDto[], void> {}

app.get(API_URL.api.comment.toString(), async (req: IListRequest, res: IListResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.comment.getCommentListAllAsync(req.query, logger);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});


interface IGetRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IGetResponse extends IExpressResponse<ICommentDto, void> {}

app.get(API_URL.api.comment.id().toString(), async (req: IGetRequest, res: IGetResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.comment.getCommentDetailsAsync(req.params.id, logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

export interface ICommentPostBody  {
    comments: ICommentDto[];
}

interface IPostRequest extends IExpressRequest {
    body: ICommentPostBody;
}

interface IPostResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.comment.toString(), async (req: IPostRequest, res: IPostResponse) => {
    const logger = createLogger();
    const [, error] = await allServices.comment.postCommentAsync(req.body.comments, logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send();
});

