import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

export const Route = createFileRoute("/admin/dashboards")({ component: DashboardTemplates });

type Tab = "clinician" | "patient";

type Module = { id: string; name: string; description?: string; required?: boolean };

const CLINICIAN_LEFT: Module[] = [
  { id: "at-risk", name: "At-risk patients", required: true, description: "Patients flagged based on recent glucose trends or overdue reviews" },
  { id: "recent-activity", name: "Recent patient activity", required: true, description: "Latest data syncs, form submissions, and recommendation responses" },
  { id: "appointments", name: "Upcoming appointments", description: "Next 7 days of scheduled appointments" },
];
const CLINICIAN_RIGHT: Module[] = [
  { id: "tasks", name: "Pending tasks", required: true, description: "Tasks assigned to this clinician" },
  { id: "messages", name: "Messages", required: true, description: "Unread patient messages" },
  { id: "quick-stats", name: "Quick stats", description: "Summary counts — active patients, at-risk, pending tasks, overdue reviews" },
];

const PATIENT_DEFAULT: Module[] = [
  { id: "glucose", name: "Glucose", required: true },
  { id: "insulin", name: "Insulin", required: true },
  { id: "todo", name: "Things to do", required: true },
  { id: "recs", name: "Recommendations" },
  { id: "resources", name: "Resources" },
  { id: "messages-p", name: "Messages" },
];

function DashboardTemplates() {
  const [tab, setTab] = useState<Tab>("clinician");

  return (
    <AdminShell heading="">
      <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 16px", color: WF_DARK }}>Dashboard templates</h1>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${WF_MID}`, marginBottom: 24 }}>
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
              {t === "clinician" ? "Clinician dashboard" : "Patient dashboard"}
            </button>
          );
        })}
      </div>

      {tab === "clinician" ? <ClinicianTab /> : <PatientTab />}

      <PrototypeBack to="/admin" />
    </AdminShell>
  );
}

/* ----------------- Clinician tab ----------------- */

function ClinicianTab() {
  const [left, setLeft] = useState<Module[]>(CLINICIAN_LEFT);
  const [right, setRight] = useState<Module[]>(CLINICIAN_RIGHT);
  const [removed, setRemoved] = useState<Module[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const move = (mod: Module, fromCol: "left" | "right", toCol: "left" | "right") => {
    if (fromCol === toCol) return;
    if (fromCol === "left") setLeft((l) => l.filter((m) => m.id !== mod.id));
    else setRight((r) => r.filter((m) => m.id !== mod.id));
    if (toCol === "left") setLeft((l) => [...l, mod]);
    else setRight((r) => [...r, mod]);
  };

  const remove = (mod: Module, col: "left" | "right") => {
    if (mod.required) return;
    if (col === "left") setLeft((l) => l.filter((m) => m.id !== mod.id));
    else setRight((r) => r.filter((m) => m.id !== mod.id));
    setRemoved((r) => [...r, mod]);
  };

  const addBack = (mod: Module) => {
    setRemoved((r) => r.filter((m) => m.id !== mod.id));
    setLeft((l) => [...l, mod]);
  };

  const reorder = (col: Module[], setCol: (v: Module[]) => void, fromIdx: number, toIdx: number) => {
    const next = [...col];
    const [it] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, it);
    setCol(next);
  };

  return (
    <>
      <p style={{ fontSize: 13, color: WF_MID, margin: "0 0 24px", lineHeight: 1.5 }}>
        Define the default module layout for clinician dashboards at this clinic. Changes apply to new clinician accounts only — existing dashboards are not affected.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <Column
          label="Left column"
          modules={left}
          onMoveAcross={(m) => move(m, "left", "right")}
          onRemove={(m) => remove(m, "left")}
          onReorder={(f, t) => reorder(left, setLeft, f, t)}
          acceptFrom="right"
          onDropFromOther={(m) => move(m, "right", "left")}
          col="left"
        />
        <Column
          label="Right column"
          modules={right}
          onMoveAcross={(m) => move(m, "right", "left")}
          onRemove={(m) => remove(m, "right")}
          onReorder={(f, t) => reorder(right, setRight, f, t)}
          acceptFrom="left"
          onDropFromOther={(m) => move(m, "left", "right")}
          col="right"
        />
      </div>

      {removed.length > 0 && (
        <RemovedSection modules={removed} onAddBack={addBack} />
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
      <p style={{ fontSize: 13, color: WF_MID, margin: "0 0 24px", lineHeight: 1.5 }}>
        Define the default module layout for new patient dashboards at this clinic. Changes apply to new patient accounts only — existing dashboards are not affected.
      </p>

      <div style={{ maxWidth: 560, marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: WF_DARK, fontWeight: 600, marginBottom: 4 }}>Module order</div>
        <div style={{ fontSize: 12, color: WF_MID, marginBottom: 12 }}>
          Drag to reorder. Required modules cannot be removed.
        </div>

        <ReorderableList modules={list} onReorder={reorder} onRemove={remove} />

        {removed.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <RemovedSection modules={removed} onAddBack={addBack} />
          </div>
        )}

        <div style={{ marginTop: 16, fontSize: 12, color: WF_MID, fontStyle: "italic", lineHeight: 1.5 }}>
          Patients can reorder modules after their first login. This template sets their starting view.
        </div>
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
  onMoveAcross: (m: Module) => void;
  onRemove: (m: Module) => void;
  onReorder: (fromIdx: number, toIdx: number) => void;
  acceptFrom: "left" | "right";
  onDropFromOther: (m: Module) => void;
  col: "left" | "right";
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
            const allMods = [...CLINICIAN_LEFT, ...CLINICIAN_RIGHT];
            const mod = allMods.find((m) => m.id === id);
            if (mod) onDropFromOther(mod);
          }
        }}
        style={{
          minHeight: 200,
          border: `${dragOver ? 2 : 1}px ${dragOver ? "solid" : "dashed"} ${WF_MID}`,
          background: dragOver ? "#F5F5F5" : "#fff",
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
            withDescription
          />
        ))}
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
  module: m, index, onRemove, onReorder, dragPayload, withDescription,
}: {
  module: Module;
  index: number;
  onRemove: () => void;
  onReorder: (fromIdx: number, toIdx: number) => void;
  dragPayload: string;
  withDescription?: boolean;
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
        alignItems: withDescription ? "flex-start" : "center",
        gap: 10,
        opacity: dragging ? 0.4 : 1,
        cursor: "grab",
      }}
    >
      <div style={{ color: WF_MID, fontSize: 14, lineHeight: 1, marginTop: withDescription ? 2 : 0 }}>⋮⋮</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: WF_DARK }}>{m.name}</span>
          {m.required && (
            <span style={{ fontSize: 10, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, border: `1px solid ${WF_MID}`, padding: "1px 6px" }}>
              Required
            </span>
          )}
        </div>
        {withDescription && m.description && (
          <div style={{ fontSize: 11, color: WF_MID, marginTop: 4, lineHeight: 1.4 }}>{m.description}</div>
        )}
      </div>
      {!m.required && (
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
    <div style={{ borderTop: `1px solid ${WF_MID}`, paddingTop: 16, marginTop: 8, marginBottom: open ? 16 : 0 }}>
      <button
        onClick={onToggle}
        style={{ background: "none", border: "none", padding: 0, color: WF_DARK, fontSize: 13, cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}
      >
        {open ? "Hide preview" : "Show preview"} — how this layout will appear to clinicians
      </button>
    </div>
  );
}

function SaveFooter({ tab }: { tab: Tab }) {
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");
  const callout =
    tab === "clinician"
      ? "This template applies to new clinician accounts. Existing clinician dashboards will not be changed."
      : "This template applies to new patient accounts. Existing patient dashboards will not be changed.";

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
  return (
    <div style={{ background: "#F5F5F5", border: `1px dashed ${WF_MID}`, padding: 20, marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12, fontStyle: "italic" }}>
        Preview — read-only
      </div>

      {/* Quick stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Active patients", n: 8 },
          { label: "At-risk patients", n: 3 },
          { label: "Pending tasks", n: 5 },
          { label: "Overdue reviews", n: 2 },
        ].map((s) => (
          <PreviewCard key={s.label}>
            <div style={{ fontSize: 28, fontWeight: 500, color: WF_DARK }}>{s.n}</div>
            <div style={{ fontSize: 11, color: WF_MID, marginTop: 4 }}>{s.label}</div>
          </PreviewCard>
        ))}
      </div>

      {/* 2-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* At-risk */}
          <PreviewCard>
            <CardHeader title="At-risk patients" subtitle="Patients flagged for review" right="View all →" />
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `0.5px solid ${WF_MID}` }}>
                  {["Name", "Last sync", "Flag reason"].map((h) => (
                    <th key={h} style={{ padding: "6px 4px", textAlign: "left", fontSize: 10, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Emma Tremblay", "2 days ago", "No data synced in 48h"],
                  ["Sofia Andersen", "5 days ago", "Invitation not yet accepted"],
                  ["Mateo Rivera", "1 week ago", "Invitation not yet accepted"],
                ].map((r, i) => (
                  <tr key={i} style={{ borderBottom: `0.5px solid ${WF_MID}` }}>
                    {r.map((c, j) => (
                      <td key={j} style={{ padding: "6px 4px", color: WF_DARK }}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </PreviewCard>

          {/* Recent activity */}
          <PreviewCard>
            <CardHeader title="Recent patient activity" />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                ["Lucas Okonkwo", "Submitted Monthly Check-in form", "1 hour ago"],
                ["Aiden Nakamura", "Glucose data synced via CGM", "3 hours ago"],
                ["Emma Tremblay", "Declined recommendation: adjust basal rate", "Yesterday"],
                ["Isla MacPherson", "Accepted invitation", "2 days ago"],
              ].map((r, i) => (
                <li key={i} style={{ padding: "8px 0", borderBottom: `0.5px solid ${WF_MID}`, fontSize: 12 }}>
                  <div style={{ color: WF_DARK }}>{r[0]} — {r[1]}</div>
                  <div style={{ color: WF_MID, fontSize: 11, marginTop: 2 }}>{r[2]}</div>
                </li>
              ))}
            </ul>
          </PreviewCard>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Pending tasks */}
          <PreviewCard>
            <CardHeader title="Pending tasks" right="View all →" />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                ["Review monthly check-in response", "Emma Tremblay"],
                ["Follow up: declined recommendation", "Isla MacPherson"],
                ["Send updated carb guide", "Aiden Nakamura"],
              ].map((r, i) => (
                <li key={i} style={{ padding: "8px 0", borderBottom: `0.5px solid ${WF_MID}`, fontSize: 12, display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ width: 12, height: 12, border: `1px solid ${WF_DARK}`, display: "inline-block", marginTop: 2 }} />
                  <div>
                    <div style={{ color: WF_DARK }}>{r[0]}</div>
                    <div style={{ color: WF_MID, fontSize: 11, marginTop: 2 }}>{r[1]}</div>
                  </div>
                </li>
              ))}
            </ul>
          </PreviewCard>

          {/* Messages */}
          <PreviewCard>
            <CardHeader title="Messages" right="View all →" />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { name: "Emma Tremblay", unread: true, snippet: "Quick question about my insulin dose…", time: "30 mins ago" },
                { name: "Lucas Okonkwo", unread: false, snippet: "Thanks for the resource, it was…", time: "Yesterday" },
                { name: "Aiden Nakamura", unread: false, snippet: "Feeling much better this week!", time: "2 days ago" },
              ].map((r, i) => (
                <li key={i} style={{ padding: "8px 0", borderBottom: `0.5px solid ${WF_MID}`, fontSize: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: WF_DARK, fontWeight: r.unread ? 600 : 400 }}>{r.name}</span>
                    <span style={{ color: WF_MID, fontSize: 11 }}>{r.time}</span>
                  </div>
                  <div style={{ color: WF_MID, fontSize: 11, marginTop: 2 }}>{r.snippet}</div>
                </li>
              ))}
            </ul>
          </PreviewCard>

          {/* Appointments */}
          <PreviewCard>
            <CardHeader title="Upcoming appointments" />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                ["Emma Tremblay", "June 3, 2026 at 10:00 AM"],
                ["Lucas Okonkwo", "June 5, 2026 at 2:30 PM"],
              ].map((r, i) => (
                <li key={i} style={{ padding: "8px 0", borderBottom: `0.5px solid ${WF_MID}`, fontSize: 12, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: WF_DARK }}>{r[0]}</span>
                  <span style={{ color: WF_MID }}>{r[1]}</span>
                </li>
              ))}
            </ul>
          </PreviewCard>
        </div>
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

function CardHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: WF_DARK }}>{title}</span>
        {right && <span style={{ fontSize: 11, color: WF_MID }}>{right}</span>}
      </div>
      {subtitle && <div style={{ fontSize: 11, color: WF_MID, marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}
