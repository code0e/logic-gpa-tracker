import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import academicReducer from "../features/academic/academicSlice";
import TargetSelector from "./TargetSelector";

function renderTargetSelector() {
  const store = configureStore({
    reducer: {
      academic: academicReducer,
    },
  });

  render(
    <Provider store={store}>
      <TargetSelector />
    </Provider>,
  );

  return store;
}

describe("TargetSelector", () => {
  it("displays the current target classification", () => {
    renderTargetSelector();

    expect(
      screen.getByLabelText("Target degree classification"),
    ).toBeInTheDocument();
  });

  it("updates the target classification in Redux", () => {
    const store = renderTargetSelector();

    const dropdown = screen.getByLabelText("Target degree classification");

    const options = Array.from(dropdown.options);
    const differentOption = options.find(
      (option) => option.value !== dropdown.value,
    );

    fireEvent.change(dropdown, {
      target: { value: differentOption.value },
    });

    expect(store.getState().academic.targetClass).toBe(differentOption.value);
  });
});
