import UserModel from "../entities/User";

interface IUpsertUser {
  socialId: string;
  email: string;
  avatarUrl: string;
  username: string;
  displayName: string;
}
const UpsertUser = async (
  provider: string,
  { socialId, email, username, displayName, avatarUrl }: IUpsertUser,
  done: any
) => {
  const userData = {
    avatarUrl: avatarUrl,
    provider: provider,
    socialId: socialId,
    username: username,
    email: email,
    name: displayName,
  };

  try {
    const matchedUser = await UserModel.findOne({ email: userData.email });
    if (matchedUser) {
      // console.log("matched user", matchedUser.email);
      return done(null, matchedUser);
    }

    const newUser = new UserModel(userData);
    await newUser.save();

    // console.log("newUser created", newUser.email);
    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
};

export default UpsertUser;
