// Prototype-only in-memory store for the Add Patient flow.
// Persisted via sessionStorage so step navigation keeps data.

export type Supporter = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  channel: string;
};

export type PatientDraft = {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  diagnosisDate: string;
  healthNumber: string;
  invite: "yes" | "no";
  email: string;
  channel: string;
  phone: string;
  clinicians: string[];
  supporters: Supporter[];
};

const KEY = "haibu_patient_draft_v1";
const PERSIST_KEY = "haibu_patient_draft_persist_v1";

export const blankDraft: PatientDraft = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  diagnosisDate: "",
  healthNumber: "",
  invite: "yes",
  email: "",
  channel: "Email",
  phone: "",
  clinicians: [],
  supporters: [],
};

export function loadDraft(): PatientDraft {
  if (typeof window === "undefined") return blankDraft;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return blankDraft;
    return { ...blankDraft, ...JSON.parse(raw) };
  } catch {
    return blankDraft;
  }
}

export function saveDraft(d: PatientDraft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(d));
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

// Persisted draft (per-admin, survives browser sessions) — distinct from
// the transient sessionStorage used to carry data between steps.
export function loadPersistedDraft(): PatientDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return null;
    return { ...blankDraft, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function savePersistedDraft(d: PatientDraft) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PERSIST_KEY, JSON.stringify(d));
}

export function clearPersistedDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PERSIST_KEY);
}

export function hasPersistedDraft(): boolean {
  return loadPersistedDraft() !== null;
}

export function ageFromDob(dob: string): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}
