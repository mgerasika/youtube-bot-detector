import { API_URL, } from "@server/api-url.constant";
import {IExpressRequest, IExpressResponse} from '@common/interfaces/express.interface';
import { app } from "@server/express-app";
import { createLogger, } from "@common/utils/create-logger.utils";
import { allServerInfo } from "./all-server-info.service";
import { IServerInfoDto } from "@server/dto/server-info.dto";


interface IGetAllServerInfoRequest extends IExpressRequest {
}

interface IGetAllServerInfoResponse extends IExpressResponse<IServerInfoDto, void> {}

app.get(API_URL.api.allServerInfo.toString(), async (req: IGetAllServerInfoRequest, res: IGetAllServerInfoResponse) => {
    const logger = createLogger();
    const [data, error] = await allServerInfo.getServerInfoListAsync(logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});


export interface IAddServerInfoBody extends IServerInfoDto{}

interface IPostServerInfoRequest extends IExpressRequest {
    body: IAddServerInfoBody;
}

interface IPostServerInfoResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.allServerInfo.toString(), async (req: IPostServerInfoRequest, res: IPostServerInfoResponse) => {
    const logger = createLogger();
    const [, error] = await allServerInfo.postServerInfoAsync(req.body, logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send();
});
