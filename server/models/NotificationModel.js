const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    author: {
      ref: "user",
      required: true,
      type: mongoose.Types.ObjectId,
    },
    type: {
      type: String,
      enum: ["INVITATION", "MENTION"],
    },
    payload: {
      type: mongoose.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model(
  "notification",
  NotificationSchema,
  "notifications"
);

module.exports = { Notification };
