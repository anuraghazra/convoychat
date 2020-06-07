const mongoose = require("mongoose");

const InvitationSchema = new mongoose.Schema(
  {
    invitedBy: {
      ref: "user",
      required: true,
      type: mongoose.Types.ObjectId,
    },
    userId: {
      ref: "user",
      type: mongoose.Types.ObjectId,
    },
    roomId: {
      ref: "room",
      required: true,
      type: mongoose.Types.ObjectId,
    },
    maxUses: {
      type: Number,
      default: 15,
    },
    uses: [
      {
        ref: "user",
        type: mongoose.Types.ObjectId,
      },
    ],
    token: {
      type: String,
      required: true,
    },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

InvitationSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.token;
  },
});

// expire token
// https://stackoverflow.com/a/35179159/10629172
InvitationSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 86400, // 24 hours
    partialFilterExpression: {
      isPublic: { $eq: true },
    },
  }
);

const Invitation = mongoose.model(
  "invitation",
  InvitationSchema,
  "invitations"
);

module.exports = { Invitation };
