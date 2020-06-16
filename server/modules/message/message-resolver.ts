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
import parseMentions from "../../utils/mention-parser";
import NOTIFICATION_TOPIC from "../../notification-topic";
import sendNotification from "../../utils/sendNotification";
import { sendMessageArgs, editMessageArgs, getMessagesArgs } from "./message-inputs";


@Resolver(of => Message)
class MessageResolver {
  @Authorized()
  @Query(() => Messages)
  async getMessages(@Args() { limit, offset, roomId }: getMessagesArgs) {
    let messages = await MessageModel.find({ roomId: roomId })
      .sort({ createdAt: -1 })
      .populate("author");

    return {
      totalDocs: messages.length,
      totalPages: Math.floor(messages.length / limit),
      messages: messages.slice(offset, limit + offset).reverse(),
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
          type: NOTIFICATION_TOPIC.MENTION,
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
