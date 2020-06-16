import "reflect-metadata";
import { ObjectID } from 'mongodb'
import { Context } from "../context.type";
import { ApolloError } from "apollo-server-express";
import { Resolver, Ctx, Arg, Authorized, Mutation, Query } from 'type-graphql';

import NotificationModel, { Notification } from "../../entities/Notification";

@Resolver(of => Notification)
class NotificationResolver {
  @Authorized()
  @Query(() => [Notification])
  async getNotifications(@Ctx() context: Context) {
    try {
      let notifications = await NotificationModel.find({
        receiver: context.currentUser.id,
      })
        .populate("sender")
        .sort({ createdAt: -1 });

      return notifications;
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  @Authorized()
  @Mutation(() => Notification)
  async readNotification(
    @Arg('id', { nullable: false }) id: ObjectID,
    @Ctx() context: Context
  ) {
    try {
      let notification = await NotificationModel.findOneAndUpdate(
        {
          _id: id,
          receiver: context.currentUser.id,
        },
        { seen: true },
        { new: true }
      )
        .populate("sender")
        .sort({ createdAt: -1 });

      return notification;
    } catch (err) {
      throw new ApolloError(err);
    }
  }
}

export default NotificationResolver;