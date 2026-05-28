import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Card, Field, Input, Select, Pill, Modal, TextLink, DangerDivider } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

export const Route = createFileRoute("/admin/clinicians/$id")({
  validateSearch: (s: Record<string, unknown>) => ({ sso: (s.sso as "on" | "off") || "off" }),
  component: EditClinician,
});

type Row = { name: string; title: string; role: "Clinician" | "Admin"; email: string; status: "Active" | "Pending" | "Archived" };

const MOCK: Record<string, Row> = {
  "sarah-chen": { name: "Dr. Sarah Chen", title: "Endocrinologist", role: "Admin", email: "s.chen@clinic.ca", status: "Active" },
  "james-okafor": { name: "Dr. James Okafor", title: "Endocrinologist", role: "Clinician", email: "j.okafor@clinic.ca", status: "Active" },
  "priya-mehta": { name: "Nurse Priya Mehta", title: "Diabetes Nurse Educator", role: "Clinician", email: "p.mehta@clinic.ca", status: "Active" },
  "lisa-bouchard": { name: "Dr. Lisa Bouchard", title: "Endocrinologist", role: "Clinician", email: "l.bouchard@clinic.ca", status: "Pending" },
  "tom-park": { name: "Dietician Tom Park", title: "Registered Dietician", role: "Clinician", email: "t.park@clinic.ca", status: "Active" },
  "kevin-marsh": { name: "Dr. Kevin Marsh", title: "Endocrinologist", role: "Clinician", email: "k.marsh@clinic.ca", status: "Archived" },
};

function statusPill(s: Row["status"]) {
  if (s === "Active") return <Pill label="Active" weight="dark" />;
  if (s === "Pending") return <Pill label="Pending" weight="mid" />;
  return <Pill label="Archived" weight="light" />;
}

function EditClinician() {
  const { id } = Route.useParams();
  const { sso } = useSearch({ from: "/admin/clinicians/$id" });
  const navigate = useNavigate();
  const base = MOCK[id] || MOCK["sarah-chen"];
  const ssoOn = sso === "on";

  const [title, setTitle] = useState(base.title);
  const [role, setRole] = useState(base.role);
  const [confirm, setConfirm] = useState(false);

  return (
    <AdminShell heading="">
      <div style={{ maxWidth: 720 }}>
        <Link to="/admin/clinicians" search={{ state: "default", sso, banner: "" }} style={{ fontSize: 12, color: WF_MID, textDecoration: "none" }}>
          ← Clinician management
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 0 24px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>{base.name}</h1>
          {statusPill(base.status)}
        </div>

        <Card style={{ marginBottom: 16 }}>
          <Grid>
            <Field label="Name">
              <ReadOnly>{base.name}</ReadOnly>
              {ssoOn && <Note>Sourced from identity provider</Note>}
            </Field>
            <Field label="Email">
              <ReadOnly>{base.email}</ReadOnly>
              {ssoOn && <Note>Sourced from identity provider</Note>}
            </Field>
            <Field label="Title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="Role">
              <Select value={role} onChange={(e) => setRole(e.target.value as Row["role"])}>
                <option>Clinician</option>
                <option>Admin</option>
              </Select>
            </Field>
          </Grid>
        </Card>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
          <TextLink to="/admin/clinicians">Cancel</TextLink>
          <Btn
            primary
            onClick={() =>
              navigate({
                to: "/admin/clinicians",
                search: { state: "default", sso, banner: `Changes to ${base.name} saved.` },
              })
            }
          >
            Save changes
          </Btn>
        </div>

        {!ssoOn && base.status !== "Archived" && (
          <>
            <DangerDivider />
            <Btn onClick={() => setConfirm(true)}>Deactivate clinician</Btn>
          </>
        )}
      </div>

      <Modal open={confirm} title={`Deactivate ${base.name}?`} onClose={() => setConfirm(false)}>
        <p style={{ fontSize: 13, color: WF_DARK, margin: "0 0 20px", lineHeight: 1.5 }}>
          Are you sure you want to deactivate {base.name}? They will immediately lose access to Haibu and any active sessions will end.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Btn onClick={() => setConfirm(false)}>Cancel</Btn>
          <Btn
            primary
            onClick={() =>
              navigate({
                to: "/admin/clinicians",
                search: { state: "default", sso, banner: `${base.name} has been deactivated.` },
              })
            }
          >
            Yes, deactivate
          </Btn>
        </div>
      </Modal>

      <PrototypeBack to="/admin/clinicians" />
    </AdminShell>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{children}</div>;
}
function ReadOnly({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "8px 12px", border: `1px solid ${WF_MID}`, background: "#F5F5F5", fontSize: 13, color: WF_DARK }}>
      {children}
    </div>
  );
}
function Note({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, color: WF_MID, fontStyle: "italic", marginTop: 6 }}>{children}</div>;
}
