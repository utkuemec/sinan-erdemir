import { useEffect, useRef, useState } from "react";
import { Copy, Check, Landmark } from "lucide-react";
import { toast } from "sonner";
import { candidate } from "@/config/candidate";
import { getStrings } from "@/config/strings";
import { formatCurrency } from "@/lib/rebate";

const t = getStrings(candidate.locale);
const d = t.donatePage;
const ETRANSFER_EMAIL = candidate.integrations.etransferEmail;

interface EtransferInstructionsProps {
  /** Amount chosen in the page's picker; shown as "Amount to send" when set. */
  amount: number | null;
}

/**
 * Interac e-Transfer instructions, shown as soon as the donor opens the
 * e-transfer option — before any form. The callout states plainly that the
 * donor sends the money from their own bank; the campaign cannot take the
 * payment from this page. (Previously these steps only appeared AFTER the
 * donor submitted a contact form, which the client flagged as confusing.)
 */
export function EtransferInstructions({ amount }: EtransferInstructionsProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the "Copied" timer if the panel closes mid-countdown.
  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(ETRANSFER_EMAIL);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.donateModal.copyError);
    }
  }

  return (
    <div className="donate-instructions">
      <h3 className="donate-instructions__title">{t.donateModal.instructionsTitle}</h3>

      <div className="donate-callout">
        <span className="donate-callout__icon" aria-hidden="true">
          <Landmark size={20} />
        </span>
        <div>
          <p className="donate-callout__title">{d.bankCalloutTitle}</p>
          <p className="donate-callout__body">{d.bankCalloutBody}</p>
        </div>
      </div>

      {amount !== null && (
        <p className="donate-instructions__amount">
          {t.donateModal.instructionsAmount(formatCurrency(amount))}
        </p>
      )}

      <div className="donate-instructions__email-row">
        <span className="donate-instructions__email">{ETRANSFER_EMAIL}</span>
        <button
          type="button"
          className="donate-instructions__copy"
          onClick={handleCopy}
          aria-label={t.donateModal.copyAria}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? t.donateModal.copied : t.donateModal.copy}
        </button>
      </div>

      <ol className="donate-instructions__steps">
        <li>{t.donateModal.step1}</li>
        <li>
          {t.donateModal.step2Prefix} <strong>{ETRANSFER_EMAIL}</strong>.
        </li>
        <li>{t.donateModal.step3}</li>
        <li>{t.donateModal.step4}</li>
      </ol>
    </div>
  );
}
