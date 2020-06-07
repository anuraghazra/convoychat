const { ApolloError } = require("apollo-server-express");
const { User } = require("../models/UserModel");
const { Room } = require("../models/RoomModel");
const { Message } = require("../models/MessageModel");

exports.listRooms = async () => {
  try {
    let rooms = await Room.find({})
      .populate("members")
      .populate({
        path: "messages",
        model: "message",
        populate: { path: "author", model: "user" },
      });

    return rooms;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.listCurrentUserRooms = async (parent, args, context) => {
  try {
    let rooms = await Room.find({ members: context.currentUser.id })
      .populate("members")
      .populate({
        path: "messages",
        model: "message",
        populate: { path: "author", model: "user" },
      });

    return rooms;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.getRoom = async (_, args, context) => {
  try {
    let user = await Room.findOne({
      _id: args.id,
      members: { $in: [context.currentUser] },
    })
      .populate("members")
      .populate({
        path: "messages",
        model: "message",
        populate: { path: "author", model: "user" },
      });

    if (!user) throw new ApolloError("Room not found with id");
    return user;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.getMessages = async (parent, args, context) => {
  const MAX_ITEMS = args.limit;
  const offset = parseInt(args.offset);
  let messages = await Message.find({ roomId: args.roomId })
    .sort({ createdAt: -1 })
    .populate("author");

  return {
    totalDocs: messages.length,
    totalPages: Math.floor(messages.length / MAX_ITEMS),
    messages: messages.slice(offset, MAX_ITEMS + offset).reverse(),
  };
};

exports.createRoom = async (parent, args, context) => {
  try {
    let room = new Room({
      name: args.name,
      members: [context.currentUser.id],
      messages: [],
      owner: context.currentUser.id,
    });
    await room.populate("members").execPopulate();

    await User.findByIdAndUpdate(
      { _id: context.currentUser.id },
      { $addToSet: { rooms: [room.id] } },
      { new: true }
    );
    const savedRoom = await room.save();

    return savedRoom;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.deleteRoom = async (parent, args, context) => {
  try {
    let room = await Room.findOneAndDelete({
      _id: args.roomId,
      owner: context.currentUser.id,
    });

    await User.update(
      { _id: context.currentUser.id },
      {
        $pull: { rooms: { _id: args.roomId } },
      },
      { new: true, multi: true }
    );

    return room;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.addMembersToRoom = async (parent, args, context) => {
  try {
    let room = await Room.findOneAndUpdate(
      {
        _id: args.roomId,
        owner: context.currentUser.id,
      },
      {
        $addToSet: { members: { $each: [...args.members] } },
      },
      { new: true }
    )
      .populate("members")
      .populate({
        path: "messages",
        model: "message",
        populate: { path: "author", model: "user" },
      });

    if (!room) throw new ApolloError("Could not add members to room");

    await User.update(
      { _id: { $in: [...args.members] } },
      { $addToSet: { rooms: [room.id] } },
      { new: true, multi: true }
    );

    return room;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.removeMemberFromRoom = async (parent, args, context) => {
  try {
    if (args.memberId === context.currentUser.id) {
      throw new ApolloError("You cannot not remove yourself from room");
    }

    const room = await Room.findOneAndUpdate(
      {
        _id: args.roomId,
        owner: context.currentUser.id,
      },
      {
        $pull: { members: args.memberId },
      },
      { new: true }
    );

    if (!room) throw new ApolloError("Could not remove member from room");

    const removedMember = await User.findOneAndUpdate(
      { _id: args.memberId },
      { $pull: { rooms: args.roomId } },
      { new: true }
    );

    return removedMember;
  } catch (err) {
    throw new ApolloError(err);
  }
};
