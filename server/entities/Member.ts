import "reflect-metadata";
import { Room } from './Room';
import { Field, ObjectType, ID } from 'type-graphql';
import { ObjectID } from 'mongodb'
import { ObjectIdScalar } from "../utils/objectid-scalar";

type Ref<T> = T | ObjectID;

@ObjectType()
export class Member {
  @Field(type => ID)
  _id: ObjectID;

  @Field()
  updatedAt!: Date;

  @Field()
  createdAt!: Date;

  @Field()
  public name!: string;

  @Field()
  public username!: string;

  @Field()
  public avatarUrl!: string;

  @Field(type => [ID])
  public rooms!: Ref<Room>[];
}

export default Member;