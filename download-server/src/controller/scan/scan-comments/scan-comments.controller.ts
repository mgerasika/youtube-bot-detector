import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { scanCommentsAsync } from './scan-comments.service';
import { API_URL } from '@server/api-url.constant';
import { IScanCommentsBody } from '@common/interfaces/scan.interface';
import { createLogger } from '@common/utils/create-logger.utils';

interface IRequest extends IExpressRequest {
    body: IScanCommentsBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.scan.scanComments.toString(), async (req: IRequest, res: IResponse) => {
    const logger = createLogger();
    const [data, error] = await scanCommentsAsync(req.body, logger);
    if (error) {
        return res.status(400).send(error);
    }
    return res.send(data);
});
