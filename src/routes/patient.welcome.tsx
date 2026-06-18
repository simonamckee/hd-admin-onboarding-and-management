import { createFileRoute } from "@tanstack/react-router";
import { Page, PrimaryButton, TestingLink, HAIBU_LOGO_URL, WF_BG, WF_DARK, WF_MID, TEAL, TINT, BORDER, SURFACE } from "@/components/wireframe";
import type { ReactNode } from "react";

export const Route = createFileRoute("/patient/welcome")({ component: PatientWelcome });

function Card({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <div
      style={{
        flex: 1,
        background: WF_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: 16,
      }}
    >
      {icon}
      <div style={{ fontSize: 15, fontWeight: 600, color: WF_DARK, marginTop: 10, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: WF_MID, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

const iconProps = { width: 28, height: 20, viewBox: "0 0 28 20", fill: "none", stroke: TEAL, strokeWidth: 2 } as const;

function PatientWelcome() {
  return (
    <Page noCard>
      <div style={{ display: "flex", justifyContent: "center", padding: "48px 16px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            background: SURFACE,
            border: `1px solid ${BORDER}66`,
            borderRadius: 8,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            padding: 28,
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <img src={HAIBU_LOGO_URL} alt="Haibu Diabetes" style={{ height: 28, display: "block" }} />
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 700, color: TEAL, margin: "0 0 8px 0" }}>
            Welcome to Haibu Diabetes, Emma.
          </h1>
          <p style={{ fontSize: 16, color: WF_MID, lineHeight: 1.5, margin: "0 0 28px 0" }}>
            Everything you need to manage your diabetes care is now in one place.
          </p>

          <div style={{ display: "flex", gap: 12 }}>
            <Card
              icon={
                <svg {...iconProps}>
                  <polyline points="2 16 9 9 15 13 26 3" />
                </svg>
              }
              title="Glucose trends"
              body="View your CGM data and time-in-range once your device is connected."
            />
            <Card
              icon={
                <svg {...iconProps}>
                  <circle cx="10" cy="7" r="3" />
                  <circle cx="19" cy="7" r="3" />
                  <path d="M4 18c0-3 3-5 6-5s6 2 6 5" />
                  <path d="M16 18c0-3 3-5 6-5" />
                </svg>
              }
              title="Your care team"
              body="Message your clinic, complete forms, and stay on top of tasks assigned by your clinicians."
            />
            <Card
              icon={
                <svg {...iconProps}>
                  <rect x="3" y="2" width="9" height="7" />
                  <rect x="16" y="2" width="9" height="7" />
                  <rect x="3" y="11" width="9" height="7" />
                  <rect x="16" y="11" width="9" height="7" />
                </svg>
              }
              title="All in one place"
              body="Your appointments, recommendations, and resources — all here, whenever you need them."
            />
          </div>

          <div
            style={{
              background: TINT,
              borderRadius: 8,
              padding: "10px 14px",
              marginTop: 24,
              marginBottom: 24,
              fontSize: 14,
              color: TEAL,
            }}
          >
            Your dashboard may look a little empty at first. Once your device is connected and your care team has added information, everything will start to appear.
          </div>

          <PrimaryButton to="/roster">Go to my dashboard</PrimaryButton>
          <TestingLink to="/roster">skip to dashboard (prototype) →</TestingLink>
        </div>
      </div>
    </Page>
  );
}
