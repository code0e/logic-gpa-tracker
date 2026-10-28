import { configureStore } from "@reduxjs/toolkit";
import academicReducer, {
  initialState,
} from "../features/academic/academicSlice";

// ===== LOCAL STORAGE =====
const STORAGE_KEY = "logic-gpa-tracker";

function loadAcademicState() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) return initialState;

    const parsedData = JSON.parse(savedData);

    return {
      ...initialState,
      ...parsedData,
      academicYears: Array.isArray(parsedData.academicYears)
        ? parsedData.academicYears
        : initialState.academicYears,
    };
  } catch {
    return initialState;
  }
}

// ===== REDUX STORE =====
export const store = configureStore({
  reducer: {
    academic: academicReducer,
  },
  preloadedState: {
    academic: loadAcademicState(),
  },
});

// ===== SAVE CHANGES =====
store.subscribe(() => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(store.getState().academic),
    );
  } catch {
    // The app can still run if browser storage is unavailable.
  }
});
