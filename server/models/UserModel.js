const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

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
    },
    email: {
      type: String,
      required: true,
      unique: true,
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

// UserSchema.pre("save", function (next) {
//   // don't rehash the password everytime
//   if (this.isModified("password") || this.isNew) {
//     try {
//       // Hash Password
//       const salt = bcrypt.genSaltSync(10);
//       const hashedPassword = bcrypt.hashSync(this.password, salt);
//       this.password = hashedPassword;
//       next();
//     } catch (err) {
//       next(err);
//     }
//   } else {
//     return next();
//   }
// });

// UserSchema.methods.generateJWT = function () {
//   return jwt.sign(
//     {
//       username: this.username,
//       id: this._id,
//     },
//     process.env.SERVER_SECRET,
//     { expiresIn: "1h" }
//   );
// };

// UserSchema.methods.isValidPassword = async function (password) {
//   try {
//     // Check/Compares password
//     return await bcrypt.compare(password, this.password);
//   } catch (err) {
//     console.log(err);
//     throw new Error(err);
//   }
// };

const User = mongoose.model("user", UserSchema, "users");

module.exports = { User };
