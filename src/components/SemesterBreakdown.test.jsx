import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import academicReducer, {
  initialState,
  addCourse,
} from "../features/academic/academicSlice";
import SemesterBreakdown from "./SemesterBreakdown";

function renderSemesterBreakdown({ courses = [], currentLevel = 400 } = {}) {
  const store = configureStore({
    reducer: {
      academic: academicReducer,
    },
    preloadedState: {
      academic: {
        ...initialState,
        currentLevel,
      },
    },
  });

  courses.forEach((course) => {
    store.dispatch(
      addCourse({
        yearLevel: course.yearLevel ?? 100,
        semesterId: course.semesterId ?? "100-first",
        course: course.data,
      }),
    );
  });

  render(
    <Provider store={store}>
      <SemesterBreakdown />
    </Provider>,
  );

  return store;
}

describe("SemesterBreakdown", () => {
  it("renders the section heading", () => {
    renderSemesterBreakdown();

    expect(
      screen.getByRole("heading", { name: /semester breakdown/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Your academic history")).toBeInTheDocument();
  });

  it("renders semester cards for academic years up to the current level", () => {
    renderSemesterBreakdown({ currentLevel: 100 });

    expect(screen.getByText("100 Level · First Semester")).toBeInTheDocument();
    expect(screen.getByText("100 Level · Second Semester")).toBeInTheDocument();
    expect(screen.queryByText(/200 Level/)).not.toBeInTheDocument();
  });

  it("shows a placeholder when a semester has no completed courses", () => {
    renderSemesterBreakdown({ currentLevel: 100 });

    expect(screen.getAllByText("--")).toHaveLength(2);
    expect(screen.getAllByText("0 completed courses")).toHaveLength(2);
  });

  it("calculates semester GPA from completed courses", () => {
    renderSemesterBreakdown({
      currentLevel: 100,
      courses: [
        {
          data: {
            id: "course-1",
            code: "CSC101",
            creditUnits: 3,
            grade: "A",
            resultStatus: "completed",
          },
        },
      ],
    });

    expect(screen.getByText("5.00")).toBeInTheDocument();
    expect(screen.getByText("1 completed course")).toBeInTheDocument();
    expect(screen.getByText("0 completed courses")).toBeInTheDocument();
  });

  it("excludes expected courses from completed semester results", () => {
    renderSemesterBreakdown({
      currentLevel: 100,
      courses: [
        {
          data: {
            id: "course-expected",
            code: "CSC102",
            creditUnits: 3,
            grade: "A",
            resultStatus: "expected",
          },
        },
      ],
    });

    expect(screen.getAllByText("--")).toHaveLength(2);
    expect(screen.getAllByText("0 completed courses")).toHaveLength(2);
  });

  it("displays the configured grading scale", () => {
    renderSemesterBreakdown({ currentLevel: 100 });

    expect(screen.getAllByText("Semester GPA · 5.00 scale")).toHaveLength(2);
  });
});
