import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { IGetVideosBody } from './get-videos.service';
import { allServices } from '@server/controller/all-services';
import { API_URL } from '@server/api-url.constant';
import { createLogger } from '@common/utils/create-logger.utils';

interface IRequest extends IExpressRequest {
    body: IGetVideosBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.youtube.getVideos.toString(), async (req: IRequest, res: IResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.youtube.getVideosAsync(req.body, logger);
    if (error) {
        return res.status(400).send(error);
    }
    
    return res.send(data);
});
