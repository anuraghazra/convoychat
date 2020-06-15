import CONSTANTS from "../constants";
import NotificationModel, { Notification } from "../entities/Notification";
import { Context } from "../graphql/resolvers";

interface ISendNotification extends Omit<Notification, "_id" | "createdAt"> {
  context: Context;
}
async function sendNotification({ sender, receiver, payload, type, context }: ISendNotification) {
  // SEND MENTION NOTIFICATION
  try {
    console.log(sender, receiver)
    const noti = new NotificationModel({
      type: type,
      sender: sender as any,
      receiver: receiver as any,
      payload: payload,
    });

    // TODO: CLEAN THIS UP
    // NOTE THE POPULATE
    let populated = await noti.populate('sender').execPopulate();
    let subscribtionData = populated.toObject();
    context.pubsub.publish(CONSTANTS.NEW_NOTIFICATION, {
      onNewNotification: {
        ...subscribtionData,
        id: subscribtionData._id,
        createdAt: Date.now(),
      },
    });
    console.log({ populated })

    return noti.save();
  } catch (err) {
    console.log(err);
  }
}

export default sendNotification
