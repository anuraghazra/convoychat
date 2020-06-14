import { prop, Ref, getModelForClass, arrayProp, modelOptions, pre } from "@typegoose/typegoose";
import { UserSchema } from "./UserModel";
import Room, { RoomSchema } from "./RoomModel";
import * as mongoose from 'mongoose';

@modelOptions({
  options: { customName: 'message', },
  schemaOptions: { timestamps: true, collection: "messages" }
})
@pre<MessageSchema>('save', async function (this: any, next) {
  try {
    await Room.findOneAndUpdate(
      // TODO: FIX THIS $roomId
      { _id: this.$roomId },
      {
        $addToSet: { messages: { $each: [(this as any)._id] } },
      }
    );
  } catch (err) {
    console.log(`Could not add this message to ${this.$roomId}`);
  }
  return next();
})
export class MessageSchema {
  _id!: mongoose.Schema.Types.ObjectId;

  @prop({ ref: 'room', required: true })
  public roomId!: Ref<RoomSchema>

  @prop({ ref: 'user', required: true })
  public author!: Ref<UserSchema>

  @prop({ required: true, maxlength: 500, minlength: 1 })
  public content!: string

  @arrayProp({ ref: 'user', required: true })
  public mentions!: Ref<UserSchema>[]
}

// const MessageSchema = new mongoose.Schema(
//   {
//     roomId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "room",
//     },
//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "user",
//     },
//     content: {
//       type: String,
//       maxlength: 500,
//       required: true,
//       minlength: 1,
//     },
//     mentions: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "user",
//       },
//     ],
//   },
//   { timestamps: true }
// );

// MessageSchema.pre("save", async function (next: () => any, args: { roomId: any; }) {
//   try {
//     await Room.findOneAndUpdate(
//       { _id: args.roomId },
//       {
//         $addToSet: { messages: { $each: [(this as any)._id] } },
//       }
//     );
//   } catch (err) {
//     console.log(`Could not add this message to ${args.roomId}`);
//   }
//   return next();
// });

// const Message = mongoose.model("message", MessageSchema, "messages");
const Message = getModelForClass(MessageSchema);

export default Message;
