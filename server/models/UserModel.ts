import "reflect-metadata";
import { prop, Ref, arrayProp, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { RoomSchema } from './RoomModel';
import { Field, ID, ObjectType } from 'type-graphql';
import * as mongoose from 'mongoose';

enum Providers {
  GOOGLE = 'google',
  GITHUB = 'github',
}

@ObjectType()
@modelOptions({ options: { customName: 'user', }, schemaOptions: { timestamps: true, collection: "users" } })
export class UserSchema {
  _id!: mongoose.Schema.Types.ObjectId;

  updatedAt?: Date;

  @Field()
  createdAt!: string;

  @Field()
  @prop({ required: true })
  public name!: string;

  @Field()
  @prop({ required: true, trim: true, minlength: 2, maxlength: 100, unique: true })
  public username!: string;

  @prop({ enum: Providers })
  public provider!: string;

  @prop({ required: true, unique: true })
  public socialId!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public avatarUrl!: string;

  @Field(type => [RoomSchema])
  @arrayProp({ ref: 'room', required: true })
  public rooms!: Ref<RoomSchema>[];
}

// const UserSchema = new mongoose.Schema(
//   {
//     provider: {
//       type: String,
//       enum: ["google", "github"],
//       required: true,
//     },
//     socialId: {
//       type: String,
//       unique: true,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     avatarUrl: {
//       type: String,
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     username: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 2,
//       maxlength: 100,
//       unique: true,
//     },
//     rooms: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "room",
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("user", UserSchema, "users");

const User = getModelForClass(UserSchema);

export default User;
