import { API_URL } from "@server/constants/api-url.constant";
import { app, IExpressRequest, IExpressResponse } from "@server/express-app";
import { allServices } from "../all-services";
import { IApiKeyDto } from "@server/dto/api-key.dto";
import { IStatistic, IStatisticInfo } from "./statistic.service";
import { memoryCache } from "@server/memory-cache";

interface IStatisticInfoRequest extends IExpressRequest {
}

interface IStatisticInfoResponse extends IExpressResponse<IStatisticInfo, void> {}

app.get(API_URL.api.statistic.info.toString(), memoryCache(60*60), async (req: IStatisticInfoRequest, res: IStatisticInfoResponse) => {
    const [data, error] = await allServices.statistic.getStatisticInfoAsync();
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});


interface IByVideoRequest extends IExpressRequest {
    query: {
        video_id?: string;
    };
}

interface IByVideoResponse extends IExpressResponse<IStatistic[], void> {}

app.get(API_URL.api.statistic.byVideo.toString(), async (req: IByVideoRequest, res: IByVideoResponse) => {
    const [data, error] = await allServices.statistic.getStatisticByVideoAsync(req.query.video_id);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

interface IByChannelRequest extends IExpressRequest {
    query: {
        channel_id?: string;
    };
}

interface IByChannelResponse extends IExpressResponse<IStatistic[], void> {}
app.get(API_URL.api.statistic.byChannel.toString(), async (req: IByChannelRequest, res: IByChannelResponse) => {
    const [data, error] = await allServices.statistic.getStatisticByChannelAsync(req.query.channel_id);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});




