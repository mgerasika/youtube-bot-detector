import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { scanVideosAsync, IScanVideosBody } from './scan-videos.service';
import { api } from '@server/api.generated';
import { toQuery } from '@server/utils/to-query.util';
import { oneByOneAsync } from '@server/utils/one-by-one-async.util';

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


