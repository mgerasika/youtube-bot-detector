import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';
import { IActorResponse } from './get-example-list.controller';


export interface IExampleBody extends Omit<IActorResponse, 'id'> {}

interface IRequest extends IExpressRequest {
    body: IExampleBody;
}

interface IResponse extends IExpressResponse<IActorResponse[], void> {}

app.post(API_URL.api.example.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await postExampleAsync(req.body);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const postExampleAsync = async (data: Omit<IExampleBody, 'id' | 'get_imdb_id'>) => {
   console.log('post exampoe')
   return ['success']
};
