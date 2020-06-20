import "reflect-metadata";
import { Room } from './Room';
import { ObjectID } from 'mongodb'
import { Field, ObjectType, ID } from 'type-graphql';
import { UserLinks } from "./User";

type Ref<T> = T | ObjectID;

@ObjectType()
export class Me {
  @Field({ name: "id" })
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

  @Field()
  public color!: string;

  @Field(type => UserLinks, { nullable: true })
  public links?: UserLinks;
}

export default Me;
