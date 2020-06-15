import "reflect-metadata";
import { prop as Property, arrayProp, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { Room } from './Room';
import { Field, ObjectType, ID } from 'type-graphql';
import { ObjectID } from 'mongodb'
import * as mongoose from 'mongoose';
import { ObjectIdScalar } from "../utils/objectid-scalar";
type Ref<T> = T | ObjectID;
enum Providers {
  GOOGLE = 'google',
  GITHUB = 'github',
}

@modelOptions({ options: { customName: 'user', }, schemaOptions: { timestamps: true, collection: "users" } })
@ObjectType()
export class User {
  @Field(type => ID)
  _id: ObjectID;

  updatedAt!: Date;

  @Field()
  createdAt!: Date;

  @Field()
  @Property({ required: true })
  public name!: string;

  @Field()
  @Property({ required: true, trim: true, minlength: 2, maxlength: 100, unique: true })
  public username!: string;

  @Field(type => [ID])
  @arrayProp({ ref: 'room', required: true })
  public rooms!: Ref<Room>[];

  @Property({ required: true, unique: true })
  public email!: string;

  @Property({ enum: Providers })
  public provider!: string;

  @Property({ required: true, unique: true })
  public socialId!: string;

  @Property({ required: true })
  public avatarUrl!: string;
}

const UserModel = getModelForClass(User);

export default UserModel;
