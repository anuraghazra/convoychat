import { ObjectID } from "mongodb";
import CONSTANTS from "../../constants";
import { Message } from "../../entities/Message";
import { Subscription, Root, Resolver, Arg } from "type-graphql";

const filterRoom = ({ payload, args }) => payload.roomId.equals(args.roomId);

@Resolver()
class MessageSubscriptions {
  @Subscription(returns => Message, {
    topics: CONSTANTS.NEW_MESSAGE,
    filter: filterRoom
  })
  onNewMessage(
    @Root() message: Message,
    @Arg("roomId") roomId: ObjectID
  ): Message {
    return message;
  }

  @Subscription(returns => Message, {
    topics: CONSTANTS.DELETE_MESSAGE,
    filter: filterRoom
  })
  onDeleteMessage(
    @Root() message: Message,
    @Arg("roomId") roomId: ObjectID
  ): Message {
    return message;
  }

  @Subscription(returns => Message, {
    topics: CONSTANTS.UPDATE_MESSAGE,
    filter: filterRoom
  })
  onUpdateMessage(
    @Root() message: Message,
    @Arg("roomId") roomId: ObjectID
  ): Message {
    return message;
  }
}

export default MessageSubscriptions;