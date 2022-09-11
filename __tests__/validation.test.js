const { isANumber, isPositiveInteger } = require("../utils/validation");

describe("Validation Tools", () => {
  describe("text is number", () => {
    test("returns true when text matches a single number", () => {
      expect(isANumber("1")).toBe(true);
      expect(isANumber("100")).toBe(true);
      expect(isANumber("112907474938")).toBe(true);
    });
    test("returns false when tect isnt only a number", () => {
      expect(isANumber("a")).toBe(false);
      expect(isANumber("a23")).toBe(false);
      expect(isANumber("$a")).toBe(false);
    });
  });
  describe("isPositiveInteger", () => {
    test("returns true when string is a positive integer", () => {
      expect(isPositiveInteger("1")).toBe(true);
      expect(isPositiveInteger("100")).toBe(true);
      expect(isPositiveInteger("134")).toBe(true);
    });
    test("returns false when string is not a positive integer", () => {
      expect(isPositiveInteger("0")).toBe(false);
      expect(isPositiveInteger("-1")).toBe(false);
      expect(isPositiveInteger("10.1")).toBe(false);
      expect(isPositiveInteger("NaN")).toBe(false);
    });
  });
});
