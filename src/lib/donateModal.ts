type Listener = (open: boolean) => void;

const listeners = new Set<Listener>();

export function openDonateModal() {
  listeners.forEach((l) => l(true));
}

export function closeDonateModal() {
  listeners.forEach((l) => l(false));
}

export function subscribeDonateModal(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
