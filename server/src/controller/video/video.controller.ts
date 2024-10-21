import { API_URL } from "@server/api-url.constant";
import { app, IExpressRequest, IExpressResponse } from "@server/express-app";
import { allServices } from "../all-services";
import { IVideoDto } from "@server/dto/video.dto";

interface IGetLastVideoDateRequest extends IExpressRequest {
    query: {
        channel_id?: string;
    };
}

interface IGetLastVideoDateResponse extends IExpressResponse<Date, void> {}

app.get(API_URL.api.video.lastDate.toString(), async (req: IGetLastVideoDateRequest, res: IGetLastVideoDateResponse) => {
    const [data, error] = await allServices.video.getLastVideoDateAsync(req.query);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

interface IListRequest extends IExpressRequest {
    query: {
        video_id?: string;
    };
}

interface IListResponse extends IExpressResponse<IVideoDto[], void> {}

app.get(API_URL.api.video.toString(), async (req: IListRequest, res: IListResponse) => {
    const [data, error] = await allServices.video.getVideoListAllAsync(req.query);
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

interface IGetResponse extends IExpressResponse<IVideoDto, void> {}

app.get(API_URL.api.video.id().toString(), async (req: IGetRequest, res: IGetResponse) => {
    const [data, error] = await allServices.video.getVideoDetailsAsync(req.params.id);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

export interface IVideoPostBody  {
    videos:IVideoDto[]
}

interface IPostRequest extends IExpressRequest {
    body: IVideoPostBody;
}

interface IPostResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.video.toString(), async (req: IPostRequest, res: IPostResponse) => {
    const [, error] = await allServices.video.postVideoAsync(req.body.videos);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send();
});

interface IPutRequest extends IExpressRequest {
    body: IVideoDto;
    params: {
        id: string;
    };
}

interface IPutResponse extends IExpressResponse<void, void> {}

app.put(API_URL.api.video.id().toString(), async (req: IPutRequest, res: IPutResponse) => {
    const [, error] = await allServices.video.putVideoAsync(req.params.id, req.body);
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

app.delete(API_URL.api.video.id().toString(), async (req: IDeleteRequest, res: IDeleteResponse) => {
    const [, error] = await allServices.video.deleteVideoAsync(req.params.id);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send();
});