import { ObjectType, Field, Int } from "type-graphql"
import { Message } from "../../entities/Message";


@ObjectType()
export class Messages {
  @Field(type => Int, { nullable: true })
  totalDocs: Number

  @Field(type => Int, { nullable: true })
  totalPages: Number

  @Field(type => [Message])
  messages: Message[]
}