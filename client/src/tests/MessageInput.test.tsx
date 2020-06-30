import "./__mocks__/matchMedia";

import React, { useState } from "react";
import MessageInput from "components/MessageInput/MessageInput";
import useMessageInput from "components/MessageInput/useMessageInput";
import { renderWithStyledTheme } from "./testUtils";
import { fireEvent, act, cleanup, wait } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";
import { NotificationsWithPortal } from "../NotificationWithPortal";
import {
  CurrentUserDocument,
  UploadImageDocument,
} from "graphql/generated/graphql";

import { data_mocks } from "pages/Invitation/Invitation.test";

const mocks = [
  {
    request: {
      query: UploadImageDocument,
    },
    result: {
      data: {
        uploadImage: {
          url: "https://uploaded.com/img",
          public_id: "123",
        },
      },
    },
  },
  {
    request: {
      query: CurrentUserDocument,
    },
    result: {
      data: { me: data_mocks.me },
    },
  },
];

beforeEach(cleanup);

describe("MessageInput", () => {
  const TestComponent: React.FC<{ editing?: boolean }> = ({ editing }) => {
    const [isEditing, setIsEditing] = useState<boolean>(editing);
    const { value, setValue, handleChange, handleEmojiClick } = useMessageInput(
      {
        defaultValue: "Hello world",
      }
    );

    const handleEdit = (e: React.ChangeEvent<HTMLFormElement>) => {
      console.log(e);
    };

    const handleCancel = () => {
      setIsEditing(false);
    };

    return (
      <MockedProvider mocks={mocks} addTypename={false}>
        <>
          <NotificationsWithPortal />

          <div>
            <button data-testid="toggleEdit" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            {isEditing && (
              <MessageInput
                autoFocus
                value={value}
                setValue={setValue}
                handleChange={handleChange}
                handleSubmit={handleEdit}
                name="message"
                onCancel={handleCancel}
                onEmojiClick={handleEmojiClick}
                mentionSuggestions={[]}
              />
            )}
          </div>
        </>
      </MockedProvider>
    );
  };

  it("should renders <MessageInput>", async () => {
    const { queryByTestId, getByText } = renderWithStyledTheme(
      <TestComponent />
    );

    // TOGGLE EDITING
    expect(queryByTestId("messageInput")).toBeNull();
    await act(async () => fireEvent.click(getByText("Edit")));
    expect(queryByTestId("messageInput")).toBeInTheDocument();

    let input = queryByTestId("messageInput");
    await act(async () => fireEvent.keyDown(input, { key: "Escape" }));
    expect(queryByTestId("messageInput")).toBeNull();
  });

  it("should input value", async () => {
    const { queryByTestId } = renderWithStyledTheme(
      <TestComponent editing={true} />
    );

    // WRITE VALUE
    expect(queryByTestId("messageInput")).toHaveValue("Hello world");
    fireEvent.change(queryByTestId("messageInput"), {
      target: { value: "hey world" },
    });
    expect(queryByTestId("messageInput")).toHaveValue("hey worldHello world");
  });

  it("should upload image", async () => {
    const file = new File(["(⌐□_□)"], "image.png", {
      type: "image/png",
    });
    const data = mockData([file]);

    const { queryByTestId } = renderWithStyledTheme(
      <TestComponent editing={true} />
    );

    const dropzone = queryByTestId("dropzone");
    await act(async () => {
      dispatchEvt(dropzone, "drop", data);
    });
    await wait(() => {
      expect(queryByTestId("messageInput")).toHaveValue(
        "Hello world\n\n![Uplading image...](...please wait)"
      );
    });
    await wait(() => {
      expect(queryByTestId("messageInput")).toHaveValue(
        "Hello world\n\n![Uplading image...](...please wait)"
      );
    });
  });
});

/* Util functions for React-Dropzone */
function mockData(files: any) {
  return {
    dataTransfer: {
      files,
      items: files.map((file: any) => ({
        kind: "file",
        type: file.type,
        getAsFile: () => file,
      })),
      types: ["Files"],
    },
  };
}

function dispatchEvt(node: HTMLElement, type: string, data: any) {
  const event = new Event(type, { bubbles: true });
  Object.assign(event, data);
  fireEvent(node, event);
}
