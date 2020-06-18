import { ObjectID } from "mongodb";
import RoomModel from "../../entities/Room";
import UserModel from "../../entities/User";
import { gCall } from "../../test-utils/gcall";
import * as dbHelper from "../../test-utils/db-helpers";
import { fakeUser, fakeUser2 } from "../../test-utils/fake-user";

const queries = {
  createRoom: `
    mutation createRoom($name: String!) {
      createRoom(name: $name) {
        name
        members {
          name
        }
        messages {
          content
        }
        owner
      }
    }
  `,
  listRooms: `
    query ListRooms {
      listRooms {
        name
        members {
          username
        }
        owner
      }
    }
  `,
  listCurrentUserRooms: `
    query listCurrentUserRooms {
      listCurrentUserRooms {
        name
        owner
      }
    }
  `,
  getRoom: `
    query getRoom($id: ObjectId!) {
      getRoom(id: $id) {
        name
        owner
      }
    }
  `,
  removeMemberFromRoom: `
    mutation removeMemberFromRoom($roomId: ObjectId!, $memberId: ObjectId!) {
      removeMemberFromRoom(roomId: $roomId, memberId: $memberId) {
        id
        name
      }
    }
  `,
  deleteRoom: `
    mutation deleteRoom($roomId: ObjectId!) {
      deleteRoom(roomId: $roomId) {
        name
        owner
      }
    }
  `
}

afterAll(async () => {
  await dbHelper.clearDatabase()
  await dbHelper.closeDatabase()
});
beforeAll(async () => {
  await dbHelper.connect();
  await dbHelper.populateUsers();
})
// afterEach(async () => await dbHelper.clearDatabase());
// beforeEach(async () => await dbHelper.populate());

describe("RoomResolver", () => {
  const ROOM_NAME = "Test Room";
  it("User should create room", async () => {
    const roomResult = await gCall({
      source: queries.createRoom,
      variableValues: { name: ROOM_NAME }
    });

    expect(roomResult).toMatchObject({
      data: {
        createRoom: {
          name: ROOM_NAME,
          members: [{ name: fakeUser.name }],
          messages: [],
          owner: fakeUser.id,
        }
      }
    })

    const dbRoom = await RoomModel.findOne({ name: ROOM_NAME })
    expect(dbRoom).toBeDefined();
  });


  it("ListRooms", async () => {
    const roomsResult = await gCall({
      source: queries.listRooms
    });

    expect(roomsResult).toMatchObject({
      data: {
        listRooms: [{
          name: ROOM_NAME,
          owner: fakeUser.id,
          members: [{ username: fakeUser.username }]
        }]
      }
    })

    let allRooms = await RoomModel.find({});
    expect(allRooms.length).toEqual(1);
  })


  it("ListCurrentUserRooms", async () => {
    const roomsResult = await gCall({
      source: queries.listCurrentUserRooms
    });

    expect(roomsResult).toMatchObject({
      data: {
        listCurrentUserRooms: [{
          name: ROOM_NAME,
          owner: fakeUser.id,
        }]
      }
    })

    let allRooms = await RoomModel.find({});
    expect(allRooms.length).toEqual(1);
  })

  it("getRoom", async () => {
    const testRoom = await RoomModel.findOne({ name: ROOM_NAME })
    const roomResult = await gCall({
      source: queries.getRoom,
      variableValues: { id: testRoom._id }
    });

    expect(roomResult).toMatchObject({
      data: {
        getRoom: {
          name: ROOM_NAME,
          owner: fakeUser.id,
        }
      }
    })
  })

  it("removeMemberFromRoom", async () => {
    // Prepare (add member first)
    const testRoom = await RoomModel.findOne({ name: ROOM_NAME })
    const testUser = await UserModel.findOne({ email: fakeUser2.email })
    const roomId = testRoom.id;
    const memberId = testUser.id;
    // add user to the room
    const _room = await RoomModel.findOneAndUpdate(
      { _id: roomId },
      { $addToSet: { members: memberId } },
      { new: true }
    );
    // update user.rooms
    await UserModel.update(
      { _id: memberId },
      { $addToSet: { rooms: _room.id } },
      { new: true }
    );

    expect(_room.members).toHaveLength(2);
    expect(_room.members).toContainEqual(new ObjectID(memberId));

    // Test REMOVE USER
    const roomResult = await gCall({
      source: queries.removeMemberFromRoom,
      variableValues: {
        roomId,
        memberId,
      }
    });

    expect(roomResult).toMatchObject({
      data: {
        removeMemberFromRoom: {
          name: fakeUser2.name,
          id: memberId,
        }
      }
    })

    // Test SELF REMOVE
    const room2 = await gCall({
      source: queries.removeMemberFromRoom,
      variableValues: {
        roomId,
        memberId: fakeUser.id,
      }
    });

    expect(room2.errors[0].message).toEqual('Error: You cannot not remove yourself from room')

    // Test Invalid RoomID REMOVE
    const room3 = await gCall({
      source: queries.removeMemberFromRoom,
      variableValues: {
        roomId: fakeUser.id, // invalid id
        memberId: memberId,
      }
    });

    expect(room3.errors[0].message).toEqual('Error: Could not remove member from room')
  })


  it("deleteRoom", async () => {
    const testRoom = await RoomModel.findOne({ name: ROOM_NAME })
    const roomResult = await gCall({
      source: queries.deleteRoom,
      variableValues: { roomId: testRoom._id }
    });

    expect(roomResult).toMatchObject({
      data: {
        deleteRoom: {
          name: ROOM_NAME,
          owner: fakeUser.id,
        }
      }
    })

    const dbRoom = await RoomModel.findOne({ name: ROOM_NAME });
    expect(dbRoom).toBeNull()
  })

}) 