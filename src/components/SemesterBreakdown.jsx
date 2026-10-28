import { useSelector } from "react-redux";
import { calculateGPA } from "../utils/calculateGPA";

function SemesterBreakdown() {
  const {
    academicYears,
    currentLevel = 400,
    gradingScale,
  } = useSelector((state) => state.academic);

  const semesterResults = academicYears
    .filter((year) => Number(year.level) <= Number(currentLevel))
    .flatMap((year) =>
      year.semesters.map((semester) => {
        const completedCourses = semester.courses.filter(
          (course) => (course.resultStatus ?? "completed") === "completed",
        );

        return {
          label: `${year.level} Level · ${
            semester.name.startsWith("First") ? "First" : "Second"
          } Semester`,
          gpa: calculateGPA(completedCourses),
          courseCount: completedCourses.length,
        };
      }),
    );

  return (
    <section className="mt-12">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
          Your academic history
        </p>

        <h2 className="mt-2 text-2xl font-black sm:text-3xl">
          Semester breakdown
          <span className="text-[#39ff88]">.</span>
        </h2>
      </div>

      {semesterResults.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#111] p-6 text-sm leading-7 text-gray-400">
          Your semester breakdown will appear here when your academic semesters
          are available.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {semesterResults.map((semester) => (
            <article
              key={semester.label}
              className="rounded-2xl border border-white/10 bg-[#111] p-6 transition hover:border-[#39ff88]/30"
            >
              <p className="text-sm font-medium text-gray-400">
                {semester.label}
              </p>

              <p className="mt-4 text-3xl font-black text-[#39ff88]">
                {semester.gpa == null ? "--" : semester.gpa.toFixed(2)}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Semester GPA · {gradingScale}.00 scale
              </p>

              <p className="mt-1 text-xs text-gray-600">
                {semester.courseCount} completed{" "}
                {semester.courseCount === 1 ? "course" : "courses"}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default SemesterBreakdown;
