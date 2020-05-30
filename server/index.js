require("dotenv").config();
const http = require("http");
const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const expressStaticGzip = require("express-static-gzip");

require("./passport-config");

const { buildContext, createOnConnect } = require("graphql-passport");
const { PubSub, ApolloServer, ApolloError } = require("apollo-server-express");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub();
const app = express();

app.use(cookieParser());
app.use(cors({ credentials: true }));

const sessionMiddleware = cookieSession({
  secure: process.env.NODE_ENV === "production" ? true : false,
  name: "session",
  keys: [process.env.SESSION_SECRECT],
  maxAge: 24 * 60 * 60 * 1000, // session will expire after 24 hours
});
const passportMiddleware = passport.initialize();
const passportSessionMiddleware = passport.session();

app.use(sessionMiddleware);
app.use(passportMiddleware);
app.use(passportSessionMiddleware);

const authRoute = require("./routes/auth");
app.use("/auth", authRoute);

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  subscriptions: {
    path: "/subscriptions",
    // https://github.com/jkettmann/graphql-passport#usage-with-subscriptions
    onConnect: createOnConnect([
      sessionMiddleware,
      passportMiddleware,
      passportSessionMiddleware,
    ]),
  },
  context: ({ req, res, connection }) => {
    let context = connection && connection.context;
    let currentUser = connection && connection.context.req.user;

    if (!context) context = buildContext({ req, res });
    if (!currentUser) {
      currentUser = context.getUser();
    }

    try {
      return {
        ...context,
        pubsub,
        currentUser,
      };
    } catch (err) {
      throw new ApolloError(err);
    }
  },
  playground: {
    settings: {
      "request.credentials": "include",
    },
  },
});

server.applyMiddleware({
  app,
  path: "/graphql",
  onHealthCheck: () => {
    new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 200) {
        return resolve();
      }
      reject();
    });
  },
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// static client
app.use("/", expressStaticGzip("client/build"));
if (process.env.NODE_ENV === "production") {
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build/index.html"), function (
      err
    ) {
      if (err) {
        res.status(500).send(err);
      }
    });
  });
}

httpServer.listen({ port: 4000 }, () => {
  mongoose.connect(
    process.env.DB_URL,
    { useUnifiedTopology: true, useNewUrlParser: true },
    err => {
      if (err) throw err;
      console.log("Connected to Database");
    }
  );
  console.log(`http://localhost:4000`);
});
