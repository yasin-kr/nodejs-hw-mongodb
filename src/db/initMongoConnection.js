import mongoose from 'mongoose';

import { env } from '../utils/env.js';

export const initMongoConnection = async () => {
  const uri = env('MONGODB_URI', '');

  if (uri) {
    await mongoose.connect(uri);
    console.log('Mongo connection successfully established!');
    return;
  }

  const user = env('MONGODB_USER');
  const password = env('MONGODB_PASSWORD');
  const url = env('MONGODB_URL');
  const db = env('MONGODB_DB');

  await mongoose.connect(
    `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority`,
  );

  console.log('Mongo connection successfully established!');
};
