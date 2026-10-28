import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import academicReducer, {
  initialState,
  addCourse,
} from "../features/academic/academicSlice";
import AcademicCoach from "./AcademicCoach";

function renderAcademicCoach({ withCourse = false, targetClass } = {}) {
  const store = configureStore({
    reducer: {
      academic: academicReducer,
    },
    preloadedState: {
      academic: {
        ...initialState,
        ...(targetClass ? { targetClass } : {}),
      },
    },
  });

  if (withCourse) {
    store.dispatch(
      addCourse({
        yearLevel: 100,
        semesterId: "100-first",
        course: {
          id: "course-1",
          code: "CSC101",
          creditUnits: 3,
          grade: "A",
          resultStatus: "completed",
        },
      }),
    );
  }

  render(
    <Provider store={store}>
      <AcademicCoach />
    </Provider>,
  );

  return store;
}

describe("AcademicCoach", () => {
  it("shows a starting message when no results exist", () => {
    renderAcademicCoach();

    expect(screen.getByText("Your journey starts here.")).toBeInTheDocument();

    expect(screen.getAllByText("--").length).toBeGreaterThan(0);
  });

  it("displays CGPA values when course results exist", () => {
    renderAcademicCoach({ withCourse: true });

    expect(screen.getByText("Current CGPA")).toBeInTheDocument();
    expect(screen.getByText("Projected CGPA")).toBeInTheDocument();

    expect(screen.getAllByText("5.00").length).toBeGreaterThan(0);
  });

  it("shows advice when the projected CGPA meets the highest target", () => {
    renderAcademicCoach({ withCourse: true });

    expect(
      screen.getByText("Keep protecting your progress."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Your projection currently meets this target."),
    ).toBeInTheDocument();
  });

  it("shows advice when the current CGPA meets the target but projection does not", () => {
    const state = {
      ...initialState,
      targetClass: "First Class",
      academicYears: [
        {
          level: 100,
          semesters: [
            {
              id: "100-first",
              courses: [
                {
                  id: "c1",
                  code: "CSC101",
                  creditUnits: 3,
                  grade: "A",
                  resultStatus: "completed",
                },
              ],
            },
            {
              id: "100-second",
              courses: [
                {
                  id: "c2",
                  code: "CSC102",
                  creditUnits: 3,
                  grade: "F",
                  resultStatus: "expected",
                },
              ],
            },
          ],
        },
      ],
    };

    const store = configureStore({
      reducer: { academic: academicReducer },
      preloadedState: { academic: state },
    });

    render(
      <Provider store={store}>
        <AcademicCoach />
      </Provider>,
    );

    expect(
      screen.getByText("You've reached your target. Keep going!"),
    ).toBeInTheDocument();
  });

  it("shows growth advice when the target has not been reached", () => {
    const store = configureStore({
      reducer: { academic: academicReducer },
      preloadedState: {
        academic: {
          ...initialState,
          targetClass: "First Class",
        },
      },
    });

    render(
      <Provider store={store}>
        <AcademicCoach />
      </Provider>,
    );

    expect(screen.getByText("Your journey starts here.")).toBeInTheDocument();
  });

  it("shows a next classification milestone when one exists", () => {
    renderAcademicCoach({
      withCourse: true,
      targetClass: "Second Class Lower",
    });

    expect(screen.getByText("Look beyond your target")).toBeInTheDocument();
  });
});
