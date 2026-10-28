import { describe, expect, it } from "vitest";
import { gradePoints } from "./gradePoints";

describe("gradePoints", () => {
  it("assigns the correct points to every grade", () => {
    expect(gradePoints).toEqual({
      A: 5,
      B: 4,
      C: 3,
      D: 2,
      E: 1,
      F: 0,
    });
  });

  it("contains exactly six grades", () => {
    expect(Object.keys(gradePoints)).toHaveLength(6);
  });
});
