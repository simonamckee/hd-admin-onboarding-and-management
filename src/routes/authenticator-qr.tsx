import { createFileRoute } from "@tanstack/react-router";
import { Page, H, Body, StepBar, PrimaryButton, SecondaryButton, CopyIcon, BackLink, WF_MID, WF_DARK, WF_LIGHT } from "@/components/wireframe";

export const Route = createFileRoute("/authenticator-qr")({ component: Screen4A });

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          border: `1px solid ${WF_DARK}`,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          color: WF_DARK,
        }}
      >
        {n}
      </div>
      <div style={{ fontSize: 15, color: WF_DARK, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

function Screen4A() {
  return (
    <Page>
      <StepBar states={["done", "done", "done"]} />
      <H>Set up your authenticator app</H>
      <Body>Scan the QR code below with your authenticator app, or enter the code manually.</Body>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div
          style={{
            width: 140,
            height: 140,
            border: `1px solid ${WF_DARK}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: WF_MID,
            fontSize: 14,
            background: WF_LIGHT,
          }}
        >
          QR CODE
        </div>
      </div>
      <Step n={1}>Download an authenticator app such as Google Authenticator or Authy if you don't have one.</Step>
      <Step n={2}>Open the app and scan the QR code above, or enter the code manually:</Step>
      <Step n={3}>Enter the 6-digit code shown in your app on the next screen to verify setup.</Step>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 12px",
          background: WF_LIGHT,
          border: `1px solid ${WF_MID}`,
          fontFamily: "ui-monospace, monospace",
          fontSize: 15,
          color: WF_DARK,
          margin: "14px 0",
        }}
      >
        <span style={{ flex: 1 }}>HBDT-4F2A-9KM3-X7PQ</span>
        <CopyIcon />
      </div>

      <PrimaryButton to="/authenticator-verify">Continue to verification</PrimaryButton>
      <SecondaryButton to="/verify-method">Go back</SecondaryButton>
      <BackLink to="/verify-method" />
    </Page>
  );
}
