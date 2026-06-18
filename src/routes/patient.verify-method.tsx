import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page, H, Body, StepBar, PrimaryButton, SecondaryButton, TestingLink, BackLink, WF_MID, WF_DARK, WF_LIGHT } from "@/components/wireframe";

export const Route = createFileRoute("/patient/verify-method")({ component: PatientVerifyMethod });

function Radio({ selected }: { selected: boolean }) {
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: `1.5px solid ${WF_DARK}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 2,
      }}
    >
      {selected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: WF_DARK }} />}
    </div>
  );
}

function PatientVerifyMethod() {
  const [sel, setSel] = useState<"app" | "sms">("app");
  return (
    <Page>
      <StepBar states={["done", "active", "inactive"]} />
      <H>Add an extra layer of security</H>
      <Body>
        2-step verification is optional but strongly recommended. You can set this up later in My Profile if you prefer.
      </Body>

      {(["app", "sms"] as const).map((key) => {
        const selected = sel === key;
        const title = key === "app" ? "Authenticator app" : "SMS text message";
        const desc =
          key === "app"
            ? "Use an app like Google Authenticator or Authy to generate a one-time code. Most secure option."
            : "Receive a one-time code by text message to your phone number.";
        return (
          <div
            key={key}
            onClick={() => setSel(key)}
            style={{
              display: "flex",
              gap: 12,
              padding: 14,
              border: `1px solid ${selected ? WF_DARK : WF_MID}`,
              background: selected ? WF_LIGHT : "#fff",
              marginBottom: 10,
              cursor: "pointer",
            }}
          >
            <Radio selected={selected} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: WF_DARK }}>{title}</div>
              <div style={{ fontSize: 14, color: WF_MID, marginTop: 2 }}>{desc}</div>
            </div>
          </div>
        );
      })}

      <PrimaryButton to={sel === "app" ? "/patient/authenticator-qr" : "/patient/sms-phone"}>
        Set up 2-step verification
      </PrimaryButton>
      <SecondaryButton to="/patient/complete-skipped">Skip for now</SecondaryButton>
      <div style={{ fontSize: 14, color: WF_MID, marginTop: 14, textAlign: "center" }}>
        You can enable 2-step verification later in My Profile → Security.
      </div>
      <TestingLink to="/patient/sms-phone">test SMS flow →</TestingLink>
      <BackLink to="/patient/password" />
    </Page>
  );
}
