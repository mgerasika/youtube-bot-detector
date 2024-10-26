import { API_URL } from "@server/api-url.constant";
import { app, IExpressRequest, IExpressResponse } from "@server/express-app";
import { allServices } from "../all-services";
import { IApiKeyDto } from "@server/dto/api-key.dto";
import { IScanInfo } from "./scan.service";
import { memoryCache } from "@common/utils/memory-cache";


interface IByVideoRequest extends IExpressRequest {
    query: {
        video_id?: string;
    };
}

interface IByVideoResponse extends IExpressResponse<IScanInfo[], void> {}

app.get(API_URL.api.scan.byVideo.toString(), async (req: IByVideoRequest, res: IByVideoResponse) => {
    const [data, error] = await allServices.scan.getScanByVideoAsync(req.query.video_id);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

interface IAddYoutubeKeyRequest extends IExpressRequest {
    query: {
        channel_id?: string;
        channel_url?: string;
    };
}

interface IAddYoutubeKeyResponse extends IExpressResponse<IScanInfo[], void> {}
app.get(API_URL.api.scan.byChannel.toString(), async (req: IAddYoutubeKeyRequest, res: IAddYoutubeKeyResponse) => {
    const [data, error] = await allServices.scan.getScanByChannelAsync(req.query.channel_id, req.query.channel_url);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

interface IAddYoutubeKeyRequest extends IExpressRequest {
    body: {
        email: string;
        key: string;
    }
}

interface IAddYoutubeKeyResponse extends IExpressResponse<IScanInfo[], void> {}
app.post(API_URL.api.scan.addYoutubeKey.toString(), async (req: IAddYoutubeKeyRequest, res: IAddYoutubeKeyResponse) => {
    const [data, error] = await allServices.scan.addYoutubeKey(req.body.email, req.body.key);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});




