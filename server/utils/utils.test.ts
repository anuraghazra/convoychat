import { ObjectID } from "mongodb";
import UpsertUser from "./upsert-user";
import UserModel from "../entities/User";
import parseMentions from "./mention-parser";
import sendNotification from "./sendNotification";
import { fakeUser } from "../test-utils/fake-user";
import * as dbHelper from "../test-utils/db-helpers";
import { createFakeContext } from "../test-utils/gcall";
import NotificationModel, { NOTIFICATION_TYPE } from "../entities/Notification";
import { generateUsername } from ".";

jest.setTimeout(500000);

afterAll(async () => {
  await dbHelper.clearDatabase();
  await dbHelper.closeDatabase();
});
beforeAll(async () => {
  await dbHelper.connect();
  await dbHelper.populateUsers();
});

describe("Test Utility Functions", () => {
  it("should test mention parser", () => {
    const content =
      "Hello world @anuraghazra @anu @123 @jaha @hahahahahahahahahahahahahaha";
    expect(parseMentions(content)).toEqual([
      "anuraghazra",
      "anu",
      "123",
      "jaha",
    ]);
  });

  it("should test generateUsername", () => {
    expect(generateUsername("Anurag Hazra")).toMatch(/anuraghazra\-/);
    expect(generateUsername("ANURAGHAZRA")).toMatch(/anuraghazra\-/);
    expect(generateUsername("anurag (*#.$(!#(*&_)))hazra")).toMatch(
      /anuraghazra\-/
    );
  });

  it("should test UpsertUser", async () => {
    const done = jest.fn();
    await UpsertUser(
      "google",
      {
        socialId: "123",
        avatarUrl: "https://google.com",
        displayName: "Anurag Hazra",
        email: "awesome@gmail.com",
        username: "anuraghazra",
      },
      done
    );

    const newUser = await UserModel.findOne({ email: "awesome@gmail.com" });
    expect(done).toBeCalledTimes(1);
    expect(newUser.username).toBe("anuraghazra");
  });

  it("should test sendNotification", async () => {
    const noti = await sendNotification({
      seen: false,
      type: NOTIFICATION_TYPE.INVITATION,
      sender: new ObjectID(fakeUser.id),
      receiver: new ObjectID(fakeUser.id),
      payload: { ok: "works" },
      context: createFakeContext(fakeUser) as any,
    });

    const notification = noti.toObject();
    expect(notification.sender?.username).toEqual(fakeUser.username);
    expect(notification.receiver).toEqual(new ObjectID(fakeUser.id));
    expect(notification.payload).toMatchObject({ ok: "works" });

    const dbNotification = await NotificationModel.findOne({
      sender: fakeUser.id,
    });
    expect(dbNotification).toBeDefined();
  });
});
