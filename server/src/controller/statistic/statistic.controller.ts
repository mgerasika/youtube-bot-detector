import { API_URL, } from "@server/api-url.constant";
import {IExpressRequest, IExpressResponse} from '@common/interfaces/express.interface';
import { app } from "@server/express-app";
import { allServices, } from "../all-services";
import { memoryCache, } from "@common/utils/memory-cache";
import { createLogger, } from "@common/utils/create-logger.utils";
import { IStatisticByChannelDetailed, } from "./statistic-by-channel-detailed";
import { IStatisticInfo, } from "./statistic-info";
import { getStatisticByVideoAsync, IStatisticByVideo, } from "./statistic-by-video";
import { IStatisticDto, } from "@server/dto/statistic.dto";
import { IStatisticByChannel } from "./statistic-by-channel";

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


interface IStatisticByChannelDetailedRequest extends IExpressRequest {
    query: {
        channel_id?: string;
    };
}

interface IStatisticByChannelDetailedResponse extends IExpressResponse<IStatisticByChannelDetailed, void> {}
app.get(API_URL.api.statistic.byChannelDetailed.toString(),memoryCache(1), async (req: IStatisticByChannelDetailedRequest, res: IStatisticByChannelDetailedResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.statistic.getStatisticByChannelDetailedAsync(req.query.channel_id || '', logger);
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

interface IStatisticByChannelResponse extends IExpressResponse<IStatisticByChannel, void> {}
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



interface IGetListRequest extends IExpressRequest {
   
}

interface IGetListResponse extends IExpressResponse<IStatisticDto[], void> {}

app.get(API_URL.api.statistic.toString(), async (req: IGetListRequest, res: IGetListResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.statistic.getStatisticListAsync( logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});



interface IGetByIdRequest extends IExpressRequest {
    params: {
        id: string;
    };
}

interface IGetByIdResponse extends IExpressResponse<IStatisticDto, void> {}

app.get(API_URL.api.statistic.id().toString(), async (req: IGetByIdRequest, res: IGetByIdResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.statistic.getStatisticDetailsAsync(req.params.id, logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

export interface IStatisticPostBody  {
    statistics: IStatisticDto[];
}

interface IPostRequest extends IExpressRequest {
    body: IStatisticPostBody;
}

interface IPostResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.statistic.toString(), async (req: IPostRequest, res: IPostResponse) => {
    const logger = createLogger();
    const [, error] = await allServices.statistic.postStatisticAsync(req.body.statistics, logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send();
});
