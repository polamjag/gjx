import { calculateBPM } from "./calculateBPM";

test("calculateBPM", () => {
  expect(calculateBPM([0, 1000, 2000, 3000])).toBe(60);
  expect(calculateBPM([0, 500, 1000, 1500, 2000])).toBe(120);
});
