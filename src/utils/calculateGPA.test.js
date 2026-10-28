import { describe, expect, it } from "vitest";
import { calculateGPA } from "./calculateGPA";

describe("calculateGPA", () => {
  it("calculates GPA using course credit units", () => {
    const courses = [
      { grade: "A", creditUnits: 3 },
      { grade: "B", creditUnits: 2 },
    ];

    // (5 × 3 + 4 × 2) / (3 + 2) = 4.6
    expect(calculateGPA(courses)).toBeCloseTo(4.6);
  });

  it("returns null when there are no courses", () => {
    expect(calculateGPA([])).toBeNull();
  });

  it("returns null when no valid credits are available", () => {
    const courses = [{ grade: "A", creditUnits: 0 }];

    expect(calculateGPA(courses)).toBeNull();
  });

  it("includes completed courses by default", () => {
    const courses = [
      { grade: "A", creditUnits: 3, resultStatus: "completed" },
      { grade: "F", creditUnits: 3, resultStatus: "expected" },
    ];

    expect(calculateGPA(courses)).toBe(5);
  });

  it("includes expected courses when requested", () => {
    const courses = [
      { grade: "A", creditUnits: 3, resultStatus: "completed" },
      { grade: "B", creditUnits: 3, resultStatus: "expected" },
    ];

    expect(calculateGPA(courses, true)).toBe(4.5);
  });

  it("treats a missing resultStatus as completed", () => {
    expect(calculateGPA([{ grade: "B", creditUnits: 4 }])).toBe(4);
  });

  it("ignores invalid grades and invalid credit units", () => {
    const courses = [
      { grade: "X", creditUnits: 3 },
      { grade: "A", creditUnits: -2 },
      { grade: "B", creditUnits: "invalid" },
      { grade: "C", creditUnits: 2 },
    ];

    expect(calculateGPA(courses)).toBe(3);
  });

  it("accepts credit units provided as numeric strings", () => {
    expect(calculateGPA([{ grade: "A", creditUnits: "3" }])).toBe(5);
  });

  it("calculates an F grade as zero grade points", () => {
    expect(calculateGPA([{ grade: "F", creditUnits: 3 }])).toBe(0);
  });

  it("returns null when all courses are excluded", () => {
    const courses = [{ grade: "A", creditUnits: 3, resultStatus: "expected" }];

    expect(calculateGPA(courses)).toBeNull();
  });
});
