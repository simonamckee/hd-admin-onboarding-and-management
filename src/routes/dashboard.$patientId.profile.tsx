import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Trash2, Pencil, ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import {
  TEAL, SURFACE, WF_BG, WF_DARK, WF_MID, BORDER,
  SUCCESS_TEXT, SUCCESS_BG, WARN_TEXT, WARN_BG, ERROR_TEXT, TINT,
} from "@/components/wireframe";

export const Route = createFileRoute("/dashboard/$patientId/profile")({
  component: CareProfilePage,
});

type Role = "clinician" | "patient";

// ---------- Sample data ----------
const PATIENT_NAME = "Sarah Chen";
const CLINICIAN_NAME = "Dr. Reyes";
const TODAY = "12 Jun 2026";

const MILESTONE_GROUPS: { title: string; items: { id: string; label: string }[] }[] = [
  {
    title: "Clinical / device",
    items: [
      { id: "first-visit", label: "First visit to diabetes clinic — what to expect" },
      { id: "start-pump", label: "Starting insulin pump" },
      { id: "start-cgm", label: "Starting CGM" },
      { id: "new-device", label: "New device added to platform" },
    ],
  },
  {
    title: "Life stage",
    items: [
      { id: "daycare", label: "Starting daycare / preschool" },
      { id: "school", label: "Starting school" },
      { id: "college", label: "Preparing for college / university" },
      { id: "dtc", label: "Disability tax credit forms" },
    ],
  },
  {
    title: "Adolescent / transition",
    items: [
      { id: "tobacco", label: "Tobacco and nicotine use conversation" },
      { id: "alcohol", label: "Alcohol use conversation" },
      { id: "substance", label: "Other substance use conversation" },
      { id: "driver", label: "Driver's licence conversation" },
      { id: "msp", label: "Enrolling in MSP (turning 19 — BC)" },
      { id: "pharmacare", label: "Enrolling in PharmaCare (turning 19 — BC)" },
      { id: "transition", label: "Transition to adult care — including conversation about sharing or not sharing CGM / device data with caregivers" },
    ],
  },
];

type Milestone = { checkedBy?: string; checkedOn?: string };
const INITIAL_MILESTONES: Record<string, Milestone> = {
  "first-visit": { checkedBy: "Dr. Reyes", checkedOn: "08 Mar 2024" },
  "start-cgm": { checkedBy: "Dr. Reyes", checkedOn: "14 Sep 2024" },
  "daycare": { checkedBy: "Dr. Patel", checkedOn: "02 Sep 2023" },
};

const NAV_SECTIONS = [
  { id: "primary-supporters", label: "Primary supporters" },
  { id: "medical-team", label: "Medical team" },
  { id: "medications", label: "Medications" },
  { id: "allergies", label: "Allergies" },
  { id: "hospitalizations", label: "Hospitalizations" },
  { id: "devices", label: "Connected devices" },
  { id: "milestones", label: "Milestones" },
  { id: "insurance", label: "Insurance" },
  { id: "goals", label: "Goals" },
  { id: "other", label: "Other" },
];

// ---------- Shared UI ----------
const card: CSSProperties = {
  background: SURFACE,
  border: `0.5px solid ${BORDER}`,
  borderRadius: 8,
  padding: 24,
  marginBottom: 0,
  scrollMarginTop: 80,
  height: "100%",
  boxSizing: "border-box",
};

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: WF_DARK, margin: "0 0 4px 0" }}>{title}</h2>
      <p style={{ fontSize: 14, color: WF_MID, margin: 0, lineHeight: 1.5 }}>{description}</p>
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled, small }: { children: ReactNode; onClick?: () => void; disabled?: boolean; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? BORDER : TEAL,
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: small ? "6px 12px" : "8px 16px",
        fontSize: small ? 13 : 14,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
      }}
    >{children}</button>
  );
}

function GhostBtn({ children, onClick, small }: { children: ReactNode; onClick?: () => void; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: TEAL,
        border: `1px solid ${TEAL}`,
        borderRadius: 6,
        padding: small ? "5px 10px" : "8px 16px",
        fontSize: small ? 13 : 14,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >{children}</button>
  );
}

function IconBtn({ icon, onClick, label }: { icon: ReactNode; onClick?: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      style={{
        background: "transparent", border: "none", padding: 4, cursor: "pointer",
        color: WF_MID, display: "inline-flex", alignItems: "center",
      }}
    >{icon}</button>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        border: `1px solid ${BORDER}`, borderRadius: 6, padding: "7px 10px",
        fontSize: 14, fontFamily: "inherit", background: SURFACE, color: WF_DARK,
        outline: "none", boxSizing: "border-box", width: "100%",
        ...(props.style || {}),
      }}
    />
  );
}
function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      style={{
        border: `1px solid ${BORDER}`, borderRadius: 6, padding: "7px 10px",
        fontSize: 14, fontFamily: "inherit", background: SURFACE, color: WF_DARK,
        outline: "none", boxSizing: "border-box", width: "100%",
        ...(props.style || {}),
      }}
    />
  );
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{
        border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 10px",
        fontSize: 14, fontFamily: "inherit", background: SURFACE, color: WF_DARK,
        outline: "none", boxSizing: "border-box", width: "100%", resize: "vertical",
        ...(props.style || {}),
      }}
    />
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 12, color: WF_MID, marginBottom: 4, fontWeight: 500 }}>{children}</div>;
}

function StatusBadge({ kind, children }: { kind: "teal" | "gray" | "amber" | "red"; children: ReactNode }) {
  const map = {
    teal: { bg: SUCCESS_BG, fg: SUCCESS_TEXT },
    gray: { bg: "#EEF0F0", fg: WF_MID },
    amber: { bg: WARN_BG, fg: WARN_TEXT },
    red: { bg: "#FDEDEC", fg: ERROR_TEXT },
  }[kind];
  return (
    <span style={{
      background: map.bg, color: map.fg, fontSize: 12, fontWeight: 500,
      padding: "3px 10px", borderRadius: 10, display: "inline-block",
    }}>{children}</span>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontSize: 14, color: WF_MID, fontStyle: "italic",
      padding: "16px 0",
    }}>{children}</div>
  );
}

// ============================================================
// Sections
// ============================================================

function MilestonesSection({ role }: { role: Role }) {
  const [state, setState] = useState<Record<string, Milestone>>(INITIAL_MILESTONES);
  const canWrite = role === "clinician";

  const toggle = (id: string) => {
    if (!canWrite) return;
    setState((cur) => {
      const next = { ...cur };
      if (next[id]) delete next[id];
      else next[id] = { checkedBy: CLINICIAN_NAME, checkedOn: TODAY };
      return next;
    });
  };

  return (
    <div id="milestones" style={card}>
      <SectionHeader
        title="Milestones"
        description="A fixed checklist of important moments in this patient's diabetes journey. Only clinicians can update milestones."
      />
      {MILESTONE_GROUPS.map((g) => (
        <div key={g.title} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
            {g.title}
          </div>
          <div>
            {g.items.map((it) => {
              const m = state[it.id];
              const checked = !!m;
              return (
                <label
                  key={it.id}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    padding: "8px 0", borderBottom: `0.5px solid #f0f2f3`,
                    cursor: canWrite ? "pointer" : "default",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!canWrite}
                    onChange={() => toggle(it.id)}
                    style={{ marginTop: 3, accentColor: TEAL, cursor: canWrite ? "pointer" : "not-allowed" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: WF_DARK, lineHeight: 1.4 }}>{it.label}</div>
                    {checked && m?.checkedBy && (
                      <div style={{ fontSize: 12, color: WF_MID, marginTop: 2 }}>
                        Checked by {m.checkedBy} · {m.checkedOn}
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}
      {!canWrite && (
        <div style={{ fontSize: 12, color: WF_MID, fontStyle: "italic", marginTop: 8 }}>
          Read-only — milestones are managed by the care team.
        </div>
      )}
    </div>
  );
}

// -------- Hospitalizations --------
type Hosp = { id: string; admitted: string; discharged: string; reason?: string; hospital?: string };

function HospitalizationsSection() {
  const [list, setList] = useState<Hosp[]>([
    { id: "h1", admitted: "2024-11-03", discharged: "2024-11-05", reason: "DKA episode following gastroenteritis", hospital: "BC Children's Hospital" },
    { id: "h2", admitted: "2022-06-14", discharged: "2022-06-17", reason: "New T1D diagnosis", hospital: "BC Children's Hospital" },
  ]);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Hosp>({ id: "", admitted: "", discharged: "", reason: "", hospital: "" });

  const sorted = [...list].sort((a, b) => b.admitted.localeCompare(a.admitted));

  const save = () => {
    if (!draft.admitted || !draft.discharged) return;
    if (editingId) {
      setList((cur) => cur.map((x) => (x.id === editingId ? { ...draft, id: editingId } : x)));
    } else {
      setList((cur) => [...cur, { ...draft, id: `h${Date.now()}` }]);
    }
    setAdding(false); setEditingId(null);
    setDraft({ id: "", admitted: "", discharged: "", reason: "", hospital: "" });
  };

  return (
    <div id="hospitalizations" style={card}>
      <SectionHeader title="Hospitalizations" description="Inpatient stays related to diabetes or other significant medical events." />
      {(adding || editingId) && (
        <div style={{
          background: WF_BG, border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: 16, marginBottom: 16,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
        }}>
          <div><FieldLabel>Date admitted *</FieldLabel><Input type="date" value={draft.admitted} onChange={(e) => setDraft({ ...draft, admitted: e.target.value })} /></div>
          <div><FieldLabel>Date discharged *</FieldLabel><Input type="date" value={draft.discharged} onChange={(e) => setDraft({ ...draft, discharged: e.target.value })} /></div>
          <div style={{ gridColumn: "1 / -1" }}><FieldLabel>Reason</FieldLabel><Input value={draft.reason || ""} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} /></div>
          <div style={{ gridColumn: "1 / -1" }}><FieldLabel>Hospital</FieldLabel><Input value={draft.hospital || ""} onChange={(e) => setDraft({ ...draft, hospital: e.target.value })} /></div>
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <GhostBtn small onClick={() => { setAdding(false); setEditingId(null); }}>Cancel</GhostBtn>
            <PrimaryBtn small onClick={save}>{editingId ? "Save changes" : "Add entry"}</PrimaryBtn>
          </div>
        </div>
      )}
      {!adding && !editingId && (
        <div style={{ marginBottom: 12 }}>
          <GhostBtn small onClick={() => { setAdding(true); setDraft({ id: "", admitted: "", discharged: "", reason: "", hospital: "" }); }}>+ Add hospitalization</GhostBtn>
        </div>
      )}
      {sorted.length === 0 ? (
        <EmptyState>No hospitalizations recorded.</EmptyState>
      ) : (
        <div>
          {sorted.map((h) => (
            <div key={h.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "12px 0", borderBottom: `0.5px solid #f0f2f3`,
            }}>
              <div>
                <div style={{ fontSize: 14, color: WF_DARK, fontWeight: 600 }}>
                  {fmtDate(h.admitted)} – {fmtDate(h.discharged)}
                </div>
                {h.reason && <div style={{ fontSize: 13, color: WF_DARK, marginTop: 2 }}>{h.reason}</div>}
                {h.hospital && <div style={{ fontSize: 12, color: WF_MID, marginTop: 2 }}>{h.hospital}</div>}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <IconBtn label="Edit" icon={<Pencil size={14} />} onClick={() => { setEditingId(h.id); setDraft(h); }} />
                <IconBtn label="Delete" icon={<Trash2 size={14} />} onClick={() => setList((cur) => cur.filter((x) => x.id !== h.id))} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -------- Medications --------
type Med = { id: string; name: string; dose?: string; doctor?: string; reason?: string; start?: string };

function MedicationsSection({ role }: { role: Role }) {
  const canWrite = role === "patient";
  const [list, setList] = useState<Med[]>([
    { id: "m1", name: "Humalog", dose: "Variable (carb ratio 1:12)", doctor: "Dr. Reyes", reason: "Mealtime insulin", start: "2022-06-17" },
    { id: "m2", name: "Lantus", dose: "14 units nightly", doctor: "Dr. Reyes", reason: "Basal insulin", start: "2022-06-17" },
    { id: "m3", name: "Vitamin D3", dose: "1000 IU daily", reason: "Supplement", start: "2023-01-10" },
  ]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Med>({ id: "", name: "" });

  const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div id="medications" style={card}>
      <SectionHeader title="Medications" description="Current medications and supplements. Updated by the patient or supporter." />
      {!canWrite && <ReadOnlyHint />}
      {canWrite && adding && (
        <FormGrid>
          <div><FieldLabel>Medication name *</FieldLabel><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
          <div><FieldLabel>Dose</FieldLabel><Input value={draft.dose || ""} onChange={(e) => setDraft({ ...draft, dose: e.target.value })} /></div>
          <div><FieldLabel>Prescribing doctor</FieldLabel><Input value={draft.doctor || ""} onChange={(e) => setDraft({ ...draft, doctor: e.target.value })} /></div>
          <div><FieldLabel>Start date</FieldLabel><Input type="date" value={draft.start || ""} onChange={(e) => setDraft({ ...draft, start: e.target.value })} /></div>
          <div style={{ gridColumn: "1 / -1" }}><FieldLabel>Reason</FieldLabel><Input value={draft.reason || ""} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} /></div>
          <FormFooter
            onCancel={() => setAdding(false)}
            onSave={() => {
              if (!draft.name.trim()) return;
              setList((cur) => [...cur, { ...draft, id: `m${Date.now()}` }]);
              setAdding(false); setDraft({ id: "", name: "" });
            }}
          />
        </FormGrid>
      )}
      {canWrite && !adding && (
        <div style={{ marginBottom: 12 }}>
          <GhostBtn small onClick={() => setAdding(true)}>+ Add medication</GhostBtn>
        </div>
      )}
      {sorted.length === 0 ? (
        <EmptyState>No medications listed.</EmptyState>
      ) : (
        <div>
          {sorted.map((m) => (
            <div key={m.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "12px 0", borderBottom: `0.5px solid #f0f2f3`,
            }}>
              <div>
                <div style={{ fontSize: 14, color: WF_DARK, fontWeight: 600 }}>{m.name}</div>
                {m.dose && <div style={{ fontSize: 13, color: WF_DARK, marginTop: 2 }}>{m.dose}</div>}
                <div style={{ fontSize: 12, color: WF_MID, marginTop: 2 }}>
                  {[m.reason, m.doctor && `Prescribed by ${m.doctor}`, m.start && `Started ${fmtDate(m.start)}`].filter(Boolean).join(" · ")}
                </div>
              </div>
              {canWrite && (
                <IconBtn label="Delete" icon={<Trash2 size={14} />} onClick={() => setList((cur) => cur.filter((x) => x.id !== m.id))} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -------- Allergies --------
type Severity = "Severe" | "Moderate" | "Mild";
type Allergy = { id: string; name: string; reaction?: string; severity?: Severity };

function AllergiesSection({ role }: { role: Role }) {
  const canWrite = role === "patient";
  const [list, setList] = useState<Allergy[]>([
    { id: "a1", name: "Penicillin", reaction: "Hives, swelling", severity: "Severe" },
    { id: "a2", name: "Peanuts", reaction: "Throat tightness", severity: "Moderate" },
    { id: "a3", name: "Latex", reaction: "Skin rash on contact", severity: "Mild" },
  ]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Allergy>({ id: "", name: "" });

  const order: Record<Severity, number> = { Severe: 0, Moderate: 1, Mild: 2 };
  const sorted = [...list].sort((a, b) => {
    const sa = a.severity ? order[a.severity] : 3;
    const sb = b.severity ? order[b.severity] : 3;
    if (sa !== sb) return sa - sb;
    return a.name.localeCompare(b.name);
  });

  const sevColor = (s?: Severity) => s === "Severe" ? "red" : s === "Moderate" ? "amber" : s === "Mild" ? "gray" : "gray";

  return (
    <div id="allergies" style={card}>
      <SectionHeader title="Allergies" description="Known allergies and reactions. Updated by the patient or supporter." />
      {!canWrite && <ReadOnlyHint />}
      {canWrite && adding && (
        <FormGrid>
          <div><FieldLabel>Allergen *</FieldLabel><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
          <div><FieldLabel>Severity</FieldLabel>
            <Select value={draft.severity || ""} onChange={(e) => setDraft({ ...draft, severity: (e.target.value || undefined) as Severity | undefined })}>
              <option value="">—</option><option>Severe</option><option>Moderate</option><option>Mild</option>
            </Select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}><FieldLabel>Reaction</FieldLabel><Input value={draft.reaction || ""} onChange={(e) => setDraft({ ...draft, reaction: e.target.value })} /></div>
          <FormFooter
            onCancel={() => setAdding(false)}
            onSave={() => {
              if (!draft.name.trim()) return;
              setList((cur) => [...cur, { ...draft, id: `a${Date.now()}` }]);
              setAdding(false); setDraft({ id: "", name: "" });
            }}
          />
        </FormGrid>
      )}
      {canWrite && !adding && (
        <div style={{ marginBottom: 12 }}>
          <GhostBtn small onClick={() => setAdding(true)}>+ Add allergy</GhostBtn>
        </div>
      )}
      {sorted.length === 0 ? (
        <div style={{
          display: "inline-block", background: TINT, color: TEAL,
          padding: "8px 14px", borderRadius: 16, fontSize: 14, fontWeight: 600,
        }}>
          ✓ No known allergies
        </div>
      ) : (
        <div>
          {sorted.map((a) => (
            <div key={a.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "12px 0", borderBottom: `0.5px solid #f0f2f3`,
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: WF_DARK, fontWeight: 600 }}>{a.name}</span>
                  {a.severity && <StatusBadge kind={sevColor(a.severity) as "teal" | "gray" | "amber" | "red"}>{a.severity}</StatusBadge>}
                </div>
                {a.reaction && <div style={{ fontSize: 13, color: WF_MID, marginTop: 2 }}>{a.reaction}</div>}
              </div>
              {canWrite && (
                <IconBtn label="Delete" icon={<Trash2 size={14} />} onClick={() => setList((cur) => cur.filter((x) => x.id !== a.id))} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -------- Devices --------
type Device = {
  id: string; type: "CGM" | "Insulin pump" | "Glucometer";
  manufacturer: string; model: string;
  connected: boolean; lastSync?: string; source: "glooko" | "manual";
};

function DevicesSection() {
  const [list, setList] = useState<Device[]>([
    { id: "d1", type: "CGM", manufacturer: "Dexcom", model: "G7", connected: true, lastSync: "12 Jun 2026, 09:14", source: "glooko" },
    { id: "d2", type: "Insulin pump", manufacturer: "Tandem", model: "t:slim X2", connected: true, lastSync: "12 Jun 2026, 08:02", source: "glooko" },
    { id: "d3", type: "Glucometer", manufacturer: "Contour", model: "Next One", connected: false, lastSync: "03 May 2026", source: "manual" },
  ]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Device>({ id: "", type: "CGM", manufacturer: "", model: "", connected: false, source: "manual" });

  return (
    <div id="devices" style={card}>
      <SectionHeader title="Connected devices" description="CGMs, pumps, and meters linked to this patient's account." />
      {adding && (
        <FormGrid>
          <div><FieldLabel>Type</FieldLabel>
            <Select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as Device["type"] })}>
              <option>CGM</option><option>Insulin pump</option><option>Glucometer</option>
            </Select>
          </div>
          <div><FieldLabel>Manufacturer *</FieldLabel><Input value={draft.manufacturer} onChange={(e) => setDraft({ ...draft, manufacturer: e.target.value })} /></div>
          <div><FieldLabel>Model *</FieldLabel><Input value={draft.model} onChange={(e) => setDraft({ ...draft, model: e.target.value })} /></div>
          <div><FieldLabel>Status</FieldLabel>
            <Select value={draft.connected ? "1" : "0"} onChange={(e) => setDraft({ ...draft, connected: e.target.value === "1" })}>
              <option value="1">Connected</option><option value="0">Disconnected</option>
            </Select>
          </div>
          <FormFooter
            onCancel={() => setAdding(false)}
            onSave={() => {
              if (!draft.manufacturer.trim() || !draft.model.trim()) return;
              setList((cur) => [...cur, { ...draft, id: `d${Date.now()}`, source: "manual" }]);
              setAdding(false);
              setDraft({ id: "", type: "CGM", manufacturer: "", model: "", connected: false, source: "manual" });
            }}
          />
        </FormGrid>
      )}
      {!adding && (
        <div style={{ marginBottom: 12 }}>
          <GhostBtn small onClick={() => setAdding(true)}>+ Add device manually</GhostBtn>
        </div>
      )}
      {list.length === 0 ? (
        <EmptyState>No devices connected.</EmptyState>
      ) : (
        <div>
          {list.map((d) => (
            <div key={d.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "12px 0", borderBottom: `0.5px solid #f0f2f3`, gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, color: WF_DARK, fontWeight: 600 }}>{d.manufacturer} {d.model}</span>
                  <span style={{ fontSize: 12, color: WF_MID }}>· {d.type}</span>
                  <StatusBadge kind={d.connected ? "teal" : "gray"}>{d.connected ? "Connected" : "Disconnected"}</StatusBadge>
                </div>
                {d.lastSync && (
                  <div style={{ fontSize: 12, color: WF_MID, marginTop: 4 }}>Last synced: {d.lastSync}</div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {d.source === "glooko" ? (
                  <a href="#" style={{
                    fontSize: 13, color: TEAL, textDecoration: "none", display: "inline-flex",
                    alignItems: "center", gap: 4, fontWeight: 500,
                  }}>
                    Manage in Glooko <ExternalLink size={12} />
                  </a>
                ) : (
                  <>
                    <IconBtn label="Edit" icon={<Pencil size={14} />} />
                    <IconBtn label="Delete" icon={<Trash2 size={14} />} onClick={() => setList((cur) => cur.filter((x) => x.id !== d.id))} />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -------- Insurance --------
type Coverage = "Device supplies" | "Medication" | "Other";
type Insurance = {
  id: string; provider: string; plan?: string; policyId?: string;
  coverage: Coverage[]; country: "Canada" | "US"; notes?: string; primary?: boolean;
};

function InsuranceSection({ role }: { role: Role }) {
  const canWrite = role === "patient";
  const [list, setList] = useState<Insurance[]>([
    { id: "i1", provider: "Pacific Blue Cross", plan: "Family Extended Health", policyId: "PBC-44218-09", coverage: ["Device supplies", "Medication"], country: "Canada", primary: true, notes: "Covers 80% of pump supplies" },
    { id: "i2", provider: "BC PharmaCare", plan: "Plan W", coverage: ["Medication"], country: "Canada" },
  ]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Insurance>({ id: "", provider: "", coverage: [], country: "Canada" });

  const setPrimary = (id: string) => setList((cur) => cur.map((x) => ({ ...x, primary: x.id === id })));

  return (
    <div id="insurance" style={card}>
      <SectionHeader title="Insurance" description="Coverage plans the patient relies on. Patient or supporter manages these entries." />
      {!canWrite && <ReadOnlyHint />}
      {canWrite && adding && (
        <FormGrid>
          <div><FieldLabel>Provider *</FieldLabel><Input value={draft.provider} onChange={(e) => setDraft({ ...draft, provider: e.target.value })} /></div>
          <div><FieldLabel>Plan name</FieldLabel><Input value={draft.plan || ""} onChange={(e) => setDraft({ ...draft, plan: e.target.value })} /></div>
          <div><FieldLabel>Policy / member ID</FieldLabel><Input value={draft.policyId || ""} onChange={(e) => setDraft({ ...draft, policyId: e.target.value })} /></div>
          <div><FieldLabel>Country</FieldLabel>
            <Select value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value as "Canada" | "US" })}>
              <option>Canada</option><option>US</option>
            </Select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <FieldLabel>Coverage</FieldLabel>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {(["Device supplies", "Medication", "Other"] as Coverage[]).map((c) => (
                <label key={c} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 14, color: WF_DARK }}>
                  <input
                    type="checkbox"
                    checked={draft.coverage.includes(c)}
                    onChange={(e) => setDraft({
                      ...draft,
                      coverage: e.target.checked ? [...draft.coverage, c] : draft.coverage.filter((x) => x !== c),
                    })}
                    style={{ accentColor: TEAL }}
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>
          <div style={{ gridColumn: "1 / -1" }}><FieldLabel>Notes</FieldLabel><Textarea rows={2} value={draft.notes || ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></div>
          <FormFooter
            onCancel={() => setAdding(false)}
            onSave={() => {
              if (!draft.provider.trim()) return;
              setList((cur) => [...cur, { ...draft, id: `i${Date.now()}` }]);
              setAdding(false);
              setDraft({ id: "", provider: "", coverage: [], country: "Canada" });
            }}
          />
        </FormGrid>
      )}
      {canWrite && !adding && (
        <div style={{ marginBottom: 12 }}>
          <GhostBtn small onClick={() => setAdding(true)}>+ Add insurance</GhostBtn>
        </div>
      )}
      {list.length === 0 ? (
        <EmptyState>No insurance information added.</EmptyState>
      ) : (
        <div>
          {list.map((p, idx) => (
            <div key={p.id} style={{
              padding: "12px 0", borderBottom: `0.5px solid #f0f2f3`,
              display: "flex", justifyContent: "space-between", gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, color: WF_DARK, fontWeight: 600 }}>{p.provider}</span>
                  {(p.primary || (!list.some((x) => x.primary) && idx === 0)) && <StatusBadge kind="teal">Primary</StatusBadge>}
                  <StatusBadge kind="gray">{p.country}</StatusBadge>
                </div>
                {p.plan && <div style={{ fontSize: 13, color: WF_DARK, marginTop: 2 }}>{p.plan}</div>}
                {p.policyId && <div style={{ fontSize: 12, color: WF_MID, marginTop: 2 }}>ID: {p.policyId}</div>}
                {p.coverage.length > 0 && <div style={{ fontSize: 12, color: WF_MID, marginTop: 2 }}>Coverage: {p.coverage.join(", ")}</div>}
                {p.notes && <div style={{ fontSize: 12, color: WF_MID, marginTop: 4, fontStyle: "italic" }}>{p.notes}</div>}
                {canWrite && !p.primary && (
                  <button onClick={() => setPrimary(p.id)} style={{
                    background: "none", border: "none", color: TEAL, fontSize: 12, cursor: "pointer",
                    padding: 0, marginTop: 6, fontFamily: "inherit", textDecoration: "underline",
                  }}>Make primary</button>
                )}
              </div>
              {canWrite && (
                <IconBtn label="Delete" icon={<Trash2 size={14} />} onClick={() => setList((cur) => cur.filter((x) => x.id !== p.id))} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -------- Goals --------
type Goal = { id: string; text: string; target?: string; completed?: boolean };

function GoalsSection({ role }: { role: Role }) {
  const canWrite = role === "patient";
  const [list, setList] = useState<Goal[]>([
    { id: "g1", text: "Spend more time in range during school hours", target: "2026-09-01" },
    { id: "g2", text: "Carb-count snacks independently" },
    { id: "g3", text: "Try one new sport this summer", target: "2026-08-15" },
    { id: "g4", text: "Complete pump training course", completed: true },
  ]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Goal>({ id: "", text: "" });
  const [showPast, setShowPast] = useState(false);

  const active = list.filter((g) => !g.completed).sort((a, b) => {
    if (!a.target && !b.target) return 0;
    if (!a.target) return 1;
    if (!b.target) return -1;
    return a.target.localeCompare(b.target);
  });
  const past = list.filter((g) => g.completed);

  return (
    <div id="goals" style={card}>
      <SectionHeader title="Goals" description="Patient-set goals. The care team can see them but only the patient or supporter edits." />
      {!canWrite && <ReadOnlyHint />}
      {canWrite && adding && (
        <FormGrid>
          <div style={{ gridColumn: "1 / -1" }}><FieldLabel>Goal *</FieldLabel><Input value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} placeholder="e.g. Walk after dinner three nights a week" /></div>
          <div><FieldLabel>Target date</FieldLabel><Input type="date" value={draft.target || ""} onChange={(e) => setDraft({ ...draft, target: e.target.value })} /></div>
          <div />
          <FormFooter
            onCancel={() => setAdding(false)}
            onSave={() => {
              if (!draft.text.trim()) return;
              setList((cur) => [...cur, { ...draft, id: `g${Date.now()}` }]);
              setAdding(false); setDraft({ id: "", text: "" });
            }}
          />
        </FormGrid>
      )}
      {canWrite && !adding && (
        <div style={{ marginBottom: 12 }}>
          <GhostBtn small onClick={() => setAdding(true)}>+ Add goal</GhostBtn>
        </div>
      )}
      {active.length === 0 && past.length === 0 ? (
        <EmptyState>No goals set yet.</EmptyState>
      ) : (
        <div>
          {active.map((g) => (
            <div key={g.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "12px 0", borderBottom: `0.5px solid #f0f2f3`, gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: WF_DARK }}>{g.text}</div>
                {g.target && <div style={{ fontSize: 12, color: WF_MID, marginTop: 2 }}>Target: {fmtDate(g.target)}</div>}
              </div>
              {canWrite && (
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <button onClick={() => setList((cur) => cur.map((x) => x.id === g.id ? { ...x, completed: true } : x))} style={{
                    background: "none", border: `1px solid ${TEAL}`, color: TEAL, fontSize: 12,
                    padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
                  }}>Mark complete</button>
                  <IconBtn label="Delete" icon={<Trash2 size={14} />} onClick={() => setList((cur) => cur.filter((x) => x.id !== g.id))} />
                </div>
              )}
            </div>
          ))}
          {past.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <button onClick={() => setShowPast((v) => !v)} style={{
                background: "none", border: "none", color: TEAL, fontSize: 13, cursor: "pointer",
                padding: 0, fontFamily: "inherit", fontWeight: 500,
              }}>
                {showPast ? "▾" : "▸"} Past goals ({past.length})
              </button>
              {showPast && (
                <div style={{ marginTop: 8 }}>
                  {past.map((g) => (
                    <div key={g.id} style={{
                      padding: "8px 0", borderBottom: `0.5px solid #f0f2f3`,
                      fontSize: 13, color: WF_MID, textDecoration: "line-through",
                    }}>{g.text}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// -------- Supporters --------
type Supporter = { id: string; name: string; relationship: string; contact: string; status: "Active" | "Invited" | "Inactive" };

function SupportersSection({ role }: { role: Role }) {
  const list: Supporter[] = [
    { id: "s1", name: "Margaret Chen", relationship: "Mother", contact: "margaret.chen@example.com", status: "Active" },
    { id: "s2", name: "David Chen", relationship: "Father", contact: "david.chen@example.com · (604) 555-0124", status: "Active" },
    { id: "s3", name: "Aunt Lisa", relationship: "Aunt / emergency contact", contact: "lisa.wong@example.com", status: "Invited" },
  ];
  const statusKind = (s: Supporter["status"]) => s === "Active" ? "teal" : s === "Invited" ? "amber" : "gray";

  return (
    <div id="supporters" style={card}>
      <SectionHeader title="Supporters" description="People connected to this patient's account. Read-only here — manage from the supporters page." />
      {list.length === 0 ? (
        <EmptyState>No supporters added.</EmptyState>
      ) : (
        <div>
          {list.map((s) => (
            <div key={s.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "12px 0", borderBottom: `0.5px solid #f0f2f3`, gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, color: WF_DARK, fontWeight: 600 }}>{s.name}</span>
                  <span style={{ fontSize: 13, color: WF_MID }}>· {s.relationship}</span>
                  <StatusBadge kind={statusKind(s.status) as "teal" | "amber" | "gray"}>{s.status}</StatusBadge>
                </div>
                <div style={{ fontSize: 13, color: WF_MID, marginTop: 2 }}>{s.contact}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {role === "patient" && (
        <div style={{ marginTop: 12 }}>
          <a href="#" style={{ fontSize: 13, color: TEAL, fontWeight: 500, textDecoration: "none" }}>Manage supporters →</a>
        </div>
      )}
    </div>
  );
}

// -------- Other --------
function OtherSection() {
  const [value, setValue] = useState("");
  const [meta, setMeta] = useState<{ by: string; on: string } | null>(null);
  return (
    <div id="other" style={card}>
      <SectionHeader title="Other" description="Free-text notes anyone on the care team can add or update." />
      <Textarea
        rows={5}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add any additional context about this patient."
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <div style={{ fontSize: 12, color: WF_MID }}>
          {meta && <>Last edited by {meta.by} on {meta.on}</>}
        </div>
        <PrimaryBtn small onClick={() => setMeta({ by: CLINICIAN_NAME, on: TODAY })}>Save</PrimaryBtn>
      </div>
    </div>
  );
}

// ---------- Form helpers ----------
function FormGrid({ children }: { children: ReactNode }) {
  return (
    <div style={{
      background: WF_BG, border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: 16, marginBottom: 16,
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
    }}>{children}</div>
  );
}
function FormFooter({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return (
    <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, justifyContent: "flex-end" }}>
      <GhostBtn small onClick={onCancel}>Cancel</GhostBtn>
      <PrimaryBtn small onClick={onSave}>Add entry</PrimaryBtn>
    </div>
  );
}
function ReadOnlyHint() {
  return (
    <div style={{
      background: WF_BG, border: `0.5px dashed ${BORDER}`, borderRadius: 6,
      padding: "8px 12px", fontSize: 12, color: WF_MID, marginBottom: 12, fontStyle: "italic",
    }}>Read-only for clinicians — patients and supporters maintain this section.</div>
  );
}

function fmtDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ============================================================
// Primary supporters (read-only) + Medical team (editable)
// ============================================================
type PrimarySupporter = { id: string; name: string; relationship: string; email: string; phone: string };
const PRIMARY_SUPPORTERS: PrimarySupporter[] = [
  { id: "ps1", name: "Margaret Chen", relationship: "Parent", email: "margaret.chen@example.com", phone: "(604) 555-0123" },
  { id: "ps2", name: "David Chen", relationship: "Parent", email: "david.chen@example.com", phone: "(604) 555-0124" },
  { id: "ps3", name: "Lisa Wong", relationship: "Family", email: "lisa.wong@example.com", phone: "(604) 555-0188" },
];

function PrimarySupportersCard() {
  return (
    <div id="primary-supporters" style={card}>
      <SectionHeader
        title="Primary supporters"
        description="People connected to this patient's account. Read-only here — manage from the supporters page."
      />
      {PRIMARY_SUPPORTERS.length === 0 ? (
        <EmptyState>No supporters added.</EmptyState>
      ) : (
        <div>
          {PRIMARY_SUPPORTERS.map((s) => (
            <div key={s.id} style={{ padding: "12px 0", borderBottom: `0.5px solid #f0f2f3` }}>
              <div style={{ fontSize: 14, color: WF_DARK, fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: 13, color: WF_MID, marginTop: 2 }}>{s.relationship}</div>
              <div style={{ fontSize: 13, color: WF_DARK, marginTop: 2 }}>{s.email}</div>
              <div style={{ fontSize: 13, color: WF_DARK, marginTop: 2 }}>{s.phone}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type MedicalRole = "Family doctor" | "Specialist" | "Other";
type MedicalMember = { id: string; name: string; role: MedicalRole; email: string; phone: string; clinic: string };
const INITIAL_MEDICAL_TEAM: MedicalMember[] = [
  { id: "mt1", name: "Dr. Patricia Wong", role: "Family doctor", email: "p.wong@familymed.ca", phone: "604-555-0182", clinic: "UBC Family Medicine" },
];

function MedicalTeamCard() {
  const [list, setList] = useState<MedicalMember[]>(INITIAL_MEDICAL_TEAM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const blank: MedicalMember = { id: "", name: "", role: "Family doctor", email: "", phone: "", clinic: "" };
  const [draft, setDraft] = useState<MedicalMember>(blank);

  const save = () => {
    if (!draft.name.trim()) return;
    if (editingId) {
      setList((cur) => cur.map((x) => (x.id === editingId ? { ...draft, id: editingId } : x)));
    } else {
      setList((cur) => [...cur, { ...draft, id: `mt${Date.now()}` }]);
    }
    setAdding(false); setEditingId(null); setDraft(blank);
  };

  return (
    <div id="medical-team" style={card}>
      <SectionHeader
        title="Medical team"
        description="Medical professionals working with this patient outside this clinic. Can be edited by both patient and clinicians."
      />
      {(adding || editingId) && (
        <div style={{
          background: WF_BG, border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: 16, marginBottom: 16,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
        }}>
          <div><FieldLabel>Name *</FieldLabel><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
          <div><FieldLabel>Role</FieldLabel>
            <Select value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value as MedicalRole })}>
              <option>Family doctor</option>
              <option>Specialist</option>
              <option>Other</option>
            </Select>
          </div>
          <div><FieldLabel>Email</FieldLabel><Input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></div>
          <div><FieldLabel>Phone</FieldLabel><Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></div>
          <div style={{ gridColumn: "1 / -1" }}><FieldLabel>Clinic name</FieldLabel><Input value={draft.clinic} onChange={(e) => setDraft({ ...draft, clinic: e.target.value })} /></div>
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <GhostBtn small onClick={() => { setAdding(false); setEditingId(null); setDraft(blank); }}>Cancel</GhostBtn>
            <PrimaryBtn small onClick={save}>{editingId ? "Save changes" : "Add entry"}</PrimaryBtn>
          </div>
        </div>
      )}
      {!adding && !editingId && (
        <div style={{ marginBottom: 12 }}>
          <GhostBtn small onClick={() => { setAdding(true); setDraft(blank); }}>+ Add team member</GhostBtn>
        </div>
      )}
      {list.length === 0 ? (
        <EmptyState>No team members added.</EmptyState>
      ) : (
        <div>
          {list.map((m) => (
            <div key={m.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "12px 0", borderBottom: `0.5px solid #f0f2f3`, gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: WF_DARK, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: WF_MID, marginTop: 2 }}>{m.role}</div>
                {m.email && <div style={{ fontSize: 13, color: WF_DARK, marginTop: 2 }}>{m.email}</div>}
                {m.phone && <div style={{ fontSize: 13, color: WF_DARK, marginTop: 2 }}>{m.phone}</div>}
                {m.clinic && <div style={{ fontSize: 13, color: WF_MID, marginTop: 2 }}>{m.clinic}</div>}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <IconBtn label="Edit" icon={<Pencil size={14} />} onClick={() => { setEditingId(m.id); setDraft(m); setAdding(false); }} />
                <IconBtn label="Delete" icon={<Trash2 size={14} />} onClick={() => setList((cur) => cur.filter((x) => x.id !== m.id))} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Page shell
// ============================================================
function CareProfilePage() {
  const { patientId } = Route.useParams();
  const [role, setRole] = useState<Role>("clinician");
  const [active, setActive] = useState("primary-supporters");

  // Scroll-spy
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    NAV_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const rowTwoCols: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 };
  const rowThreeCols: CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 };

  return (
    <AdminShell heading="">
      <div style={{ margin: "-32px", background: WF_BG, minHeight: "100vh" }}>
        {/* Top header */}
        <div style={{
          background: SURFACE, borderBottom: `0.5px solid ${BORDER}`,
          padding: "16px 24px", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16, flexWrap: "wrap",
        }}>
          <div>
            <Link
              to="/dashboard/$patientId"
              params={{ patientId }}
              style={{ fontSize: 13, color: TEAL, textDecoration: "none", fontWeight: 500 }}
            >
              ← Back to dashboard
            </Link>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: WF_DARK, margin: "6px 0 2px 0" }}>
              {PATIENT_NAME}
            </h1>
            <div style={{ fontSize: 13, color: WF_MID }}>Care profile</div>
          </div>
          <RoleToggle role={role} setRole={setRole} />
        </div>

        {/* Horizontal tab bar */}
        <div style={{
          background: SURFACE, borderBottom: `0.5px solid ${BORDER}`,
          padding: "10px 24px", overflowX: "auto", whiteSpace: "nowrap",
        }}>
          <div style={{ display: "inline-flex", gap: 6 }}>
            {NAV_SECTIONS.map((s) => {
              const a = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  style={{
                    background: a ? TINT : "transparent",
                    color: a ? TEAL : WF_DARK,
                    border: "none",
                    borderRadius: 999,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: a ? 600 : 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content grid */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={rowTwoCols}>
            <PrimarySupportersCard />
            <MedicalTeamCard />
          </div>
          <div style={rowThreeCols}>
            <MedicationsSection role={role} />
            <AllergiesSection role={role} />
            <HospitalizationsSection />
          </div>
          <div style={rowTwoCols}>
            <DevicesSection />
            <MilestonesSection role={role} />
          </div>
          <InsuranceSection role={role} />
          <GoalsSection role={role} />
          <OtherSection />
        </div>
      </div>
    </AdminShell>
  );
}

function RoleToggle({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  const opts: { v: Role; label: string }[] = [
    { v: "clinician", label: "Clinician" },
    { v: "patient", label: "Patient" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 12, color: WF_MID }}>View as</span>
      <div style={{ display: "inline-flex", border: `1px solid ${BORDER}`, borderRadius: 999, overflow: "hidden" }}>
        {opts.map((o) => {
          const a = role === o.v;
          return (
            <button
              key={o.v}
              onClick={() => setRole(o.v)}
              style={{
                background: a ? TEAL : SURFACE,
                color: a ? "#fff" : WF_DARK,
                border: "none", padding: "6px 14px", fontSize: 13, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >{o.label}</button>
          );
        })}
      </div>
    </div>
  );
}

function useIsNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const handler = () => setNarrow(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return narrow;
}

// Silence unused-import lints in case tree-shake leaves them flagged
