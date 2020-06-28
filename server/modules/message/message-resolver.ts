import "reflect-metadata";
import { ObjectID } from "mongodb";
import { Context } from "../context.type";
import { ApolloError } from "apollo-server-express";
import {
  Arg,
  Args,
  Query,
  PubSub,
  PubSubEngine,
  Ctx,
  Resolver,
  Mutation,
  Authorized,
} from "type-graphql";

import Member from "../../entities/Member";
import RoomModel from "../../entities/Room";
import MessageModel, { Message } from "../../entities/Message";

import CONSTANTS from "../../constants";
import { Messages } from "./message-types";
import { b64decode, b64encode } from '../../utils';
import parseMentions from "../../utils/mention-parser";
import sendNotification from "../../utils/sendNotification";
import { NOTIFICATION_TYPE } from "../../entities/Notification";
import { sendMessageArgs, editMessageArgs, getMessagesArgs } from "./message-inputs";

@Resolver(of => Message)
class MessageResolver {
  @Authorized()
  @Query(() => Messages)
  async getMessages(@Args() { limit, after, before, roomId }: getMessagesArgs) {

    const afterQuery = after && { $gt: new ObjectID(b64decode(after)) }
    const beforeQuery = before && { $lt: new ObjectID(b64decode(before)) }
    const criteria = (afterQuery || beforeQuery) ? {
      _id: { ...afterQuery, ...beforeQuery }
    } : {};

    let messages = await MessageModel.find({ roomId: roomId, ...criteria })
      .limit(limit + 1)
      .sort({ "createdAt": afterQuery ? 0 : -1 })
      .populate("author")
      .lean();

    const hasNext = messages.length > limit - 1;
    if (hasNext) {
      messages = messages.slice(0, messages.length - 1);
    }
    const edges = messages.map(edge => ({
      cursor: b64encode(edge._id.toHexString()),
      node: edge,
    }));

    return {
      pageInfo: {
        hasNext: hasNext,
      },
      edges: edges.reverse(),
    };
  }

  @Authorized()
  @Mutation(() => Message)
  async sendMessage(
    @Args() { roomId, content }: sendMessageArgs,
    @Ctx() context: Context,
    @PubSub() pubsub: PubSubEngine
  ) {
    try {
      let room = await RoomModel.findOne({
        _id: roomId,
        members: { $in: [context.currentUser.id] },
      }).populate("members");

      if (!room) {
        throw new ApolloError(
          "Room not found or you are not a member of this room"
        );
      }

      // parse mentions
      const mentions = parseMentions(content);

      // check if mentioned users are member of the room
      const mentioned_users = mentions
        .map(m => {
          let found = room?.members.find((i: Member) => i.username === m);
          if (found) {
            return (found as any)._id;
          }
          return null;
        })
        // remove null values & current user if mentioned
        .filter(userId => {
          if (!userId) return false;
          return `${userId}` !== `${context.currentUser.id}`;
        });

      let message = new MessageModel({
        content: content,
        roomId: roomId,
        author: context.currentUser.id,
        mentions: mentioned_users,
      });
      message.populate("author").execPopulate();

      // filter out the current User id to prevent self notification sending
      let mentionNotifications = message.mentions.map(async id => {
        return sendNotification({
          context: context,
          sender: context.currentUser.id,
          receiver: id as any,
          type: NOTIFICATION_TYPE.MENTION,
          payload: {
            roomName: room?.name,
            message: message.content,
            messageId: message._id,
            roomId: room?._id,
          },
        });
      });

      await Promise.all(mentionNotifications);

      (message as any).$roomId = roomId;
      let savedMessage = await message.save();
      pubsub.publish(CONSTANTS.NEW_MESSAGE, savedMessage.toObject());

      return savedMessage;
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  @Authorized()
  @Mutation(() => Message)
  async deleteMessage(
    @Arg("messageId") messageId: ObjectID,
    @Ctx() context: Context,
    @PubSub() pubsub: PubSubEngine
  ) {
    try {
      let message = await MessageModel.findOneAndDelete({
        _id: messageId,
        author: context.currentUser.id,
      });

      if (!message) throw new ApolloError("Cannot find message with ID");

      await message.populate("author").execPopulate();
      pubsub.publish(CONSTANTS.DELETE_MESSAGE, message.toObject());

      return message;
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  @Authorized()
  @Mutation(() => Message)
  async editMessage(
    @Args() { messageId, content }: editMessageArgs,
    @Ctx() context: Context,
    @PubSub() pubsub: PubSubEngine
  ) {
    try {
      let message = await MessageModel.findOneAndUpdate(
        {
          _id: messageId,
          author: context.currentUser.id,
        },
        { content: content },
        { new: true }
      );
      if (!message) throw new ApolloError("Cannot find message with ID");

      await message.populate("author").execPopulate();
      pubsub.publish(CONSTANTS.UPDATE_MESSAGE, message.toObject());

      return message;
    } catch (err) {
      throw new ApolloError(err);
    }
  }
}

export default MessageResolver;
