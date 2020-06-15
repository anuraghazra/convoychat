import "reflect-metadata";
import { Room } from './Room';
import { ObjectID } from 'mongodb'
import { Field, ObjectType, ID } from 'type-graphql';

type Ref<T> = T | ObjectID;

@ObjectType()
export class Me {
  @Field(type => ID)
  _id: ObjectID;

  @Field()
  public name!: string;

  @Field()
  public username!: string;
  
  @Field()
  public email!: string;

  @Field()
  public avatarUrl!: string;

  @Field(type => [Room])
  public rooms!: Ref<Room>[];
}

export default Me;
