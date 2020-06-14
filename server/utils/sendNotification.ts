import { NEW_NOTIFICATION } from "../constants";
import Notification from "../models/NotificationModel";

/**
 *
 * @param {String} sender
 * @param {String} receiver
 * @param {Object} payload
 * @param {string} type
 * @param {any} context
 */

interface ISendNotification {
  sender: string;
  receiver: string;
  payload: Object;
  type: string;
  context: any;
}
async function sendNotification({ sender, receiver, payload, type, context }: ISendNotification) {
  // SEND MENTION NOTIFICATION
  const noti = new Notification({
    sender: sender,
    receiver: receiver,
    type: type,
    payload: payload,
  });

  // TODO: CLEAN THIS UP
  // NOTE THE POPULATE
  let populated = await noti.execPopulate();
  let subscribtionData = populated.toObject();
  context.pubsub.publish(NEW_NOTIFICATION, {
    onNewNotification: {
      ...subscribtionData,
      id: subscribtionData._id,
      createdAt: Date.now(),
    },
  });

  return noti.save();
}

export default sendNotification
