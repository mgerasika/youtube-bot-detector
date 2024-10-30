import { API_URL } from "@server/api-url.constant";
import { app, IExpressRequest, IExpressResponse } from "@server/express-app";
import { allServices } from "../all-services";
import { memoryCache } from "@common/utils/memory-cache";
import { createLogger } from "@common/utils/create-logger.utils";
import { IStatisticByChannel } from "./statistic-by-channel";
import { IStatisticInfo } from "./statistic-info";
import { getStatisticByVideoAsync, IStatisticByVideo } from "./statistic-by-video";

interface IStatisticInfoRequest extends IExpressRequest {
}

interface IStatisticInfoResponse extends IExpressResponse<IStatisticInfo, void> {}

app.get(API_URL.api.statistic.info.toString(), memoryCache(1), async (req: IStatisticInfoRequest, res: IStatisticInfoResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.statistic.getStatisticInfoAsync(logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});


interface IStatisticByChannelRequest extends IExpressRequest {
    query: {
        channel_id?: string;
    };
}

interface IStatisticByChannelResponse extends IExpressResponse<IStatisticByChannel[], void> {}
app.get(API_URL.api.statistic.byChannel.toString(),memoryCache(1), async (req: IStatisticByChannelRequest, res: IStatisticByChannelResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.statistic.getStatisticByChannelAsync(req.query.channel_id || '', logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

interface IStatisticByVideoRequest extends IExpressRequest {
    query: {
        video_id?: string;
    };
}

interface IStatisticByVideoResponse extends IExpressResponse<IStatisticByVideo[], void> {}
app.get(API_URL.api.statistic.byVideo.toString(),memoryCache(1), async (req: IStatisticByVideoRequest, res: IStatisticByVideoResponse) => {
    const logger = createLogger();
    const [data, error] = await getStatisticByVideoAsync( req.query.video_id || '', logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});





