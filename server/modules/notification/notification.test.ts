import { ObjectID } from "mongodb";
import { Maybe } from "graphql/jsutils/Maybe";
import * as dbHelper from "../../test-utils/db-helpers";
import { fakeUser, fakeUser2 } from "../../test-utils/fake-user";
import { gCall, createFakeContext } from "../../test-utils/gcall";

import UserModel from "../../entities/User";
import sendNotification from "../../utils/sendNotification";
import NotificationModel, { NOTIFICATION_TYPE } from "../../entities/Notification";

const ROOM_NAME = "Test Room";
let ROOM_ID: Maybe<ObjectID> = null;
let sender: any;

const queries = {
  getNotifications: `
    query getNotifications {
      getNotifications {
        type
        sender {
          name
        }
        receiver
        payload
        seen
      }
    }
  `,
  readNotification: `
    mutation readNotification($id: ObjectId!) {
      readNotification(id: $id) {
        type
        sender {
          name
        }
        receiver
        payload
        seen
      }
    }
  `,
};


const initialize = async () => {
  const result = await gCall({
    source: `
      mutation createRoom($name: String!) {
        createRoom(name: $name) {
          name
          id
        }
      }
    `,
    variableValues: { name: ROOM_NAME }
  });
  ROOM_ID = result.data.createRoom.id;

  const context = createFakeContext();
  sender = await UserModel.findOne({ username: fakeUser2.username });
  await sendNotification({
    context: context as any,
    sender: new ObjectID(sender.id),
    receiver: new ObjectID(fakeUser.id),
    type: NOTIFICATION_TYPE.MENTION,
    payload: {
      roomName: result.data.createRoom?.name,
      message: "Hello world",
      messageId: "12345",
      roomId: result.data.createRoom?.id,
    },
  });
};


afterAll(async () => {
  await dbHelper.clearDatabase();
  await dbHelper.closeDatabase();
  ROOM_ID = null;
});
beforeAll(async () => {
  await dbHelper.connect();
  await dbHelper.populateUsers();
  await initialize();
});
// afterEach(async () => await dbHelper.clearDatabase());
// beforeEach(async () => await dbHelper.populate());


describe("NotificationResolver", () => {
  it("Should get notifications", async () => {
    const notificationResult = await gCall({
      source: queries.getNotifications,
    });

    expect(notificationResult?.data).toEqual(
      expect.objectContaining({
        getNotifications: [{
          seen: false,
          payload: {
            messageId: "12345",
            message: "Hello world",
            roomId: ROOM_ID, roomName: "Test Room"
          },
          receiver: fakeUser.id,
          sender: { name: fakeUser2.name }, type: NOTIFICATION_TYPE.MENTION
        }]
      })
    );
  });

  it("Should read notification", async () => {
    const noti = await NotificationModel.findOne({});
    const notificationResult = await gCall({
      source: queries.readNotification,
      variableValues: {
        id: noti._id
      }
    });

    expect(notificationResult?.data).toEqual(
      expect.objectContaining({
        readNotification: {
          seen: true,
          payload: {
            messageId: "12345",
            message: "Hello world",
            roomId: ROOM_ID, roomName: "Test Room"
          },
          receiver: fakeUser.id,
          sender: { name: fakeUser2.name }, type: NOTIFICATION_TYPE.MENTION
        }
      })
    );
  });
});