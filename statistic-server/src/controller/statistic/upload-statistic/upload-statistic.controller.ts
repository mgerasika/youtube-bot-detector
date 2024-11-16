
import { allServices, } from '@server/controller/all-services';
import { API_URL, } from '@server/api-url.constant';
import { createLogger, } from '@common/utils/create-logger.utils';
import { IUploadStatisticBody, } from '@common/model/statistic-server.model';
import { IExpressRequest, IExpressResponse } from '@common/interfaces/express.interface';
import { app } from '@server/express-app';

interface IRequest extends IExpressRequest {
    body: IUploadStatisticBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.get(API_URL.api.statistic.uploadStatistic.toString(), async (req: IRequest, res: IResponse) => {
    const logger = createLogger();
    const [data, error] = await allServices.statistic.uploadStatisticAsync(req.body, logger);
    if (error) {
        return res.status(400).send(error);
    }
    
   
    return res.send(data);
});
