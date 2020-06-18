import { ObjectID } from "mongodb";
import RoomModel from "../../entities/Room";
import UserModel from "../../entities/User";
import MessageModel from "../../entities/Message";
import { gCall } from "../../test-utils/gcall";
import * as dbHelper from "../../test-utils/db-helpers";
import { fakeUser, fakeUser2 } from "../../test-utils/fake-user";
import { Maybe } from "graphql/jsutils/Maybe";
import NotificationModel, { NOTIFICATION_TYPE } from "../../entities/Notification";

jest.setTimeout(10000);
const ROOM_NAME = "Test Room";

const getRoomInfo = async () => {
  let res = await RoomModel.findOne({ name: ROOM_NAME });
  return {
    ROOM_ID: res.id,
    ROOM_NAME: res.name,
    ROOM_OWNER: res.owner,
    ROOM_MEMBERS: res.members,
  }
}

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
  getMesages: `
    query getMessages($limit: Int!, $offset: Int!, $roomId: ObjectId!) {
      getMessages(limit: $limit, offset: $offset, roomId: $roomId) {
        totalDocs
        totalPages
        messages {
          content
          roomId
          author {
            name
          }
        }
      }
    }
  `,
  editMessage: `
    mutation editMessage($messageId: ObjectId!, $content: String!) {
      editMessage(messageId: $messageId, content: $content) {
        id
        content
        roomId
        author {
          name
        }
      }
    }
  `,
  deleteMessage: `
    mutation deleteMessage($messageId: ObjectId!) {
      deleteMessage(messageId: $messageId) {
        id
        content
        roomId
        author {
          name
        }
      }
    }
  `,
}


const initialize = async () => {
  await gCall({
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
}


afterAll(async () => {
  await dbHelper.clearDatabase();
  await dbHelper.closeDatabase();
});
beforeAll(async () => {
  await dbHelper.connect();
  await dbHelper.populateUsers();
  await initialize()
})


describe("MessageResolver", () => {
  const messageContent = `Hello @${fakeUser2.username} @notauser`;

  it("SendMessage should throw error if not a member", async () => {
    let { ROOM_ID } = await getRoomInfo();

    let currentUser = await UserModel.findOne({ email: fakeUser2.email })
    const messageResult = await gCall({
      currentUser: currentUser,
      source: queries.sendMessage,
      variableValues: { roomId: ROOM_ID, content: "Hello world" }
    });

    expect(messageResult.errors[0].message).toEqual('Error: Room not found or you are not a member of this room')
  });

  it("should send message", async () => {
    let { ROOM_ID } = await getRoomInfo();

    const messageResult = await gCall({
      source: queries.sendMessage,
      variableValues: { roomId: ROOM_ID, content: "Hello world" }
    });

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
    let { ROOM_ID } = await getRoomInfo();

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

    const payload: any = dbNotification.payload;
    expect(payload.message).toEqual(messageContent);
    expect(payload.roomName).toEqual(_room?.name);
  });

  it('should getMessages', async () => {
    let { ROOM_ID } = await getRoomInfo();

    const messageResult = await gCall({
      source: queries.getMesages,
      variableValues: { roomId: ROOM_ID, limit: 10, offset: 0 }
    });
    expect(messageResult?.data?.getMessages).toEqual(
      expect.objectContaining({
        totalDocs: 2,
        totalPages: 0,
        messages: [
          {
            content: "Hello world",
            roomId: ROOM_ID,
            author: { name: fakeUser.name }
          },
          {
            content: "Hello @newuser-abcd @notauser",
            roomId: ROOM_ID,
            author: { name: fakeUser.name }
          }
        ]
      })
    )
  })

  it("should edit message", async () => {
    let { ROOM_ID } = await getRoomInfo();

    let message = await MessageModel.findOne({ author: fakeUser.id });
    const messageResult = await gCall({
      source: queries.editMessage,
      variableValues: { messageId: message.id, content: "Edited message" }
    });

    expect(messageResult?.data?.editMessage).toEqual(
      expect.objectContaining({
        content: "Edited message",
        roomId: ROOM_ID,
        author: {
          name: fakeUser.name
        }
      })
    )

    const messageId = messageResult.data?.editMessage?.id;
    const dbMessage = await MessageModel.findOne({ _id: messageId });
    const dbRoom = await RoomModel.findOne({ messages: { $in: messageId } });
    expect(dbMessage?.content).toEqual("Edited message")
    expect(dbRoom?.messages).toContainEqual(new ObjectID(messageId));
  });

  it("should delete message", async () => {
    let { ROOM_ID } = await getRoomInfo();

    const messageContent = "Edited message";
    const message = await MessageModel.findOne({ author: fakeUser.id });
    const messageResult = await gCall({
      source: queries.deleteMessage,
      variableValues: { messageId: message.id, content: messageContent }
    });

    expect(messageResult?.data?.deleteMessage).toEqual(
      expect.objectContaining({
        content: messageContent,
        roomId: ROOM_ID,
        author: {
          name: fakeUser.name
        }
      })
    )

    const messageId = messageResult.data?.editMessage?.id;
    const dbMessage = await MessageModel.findOne({ _id: messageId })
    const dbRoom = await RoomModel.findOne({ messages: { $in: messageId } })
    expect(dbMessage).toBeNull();
    expect(dbRoom).toBeNull();
  });
}) 