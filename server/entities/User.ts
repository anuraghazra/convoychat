import "reflect-metadata";
import { Room } from './Room';
import { ObjectID } from 'mongodb'
import { Field, ObjectType, ID } from 'type-graphql';
import { prop as Property, Ref, arrayProp, getModelForClass, modelOptions } from '@typegoose/typegoose';

enum Providers {
  GOOGLE = 'google',
  GITHUB = 'github',
}

@modelOptions({
  options: { customName: 'user', },
  schemaOptions: {
    timestamps: true,
    collection: "users"
  }
})
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
  @arrayProp({ ref: 'room' })
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
