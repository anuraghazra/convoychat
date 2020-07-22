const fakeUser = {
  rooms: [],
  _id: "5ee76eb57b9686e1634038dd",
  id: "5ee76eb57b9686e1634038dd",
  avatarUrl: "https://fakavatar.com/img.png",
  provider: "google",
  socialId: "fakesocialid123",
  username: "fakeuser-kbghla47",
  email: "fakeuser@gmail.com",
  name: "Fake User",
  createdAt: "2020 - 06 - 15T12: 41: 32.903Z",
  updatedAt: "2020 - 06 - 16T13: 34: 54.110Z",
};

const fakeUser2 = {
  provider: "google",
  socialId: "fakesocialid456",
  avatarUrl: fakeUser.avatarUrl,
  username: "newuser-abcd",
  email: "newuser@gmail.com",
  name: "New user",
};

export { fakeUser, fakeUser2 };
