import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourse,
  deleteCourse,
  updateCourse,
} from "../features/academic/academicSlice";
import { calculateGPA } from "../utils/calculateGPA";

// ===== REUSABLE STYLES =====
const fieldClass =
  "w-full rounded-lg border border-white/10 bg-[#111] px-3 py-3 text-sm text-white outline-none focus:border-[#39ff88]";

const buttonClass =
  "rounded-lg bg-[#39ff88] px-4 py-3 font-semibold text-black transition hover:bg-[#24e875]";

const gradeColors = {
  A: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  B: "border-green-500/30 bg-green-500/15 text-green-400",
  C: "border-yellow-500/30 bg-yellow-500/15 text-yellow-400",
  D: "border-orange-500/30 bg-orange-500/15 text-orange-400",
  E: "border-orange-600/30 bg-orange-600/15 text-orange-500",
  F: "border-red-500/40 bg-red-500/15 text-red-400",
};

// ===== COURSE MANAGER =====
export default function CourseManager() {
  const dispatch = useDispatch();
  const { academicYears } = useSelector((state) => state.academic);

  const [yearLevel, setYearLevel] = useState(100);
  const [semesterId, setSemesterId] = useState("100-first");
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [creditUnits, setCreditUnits] = useState("0");
  const [grade, setGrade] = useState("A");
  const [resultStatus, setResultStatus] = useState("completed");
  const [courseType, setCourseType] = useState("regular");
  const [error, setError] = useState("");
  const [editingCourseId, setEditingCourseId] = useState(null);

  const selectedYear = academicYears.find((year) => year.level === yearLevel);

  const selectedSemester = selectedYear?.semesters.find(
    (semester) => semester.id === semesterId,
  );

  const courses = selectedSemester?.courses ?? [];
  const semesterGPA = calculateGPA(courses);
  const isEditing = editingCourseId !== null;

  // ===== RESET FORM =====
  function resetForm() {
    setCourseCode("");
    setCourseTitle("");
    setCreditUnits("0");
    setGrade("A");
    setResultStatus("completed");
    setCourseType("regular");
    setEditingCourseId(null);
    setError("");
  }

  // ===== CHANGE SEMESTER =====
  function handleYearChange(value) {
    const level = Number(value);

    setYearLevel(level);
    setSemesterId(`${level}-first`);
    resetForm();
  }

  function handleSemesterChange(value) {
    setSemesterId(value);
    resetForm();
  }

  // ===== ADD OR UPDATE COURSE =====
  function handleSubmit(event) {
    event.preventDefault();

    const credits = Number(creditUnits);

    if (!courseCode.trim() || !courseTitle.trim()) {
      setError("Enter both the course code and course title.");
      return;
    }

    if (
      creditUnits.trim() === "" ||
      !Number.isInteger(credits) ||
      credits < 0
    ) {
      setError("Credit units must be a whole number of zero or more.");
      return;
    }

    const course = {
      code: courseCode.trim().toUpperCase(),
      title: courseTitle.trim(),
      creditUnits: credits,
      grade,
      resultStatus,
      courseType,
    };

    if (isEditing) {
      dispatch(
        updateCourse({
          yearLevel,
          semesterId,
          courseId: editingCourseId,
          updates: course,
        }),
      );
    } else {
      dispatch(
        addCourse({
          yearLevel,
          semesterId,
          course: {
            id: crypto.randomUUID(),
            ...course,
          },
        }),
      );
    }

    resetForm();
  }

  // ===== START EDITING =====
  function handleEdit(course) {
    setEditingCourseId(course.id);
    setCourseCode(course.code);
    setCourseTitle(course.title);
    setCreditUnits(String(course.creditUnits));
    setGrade(course.grade);
    setResultStatus(course.resultStatus ?? "completed");
    setCourseType(course.courseType ?? "regular");
    setError("");

    document
      .getElementById("course-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ===== DELETE COURSE =====
  function handleDelete(courseId) {
    dispatch(deleteCourse({ yearLevel, semesterId, courseId }));

    if (editingCourseId === courseId) {
      resetForm();
    }
  }

  return (
    <section id="courses" className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#39ff88]">
          Academic records
        </p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Course Manager</h2>
        <p className="mt-2 text-sm text-white/50">
          Add, edit, and track your semester performance.
        </p>
      </div>

      {/* ===== SEMESTER SELECTORS ===== */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-white/60">
          Academic level
          <select
            className={fieldClass}
            value={yearLevel}
            onChange={(event) => handleYearChange(event.target.value)}
          >
            {[100, 200, 300, 400].map((level) => (
              <option key={level} value={level}>
                {level} Level
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-white/60">
          Semester
          <select
            className={fieldClass}
            value={semesterId}
            onChange={(event) => handleSemesterChange(event.target.value)}
          >
            {selectedYear?.semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* ===== ADD / EDIT COURSE FORM ===== */}
      <form
        id="course-form"
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-white/10 bg-[#101010] p-5 sm:p-6"
      >
        <h3 className="text-lg font-semibold">
          {isEditing ? "Edit course" : "Add a course"}
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className={fieldClass}
            placeholder="Course code (e.g. CSC 401)"
            value={courseCode}
            onChange={(event) => setCourseCode(event.target.value)}
          />

          <input
            className={fieldClass}
            placeholder="Course title"
            value={courseTitle}
            onChange={(event) => setCourseTitle(event.target.value)}
          />

          <label className="space-y-2 text-sm text-white/60">
            Credit units
            <input
              className={fieldClass}
              type="number"
              min="0"
              step="1"
              value={creditUnits}
              onChange={(event) => setCreditUnits(event.target.value)}
            />
          </label>

          <label className="space-y-2 text-sm text-white/60">
            Grade
            <select
              className={fieldClass}
              value={grade}
              onChange={(event) => setGrade(event.target.value)}
            >
              {["A", "B", "C", "D", "E", "F"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-white/60">
            Result status
            <select
              className={fieldClass}
              value={resultStatus}
              onChange={(event) => setResultStatus(event.target.value)}
            >
              <option value="completed">Completed result</option>
              <option value="expected">Expected result</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-white/60">
            Course type
            <select
              className={fieldClass}
              value={courseType}
              onChange={(event) => setCourseType(event.target.value)}
            >
              <option value="regular">Regular course</option>
              <option value="carryover">Carryover</option>
              <option value="repeated">Repeated course</option>
            </select>
          </label>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="submit" className={buttonClass}>
            {isEditing ? "Save changes" : "+ Add course"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/15 px-4 py-3 text-sm text-white/70 transition hover:bg-white/5"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ===== SEMESTER SUMMARY ===== */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#39ff88]/20 bg-[#39ff88]/5 p-5">
        <div>
          <p className="text-sm text-white/50">Selected semester</p>
          <h3 className="mt-1 font-semibold">
            {yearLevel} Level · {selectedSemester?.name}
          </h3>
          <p className="mt-1 text-sm text-white/50">
            {courses.length} course{courses.length === 1 ? "" : "s"}
          </p>
        </div>

        <div>
          <p className="text-sm text-white/50">Completed-results GPA</p>
          <p className="text-3xl font-bold text-[#39ff88]">
            {semesterGPA == null ? "--" : semesterGPA.toFixed(2)}
          </p>
        </div>
      </div>

      {/* ===== COURSE LIST ===== */}
      <div className="space-y-3">
        {courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-white/40">
            No courses added to this semester yet.
          </div>
        ) : (
          courses.map((course) => (
            <article
              key={course.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#101010] p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold">{course.code}</h4>

                  <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-white/60">
                    {course.creditUnits} CU
                  </span>

                  {course.resultStatus === "expected" && (
                    <span className="rounded-full bg-amber-400/10 px-2 py-1 text-xs text-amber-300">
                      Expected
                    </span>
                  )}

                  {course.courseType === "carryover" && (
                    <span className="rounded-full bg-red-400/10 px-2 py-1 text-xs text-red-300">
                      Carryover
                    </span>
                  )}

                  {course.courseType === "repeated" && (
                    <span className="rounded-full bg-purple-400/10 px-2 py-1 text-xs text-purple-300">
                      Repeated
                    </span>
                  )}
                </div>

                <p className="mt-1 break-words text-sm text-white/50">
                  {course.title}
                </p>
              </div>

              {/* Grade, Edit, and Delete aligned in one row */}
              <div className="flex shrink-0 items-center gap-2">
                <span
                  title={`Grade ${course.grade}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold ${
                    gradeColors[course.grade] ??
                    "border-white/10 bg-white/5 text-white/60"
                  }`}
                >
                  {course.grade}
                </span>

                <button
                  type="button"
                  onClick={() => handleEdit(course)}
                  className="rounded-lg px-3 py-2 text-sm text-[#39ff88] transition hover:bg-[#39ff88]/10"
                  aria-label={`Edit ${course.code}`}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(course.id)}
                  className="rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-400/10"
                  aria-label={`Delete ${course.code}`}
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
