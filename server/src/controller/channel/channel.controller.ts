import { API_URL } from "@server/constants/api-url.constant";
import { IChannelDto } from "@server/dto/channel.dto";
import { app, IExpressRequest, IExpressResponse } from "@server/express-app";
import {  getChannelListAllAsync } from "./channel.service";
import { allServices } from "../all-services";

interface IListRequest extends IExpressRequest {
    query: {
        channel_id?: string;
    };
}

interface IListResponse extends IExpressResponse<IChannelDto[], void> {}

app.get(API_URL.api.channel.toString(), async (req: IListRequest, res: IListResponse) => {
    const [data, error] = await getChannelListAllAsync(req.query);
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

interface IGetResponse extends IExpressResponse<IChannelDto, void> {}

app.get(API_URL.api.channel.id().toString(), async (req: IGetRequest, res: IGetResponse) => {
    const [data, error] = await allServices.channel.getChannelDetailsAsync(req.params.id);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

export interface IChannelPostBody extends IChannelDto{}

interface IPostRequest extends IExpressRequest {
    body: IChannelPostBody;
}

interface IPostResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.channel.toString(), async (req: IPostRequest, res: IPostResponse) => {
    const [, error] = await allServices.channel.postChannelAsync(req.body);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send();
});

interface IPutRequest extends IExpressRequest {
    body: IChannelDto;
    params: {
        id: string;
    };
}

interface IPutResponse extends IExpressResponse<void, void> {}

app.put(API_URL.api.channel.id().toString(), async (req: IPutRequest, res: IPutResponse) => {
    const [, error] = await allServices.channel.putChannelAsync(req.params.id, req.body);
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

app.delete(API_URL.api.channel.id().toString(), async (req: IDeleteRequest, res: IDeleteResponse) => {
    const [, error] = await allServices.channel.deleteChannelAsync(req.params.id);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send();
});