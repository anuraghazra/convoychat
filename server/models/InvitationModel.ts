import { prop, Ref, arrayProp, getModelForClass, modelOptions, index } from '@typegoose/typegoose';
import { UserSchema } from './UserModel';
import { RoomSchema } from './RoomModel';
import * as mongoose from 'mongoose';

@modelOptions({
  options: {
    customName: 'invitation',
  },
  schemaOptions: {
    timestamps: true,
    collection: "invitations",
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret, options) {
        delete ret.token;
      }
    }
  },
})
@index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 86400, // 24 hours
    partialFilterExpression: {
      isPublic: { $eq: true },
    },
  }
)
export class InvitationSchema {
  _id!: mongoose.Schema.Types.ObjectId;
  createdAt!: Date;

  @prop({ ref: 'user', required: true })
  public invitedBy!: Ref<UserSchema>;

  @prop({ ref: 'user', required: true })
  public userId!: Ref<UserSchema>;

  @prop({ ref: 'room', required: true })
  public roomId!: Ref<RoomSchema>;

  @prop({ required: true, default: 15 })
  public maxUses!: number;

  @arrayProp({ ref: 'users' })
  public uses!: Ref<UserSchema>[];

  @prop({ required: true })
  public token!: string;

  @prop({ default: false })
  public isPublic?: boolean;

}

// const InvitationSchema = new Schema(
//   {
//     invitedBy: {
//       ref: "user",
//       required: true,
//       type: Types.ObjectId,
//     },
//     userId: {
//       ref: "user",
//       type: Types.ObjectId,
//     },
//     roomId: {
//       ref: "room",
//       required: true,
//       type: Types.ObjectId,
//     },
//     maxUses: {
//       type: Number,
//       default: 15,
//     },
//     uses: [
//       {
//         ref: "user",
//         type: Types.ObjectId,
//       },
//     ],
//     token: {
//       type: String,
//       required: true,
//     },
//     isPublic: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// InvitationSchema.set("toJSON", {
//   transform: function (doc, ret, options) {
//     delete ret.token;
//   },
// });


// expire token
// https://stackoverflow.com/a/35179159/10629172
// InvitationSchema.index(
//   { createdAt: 1 },
//   {
//     expireAfterSeconds: 86400, // 24 hours
//     partialFilterExpression: {
//       isPublic: { $eq: true },
//     },
//   }
// );

// const Invitation = model("invitation", InvitationSchema, "invitations");

const Invitation = getModelForClass(InvitationSchema);

export default Invitation;
