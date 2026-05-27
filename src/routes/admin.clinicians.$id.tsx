import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Field, Input, Select, TextLink, Pill, DangerDivider, Modal } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";
import { CLINICIANS } from "@/lib/clinician-store";

export const Route = createFileRoute("/admin/clinicians/$id")({
  component: EditClinician,
});

function EditClinician() {
  const { id } = useParams({ from: "/admin/clinicians/$id" });
  const nav = useNavigate();
  const clinician = CLINICIANS.find((c) => c.id === id) ?? CLINICIANS[0];

  const [title, setTitle] = useState(clinician.title);
  const [role, setRole] = useState(clinician.role);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function save() {
    nav({
      to: "/admin/clinicians",
      search: { state: "default", sso: "off", banner: `${clinician.name} updated.` },
    });
  }

  function deactivate() {
    setConfirmOpen(false);
    nav({
      to: "/admin/clinicians",
      search: { state: "default", sso: "off", banner: `${clinician.name} has been deactivated.` },
    });
  }

  return (
    <AdminShell heading="">
      <div style={{ marginBottom: 12 }}>
        <Link to="/admin/clinicians" search={{ state: "default", sso: "off", banner: "" }} style={{ fontSize: 12, color: WF_MID, textDecoration: "underline" }}>
          ← Clinician management
        </Link>
      </div>

      <div style={{ maxWidth: 560 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, marginTop: 0, marginBottom: 6 }}>
          {clinician.name}
        </h1>
        <div style={{ marginBottom: 24 }}>
          <Pill
            label={clinician.status}
            weight={clinician.status === "Active" ? "dark" : clinician.status === "Pending" ? "mid" : "light"}
          />
        </div>

        <Field label="Name">
          <Input value={clinician.name} disabled style={{ background: "#F5F5F5", color: WF_MID }} />
        </Field>
        <Field label="Email">
          <Input value={clinician.email} disabled style={{ background: "#F5F5F5", color: WF_MID }} />
        </Field>
        <Field label="Title" required>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Role" required>
          <Select value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
            <option>Clinician</option>
            <option>Admin</option>
          </Select>
        </Field>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
          <TextLink to="/admin/clinicians">Cancel</TextLink>
          <Btn primary onClick={save}>Save changes</Btn>
        </div>

        <DangerDivider />
        <div style={{ fontSize: 13, color: WF_DARK, marginBottom: 12 }}>
          Deactivating will immediately end access to Haibu.
        </div>
        <Btn onClick={() => setConfirmOpen(true)}>Deactivate clinician</Btn>
      </div>

      <Modal open={confirmOpen} title={`Deactivate ${clinician.name}?`} onClose={() => setConfirmOpen(false)}>
        <div style={{ fontSize: 13, color: WF_DARK, marginBottom: 20, lineHeight: 1.5 }}>
          They will immediately lose access to Haibu and any active sessions will end.
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Btn onClick={() => setConfirmOpen(false)}>Cancel</Btn>
          <Btn primary onClick={deactivate}>Yes, deactivate</Btn>
        </div>
      </Modal>

      <PrototypeBack to="/admin/clinicians" />
    </AdminShell>
  );
}
