import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

export const Route = createFileRoute("/admin/dashboards")({
  component: DashboardTemplates,
});

type Module = { id: string; name: string; required: boolean };

const DEFAULT_MODULES: Module[] = [
  { id: "glucose", name: "Glucose", required: true },
  { id: "insulin", name: "Insulin", required: true },
  { id: "todo", name: "Things to do", required: true },
  { id: "recs", name: "Recommendations", required: false },
  { id: "resources", name: "Resources", required: false },
  { id: "messages", name: "Messages", required: false },
];

function DashboardTemplates() {
  const [active, setActive] = useState<Module[]>(DEFAULT_MODULES);
  const [removed, setRemoved] = useState<Module[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [lastSaved, setLastSaved] = useState("today at 2:34 PM");
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState(false);
  const flashT = useRef<number | null>(null);

  useEffect(() => () => { if (flashT.current) window.clearTimeout(flashT.current); }, []);

  function remove(id: string) {
    const m = active.find((x) => x.id === id);
    if (!m || m.required) return;
    setActive(active.filter((x) => x.id !== id));
    setRemoved([...removed, m]);
  }

  function addBack(id: string) {
    const m = removed.find((x) => x.id === id);
    if (!m) return;
    setRemoved(removed.filter((x) => x.id !== id));
    setActive([...active, m]);
  }

  function onDragStart(id: string) {
    setDragId(id);
  }
  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDropIndex(index);
  }
  function onDrop() {
    if (dragId == null || dropIndex == null) { setDragId(null); setDropIndex(null); return; }
    const from = active.findIndex((m) => m.id === dragId);
    if (from < 0) { setDragId(null); setDropIndex(null); return; }
    const next = [...active];
    const [moved] = next.splice(from, 1);
    let to = dropIndex;
    if (from < to) to -= 1;
    next.splice(to, 0, moved);
    setActive(next);
    setDragId(null);
    setDropIndex(null);
  }

  function save() {
    // Simulated: always succeeds in prototype
    setError(false);
    setSavedFlash(true);
    if (flashT.current) window.clearTimeout(flashT.current);
    flashT.current = window.setTimeout(() => setSavedFlash(false), 1500);
    setLastSaved("just now");
  }

  return (
    <AdminShell heading="">
      <div style={{ paddingBottom: 100 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, margin: "0 0 6px 0" }}>
          Dashboard templates
        </h1>
        <p style={{ fontSize: 13, color: WF_MID, margin: "0 0 28px 0", lineHeight: 1.5, maxWidth: 720 }}>
          Define the default module layout for new patient dashboards at this clinic.
          Changes apply to new patients only — existing dashboards are not affected.
        </p>

        <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: WF_DARK, marginBottom: 4 }}>
            Module order
          </div>
          <div style={{ fontSize: 12, color: WF_MID, marginBottom: 16 }}>
            Drag to reorder. Required modules cannot be removed.
          </div>

          <div onDragLeave={(e) => {
            if (e.currentTarget === e.target) setDropIndex(null);
          }}>
            {active.map((m, i) => (
              <div key={m.id}>
                <DropIndicator visible={dropIndex === i && dragId !== null} />
                <ModuleCard
                  module={m}
                  isDragging={dragId === m.id}
                  onDragStart={() => onDragStart(m.id)}
                  onDragEnd={() => { setDragId(null); setDropIndex(null); }}
                  onDragOver={(e) => onDragOver(e, i)}
                  onDrop={onDrop}
                  onRemove={() => remove(m.id)}
                />
              </div>
            ))}
            <DropIndicator visible={dropIndex === active.length && dragId !== null} />
            <div
              onDragOver={(e) => onDragOver(e, active.length)}
              onDrop={onDrop}
              style={{ height: 8 }}
            />
          </div>

          <div style={{ fontSize: 12, color: WF_MID, marginTop: 16, fontStyle: "italic" }}>
            Patients can reorder modules after their first login. This template sets their starting view.
          </div>
        </div>

        {removed.length > 0 && (
          <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: WF_MID, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Removed modules
            </div>
            {removed.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  border: `1px dashed ${WF_MID}`,
                  background: "#FAFAFA",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 13, color: WF_MID }}>{m.name}</span>
                <button
                  onClick={() => addBack(m.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: WF_DARK,
                    fontSize: 12,
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Add back
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            background: "#FAFAFA",
            border: `1px solid ${WF_MID}`,
            padding: "12px 16px",
            fontSize: 12,
            color: WF_DARK,
            lineHeight: 1.5,
            marginBottom: 20,
          }}
        >
          This template will be applied to all new patient accounts going forward.
          Existing patient dashboards will not be changed.
        </div>

        {error && (
          <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 12, borderLeft: `2px solid ${WF_DARK}`, paddingLeft: 10 }}>
            Could not save. Please try again.
          </div>
        )}

        <PrototypeBack to="/admin" />
      </div>

      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "#fff",
          borderTop: `1px solid ${WF_MID}`,
          padding: "14px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <span style={{ fontSize: 12, color: WF_MID }}>
          Last saved: {lastSaved}
        </span>
        <Btn primary onClick={save}>
          {savedFlash ? "Saved ✓" : "Save template"}
        </Btn>
      </div>
    </AdminShell>
  );
}

function DropIndicator({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        height: visible ? 4 : 0,
        margin: visible ? "4px 0" : 0,
        border: visible ? `1px dashed ${WF_DARK}` : "none",
        transition: "height 0.1s ease",
      }}
    />
  );
}

function ModuleCard({
  module,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onRemove,
}: {
  module: Module;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        border: isDragging ? `2px solid ${WF_DARK}` : `1px solid ${WF_MID}`,
        background: module.required ? "#F5F5F5" : "#fff",
        marginBottom: 8,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        userSelect: "none",
      }}
    >
      <span
        style={{
          color: WF_MID,
          fontSize: 16,
          fontFamily: "monospace",
          lineHeight: 1,
          cursor: "grab",
        }}
        aria-label="Drag handle"
      >
        ⋮⋮
      </span>
      <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: WF_DARK }}>
        {module.name}
      </span>
      {module.required ? (
        <span style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Required
        </span>
      ) : (
        <button
          onClick={onRemove}
          aria-label={`Remove ${module.name}`}
          style={{
            background: "none",
            border: "none",
            color: WF_MID,
            fontSize: 18,
            cursor: "pointer",
            padding: "0 4px",
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
