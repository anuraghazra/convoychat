import * as dbHelper from "../../test-utils/db-helpers";
import { fakeUser, fakeUser2 } from "../../test-utils/fake-user";
import { gCall } from "../../test-utils/gcall";
import { ObjectID } from 'mongodb';

import UserModel from "../../entities/User";
import NotificationModel, { NOTIFICATION_TYPE } from "../../entities/Notification";
import InvitationModel from "../../entities/Invitation";


const testData = {
  ROOM_ID: null,
  ROOM_NAME: 'Test Room',
  TOKEN: null,
  userToInvite: null
}

const queries = {
  inviteMembers: `
    mutation inviteMembers($roomId: ObjectId!, $members: [ObjectId!]!) {
      inviteMembers(roomId: $roomId, members: $members) {
        isPublic
        userId
        invitedBy
      }
    }
  `,
  getNotifications: `
    query getNotifications {
      getNotifications {
        receiver
        sender {
          name
        }
        seen
        type
        payload
      }
    }
  `,
  getInvitationInfo: `
    query getInvitationInfo($token: String!) {
      getInvitationInfo(token: $token) {
        room {
          name
        }
        invitedBy {
          name
        }
        isPublic
      }
    }
  `,
  acceptInvitation: `
    mutation acceptInvitation($token: String!) {
      acceptInvitation(token: $token)
    }
  `,
  createInvitationLink: `
    mutation createInvitationLink($roomId: ObjectId!) {
      createInvitationLink(roomId: $roomId) {
        link
      }
    }
  `
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
    variableValues: { name: testData.ROOM_NAME }
  });
  testData.userToInvite = await UserModel.findOne({ username: fakeUser2.username })
  testData.ROOM_ID = result.data.createRoom.id;
}


afterAll(async () => {
  await dbHelper.clearDatabase();
  await dbHelper.closeDatabase();
  testData.ROOM_ID = null;
});
beforeAll(async () => {
  await dbHelper.connect();
  await dbHelper.populateUsers();
  await initialize()
})

describe("InvitationResolver", () => {
  it("should invite members", async () => {
    const userToInvite = testData.userToInvite;
    let invitaionResult = await gCall({
      source: queries.inviteMembers,
      // fake roomId
      variableValues: { members: [userToInvite.id], roomId: userToInvite.id }
    });

    expect(invitaionResult.errors[0].message).toBe("Error: You are not a member of room, Cannot invite members")

    invitaionResult = await gCall({
      source: queries.inviteMembers,
      variableValues: { members: [userToInvite.id], roomId: testData.ROOM_ID }
    });

    expect(invitaionResult?.data).toEqual(
      expect.objectContaining({
        inviteMembers: [{
          isPublic: false,
          userId: userToInvite.id,
          invitedBy: fakeUser.id,
        }]
      })
    )

    const dbNotification = await NotificationModel.findOne({ receiver: userToInvite.id })
    const dbInvitation = await InvitationModel.findOne({ userId: userToInvite.id })
    expect(dbNotification.type).toEqual(NOTIFICATION_TYPE.INVITATION)
    expect(dbNotification.seen).toEqual(false)
    expect(dbNotification.sender).toEqual(new ObjectID(fakeUser.id))
    expect(dbNotification.receiver).toEqual(new ObjectID(userToInvite.id))
    expect((dbNotification.payload as any).token).toBeDefined()
    expect(dbInvitation).toBeDefined()
  });


  it("should get Notification and token", async () => {
    const userToInvite = await UserModel.findOne({ username: fakeUser2.username })
    const notificationResult = await gCall({
      currentUser: userToInvite,
      source: queries.getNotifications,
    });

    testData.TOKEN = notificationResult?.data?.getNotifications[0]?.payload?.token;

    delete notificationResult?.data?.getNotifications[0]?.payload;
    expect(notificationResult?.data).toEqual(
      expect.objectContaining({
        getNotifications: [{
          type: NOTIFICATION_TYPE.INVITATION,
          seen: false,
          receiver: userToInvite.id,
          sender: { name: fakeUser.name },
        }]
      })
    )
  });

  it("should get Invitation Info", async () => {
    const inviteResult = await gCall({
      currentUser: testData.userToInvite,
      source: queries.getInvitationInfo,
      variableValues: { token: testData.TOKEN }
    });

    expect(inviteResult?.data).toEqual(
      expect.objectContaining({
        getInvitationInfo: {
          room: { name: testData.ROOM_NAME },
          invitedBy: { name: fakeUser.name },
          isPublic: false,
        }
      })
    )
  });

  it("should accept Invitation throw error on invalid token", async () => {
    let inviteResult = await gCall({
      source: queries.acceptInvitation,
      variableValues: { token: 'invalid token.. lol' }
    });

    expect(inviteResult.errors[0].message).toBe("Invalid Invitation")
  });

  it("should accept Invitation", async () => {
    const userToInvite = await UserModel.findOne({ username: fakeUser2.username })
    let inviteResult = await gCall({
      source: queries.acceptInvitation,
      variableValues: { token: testData.TOKEN }
    });

    expect(inviteResult.errors[0].message).toBe("Something went wrong while accepting invite")

    inviteResult = await gCall({
      currentUser: userToInvite,
      source: queries.acceptInvitation,
      variableValues: { token: testData.TOKEN }
    });
    expect(inviteResult?.data).toBeTruthy();

    const dbInvite = await InvitationModel.findOne({ receiver: userToInvite.id });
    expect(dbInvite).toBeNull();
  });

  it("should create invitation link", async () => {
    let inviteResult = await gCall({
      source: queries.createInvitationLink,
      variableValues: { roomId: testData.ROOM_ID }
    });

    expect(inviteResult?.data?.createInvitationLink?.link)
      .toMatch('http://localhost:3000/invitation');

    const dbInvite = await InvitationModel.findOne({ isPublic: true });
    expect(dbInvite).toBeDefined();
  });
})