import { User } from './User';
import { Room } from './Room';
import { ObjectID } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';
import { prop, Ref, arrayProp, getModelForClass, modelOptions, index } from '@typegoose/typegoose';

@ObjectType()
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
  @Field(type => ID, { name: "id" })
  _id!: ObjectID;

  @Field()
  createdAt!: Date;

  @Field(type => ID)
  @prop({ ref: 'user', required: true })
  public invitedBy!: Ref<User>;

  @Field(type => ID)
  @prop({ ref: 'user' })
  public userId!: Ref<User>;

  @Field(type => ID)
  @prop({ ref: 'room', required: true })
  public roomId!: Ref<Room>;

  @prop({ required: true, default: 15 })
  public maxUses!: number;

  @arrayProp({ ref: 'users' })
  public uses!: Ref<User>[];

  @prop({ required: true })
  public token!: string;

  @Field()
  @prop({ default: false })
  public isPublic?: boolean;
}
const InvitationModel = getModelForClass(Invitation);

export default InvitationModel;
