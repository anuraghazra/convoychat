import { Subscription, Root, Resolver } from "type-graphql";
import { Notification } from "../../entities/Notification";
import CONSTANTS from '../../constants';

@Resolver()
class NotificationsSubscriptions {
  @Subscription(returns => Notification, {
    topics: CONSTANTS.NEW_NOTIFICATION,
    filter: ({ payload, args, context }) => {
      return payload.receiver.equals(context.currentUser.id)
    }
  })
  onNewNotification(
    @Root() notification: Notification
  ): Notification {
    return notification
  }
}

export default NotificationsSubscriptions;