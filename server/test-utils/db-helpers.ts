import dotenv from 'dotenv';
import mongoose from 'mongoose';
import UserModel from '../entities/User';
import { fakeUser, fakeUser2 } from './fake-user';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import isCI from 'is-ci';

dotenv.config();

const mongod = new MongoMemoryServer();

export const connect = async () => {
  let uri = process.env.TEST_DB_URI;

  if (isCI) {
    uri = await mongod.getConnectionString();
  }

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  await mongoose.connect(uri, mongooseOpts);
  return mongoose.connection;
}

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close();
  if (isCI) {
    mongod.stop()
  }
}

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

export const populateUsers = async () => {
  // create fake users
  await new UserModel({
    _id: fakeUser.id,
    provider: "google",
    socialId: fakeUser.socialId,
    email: fakeUser.email,
    avatarUrl: fakeUser.avatarUrl,
    username: fakeUser.username,
    name: fakeUser.name,
  }).save();

  await new UserModel({
    provider: fakeUser2.provider,
    socialId: fakeUser2.socialId,
    email: fakeUser2.email,
    avatarUrl: fakeUser.avatarUrl,
    username: fakeUser2.username,
    name: fakeUser2.name,
  }).save()
}