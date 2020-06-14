import { prop, Ref, getModelForClass, arrayProp, modelOptions, index } from "@typegoose/typegoose";
import { UserSchema } from "./UserModel";
import * as mongoose from 'mongoose';

enum NOTIFICATION_TYPE {
  INVITATION = "INVITATION",
  MENTION = "MENTION"
}

@modelOptions({ options: { customName: 'room', }, schemaOptions: { timestamps: true, collection: "rooms" } })
@index(
  { createdAt: 1 },
  { expireAfterSeconds: 604800 } // 7 Days
)
export class NotificationSchema {
  _id!: mongoose.Schema.Types.ObjectId;

  @prop({ ref: 'user', required: true })
  public sender!: Ref<UserSchema>;

  @prop({ ref: 'user', required: true })
  public receiver!: Ref<UserSchema>;

  @prop({ default: false })
  public seen?: boolean;

  @prop({ enum: NOTIFICATION_TYPE, required: true })
  public provider!: string;

  @prop({ default: {} })
  public payload?: Object
}

// const NotificationSchema = new mongoose.Schema(
//   {
//     sender: {
//       ref: "user",
//       required: true,
//       type: mongoose.Types.ObjectId,
//     },
//     receiver: {
//       ref: "user",
//       required: true,
//       type: mongoose.Types.ObjectId,
//     },
//     seen: {
//       type: Boolean,
//       default: false,
//     },
//     type: {
//       type: String,
//       required: true,
//       enum: [notificationTypes.INVITATION, notificationTypes.MENTION],
//     },
//     payload: {
//       type: Object,
//       default: {},
//     },
//   },
//   { timestamps: true }
// );

// NotificationSchema.index(
//   { createdAt: 1 },
//   {
//     expireAfterSeconds: 604800, // 7 Days
//   }
// );

// const Notification = mongoose.model(
//   "notification",
//   NotificationSchema,
//   "notifications"
// );

const Notification = getModelForClass(NotificationSchema);

export default Notification
