const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const { User } = require("./models/UserModel");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

const UpsertUser = async (
  provider,
  { socialId, email, username, displayName },
  done
) => {
  let userData = {
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
    console.log(extraParams)
    // profile has all the information from the user
    await UpsertUser(
      "google",
      {
        socialId: profile.id,
        email: profile.emails[0].value,
        username: profile.emails[0].value.replace("@gmail.com", ""),
        displayName: profile.displayName,
      },
      done
    );
    // console.log(profile);
    // return done(null, profile);
  }
);

passport.use(strategy);
