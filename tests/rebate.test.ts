import { describe, expect, test } from "bun:test";
import { calculateContributionRebate, parseDonationAmount } from "../src/lib/rebate";

describe("calculateContributionRebate", () => {
  test.each([
    [25, 0],
    [25.01, 18.76],
    [100, 75],
    [300, 225],
    [500, 325],
    [1000, 575],
    [1200, 641.67],
    [2275, 1000],
    [3000, 1000],
  ])("calculates the City estimate for $%s", (contribution, expected) => {
    expect(calculateContributionRebate(contribution)).toBe(expected);
  });
});

describe("parseDonationAmount", () => {
  test("accepts the configured bounds and preserves cents", () => {
    expect(parseDonationAmount("1", 1, 1200)).toEqual({ ok: true, amount: 1 });
    expect(parseDonationAmount("1199.99", 1, 1200)).toEqual({ ok: true, amount: 1199.99 });
    expect(parseDonationAmount("1200.00", 1, 1200)).toEqual({ ok: true, amount: 1200 });
  });

  test("rejects empty, malformed, fractional-cent, and out-of-range values", () => {
    expect(parseDonationAmount("", 1, 1200)).toEqual({ ok: false, error: "required" });
    expect(parseDonationAmount("abc", 1, 1200)).toEqual({ ok: false, error: "invalid" });
    expect(parseDonationAmount("1.001", 1, 1200)).toEqual({ ok: false, error: "invalid" });
    expect(parseDonationAmount("0.99", 1, 1200)).toEqual({
      ok: false,
      error: "below-minimum",
    });
    expect(parseDonationAmount("1200.01", 1, 1200)).toEqual({
      ok: false,
      error: "above-limit",
    });
  });
});
