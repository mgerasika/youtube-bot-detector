import { API_URL } from "@server/constants/api-url.constant";
import { app, IExpressRequest, IExpressResponse } from "@server/express-app";
import {  getCommentListAllAsync } from "./comment.service";
import { allServices } from "../all-services";
import { ICommentDto } from "@server/dto/comment.dto";


interface IGetLastCommentDateRequest extends IExpressRequest {
    query: {
        video_id?: string;
    };
}

interface IGetLastCommentDateResponse extends IExpressResponse<Date, void> {}

app.get(API_URL.api.comment.lastDate.toString(), async (req: IGetLastCommentDateRequest, res: IGetLastCommentDateResponse) => {
    const [data, error] = await allServices.comment.getLastCommentDateAsync(req.query);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});


interface IListRequest extends IExpressRequest {
    query: {
        comment_id?: string;
    };
}

interface IListResponse extends IExpressResponse<ICommentDto[], void> {}

app.get(API_URL.api.comment.toString(), async (req: IListRequest, res: IListResponse) => {
    const [data, error] = await getCommentListAllAsync(req.query);
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
    const [data, error] = await allServices.comment.getCommentDetailsAsync(req.params.id);
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
    const [, error] = await allServices.comment.postCommentAsync(req.body.comments);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send();
});

interface IPutRequest extends IExpressRequest {
    body: ICommentDto;
    params: {
        id: string;
    };
}

interface IPutResponse extends IExpressResponse<void, void> {}

app.put(API_URL.api.comment.id().toString(), async (req: IPutRequest, res: IPutResponse) => {
    const [, error] = await allServices.comment.putCommentAsync(req.params.id, req.body);
    if (error) {
        return res.status(400).send(error);
    }

    return res.send();
});

interface IDeleteRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IDeleteResponse extends IExpressResponse<void, void> {}

app.delete(API_URL.api.comment.id().toString(), async (req: IDeleteRequest, res: IDeleteResponse) => {
    const [, error] = await allServices.comment.deleteCommentAsync(req.params.id);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send();
});