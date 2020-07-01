import "../../../tests/__mocks__/matchMedia";

import React from "react";
import { fireEvent, act } from "@testing-library/react";
import { renderWithStyledTheme } from "tests/testUtils";

import SocialLinkInput from "./SocialLinkInput";

describe("<SocialLinkInput />", () => {
  it("should successfully submit link", async () => {
    const handleSocialLinks = jest.fn();
    const { getByLabelText, getByTestId } = renderWithStyledTheme(
      <SocialLinkInput onSubmit={handleSocialLinks} />
    );

    await act(async () => {
      fireEvent.change(getByLabelText(/link/i), {
        target: { value: "https://github.com/anuraghazra" },
      });
    });

    expect(getByLabelText(/link/i)).toHaveValue(
      "https://github.com/anuraghazra"
    );

    await act(async () => {
      fireEvent.submit(getByTestId("form"));
    });

    expect(handleSocialLinks).toHaveBeenCalledWith({
      type: "github",
      value: "https://github.com/anuraghazra",
    });
  });

  it("should throw error on invalid link", async () => {
    const handleSocialLinks = jest.fn();
    const { getByLabelText, getByTestId } = renderWithStyledTheme(
      <SocialLinkInput onSubmit={handleSocialLinks} />
    );

    await act(async () => {
      fireEvent.change(getByLabelText(/link/i), {
        target: { value: "https://fakeurl.com" },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId("form"));
    });

    expect(getByTestId("input-error")).toHaveTextContent("Invalid URL");
  });

  it("should switch link types and assert them", async () => {
    const handleSocialLinks = jest.fn();
    const { getByLabelText, getByTestId } = renderWithStyledTheme(
      <SocialLinkInput onSubmit={handleSocialLinks} />
    );

    await act(async () => {
      fireEvent.change(getByTestId("link-types"), {
        target: { value: "twitter" },
      });
    });

    await act(async () => {
      fireEvent.change(getByLabelText(/link/i), {
        target: { value: "https://twitter.com/anuraghazru" },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId("form"));
    });

    expect(handleSocialLinks).toHaveBeenCalledWith({
      type: "twitter",
      value: "https://twitter.com/anuraghazru",
    });

    // Should allow custom website
    await act(async () => {
      fireEvent.change(getByTestId("link-types"), {
        target: { value: "website" },
      });
    });

    await act(async () => {
      fireEvent.change(getByLabelText(/link/i), {
        target: { value: "https://anuraghazra.github.io" },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId("form"));
    });

    expect(handleSocialLinks).toHaveBeenCalledWith({
      type: "website",
      value: "https://anuraghazra.github.io",
    });
  });
});
