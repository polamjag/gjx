import React from "react";
import { render, screen } from "@testing-library/react";
import GJXApp from "./GJXApp";

test("renders learn react link", () => {
  render(<GJXApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
