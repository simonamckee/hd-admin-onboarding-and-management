import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, H, Body, StepBar, PrimaryButton, WF_MID, WF_DARK, WF_LIGHT } from "@/components/wireframe";
import type { ReactNode } from "react";

export const Route = createFileRoute("/complete-skipped")({ component: Screen6B });

function SummaryRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: 13, color: WF_DARK }}>
      {icon}
      <span>{children}</span>
    </div>
  );
}

const ico = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: WF_DARK, strokeWidth: 1.5 } as const;

function Screen6B() {
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
          Your account is ready. You can add 2-step verification at any time from My Profile → Security.
        </Body>
      </div>
      <div style={{ background: WF_LIGHT, border: `1px solid ${WF_MID}`, padding: "8px 14px", margin: "8px 0 16px" }}>
        <SummaryRow icon={<svg {...ico}><rect x="4" y="3" width="16" height="18" /></svg>}>
          BC Children's Hospital
        </SummaryRow>
        <SummaryRow icon={<svg {...ico}><rect x="3" y="5" width="18" height="14" /><polyline points="3 7 12 13 21 7" /></svg>}>
          sarah.roberts@bcchildrens.ca
        </SummaryRow>
        <SummaryRow
          icon={
            <svg {...ico}>
              <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
              <line x1="5" y1="5" x2="19" y2="19" />
            </svg>
          }
        >
          2-step verification not set up —{" "}
          <Link to="/verify-method" style={{ color: WF_DARK, textDecoration: "underline" }}>
            set up now
          </Link>
        </SummaryRow>
      </div>
      <PrimaryButton to="/admin">Go to Admin section</PrimaryButton>
    </Page>
  );
}
