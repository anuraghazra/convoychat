import { v4 } from "uuid";
import { graphql, GraphQLSchema } from "graphql";
import { pubsub } from "../index";
import UserModel from "../entities/User";
import RoomModel from "../entities/Room";
import { buildSchema } from "type-graphql";
import useAuth from "../utils/auth-checker";
import { generateUsername } from "../utils";
import { ObjectID, ObjectId } from "mongodb";
import { createFakeContext } from "../test-utils/gcall";
import RoomResolver from "../modules/room/room-resolver";
import UserResolver from "../modules/user/user-resolver";
import { ObjectIdScalar } from "../utils/objectid-scalar";
import MessageResolver from "../modules/message/message-resolver";
import { TypegooseMiddleware } from "../utils/typegoose-middleware";
import InvitationResolver from "../modules/invitation/invitation-resolver";
import MessageSubscriptions from "../modules/message/message-subscriptions";
import NotificationResolver from "../modules/notification/notification-resolver";
import NotificationsSubscriptions from "../modules/notification/notification-subscriptions";

interface IBot {
  name: string;
  avatar: string;
}

class Bot {
  name: string;
  avatarUrl: string;
  isBot: boolean;
  socialId: any;
  model: any;
  roomId: ObjectId;
  schema: GraphQLSchema;
  actions: Record<string, (payload: any) => Promise<any>>;
  constructor(props: IBot) {
    this.name = props.name;
    this.avatarUrl = props.avatar
    this.isBot = true;
    this.socialId = v4();

    this.model = null;
    this.roomId = null;
    this.schema = null;
    this.actions = {};
  }

  doActions(actionType: string, payload: any) {
    this.actions[actionType](payload)
  }

  async initSchema() {
    // Build Schema
    this.schema = await buildSchema({
      resolvers: [
        RoomResolver,
        UserResolver,
        MessageResolver,
        InvitationResolver,
        NotificationResolver,
        MessageSubscriptions,
        NotificationsSubscriptions
      ],
      emitSchemaFile: "./server/graphql/schema.gql",
      globalMiddlewares: [TypegooseMiddleware],
      scalarsMap: [{ type: ObjectID, scalar: ObjectIdScalar }],
      authChecker: useAuth,
      pubSub: pubsub,
    })
  }

  // Install per room
  async installOnRoom(roomId: ObjectId) {
    const foundRoom = await RoomModel.findOne({ _id: roomId });
    this.roomId = foundRoom._id;

    if (!foundRoom) {
      console.log('INSTALL_BOT: Room not found');
      return;
    };

    const email = `${foundRoom.id}-githubbot@convoychat.com`;

    // Upsert Github BOT User
    this.model = await UserModel.findOne({
      isBot: true,
      email: email,
      rooms: { $in: [foundRoom.id] }
    });
    if (this.model) {
      console.log('INSTALL_BOT: Bot already exists');
      return;
    };

    console.log('INSTALL_BOT: Creating new bot');
    const newUser = new UserModel({
      isBot: true,
      name: this.name,
      email: email,
      username: generateUsername(this.name),
      avatarUrl: this.avatarUrl,
    });

    await newUser.save()

    // Add user to room
    console.log('INSTALL_BOT: Adding Bot to Room');
    await RoomModel.findOneAndUpdate(
      { _id: roomId },
      { $addToSet: { members: newUser._id } },
      { new: true }
    );

    // update user.rooms
    console.log('INSTALL_BOT: Adding roomId to bot');
    await UserModel.update(
      { _id: newUser._id },
      { $addToSet: { rooms: roomId } },
      { new: true }
    );

  }

  async sendMessage(content: string) {
    const sendMessageMutation = `
      mutation sendMessage($roomId: ObjectId!, $content: String!) {
        sendMessage(roomId: $roomId, content: $content) {
          id
          content
          roomId
          mentions
          author {
            name
          }
        }
      }
    `;

    try {
      let gqlResponse = await graphql(
        this.schema,
        sendMessageMutation,
        undefined,
        createFakeContext(this.model),
        {
          roomId: this.roomId,
          content: content,
        }
      );
      console.log(gqlResponse)
    } catch (err) {
      console.error(err);
    }
  }
}

export default Bot;