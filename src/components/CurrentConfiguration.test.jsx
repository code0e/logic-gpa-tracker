import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import academicReducer, {
  initialState,
} from "../features/academic/academicSlice";
import CurrentConfiguration from "./CurrentConfiguration";

function renderCurrentConfiguration(overrides = {}) {
  const store = configureStore({
    reducer: {
      academic: academicReducer,
    },
    preloadedState: {
      academic: {
        ...initialState,
        ...overrides,
      },
    },
  });

  render(
    <Provider store={store}>
      <CurrentConfiguration />
    </Provider>,
  );

  return store;
}

describe("CurrentConfiguration", () => {
  it("renders the university name", () => {
    renderCurrentConfiguration();

    expect(screen.getByText("Nnamdi Azikiwe University")).toBeInTheDocument();
  });

  it("displays the grading scale from Redux", () => {
    renderCurrentConfiguration();

    expect(screen.getByText("5-point")).toBeInTheDocument();
  });

  it("displays the current academic level from Redux", () => {
    renderCurrentConfiguration();

    expect(screen.getByText("400 Level")).toBeInTheDocument();
  });

  it("updates displayed values when Redux state differs", () => {
    renderCurrentConfiguration({
      gradingScale: 4,
      currentLevel: 300,
    });

    expect(screen.getByText("4-point")).toBeInTheDocument();
    expect(screen.getByText("300 Level")).toBeInTheDocument();
  });
});
