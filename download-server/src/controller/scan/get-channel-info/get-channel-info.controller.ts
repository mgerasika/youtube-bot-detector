import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { IGetChannelInfoBody, getChannelInfoAsync } from './get-channel-info.service';


interface IRequest extends IExpressRequest {
    body: IGetChannelInfoBody;
}

interface IResponse extends IExpressResponse<void, void> { }

app.post(API_URL.api.scan.getChannelInfo.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getChannelInfoAsync(req.body);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});
