import { createContext, useContext, useState, type ReactNode } from "react";

export type ClinicianModules = {
  patientData: string[];
  clinicalActions: string[];
};

export const DEFAULT_CLINICIAN_MODULES: ClinicianModules = {
  patientData: ["glucose", "insulin", "labs", "completedForms", "appointments", "completedTasks"],
  clinicalActions: ["recommendations", "resources", "assignedForms", "assignedTasks"],
};

type Ctx = {
  clinicianModules: ClinicianModules;
  setClinicianModules: (m: ClinicianModules) => void;
};

const DashboardTemplateContext = createContext<Ctx | null>(null);

export function DashboardTemplateProvider({ children }: { children: ReactNode }) {
  const [clinicianModules, setClinicianModules] = useState<ClinicianModules>(DEFAULT_CLINICIAN_MODULES);
  return (
    <DashboardTemplateContext.Provider value={{ clinicianModules, setClinicianModules }}>
      {children}
    </DashboardTemplateContext.Provider>
  );
}

export function useDashboardTemplate(): Ctx {
  const ctx = useContext(DashboardTemplateContext);
  if (!ctx) {
    // Fallback if provider missing (e.g. SSR pre-mount) — return defaults read-only.
    return {
      clinicianModules: DEFAULT_CLINICIAN_MODULES,
      setClinicianModules: () => {},
    };
  }
  return ctx;
}
