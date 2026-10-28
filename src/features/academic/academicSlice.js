import { createSlice } from "@reduxjs/toolkit";

// ===== ACADEMIC DATA FACTORIES =====
const createSemester = (id, name) => ({
  id,
  name,
  courses: [],
});

const createAcademicYear = (level) => ({
  level,
  semesters: [
    createSemester(`${level}-first`, "First Semester"),
    createSemester(`${level}-second`, "Second Semester"),
  ],
});

// ===== INITIAL STATE =====
export const initialState = {
  gradingScale: 5,
  currentLevel: 400,
  targetClass: "First Class",
  academicYears: [100, 200, 300, 400].map(createAcademicYear),
};

// ===== ACADEMIC SLICE =====
const academicSlice = createSlice({
  name: "academic",
  initialState,

  reducers: {
    // ===== ADD COURSE =====
    addCourse: (state, action) => {
      const { yearLevel, semesterId, course } = action.payload;

      const semester = state.academicYears
        .find((year) => year.level === Number(yearLevel))
        ?.semesters.find((item) => item.id === semesterId);

      if (semester) {
        semester.courses.push({
          ...course,
          creditUnits: Number(course.creditUnits),
          resultStatus: course.resultStatus ?? "completed",
          courseType: course.courseType ?? "regular",
        });
      }
    },

    // ===== UPDATE COURSE =====
    updateCourse: (state, action) => {
      const { yearLevel, semesterId, courseId, updates } = action.payload;

      const semester = state.academicYears
        .find((year) => year.level === Number(yearLevel))
        ?.semesters.find((item) => item.id === semesterId);

      const course = semester?.courses.find((item) => item.id === courseId);

      if (course) {
        Object.assign(course, {
          ...updates,
          creditUnits: Number(updates.creditUnits),
        });
      }
    },

    // ===== DELETE COURSE =====
    deleteCourse: (state, action) => {
      const { yearLevel, semesterId, courseId } = action.payload;

      const semester = state.academicYears
        .find((year) => year.level === Number(yearLevel))
        ?.semesters.find((item) => item.id === semesterId);

      if (semester) {
        semester.courses = semester.courses.filter(
          (course) => course.id !== courseId,
        );
      }
    },

    // ===== UPDATE TARGET CLASS =====
    setTargetClass: (state, action) => {
      state.targetClass = action.payload;
    },

    // ===== UPDATE CURRENT LEVEL =====
    setCurrentLevel: (state, action) => {
      state.currentLevel = Number(action.payload);
    },
  },
});

// ===== EXPORT ACTIONS =====
export const {
  addCourse,
  updateCourse,
  deleteCourse,
  setTargetClass,
  setCurrentLevel,
} = academicSlice.actions;

export default academicSlice.reducer;
