import React, { useState } from "react";

import "./__mocks__/matchMedia";
import MessageInput from "components/Message/MessageInput";
import { renderWithStyledTheme } from "./testUtils";
import { useForm } from "react-hook-form";
import { fireEvent, act, cleanup } from "@testing-library/react";

beforeEach(cleanup);

describe("Button", () => {
  const TestComponent: React.FC<{ editing?: boolean }> = ({ editing }) => {
    const [isEditing, setIsEditing] = useState<boolean>(editing);
    const { register, handleSubmit, getValues, setValue, errors } = useForm();

    const handleEdit = (data: any) => {
      console.log(data);
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
            data-testid="messageInput"
            autoFocus
            name="message"
            errors={errors}
            defaultValue={"Hello world"}
            onCancel={handleCancel}
            onSubmit={handleSubmit(handleEdit)}
            onEmojiClick={emoji => {
              setValue("message", getValues().message + emoji.native);
            }}
            inputRef={register({ required: "Message is required" })}
          />
        )}
      </div>
    );
  };

  it("should renders <Button>", async () => {
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
    expect(queryByTestId("messageInput")).toHaveValue("hey world");
  });
});
