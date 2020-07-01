import "../../../tests/__mocks__/matchMedia";

import React from "react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { AuthProvider } from "contexts/AuthContext";
import { ModalProvider, useModalContext } from "contexts/ModalContext";
import { fireEvent, act, render } from "@testing-library/react";
import { renderWithStyledTheme } from "tests/testUtils";
import { MockedProvider, wait } from "@apollo/react-testing";
import { CurrentUserDocument } from "graphql/generated/graphql";

import UserSettings from "./UserSettings";
import { data_mocks } from "pages/Invitation/Invitation.test";

jest.mock("react-dom", () => {
  return {
    ...jest.requireActual("react-dom"),
    createPortal: (element: any, target: HTMLElement) => {
      return element;
    },
  };
});

const mocks = [
  {
    request: {
      query: CurrentUserDocument,
    },
    result: {
      data: { me: data_mocks.me },
    },
  },
];

describe("UserSettings", () => {
  const history = createMemoryHistory();

  const TestComponent = () => {
    const { dispatch } = useModalContext();

    return (
      <>
        <button
          onClick={() => {
            console.log("CLICKKKKK");
            dispatch({ type: "OPEN", modal: "UserSettings" });
          }}
        >
          Open
        </button>
        <UserSettings />
      </>
    );
  };
  const WrapperComponent = () => {
    return (
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router history={history}>
          <AuthProvider>
            <ModalProvider>
              <TestComponent />
            </ModalProvider>
          </AuthProvider>
        </Router>
      </MockedProvider>
    );
  };

  it("should test UserSettings interactions", async () => {
    const { getByText, queryByTestId } = renderWithStyledTheme(
      <WrapperComponent />
    );

    fireEvent.click(getByText(/Open/i));
    expect(getByText("User Settings")).toBeInTheDocument();
  });
});
