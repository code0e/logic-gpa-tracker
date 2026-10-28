import { gradePoints } from "./gradePoints";

// ===== SEMESTER GPA CALCULATION =====
export function calculateGPA(courses = [], includeExpected = false) {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
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

  return totalCredits === 0 ? null : totalPoints / totalCredits;
}
