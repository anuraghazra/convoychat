import "reflect-metadata";
import dotenv from 'dotenv';
import path from 'path'
import http from "http";
import express from "express";
import passport from "passport";
import mongoose from "mongoose";

import cors from "cors";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import expressStaticGzip from "express-static-gzip";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import helmet from "helmet";

dotenv.config()
import "./passport-config";

import { buildContext, createOnConnect } from "graphql-passport";
import { PubSub, ApolloServer, ApolloError } from "apollo-server-express";
import { createRateLimitDirective } from "graphql-rate-limit";

import authRoute from "./routes/auth";
import useAuth from "./utils/auth-checker";

import { ObjectID } from "mongodb";
import { buildSchema } from "type-graphql";
import { ObjectIdScalar } from "./utils/objectid-scalar";
import { TypegooseMiddleware } from "./utils/typegoose-middleware";

import UserResolver from "./modules/user/user-resolver";
import MessageResolver from "./modules/message/message-resolver";
import RoomResolver from "./modules/room/room-resolver";
import NotificationResolver from "./modules/notification/notification-resolver";
import InvitationResolver from "./modules/invitation/invitation-resolver";
import MessageSubscriptions from "./modules/message/message-subscriptions";
import NotificationsSubscriptions from "./modules/notification/notification-subscriptions";

const rateLimitDirective = createRateLimitDirective({
  identifyContext: ctx => ctx.id,
});

const pubsub = new PubSub();
const app = express();
app.use(cookieParser());
app.use(
  cors({ credentials: true })
);
app.use(helmet()); // security headers
app.use(mongoSanitize()); // sanitization against NoSQL Injection Attacks
app.use(xss()); // sanitize data

const sessionMiddleware = cookieSession({
  secure: process.env.NODE_ENV === "production" ? true : false,
  name: "session",
  keys: [(process.env.SESSION_SECRECT as any)],
  maxAge: 24 * 60 * 60 * 1000, // session will expire after 24 hours
});
const passportMiddleware = passport.initialize();
const passportSessionMiddleware = passport.session();

app.use(sessionMiddleware);
app.use(passportMiddleware);
app.use(passportSessionMiddleware);


app.use("/auth", authRoute);

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [
      RoomResolver,
      UserResolver,
      MessageResolver,
      InvitationResolver,
      NotificationResolver,
      MessageSubscriptions,
      NotificationsSubscriptions
    ],
    emitSchemaFile: "./server/graphql/schema.gql",
    globalMiddlewares: [TypegooseMiddleware],
    scalarsMap: [{ type: ObjectID, scalar: ObjectIdScalar }],
    authChecker: useAuth,
    pubSub: pubsub,
  })

  const server = new ApolloServer({
    schema: schema,
    schemaDirectives: {
      rateLimit: rateLimitDirective,
    },
    subscriptions: {
      path: "/subscriptions",
      // https://github.com/jkettmann/graphql-passport#usage-with-subscriptions
      onConnect: (createOnConnect([
        sessionMiddleware,
        passportMiddleware,
        passportSessionMiddleware,
      ]) as any),
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
      return new Promise((resolve, reject) => {
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
  app.use("/", expressStaticGzip("client/build", {}));
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
      (process.env.DB_URL as string),
      { useUnifiedTopology: true, useNewUrlParser: true },
      err => {
        if (err) throw err;
        console.log("Connected to Database");
      }
    );
    console.log(`http://localhost:4000`);
  });
}

bootstrap()