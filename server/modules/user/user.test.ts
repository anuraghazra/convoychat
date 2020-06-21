import UserModel from "../../entities/User";
import { gCall } from "../../test-utils/gcall";
import { fakeUser, fakeUser2 } from "../../test-utils/fake-user";
import * as dbHelper from '../../test-utils/db-helpers';
jest.setTimeout(500000);

const queries = {
  me: `
    query me {
      me {
        name
        username
        links {
          github
        }
      }
    }
  `,
  listUsers: `
    query listUsers {
      listUsers {
        name
        username
        links {
          github
        }
      }
    }
  `,
  getUser: `
    query GetUser($id: ObjectId!) {
      getUser(id: $id) {
        name
        username
        links {
          github
        }
        rooms {
          name
        }
      }
    }
  `,
  setColor: `
    mutation setColor($color: String!) {
      setColor(color: $color) {
        name
        color
      }
    }
  `,
  setUserLinks: `
    mutation setUserLinks($github: String, $twitter: String, $website: String, $instagram: String) {
      setUserLinks(github: $github, twitter: $twitter, website: $website, instagram: $instagram) {
        links {
          github
          instagram
          twitter
          website
        }
      }
    }
  `
}

afterAll(async () => {
  await dbHelper.clearDatabase()
  await dbHelper.closeDatabase();
});
beforeAll(async () => {
  await dbHelper.connect()
  await dbHelper.populateUsers()
})

describe("UserResolver", () => {
  it("Me", async () => {
    const me = await gCall({ source: queries.me });

    expect(me).toMatchObject({
      data: {
        me: {
          name: fakeUser.name,
          username: fakeUser.username,
          links: null
        }
      }
    })
  })

  it("listUsers", async () => {
    const users = await gCall({ source: queries.listUsers });

    expect(users).toMatchObject({
      data: {
        listUsers: [
          {
            name: fakeUser2.name,
            username: fakeUser2.username,
            links: {
              github: null
            }
          }
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
          rooms: [],
          links: {
            github: null
          }
        }
      }
    })
  })

  it("should change user's color", async () => {
    const OK_COLOR = '#ff5896';
    const BAD_COLOR = '#000000';
    let user = await gCall({
      source: queries.setColor,
      variableValues: { color: BAD_COLOR }
    });

    expect(user.errors[0].message).toBe('Argument Validation Error')

    user = await gCall({
      source: queries.setColor,
      variableValues: { color: OK_COLOR }
    });

    expect(user).toMatchObject({
      data: {
        setColor: {
          name: fakeUser.name,
          color: OK_COLOR,
        }
      }
    })
  })

  it("should change user's links", async () => {
    let user = await gCall({
      source: queries.setUserLinks,
      variableValues: { github: 'anuraghazra', website: 'invalid' }
    });

    expect(user.errors[0].message).toBe('Argument Validation Error')

    const variableLinks = {
      github: 'https://github.com/anuraghazra',
      website: 'https://anuraghazra.github.io',
      twitter: 'https://twitter.com/anuraghazru',
      instagram: 'https://www.instagram.com/anurag_hazra/',
    }
    user = await gCall({
      source: queries.setUserLinks,
      variableValues: variableLinks
    });

    expect(user).toMatchObject({
      data: {
        setUserLinks: {
          links: variableLinks
        }
      }
    })
  })
}) 