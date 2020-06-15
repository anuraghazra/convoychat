import passport from "passport";
import mongoose from "mongoose";
import Auth0Strategy from "passport-auth0";
import MockStrategy from "passport-mock-strategy";
import UserModel, { User } from "./entities/User";
import { generateUsername } from "./utils";

passport.serializeUser((user: User, done) => {
  return done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  if (!mongoose.isValidObjectId(id)) return done(null, null);
  const user = await UserModel.findById(id).populate("rooms");
  return done(null, user);
});


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
  let userData = {
    avatarUrl: avatarUrl,
    provider: provider,
    socialId: socialId,
    username: username,
    email: email,
    name: displayName,
  };

  try {
    let matchedUser = await UserModel.findOne({ email: userData.email });
    if (matchedUser) {
      console.log("matched user", matchedUser.email);
      return done(null, matchedUser);
    }

    let newUser = new UserModel(userData);
    await newUser.save();

    console.log("newUser created", newUser.email);
    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
};

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN as string,
    clientID: process.env.AUTH0_CLIENT_ID as string,
    clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || "http://localhost:4000/auth/callback",
  },
  async function (_accessToken, _refreshToken, _extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    try {
      await UpsertUser(
        "google",
        {
          socialId: profile.id,
          email: profile.emails[0].value,
          avatarUrl: (profile as any).picture,
          username: generateUsername(profile.displayName),
          displayName: profile.displayName,
        },
        done
      );
    } catch (err) {
      console.log(err)
    }
  }
);

// mocking the authentication for development purposes
if (process.env.NODE_ENV === "development") {
  passport.use(
    new MockStrategy(
      { name: "mock", user: ({ emails: [{ value: process.env.MOCK_EMAIL, type: 'gmail' }] } as any) },
      async (data: any, done: any) => {
        let user = await UserModel.findOne({ email: data.emails[0].value });
        done(null, user);
      }
    )
  );
}

passport.use(strategy);
