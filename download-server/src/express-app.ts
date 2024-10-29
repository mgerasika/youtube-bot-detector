import express, { Response } from 'express';

export const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// app.use(bodyParser.text({ type: '*/*' }));
app.use(bodyParser.json());
// app.use(
//     cors({
//         origin: 'ua-video-online.web.app',
//         optionsSuccessStatus: 200,
//     }),
// );
app.use(cors());

app.use((err: any, req: any, res: any, next: any) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.json({
        message: err.message,
        error: err
      });
});
app.use(express.json({ limit: '500mb' }));
app.use(function (err: any, req: any, res: any, next: any) {
    if (err) {
        console.error(err.stack);
        res.status(400).send('Custom handler ' + err?.toString());
    }
});
const morgan = require('morgan');
morgan.token('body', (req: any, res: any) => {
    return JSON.stringify(req.body);
});
// Custom token to log body length
morgan.token('body-length', (req:any) => {
    return req.body ? JSON.stringify(req.body).length : 0;
});
//app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body-length'));

export type IExpressRequest = {};
export type IExpressResponse<TSuccess, TError> = {
    json: (data: TSuccess | TError) => void;
    send: (data: TSuccess | TError) => void;
} & Response;
