import { ObjectType, Field, Int } from "type-graphql";
import { Message } from "../../entities/Message";

@ObjectType()
export class Messages {
  @Field(type => Int, { nullable: true })
  totalDocs: number;

  @Field(type => Int, { nullable: true })
  totalPages: number;

  @Field(type => [Message])
  messages: Message[];
}
