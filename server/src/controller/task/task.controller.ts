import { API_URL, } from "@server/api-url.constant";
import {IExpressRequest, IExpressResponse} from '@common/interfaces/express.interface';
import { app } from "@server/express-app";
import { allServices, } from "../all-services";
import { createLogger, } from "@common/utils/create-logger.utils";


interface IChannelToStatisticRequest extends IExpressRequest {
}

interface IChannelToStatisticResponse extends IExpressResponse<string, void> {}

app.get(API_URL.api.task.channelToStatistic.toString(), async (req: IChannelToStatisticRequest, res: IChannelToStatisticResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.task.channelToStatisticAsync(logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});




interface IStatisticToFirebaseRequest extends IExpressRequest {
}

interface IStatisticToFirebaseResponse extends IExpressResponse<string, void> {}
app.get(API_URL.api.task.statisticToFirebase.toString(), async (req: IStatisticToFirebaseRequest, res: IStatisticToFirebaseResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.task.statisticToFirebaseAsync( logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});

interface IRescanChannelsRequest extends IExpressRequest {
}

interface IRescanChannelsResponse extends IExpressResponse<string, void> {}
app.get(API_URL.api.task.rescanChannels.toString(), async (req: IRescanChannelsRequest, res: IRescanChannelsResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.task.rescanChannelsAsync( logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});







