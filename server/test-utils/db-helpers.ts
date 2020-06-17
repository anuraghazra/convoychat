import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UpsertUser from '../utils/upsert-user'
import fakeUser from './fake-user';
dotenv.config();

export const connect = async () => {
  const uri = process.env.TEST_DB_URI
  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  }

  await mongoose.connect(uri, mongooseOpts);
  return mongoose.connection;
}

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close();
}

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

export const populate = async () => {
  // create fake user
  await UpsertUser(
    "google",
    {
      socialId: fakeUser.socialId,
      email: fakeUser.email,
      avatarUrl: fakeUser.avatarUrl,
      username: fakeUser.username,
      displayName: fakeUser.name,
    },
    () => { }
  );
  await UpsertUser(
    "google",
    {
      socialId: '12345',
      email: 'newuser@gmail.com',
      avatarUrl: fakeUser.avatarUrl,
      username: 'newuser-abcd',
      displayName: 'New user',
    },
    () => { }
  );
}