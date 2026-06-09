import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";

export const Route = createFileRoute("/admin/dashboards")({ component: DashboardTemplates });

const TEAL = "#00565B";
const BORDER = "#dde2e4";
const HANDLE = "#7f949b";
const OFF = "#b4b2a9";
const TEXT = "#1a1a1a";
const MUTED = "#6b7a80";

type Module = { id: string; name: string; on: boolean };
type Col = "left" | "right";

const LEFT_DEFAULT: Module[] = [
  { id: "glucose", name: "Glucose", on: true },
  { id: "insulin", name: "Insulin", on: true },
  { id: "labs", name: "Labs & tests", on: true },
  { id: "completed-forms", name: "Completed forms", on: true },
  { id: "appointments", name: "Appointments", on: true },
];

const RIGHT_DEFAULT: Module[] = [
  { id: "recommendations", name: "Recommendations", on: true },
  { id: "resources", name: "Resources", on: true },
  { id: "assigned-forms", name: "Assigned forms", on: true },
  { id: "assigned-tasks", name: "Assigned tasks", on: true },
  { id: "tasks", name: "Tasks", on: true },
];

function DashboardTemplates() {
  const [left, setLeft] = useState<Module[]>(LEFT_DEFAULT);
  const [right, setRight] = useState<Module[]>(RIGHT_DEFAULT);
  const [drag, setDrag] = useState<{ col: Col; id: string } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ col: Col; id: string } | null>(null);
  const [saved, setSaved] = useState(false);

  const listFor = (c: Col) => (c === "left" ? left : right);
  const setListFor = (c: Col) => (c === "left" ? setLeft : setRight);

  const onDrop = (col: Col, targetId: string) => {
    if (!drag || drag.col !== col) {
      setDrag(null);
      setDropTarget(null);
      return;
    }
    const list = [...listFor(col)];
    const from = list.findIndex((m) => m.id === drag.id);
    const to = list.findIndex((m) => m.id === targetId);
    if (from < 0 || to < 0 || from === to) {
      setDrag(null);
      setDropTarget(null);
      return;
    }
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    setListFor(col)(list);
    setDrag(null);
    setDropTarget(null);
  };

  const toggle = (col: Col, id: string) => {
    const list = listFor(col).map((m) => (m.id === id ? { ...m, on: !m.on } : m));
    setListFor(col)(list);
  };

  const onSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AdminShell heading="Dashboard templates">
      <p style={{ fontSize: 14, color: MUTED, margin: "0 0 24px", lineHeight: 1.5, maxWidth: 720 }}>
        Configure which modules appear on the clinician dashboard and the order they appear in.
        This layout applies to all clinicians at your clinic.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 960 }}>
        <Column
          col="left"
          heading="Left column — Clinical data"
          modules={left}
          drag={drag}
          dropTarget={dropTarget}
          setDrag={setDrag}
          setDropTarget={setDropTarget}
          onDrop={onDrop}
          onToggle={toggle}
        />
        <Column
          col="right"
          heading="Right column — Clinical actions"
          modules={right}
          drag={drag}
          dropTarget={dropTarget}
          setDrag={setDrag}
          setDropTarget={setDropTarget}
          onDrop={onDrop}
          onToggle={toggle}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 24,
          maxWidth: 960,
        }}
      >
        {saved && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: TEAL, fontSize: 14, fontWeight: 500 }}>
            <Check size={16} /> Configuration saved
          </span>
        )}
        <button
          type="button"
          onClick={onSave}
          style={{
            background: TEAL,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Save configuration
        </button>
      </div>
    </AdminShell>
  );
}

function Column({
  col,
  heading,
  modules,
  drag,
  dropTarget,
  setDrag,
  setDropTarget,
  onDrop,
  onToggle,
}: {
  col: Col;
  heading: string;
  modules: Module[];
  drag: { col: Col; id: string } | null;
  dropTarget: { col: Col; id: string } | null;
  setDrag: (d: { col: Col; id: string } | null) => void;
  setDropTarget: (d: { col: Col; id: string } | null) => void;
  onDrop: (col: Col, targetId: string) => void;
  onToggle: (col: Col, id: string) => void;
}) {
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: TEAL, marginBottom: 12 }}>{heading}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {modules.map((m) => {
          const isDropTarget = dropTarget?.col === col && dropTarget.id === m.id && drag?.col === col && drag.id !== m.id;
          const isDragging = drag?.col === col && drag.id === m.id;
          return (
            <div
              key={m.id}
              draggable
              onDragStart={() => setDrag({ col, id: m.id })}
              onDragEnd={() => {
                setDrag(null);
                setDropTarget(null);
              }}
              onDragOver={(e) => {
                if (drag?.col !== col) return;
                e.preventDefault();
                setDropTarget({ col, id: m.id });
              }}
              onDrop={(e) => {
                e.preventDefault();
                onDrop(col, m.id);
              }}
              style={{
                background: "#fff",
                border: `0.5px solid ${BORDER}`,
                borderTop: isDropTarget ? `2px solid ${TEAL}` : `0.5px solid ${BORDER}`,
                borderRadius: 8,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: isDragging ? 0.4 : 1,
              }}
            >
              <span
                style={{
                  color: HANDLE,
                  cursor: "grab",
                  fontSize: 16,
                  userSelect: "none",
                  lineHeight: 1,
                }}
                aria-hidden
              >
                ⠿
              </span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: TEXT }}>{m.name}</span>
              <Toggle on={m.on} onClick={() => onToggle(col, m.id)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      style={{
        width: 34,
        height: 20,
        borderRadius: 999,
        border: "none",
        background: on ? TEAL : OFF,
        position: "relative",
        cursor: "pointer",
        padding: 0,
        transition: "background 0.15s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 16 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.15s",
        }}
      />
    </button>
  );
}
