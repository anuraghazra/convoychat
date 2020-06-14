const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["google", "github"],
      required: true,
    },
    socialId: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      unique: true,
    },
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "room",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema, "users");

module.exports = { User };
