import { createFileRoute } from "@tanstack/react-router";
import { Page, H, Body, StepBar, PrimaryButton, BackLink, RestartLink, WF_MID, WF_DARK, WF_LIGHT } from "@/components/wireframe";
import type { ReactNode } from "react";

export const Route = createFileRoute("/complete")({ component: Screen6A });

function SummaryRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: 15, color: WF_DARK }}>
      {icon}
      <span>{children}</span>
    </div>
  );
}

const ico = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: WF_DARK, strokeWidth: 1.5 } as const;

function Screen6A() {
  return (
    <Page>
      <StepBar states={["done", "done", "done"]} />
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", border: `1.5px solid ${WF_DARK}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={WF_DARK} strokeWidth="2">
              <polyline points="5 12 10 17 19 8" />
            </svg>
          </div>
        </div>
        <H>You're all set, Sarah.</H>
        <Body>
          Your account is ready and 2-step verification is active. You'll be asked for a verification code each time you sign in.
        </Body>
      </div>
      <div style={{ background: WF_LIGHT, border: `1px solid ${WF_MID}`, padding: "8px 14px", margin: "8px 0 16px" }}>
        <SummaryRow icon={<svg {...ico}><rect x="4" y="3" width="16" height="18" /><line x1="9" y1="7" x2="9" y2="7" /><line x1="15" y1="7" x2="15" y2="7" /><line x1="9" y1="12" x2="9" y2="12" /><line x1="15" y1="12" x2="15" y2="12" /></svg>}>
          BC Children's Hospital
        </SummaryRow>
        <SummaryRow icon={<svg {...ico}><rect x="3" y="5" width="18" height="14" /><polyline points="3 7 12 13 21 7" /></svg>}>
          sarah.roberts@bcchildrens.ca
        </SummaryRow>
        <SummaryRow icon={<svg {...ico}><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" /><polyline points="9 12 11 14 15 10" /></svg>}>
          2-step verification active
        </SummaryRow>
      </div>
      <PrimaryButton to="/admin">Go to Admin section</PrimaryButton>
      <BackLink to="/verify-method" />
      <RestartLink />
    </Page>
  );
}
