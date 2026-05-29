// British Columbia Personal Health Number (PHN) helpers.
// Display format: DDDD DDD DDD (10 digits with two visual spaces).

export function phnDigits(v: string): string {
  return (v || "").replace(/\D/g, "").slice(0, 10);
}

export function formatPHN(v: string): string {
  const d = phnDigits(v);
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
}

export function phnLast4(v: string): string {
  return phnDigits(v).slice(-4) || "0000";
}

export function isValidPHN(v: string): boolean {
  return phnDigits(v).length === 10;
}

export const PHN_HELPER = "10-digit BC Personal Health Number";
export const PHN_LABEL = "Personal Health Number (PHN)";
export const PHN_LENGTH_ERROR =
  "Personal Health Number must be 10 digits (e.g., 1234 567 890)";
