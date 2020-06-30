import Member from "./Member";
import { User } from "./User";
import { ObjectID } from "mongodb";
import RoomModel, { Room } from "./Room";
import { Field, ObjectType, ID } from "type-graphql";
import { prop, Ref, getModelForClass, arrayProp, modelOptions, pre } from "@typegoose/typegoose";

@ObjectType()
@modelOptions({
  options: { customName: "message", },
  schemaOptions: { timestamps: true, collection: "messages" }
})
@pre<Message>("save", async function (next) {
  try {
    await RoomModel.findOneAndUpdate(
      // TODO: FIX THIS $roomId
      { _id: (this as any).$roomId },
      {
        $addToSet: { messages: { $each: [this._id] } },
      }
    );
  } catch (err) {
    console.log(`Could not add this message to ${(this as any).$roomId}`);
  }
  return next();
})
export class Message {
  @Field(type => ID, { name: "id" })
  readonly _id: ObjectID;

  @Field({ nullable: true })
  createdAt?: Date

  @Field(type => ID)
  @prop({ ref: "room", required: true })
  public roomId!: Ref<Room>

  @Field(type => Member)
  @prop({ ref: "user", required: true })
  public author!: Ref<User>

  @Field()
  @prop({ required: true, maxlength: 500, minlength: 1 })
  public content!: string

  @Field(type => [ID])
  @arrayProp({ ref: "user" })
  public mentions!: Ref<User>[]
}

const MessageModel = getModelForClass(Message);

export default MessageModel;
