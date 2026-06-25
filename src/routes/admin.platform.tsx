import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Select } from "@/components/patient-ui";
import { WF_DARK, WF_MID, WF_BG, BORDER, TEAL, SURFACE } from "@/components/wireframe";
import { usePlatformConfig } from "@/lib/platform-config";

export const Route = createFileRoute("/admin/platform")({
  component: PlatformConfig,
});

const SORT_OPTIONS = ["At-risk first", "Longest unseen", "Soonest appointment", "Alphabetical (A–Z)"];
const DEFAULT_CHAT_MSG =
  "Our team reviews messages during clinic hours, Monday–Friday 9am–5pm. For urgent concerns, please contact the clinic directly.";

function DescriptionBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#f7f8f8",
        borderLeft: `3px solid ${TEAL}`,
        borderRadius: 4,
        padding: "8px 12px",
        fontSize: 14,
        color: WF_MID,
        lineHeight: 1.6,
        marginBottom: 18,
      }}
    >
      {children}
    </div>
  );
}

function PlatformConfig() {
  return (
    <AdminShell heading="">
      <h1 style={{ fontSize: 24, fontWeight: 700, color: TEAL, margin: "0 0 24px" }}>
        Platform configuration
      </h1>

      <ChatSection />
      <Divider />
      <CliniciansSection />
      <Divider />
      <RosterColumnsSection />
      <Divider />
      <RosterSection />

      <PrototypeBack to="/admin" />
    </AdminShell>
  );
}

function Divider() {
  return <div style={{ height: 1, background: WF_MID, opacity: 0.6, margin: "20px 0" }} />;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}66`, padding: 24, borderRadius: 8 }}>
      <h2 style={{ fontSize: 17, fontWeight: 600, color: WF_DARK, margin: "0 0 14px" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, padding: "14px 0" }}>
      {children}
    </div>
  );
}

function LabelBlock({ label, helper }: { label: string; helper?: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 16, color: WF_DARK, fontWeight: 500 }}>{label}</div>
      {helper && <div style={{ fontSize: 13, color: WF_MID, marginTop: 3, lineHeight: 1.5 }}>{helper}</div>}
    </div>
  );
}

function useFade(active: boolean, ms = 2000) {
  const [show, setShow] = useState(active);
  useEffect(() => {
    if (!active) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), ms);
    return () => clearTimeout(t);
  }, [active, ms]);
  return show;
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      style={{
        width: 40,
        height: 22,
        border: "none",
        background: on ? TEAL : BORDER,
        position: "relative",
        cursor: "pointer",
        padding: 0,
        borderRadius: 999,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 20 : 2,
          width: 18,
          height: 18,
          background: "#fff",
          borderRadius: "50%",
          transition: "left 120ms",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

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

/* ----------------- Chat ----------------- */

function ChatSection() {
  const { config, setConfig } = usePlatformConfig();
  const enabled = config.chatEnabled;
  const [savedEnabledAt, setSavedEnabledAt] = useState(0);

  const [msg, setMsg] = useState(DEFAULT_CHAT_MSG);
  const initial = useRef(DEFAULT_CHAT_MSG);
  const [savedMsgAt, setSavedMsgAt] = useState(0);
  const dirty = msg !== initial.current;

  return (
    <SectionCard title="Chat">
      <DescriptionBox>
        One-on-one direct messages between clinicians and patients or their supporters.
      </DescriptionBox>
      <Row>
        <LabelBlock
          label="Enable chat"
          helper="When disabled, the chat icon is hidden from all users in this clinic."
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <SavedFlash when={savedEnabledAt} />
          <Toggle
            on={enabled}
            onClick={() => {
              setConfig({ ...config, chatEnabled: !config.chatEnabled });
              setSavedEnabledAt(Date.now());
            }}
          />
        </div>
      </Row>

      <div
        style={{
          maxHeight: enabled ? 400 : 0,
          opacity: enabled ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 200ms ease, opacity 200ms ease",
        }}
      >
        <div style={{ borderTop: `0.5px solid ${WF_MID}`, paddingTop: 14, marginTop: 6 }}>
          <LabelBlock
            label="Persistent chat message"
            helper="Set the message shown to patients when they open the chat.\u00a0"
          />
          <textarea
            value={msg}
            maxLength={160}
            onChange={(e) => setMsg(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              marginTop: 10,
              padding: "8px 12px",
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              background: WF_BG,
              fontSize: 16,
              color: WF_DARK,
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            <span style={{ fontSize: 13, color: WF_MID }}>{msg.length} / 160</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SavedFlash when={savedMsgAt} />
              {dirty && (
                <Btn
                  primary
                  onClick={() => {
                    initial.current = msg;
                    setSavedMsgAt(Date.now());
                  }}
                >
                  Save
                </Btn>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* ----------------- Clinician role definitions ----------------- */

function CliniciansSection() {
  const rows: Array<{ label: string; helper: string }> = [
    {
      label: "Patient management",
      helper:
        "Allow clinicians to add new patients and edit existing patient information, including inviting additional supporters to the platform.",
    },
    {
      label: "Form library",
      helper: "Allow clinicians to create new form templates and edit existing ones.",
    },
    {
      label: "Task library",
      helper: "Allow clinicians to create new task templates and edit existing ones.",
    },
    {
      label: "Resource library",
      helper: "Allow clinicians access to add new patient resources and edit existing ones.",
    },
  ];

  const [states, setStates] = useState<boolean[]>(() => rows.map(() => false));
  const [savedAt, setSavedAt] = useState<number[]>(() => rows.map(() => 0));

  return (
    <SectionCard title="Clinician permissions">
      <DescriptionBox>
        Control which parts of the admin section clinicians can access. These permissions apply to all clinician accounts in this clinic.
      </DescriptionBox>
      {rows.map((r, i) => (
        <div key={r.label} style={{ borderTop: i === 0 ? "none" : `0.5px solid ${BORDER}66` }}>
          <Row>
            <LabelBlock label={r.label} helper={r.helper} />
            <div style={{ display: "flex", alignItems: "center" }}>
              <SavedFlash when={savedAt[i]} />
              <Toggle
                on={states[i]}
                onClick={() => {
                  setStates((prev) => prev.map((v, j) => (j === i ? !v : v)));
                  setSavedAt((prev) => prev.map((v, j) => (j === i ? Date.now() : v)));
                }}
              />
            </div>
          </Row>
        </div>
      ))}
    </SectionCard>
  );
}

/* ----------------- Patient roster columns ----------------- */

type ColKey =
  | "devices"
  | "lastVisit"
  | "nextAppt"
  | "hospitalVisits"
  | "pendingForms"
  | "pendingTasks";

type FlagKey = "a1c" | "lowTIR" | "gmi" | "dd" | "dka";
type FlagState = { clinician: boolean; patient: boolean };

const FLAG_ROWS: Array<{ key: FlagKey; label: string; helper: string }> = [
  {
    key: "a1c",
    label: "A1c",
    helper:
      "Predicted A1c above [X]% in the next 90 days, based on trend analysis of the patient's CGM and device data.",
  },
  {
    key: "lowTIR",
    label: "Low TIR (14d)",
    helper:
      "Patients whose glucose has been within the target range (3.9–10.0 mmol/L) less than 70% of the time over the past 14 days.",
  },
  {
    key: "gmi",
    label: "GMI",
    helper:
      "Patients with a Glucose Management Indicator above [X]% over the past 14 days, suggesting suboptimal average glucose control.",
  },
  {
    key: "dd",
    label: "DD",
    helper:
      "Patients or supporters who have scored above the distress threshold on the PAID (Problem Areas in Diabetes) questionnaire — a self-reported tool, not a clinical diagnosis. Flag appears when the questionnaire has been completed and the score meets the threshold.",
  },
  {
    key: "dka",
    label: "DKA",
    helper:
      "Patients identified as being at elevated risk for diabetic ketoacidosis, based on population-level trend modelling. This is a predictive flag, not a clinical confirmation of DKA.",
  },
];

function RosterColumnsSection() {
  const primaryCols: Array<{ key: ColKey; label: string; helper?: string }> = [
    {
      key: "devices",
      label: "Devices",
      helper: "Connected devices.",
    },
    {
      key: "lastVisit",
      label: "Last appointment",
      helper: "Last time the patient was seen by the clinic, in person or virtually.",
    },
    {
      key: "nextAppt",
      label: "Next appointment",
      helper:
        "Next time patient is scheduled for an appointment with the clinic, in person or virtually.",
    },
  ];

  const accordionCols: Array<{ key: ColKey; label: string; helper?: string }> = [
    {
      key: "hospitalVisits",
      label: "Hospital visits",
      helper:
        "Self-reported by patient or supporter via the Care Profile. A pre-appointment task can be automatically assigned to prompt the patient to update this information before each visit.",
    },
    {
      key: "pendingForms",
      label: "Pending forms",
      helper: "Number of forms awaiting completion by the patient or supporter.",
    },
    {
      key: "pendingTasks",
      label: "Pending tasks",
      helper: "Number of tasks awaiting completion by the patient or supporter.",
    },
  ];

  const { config, setConfig } = usePlatformConfig();

  type PrimaryKey = "devices" | "lastVisit" | "nextAppt";
  const [cols, setCols] = useState<Record<PrimaryKey, boolean>>({
    devices: true,
    lastVisit: true,
    nextAppt: true,
  });
  const [savedAt, setSavedAt] = useState<Record<ColKey, number>>({
    devices: 0,
    lastVisit: 0,
    nextAppt: 0,
    hospitalVisits: 0,
    pendingForms: 0,
    pendingTasks: 0,
  });

  const flags = config.flags;

  const togglePrimary = (k: PrimaryKey) => {
    setCols((p) => ({ ...p, [k]: !p[k] }));
    setSavedAt((p) => ({ ...p, [k]: Date.now() }));
  };

  const toggleAccordion = (k: "hospitalVisits" | "pendingForms" | "pendingTasks") => {
    setConfig({
      ...config,
      accordionCols: { ...config.accordionCols, [k]: !config.accordionCols[k] },
    });
    setSavedAt((p) => ({ ...p, [k]: Date.now() }));
  };

  return (
    <SectionCard title="Patient roster columns">
      <DescriptionBox>
        Choose which columns appear on the patient roster. Patient (name, DOB, age) and the Dashboard button are always shown and cannot be removed.
      </DescriptionBox>

      {/* Locked: Patient */}
      <LockedRow
        label="Patient first and last name, date of birth, age"
        helper="Patient's name as shown on their official document, their date of birth and age."
      />

      {/* Flags sub-section */}
      <div style={{ borderTop: `0.5px solid ${BORDER}66` }}>
        <Row>
          <LabelBlock
            label="Flags for clinicians and patients"
            helper="Risk indicators derived from two sources: population-level machine learning models (A1c, DKA) and the patient's own device and questionnaire data (TIR, GMI, DD)."
          />
        </Row>
        <div
          style={{
            background: WF_BG,
            border: `0.5px solid ${BORDER}`,
            borderRadius: 6,
            padding: "10px 0",
            marginTop: 8,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 140px 140px",
              padding: "6px 14px",
              fontSize: 11,
              color: WF_MID,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              fontWeight: 600,
            }}
          >
            <div>Flag</div>
            <div style={{ textAlign: "center" }}>Visible to clinicians</div>
            <div style={{ textAlign: "center" }}>Visible to patients</div>
          </div>
          {FLAG_ROWS.map((f, i) => (
            <div
              key={f.key}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 140px",
                alignItems: "start",
                padding: "10px 14px",
                borderTop: i === 0 ? `0.5px solid ${BORDER}66` : `0.5px solid ${BORDER}66`,
              }}
            >
              <LabelBlock label={f.label} helper={f.helper} />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Toggle
                  on={flags[f.key].clinician}
                  onClick={() =>
                    setConfig({
                      ...config,
                      flags: {
                        ...config.flags,
                        [f.key]: { ...config.flags[f.key], clinician: !config.flags[f.key].clinician },
                      },
                    })
                  }
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Toggle
                  on={flags[f.key].patient}
                  onClick={() =>
                    setConfig({
                      ...config,
                      flags: {
                        ...config.flags,
                        [f.key]: { ...config.flags[f.key], patient: !config.flags[f.key].patient },
                      },
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {primaryCols.map((c) => (
        <div key={c.key} style={{ borderTop: `0.5px solid ${BORDER}66` }}>
          <Row>
            <LabelBlock label={c.label} helper={c.helper} />
            <div style={{ display: "flex", alignItems: "center" }}>
              <SavedFlash when={savedAt[c.key]} />
              <Toggle on={cols[c.key]} onClick={() => toggle(c.key)} />
            </div>
          </Row>
        </div>
      ))}
      <div style={{ borderTop: `0.5px solid ${BORDER}66` }}>
        <LockedRow
          label="Dashboard button"
          helper="Opens the patient's full clinical dashboard, including glucose trends, insulin data, tasks, forms, and recommendations."
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 24,
          marginBottom: 4,
          paddingTop: 16,
          borderTop: `1px dashed ${BORDER}`,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: TEAL,
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          ↳ Accordion row
        </span>
        <span style={{ fontSize: 12, color: WF_MID, fontStyle: "italic" }}>
          Expanded when a clinician opens a patient row
        </span>
      </div>
      {accordionCols.map((c, i) => (
        <div key={c.key} style={{ borderTop: i === 0 ? "none" : `0.5px solid ${BORDER}66` }}>
          <Row>
            <LabelBlock label={c.label} helper={c.helper} />
            <div style={{ display: "flex", alignItems: "center" }}>
              <SavedFlash when={savedAt[c.key]} />
              <Toggle on={cols[c.key]} onClick={() => toggle(c.key)} />
            </div>
          </Row>
        </div>
      ))}

      {/* Preview */}
      <div
        style={{
          fontSize: 13,
          color: WF_MID,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginTop: 24,
          marginBottom: 10,
          fontWeight: 600,
        }}
      >
        Preview
      </div>
      <RosterPreview cols={cols} />
    </SectionCard>
  );
}

function LockedRow({ label, helper }: { label: string; helper?: string }) {
  return (
    <Row>
      <LabelBlock label={label} helper={helper} />
      <div style={{ display: "flex", alignItems: "center", fontSize: 14, color: WF_MID, fontStyle: "italic" }}>
        Always shown
      </div>
    </Row>
  );
}

function RosterPreview({ cols }: { cols: Record<ColKey, boolean> }) {
  const headers: Array<{ key: ColKey | "patient" | "dash"; label: string }> = [
    { key: "patient", label: "Patient" },
  ];
  if (cols.devices) headers.push({ key: "devices", label: "Devices" });
  if (cols.lastVisit) headers.push({ key: "lastVisit", label: "Last appointment" });
  if (cols.nextAppt) headers.push({ key: "nextAppt", label: "Next appt" });
  headers.push({ key: "dash", label: "" });

  const cellStyle: React.CSSProperties = {
    padding: "10px 12px",
    fontSize: 13,
    color: WF_DARK,
    borderBottom: `1px solid ${BORDER}66`,
    verticalAlign: "middle",
  };
  const headStyle: React.CSSProperties = {
    ...cellStyle,
    fontWeight: 600,
    color: WF_MID,
    background: WF_BG,
    textTransform: "uppercase",
    fontSize: 11,
    letterSpacing: 0.5,
  };

  return (
    <div
      style={{
        border: `1px solid ${BORDER}66`,
        borderRadius: 8,
        overflow: "hidden",
        background: SURFACE,
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h.key} style={{ ...headStyle, textAlign: "left" }}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {headers.map((h) => (
                <td key={h.key} style={cellStyle}>
                  {renderCell(h.key)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderCell(key: string) {
  switch (key) {
    case "patient":
      return (
        <div>
          <div style={{ fontWeight: 600, color: WF_DARK }}>Emma Tremblay</div>
          <div style={{ fontSize: 12, color: WF_MID, marginTop: 2 }}>4 Aug 2014 · Age 11</div>
        </div>
      );
    case "risk":
      return (
        <span
          style={{
            display: "inline-block",
            padding: "2px 8px",
            background: WF_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 999,
            fontSize: 12,
            color: WF_DARK,
            fontWeight: 600,
          }}
        >
          A1c
        </span>
      );
    case "tir":
      return <span style={{ color: "#B45309", fontWeight: 600 }}>65%</span>;
    case "gmi":
      return <span>7.5%</span>;
    case "devices":
      return (
        <div style={{ display: "flex", gap: 6 }}>
          <span
            style={{
              padding: "2px 8px",
              background: TEAL,
              color: "#fff",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            CGM
          </span>
          <span
            style={{
              padding: "2px 8px",
              background: WF_BG,
              color: WF_MID,
              border: `1px solid ${BORDER}`,
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Pump
          </span>
        </div>
      );
    case "lastVisit":
      return <span>14 Feb 2026</span>;
    case "nextAppt":
      return (
        <div>
          <div style={{ color: WF_DARK, fontWeight: 600 }}>Today</div>
          <div style={{ fontSize: 12, color: WF_MID }}>2:00 PM</div>
        </div>
      );
    case "dash":
      return (
        <button
          type="button"
          style={{
            padding: "6px 12px",
            background: TEAL,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Dashboard
        </button>
      );
    default:
      return null;
  }
}

/* ----------------- Roster ----------------- */

function RosterSection() {
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const initial = useRef(SORT_OPTIONS[0]);
  const [savedAt, setSavedAt] = useState(0);
  const dirty = sort !== initial.current;

  return (
    <SectionCard title="Patient roster defaults">
      <div style={{ paddingTop: 6 }}>
        <LabelBlock
          label="Default sort order for the clinician's patient roster"
          helper="Clinicians can override this per session without changing this clinic-wide default."
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
          <div style={{ maxWidth: 300, flex: 1 }}>
            <Select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
          </div>
          <SavedFlash when={savedAt} />
          {dirty && (
            <Btn
              primary
              onClick={() => {
                initial.current = sort;
                setSavedAt(Date.now());
              }}
            >
              Save
            </Btn>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
