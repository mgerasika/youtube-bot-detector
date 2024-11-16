import { IExpressRequest, IExpressResponse } from '@common/interfaces/express.interface';
import { app } from '@server/express-app';
import { API_URL, } from '@server/api-url.constant';
import { IGetShortChannelInfoBody, } from './get-short-channel-info.service';
import { allServices, } from '@server/controller/all-services';
import { createLogger, } from '@common/utils/create-logger.utils';


interface IRequest extends IExpressRequest {
    body: IGetShortChannelInfoBody;
}

interface IResponse extends IExpressResponse<void, void> { }

app.post(API_URL.api.youtube.getShortChannelInfo.toString(), async (req: IRequest, res: IResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.youtube.getShortChannelInfoAsync(req.body.channelId, logger);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});
