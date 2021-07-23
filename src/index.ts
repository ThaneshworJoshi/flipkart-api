import mongoose from 'mongoose';
import app from './app';
import { APP_PORT } from './config';
import { MONGO_OPTIONS, MONGO_URI } from './config/db';
import logger from './utils/logger';

let server: any;
mongoose.connect(MONGO_URI, MONGO_OPTIONS).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(APP_PORT, () => logger.info(`Listening to port :${APP_PORT}`));
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server Closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received.');
  logger.info('Closing http server.');
  if (server) {
    server.close(() => {
      logger.info('Http server closed');
      mongoose.connection.close(false, () => {
        logger.info('MongoDb connection closed');
        process.exit(0);
      });
    });
  }
});

// Exist on clt + c
process.on('SIGINT', () => {
  // logger.info('SIGTERM received');
  if (server) {
    server.close(() => {
      console.log('Http server closed');
      mongoose.connection.close(false, () => {
        console.log('MongoDb connection closed');
        process.exit(0);
      });
    });
  }
});
