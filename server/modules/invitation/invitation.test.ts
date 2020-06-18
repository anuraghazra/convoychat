import { ObjectID } from "mongodb";
import { Maybe } from "graphql/jsutils/Maybe";
import * as dbHelper from "../../test-utils/db-helpers";
import { fakeUser, fakeUser2 } from "../../test-utils/fake-user";
import { gCall } from "../../test-utils/gcall";

import UserModel from "../../entities/User";
import NotificationModel, { NOTIFICATION_TYPE } from "../../entities/Notification";
import InvitationModel from "../../entities/Invitation";

const ROOM_NAME = "Test Room";
let ROOM_ID: Maybe<ObjectID> = null;
let TOKEN: Maybe<string> = null;

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


describe("InvitationResolver", () => {
  it("should check the invitation logic", async () => {
    const userToInvite = await UserModel.findOne({ username: fakeUser2.username })
    let invitaionResult = await gCall({
      source: queries.inviteMembers,
      // fake roomId
      variableValues: { members: [userToInvite.id], roomId: userToInvite.id }
    });

    expect(invitaionResult.errors[0].message).toBe("Error: You are not a member of room, Cannot invite members")

    invitaionResult = await gCall({
      source: queries.inviteMembers,
      variableValues: { members: [userToInvite.id], roomId: ROOM_ID }
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
    expect(dbNotification).toBeDefined()
    expect(dbInvitation).toBeDefined()
  });


  it("should get Notification and token", async () => {
    const userToInvite = await UserModel.findOne({ username: fakeUser2.username })
    const notificationResult = await gCall({
      currentUser: userToInvite,
      source: queries.getNotifications,
    });

    TOKEN = notificationResult?.data?.getNotifications[0]?.payload?.token;

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
    const userToInvite = await UserModel.findOne({ username: fakeUser2.username })
    const inviteResult = await gCall({
      currentUser: userToInvite,
      source: queries.getInvitationInfo,
      variableValues: { token: TOKEN }
    });

    expect(inviteResult?.data).toEqual(
      expect.objectContaining({
        getInvitationInfo: {
          room: { name: ROOM_NAME },
          invitedBy: { name: fakeUser.name },
          isPublic: false,
        }
      })
    )
  });

  it("should accept Invitation", async () => {
    const userToInvite = await UserModel.findOne({ username: fakeUser2.username })
    let inviteResult = await gCall({
      source: queries.acceptInvitation,
      variableValues: { token: TOKEN }
    });

    expect(inviteResult.errors[0].message).toBe("Something went wrong while accepting invite")

    inviteResult = await gCall({
      currentUser: userToInvite,
      source: queries.acceptInvitation,
      variableValues: { token: TOKEN }
    });
    expect(inviteResult?.data).toBeTruthy();

    const dbInvite = await InvitationModel.findOne({ receiver: userToInvite.id });
    expect(dbInvite).toBeNull();
  });
})