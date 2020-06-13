const { NEW_NOTIFICATION } = require("../constants");
const { Notification } = require("../models/NotificationModel");
/**
 *
 * @param {String} sender
 * @param {String} receiver
 * @param {Object} payload
 * @param {string} type
 * @param {any} context
 */
async function sendNotification({ sender, receiver, payload, type, context }) {
  // SEND MENTION NOTIFICATION
  const noti = new Notification({
    sender: sender,
    receiver: receiver,
    type: type,
    payload: payload,
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
}

module.exports = sendNotification;
