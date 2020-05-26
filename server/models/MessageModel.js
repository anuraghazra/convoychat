const mongoose = require("mongoose");
const { Room } = require("./RoomModel");

const MessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    content: {
      type: String,
      maxlength: 500,
      min: 2,
    },
  },
  { timestamps: true }
);

MessageSchema.pre("save", async function (next, args) {
  try {
    await Room.findOneAndUpdate(
      { _id: args.roomId },
      {
        $addToSet: { messages: { $each: [this._id] } },
      }
    );
  } catch (err) {
    console.log(`Could not add this message to ${roomId}`);
  }
  return next();
});

const Message = mongoose.model("message", MessageSchema, "messages");

module.exports = { Message };
