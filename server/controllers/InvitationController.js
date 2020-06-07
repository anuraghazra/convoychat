const crypto = require("crypto");
const { ApolloError } = require("apollo-server-express");
const { User } = require("../models/UserModel");
const { Room } = require("../models/RoomModel");
const { Invitation } = require("../models/InvitationModel");
const { Notification } = require("../models/NotificationModel");

exports.getInvitationInfo = async (parent, args, context) => {
  const invite = await Invitation.findOne({
    isPublic: true,
    token: args.token,
  })
    .populate("roomId")
    .populate("invitedBy");

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
    userToAdd = context.currentUser.id;
  }

  // if invitation is not public add the invitation.userId
  if (
    invitation.isPublic === false &&
    invitation.userId === context.currentUser.id
  ) {
    userToAdd = invitation.userId;
  }

  if (!userToAdd)
    throw ApolloError("Something went wrong while accepting invite");

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
  await Invitation.findOneAndRemove({
    token: args.token,
  });

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

  // send notification
  const notifications = args.members.map((id, index) => {
    const noti = new Notification({
      payload: {
        roomId: args.roomId,
        userId: id,
        invitedBy: context.currentUser.id,
        invitationId: savedInvites[index].id,
        token: savedInvites[index].token,
      },
      author: id,
      type: "INVITATION",
    });

    return noti.save();
  });

  await Promise.all(notifications);

  // TODO: Send Email invitations

  return savedInvites;
};
