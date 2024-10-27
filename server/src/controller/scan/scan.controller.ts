import { API_URL } from "@server/api-url.constant";
import { app, IExpressRequest, IExpressResponse } from "@server/express-app";
import { allServices } from "../all-services";
import { IScanInfo } from "./scan.service";
import { createLogger } from "@common/utils/create-logger.utils";


interface IByVideoRequest extends IExpressRequest {
    query: {
        video_id?: string;
    };
}

interface IByVideoResponse extends IExpressResponse<IScanInfo[], void> {}

app.get(API_URL.api.scan.byVideo.toString(), async (req: IByVideoRequest, res: IByVideoResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.scan.getScanByVideoAsync(req.query.video_id || '', logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

interface IAddYoutubeKeyRequest extends IExpressRequest {
    query: {
        channel_id?: string;
    };
}

interface IAddYoutubeKeyResponse extends IExpressResponse<IScanInfo[], void> {}
app.get(API_URL.api.scan.byChannel.toString(), async (req: IAddYoutubeKeyRequest, res: IAddYoutubeKeyResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.scan.getScanByChannelAsync(req.query.channel_id || '',  logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});


interface IFixRequest extends IExpressRequest {
}

interface IFixResponse extends IExpressResponse<string, void> {}
app.get(API_URL.api.scan.fix.toString(), async (req: IFixRequest, res: IFixResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.scan.fixAsync(logger);
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
    const logger = createLogger();
    const [data, error] = await allServices.scan.addYoutubeKey(req.body.email, req.body.key, logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});




