import { IExpressRequest, IExpressResponse, app } from '@server/express-app';
import { typeOrmAsync } from '@server/utils/type-orm-async.util';
import { API_URL } from '@server/constants/api-url.constant';
import { ActorDto, IActorDto } from '@server/dto/actor.dto';
import { sqlAsync } from '@server/utils/sql-async.util';
import { sql_and, sql_where } from '@server/utils/sql.util';
import { dbService } from '../db.service';
import { rabbitMQ_sendDataAsync } from '@server/rabbit-mq';

export interface IActorResponse extends IActorDto {}

interface IRequest extends IExpressRequest {
    query: {
		actor_name?: string;
		movie_id?: string;
		imdb_id?: string;
    };
}

interface IResponse extends IExpressResponse<IActorResponse[], void> {}

app.get(API_URL.api.actor.toString(), async (req: IRequest, res: IResponse) => {
    const [data, error] = await getActorListAllAsync(req.query);
    if (error) {
        return res.status(400).send('error' + error);
    }
    return res.send(data);
});

export const getActorListAllAsync = async (query: IRequest['query']) => {
	Array(5).fill('').map((_,idx)=>{
		rabbitMQ_sendDataAsync({msg:{exampleFlag:true, exampleMessage:'message from server ' + idx}})
	});
	
    return await sqlAsync<IActorResponse[]>(async (client) => {
        const { rows } = await client.query(`select * from actor 
			${sql_where('actor.name', query.actor_name)} 
			`);
        return rows;
    });
};
