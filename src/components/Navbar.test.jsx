import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import academicReducer, {
  initialState,
} from "../features/academic/academicSlice";
import Navbar from "./Navbar";

function renderNavbar(preloadedState = initialState) {
  const store = configureStore({
    reducer: {
      academic: academicReducer,
    },
    preloadedState: {
      academic: preloadedState,
    },
  });

  render(
    <Provider store={store}>
      <Navbar />
    </Provider>,
  );

  return store;
}

describe("Navbar", () => {
  it("displays the Logic branding and UNIZIK label", () => {
    renderNavbar();

    expect(screen.getByRole("link", { name: /logic/i })).toHaveAttribute(
      "href",
      "#top",
    );

    expect(screen.getByText("UNIZIK")).toBeInTheDocument();
  });

  it("displays the current academic level from Redux", () => {
    renderNavbar();

    expect(
      screen.getByRole("combobox", { name: "Current academic level" }),
    ).toHaveValue("400");
  });

  it("updates the current academic level when the selection changes", () => {
    const store = renderNavbar();

    const levelSelect = screen.getByRole("combobox", {
      name: "Current academic level",
    });

    fireEvent.change(levelSelect, { target: { value: "300" } });

    expect(store.getState().academic.currentLevel).toBe(300);
    expect(levelSelect).toHaveValue("300");
  });
});
