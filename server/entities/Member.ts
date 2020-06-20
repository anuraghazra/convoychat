import "reflect-metadata";
import { Room } from './Room';
import { ObjectID } from 'mongodb'
import { Ref } from "@typegoose/typegoose";
import { Field, ObjectType, ID } from 'type-graphql';
import { UserLinks } from "./User";

@ObjectType()
export class Member {
  @Field(type => ID, { name: "id" })
  _id: ObjectID;

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

  @Field(type => UserLinks, { nullable: true })
  public links?: UserLinks;

  @Field()
  public color!: string;
}

export default Member;
