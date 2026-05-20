import { createFileRoute } from "@tanstack/react-router";
import { Page, H, Body, PrimaryButton, WF_MID, WF_DARK, WF_LIGHT } from "@/components/wireframe";

export const Route = createFileRoute("/expired")({ component: Screen1B });

function Screen1B() {
  return (
    <Page>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: WF_LIGHT,
            border: `1px solid ${WF_DARK}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={WF_DARK} strokeWidth="2">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <H size={18}>This invitation has expired.</H>
        <Body>
          The link you used is no longer valid. This can happen if the invitation expired or was already used.
        </Body>
      </div>
      <PrimaryButton href="mailto:support@haibudiabetes.com">Contact support</PrimaryButton>
      <div style={{ textAlign: "center", fontSize: 12, color: WF_MID, marginTop: 16 }}>
        Email us at <span style={{ color: WF_DARK }}>support@haibudiabetes.com</span> and we'll send a new invitation.
      </div>
    </Page>
  );
}
