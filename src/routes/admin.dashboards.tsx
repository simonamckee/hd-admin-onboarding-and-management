import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

export const Route = createFileRoute("/admin/dashboards")({ component: DashboardTemplates });

type Tab = "clinician" | "patient";
type Col = "left" | "right";

type Module = { id: string; name: string; required?: boolean };

const CLINICIAN_LEFT_DEFAULT: Module[] = [
  { id: "glucose", name: "Glucose", required: true },
  { id: "insulin", name: "Insulin", required: true },
];
const CLINICIAN_RIGHT_DEFAULT: Module[] = [
  { id: "recs", name: "Recommendations", required: true },
  { id: "todo", name: "Things to do", required: true },
  { id: "resources", name: "Resources" },
];
const CLINICIAN_ALL = [...CLINICIAN_LEFT_DEFAULT, ...CLINICIAN_RIGHT_DEFAULT];

const PATIENT_DEFAULT: Module[] = [
  { id: "glucose", name: "Glucose", required: true },
  { id: "insulin", name: "Insulin", required: true },
  { id: "todo", name: "Things to do", required: true },
  { id: "recs", name: "Recommendations" },
  { id: "resources", name: "Resources" },
  { id: "messages", name: "Messages" },
];

function DashboardTemplates() {
  const [tab, setTab] = useState<Tab>("clinician");

  const helper =
    tab === "clinician"
      ? "Define how the patient dashboard is laid out when a clinician opens it. Changes apply to new clinician accounts only — existing layouts are not affected."
      : "Define how the patient dashboard is laid out when a patient opens it. Changes apply to new patient accounts only — existing layouts are not affected.";

  return (
    <AdminShell heading="">
      <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 16px", color: WF_DARK }}>Dashboard templates</h1>

      <div style={{ display: "flex", borderBottom: `1px solid ${WF_MID}`, marginBottom: 16 }}>
        {(["clinician", "patient"] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 18px",
                fontSize: 13,
                background: "none",
                border: "none",
                borderBottom: `2px solid ${active ? WF_DARK : "transparent"}`,
                color: active ? WF_DARK : WF_MID,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
                marginBottom: -1,
              }}
            >
              {t === "clinician" ? "Clinician view" : "Patient view"}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 13, color: WF_MID, margin: "0 0 24px", lineHeight: 1.5 }}>{helper}</p>

      {tab === "clinician" ? <ClinicianTab /> : <PatientTab />}

      <PrototypeBack to="/admin" />
    </AdminShell>
  );
}

/* ----------------- Clinician tab ----------------- */

function ClinicianTab() {
  const [left, setLeft] = useState<Module[]>(CLINICIAN_LEFT_DEFAULT);
  const [right, setRight] = useState<Module[]>(CLINICIAN_RIGHT_DEFAULT);
  const [removed, setRemoved] = useState<Module[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const moveBetween = (mod: Module, from: Col, to: Col) => {
    if (from === to) return;
    if (from === "left") setLeft((l) => l.filter((m) => m.id !== mod.id));
    else setRight((r) => r.filter((m) => m.id !== mod.id));
    if (to === "left") setLeft((l) => [...l, mod]);
    else setRight((r) => [...r, mod]);
  };

  const remove = (mod: Module, col: Col) => {
    if (mod.required) return;
    if (col === "left") setLeft((l) => l.filter((m) => m.id !== mod.id));
    else setRight((r) => r.filter((m) => m.id !== mod.id));
    setRemoved((r) => [...r, mod]);
  };

  const addBack = (mod: Module) => {
    setRemoved((r) => r.filter((m) => m.id !== mod.id));
    setRight((r) => [...r, mod]);
  };

  const reorder = (col: Module[], setCol: (v: Module[]) => void, fromIdx: number, toIdx: number) => {
    const next = [...col];
    const [it] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, it);
    setCol(next);
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Column
          label="Patient data"
          modules={left}
          onRemove={(m) => remove(m, "left")}
          onReorder={(f, t) => reorder(left, setLeft, f, t)}
          onDropFromOther={(m) => moveBetween(m, "right", "left")}
          col="left"
        />
        <Column
          label="Clinical actions"
          modules={right}
          onRemove={(m) => remove(m, "right")}
          onReorder={(f, t) => reorder(right, setRight, f, t)}
          onDropFromOther={(m) => moveBetween(m, "left", "right")}
          col="right"
        />
      </div>

      <MessagesInfoRow />

      {removed.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <RemovedSection modules={removed} onAddBack={addBack} />
        </div>
      )}

      <PreviewToggle open={showPreview} onToggle={() => setShowPreview((s) => !s)} />
      {showPreview && <ClinicianPreview />}

      <SaveFooter tab="clinician" />
    </>
  );
}

/* ----------------- Patient tab ----------------- */

function PatientTab() {
  const [list, setList] = useState<Module[]>(PATIENT_DEFAULT);
  const [removed, setRemoved] = useState<Module[]>([]);

  const remove = (mod: Module) => {
    if (mod.required) return;
    setList((l) => l.filter((m) => m.id !== mod.id));
    setRemoved((r) => [...r, mod]);
  };
  const addBack = (mod: Module) => {
    setRemoved((r) => r.filter((m) => m.id !== mod.id));
    setList((l) => [...l, mod]);
  };
  const reorder = (fromIdx: number, toIdx: number) => {
    const next = [...list];
    const [it] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, it);
    setList(next);
  };

  return (
    <>
      <div style={{ maxWidth: 560, marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: WF_DARK, fontWeight: 600, marginBottom: 4 }}>Module order</div>
        <div style={{ fontSize: 12, color: WF_MID, marginBottom: 12, lineHeight: 1.5 }}>
          Drag to reorder. Required modules cannot be removed. Patients can reorder after their first login — this sets their starting view.
        </div>

        <ReorderableList modules={list} onReorder={reorder} onRemove={remove} />

        {removed.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <RemovedSection modules={removed} onAddBack={addBack} />
          </div>
        )}
      </div>

      <SaveFooter tab="patient" />
    </>
  );
}

/* ----------------- Shared builder pieces ----------------- */

function Column({
  label, modules, onRemove, onReorder, onDropFromOther, col,
}: {
  label: string;
  modules: Module[];
  onRemove: (m: Module) => void;
  onReorder: (fromIdx: number, toIdx: number) => void;
  onDropFromOther: (m: Module) => void;
  col: Col;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div>
      <div style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
        {label}
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          setDragOver(false);
          const data = e.dataTransfer.getData("application/json");
          if (!data) return;
          const { id, fromCol } = JSON.parse(data);
          if (fromCol !== col) {
            const mod = CLINICIAN_ALL.find((m) => m.id === id);
            if (mod) onDropFromOther(mod);
          }
        }}
        style={{
          minHeight: 200,
          border: `${dragOver ? 2 : 1}px ${dragOver ? "solid" : "dashed"} ${WF_MID}`,
          background: dragOver ? "#F0F0F0" : "#FAFAFA",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {modules.map((m, i) => (
          <ModuleCard
            key={m.id}
            module={m}
            index={i}
            onRemove={() => onRemove(m)}
            onReorder={onReorder}
            dragPayload={JSON.stringify({ id: m.id, fromCol: col, fromIdx: i })}
          />
        ))}
      </div>
    </div>
  );
}

function MessagesInfoRow() {
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ borderTop: `1px dashed ${WF_MID}`, marginBottom: 12 }} />
      <div
        title="Messages opens as a panel from the patient header bar. It is always available to clinicians and does not need to be placed in the layout."
        style={{
          background: "#F5F5F5",
          border: `1px dashed ${WF_MID}`,
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "default",
          opacity: 0.85,
        }}
      >
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: WF_MID }}>Messages</span>
          <span
            title="Messages opens as a panel from the patient header bar. It is always available to clinicians and does not need to be placed in the layout."
            style={{ fontSize: 11, color: WF_MID, border: `1px solid ${WF_MID}`, borderRadius: "50%", width: 14, height: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "help" }}
          >
            i
          </span>
        </div>
        <span style={{ fontSize: 11, color: WF_MID, fontStyle: "italic" }}>
          Always accessible from the patient header
        </span>
      </div>
    </div>
  );
}

function ReorderableList({
  modules, onReorder, onRemove,
}: {
  modules: Module[];
  onReorder: (fromIdx: number, toIdx: number) => void;
  onRemove: (m: Module) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {modules.map((m, i) => (
        <ModuleCard
          key={m.id}
          module={m}
          index={i}
          onRemove={() => onRemove(m)}
          onReorder={onReorder}
          dragPayload={JSON.stringify({ id: m.id, fromCol: "list", fromIdx: i })}
        />
      ))}
    </div>
  );
}

function ModuleCard({
  module: m, index, onRemove, onReorder, dragPayload,
}: {
  module: Module;
  index: number;
  onRemove: () => void;
  onReorder: (fromIdx: number, toIdx: number) => void;
  dragPayload: string;
}) {
  const [dragging, setDragging] = useState(false);
  const [over, setOver] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/json", dragPayload);
        e.dataTransfer.effectAllowed = "move";
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const data = e.dataTransfer.getData("application/json");
        if (!data) return;
        const parsed = JSON.parse(data);
        if (parsed.fromIdx !== undefined && parsed.fromIdx !== index) {
          onReorder(parsed.fromIdx, index);
        }
      }}
      style={{
        background: "#fff",
        border: `${over ? 2 : 1}px solid ${over ? WF_DARK : WF_MID}`,
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: dragging ? 0.4 : 1,
        cursor: "grab",
      }}
    >
      <div style={{ color: WF_MID, fontSize: 14, lineHeight: 1 }}>⋮⋮</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, color: WF_DARK }}>{m.name}</span>
      </div>
      {m.required ? (
        <span style={{ fontSize: 10, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, border: `1px solid ${WF_MID}`, padding: "1px 6px" }}>
          Required
        </span>
      ) : (
        <button
          onClick={onRemove}
          style={{ background: "none", border: "none", color: WF_MID, fontSize: 16, cursor: "pointer" }}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </div>
  );
}

function RemovedSection({ modules, onAddBack }: { modules: Module[]; onAddBack: (m: Module) => void }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
        Removed modules
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {modules.map((m) => (
          <div
            key={m.id}
            style={{
              background: "#F5F5F5",
              border: `1px dashed ${WF_MID}`,
              padding: "8px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: 0.7,
            }}
          >
            <span style={{ fontSize: 13, color: WF_MID }}>{m.name}</span>
            <button
              onClick={() => onAddBack(m)}
              style={{ background: "none", border: "none", color: WF_DARK, fontSize: 12, textDecoration: "underline", cursor: "pointer" }}
            >
              Add back
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderTop: `1px solid ${WF_MID}`, paddingTop: 16, marginTop: 24, marginBottom: open ? 16 : 0 }}>
      <button
        onClick={onToggle}
        style={{ background: "none", border: "none", padding: 0, color: WF_DARK, fontSize: 13, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}
      >
        {open ? "Hide preview" : "Show preview"} — clinician view of a patient dashboard
      </button>
    </div>
  );
}

function SaveFooter({ tab }: { tab: Tab }) {
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");
  const callout =
    tab === "clinician"
      ? "Applies to new clinician accounts. Existing clinician dashboard layouts will not be changed."
      : "Applies to new patient accounts. Existing patient dashboard layouts will not be changed.";

  const save = () => {
    setState("saved");
    setTimeout(() => setState("idle"), 1500);
  };

  return (
    <>
      <div style={{ background: "#F5F5F5", border: `1px solid ${WF_MID}`, padding: "10px 14px", fontSize: 12, color: WF_DARK, marginTop: 24, marginBottom: 12, lineHeight: 1.5 }}>
        {callout}
      </div>

      {state === "error" && (
        <div style={{ border: `1px solid ${WF_DARK}`, padding: "8px 14px", fontSize: 12, color: WF_DARK, marginBottom: 12 }}>
          Could not save. Please try again.
        </div>
      )}

      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "#fff",
          borderTop: `1px solid ${WF_MID}`,
          padding: "12px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <span style={{ fontSize: 12, color: WF_MID }}>Last saved: today at 2:34 PM</span>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={() => setState("error")} small>Simulate error</Btn>
          <Btn primary onClick={save}>
            {state === "saved" ? "Saved ✓" : "Save template"}
          </Btn>
        </div>
      </div>
    </>
  );
}

/* ----------------- Clinician dashboard preview ----------------- */

function ClinicianPreview() {
  const [msgOpen, setMsgOpen] = useState(false);

  return (
    <div style={{ position: "relative", background: "#F5F5F5", border: `1px dashed ${WF_MID}`, padding: 20, marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12, fontStyle: "italic" }}>
        Preview — read-only
      </div>

      {/* Patient header */}
      <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 14, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: WF_DARK }}>Emma Tremblay</span>
            <span style={{ fontSize: 10, color: WF_DARK, textTransform: "uppercase", letterSpacing: 0.5, border: `1px solid ${WF_DARK}`, padding: "1px 6px" }}>
              Active
            </span>
          </div>
          <div style={{ fontSize: 11, color: WF_MID }}>
            DOB: March 4, 2018 · Diagnosed: June 12, 2020 · Last sync: 2h ago
          </div>
        </div>
        <button
          onClick={() => setMsgOpen(true)}
          style={{ background: "#fff", border: `1px solid ${WF_DARK}`, padding: "6px 12px", fontSize: 12, color: WF_DARK, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
        >
          <span>💬</span> Messages
        </button>
      </div>

      {/* 2-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* LEFT — Patient data */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <PreviewCard>
            <CardHeader title="Glucose" right="Last 7 days ▾" />
            <LineChartStub />
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {["Avg: 7.4 mmol/L", "Time in range: 68%", "Lows: 3 events"].map((s) => (
                <StatChip key={s}>{s}</StatChip>
              ))}
            </div>
          </PreviewCard>

          <PreviewCard>
            <CardHeader title="Insulin" right="Last 7 days ▾" />
            <BarChartStub />
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {["Avg daily dose: 42U", "Basal/Bolus: 55% / 45%"].map((s) => (
                <StatChip key={s}>{s}</StatChip>
              ))}
            </div>
          </PreviewCard>
        </div>

        {/* RIGHT — Clinical actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <PreviewCard>
            <CardHeader title="Recommendations" right="+ Add" />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { text: "Increase evening basal by 1U", meta: "sent May 20", status: "Accepted" },
                { text: "Review carb ratios at breakfast", meta: "sent May 22", status: "Pending" },
              ].map((r, i) => (
                <li key={i} style={{ padding: "8px 0", borderBottom: `0.5px solid ${WF_MID}`, fontSize: 12, display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ color: WF_DARK }}>{r.text}</div>
                    <div style={{ color: WF_MID, fontSize: 11, marginTop: 2 }}>{r.meta}</div>
                  </div>
                  <span style={{ fontSize: 10, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, border: `1px solid ${WF_MID}`, padding: "1px 6px", alignSelf: "flex-start", whiteSpace: "nowrap" }}>
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
            <div style={{ fontSize: 11, color: WF_MID, marginTop: 8, fontStyle: "italic" }}>
              No further recommendations
            </div>
          </PreviewCard>

          <PreviewCard>
            <CardHeader title="Things to do" right="+ Add task" />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { text: "Review monthly check-in response", done: false },
                { text: "Confirm CGM calibration schedule", done: true },
                { text: "Send updated sick day plan", done: false },
              ].map((r, i) => (
                <li key={i} style={{ padding: "8px 0", borderBottom: `0.5px solid ${WF_MID}`, fontSize: 12, display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{
                    width: 12, height: 12, border: `1px solid ${WF_DARK}`,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: WF_DARK,
                    background: r.done ? WF_DARK : "transparent",
                  }}>
                    {r.done && <span style={{ color: "#fff", fontSize: 9 }}>✓</span>}
                  </span>
                  <span style={{ color: r.done ? WF_MID : WF_DARK, textDecoration: r.done ? "line-through" : "none" }}>
                    {r.text}
                  </span>
                </li>
              ))}
            </ul>
          </PreviewCard>

          <PreviewCard>
            <CardHeader title="Resources" right="+ Share resource" />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { name: "Carb Counting Guide", meta: "shared May 15", status: "Viewed" },
                { name: "How to Use Your CGM", meta: "shared May 10", status: "Not yet viewed" },
              ].map((r, i) => (
                <li key={i} style={{ padding: "8px 0", borderBottom: `0.5px solid ${WF_MID}`, fontSize: 12, display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ color: WF_DARK }}>{r.name}</div>
                    <div style={{ color: WF_MID, fontSize: 11, marginTop: 2 }}>{r.meta}</div>
                  </div>
                  <span style={{ fontSize: 11, color: WF_MID, alignSelf: "flex-start", whiteSpace: "nowrap" }}>
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          </PreviewCard>
        </div>
      </div>

      {msgOpen && <MessagesPanel onClose={() => setMsgOpen(false)} />}
    </div>
  );
}

function MessagesPanel({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.25)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 5,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 340,
          background: "#fff",
          borderLeft: `1px solid ${WF_DARK}`,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${WF_MID}`, paddingBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: WF_DARK }}>Messages — Emma Tremblay</span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: WF_MID, fontSize: 18, cursor: "pointer" }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, overflow: "auto" }}>
          <Bubble from="patient">Hi, my glucose was really low this morning before breakfast. Should I change anything?</Bubble>
          <Bubble from="patient">It was around 3.6 mmol/L when I woke up.</Bubble>
          <Bubble from="clinician">Thanks for letting me know — let's reduce your evening basal by 1U starting tonight and see how tomorrow looks.</Bubble>
        </div>
        <div style={{ borderTop: `1px solid ${WF_MID}`, paddingTop: 8, display: "flex", gap: 6 }}>
          <input
            placeholder="Type a message"
            style={{ flex: 1, border: `1px solid ${WF_MID}`, padding: "6px 8px", fontSize: 12, fontFamily: "inherit" }}
          />
          <button
            style={{ background: WF_DARK, color: "#fff", border: "none", padding: "6px 12px", fontSize: 12, cursor: "pointer" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ from, children }: { from: "patient" | "clinician"; children: React.ReactNode }) {
  const isClinician = from === "clinician";
  return (
    <div style={{ display: "flex", justifyContent: isClinician ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "80%",
          background: isClinician ? WF_DARK : "#F0F0F0",
          color: isClinician ? "#fff" : WF_DARK,
          border: isClinician ? "none" : `1px solid ${WF_MID}`,
          padding: "6px 10px",
          fontSize: 12,
          lineHeight: 1.4,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function PreviewCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, borderRadius: 8, padding: 14 }}>
      {children}
    </div>
  );
}

function CardHeader({ title, right }: { title: string; subtitle?: string; right?: string }) {
  return (
    <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: WF_DARK }}>{title}</span>
      {right && <span style={{ fontSize: 11, color: WF_MID }}>{right}</span>}
    </div>
  );
}

function StatChip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 11, color: WF_DARK, border: `1px solid ${WF_MID}`, padding: "2px 8px", background: "#FAFAFA" }}>
      {children}
    </span>
  );
}

function LineChartStub() {
  return (
    <svg viewBox="0 0 240 80" style={{ width: "100%", height: 80, border: `0.5px solid ${WF_MID}` }}>
      {/* axes */}
      <line x1="22" y1="70" x2="235" y2="70" stroke={WF_MID} strokeWidth="0.5" />
      <line x1="22" y1="6" x2="22" y2="70" stroke={WF_MID} strokeWidth="0.5" />
      {/* gridlines */}
      {[20, 40, 60].map((y) => (
        <line key={y} x1="22" y1={y} x2="235" y2={y} stroke={WF_MID} strokeWidth="0.25" strokeDasharray="2 2" />
      ))}
      {/* line */}
      <polyline
        fill="none"
        stroke={WF_DARK}
        strokeWidth="1.2"
        points="22,50 50,45 80,30 110,48 140,20 170,42 200,38 230,52"
      />
      <text x="2" y="12" fontSize="6" fill={WF_MID}>mmol/L</text>
      <text x="210" y="78" fontSize="6" fill={WF_MID}>Time</text>
    </svg>
  );
}

function BarChartStub() {
  const bars = [38, 44, 40, 50, 42, 36, 48];
  return (
    <svg viewBox="0 0 240 80" style={{ width: "100%", height: 80, border: `0.5px solid ${WF_MID}` }}>
      <line x1="22" y1="70" x2="235" y2="70" stroke={WF_MID} strokeWidth="0.5" />
      <line x1="22" y1="6" x2="22" y2="70" stroke={WF_MID} strokeWidth="0.5" />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={32 + i * 28}
          y={70 - h}
          width={18}
          height={h}
          fill="#fff"
          stroke={WF_DARK}
          strokeWidth="0.6"
        />
      ))}
      <text x="2" y="12" fontSize="6" fill={WF_MID}>Units</text>
      <text x="210" y="78" fontSize="6" fill={WF_MID}>Day</text>
    </svg>
  );
}
