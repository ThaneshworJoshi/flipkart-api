import './env';
import path from 'path';
import express from 'express';
import routes from './routes';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import morgan from 'morgan';
import { notFound, genericErrorHandler } from './middlewares/errorHandler';
import { logStream } from './utils/logger';

const app = express();

app.use(cors());
// set security HTTP headers
app.use(helmet());
app.use(morgan('dev', { stream: logStream }));

// middleware to accept JSON in body
app.use(express.json());

// parse urleconded request body
app.use(express.urlencoded({ extended: true }));

//TODO xss prevention

// To remove data, use:
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors

// TODO use rate limiter
// v1 api routes

// Make uploads folder static
app.use('/uploads', express.static(path.join(path.resolve(), '/uploads')));

app.use('/api/v1', routes);

// handle error
app.use([notFound, genericErrorHandler]);

export default app;
