import "./__mocks__/matchMedia";
import React from "react";
import { fireEvent } from "@testing-library/react";

import { Input } from "@convoy-ui";
import { renderWithStyledTheme } from "./testUtils";
import { FaCog, FaAnchor } from "react-icons/fa";

describe("<Input />", () => {
  it("should renders <Input>", () => {
    const { getByText, getByLabelText } = renderWithStyledTheme(
      <Input name="test" label="This is a label" defaultValue="hello world" />
    );
    expect(getByLabelText(/test/i)).toBeInTheDocument();
    expect(getByLabelText(/test/i)).toHaveValue("hello world");
    expect(getByText(/This is a label/i)).toBeInTheDocument();
  });

  it("should have icons", () => {
    const onPostfixIconClick = jest.fn();
    const { getByLabelText, getByTestId } = renderWithStyledTheme(
      <Input
        icon={FaCog}
        postfixIcon={FaAnchor}
        onPostfixIconClick={onPostfixIconClick}
        name="test"
        label="name"
        defaultValue="hello world"
      />
    );
    expect(getByLabelText(/test/i)).toBeInTheDocument();
    expect(getByTestId("input-icon")).toBeInTheDocument();
    expect(getByTestId("input-postfix-icon")).toBeInTheDocument();

    fireEvent.click(getByTestId("input-postfix-icon"));
    expect(onPostfixIconClick).toHaveBeenCalledWith(getByLabelText(/test/i));
  });

  it("should have errors", () => {
    const { getByLabelText, getByTestId } = renderWithStyledTheme(
      <Input
        errors={{ test: { type: "", message: "Invalid", isManual: true } }}
        name="test"
        label="name"
        defaultValue="hello world"
      />
    );
    expect(getByLabelText(/test/i)).toBeInTheDocument();
    expect(getByTestId("input-error")).toBeInTheDocument();
    expect(getByTestId("input-error")).toHaveTextContent("Invalid");
  });
});
