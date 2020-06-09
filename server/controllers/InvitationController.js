const crypto = require("crypto");
const mongoose = require("mongoose");
const { ApolloError } = require("apollo-server-express");
const { User } = require("../models/UserModel");
const { Room } = require("../models/RoomModel");
const { Invitation } = require("../models/InvitationModel");
const { Notification } = require("../models/NotificationModel");
const notificationTypes = require("../notificationTypes");
const { NEW_NOTIFICATION } = require("../constants");

exports.getInvitationInfo = async (parent, args, context) => {
  const invite = await Invitation.findOne({
    token: args.token,
  })
    .populate("roomId")
    .populate("invitedBy");

  if (!invite) throw new ApolloError("Could not get invitation info");

  return {
    id: invite.id,
    room: invite.roomId,
    invitedBy: invite.invitedBy,
    isPublic: invite.isPublic,
    createdAt: invite.createdAt,
  };
};

exports.createInvitationLink = async (parent, args, context) => {
  const existingInvitation = await Invitation.findOne({
    roomId: args.roomId,
    invitedBy: context.currentUser.id,
    isPublic: true,
  });

  if (existingInvitation) {
    const baseURL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://convoychat.herokuapp.com";
    return {
      link: `${baseURL}/invitation/${existingInvitation.token}`,
    };
  }

  // TODO: add expiry time in invitation token
  const token = crypto.randomBytes(16).toString("hex");
  const invite = new Invitation({
    isPublic: true,
    roomId: args.roomId,
    invitedBy: context.currentUser.id,
    token: token,
  });

  await invite.save();

  return { link: `https://convoychat.herokuapp.com/invitations/${token}` };
};

exports.acceptInvitation = async (parent, args, context) => {
  // find invitation with token & userId
  const invitation = await Invitation.findOne({
    token: args.token,
  });

  if (!invitation) throw new ApolloError("Invalid Invitation");

  let userToAdd = null;
  // if invitation is public add the current user
  if (invitation.isPublic === true) {
    console.log("Invitation is public add Current user");
    userToAdd = context.currentUser.id;
  }

  // if invitation is not public add the invitation.userId
  if (
    invitation.isPublic === false &&
    `${invitation.userId}` === `${context.currentUser.id}`
  ) {
    console.log("Invitation is private");
    userToAdd = invitation.userId;
  }

  if (!userToAdd) {
    throw new ApolloError("Something went wrong while accepting invite");
  }

  // throw error and delete the invitation if maximum uses is reached
  if (invitation.uses.length >= invitation.maxUses) {
    await Invitation.findOneAndRemove({
      token: args.token,
    });
    throw new ApolloError("Maximum invitation usage limit exceeded");
  }

  // add user to the room
  const room = await Room.findOneAndUpdate(
    { _id: invitation.roomId },
    { $addToSet: { members: [userToAdd] } },
    { new: true }
  );

  if (!room) throw new ApolloError("Could not add members to room");

  // update user.rooms
  await User.update(
    { _id: userToAdd },
    { $addToSet: { rooms: [room.id] } },
    { new: true }
  );

  // delete the notification
  if (!invitation.isPublic) {
    await Invitation.findOneAndRemove({
      token: args.token,
    });
  } else {
    await Invitation.findOneAndUpdate(
      {
        token: args.token,
      },
      {
        $addToSet: { uses: [userToAdd] },
      }
    );
  }

  return true;
};

exports.inviteMembers = async (parent, args, context) => {
  if (!Array.isArray(args.members))
    throw new ApolloError("Members have to be array of user ids");

  // check if user is a memeber of the specified room
  let user = await User.findOne({
    _id: context.currentUser.id,
    rooms: { $in: args.roomId },
  });

  if (!user)
    throw ApolloError("You are not a member of room, Cannot invite members");

  let token = null;

  // create invitations
  const invitations = args.members.map(memberId => {
    token = crypto.randomBytes(16).toString("hex");
    let invite = new Invitation({
      roomId: args.roomId,
      userId: memberId,
      invitedBy: context.currentUser.id,
      token: token,
    });
    return invite.save();
  });

  const savedInvites = await Promise.all(invitations);

  const foundRoom = await Room.findOne({ _id: args.roomId });

  // send notification
  const notifications = args.members.map(async (id, index) => {
    let noti = new Notification({
      payload: {
        userId: id,
        roomName: foundRoom.name,
        roomId: args.roomId,
        invitedBy: context.currentUser.id,
        token: savedInvites[index].token,
      },
      sender: context.currentUser.id,
      receiver: id,
      type: notificationTypes.INVITATION,
    });

    // TODO: CLEAN THIS UP
    let populated = await noti.execPopulate("sender");
    let subscribtionData = populated.toObject();
    context.pubsub.publish(NEW_NOTIFICATION, {
      onNewNotification: {
        ...subscribtionData,
        id: subscribtionData._id,
        createdAt: Date.now(),
      },
    });

    return noti.save();
  });

  await Promise.all(notifications);

  // TODO: Send Email invitations

  return savedInvites;
};
