import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import academicReducer, {
  initialState,
} from "../features/academic/academicSlice";
import Hero from "./Hero";

function renderHero(preloadedState = initialState) {
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
      <Hero />
    </Provider>,
  );

  return store;
}

describe("Hero", () => {
  it("renders the main heading and academic description", () => {
    renderHero();

    expect(
      screen.getByRole("heading", {
        name: /your grades\.your nextmove\./i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/track your academic journey, calculate your cgpa/i),
    ).toBeInTheDocument();
  });

  it("displays the grading scale from Redux", () => {
    renderHero();

    expect(screen.getByText("5-point grading scale")).toBeInTheDocument();
  });

  it("displays the current academic level from Redux", () => {
    renderHero();

    expect(screen.getByText("400 Level")).toBeInTheDocument();
  });

  it("renders the course management link and campus image", () => {
    renderHero();

    expect(
      screen.getByRole("link", { name: /manage my courses/i }),
    ).toHaveAttribute("href", "#course-manager");

    expect(
      screen.getByRole("img", {
        name: "University campus representing your academic journey",
      }),
    ).toHaveAttribute("src", "/school.jpg");
  });
});
