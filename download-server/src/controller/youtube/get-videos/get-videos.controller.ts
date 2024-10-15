import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { getVideosAsync, IGetVideosBody } from './get-videos.service';
import { api } from '@server/api.generated';
import { toQuery } from '@server/utils/to-query.util';
import { oneByOneAsync } from '@server/utils/one-by-one-async.util';
import { allServices } from '@server/controller/all-services';

interface IRequest extends IExpressRequest {
    body: IGetVideosBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.youtube.getVideos.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await allServices.youtube.getVideosAsync(req.body);
    if (error) {
        return res.status(400).send(error);
    }
    
    return res.send(data);
});
