const yup = require("yup");
require("../utils/yup-objectid");
const mongoose = require("mongoose");
const { User } = require("../models/UserModel");
const { Room } = require("../models/RoomModel");
const { Message } = require("../models/MessageModel");
const { Notification } = require("../models/NotificationModel");
const { ApolloError } = require("apollo-server-express");

const parseMentions = require("../utils/mention-parser");
const sendNotification = require("../utils/sendNotification");
const NOTIFICATION_TOPIC = require("../notification-topic");
const CONSTANTS = require("../constants");


exports.me = (_parent, _args, context) => {
  return context.getUser();
};

exports.listUsers = async (_parent, _args, context) => {
  try {
    const users = await User.find({ _id: { $ne: context.currentUser.id } });
    return users;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.getUser = async (_, args) => {
  try {
    let user = await User.findOne({ _id: args.id }).populate("rooms");
    if (!user) throw new ApolloError(`User not found with id ${args.id}`);
    return user;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.sendMessage = async (parent, args, context) => {
  try {
    const sendMessageValidator = yup.object().shape({
      roomId: yup.string().objectId("Invalid RoomId").required(),
      content: yup
        .string()
        .min(1, "Message can not be empty")
        .max(500, "Message too long!")
        .required(),
    });
    const { roomId, content } = await sendMessageValidator.validate(args);

    let room = await Room.findOne({
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
        let found = room.members.find(i => i.username === m);
        if (found) {
          return found._id;
        }
        return null;
      })
      // remove null values & current user if mentioned
      .filter(userId => {
        if (!userId) return false;
        return `${userId}` !== `${context.currentUser.id}`;
      });

    let message = new Message({
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
        receiver: id,
        type: NOTIFICATION_TOPIC.MENTION,
        payload: {
          roomName: room.name,
          message: message.content,
          messageId: message._id,
          roomId: room._id,
        },
      });
    });

    await Promise.all(mentionNotifications);

    let saved = await message.save({ roomId: roomId });
    context.pubsub.publish(CONSTANTS.NEW_MESSAGE, { onNewMessage: saved });

    return saved;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.deleteMessage = async (_parent, args, context) => {
  try {
    const deleteMessageValidator = yup
      .object()
      .shape({ messageId: yup.string().objectId("Invalid MessageID") });

    const { messageId } = await deleteMessageValidator.validate(args);

    let message = await Message.findOneAndDelete({
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

exports.editMessage = async (_parent, args, context) => {
  try {
    const deleteMessageValidator = yup.object().shape({
      messageId: yup.string().objectId("Invalid MessageID").required(),
      content: yup.string().min(1).max(500).required(),
    });

    const { messageId, content } = await deleteMessageValidator.validate(args);

    let message = await Message.findOneAndUpdate(
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

exports.getNotifications = async (_parent, args, context) => {
  try {
    let notifications = await Notification.find({
      receiver: mongoose.Types.ObjectId(context.currentUser.id),
    })
      .populate("sender")
      .sort({ createdAt: -1 });

    return notifications;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.readNotification = async (_parent, args, context) => {
  try {
    let notifications = await Notification.findOneAndUpdate(
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
