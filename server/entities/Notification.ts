import Member from "./Member";
import { User } from "./User";
import { ObjectID } from "mongodb";
import { GraphQLJSONObject } from "graphql-type-json";
import { Field, registerEnumType, ID, ObjectType } from "type-graphql";
import {
  prop,
  Ref,
  getModelForClass,
  modelOptions,
  index,
  Severity,
} from "@typegoose/typegoose";

export enum NOTIFICATION_TYPE {
  INVITATION = "INVITATION",
  MENTION = "MENTION",
}
registerEnumType(NOTIFICATION_TYPE, {
  name: "NOTIFICATION_TYPE",
  description: "Notification types enums",
});

@ObjectType()
@modelOptions({
  options: {
    // https://github.com/typegoose/typegoose/issues/239
    allowMixed: Severity.ALLOW,
    customName: "notification",
  },
  schemaOptions: {
    timestamps: true,
    collection: "notifications",
  },
})
@index(
  { createdAt: 1 },
  { expireAfterSeconds: 604800 } // 7 Days
)
export class Notification {
  @Field(type => ID, { name: "id" })
  _id!: ObjectID;

  @Field()
  createdAt!: Date;

  @Field(type => Member)
  @prop({ ref: "user", required: true })
  public sender!: Ref<User>;

  @Field(type => ID)
  @prop({ ref: "user", required: true })
  public receiver!: Ref<User>;

  @Field()
  @prop({ default: false })
  public seen?: boolean;

  @Field(type => NOTIFICATION_TYPE)
  @prop({ enum: NOTIFICATION_TYPE, required: true })
  public type!: string;

  @Field(type => GraphQLJSONObject)
  @prop({ default: {} })
  public payload?: Object;
}

const NotificationModel = getModelForClass(Notification);

export default NotificationModel;
