import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Briefcase, Stethoscope } from "lucide-react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { WF_DARK, WF_MID, WF_BG, SUCCESS_BG, SUCCESS_TEXT, TEAL, BORDER, SURFACE } from "@/components/wireframe";

export const Route = createFileRoute("/admin/")({ component: ClinicInformation });

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
          fontSize: 14,
          color: WF_MID,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 16, color: WF_DARK }}>{children}</div>
    </div>
  );
}

function ReadOnlyNote() {
  return <span style={{ fontSize: 13, color: WF_MID, marginLeft: 8 }}>(read-only)</span>;
}

function StatusChip({ text }: { text: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: SUCCESS_BG,
        color: SUCCESS_TEXT,
        borderRadius: 999,
        padding: "4px 12px",
        fontSize: 15,
        fontWeight: 500,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: SUCCESS_TEXT,
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
                background: WF_BG,
                fontSize: 16,
                color: WF_DARK,
                fontFamily: "inherit",
                outline: "none",
                borderRadius: 8,
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
                  fontSize: 15,
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
            <span style={{ fontSize: 13, color: WF_MID }}>
              (read-only, managed by Haibu Health)
            </span>
          </span>
        </Row>
      </div>

      <ClinicRolesCard />

      <AccessLevelsCard />



      <p style={{ textAlign: "center", fontSize: 14, color: WF_MID, marginTop: 16 }}>
        To update read-only fields, contact support@haibudiabetes.com
      </p>
      <PrototypeBack to="/complete" />
    </AdminShell>
  );
}

const DEFAULT_ROLES = [
  "Endocrinologist",
  "Dietician",
  "Nurse",
  "Diabetes Nurse Educator",
  "Psychologist",
  "Social Worker / Mental Health Professional",
  "Admin",
  "Pharmacist",
  "Nurse Practitioner",
  "Physician Assistant",
  "Education Specialist",
  "Podiatrist",
  "Optometrist / Ophthalmologist",
  "Other",
];

function SavedFlash({ when }: { when: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (when === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, [when]);
  return (
    <span
      style={{
        fontSize: 14,
        color: WF_DARK,
        fontStyle: "italic",
        opacity: visible ? 1 : 0,
        transition: "opacity 200ms",
        marginLeft: 12,
        whiteSpace: "nowrap",
      }}
    >
      ✓ Saved
    </span>
  );
}

function ClinicRolesCard() {
  const [roles, setRoles] = useState<string[]>(DEFAULT_ROLES);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [savedAt, setSavedAt] = useState(0);

  const tealTintBg = "rgba(18, 87, 92, 0.08)";

  const addRole = () => {
    const v = draft.trim();
    if (!v || roles.includes(v)) {
      setDraft("");
      setAdding(false);
      return;
    }
    setRoles((r) => [...r, v]);
    setDraft("");
    setAdding(false);
  };

  const removeRole = (r: string) => setRoles((arr) => arr.filter((x) => x !== r));

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${WF_MID}`,
        borderRadius: 8,
        padding: 24,
        marginTop: 24,
      }}
    >
      <h2 style={{ fontSize: 17, fontWeight: 600, color: WF_DARK, margin: "0 0 4px" }}>
        Clinic functions
      </h2>
      <div style={{ fontSize: 14, color: WF_MID, marginBottom: 16 }}>
        These are the functions that will populate the Clinician management section when adding or editing clinicians.
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {roles.map((r) => (
          <span
            key={r}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: tealTintBg,
              color: TEAL,
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 14,
            }}
          >
            {r}
            <button
              onClick={() => removeRole(r)}
              aria-label={`Remove ${r}`}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: TEAL,
                fontSize: 16,
                lineHeight: 1,
                padding: 0,
                fontFamily: "inherit",
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {adding ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addRole();
              if (e.key === "Escape") { setDraft(""); setAdding(false); }
            }}
            placeholder="New function name"
            style={{
              padding: "8px 12px",
              border: `1px solid ${WF_MID}`,
              background: WF_BG,
              fontSize: 15,
              color: WF_DARK,
              fontFamily: "inherit",
              outline: "none",
              borderRadius: 8,
              minWidth: 240,
            }}
          />
          <button
            onClick={addRole}
            style={{
              padding: "8px 16px",
              border: `1px solid ${TEAL}`,
              background: TEAL,
              color: "#fff",
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
              borderRadius: 4,
            }}
          >
            Add
          </button>
          <button
            onClick={() => { setDraft(""); setAdding(false); }}
            style={{
              padding: "8px 12px",
              border: "none",
              background: "none",
              color: WF_MID,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{
            padding: "6px 12px",
            border: `1px dashed ${WF_DARK}`,
            background: "#fff",
            color: WF_DARK,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
            borderRadius: 4,
            marginBottom: 12,
          }}
        >
          + Add function
        </button>
      )}

      <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
        <button
          onClick={() => setSavedAt(Date.now())}
          style={{
            padding: "8px 16px",
            border: `1px solid ${WF_DARK}`,
            background: "#fff",
            color: WF_DARK,
            fontSize: 15,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Save
        </button>
        <SavedFlash when={savedAt} />
      </div>
    </div>
  );
}

