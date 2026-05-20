import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Page, H, Body, StepBar, PrimaryButton, FieldLabel, TextInput, EyeIcon, CheckCircle, TestingLink, WF_MID, WF_DARK } from "@/components/wireframe";

export const Route = createFileRoute("/password")({ component: Screen2 });

function Screen2() {
  const [filled, setFilled] = useState(false);
  const rules = [
    "At least 8 characters",
    "At least one uppercase letter",
    "At least one number",
    "At least one special character",
  ];
  return (
    <Page>
      <StepBar states={["done", "active", "inactive"]} />
      <H>Create your password</H>
      <Body>Choose a strong password to secure your Haibu Diabetes admin account.</Body>

      <FieldLabel>Password</FieldLabel>
      <TextInput
        placeholder={filled ? undefined : "Enter your password"}
        value={filled ? "••••••••••" : undefined}
        active={filled}
        rightIcon={<EyeIcon />}
      />
      {filled && (
        <div style={{ marginTop: -8, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ flex: 1, height: 4, background: WF_DARK }} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: WF_DARK, marginTop: 4 }}>Strong</div>
        </div>
      )}

      <FieldLabel>Confirm password</FieldLabel>
      <TextInput
        placeholder={filled ? undefined : "Confirm your password"}
        value={filled ? "••••••••••" : undefined}
        active={filled}
        rightIcon={filled ? <CheckCircle filled /> : <EyeIcon />}
      />

      <div style={{ margin: "16px 0" }}>
        {rules.map((r) => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <CheckCircle filled={filled} />
            <span style={{ fontSize: 13, color: filled ? WF_DARK : WF_MID }}>{r}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 8 }}>
        <button
          onClick={() => setFilled((v) => !v)}
          style={{
            fontSize: 11,
            fontStyle: "italic",
            color: WF_MID,
            background: "none",
            border: "none",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
          }}
        >
          [ Testing toggle: {filled ? "clear" : "fill"} password ]
        </button>
      </div>

      {filled ? (
        <PrimaryButton to="/verify-method">Continue</PrimaryButton>
      ) : (
        <PrimaryButton disabled>Continue</PrimaryButton>
      )}

      <TestingLink to="/verify-method">skip to next screen →</TestingLink>
    </Page>
  );
}
