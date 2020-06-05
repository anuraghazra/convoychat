const passport = require("passport");
const mongoose = require("mongoose");
const Auth0Strategy = require("passport-auth0");
const MockStrategy = require("passport-mock-strategy");
const { User } = require("./models/UserModel");
const { generateUsername } = require("./utils");

passport.serializeUser((user, done) => {
  return done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  if (!mongoose.isValidObjectId(id)) return done(null, null);
  const user = await User.findById(id).populate("rooms");
  return done(null, user);
});

const UpsertUser = async (
  provider,
  { socialId, email, username, displayName, avatarUrl },
  done
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
    let matchedUser = await User.findOne({ email: userData.email });
    if (matchedUser) {
      console.log("matched user", matchedUser.email);
      return done(null, matchedUser);
    }

    let newUser = new User(userData);
    await newUser.save();

    console.log("newUser created", newUser.email);
    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
};

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || "http://localhost:4000/auth/callback",
  },
  async function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    await UpsertUser(
      "google",
      {
        socialId: profile.id,
        email: profile.emails[0].value,
        avatarUrl: profile.picture,
        username: generateUsername(profile.displayName),
        displayName: profile.displayName,
      },
      done
    );
  }
);

// mocking the authentication for development purposes
if (process.env.NODE_ENV === "development") {
  passport.use(
    new MockStrategy(
      { name: "mock", user: { email: process.env.MOCK_EMAIL } },
      async (data, done) => {
        let user = await User.findOne({ email: data.email });
        done(null, user);
      }
    )
  );
}

passport.use(strategy);
