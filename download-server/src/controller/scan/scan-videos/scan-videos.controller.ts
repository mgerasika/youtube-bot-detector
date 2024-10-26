import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { scanVideosAsync } from './scan-videos.service';
import { API_URL } from '@server/api-url.constant';
import { IScanVideosBody } from '@common/interfaces/scan.interface';

interface IRequest extends IExpressRequest {
    body: IScanVideosBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.scan.scanVideos.toString(), async (req: IRequest, res: IResponse) => {
       const [data, error] = await scanVideosAsync(req.body);
    if (error) {
        return res.status(400).send(error);
    }
    
    return res.send(data);
});


