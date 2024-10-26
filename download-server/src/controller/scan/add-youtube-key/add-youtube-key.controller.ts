import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { addYoutubeKeyAsync } from './add-youtube-key.service';
import { API_URL } from '@server/api-url.constant';
import { IAddYoutubeKeyBody, IScanVideosBody } from '@common/interfaces/scan.interface';

interface IRequest extends IExpressRequest {
    body: IAddYoutubeKeyBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.scan.addYoutubeKey.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await addYoutubeKeyAsync(req.body);
    if (error) {
        return res.status(400).send(error);
    }
    
    return res.send(data);
});


