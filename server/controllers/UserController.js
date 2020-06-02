const { ApolloError } = require("apollo-server-express");
const { User } = require("../models/UserModel");
const { Room } = require("../models/RoomModel");
const { Message } = require("../models/MessageModel");
const { NEW_MESSAGE } = require("../constants");

exports.me = (_parent, _args, context) => {
  return context.getUser();
};

exports.listUsers = async () => {
  try {
    let users = await User.find({}).populate("rooms");
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
    let room = await Room.findOne({
      _id: args.roomId,
      members: { $in: [context.currentUser.id] },
    });

    if (!room) {
      throw new ApolloError(
        "Room not found or you are not a member of this room"
      );
    }

    let message = new Message({
      content: args.content,
      roomId: args.roomId,
      author: context.currentUser.id,
    });
    message.populate("author").execPopulate();

    let saved = await message.save({ roomId: args.roomId });
    context.pubsub.publish(NEW_MESSAGE, { newMessage: saved });

    return saved;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.deleteMessage = async (_parent, args, context) => {
  try {
    let message = await Message.findOneAndDelete({
      _id: args.messageId,
      author: context.currentUser.id,
    });
    await message.populate("author").execPopulate();
    return message;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.editMessage = async (_parent, args, context) => {
  try {
    let message = await Message.findOneAndUpdate(
      {
        _id: args.messageId,
        author: context.currentUser.id,
      },
      { content: args.content },
      { new: true }
    );
    await message.populate("author").execPopulate();
    return message;
  } catch (err) {
    throw new ApolloError(err);
  }
};
