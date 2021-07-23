// mongodb+srv://<username>:<password>@cluster0.oihqw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

import { ConnectOptions } from 'mongoose';

const {
  MONGO_USERNAME = 'thaneshwor',
  MONGO_PASSWORD = '4RUM33zPgeAkxMD',
  MONGO_DATABASE = 'fk_ecommerce',
} = process.env;

export const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.oihqw.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`;

export const MONGO_OPTIONS: ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};
