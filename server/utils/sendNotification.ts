import CONSTANTS from "../constants";
import NotificationModel, { Notification } from "../entities/Notification";
import { Context } from "../modules/context.type";

interface ISendNotification extends Omit<Notification, "_id" | "createdAt"> {
  context: Context;
}
async function sendNotification({ sender, receiver, payload, type, context }: ISendNotification) {
  // SEND MENTION NOTIFICATION
  try {
    const noti = new NotificationModel({
      type: type,
      sender: sender as any,
      receiver: receiver as any,
      payload: payload,
    });

    // TODO: CLEAN THIS UP
    // NOTE THE POPULATE
    const populated = await noti.populate("sender").execPopulate();
    const subscribtionData = populated.toObject();
    context.pubsub.publish(CONSTANTS.NEW_NOTIFICATION, {
      ...subscribtionData,
      id: subscribtionData._id,
      createdAt: new Date(),
    });

    return noti.save();
  } catch (err) {
    console.log(err);
  }
}

export default sendNotification;
