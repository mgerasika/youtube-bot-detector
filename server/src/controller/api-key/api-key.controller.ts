import { API_URL } from "@server/api-url.constant";
import { app, IExpressRequest, IExpressResponse } from "@server/express-app";
import { allServices } from "../all-services";
import { IApiKeyDto } from "@server/dto/api-key.dto";
import { createLogger } from "@common/utils/create-logger.utils";


interface IGetRequest extends IExpressRequest {
    query: {
        old_key?: string;
    }
}

interface IGetResponse extends IExpressResponse<IApiKeyDto, void> {}

app.get(API_URL.api.apiKey.active.toString(), async (req: IGetRequest, res: IGetResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.apiKey.getActiveApiKeyAsync(req.query.old_key as string, logger);
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
