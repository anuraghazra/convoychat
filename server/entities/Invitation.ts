import * as mongoose from 'mongoose';
import { prop, Ref, arrayProp, getModelForClass, modelOptions, index } from '@typegoose/typegoose';
import { User } from './User';
import { Room } from './Room';
import { ObjectID } from 'mongodb';
import { Field, ID } from 'type-graphql';
import { ObjectIdScalar } from '../utils/objectid-scalar';

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
export class Invitation {
  @Field(type => ID)
  _id!: ObjectID;

  @Field()
  createdAt!: Date;

  @Field(type => User)
  @prop({ ref: 'user', required: true })
  public invitedBy!: Ref<User>;

  @Field(type => User)
  @prop({ ref: 'user', required: true })
  public userId!: Ref<User>;

  @Field(type => Room)
  @prop({ ref: 'room', required: true })
  public roomId!: Ref<Room>;

  @prop({ required: true, default: 15 })
  public maxUses!: number;

  @arrayProp({ ref: 'users' })
  public uses!: Ref<User>[];

  @Field()
  @prop({ required: true })
  public token!: string;

  @Field()
  @prop({ default: false })
  public isPublic?: boolean;
}
const InvitationModel = getModelForClass(Invitation);

export default InvitationModel;
