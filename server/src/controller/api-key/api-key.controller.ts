import { API_URL } from "@server/constants/api-url.constant";
import { app, IExpressRequest, IExpressResponse } from "@server/express-app";
import { allServices } from "../all-services";
import { IApiKeyDto } from "@server/dto/api-key.dto";


interface IGetRequest extends IExpressRequest {
}

interface IGetResponse extends IExpressResponse<IApiKeyDto, void> {}

app.get(API_URL.api.apiKey.active.toString(), async (req: IGetRequest, res: IGetResponse) => {
    const [data, error] = await allServices.apiKey.getActiveApiKeyAsync();
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
    const [, error] = await allServices.apiKey.postApiKey(req.body);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send();
});
