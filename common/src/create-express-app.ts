import express, { Response,Application } from 'express';

import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import fs from 'fs';
    import path from 'path';
       export const httpOptions = {
        key: fs.readFileSync(path.join(__dirname, '../../../..', 'server.key')), // Replace with the path to your .key file
        cert: fs.readFileSync(path.join(__dirname, '../../../..', 'server.cert')), // Replace with the path to your .cert file
    };
export const createExpressApp = ():Application => {
    const app = express();
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    // app.use(
    //     cors({
    //         origin: 'ua-video-online.web.app',
    //         optionsSuccessStatus: 200,
    //     }),
    // );

    // Load the SSL certificate and private key

    app.use(cors());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));
    app.use(compression({ threshold: 0 }));
    app.use((err: any, req: any, res: any, next: any) => {
        if (res.headersSent) {
            return next(err);
        }
        res.status(500);
        res.json({
            message: err.message,
            error: err,
        });
    });
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
    morgan.token('body-length', (req: any) => {
        return req.body ? JSON.stringify(req.body).length : 0;
    });
    //app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));
    app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body-length'));
    return app;
}


