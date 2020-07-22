import { PassportContext } from "graphql-passport";
import { Request, PubSub } from "apollo-server-express";
import { Response } from "express";
import { User } from "../entities/User";
import { ObjectID } from "mongodb";

interface ICurrentUser extends User {
  id: ObjectID;
}

interface IContextRequest extends Request {
  logout: () => void;
}

export interface Context
  extends PassportContext<User, any, any, IContextRequest> {
  pubsub: PubSub;
  res: Response;
  currentUser: ICurrentUser;
}
