import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { getVideosAsync, IGetVideosBody } from './get-videos.service';

interface IRequest extends IExpressRequest {
    body: IGetVideosBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.scan.getVideos.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getVideosAsync(req.body);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});
