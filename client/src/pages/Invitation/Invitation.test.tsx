import "../../tests/__mocks__/matchMedia";

import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { AuthProvider } from "contexts/AuthContext";
import { fireEvent, act } from "@testing-library/react";
import { renderWithStyledTheme } from "tests/testUtils";
import { MockedProvider, wait } from "@apollo/react-testing";
import {
  CurrentUserDocument,
  GetInvitationInfoDocument,
  AcceptInvitationDocument,
  ListCurrentUserRoomsDocument,
} from "graphql/generated/graphql";

import Invitation from "./Invitation";
import NotificationsWithPortal from "../../NotificationWithPortal";

const FAKE_TOKEN = "1ace01d808072fc4905f1796203f8ffa";
const mocks = [
  {
    request: {
      query: ListCurrentUserRoomsDocument,
    },
    result: {
      data: {
        currentUserRooms: {
          id: "5edb4fc4572d741f64c9a57d",
          name: "fake room",
          createdAt: Date.now(),
          owner: "5edb4fc4572d741f64c9a57d",
        },
      },
    },
  },
  {
    request: {
      query: AcceptInvitationDocument,
    },
    result: {
      data: {
        acceptInvitation: true,
      },
    },
  },
  {
    request: {
      query: GetInvitationInfoDocument,
      token: FAKE_TOKEN,
    },
    result: {
      data: {
        invitationInfo: {
          id: "5ee09c94a6142e1150a963cb",
          room: {
            name: "AmazingRoom",
            id: "5edb4fc4572d741f64c9a57d",
          },
          invitedBy: {
            name: "Anurag Hazra",
          },
          createdAt: "1591278452772",
          isPublic: false,
        },
      },
    },
  },
  {
    request: {
      query: CurrentUserDocument,
    },
    result: {
      data: {
        me: {
          links: null,
          color: "#ffffff",
          id: "5ed7bf9ea4df011004898efb",
          name: "Test user",
          email: "testuser@gmail.com",
          avatarUrl:
            "https://lh3.googleusercontent.com/a-/AOh14GhxgedFrKCXdKlxuMoXRFBRXlLEfSSz65AEQzIY6hg",
          username: "testuser_kazhysow",
          rooms: [
            {
              id: "5eda02c6f761de0bcc90cbfa",
              name: "Lets do it again",
              owner: "5ed7bf9ea4df091004898efb",
            },
          ],
        },
      },
    },
  },
];

describe("Invitation", () => {
  it("Invitation", async () => {
    // MOCK ROUTER https://testing-library.com/docs/example-react-router
    const history = createMemoryHistory();

    const { getByText, queryByTestId } = renderWithStyledTheme(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router history={history}>
          <AuthProvider>
            <NotificationsWithPortal />
            <Invitation />
          </AuthProvider>
        </Router>
      </MockedProvider>
    );

    history.push("/invitation/" + FAKE_TOKEN);
    expect(queryByTestId("loading")).toBeInTheDocument();
    await wait(0);
    expect(queryByTestId("loading")).not.toBeInTheDocument();
    expect(getByText("AmazingRoom")).toBeInTheDocument();
    expect(getByText(/Anurag Hazra/i)).toBeInTheDocument();
    expect(getByText(/Accept Invitation/i)).toBeInTheDocument();
    expect(history.location.pathname).toBe("/invitation/" + FAKE_TOKEN);

    // ACCEPT
    let button = getByText(/Accept Invitation/i);

    await act(async () => fireEvent.click(button));
    await wait(0);

    // CHECK redirection
    expect(history.location.pathname).toBe("/");
  });
});
