import { beforeEach, describe, expect, it, vi } from "vitest";

const STORAGE_KEY = "logic-gpa-tracker";

describe("Redux store persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it("starts with the default academic state when nothing is saved", async () => {
    const { store } = await import("./store");

    expect(store.getState().academic.gradingScale).toBe(5);
    expect(store.getState().academic.currentLevel).toBe(400);
    expect(store.getState().academic.academicYears).toHaveLength(4);
  });

  it("saves Redux state changes to localStorage", async () => {
    const { store } = await import("./store");
    const { setCurrentLevel } =
      await import("../features/academic/academicSlice");

    store.dispatch(setCurrentLevel(300));

    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));

    expect(savedData.currentLevel).toBe(300);
  });

  it("restores saved academic state when the store loads", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentLevel: 200,
        targetClass: "Second Class Upper",
      }),
    );

    const { store } = await import("./store");

    expect(store.getState().academic.currentLevel).toBe(200);
    expect(store.getState().academic.targetClass).toBe("Second Class Upper");
  });

  it("falls back to initial state when saved JSON is invalid", async () => {
    localStorage.setItem(STORAGE_KEY, "{invalid json");

    const { store } = await import("./store");

    expect(store.getState().academic.currentLevel).toBe(400);
    expect(store.getState().academic.academicYears).toHaveLength(4);
  });

  it("uses default academic years when saved academicYears is malformed", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentLevel: 200,
        academicYears: "not an array",
      }),
    );

    const { store } = await import("./store");

    expect(store.getState().academic.currentLevel).toBe(200);
    expect(store.getState().academic.academicYears).toHaveLength(4);
  });
});
