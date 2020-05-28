require("dotenv").config();
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const expressStaticGzip = require("express-static-gzip");

const {
  PubSub,
  ApolloServer,
  AuthenticationError,
} = require("apollo-server-express");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { verifyToken } = require("./utils/verifyToken");

const pubsub = new PubSub();
const app = express();
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  subscriptions: {
    path: "/subscriptions",
    onConnect: async (connectionParams, webSocket) => {
      const cookieStr = webSocket.upgradeReq.headers.cookie;
      const token = cookie.parse(cookieStr);
      try {
        if (!token) throw new AuthenticationError("Token not found");
        const promise = new Promise((resolve, reject) => {
          const user = jwt.verify(token.jwtToken, process.env.SERVER_SECRET);
          resolve(user);
        });
        const user = await promise;
        return user;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  context: ({ req, res, connection }) => {
    let currentUser = verifyToken(req, res);
    if (!currentUser) {
      currentUser = connection && connection.context && connection.context.user;
    }
    return {
      currentUser: currentUser,
      req,
      res,
      pubsub,
    };
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
    (err) => {
      if (err) throw err;
      console.log("Connected to Database");
    }
  );
  console.log(`http://localhost:4000`);
});
