import { API_URL } from "@server/api-url.constant";
import { app, IExpressRequest, IExpressResponse } from "@server/express-app";
import { allServices } from "../all-services";
import { IApiKeyDto } from "@server/dto/api-key.dto";
import { IStatistic, IStatisticInfo } from "./statistic.service";
import { memoryCache } from "@common/utils/memory-cache";
import { createLogger } from "@common/utils/create-logger.utils";
import { IGroupStatistic } from "./group-statistic";

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


interface IByChannelRequest extends IExpressRequest {
    query: {
        channel_id?: string;
    };
}

interface IByChannelResponse extends IExpressResponse<IStatistic[], void> {}
app.get(API_URL.api.statistic.byChannel.toString(),memoryCache(1), async (req: IByChannelRequest, res: IByChannelResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.statistic.getStatisticByChannelAsync(req.query.channel_id || '', logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

interface IByChannelAndVideoRequest extends IExpressRequest {
    query: {
        channel_id?: string;
        video_id?: string;
    };
}

interface IByChannelAndVideoResponse extends IExpressResponse<IStatistic[], void> {}
app.get(API_URL.api.statistic.byChannelAndVideo.toString(),memoryCache(1), async (req: IByChannelAndVideoRequest, res: IByChannelAndVideoResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.statistic.getStatisticByChannelAndVideoAsync(req.query.channel_id || '', req.query.video_id || '', logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

interface IByGroupRequest extends IExpressRequest {
    query: {
        video_id?: string;
    };
}

interface IByGroupResponse extends IExpressResponse<IGroupStatistic[], void> {}
app.get(API_URL.api.statistic.byGroup.toString(),memoryCache(1), async (req: IByGroupRequest, res: IByGroupResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.statistic.getStatisticByGroup(req.query.video_id || '', logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});




