import { describe, expect, it } from "vitest";
import { classificationThresholds } from "./academicConstants";

describe("classificationThresholds", () => {
  it("contains the expected classification thresholds", () => {
    expect(classificationThresholds).toEqual({
      "First Class": 4.5,
      "Second Class Upper": 3.5,
      "Second Class Lower": 2.4,
      "Third Class": 1.5,
    });
  });

  it("orders classifications from highest to lowest threshold", () => {
    const thresholds = Object.values(classificationThresholds);

    for (let index = 0; index < thresholds.length - 1; index++) {
      expect(thresholds[index]).toBeGreaterThan(thresholds[index + 1]);
    }
  });
});
