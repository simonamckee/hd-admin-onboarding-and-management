import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Card, StepIndicator, TextLink } from "@/components/patient-ui";
import { WF_DARK, WF_MID, TEAL } from "@/components/wireframe";
import { loadDraft, savePersistedDraft } from "@/lib/patient-store";
import { SaveDraftButton, useDraftPersistence } from "@/components/draft-guard";

export const Route = createFileRoute("/admin/patients/new/review")({ component: Step3 });

function RowKV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, padding: "10px 0", borderBottom: `0.5px solid ${WF_MID}`, fontSize: 15 }}>
      <div style={{ color: WF_MID, fontSize: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</div>
      <div style={{ color: WF_DARK }}>{v}</div>
    </div>
  );
}

function Step3() {
  const navigate = useNavigate();
  const [d] = useState(loadDraft());
  const last4 = d.healthNumber.slice(-4) || "0000";
  const inviteYes = d.invite === "yes";
  const { save, flash, modal } = useDraftPersistence({
    current: d,
    scopePrefix: "/admin/patients/new",
    persist: savePersistedDraft,
  });

  return (
    <AdminShell heading="">
      <div style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: TEAL, margin: "0 0 6px" }}>Review and send invitations</h1>
        <div style={{ fontSize: 14, color: WF_MID, marginBottom: 24 }}>Step 3 of 4</div>

        <StepIndicator step={3} />

        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: WF_DARK }}>Patient information</div>
            <TextLink onClick={() => navigate({ to: "/admin/patients/new" })}>Edit</TextLink>
          </div>
          <RowKV k="Full name" v={`${d.firstName || "—"} ${d.lastName || ""}`} />
          <RowKV k="Date of birth" v={d.dob || "—"} />
          <RowKV k="Gender" v={d.gender || "—"} />
          <RowKV k="Date of diagnosis" v={d.diagnosisDate || "—"} />
          <RowKV k="Health number" v={<span style={{ fontFamily: "ui-monospace, monospace" }}>•••• {last4}</span>} />
          <RowKV k="Invite patient" v={inviteYes ? "Yes" : "No"} />
          {inviteYes && (
            <>
              <RowKV k="Email" v={d.email || "—"} />
              <RowKV k="Channel" v={d.channel || "—"} />
            </>
          )}
          <RowKV k="Assigned clinicians" v={d.clinicians.length ? d.clinicians.join(", ") : "None"} />
        </Card>

        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: WF_DARK }}>Supporters</div>
            <TextLink onClick={() => navigate({ to: "/admin/patients/new/supporters" })}>Edit</TextLink>
          </div>
          {d.supporters.filter((s) => s.firstName).length === 0 ? (
            <div style={{ fontSize: 15, color: WF_MID, padding: "10px 0" }}>No supporters added.</div>
          ) : (
            d.supporters.filter((s) => s.firstName).map((s, i) => (
              <RowKV
                key={i}
                k={`Supporter ${i + 1}`}
                v={`${s.firstName} ${s.lastName} · ${s.relationship || "—"} · ${s.channel}`}
              />
            ))
          )}
        </Card>

        <Btn
          primary
          full
          onClick={() => navigate({ to: "/admin/patients/new/done" })}
        >
          {inviteYes ? "Send invitations" : "Save patient profile"}
        </Btn>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
          <TextLink onClick={() => navigate({ to: "/admin/patients/new/supporters" })}>← Back</TextLink>
          <SaveDraftButton onSave={save} flash={flash} />
        </div>
      </div>
      {modal}
      <PrototypeBack to="/admin/patients/new/supporters" />
    </AdminShell>
  );
}
