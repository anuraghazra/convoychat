const crypto = require("crypto");
const { User } = require("../models/UserModel");
const { Room } = require("../models/RoomModel");
const { Invitation } = require("../models/InvitationModel");
const { Notification } = require("../models/NotificationModel");

exports.acceptInvitation = async (parent, args, context) => {
  // find invitation with token & userId
  const invitation = await Invitation.findOne({
    _id: args.invitationId,
    token: args.token,
    userId: context.currentUser.id,
  });

  if (!invitation) throw new ApolloError("Invalid Invitation");

  // add user to the room
  const room = await Room.findOneAndUpdate(
    {
      _id: invitation.roomId,
      owner: invitation.invitedBy,
    },
    {
      $addToSet: { members: { $each: [context.currentUser.id] } },
    },
    { new: true }
  );

  if (!room) throw new ApolloError("Could not add members to room");

  // update user.rooms
  await User.update(
    { _id: context.currentUser.id },
    { $addToSet: { rooms: [room.id] } },
    { new: true }
  );

  // delete the notification
  await Invitation.findOneAndRemove({
    _id: args.invitationId,
    token: args.token,
    userId: context.currentUser.id,
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
      isPending: true,
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
