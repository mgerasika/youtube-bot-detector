import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { scanVideosAsync } from './scan-videos.service';
import { API_URL } from '@server/api-url.constant';
import { allServices } from '@server/controller/all-services';
import { createLogger } from '@common/utils/create-logger.utils';
import { IScanVideosBody } from '@common/model';

interface IRequest extends IExpressRequest {
    body: IScanVideosBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.scan.scanVideos.toString(), async (req: IRequest, res: IResponse) => {
    const logger = createLogger();
       const [data, error] = await allServices.scan.scanVideosAsync(req.body, logger);
    if (error) {
        return res.status(400).send(error);
    }
    
    return res.send(data);
});


