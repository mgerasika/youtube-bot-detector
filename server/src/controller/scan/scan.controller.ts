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

interface IByChannelRequest extends IExpressRequest {
    query: {
        channel_id?: string;
        channel_url?: string;
    };
}

interface IByChannelResponse extends IExpressResponse<IScanInfo[], void> {}
app.get(API_URL.api.scan.byChannel.toString(), async (req: IByChannelRequest, res: IByChannelResponse) => {
    const [data, error] = await allServices.scan.getScanByChannelAsync(req.query.channel_id, req.query.channel_url);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});




