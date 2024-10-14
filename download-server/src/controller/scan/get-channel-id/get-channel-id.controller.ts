import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { IGetChannelIdBody, getChannelIdAsync } from './get-channel-id.service';


interface IRequest extends IExpressRequest {
    body: IGetChannelIdBody;
}

interface IResponse extends IExpressResponse<void, void> { }

app.post(API_URL.api.scan.getChannelId.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getChannelIdAsync(req.body.channelName);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});
