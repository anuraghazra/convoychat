import { User } from "./User";
import { ObjectID } from 'mongodb';
import { Field, registerEnumType, ID } from "type-graphql";
import { prop, Ref, getModelForClass, modelOptions, index } from "@typegoose/typegoose";

export enum NOTIFICATION_TYPE {
  INVITATION = "INVITATION",
  MENTION = "MENTION"
}
registerEnumType(NOTIFICATION_TYPE, {
  name: "NOTIFICATION_TYPE",
  description: "Notification types enums",
});

@modelOptions({ options: { customName: 'room', }, schemaOptions: { timestamps: true, collection: "rooms" } })
@index(
  { createdAt: 1 },
  { expireAfterSeconds: 604800 } // 7 Days
)
export class Notification {
  @Field(type => ID)
  _id!: ObjectID

  @Field(type => User)
  @prop({ ref: 'user', required: true })
  public sender!: Ref<User>;

  @Field(type => User)
  @prop({ ref: 'user', required: true })
  public receiver!: Ref<User>;

  @Field()
  @prop({ default: false })
  public seen?: boolean;

  @Field(type => NOTIFICATION_TYPE)
  @prop({ enum: NOTIFICATION_TYPE, required: true })
  public type!: string;

  @Field(type => Object)
  @prop({ default: {} })
  public payload?: Object
}

const NotificationModel = getModelForClass(Notification);

export default NotificationModel
