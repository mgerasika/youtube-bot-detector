import { API_URL } from "@server/api-url.constant";
import { app, IExpressRequest, IExpressResponse } from "@server/express-app";
import { allServices } from "../all-services";
import { createLogger } from "@common/utils/create-logger.utils";


interface IFullScanByVideoRequest extends IExpressRequest {
    query: {
        video_id?: string;
        channel_id?: string;
    };
}

interface IFullScanByVideoResponse extends IExpressResponse<string, void> {}

app.get(API_URL.api.scan.fullByVideo.toString(), async (req: IFullScanByVideoRequest, res: IFullScanByVideoResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.scan.getFullScanByVideoAsync(req.query.video_id || '', req.query.channel_id || '', logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

interface IFullScanByChannelKeyRequest extends IExpressRequest {
    query: {
        channel_id?: string;
    };
}

interface IFullScanByChannelResponse extends IExpressResponse<string, void> {}
app.get(API_URL.api.scan.fullByChannel.toString(), async (req: IFullScanByChannelKeyRequest, res: IFullScanByChannelResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.scan.getFullScanByChannelAsync(req.query.channel_id || '',  logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});







