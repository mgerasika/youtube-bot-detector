import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/api-url.constant';
import { IGetChannelIdBody } from './get-channel-id.service';
import { allServices } from '@server/controller/all-services';
import { createLogger } from '@common/utils/create-logger.utils';


interface IRequest extends IExpressRequest {
    body: IGetChannelIdBody;
}

interface IResponse extends IExpressResponse<void, void> { }

app.post(API_URL.api.youtube.getChannelId.toString(), async (req: IRequest, res: IResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.youtube.getChannelIdAsync(req.body.channelName, logger);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});
