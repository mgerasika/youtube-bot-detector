import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/api-url.constant';
import { IGetShortChannelInfoBody } from './get-short-channel-info.service';
import { allServices } from '@server/controller/all-services';


interface IRequest extends IExpressRequest {
    body: IGetShortChannelInfoBody;
}

interface IResponse extends IExpressResponse<void, void> { }

app.post(API_URL.api.youtube.getShortChannelInfo.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await allServices.youtube.getShortChannelInfoAsync(req.body.channelId);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});
