require('module-alias/register');
import { rabbitMQ_subscribeAsync } from '@server/rabbit-mq';
import { allServices } from './src/controller/all-services';
import { app } from './src/express-app';
import { ENV } from '@server/constants/env';
import './src/controller/all-controllers';

app.get('/', (req, res) => {
    res.send(JSON.stringify(allServices, null, 2));
});

const port = process.env.PORT || 8006;
if (ENV.rabbit_mq) {
    rabbitMQ_subscribeAsync((data) => {
        if (data.msg) {
            const method = (allServices.scan as any)[data.msg.methodName] as Function;
            if(method) {
                return  method.call(allServices.scan, data.msg.methodArgumentsJson);
            }
        }
        return Promise.resolve();
    });
}
// console.log('ENV = ', ENV);
const server = app.listen(port, function () {
    console.log('Download Server Started on port ' + port);
});
