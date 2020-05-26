const { AuthenticationError, ApolloError } = require("apollo-server-express");
const { User } = require("../models/UserModel");

exports.signup = async (_, { username, password }) => {
  try {
    const foundUser = await User.findOne({ username });
    if (foundUser) throw new AuthenticationError("User already exist");

    const user = new User({ username, password, rooms: [] });
    const savedUser = await user.save();

    return savedUser;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.login = async (_, { username, password }, { res }) => {
  try {
    const user = await User.findOne({ username }).populate("rooms");
    if (!user) throw new AuthenticationError("User not found");

    const validPassword = await user.isValidPassword(password);
    if (!validPassword) throw new AuthenticationError("Invalid Password");

    let token = user.generateJWT();
    res.cookie("jwtToken", token, { maxAge: 900000, httpOnly: true });
    return user;
  } catch (err) {
    throw new ApolloError(err);
  }
};
