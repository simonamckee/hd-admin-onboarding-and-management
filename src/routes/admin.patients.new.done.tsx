import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn } from "@/components/patient-ui";
import { WF_DARK, WF_MID, TEAL } from "@/components/wireframe";
import { loadDraft, clearDraft, clearPersistedDraft } from "@/lib/patient-store";

export const Route = createFileRoute("/admin/patients/new/done")({ component: Step4 });

function Step4() {
  const navigate = useNavigate();
  const [d] = useState(loadDraft());
  const inviteYes = d.invite === "yes";
  const supporterCount = d.supporters.filter((s) => s.firstName).length;
  const patientName = `${d.firstName || "patient"} ${d.lastName || ""}`.trim();

  const finish = () => {
    const msg = inviteYes
      ? `Invitations sent to ${patientName} and ${supporterCount} supporter(s).`
      : `Patient profile saved for ${patientName}.`;
    clearDraft();
    clearPersistedDraft();
    navigate({ to: "/admin/patients", search: { state: "default", banner: msg, assignedTo: "" } });
  };

  return (
    <AdminShell heading="">
      <div style={{ maxWidth: 560, margin: "40px auto", textAlign: "center" }}>
        <div
          style={{
            width: 64, height: 64, borderRadius: "50%",
            border: `2px solid ${WF_DARK}`, margin: "0 auto 24px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 34, color: WF_DARK,
          }}
        >
          ✓
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: TEAL, margin: "0 0 12px" }}>
          {inviteYes ? "Invitations sent" : "Patient profile saved"}
        </h1>
        <p style={{ fontSize: 16, color: WF_MID, margin: "0 0 32px", lineHeight: 1.5 }}>
          {inviteYes
            ? `Invitations have been sent to ${patientName} and ${supporterCount} supporter(s).`
            : `${patientName}'s profile has been created. They can be invited later.`}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Btn to="/admin/patients">View patient profile</Btn>
          <Btn primary onClick={finish}>Back to Patient management</Btn>
        </div>
      </div>
      <PrototypeBack to="/admin/patients" />
    </AdminShell>
  );
}
