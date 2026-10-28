import { gradePoints } from "./gradePoints";

// ===== CUMULATIVE GPA CALCULATION =====
export function calculateCGPA(
  academicYears = [],
  maxLevel = 400,
  includeExpected = false,
) {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const year of academicYears) {
    if (Number(year.level) > Number(maxLevel)) {
      continue;
    }

    for (const semester of year.semesters ?? []) {
      for (const course of semester.courses ?? []) {
        const status = course.resultStatus ?? "completed";

        if (!includeExpected && status !== "completed") {
          continue;
        }

        const credits = Number(course.creditUnits);
        const points = gradePoints[course.grade];

        if (points === undefined || !Number.isFinite(credits) || credits <= 0) {
          continue;
        }

        totalPoints += points * credits;
        totalCredits += credits;
      }
    }
  }

  return totalCredits === 0 ? null : totalPoints / totalCredits;
}
