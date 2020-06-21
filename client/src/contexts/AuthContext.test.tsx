import "../tests/__mocks__/matchMedia";
import React from "react";
import { fireEvent, act } from "@testing-library/react";
import { MockedProvider, wait } from "@apollo/react-testing";
import { renderWithStyledTheme } from "tests/testUtils";
import { useAuthContext, AuthProvider } from "./AuthContext";
import { CurrentUserDocument, LogoutDocument } from "graphql/generated/graphql";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

const mocks = [
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
            "https://lh3.googleusercontent.com/a-/AOh14GhxgedFrKCXKlxuMoXRFBRXlLEfSSz65AEQzIY6hg",
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
  {
    request: {
      query: LogoutDocument,
    },
    result: {
      data: {
        logout: true,
      },
    },
  },
];

describe("AuthContext", () => {
  it("Check user login", async () => {
    // MOCK ROUTER https://testing-library.com/docs/example-react-router
    const history = createMemoryHistory();
    const TestComponent = () => {
      let {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      } = useAuthContext();

      return (
        <div>
          {isLoading && <div>Loading</div>}

          <button onClick={() => login()}>Login</button>
          <button onClick={() => logout()}>Logout</button>
          <div>{isAuthenticated ? "Authenticated" : "UnAuthenticated"}</div>
          <div data-testid="username">{user?.name}</div>
          <div data-testid="email">{user?.email}</div>
        </div>
      );
    };

    const { findByTestId, getByText, queryByText } = renderWithStyledTheme(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router history={history}>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </Router>
      </MockedProvider>
    );

    expect(getByText("Loading")).toBeInTheDocument();
    expect(getByText("UnAuthenticated")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByText("Login"));
    });

    // CHECK FOR USER
    let username = await findByTestId("username");
    let email = await findByTestId("email");
    expect(username).toHaveTextContent("Test user");
    expect(email).toHaveTextContent("testuser@gmail.com");

    // CHECK PATH
    expect(history.location.pathname).toBe("/");
    expect(queryByText("Loading")).toBeNull();
    expect(getByText("Authenticated")).toBeInTheDocument();

    // LOGOUT
    await act(async () => {
      fireEvent.click(getByText("Logout"));
    });
    await wait(0);
    expect(history.location.pathname).toBe("/login");
    expect(getByText("Loading")).toBeInTheDocument();
    expect(getByText("UnAuthenticated")).toBeInTheDocument();
  });
});
