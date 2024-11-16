import { API_URL, } from "@server/api-url.constant";
import {IExpressRequest, IExpressResponse} from '@common/interfaces/express.interface';
import { app } from "@server/express-app";
import { allServices, } from "../all-services";
import { IApiKeyDto, } from "@server/dto/api-key.dto";
import { createLogger, } from "@common/utils/create-logger.utils";


interface IGetRequest extends IExpressRequest {
    query: {
        old_key?: string;
        old_status?: string;
    }
}

interface IGetResponse extends IExpressResponse<IApiKeyDto, void> {}

app.get(API_URL.api.apiKey.active.toString(), async (req: IGetRequest, res: IGetResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.apiKey.getActiveApiKeyAsync(req.query.old_key as string, req.query.old_status, logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});


interface IApiKeyInfoRequest extends IExpressRequest {
}

interface IApiKeyInfoResponse extends IExpressResponse<IApiKeyDto, void> {}

app.get(API_URL.api.apiKey.info.toString(), async (req: IApiKeyInfoRequest, res: IApiKeyInfoResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.apiKey.getActiveKeyInfoAsync(logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

export interface IApiKeyPostBody extends IApiKeyDto{}

interface IPostRequest extends IExpressRequest {
    body: IApiKeyPostBody;
}

interface IPostResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.apiKey.toString(), async (req: IPostRequest, res: IPostResponse) => {
    const logger = createLogger();
    const [, error] = await allServices.apiKey.postApiKey(req.body, logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send();
});


interface IAddYoutubeKeyRequest extends IExpressRequest {
    body: {
        email: string;
        key: string;
    }
}

interface IAddYoutubeKeyResponse extends IExpressResponse<void, void> {}
app.post(API_URL.api.apiKey.addYoutubeKey.toString(), async (req: IAddYoutubeKeyRequest, res: IAddYoutubeKeyResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.apiKey.addYoutubeKey(req.body.email, req.body.key, logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});