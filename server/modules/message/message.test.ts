import { ObjectID } from "mongodb";
import RoomModel from "../../entities/Room";
import UserModel from "../../entities/User";
import MessageModel from "../../entities/Message";
import { gCall } from "../../test-utils/gcall";
import * as dbHelper from "../../test-utils/db-helpers";
import { fakeUser, fakeUser2 } from "../../test-utils/fake-user";
import { Maybe } from "graphql/jsutils/Maybe";
import NotificationModel, { NOTIFICATION_TYPE } from "../../entities/Notification";

const ROOM_NAME = "Test Room";
let ROOM_ID: Maybe<ObjectID> = null;

const queries = {
  sendMessage: `
    mutation sendMessage($roomId: ObjectId!, $content: String!) {
      sendMessage(roomId: $roomId, content: $content) {
        id
        content
        roomId
        mentions
        author {
          name
        }
      }
    }
  `,
}


const initialize = async () => {
  let result = await gCall({
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
}


afterAll(async () => {
  await dbHelper.clearDatabase();
  await dbHelper.closeDatabase();
  ROOM_ID = null;
});
beforeAll(async () => {
  await dbHelper.connect();
  await dbHelper.populateUsers();
  await initialize()
})
// afterEach(async () => await dbHelper.clearDatabase());
// beforeEach(async () => await dbHelper.populate());


describe("MessageResolver", () => {
  it("SendMessage should throw error if not a member", async () => {
    let currentUser = await UserModel.findOne({ email: fakeUser2.email })
    const messageResult = await gCall({
      currentUser: currentUser,
      source: queries.sendMessage,
      variableValues: { roomId: ROOM_ID, content: "Hello world" }
    });

    expect(messageResult.errors[0].message).toEqual('Error: Room not found or you are not a member of this room')
  });

  it("should send message", async () => {
    const messageResult = await gCall({
      source: queries.sendMessage,
      variableValues: { roomId: ROOM_ID, content: "Hello world" }
    });

    console.log({ messageResult })
    expect(messageResult?.data?.sendMessage).toEqual(
      expect.objectContaining({
        content: "Hello world",
        roomId: ROOM_ID,
        mentions: [],
        author: {
          name: fakeUser.name
        }
      })
    )

    const dbRoom = await RoomModel.findOne({ _id: ROOM_ID })
    const dbMessage = await MessageModel.findOne({ roomId: ROOM_ID })
    expect(dbRoom).toBeDefined();
    expect(dbMessage).toBeDefined();
  });

  it("should send message and parse mentions", async () => {
    // PREPARE: ADD USER TO ROOM FIRST
    const fakeUserId = await UserModel.findOne({ username: fakeUser2.username });
    // add user to the room
    const _room = await RoomModel.findOneAndUpdate(
      { _id: ROOM_ID },
      { $addToSet: { members: fakeUserId.id } },
      { new: true }
    );
    // update user.rooms
    await UserModel.update(
      { _id: fakeUserId.id },
      { $addToSet: { rooms: ROOM_ID } },
      { new: true }
    );

    // ----
    const messageContent = `Hello @${fakeUser2.username}`
    const messageResult = await gCall({
      source: queries.sendMessage,
      variableValues: { roomId: ROOM_ID, content: messageContent }
    });

    expect(messageResult?.data?.sendMessage).toEqual(
      expect.objectContaining({
        content: messageContent,
        roomId: ROOM_ID,
        mentions: [fakeUserId.id],
        author: {
          name: fakeUser.name
        }
      })
    )

    // ASSERT THE MENTION
    const dbMessage = await MessageModel.findOne({ content: messageContent })
    expect(dbMessage.mentions).toContainEqual(new ObjectID(fakeUserId.id));

    // ASSERT NOTIFICATION
    const dbNotification = await NotificationModel.findOne({
      type: NOTIFICATION_TYPE.MENTION,
    });
    expect(dbNotification.receiver).toEqual(new ObjectID(fakeUserId.id));
    expect(dbNotification.sender).toEqual(new ObjectID(fakeUser.id));
    expect(dbNotification.type).toEqual(NOTIFICATION_TYPE.MENTION);

    let payload: any = dbNotification.payload;
    expect(payload.message).toEqual(messageContent);
    expect(payload.roomName).toEqual(_room?.name);

  });

}) 