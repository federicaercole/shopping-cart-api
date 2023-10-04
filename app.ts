import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config();
import apiRouter from './routes/api';
import { ResponseError } from './types';

const app = express();

const corsOptions = {
    origin: 'https://shopapp.federicaercole.com',
    optionsSuccessStatus: 200,
}

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);

app.use(function (_req, _res, next) {
    const error: ResponseError = new Error("This page doesn't exist");
    error.status = 404;
    next(error);
})

app.use(function (err: ResponseError, _req: express.Request, res: express.Response) {
    res.status(err.status || 500).json({ message: err.message });
});

app.listen(process.env.PORT);