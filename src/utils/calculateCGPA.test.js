import { describe, expect, it } from "vitest";
import { calculateCGPA } from "./calculateCGPA";

describe("calculateCGPA", () => {
  it("calculates CGPA across multiple academic years", () => {
    const academicYears = [
      {
        level: 100,
        semesters: [
          {
            courses: [
              { grade: "A", creditUnits: 3 },
              { grade: "B", creditUnits: 3 },
            ],
          },
        ],
      },
      {
        level: 200,
        semesters: [
          {
            courses: [{ grade: "C", creditUnits: 2 }],
          },
        ],
      },
    ];

    // (15 + 12 + 6) / (3 + 3 + 2) = 4.125
    expect(calculateCGPA(academicYears)).toBeCloseTo(4.125);
  });

  it("returns null when there are no academic years", () => {
    expect(calculateCGPA([])).toBeNull();
  });

  it("includes only years up to the selected maximum level", () => {
    const academicYears = [
      {
        level: 100,
        semesters: [{ courses: [{ grade: "A", creditUnits: 3 }] }],
      },
      {
        level: 200,
        semesters: [{ courses: [{ grade: "C", creditUnits: 3 }] }],
      },
    ];

    expect(calculateCGPA(academicYears, 100)).toBe(5);
  });

  it("excludes expected courses by default", () => {
    const academicYears = [
      {
        level: 100,
        semesters: [
          {
            courses: [
              { grade: "A", creditUnits: 3, resultStatus: "completed" },
              { grade: "F", creditUnits: 3, resultStatus: "expected" },
            ],
          },
        ],
      },
    ];

    expect(calculateCGPA(academicYears)).toBe(5);
  });

  it("includes expected courses when requested", () => {
    const academicYears = [
      {
        level: 100,
        semesters: [
          {
            courses: [
              { grade: "A", creditUnits: 3, resultStatus: "completed" },
              { grade: "B", creditUnits: 3, resultStatus: "expected" },
            ],
          },
        ],
      },
    ];

    expect(calculateCGPA(academicYears, 400, true)).toBe(4.5);
  });

  it("treats missing semesters and courses as empty arrays", () => {
    const academicYears = [
      { level: 100 },
      { level: 200, semesters: [{ id: "200-first" }] },
    ];

    expect(calculateCGPA(academicYears)).toBeNull();
  });

  it("ignores invalid grades and invalid credit units", () => {
    const academicYears = [
      {
        level: 100,
        semesters: [
          {
            courses: [
              { grade: "X", creditUnits: 3 },
              { grade: "A", creditUnits: -2 },
              { grade: "B", creditUnits: "invalid" },
              { grade: "C", creditUnits: 2 },
            ],
          },
        ],
      },
    ];

    expect(calculateCGPA(academicYears)).toBe(3);
  });

  it("uses level 400 as the default maximum level", () => {
    const academicYears = [
      {
        level: 400,
        semesters: [{ courses: [{ grade: "A", creditUnits: 3 }] }],
      },
      {
        level: 500,
        semesters: [{ courses: [{ grade: "F", creditUnits: 3 }] }],
      },
    ];

    expect(calculateCGPA(academicYears)).toBe(5);
  });
});
