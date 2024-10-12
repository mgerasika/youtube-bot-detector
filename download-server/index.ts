require('module-alias/register');
import { rabbitMQ_subscribeAsync } from '@server/rabbit-mq';
import { dbService } from './src/controller/db.service';
import { app } from './src/express-app';
import { ENV } from '@server/constants/env';

app.get('/', (req, res) => {
    res.send(JSON.stringify(dbService, null, 2));
});

const port = process.env.PORT || 8006;
if (ENV.rabbit_mq) {
    rabbitMQ_subscribeAsync((data) => {
        if (data.msg) {
            // console.log('recieved from rabbit mq', data.setupBody);
        }
        return Promise.resolve('empty');
    });
}
// console.log('ENV = ', ENV);
const server = app.listen(port, function () {
    console.log('Download Server Started on port ' + port);
});
