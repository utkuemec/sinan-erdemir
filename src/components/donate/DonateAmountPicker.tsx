import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import { calculateContributionRebate, formatCurrency, parseDonationAmount } from "@/lib/rebate";

const t = getStrings(candidate.locale);

interface DonateAmountPickerProps {
  selectedAmount: number | null;
  customAmount: string;
  amountError: string;
  onSelectPreset: (amount: number) => void;
  onCustomChange: (value: string) => void;
  /** Distinguishes DOM ids when more than one picker is mounted. */
  idPrefix?: string;
}

/**
 * Controlled contribution-amount chooser (chips + custom input) with a live
 * City-of-Toronto rebate estimate. Shared by the /donate page. The parent
 * owns the amount state so the same value can feed the payment options.
 * The rebate block is gated on features.rebateCalculator (official-agent
 * sign-off) and simply disappears when that flag is off.
 */
export function DonateAmountPicker({
  selectedAmount,
  customAmount,
  amountError,
  onSelectPreset,
  onCustomChange,
  idPrefix = "donate",
}: DonateAmountPickerProps) {
  const amountInput = customAmount || (selectedAmount === null ? "" : String(selectedAmount));
  const parsed = parseDonationAmount(
    amountInput,
    candidate.donations.minimumAmount,
    candidate.donations.contributionLimit,
  );
  const activeAmount = parsed.ok ? parsed.amount : null;
  const rebate =
    activeAmount !== null && candidate.features.rebateCalculator
      ? calculateContributionRebate(activeAmount, candidate.donations.rebateMaximum)
      : null;

  return (
    <fieldset className="donate-amount">
      <legend>{t.donateModal.amountLegend}</legend>
      <div className="donate-amount__presets">
        {candidate.donations.presetAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            className="donate-amount__chip"
            aria-pressed={selectedAmount === amount && customAmount === ""}
            onClick={() => onSelectPreset(amount)}
          >
            {formatCurrency(amount).replace(".00", "")}
          </button>
        ))}
      </div>

      {candidate.donations.allowCustomAmount && (
        <label className="donate-amount__custom" htmlFor={`${idPrefix}-other-amount`}>
          <span>{t.donateModal.otherAmountLabel}</span>
          <span className="donate-amount__input-wrap">
            <span aria-hidden="true">$</span>
            <input
              id={`${idPrefix}-other-amount`}
              name={`${idPrefix}-other-amount`}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder={t.donateModal.otherAmountPlaceholder}
              value={customAmount}
              aria-describedby={`${idPrefix}-amount-help ${idPrefix}-amount-error`}
              aria-invalid={Boolean(amountError)}
              onChange={(event) => onCustomChange(event.target.value)}
            />
          </span>
        </label>
      )}

      <p id={`${idPrefix}-amount-help`} className="donate-amount__help">
        {t.donateModal.amountAboveLimit(candidate.donations.contributionLimit)}
      </p>
      <p id={`${idPrefix}-amount-error`} className="donate-amount__error" aria-live="polite">
        {amountError}
      </p>

      {rebate !== null && activeAmount !== null && (
        <div className="donate-rebate" aria-live="polite">
          <strong>{t.donatePage.yourDonation(formatCurrency(activeAmount))}</strong>
          <strong>{t.donateModal.rebateEstimate(formatCurrency(rebate))}</strong>
          <strong className="donate-rebate__cost">
            {t.donatePage.costAfterRebate(formatCurrency(activeAmount - rebate))}
          </strong>
          <p>
            {t.donateModal.rebateDisclaimerBeforeLink}
            <a href={candidate.donations.rebateInfoUrl} target="_blank" rel="noopener noreferrer">
              {t.donateModal.rebateDisclaimerLink}
            </a>
            {t.donateModal.rebateDisclaimerAfterLink}
          </p>
        </div>
      )}
    </fieldset>
  );
}
