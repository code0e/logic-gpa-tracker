import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import academicReducer, {
  initialState,
  addCourse,
} from "../features/academic/academicSlice";
import AcademicOverview from "./AcademicOverview";

function renderAcademicOverview({ courses = [] } = {}) {
  const store = configureStore({
    reducer: {
      academic: academicReducer,
    },
    preloadedState: {
      academic: initialState,
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
      <AcademicOverview />
    </Provider>,
  );

  return store;
}

describe("AcademicOverview", () => {
  it("renders the overview heading and three statistic cards", () => {
    renderAcademicOverview();

    expect(
      screen.getByRole("heading", { name: "Academic overview" }),
    ).toBeInTheDocument();

    expect(screen.getByText("CURRENT CGPA")).toBeInTheDocument();
    expect(screen.getByText("PROJECTED CGPA")).toBeInTheDocument();
    expect(screen.getByText("ACADEMIC TARGET")).toBeInTheDocument();
  });

  it("shows placeholders when no course results exist", () => {
    renderAcademicOverview();

    expect(screen.getAllByText("--")).toHaveLength(2);
  });

  it("displays the current and projected CGPA for completed courses", () => {
    renderAcademicOverview({
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

    expect(screen.getAllByText("5.00")).toHaveLength(2);
  });

  it("displays the selected academic target", () => {
    renderAcademicOverview();

    expect(screen.getByText("First Class")).toBeInTheDocument();
    expect(screen.getByText("Your graduation goal")).toBeInTheDocument();
  });
});
