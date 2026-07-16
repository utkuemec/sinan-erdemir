const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Minimal focus trap: wraps Tab/Shift+Tab inside `container` and calls
 * `onEscape` on Escape. Returns a cleanup function. Focus restoration is
 * the caller's job (save document.activeElement before opening).
 */
export function trapFocus(container: HTMLElement, onEscape: () => void): () => void {
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onEscape();
      return;
    }
    if (e.key !== "Tab") return;

    const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && (active === first || !container.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !container.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("keydown", handleKeydown, true);
  return () => document.removeEventListener("keydown", handleKeydown, true);
}
