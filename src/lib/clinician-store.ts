// Prototype-only persisted draft store for the individual Add Clinician form.

export type ClinicianDraft = {
  first: string;
  last: string;
  email: string;
  title: string;
  role: string;
};

export const blankClinicianDraft: ClinicianDraft = {
  first: "",
  last: "",
  email: "",
  title: "",
  role: "Clinician",
};

const PERSIST_KEY = "haibu_clinician_draft_persist_v1";

export function loadPersistedClinicianDraft(): ClinicianDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return null;
    return { ...blankClinicianDraft, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function savePersistedClinicianDraft(d: ClinicianDraft) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PERSIST_KEY, JSON.stringify(d));
}

export function clearPersistedClinicianDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PERSIST_KEY);
}

export function hasPersistedClinicianDraft(): boolean {
  return loadPersistedClinicianDraft() !== null;
}
