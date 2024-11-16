
import { allServices, } from '@server/controller/all-services';
import { API_URL, } from '@server/api-url.constant';
import { createLogger, } from '@common/utils/create-logger.utils';
import { IStatisticServerTestBody, } from '@common/model/statistic-server.model';
import { app } from '@server/express-app';
import {IExpressRequest, IExpressResponse} from '@common/interfaces/express.interface';

interface IRequest extends IExpressRequest {
    body: IStatisticServerTestBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.get(API_URL.api.statistic.test.toString(), async (req: IRequest, res: IResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.statistic.test2Async(req.body, logger);
    if (error) {
        return res.status(400).send(error);
    }
    
   
    return res.send(data);
});
