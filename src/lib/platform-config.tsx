import { createContext, useContext, useState, type ReactNode } from "react";

export type FlagKey = "a1c" | "lowTIR" | "gmi" | "dd" | "dka";
export type FlagVisibility = { clinician: boolean; patient: boolean };

export type PlatformConfig = {
  chatEnabled: boolean;
  flags: Record<FlagKey, FlagVisibility>;
  accordionCols: { hospitalVisits: boolean; pendingForms: boolean; pendingTasks: boolean };
};

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  chatEnabled: true,
  flags: {
    a1c:    { clinician: true,  patient: true  },
    lowTIR: { clinician: true,  patient: true  },
    gmi:    { clinician: true,  patient: false },
    dd:     { clinician: true,  patient: true  },
    dka:    { clinician: true,  patient: false },
  },
  accordionCols: { hospitalVisits: true, pendingForms: true, pendingTasks: true },
};

type Ctx = {
  config: PlatformConfig;
  setConfig: (c: PlatformConfig) => void;
};

const PlatformConfigContext = createContext<Ctx | null>(null);

export function PlatformConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PlatformConfig>(DEFAULT_PLATFORM_CONFIG);
  return (
    <PlatformConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </PlatformConfigContext.Provider>
  );
}

export function usePlatformConfig(): Ctx {
  const ctx = useContext(PlatformConfigContext);
  if (!ctx) return { config: DEFAULT_PLATFORM_CONFIG, setConfig: () => {} };
  return ctx;
}
