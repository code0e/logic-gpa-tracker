import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import academicReducer from "../features/academic/academicSlice";
import CourseManager from "./CourseManager";

function renderCourseManager() {
  const store = configureStore({
    reducer: {
      academic: academicReducer,
    },
  });

  render(
    <Provider store={store}>
      <CourseManager />
    </Provider>,
  );

  return store;
}

function fillCourseForm({
  code = "CSC 401",
  title = "Software Engineering",
  credits = "3",
  grade = "A",
  resultStatus = "completed",
  courseType = "regular",
} = {}) {
  fireEvent.change(screen.getByPlaceholderText(/course code/i), {
    target: { value: code },
  });

  fireEvent.change(screen.getByPlaceholderText(/course title/i), {
    target: { value: title },
  });

  fireEvent.change(screen.getByLabelText(/credit units/i), {
    target: { value: credits },
  });

  fireEvent.change(screen.getByLabelText(/^grade$/i), {
    target: { value: grade },
  });

  fireEvent.change(screen.getByLabelText(/result status/i), {
    target: { value: resultStatus },
  });

  fireEvent.change(screen.getByLabelText(/course type/i), {
    target: { value: courseType },
  });
}

function addCourse(options = {}) {
  fillCourseForm(options);

  fireEvent.click(screen.getByRole("button", { name: /add course/i }));
}

describe("CourseManager", () => {
  beforeEach(() => {
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });

    vi.stubGlobal("crypto", {
      ...globalThis.crypto,
      randomUUID: vi.fn(() => "test-course-id"),
    });
  });

  it("renders the course manager and an empty semester", () => {
    renderCourseManager();

    expect(
      screen.getByRole("heading", { name: "Course Manager" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/no courses added to this semester yet/i),
    ).toBeInTheDocument();

    expect(screen.getByText("--")).toBeInTheDocument();
  });

  it("adds a course to the selected semester", () => {
    const store = renderCourseManager();

    addCourse();

    expect(
      screen.getByRole("heading", { name: "CSC 401" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Software Engineering")).toBeInTheDocument();

    const courses =
      store.getState().academic.academicYears[0].semesters[0].courses;

    expect(courses).toHaveLength(1);
    expect(courses[0]).toMatchObject({
      id: "test-course-id",
      code: "CSC 401",
      title: "Software Engineering",
      creditUnits: 3,
      grade: "A",
      resultStatus: "completed",
      courseType: "regular",
    });
  });

  it("trims the course details and uppercases the course code", () => {
    const store = renderCourseManager();

    addCourse({
      code: "  csc 401  ",
      title: "  Software Engineering  ",
    });

    const course =
      store.getState().academic.academicYears[0].semesters[0].courses[0];

    expect(course.code).toBe("CSC 401");
    expect(course.title).toBe("Software Engineering");
  });

  it("shows an error when the course code is missing", () => {
    renderCourseManager();

    addCourse({ code: "   " });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter both the course code and course title.",
    );
  });

  it("shows an error when the course title is missing", () => {
    renderCourseManager();

    addCourse({ title: "   " });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter both the course code and course title.",
    );
  });

  it("rejects negative credit units", () => {
    const store = renderCourseManager();

    fillCourseForm({ credits: "-1" });

    fireEvent.submit(document.getElementById("course-form"));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Credit units must be a whole number of zero or more.",
    );

    expect(
      store.getState().academic.academicYears[0].semesters[0].courses,
    ).toHaveLength(0);
  });

  it("rejects decimal credit units", () => {
    const store = renderCourseManager();

    fillCourseForm({ credits: "2.5" });

    fireEvent.submit(document.getElementById("course-form"));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Credit units must be a whole number of zero or more.",
    );

    expect(
      store.getState().academic.academicYears[0].semesters[0].courses,
    ).toHaveLength(0);
  });

  it("allows zero credit units because the component permits them", () => {
    const store = renderCourseManager();

    addCourse({ credits: "0" });

    expect(
      store.getState().academic.academicYears[0].semesters[0].courses,
    ).toHaveLength(1);
  });

  it("resets the form after successfully adding a course", () => {
    renderCourseManager();

    addCourse();

    expect(screen.getByPlaceholderText(/course code/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/course title/i)).toHaveValue("");
    expect(screen.getByLabelText(/credit units/i)).toHaveValue(0);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("displays the expected and carryover badges", () => {
    renderCourseManager();

    addCourse({
      resultStatus: "expected",
      courseType: "carryover",
    });

    const course = screen.getByRole("article");

    expect(within(course).getByText("Expected")).toBeInTheDocument();
    expect(within(course).getByText("Carryover")).toBeInTheDocument();
  });

  it("enters edit mode and updates an existing course", () => {
    const store = renderCourseManager();

    addCourse();

    fireEvent.click(screen.getByRole("button", { name: /edit CSC 401/i }));

    expect(
      screen.getByRole("heading", { name: "Edit course" }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/course title/i), {
      target: { value: "Advanced Software Engineering" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    const courses =
      store.getState().academic.academicYears[0].semesters[0].courses;

    expect(courses).toHaveLength(1);
    expect(courses[0].title).toBe("Advanced Software Engineering");
    expect(
      screen.getByText("Advanced Software Engineering"),
    ).toBeInTheDocument();
  });

  it("cancels editing and resets the form", () => {
    renderCourseManager();

    addCourse();

    fireEvent.click(screen.getByRole("button", { name: /edit CSC 401/i }));

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(
      screen.getByRole("heading", { name: "Add a course" }),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/course code/i)).toHaveValue("");
    expect(
      screen.queryByRole("button", { name: /cancel/i }),
    ).not.toBeInTheDocument();
  });

  it("deletes a course", () => {
    const store = renderCourseManager();

    addCourse();

    fireEvent.click(screen.getByRole("button", { name: /delete CSC 401/i }));

    expect(
      store.getState().academic.academicYears[0].semesters[0].courses,
    ).toHaveLength(0);

    expect(
      screen.getByText(/no courses added to this semester yet/i),
    ).toBeInTheDocument();
  });

  it("switches academic level and resets the form", () => {
    renderCourseManager();

    fillCourseForm();

    fireEvent.change(screen.getByLabelText(/academic level/i), {
      target: { value: "200" },
    });

    expect(screen.getByPlaceholderText(/course code/i)).toHaveValue("");
    expect(screen.getByText(/200 Level · First Semester/i)).toBeInTheDocument();
  });

  it("calculates and displays the GPA for completed results", () => {
    renderCourseManager();

    addCourse({
      credits: "3",
      grade: "A",
      resultStatus: "completed",
    });

    expect(screen.getByText("5.00")).toBeInTheDocument();
  });
});
