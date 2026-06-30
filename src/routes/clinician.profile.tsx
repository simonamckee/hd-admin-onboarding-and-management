import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type CSSProperties } from "react";
import { AdminShell } from "@/components/admin-shell";
import { TEAL, WF_DARK, WF_MID, BORDER, SURFACE } from "@/components/wireframe";

export const Route = createFileRoute("/clinician/profile")({
  component: ClinicianProfilePage,
});

const ssoOn = false; // hardcoded for prototype — in production, read from clinic config

function ClinicianProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setAvatarUrl(URL.createObjectURL(f));
  };

  const card: CSSProperties = {
    background: SURFACE,
    border: `0.5px solid ${BORDER}`,
    borderRadius: 8,
    padding: 24,
    maxWidth: 600,
  };
  const heading: CSSProperties = {
    fontSize: 15, fontWeight: 600, color: WF_DARK, marginTop: 24, marginBottom: 12,
  };
  const fieldRow: CSSProperties = {
    display: "flex", flexDirection: "column", gap: 4, marginBottom: 16,
  };
  const fieldLabel: CSSProperties = {
    fontSize: 12, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.3,
  };
  const fieldValue: CSSProperties = { fontSize: 15, color: WF_DARK };

  const fields: { label: string; value: string }[] = [
    { label: "Name", value: "Dr. James Reyes" },
    { label: "Function", value: "Endocrinologist" },
    { label: "Access level", value: "Clinician" },
    { label: "Email", value: "j.reyes@bcch.ca" },
  ];

  return (
    <AdminShell heading="My profile">
      <div style={card}>
        {/* Section 1 — Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", overflow: "hidden",
            border: `2px solid ${TEAL}`,
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "#e8f4f5", color: TEAL, fontSize: 28, fontWeight: 700,
              }}>JR</div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onPick}
          />
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              border: `0.5px solid ${TEAL}`, color: TEAL, background: "transparent",
              borderRadius: 5, fontSize: 13, padding: "4px 12px", marginTop: 8,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >Upload photo</button>
          <div style={{ fontSize: 13, color: WF_MID, marginTop: 6 }}>Dr. James Reyes</div>
        </div>

        {/* Section 2 — Account information */}
        <div style={heading}>Account information</div>
        {fields.map((f) => (
          <div key={f.label} style={fieldRow}>
            <div style={fieldLabel}>{f.label}</div>
            <div style={fieldValue}>{f.value}</div>
          </div>
        ))}
        <div style={{ fontSize: 12, color: WF_MID, fontStyle: "italic" }}>
          To update your account information, contact your clinic administrator.
        </div>

        {/* Section 3 — Security */}
        {!ssoOn && (
          <>
            <div style={heading}>Security</div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: WF_DARK }}>Two-factor authentication</div>
                <div style={{ fontSize: 13, color: WF_MID }}>Adds a second verification step each time you sign in.</div>
              </div>
              <Toggle on={mfaEnabled} onChange={setMfaEnabled} />
            </div>
            {mfaEnabled && (
              <div style={{
                fontSize: 13, color: WF_MID, padding: "8px 12px",
                background: "#f7f8f8", borderLeft: `3px solid ${TEAL}`,
                borderRadius: 4, marginTop: 8,
              }}>
                To complete MFA setup, use the authenticator app screens during your next sign-in.
              </div>
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{
        width: 40, height: 22, borderRadius: 999,
        background: on ? TEAL : BORDER,
        border: "none", padding: 2, cursor: "pointer",
        display: "inline-flex", alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
        flexShrink: 0,
      }}
      aria-pressed={on}
    >
      <span style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        display: "block",
      }} />
    </button>
  );
}
