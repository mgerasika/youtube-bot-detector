import { IExpressRequest, IExpressResponse } from '@common/interfaces/express.interface';
import { app } from '@server/express-app';
import { API_URL, } from '@server/api-url.constant';
import { getCommentsAsync, IGetCommentsBody, } from './get-comments.service';
import { allServices, } from '@server/controller/all-services';
import { createLogger, } from '@common/utils/create-logger.utils';

interface IRequest extends IExpressRequest {
    body: IGetCommentsBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.youtube.getComments.toString(), async (req: IRequest, res: IResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.youtube.getCommentsAsync(req.body, logger);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});
