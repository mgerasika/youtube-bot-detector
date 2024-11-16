import { API_URL, } from "@server/api-url.constant";
import {IExpressRequest, IExpressResponse} from '@common/interfaces/express.interface';
import { app } from "@server/express-app";
import { createLogger, } from "@common/utils/create-logger.utils";
import { getServerInfoAsync } from "./server-info.service";
import { IServerInfo } from "@common/model/server-info.interface";

interface IServerInfoRequest extends IExpressRequest {
}

interface IServerInfoResponse extends IExpressResponse<IServerInfo, void> {}

app.get(API_URL.api.serverInfo.toString(), async (req: IServerInfoRequest, res: IServerInfoResponse) => {
    const logger = createLogger();
    const [data, error] = await getServerInfoAsync(logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});
