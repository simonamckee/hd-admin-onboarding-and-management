import { createFileRoute } from "@tanstack/react-router";
import { Page, H, Body, StepBar, PrimaryButton, SecondaryButton, FieldLabel, BackLink, WF_MID, WF_DARK } from "@/components/wireframe";

export const Route = createFileRoute("/patient/sms-phone")({ component: PatientSmsPhone });

function PatientSmsPhone() {
  return (
    <Page>
      <StepBar states={["done", "done", "active"]} />
      <H>Add your phone number</H>
      <Body>We'll send a verification code to this number each time you sign in.</Body>

      <FieldLabel>Phone number</FieldLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div
          style={{
            width: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            border: `1px solid ${WF_MID}`,
            fontSize: 16,
            color: WF_DARK,
            background: "#fff",
          }}
        >
          +1
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={WF_DARK} strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <div
          style={{
            flex: 1,
            padding: "10px 12px",
            border: `1px solid ${WF_DARK}`,
            fontSize: 16,
            color: WF_DARK,
            background: "#fff",
          }}
        >
          604 555 0123
        </div>
      </div>
      <div style={{ fontSize: 14, color: WF_MID, marginBottom: 16 }}>
        Standard messaging rates may apply.{" "}
        <span style={{ textDecoration: "underline", color: WF_DARK }}>View privacy policy</span>
      </div>

      <PrimaryButton to="/patient/sms-verify">Send verification code</PrimaryButton>
      <SecondaryButton to="/patient/verify-method">Go back</SecondaryButton>
      <BackLink to="/patient/verify-method" />
    </Page>
  );
}
