import UserModel from "../../entities/User";
import { gCall } from "../../test-utils/gcall";
import fakeUser from "../../test-utils/fake-user";
import * as dbHelper from '../../test-utils/db-helpers';

afterEach(async () => await dbHelper.clearDatabase());
afterAll(async () => await dbHelper.closeDatabase());
beforeAll(async () => await dbHelper.connect())
beforeEach(async () => await dbHelper.populate());

describe("UserResolver", () => {
  it("Me", async () => {
    const query = `
      query me {
        me {
          name
          username
        }
      }
    `;

    let me = await gCall({ source: query });

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
    const query = `
      query listUsers {
        listUsers {
          name
          username
        }
      }
    `;

    let user = await gCall({ source: query });

    expect(user).toMatchObject({
      data: {
        listUsers: [
          { name: fakeUser.name, username: fakeUser.username, },
          { name: 'New user', username: 'newuser-abcd', }
        ]
      }
    })
  })

  it("getUser", async () => {
    const query = `
      query GetUser($id: ObjectId!) {
        getUser(id: $id) {
          name
          username
          rooms {
            name
          }
        }
      }
    `;

    let findId = await UserModel.findOne({ email: fakeUser.email })
    let user = await gCall({
      source: query,
      variableValues: { id: findId.id }
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