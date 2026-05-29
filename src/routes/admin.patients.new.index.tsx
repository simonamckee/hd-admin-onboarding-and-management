import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import {
  Btn, Field, Input, Select, StepIndicator, Callout, Modal, TextLink,
} from "@/components/patient-ui";
import { Info } from "lucide-react";
import { WF_DARK, WF_MID } from "@/components/wireframe";
import {
  loadDraft, saveDraft, ageFromDob, clearDraft,
  loadPersistedDraft, savePersistedDraft, clearPersistedDraft,
  blankDraft, type PatientDraft,
} from "@/lib/patient-store";
import {
  SaveDraftButton, ResumeDraftBanner, useDraftPersistence,
} from "@/components/draft-guard";
import {
  formatPHN, phnDigits, isValidPHN,
  PHN_LABEL, PHN_HELPER, PHN_LENGTH_ERROR,
} from "@/lib/phn";

export const Route = createFileRoute("/admin/patients/new/")({ component: Step1 });

const CLINICIANS = [
  "Dr. Sarah Chen",
  "Dr. James Okafor",
  "Nurse Priya Mehta",
  "Dr. Lisa Bouchard",
  "Dietician Tom Park",
];

function isBlank(d: PatientDraft) {
  return JSON.stringify(d) === JSON.stringify(blankDraft);
}

function Step1() {
  const navigate = useNavigate();
  const [d, setD] = useState<PatientDraft>(loadDraft());
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [healthErr, setHealthErr] = useState<"same" | "cross" | "length" | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Show resume banner if a persisted draft exists AND no in-flight session work.
  useEffect(() => {
    const session = loadDraft();
    if (isBlank(session) && loadPersistedDraft()) setShowBanner(true);
  }, []);

  useEffect(() => { saveDraft(d); }, [d]);

  const { save, flash, modal, markClean } = useDraftPersistence<PatientDraft>({
    current: d,
    scopePrefix: "/admin/patients/new",
    persist: savePersistedDraft,
    onLeaveDiscard: () => { clearDraft(); },
  });

  const update = <K extends keyof PatientDraft>(k: K, v: PatientDraft[K]) =>
    setD((p) => ({ ...p, [k]: v }));

  const checkHealth = (v: string) => {
    const digits = phnDigits(v);
    if (digits.length === 0) { setHealthErr(null); return; }
    if (digits.length < 10) { setHealthErr("length"); return; }
    if (digits === "1234567890") setHealthErr("same");
    else if (digits === "9999999999") setHealthErr("cross");
    else setHealthErr(null);
  };

  const age = ageFromDob(d.dob);
  const requiredOk =
    d.firstName && d.lastName && d.dob && d.gender && d.diagnosisDate &&
    isValidPHN(d.healthNumber) && !healthErr &&
    (d.invite === "no" || (d.email && d.channel));

  const toggleClinician = (c: string) => {
    if (d.clinicians.includes(c)) update("clinicians", d.clinicians.filter((x) => x !== c));
    else if (d.clinicians.length < 4) update("clinicians", [...d.clinicians, c]);
  };

  const resumeDraft = () => {
    const persisted = loadPersistedDraft();
    if (persisted) {
      setD(persisted);
      saveDraft(persisted);
    }
    setShowBanner(false);
  };

  const startFresh = () => {
    clearPersistedDraft();
    clearDraft();
    setD(blankDraft);
    setShowBanner(false);
  };

  return (
    <AdminShell heading="">
      <div style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 6px" }}>Add a new patient</h1>
        <div style={{ fontSize: 12, color: WF_MID, marginBottom: 24 }}>Step 1 of 4 — Patient information</div>

        {showBanner && (
          <ResumeDraftBanner
            message="You have an unfinished patient profile."
            onResume={resumeDraft}
            onStartFresh={startFresh}
          />
        )}

        <StepIndicator step={1} />

        <div style={{ maxWidth: 600 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              border: `1px solid ${WF_MID}`,
              borderRadius: 8,
              padding: "12px 14px",
              marginBottom: 20,
              background: "#F5F5F5",
              fontSize: 12,
              color: WF_DARK,
              lineHeight: 1.5,
            }}
          >
            <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>Enter all patient information exactly as it appears on their health card.</span>
          </div>

          <Field label="First name" required>
            <Input value={d.firstName} onChange={(e) => update("firstName", e.target.value)} />
          </Field>
          <Field label="Last name" required>
            <Input value={d.lastName} onChange={(e) => update("lastName", e.target.value)} />
          </Field>
          <Field label="Date of birth" required>
            <Input type="date" value={d.dob} onChange={(e) => update("dob", e.target.value)} />
          </Field>
          <Field label="Gender" required>
            <Select value={d.gender} onChange={(e) => update("gender", e.target.value)}>
              <option value="">Select...</option>
              <option>Male</option><option>Female</option><option>Non-binary</option>
              <option>Prefer not to say</option><option>Other</option>
            </Select>
          </Field>
          <Field label="Date of diagnosis" required>
            <Input type="date" value={d.diagnosisDate} onChange={(e) => update("diagnosisDate", e.target.value)} />
          </Field>
          <Field
            label="Provincial health number"
            required
            error={
              healthErr === "same" ? (
                <span>
                  A patient with this health number already exists in your clinic.{" "}
                  <a href="#" target="_blank" rel="noreferrer" style={{ color: WF_DARK }}>
                    View existing patient
                  </a>
                </span>
              ) : healthErr === "cross" ? (
                <span>
                  A patient with this health number already exists in Haibu Diabetes. If this patient is transferring from another clinic, please contact support@haibudiabetes.com to arrange the transfer.
                </span>
              ) : null
            }
            helper="Try 1234567890 (same-clinic) or 9999999999 (cross-clinic) to see errors"
          >
            <Input
              value={d.healthNumber}
              errored={!!healthErr}
              onChange={(e) => { update("healthNumber", e.target.value); if (touched.health) checkHealth(e.target.value); }}
              onBlur={(e) => { setTouched((t) => ({ ...t, health: true })); checkHealth(e.target.value); }}
            />
          </Field>

          {age !== null && age < 12 && (
            <Callout>
              This patient appears to be under 12. Consider setting &quot;Invite patient now?&quot; to No if a parent or guardian will be managing the account initially.
            </Callout>
          )}

          <Field label="Invite patient now?">
            <div style={{ display: "flex", gap: 8 }}>
              {(["yes", "no"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => update("invite", v)}
                  style={{
                    padding: "8px 18px",
                    border: `${d.invite === v ? 2 : 1}px solid ${WF_DARK}`,
                    background: d.invite === v ? WF_DARK : "#fff",
                    color: d.invite === v ? "#fff" : WF_DARK,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {v === "yes" ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </Field>

          {d.invite === "yes" ? (
            <>
              <Field label="Patient email address" required>
                <Input type="email" value={d.email} onChange={(e) => update("email", e.target.value)} />
              </Field>
              <Field label="Preferred invite channel" required>
                <Select value={d.channel} onChange={(e) => update("channel", e.target.value)}>
                  <option>Email</option><option>SMS</option><option>Both</option>
                </Select>
              </Field>
            </>
          ) : (
            <Callout>
              Only supporters will receive an invitation. The patient can be invited later from their profile.
            </Callout>
          )}

          <div style={{ height: 1, background: WF_MID, opacity: 0.4, margin: "8px 0 20px" }} />

          <Field label="Patient phone number">
            <Input type="tel" value={d.phone} onChange={(e) => update("phone", e.target.value)} />
          </Field>

          <Field label="Assigned clinician(s)" helper="Up to 4">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {d.clinicians.map((c) => (
                <span
                  key={c}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    border: `1px solid ${WF_DARK}`, padding: "4px 10px", fontSize: 12,
                  }}
                >
                  {c}
                  <button onClick={() => toggleClinician(c)} style={{ background: "none", border: "none", cursor: "pointer", color: WF_DARK, fontSize: 13 }}>×</button>
                </span>
              ))}
            </div>
            <Select
              value=""
              onChange={(e) => { if (e.target.value) toggleClinician(e.target.value); }}
              disabled={d.clinicians.length >= 4}
            >
              <option value="">Add clinician...</option>
              {CLINICIANS.filter((c) => !d.clinicians.includes(c)).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>

          <Callout>
            Patient ethnicity is not collected here. It will be offered as an optional self-reported step during the patient&apos;s own onboarding.
          </Callout>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, gap: 12 }}>
            <TextLink onClick={() => setCancelOpen(true)}>Cancel</TextLink>
            <SaveDraftButton onSave={save} flash={flash} />
            <Btn
              primary
              disabled={!requiredOk}
              onClick={() => navigate({ to: "/admin/patients/new/supporters" })}
            >
              Continue to Add Supporters →
            </Btn>
          </div>
        </div>
      </div>

      <Modal open={cancelOpen} title="Cancel adding patient?" onClose={() => setCancelOpen(false)}>
        <p style={{ fontSize: 13, color: WF_DARK, margin: "0 0 20px" }}>
          Are you sure you want to cancel? Your progress will be lost.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Btn onClick={() => setCancelOpen(false)}>Cancel</Btn>
          <Btn
            primary
            onClick={() => {
              clearDraft();
              clearPersistedDraft();
              markClean();
              navigate({ to: "/admin/patients", search: { state: "default", banner: "" } });
            }}
          >
            Confirm
          </Btn>
        </div>
      </Modal>

      {modal}

      <PrototypeBack to="/admin/patients" />
    </AdminShell>
  );
}
