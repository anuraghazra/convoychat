import UserModel from "../../entities/User";
import { gCall } from "../../test-utils/gcall";
import { fakeUser, fakeUser2 } from "../../test-utils/fake-user";
import * as dbHelper from '../../test-utils/db-helpers';

const queries = {
  me: `
    query me {
      me {
        name
        username
      }
    }
  `,
  listUsers: `
    query listUsers {
      listUsers {
        name
        username
      }
    }
  `,
  getUser: `
    query GetUser($id: ObjectId!) {
      getUser(id: $id) {
        name
        username
        rooms {
          name
        }
      }
    }
  `
}

afterEach(async () => await dbHelper.clearDatabase());
afterAll(async () => await dbHelper.closeDatabase());
beforeAll(async () => await dbHelper.connect())
beforeEach(async () => await dbHelper.populateUsers());

describe("UserResolver", () => {
  it("Me", async () => {
    const me = await gCall({ source: queries.me });

    expect(me).toMatchObject({
      data: {
        me: {
          name: fakeUser.name,
          username: fakeUser.username,
        }
      }
    })
  })

  it("listUsers", async () => {
    const users = await gCall({ source: queries.listUsers });

    expect(users).toMatchObject({
      data: {
        listUsers: [
          { name: fakeUser2.name, username: fakeUser2.username }
        ]
      }
    })
  })

  it("getUser", async () => {
    const findId = await UserModel.findOne({ email: fakeUser.email })
    const user = await gCall({
      source: queries.getUser,
      variableValues: { id: findId._id }
    });

    expect(user).toMatchObject({
      data: {
        getUser: {
          name: fakeUser.name,
          username: fakeUser.username,
          rooms: []
        }
      }
    })
  })
}) 