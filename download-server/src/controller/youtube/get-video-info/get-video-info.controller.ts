import { IGetVideoInfoBody, } from './get-video-info.service';
import { allServices, } from '@server/controller/all-services';
import { API_URL, } from '@server/api-url.constant';
import { createLogger, } from '@common/utils/create-logger.utils';
import { IExpressRequest, IExpressResponse } from '@common/interfaces/express.interface';
import { app } from '@server/express-app';

interface IRequest extends IExpressRequest {
    body: IGetVideoInfoBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.youtube.getVideoInfo.toString(), async (req: IRequest, res: IResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.youtube.getVideoInfoAsync(req.body, logger);
    if (error) {
        return res.status(400).send(error);
    }
    
    return res.send(data);
});
