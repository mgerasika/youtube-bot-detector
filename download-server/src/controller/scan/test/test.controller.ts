import { IExpressRequest, IExpressResponse } from '@common/interfaces/express.interface';
import { app } from '@server/express-app';

import { allServices, } from '@server/controller/all-services';
import { API_URL, } from '@server/api-url.constant';
import { createLogger, } from '@common/utils/create-logger.utils';
import { IDownloadServerTestBody, } from '@common/model/download-server.model';

interface IRequest extends IExpressRequest {
    body: IDownloadServerTestBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.scan.test.toString(), async (req: IRequest, res: IResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.scan.testAsync(req.body, logger);
    if (error) {
        return res.status(400).send(error);
    }
    
   
    return res.send(data);
});
