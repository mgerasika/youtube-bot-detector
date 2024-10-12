import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { API_URL } from '@server/constants/api-url.constant';

export interface IActorResponse {}

interface IRequest extends IExpressRequest {
    query: {
        actor_name?: string;
        movie_id?: string;
        imdb_id?: string;
    };
}

interface IResponse extends IExpressResponse<IActorResponse[], void> {}

app.get(API_URL.api.example.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getExampleList();
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getExampleList = async () => {
    return ['hello I am example'];
};
