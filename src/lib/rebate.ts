export type DonationAmountError = "required" | "invalid" | "below-minimum" | "above-limit";

export type DonationAmountResult =
  | { ok: true; amount: number }
  | { ok: false; error: DonationAmountError };

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Parse a currency input without accepting negatives or fractions of a cent. */
export function parseDonationAmount(
  raw: string,
  minimum: number,
  contributionLimit: number,
): DonationAmountResult {
  const value = raw.trim();
  if (!value) return { ok: false, error: "required" };
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) return { ok: false, error: "invalid" };

  const amount = Number(value);
  if (!Number.isFinite(amount)) return { ok: false, error: "invalid" };
  if (amount < minimum) return { ok: false, error: "below-minimum" };
  if (amount > contributionLimit) return { ok: false, error: "above-limit" };

  return { ok: true, amount: roundCurrency(amount) };
}

/**
 * City of Toronto 2026 Contribution Rebate Program estimate.
 * The City's calculation is based on a contributor's total contributions to
 * all participating candidates; callers must present this as an estimate.
 */
export function calculateContributionRebate(
  totalContribution: number,
  rebateMaximum = 1000,
): number {
  if (!Number.isFinite(totalContribution) || totalContribution <= 25) return 0;

  let rebate: number;
  if (totalContribution <= 300) {
    rebate = totalContribution * 0.75;
  } else if (totalContribution <= 1000) {
    rebate = (totalContribution - 300) * 0.5 + 225;
  } else {
    rebate = (totalContribution - 1000) / 3 + 575;
  }

  return roundCurrency(Math.min(rebate, rebateMaximum));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
