import * as yup from "yup";
import "../utils/yup-objectid";
import { mongoose } from "@typegoose/typegoose";
import { ApolloError } from "apollo-server-express";

import UserModel from "../entities/User";
import RoomModel from "../entities/Room";
import MessageModel from "../entities/Message";

export const listRooms = async () => {
  try {
    let rooms = await RoomModel.find({})
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

export const listCurrentUserRooms = async (_parent, _args, context) => {
  try {
    let rooms = await RoomModel.find({ members: context.currentUser.id })
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

export const getRoom = async (_, args, context) => {
  try {
    let user = await RoomModel.findOne({
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

export const getMessages = async (_parent, args, _context) => {
  const MAX_ITEMS = args.limit;
  const offset = parseInt(args.offset);
  let messages = await MessageModel.find({ roomId: args.roomId })
    .sort({ createdAt: -1 })
    .populate("author");

  return {
    totalDocs: messages.length,
    totalPages: Math.floor(messages.length / MAX_ITEMS),
    messages: messages.slice(offset, MAX_ITEMS + offset).reverse(),
  };
};

export const createRoom = async (_parent, args, context) => {
  try {
    const createRoomValidator = yup
      .object()
      .shape({ name: yup.string().min(2).max(25) });

    const { name } = await createRoomValidator.validate(args);

    let room = new RoomModel({
      name: name,
      members: [context.currentUser.id],
      messages: [],
      owner: context.currentUser.id,
    });
    await room.populate("members").execPopulate();

    await UserModel.findByIdAndUpdate(
      { _id: context.currentUser.id },
      // @ts-ignore
      { $addToSet: { rooms: [room.id] } },
      { new: true }
    );
    const savedRoom = await room.save();

    return savedRoom;
  } catch (err) {
    throw new ApolloError(err);
  }
};

export const deleteRoom = async (_parent, args, context) => {
  try {
    const deleteRoomValidator = yup
      .object()
      .shape<{ roomId: mongoose.Schema.Types.ObjectId }>({ roomId: yup.string().objectId("Invalid RoomId") });

    const { roomId } = await deleteRoomValidator.validate(args);

    let room = await RoomModel.findOneAndDelete({
      // @ts-ignore
      _id: roomId,
      owner: context.currentUser.id,
    });

    await UserModel.update(
      { _id: context.currentUser.id },
      {
        // @ts-ignore
        $pull: { rooms: { _id: roomId } },
      },
      { new: true, multi: true }
    );

    return room;
  } catch (err) {
    throw new ApolloError(err);
  }
};

export const addMembersToRoom = async (_parent, args, context) => {
  try {
    const deleteRoomValidator = yup.object().shape<{
      roomId: mongoose.Types.ObjectId,
      members: mongoose.Types.ObjectId[]
    }>({
      roomId: yup.string().objectId("Invalid RoomId"),
      members: yup.array(yup.string().objectId("Invalid memberId")),
    });

    const { roomId, members } = await deleteRoomValidator.validate(args);

    let room = await RoomModel.findOneAndUpdate(
      {
        _id: roomId,
        owner: context.currentUser.id,
      },
      {
        $addToSet: { members: { $each: [...members] } },
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

    await UserModel.update(
      { _id: { $in: [...members] } },
      // @ts-ignore
      { $addToSet: { rooms: [room.id] } },
      { new: true, multi: true }
    );

    return room;
  } catch (err) {
    throw new ApolloError(err);
  }
};

export const removeMemberFromRoom = async (_parent, args, context) => {
  try {
    const removeMemberValidator = yup.object().shape<{
      roomId: mongoose.Types.ObjectId, memberId: mongoose.Types.ObjectId,
    }>({
      roomId: yup.string().objectId("Invalid RoomId"),
      memberId: yup.string().objectId("Invalid MemberId"),
    });

    const { roomId, memberId } = await removeMemberValidator.validate(args);

    if (memberId === context.currentUser.id) {
      throw new ApolloError("You cannot not remove yourself from room");
    }

    const room = await RoomModel.findOneAndUpdate(
      {
        _id: roomId,
        owner: context.currentUser.id,
      },
      {
        $pull: { members: memberId },
      },
      { new: true }
    );

    const removedMember = await UserModel.findOneAndUpdate(
      { _id: args.memberId },
      { $pull: { rooms: roomId } },
      { new: true }
    );

    if (!removedMember || !room) {
      throw new ApolloError("Could not remove member from room");
    }

    return removedMember;
  } catch (err) {
    throw new ApolloError(err);
  }
};