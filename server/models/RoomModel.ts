import { prop, Ref, getModelForClass, arrayProp, modelOptions } from "@typegoose/typegoose";
import { UserSchema } from "./UserModel";
import { MessageSchema } from "./MessageModel";
import * as mongoose from 'mongoose';

@modelOptions({ options: { customName: 'room', }, schemaOptions: { timestamps: true, collection: "rooms" } })
export class RoomSchema {
  _id!: mongoose.Schema.Types.ObjectId;

  @prop({ required: true })
  public name!: String;

  @arrayProp({ ref: 'user', required: true })
  public members!: Ref<UserSchema>[];

  @arrayProp({ ref: 'message', required: true })
  public messages!: Ref<MessageSchema>[];

  @prop({ ref: 'user', required: true })
  public owner!: Ref<UserSchema>;
}

// const RoomSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     members: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "user",
//       },
//     ],
//     messages: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "message",
//       },
//     ],
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "user",
//     },
//   },
//   { timestamps: true }
// );

const Room = getModelForClass(RoomSchema);

export default Room;