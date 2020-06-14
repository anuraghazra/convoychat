const yup = require("yup");
require("../utils/yup-objectid");
const crypto = require("crypto");
const { User } = require("../models/UserModel");
const { Room } = require("../models/RoomModel");
const { ApolloError } = require("apollo-server-express");
const { Invitation } = require("../models/InvitationModel");

const NOTIFICATION_TOPIC = require("../notification-topic");
const sendNotification = require("../utils/sendNotification");

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
  const createInvitationValidator = yup
    .object()
    .shape({ roomId: yup.string().objectId("Invalid RoomId") });

  const { roomId } = await createInvitationValidator.validate(args);

  const existingInvitation = await Invitation.findOne({
    roomId: roomId,
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
    roomId: roomId,
    invitedBy: context.currentUser.id,
    token: token,
  });

  await invite.save();

  return { link: `https://convoychat.herokuapp.com/invitations/${token}` };
};

exports.acceptInvitation = async (parent, args, context) => {
  const acceptInvitationValidator = yup
    .object()
    .shape({ token: yup.string().required() });

  const { token } = await acceptInvitationValidator.validate(args);

  // find invitation with token & userId
  const invitation = await Invitation.findOne({
    token: token,
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
      token: token,
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
    await Invitation.findOneAndRemove({ token: token });
  } else {
    await Invitation.findOneAndUpdate(
      { token: token },
      { $addToSet: { uses: [userToAdd] } }
    );
  }

  return true;
};

exports.inviteMembers = async (parent, args, context) => {
  const inviteMembersValidator = yup.object().shape({
    roomId: yup.string().objectId("Invalid RoomId"),
    members: yup.array(
      yup.string().objectId("invalid memberId"),
      "Members have to be array of ids"
    ),
  });

  const { roomId, members } = await inviteMembersValidator.validate(args);

  // check if user is a memeber of the specified room
  let user = await User.findOne({
    _id: context.currentUser.id,
    rooms: { $in: roomId },
  });

  if (!user)
    throw ApolloError("You are not a member of room, Cannot invite members");

  let token = null;

  // create invitations
  const invitations = members.map(memberId => {
    token = crypto.randomBytes(16).toString("hex");
    let invite = new Invitation({
      roomId: roomId,
      userId: memberId,
      invitedBy: context.currentUser.id,
      token: token,
    });
    return invite.save();
  });

  const savedInvites = await Promise.all(invitations);

  const foundRoom = await Room.findOne({ _id: roomId });

  // send notification
  const notifications = members.map(async (id, index) => {
    return sendNotification({
      context: context,
      sender: context.currentUser.id,
      receiver: id,
      type: NOTIFICATION_TOPIC.INVITATION,
      payload: {
        userId: id,
        roomName: foundRoom.name,
        roomId: roomId,
        invitedBy: context.currentUser.id,
        token: savedInvites[index].token,
      },
    });
  });

  await Promise.all(notifications);

  // TODO: Send Email invitations

  return savedInvites;
};
