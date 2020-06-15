import * as yup from "yup";
import "../utils/yup-objectid";
import * as mongoose from "mongoose";
import { ApolloError } from "apollo-server-express";

import UserModel from "../entities/User";
import RoomModel from "../entities/Room";
import MessageModel from "../entities/Message";
import NotificationModel from "../entities/Notification";

import parseMentions from "../utils/mention-parser";
import sendNotification from "../utils/sendNotification";
import NOTIFICATION_TOPIC from "../notification-topic";
import * as CONSTANTS from "../constants";

export const me = (_parent, _args, context) => {
  return context.getUser();
};

export const listUsers = async (_parent, _args, context) => {
  try {
    const users = await UserModel.find({ _id: { $ne: context.currentUser.id } });
    return users;
  } catch (err) {
    throw new ApolloError(err);
  }
};

export const getUser = async (_, args) => {
  try {
    let user = await UserModel.findOne({ _id: args.id }).populate("rooms");
    if (!user) throw new ApolloError(`User not found with id ${args.id}`);
    return user;
  } catch (err) {
    throw new ApolloError(err);
  }
};

export const sendMessage = async (parent, args, context) => {
  try {
    const sendMessageValidator = yup.object().shape<{ roomId: mongoose.Types.ObjectId, content: string }>({
      roomId: yup.string().objectId("Invalid RoomId").required(),
      content: yup
        .string()
        .min(1, "Message can not be empty")
        .max(500, "Message too long!")
        .required(),
    });
    const { roomId, content } = await sendMessageValidator.validate(args);

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
        let found = room?.members.find((i: any) => i.username === m);
        if (found) {
          // @ts-ignore
          return found._id;
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

    // TODO: FIX THE prev.save hook on message Model
    // let saved = await message.save({ roomId: roomId });
    let saved = await message.save();
    context.pubsub.publish(CONSTANTS.NEW_MESSAGE, { onNewMessage: saved });

    return saved;
  } catch (err) {
    throw new ApolloError(err);
  }
};

export const deleteMessage = async (_parent, args, context) => {
  try {
    const deleteMessageValidator = yup
      .object()
      .shape({ messageId: yup.string().objectId("Invalid MessageID") });

    const { messageId } = await deleteMessageValidator.validate(args);

    let message = await MessageModel.findOneAndDelete({
      _id: messageId,
      author: context.currentUser.id,
    });

    if (!message) throw new ApolloError("Cannot find message with ID");

    await message.populate("author").execPopulate();
    context.pubsub.publish(CONSTANTS.DELETE_MESSAGE, {
      onDeleteMessage: message,
    });

    return message;
  } catch (err) {
    throw new ApolloError(err);
  }
};

export const editMessage = async (_parent, args, context) => {
  try {
    const deleteMessageValidator = yup.object().shape({
      messageId: yup.string().objectId("Invalid MessageID").required(),
      content: yup.string().min(1).max(500).required(),
    });

    const { messageId, content } = await deleteMessageValidator.validate(args);

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
    context.pubsub.publish(CONSTANTS.UPDATE_MESSAGE, {
      onUpdateMessage: message,
    });

    return message;
  } catch (err) {
    throw new ApolloError(err);
  }
};

export const getNotifications = async (_parent, args, context) => {
  try {
    let notifications = await NotificationModel.find({
      receiver: mongoose.Types.ObjectId(context.currentUser.id),
    })
      .populate("sender")
      .sort({ createdAt: -1 });

    return notifications;
  } catch (err) {
    throw new ApolloError(err);
  }
};

export const readNotification = async (_parent, args, context) => {
  try {
    let notifications = await NotificationModel.findOneAndUpdate(
      {
        _id: args.id,
        receiver: mongoose.Types.ObjectId(context.currentUser.id),
      },
      { seen: true },
      { new: true }
    )
      .populate("sender")
      .sort({ createdAt: -1 });

    return notifications;
  } catch (err) {
    throw new ApolloError(err);
  }
};
