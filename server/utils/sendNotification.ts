import CONSTANTS from "../constants";
import NotificationModel, { Notification } from "../entities/Notification";
import { Context } from "../graphql/resolvers";

/**
 *
 * @param {String} sender
 * @param {String} receiver
 * @param {Object} payload
 * @param {string} type
 * @param {any} context
 */

interface ISendNotification extends Notification {
  context: Context;
}
async function sendNotification({ sender, receiver, payload, type, context }: ISendNotification) {
  // SEND MENTION NOTIFICATION
  const noti = new NotificationModel({
    type: type,
    sender: sender,
    receiver: receiver,
    payload: payload,
  });

  // TODO: CLEAN THIS UP
  // NOTE THE POPULATE
  let populated = await noti.execPopulate();
  let subscribtionData = populated.toObject();
  context.pubsub.publish(CONSTANTS.NEW_NOTIFICATION, {
    onNewNotification: {
      ...subscribtionData,
      id: subscribtionData._id,
      createdAt: Date.now(),
    },
  });

  return noti.save();
}

export default sendNotification
