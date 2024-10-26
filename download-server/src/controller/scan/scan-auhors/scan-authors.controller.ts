import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { allServices } from '@server/controller/all-services';
import { API_URL } from '@server/api-url.constant';
import { IScanAuthorsBody } from '@common/interfaces/scan.interface';

interface IRequest extends IExpressRequest {
    body: IScanAuthorsBody;
}

interface IResponse extends IExpressResponse<void, void> {}

app.post(API_URL.api.scan.scanAuthors.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await allServices.scan.scanAuthorsAsync(req.body);
    if (error) {
        return res.status(400).send(error);
    }
    
   
    return res.send(data);
});
