import { ObjectType, Field, ID } from "type-graphql";
import { Message } from "../../entities/Message";

@ObjectType()
class pageInfo {
  @Field()
  hasNext: boolean;
}

@ObjectType()
class MessageEdge {
  @Field(type => ID)
  cursor: string;

  @Field(type => Message)
  node: Message;
}

@ObjectType()
export class Messages {
  @Field(type => pageInfo, { nullable: true })
  pageInfo: pageInfo;

  @Field(type => [MessageEdge])
  edges: MessageEdge[];
}
