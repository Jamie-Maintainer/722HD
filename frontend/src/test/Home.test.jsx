import {
  render,
  screen,
} from "@testing-library/react";
import {
  ThemeProvider,
} from "@mui/material";
import {
  describe,
  expect,
  it,
} from "vitest";

import Home from "../pages/Home";
import theme from "../theme";

describe("Home", () => {
  it("renders the university homepage", () => {
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );

    expect(
      screen.getAllByText("KoalaTech University").length
    ).toBeGreaterThan(0);

    expect(
      screen.getByText("Welcome to KoalaTech University")
    ).toBeInTheDocument();
  });
});
