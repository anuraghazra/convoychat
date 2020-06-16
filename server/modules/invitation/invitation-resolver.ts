import "reflect-metadata";
import crypto from 'crypto'
import { ObjectID } from 'mongodb'
import { Context } from "../context.type";
import { ApolloError } from "apollo-server-express";
import { Resolver, Ctx, Arg, Authorized, Mutation, Query, Field, ArgsType, Args } from 'type-graphql';

import UserModel from "../../entities/User";
import RoomModel from "../../entities/Room";
import NOTIFICATION_TOPIC from '../../notification-topic'
import sendNotification from "../../utils/sendNotification";
import InvitationModel, { Invitation } from "../../entities/Invitation";
import { InvitationLinkResult, InvitationDetails } from "./invitation-types";


@ArgsType()
export class inviteMembersArgs {
  @Field({ nullable: false })
  roomId: ObjectID

  @Field(type => [ObjectID])
  members: ObjectID[]
}

@Resolver(of => Invitation)
class InvitationResolver {
  @Authorized()
  @Query(() => InvitationDetails)
  async getInvitationInfo(
    @Arg('token', { nullable: false }) token: string,
    @Ctx() context: Context
  ) {
    const invite = await InvitationModel.findOne({
      token: token,
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
  }

  @Authorized()
  @Mutation(() => InvitationLinkResult)
  async createInvitationLink(
    @Arg('roomId', { nullable: false }) roomId: ObjectID,
    @Ctx() context: Context
  ) {
    const existingInvitation = await InvitationModel.findOne({
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

    let validRoom = await RoomModel.findOne({ _id: roomId });
    if (!validRoom) throw new Error('Not a valid room')

    // TODO: add expiry time in invitation token
    const token = crypto.randomBytes(16).toString("hex");
    const invite = new InvitationModel({
      isPublic: true,
      roomId: roomId,
      invitedBy: context.currentUser.id,
      token: token,
    });

    await invite.save();

    return { link: `https://convoychat.herokuapp.com/invitations/${token}` };
  }

  @Authorized()
  @Mutation(() => [Invitation])
  async inviteMembers(
    @Args() { roomId, members }: inviteMembersArgs,
    @Ctx() context: Context
  ) {
    try {
      // check if user is a memeber of the specified room
      let user = await UserModel.findOne({
        _id: context.currentUser.id,
        // @ts-ignore
        rooms: { $in: roomId },
      });

      if (!user) {
        throw new ApolloError("You are not a member of room, Cannot invite members");
      }

      let token = null;

      // create invitations
      const invitations = members.map(memberId => {
        token = crypto.randomBytes(16).toString("hex");
        let invite = new InvitationModel({
          roomId: roomId,
          userId: memberId,
          invitedBy: context.currentUser.id,
          token: token,
        });
        return invite.save();
      });

      // @ts-ignore
      const savedInvites: Invitation[] = await Promise.all(invitations);

      const foundRoom = await RoomModel.findOne({ _id: roomId });

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
    } catch (err) {
      console.log(err)
      throw new ApolloError(err)
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async acceptInvitation(
    @Arg('token', { nullable: false }) token: string,
    @Ctx() context: Context
  ) {
    // find invitation with token & userId
    const invitation = await InvitationModel.findOne({
      token: token,
    });

    if (!invitation) throw new ApolloError("Invalid Invitation");

    let userToAdd: any = null;
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
      await InvitationModel.findOneAndRemove({
        token: token,
      });
      throw new ApolloError("Maximum invitation usage limit exceeded");
    }

    // add user to the room
    const room = await RoomModel.findOneAndUpdate(
      { _id: invitation.roomId },
      // @ts-ignore
      { $addToSet: { members: [userToAdd] } },
      { new: true }
    );

    if (!room) throw new ApolloError("Could not add members to room");

    // update user.rooms
    await UserModel.update(
      {
        _id: userToAdd
      },
      // @ts-ignore
      { $addToSet: { rooms: [room.id] } },
      { new: true }
    );

    // delete the notification
    if (!invitation.isPublic) {
      await InvitationModel.findOneAndRemove({ token: token });
    } else {
      await InvitationModel.findOneAndUpdate(
        { token: token },
        // @ts-ignore
        { $addToSet: { uses: [userToAdd] } }
      );
    }

    return true;
  }
}

export default InvitationResolver;