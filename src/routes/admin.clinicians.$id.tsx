import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Card, Field, Input, Select, Pill, Modal, TextLink, DangerDivider } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";
import { ASSIGNED_PATIENTS, deactivateClinician } from "@/lib/clinician-assignments";

export const Route = createFileRoute("/admin/clinicians/$id")({
  validateSearch: (s: Record<string, unknown>) => ({ sso: (s.sso as "on" | "off") || "off" }),
  component: EditClinician,
});

type Row = {
  name: string;
  title: string;
  role: "Clinician" | "Admin";
  email: string;
  status: "Active" | "Pending" | "Archived";
  lastSignIn: string;
  memberSince: string;
};

const MOCK: Record<string, Row> = {
  "sarah-chen": { name: "Dr. Sarah Chen", title: "Endocrinologist", role: "Admin", email: "s.chen@clinic.ca", status: "Active", lastSignIn: "Today", memberSince: "January 12, 2026" },
  "james-okafor": { name: "Dr. James Okafor", title: "Endocrinologist", role: "Clinician", email: "j.okafor@clinic.ca", status: "Active", lastSignIn: "3 days ago", memberSince: "February 3, 2026" },
  "priya-mehta": { name: "Nurse Priya Mehta", title: "Diabetes Nurse Educator", role: "Clinician", email: "p.mehta@clinic.ca", status: "Active", lastSignIn: "1 week ago", memberSince: "February 18, 2026" },
  "lisa-bouchard": { name: "Dr. Lisa Bouchard", title: "Endocrinologist", role: "Clinician", email: "l.bouchard@clinic.ca", status: "Pending", lastSignIn: "Never", memberSince: "May 20, 2026" },
  "tom-park": { name: "Dietician Tom Park", title: "Registered Dietician", role: "Clinician", email: "t.park@clinic.ca", status: "Active", lastSignIn: "2 weeks ago", memberSince: "March 4, 2026" },
  "kevin-marsh": { name: "Dr. Kevin Marsh", title: "Endocrinologist", role: "Clinician", email: "k.marsh@clinic.ca", status: "Archived", lastSignIn: "4 months ago", memberSince: "January 6, 2026" },
};

function statusPill(s: Row["status"]) {
  if (s === "Active") return <Pill label="Active" weight="dark" />;
  if (s === "Pending") return <Pill label="Pending" weight="mid" />;
  return <Pill label="Archived" weight="light" />;
}

const CLINIC_ROLES = [
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

function EditClinician() {
  const { id } = Route.useParams();
  const { sso } = useSearch({ from: "/admin/clinicians/$id" });
  const navigate = useNavigate();
  const base = MOCK[id] || MOCK["james-okafor"];
  const ssoOn = sso === "on";

  const [name, setName] = useState(base.name);
  const [email, setEmail] = useState(base.email);
  const [title, setTitle] = useState(base.title);
  const [role, setRole] = useState<Row["role"]>(base.role);
  const [warn, setWarn] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const assignedPatients = ASSIGNED_PATIENTS[id] || [];

  const nameDirty = name !== base.name;
  const emailDirty = email !== base.email;
  const titleDirty = title !== base.title;
  const roleDirty = role !== base.role;

  const saveName = () => {
    navigate({
      to: "/admin/clinicians",
      search: { state: "default", sso, banner: `Name updated for ${base.name}.` },
    });
  };
  const saveEmail = () => {
    navigate({
      to: "/admin/clinicians",
      search: { state: "default", sso, banner: `Email updated for ${base.name}.` },
    });
  };
  const saveTitle = () => {
    navigate({
      to: "/admin/clinicians",
      search: { state: "default", sso, banner: `Title updated for ${base.name}.` },
    });
  };
  const saveRole = () => {
    navigate({
      to: "/admin/clinicians",
      search: { state: "default", sso, banner: `Role updated for ${base.name}.` },
    });
  };

  return (
    <AdminShell heading="">
      <div style={{ maxWidth: 720 }}>
        <Link
          to="/admin/clinicians"
          search={{ state: "default", sso, banner: "" }}
          style={{ fontSize: 14, color: WF_MID, textDecoration: "none" }}
        >
          ← Clinician management
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "12px 0 28px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 500, margin: 0 }}>{base.name}</h1>
          {statusPill(base.status)}
        </div>

        {/* Clinician details — editable */}
        <SectionLabel>Clinician details</SectionLabel>
        <Card style={{ marginBottom: 28 }}>
          <Field label="Title" required>
            <InlineEdit
              dirty={titleDirty}
              onCancel={() => setTitle(base.title)}
              onSave={saveTitle}
            >
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </InlineEdit>
          </Field>

          <Field label="Role" required helper="All role changes are audit-logged.">
            <InlineEdit
              dirty={roleDirty}
              onCancel={() => setRole(base.role)}
              onSave={saveRole}
            >
              <Select value={role} onChange={(e) => setRole(e.target.value as Row["role"])}>
                <option>Clinician</option>
                <option>Admin</option>
              </Select>
            </InlineEdit>
          </Field>
        </Card>

        {/* Account information — read-only */}
        <SectionLabel>Account information</SectionLabel>
        <Card
          style={{
            marginBottom: 8,
            background: "#FAFAFA",
            borderStyle: "dashed",
          }}
        >
          <ReadField label="Name" value={base.name} note="Name is fixed after account creation." />
          <ReadField
            label="Email"
            value={base.email}
            note={ssoOn ? "Sourced from identity provider." : "Email is fixed after account creation."}
          />
          <Grid>
            <ReadField label="Last sign-in" value={base.lastSignIn} />
            <ReadField label="Member since" value={base.memberSince} />
          </Grid>
        </Card>

        {/* Danger zone */}
        {base.status !== "Archived" && (
          <>
            <DangerDivider />
            {ssoOn ? (
              <div style={{ fontSize: 14, color: WF_DARK, lineHeight: 1.5, maxWidth: 560 }}>
                To deactivate this clinician, remove them from the relevant security group
                in your identity provider. Haibu will reflect the change automatically.
              </div>
            ) : (
              <Btn onClick={() => (assignedPatients.length > 0 ? setWarn(true) : setConfirm(true))}>Deactivate clinician</Btn>
            )}
          </>
        )}
      </div>

      <Modal open={warn} title={`${base.name} is assigned to ${assignedPatients.length} patient${assignedPatients.length === 1 ? "" : "s"}`} onClose={() => setWarn(false)}>
        <p style={{ fontSize: 15, color: WF_DARK, margin: "0 0 14px", lineHeight: 1.5 }}>
          These patients will need to be reassigned to another clinician. You can reassign
          them now or proceed with the deactivation.
        </p>
        <ul style={{ margin: "0 0 18px 18px", padding: 0, fontSize: 14, color: WF_DARK, lineHeight: 1.5 }}>
          {assignedPatients.slice(0, 5).map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        {assignedPatients.length > 5 && (
          <div style={{ fontSize: 13, color: WF_MID, margin: "-12px 0 18px", fontStyle: "italic" }}>
            + {assignedPatients.length - 5} more patients
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
          <Btn
            primary
            onClick={() => {
              setWarn(false);
              setConfirm(true);
            }}
          >
            Deactivate anyway →
          </Btn>
          <Btn
            onClick={() => {
              setWarn(false);
              navigate({
                to: "/admin/patients",
                search: { state: "default", banner: "", assignedTo: id },
              });
            }}
          >
            Reassign patients first
          </Btn>
          <div style={{ textAlign: "center", marginTop: 4 }}>
            <button
              onClick={() => setWarn(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: WF_DARK, fontSize: 14, textDecoration: "underline", fontFamily: "inherit" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={confirm} title={`Deactivate ${base.name}?`} onClose={() => setConfirm(false)}>
        <p style={{ fontSize: 15, color: WF_DARK, margin: "0 0 20px", lineHeight: 1.5 }}>
          They will immediately lose access to Haibu and any active sessions will end.
          Their patient assignments will be preserved.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Btn onClick={() => setConfirm(false)}>Cancel</Btn>
          <Btn
            primary
            onClick={() => {
              deactivateClinician(base.name);
              navigate({
                to: "/admin/clinicians",
                search: { state: "default", sso, banner: `${base.name} has been deactivated.` },
              });
            }}
          >
            Yes, deactivate
          </Btn>
        </div>
      </Modal>

      <PrototypeBack to="/admin/clinicians" />
    </AdminShell>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10, fontWeight: 500 }}>
      {children}
    </div>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{children}</div>;
}

function ReadField({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, color: WF_MID, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, color: WF_DARK }}>{value}</div>
      {note && (
        <div style={{ fontSize: 13, color: WF_MID, fontStyle: "italic", marginTop: 4 }}>
          {note}
        </div>
      )}
    </div>
  );
}

function InlineEdit({
  dirty,
  onCancel,
  onSave,
  children,
}: {
  dirty: boolean;
  onCancel: () => void;
  onSave: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      {children}
      {dirty && (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Btn small onClick={onCancel}>Cancel</Btn>
          <Btn small primary onClick={onSave}>Save</Btn>
        </div>
      )}
    </div>
  );
}
