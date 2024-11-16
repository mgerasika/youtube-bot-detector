import { IExpressRequest, IExpressResponse } from '@common/interfaces/express.interface';
import { app } from '@server/express-app';

import { allServices, } from '@server/controller/all-services';
import { API_URL, } from '@server/api-url.constant';
import { createLogger, } from '@common/utils/create-logger.utils';
import { IScanChannelInfoBody, } from '@common/model/download-server.model';

interface IRequest extends IExpressRequest {
    body: IScanChannelInfoBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.scan.scanChannelInfo.toString(), async (req: IRequest, res: IResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.scan.scanChannelInfoAsync(req.body, logger);
    if (error) {
        return res.status(400).send(error);
    }
    
   
    return res.send(data);
});
