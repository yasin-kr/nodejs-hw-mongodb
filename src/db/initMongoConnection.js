import mongoose from 'mongoose';

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

const requiredEnvVars = {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_URL,
  MONGODB_DB,
};

export const initMongoConnection = async () => {
  const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing env variables: ${missingEnvVars.join(', ')}`);
  }

  const user = encodeURIComponent(MONGODB_USER);
  const password = encodeURIComponent(MONGODB_PASSWORD);

  await mongoose.connect(
    `mongodb+srv://${user}:${password}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority&authSource=admin`,
  );

  console.log('Mongo connection successfully established!');
};
