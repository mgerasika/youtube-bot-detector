import { IExpressRequest, IExpressResponse, app } from '@server/express-app';

import { allServices } from '@server/controller/all-services';
import { API_URL } from '@server/api-url.constant';
import { IFixBoxy, IScanChannelInfoBody } from '@common/interfaces/scan.interface';
import { createLogger } from '@common/utils/create-logger.utils';

interface IRequest extends IExpressRequest {
    body: IFixBoxy;
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.scan.fix.toString(), async (req: IRequest, res: IResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.scan.fixAsync(req.body, logger);
    if (error) {
        return res.status(400).send(error);
    }
    
   
    return res.send(data);
});
