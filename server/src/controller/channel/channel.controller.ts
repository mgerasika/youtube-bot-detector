import { API_URL } from "@server/api-url.constant";
import { IChannelDto } from "@server/dto/channel.dto";
import { app, IExpressRequest, IExpressResponse } from "@server/express-app";
import {  getChannelListAllAsync } from "./channel.service";
import { allServices } from "../all-services";
import { createLogger } from "@common/utils/create-logger.utils";

interface IListRequest extends IExpressRequest {
    query: {
        channel_id?: string;
    };
}

interface IListResponse extends IExpressResponse<IChannelDto[], void> {}

app.get(API_URL.api.channel.toString(), async (req: IListRequest, res: IListResponse) => {
    const logger = createLogger();
    const [data, error] = await getChannelListAllAsync(req.query, logger);
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
    const logger = createLogger();
    const [data, error] = await allServices.channel.getChannelDetailsAsync(req.params.id, logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

export interface IChannelPostBody {
    channels: IChannelDto[];
}

interface IPostRequest extends IExpressRequest {
    body: IChannelPostBody;
}

interface IPostResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.channel.toString(), async (req: IPostRequest, res: IPostResponse) => {
    const logger = createLogger();
    const [, error] = await allServices.channel.postChannelAsync(req.body.channels, logger );
    if (error) {
        return res.status(400).send( error);
    }
    return res.send();
});
