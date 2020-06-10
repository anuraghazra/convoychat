import React from "react";
import { fireEvent, act } from "@testing-library/react";
import { Dropdown } from "@convoy-ui";
import { renderWithStyledTheme } from "./testUtils";

describe("Dropdown", () => {
  it("should renders & Toggle <Dropdown> ", () => {
    const { getByText, getByTestId } = renderWithStyledTheme(
      <Dropdown>
        <Dropdown.Toggle>
          <button>Click to toggle</button>
        </Dropdown.Toggle>
        <Dropdown.Content>
          <div>dropdown content</div>
        </Dropdown.Content>
      </Dropdown>
    );

    const toggleButton = getByText(/Click to toggle/i);
    const dropdownContent = getByTestId("dropdown-content");

    expect(dropdownContent).toBeInTheDocument();
    expect(dropdownContent).not.toBeVisible();

    fireEvent.click(toggleButton);
    expect(dropdownContent).toBeVisible();
    expect(dropdownContent).toHaveTextContent("dropdown content");

    fireEvent.click(toggleButton);
    expect(dropdownContent).not.toBeVisible();

    // click again
    fireEvent.click(toggleButton);
    expect(dropdownContent).toBeVisible();

    // click outside
    fireEvent.click(document.body);
    expect(dropdownContent).not.toBeVisible();
  });

  it("<Dropdown.Toggle> should work with renderProp", () => {
    const { getByText, getByTestId } = renderWithStyledTheme(
      <Dropdown>
        <Dropdown.Toggle>
          {(
            toggle: (
              event: React.MouseEvent<HTMLSpanElement, MouseEvent>
            ) => void
          ) => (
            <span>
              <button>
                Click to <span onClick={toggle}>toggle</span>
              </button>
            </span>
          )}
        </Dropdown.Toggle>
        <Dropdown.Content>
          <div>dropdown content</div>
        </Dropdown.Content>
      </Dropdown>
    );

    const toggleButton = getByText(/toggle/i, { selector: "span" });
    const dropdownContent = getByTestId("dropdown-content");
    expect(dropdownContent).toBeInTheDocument();
    expect(dropdownContent).not.toBeVisible();

    fireEvent.click(toggleButton);
    expect(dropdownContent).toBeVisible();

    fireEvent.click(toggleButton);
    expect(dropdownContent).not.toBeVisible();
  });

  it("should handle multiple <Dropdown.Toggle> & <Dropdown.Content>", async () => {
    const { getAllByTestId, getByText, queryByText } = renderWithStyledTheme(
      <Dropdown>
        <Dropdown.Toggle>
          {(
            toggle: (
              event: React.MouseEvent<HTMLSpanElement, MouseEvent>
            ) => void
          ) => (
            <button>
              <span onClick={toggle}>First Toggle</span>
            </button>
          )}
        </Dropdown.Toggle>
        <Dropdown.Content>
          <div>dropdown content</div>
          <Dropdown.Toggle>
            <button>2nd Toggle, Inside Content</button>
          </Dropdown.Toggle>
        </Dropdown.Content>
        <Dropdown.Content>
          <div>second content</div>
        </Dropdown.Content>
      </Dropdown>
    );

    const toggleButton = getByText(/First Toggle/i, { selector: "span" });
    const toggleButton2 = queryByText(/2nd Toggle, Inside Content/i, {
      selector: "span",
    });
    const dropdownContent = getAllByTestId("dropdown-content");

    expect(toggleButton).toBeInTheDocument();
    expect(dropdownContent.length).toBe(2);
    expect(toggleButton2).toBeNull();

    fireEvent.click(toggleButton);
    expect(queryByText(/dropdown content/i)).toBeInTheDocument();
    expect(queryByText(/dropdown content/i)).toBeVisible();

    fireEvent.click(
      queryByText(/2nd Toggle, Inside Content/i, {
        selector: "button",
      })
    );
    expect(dropdownContent[0]).not.toBeVisible();

    fireEvent.click(toggleButton);
    expect(dropdownContent[1]).toBeVisible();
  });
});
