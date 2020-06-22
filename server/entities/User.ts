import "reflect-metadata";
import { Room } from './Room';
import { ObjectID } from 'mongodb'
import { Field, ObjectType } from 'type-graphql';
import { prop as Property, Ref, arrayProp, getModelForClass, modelOptions } from '@typegoose/typegoose';

enum Providers {
  GOOGLE = 'google',
  GITHUB = 'github',
}

@ObjectType()
@modelOptions({ schemaOptions: { _id: false } })
export class UserLinks {
  @Field({ nullable: true })
  @Property({ minlength: 5, maxlength: 100 })
  public github?: string

  @Field({ nullable: true })
  @Property({ minlength: 5, maxlength: 100 })
  public twitter?: string

  @Field({ nullable: true })
  @Property({ minlength: 5, maxlength: 100 })
  public instagram?: string

  @Field({ nullable: true })
  @Property({ minlength: 5, maxlength: 100 })
  public website?: string
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
  @Field(type => ObjectID, { name: "id" })
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

  @Field(type => [Room])
  @arrayProp({ ref: 'room' })
  public rooms!: Ref<Room>[];

  @Field()
  @Property({ default: '#64FF8F' })
  public color!: string;

  @Field(type => UserLinks, { nullable: true })
  @Property({ type: UserLinks, default: {} })
  public links!: UserLinks;

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
