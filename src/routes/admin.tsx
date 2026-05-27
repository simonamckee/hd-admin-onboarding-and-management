import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { WF_DARK, WF_MID } from "@/components/wireframe";

export const Route = createFileRoute("/admin")({ component: ClinicInformation });

function Row({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: 24,
        padding: "16px 0",
        borderBottom: last ? "none" : `0.5px solid ${WF_MID}`,
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: WF_MID,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14, color: WF_DARK }}>{children}</div>
    </div>
  );
}

function ReadOnlyNote() {
  return <span style={{ fontSize: 11, color: WF_MID, marginLeft: 8 }}>(read-only)</span>;
}

function StatusChip({ text }: { text: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: `1px solid ${WF_MID}`,
        borderRadius: 999,
        padding: "4px 12px",
        fontSize: 13,
        color: WF_DARK,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: WF_DARK,
          display: "inline-block",
        }}
      />
      {text}
    </span>
  );
}

function ClinicInformation() {
  const initial = "admin@bcchildrens.ca";
  const [email, setEmail] = useState(initial);
  const changed = email !== initial;

  return (
    <AdminShell heading="Clinic information">
      <div
        style={{
          background: "#fff",
          border: `1px solid ${WF_MID}`,
          borderRadius: 8,
          padding: 24,
        }}
      >
        <Row label="Clinic name">
          BC Children's Hospital
          <ReadOnlyNote />
        </Row>
        <Row label="Address and contact">
          4480 Oak Street, Vancouver, BC V6H 3V4 · +1 604 875 2000
          <ReadOnlyNote />
        </Row>
        <Row label="Province / state">
          British Columbia, Canada
          <ReadOnlyNote />
        </Row>
        <Row label="Clinic notification email">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: `1px solid ${WF_MID}`,
                background: "#fff",
                fontSize: 14,
                color: WF_DARK,
                fontFamily: "inherit",
                outline: "none",
              }}
            />
            {changed && (
              <button
                onClick={() => {/* prototype only */}}
                style={{
                  padding: "8px 16px",
                  border: `1px solid ${WF_DARK}`,
                  background: "#fff",
                  color: WF_DARK,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Save
              </button>
            )}
          </div>
        </Row>
        <Row label="SSO / identity provider">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <StatusChip text="Connected — Azure AD" />
            <ReadOnlyNote />
          </span>
        </Row>
        <Row label="Subscription status" last>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <StatusChip text="Active" />
            <span style={{ fontSize: 11, color: WF_MID }}>
              (read-only, managed by Haibu Health)
            </span>
          </span>
        </Row>
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: WF_MID, marginTop: 16 }}>
        To update read-only fields, contact support@haibudiabetes.com
      </p>
      <PrototypeBack to="/complete" />
    </AdminShell>
  );
}
