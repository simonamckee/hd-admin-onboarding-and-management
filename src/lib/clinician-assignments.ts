// Prototype-only mock data + in-memory state for clinician deactivation.

// Names of patients currently assigned to each clinician, by clinician id.
export const ASSIGNED_PATIENTS: Record<string, string[]> = {
  "sarah-chen": ["Lucas Okonkwo"],
  "james-okafor": ["Emma Tremblay", "Lucas Okonkwo", "Aiden Nakamura"],
  "priya-mehta": ["Sofia Andersen"],
  "lisa-bouchard": ["Lucas Fernandez"],
  "tom-park": [],
  "kevin-marsh": [],
};

// Patient id -> ids of patients in the patient list assigned to a clinician.
// Used by the patient list pre-filter chip.
export const CLINICIAN_TO_PATIENT_IDS: Record<string, string[]> = {
  "sarah-chen": ["lucas-okonkwo"],
  "james-okafor": ["emma-tremblay", "lucas-okonkwo", "aiden-nakamura"],
  "priya-mehta": ["sofia-andersen"],
  "lisa-bouchard": ["lucas-fernandez"],
  "tom-park": [],
  "kevin-marsh": [],
};

// In-memory set of deactivated clinician names. Reset on full reload.
const deactivated = new Set<string>();

export function deactivateClinician(name: string) {
  deactivated.add(name);
}

export function isClinicianDeactivated(name: string): boolean {
  return deactivated.has(name);
}

export function filterActiveClinicians(names: string[]): string[] {
  return names.filter((n) => !deactivated.has(n));
}
