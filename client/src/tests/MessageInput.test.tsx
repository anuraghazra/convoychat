import "./__mocks__/matchMedia";

import React, { useState } from "react";
import MessageInput from "components/MessageInput/MessageInput";
import useMessageInput from "components/MessageInput/useMessageInput";
import { renderWithStyledTheme } from "./testUtils";
import { fireEvent, act, cleanup } from "@testing-library/react";

beforeEach(cleanup);

describe("MessageInput", () => {
  const TestComponent: React.FC<{ editing?: boolean }> = ({ editing }) => {
    const [isEditing, setIsEditing] = useState<boolean>(editing);
    const { value, handleChange, handleEmojiClick } = useMessageInput({
      defaultValue: "Hello world",
    });

    const handleEdit = (e: React.ChangeEvent<HTMLFormElement>) => {
      console.log(e);
    };

    const handleCancel = () => {
      setIsEditing(false);
    };

    return (
      <div>
        <button data-testid="toggleEdit" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        {isEditing && (
          <MessageInput
            autoFocus
            value={value}
            handleChange={handleChange}
            handleSubmit={handleEdit}
            name="message"
            onCancel={handleCancel}
            onEmojiClick={handleEmojiClick}
            mentionSuggestions={[]}
          />
        )}
      </div>
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
});
