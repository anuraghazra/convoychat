import { Field, ObjectType, ID } from "type-graphql";
import { Room } from "../../entities/Room";
import Member from "../../entities/Member";
import { ObjectID } from "mongodb";

@ObjectType()
export class InvitationLinkResult {
  @Field({ nullable: false })
  link: string;
}

@ObjectType()
export class InvitationDetails {
  @Field(type => ID)
  id: ObjectID;

  @Field(type => Room, { nullable: true })
  room: Room;

  @Field(type => Member)
  invitedBy: Member;

  @Field()
  isPublic: boolean;

  @Field()
  createdAt: Date;
}
