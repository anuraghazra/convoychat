import "reflect-metadata";
import { Resolver, Query, Ctx } from 'type-graphql';
import UserSchema from '../../models/UserModel';


@Resolver(UserSchema)
class UserResolver {

  @Query(returns => UserSchema)
  me(parent: any, @Ctx() ctx: any) {
    return ctx.getUser();
  }

}