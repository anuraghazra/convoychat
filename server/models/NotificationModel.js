const mongoose = require("mongoose");
const notificationTypes = require("../notification-topic");

const NotificationSchema = new mongoose.Schema(
  {
    sender: {
      ref: "user",
      required: true,
      type: mongoose.Types.ObjectId,
    },
    receiver: {
      ref: "user",
      required: true,
      type: mongoose.Types.ObjectId,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
      enum: [notificationTypes.INVITATION, notificationTypes.MENTION],
    },
    payload: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

NotificationSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 604800, // 7 Days
  }
);

const Notification = mongoose.model(
  "notification",
  NotificationSchema,
  "notifications"
);

module.exports = { Notification };
