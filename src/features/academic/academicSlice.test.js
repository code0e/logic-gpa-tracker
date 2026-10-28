import { describe, expect, it } from "vitest";
import academicReducer, {
  initialState,
  addCourse,
  updateCourse,
  deleteCourse,
  setTargetClass,
  setCurrentLevel,
} from "./academicSlice";

describe("academicSlice", () => {
  it("returns the initial state", () => {
    const state = academicReducer(undefined, { type: "unknown" });

    expect(state).toEqual(initialState);
    expect(state.academicYears).toHaveLength(4);
  });

  it("creates two semesters for every academic year", () => {
    for (const year of initialState.academicYears) {
      expect(year.semesters).toHaveLength(2);
    }
  });

  it("adds a course and converts credit units to a number", () => {
    const state = academicReducer(
      initialState,
      addCourse({
        yearLevel: 100,
        semesterId: "100-first",
        course: {
          id: "course-1",
          code: "CSC101",
          grade: "A",
          creditUnits: "3",
        },
      }),
    );

    const courses = state.academicYears[0].semesters[0].courses;

    expect(courses).toHaveLength(1);
    expect(courses[0].creditUnits).toBe(3);
    expect(courses[0].resultStatus).toBe("completed");
    expect(courses[0].courseType).toBe("regular");
  });

  it("preserves explicitly supplied course status and type", () => {
    const state = academicReducer(
      initialState,
      addCourse({
        yearLevel: 200,
        semesterId: "200-second",
        course: {
          id: "course-2",
          code: "CSC201",
          grade: "B",
          creditUnits: 2,
          resultStatus: "expected",
          courseType: "carryover",
        },
      }),
    );

    const courses = state.academicYears[1].semesters[1].courses;

    expect(courses[0].resultStatus).toBe("expected");
    expect(courses[0].courseType).toBe("carryover");
  });

  it("does nothing when adding a course to an unknown semester", () => {
    const state = academicReducer(
      initialState,
      addCourse({
        yearLevel: 100,
        semesterId: "unknown",
        course: { id: "course-3", creditUnits: 3 },
      }),
    );

    expect(state.academicYears[0].semesters[0].courses).toHaveLength(0);
  });

  it("updates an existing course", () => {
    const stateWithCourse = academicReducer(
      initialState,
      addCourse({
        yearLevel: 100,
        semesterId: "100-first",
        course: {
          id: "course-1",
          code: "CSC101",
          grade: "B",
          creditUnits: 3,
        },
      }),
    );

    const state = academicReducer(
      stateWithCourse,
      updateCourse({
        yearLevel: 100,
        semesterId: "100-first",
        courseId: "course-1",
        updates: { grade: "A", creditUnits: "4" },
      }),
    );

    const course = state.academicYears[0].semesters[0].courses[0];

    expect(course.grade).toBe("A");
    expect(course.creditUnits).toBe(4);
  });

  it("does nothing when updating a nonexistent course", () => {
    const state = academicReducer(
      initialState,
      updateCourse({
        yearLevel: 100,
        semesterId: "100-first",
        courseId: "missing",
        updates: { grade: "A", creditUnits: 3 },
      }),
    );

    expect(state.academicYears[0].semesters[0].courses).toHaveLength(0);
  });

  it("deletes a course", () => {
    const stateWithCourse = academicReducer(
      initialState,
      addCourse({
        yearLevel: 100,
        semesterId: "100-first",
        course: {
          id: "course-1",
          code: "CSC101",
          grade: "A",
          creditUnits: 3,
        },
      }),
    );

    const state = academicReducer(
      stateWithCourse,
      deleteCourse({
        yearLevel: 100,
        semesterId: "100-first",
        courseId: "course-1",
      }),
    );

    expect(state.academicYears[0].semesters[0].courses).toHaveLength(0);
  });

  it("does nothing when deleting from an unknown semester", () => {
    const state = academicReducer(
      initialState,
      deleteCourse({
        yearLevel: 100,
        semesterId: "unknown",
        courseId: "course-1",
      }),
    );

    expect(state.academicYears[0].semesters[0].courses).toHaveLength(0);
  });

  it("updates the target class", () => {
    const state = academicReducer(
      initialState,
      setTargetClass("Second Class Upper"),
    );

    expect(state.targetClass).toBe("Second Class Upper");
  });

  it("updates the current academic level as a number", () => {
    const state = academicReducer(initialState, setCurrentLevel("300"));

    expect(state.currentLevel).toBe(300);
  });
});
