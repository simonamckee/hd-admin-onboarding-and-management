import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { WF_BG, WF_DARK, WF_MID, TEAL, SUCCESS_BG, SUCCESS_TEXT } from "@/components/wireframe";
import { useDashboardTemplate, type ClinicianModules } from "@/lib/dashboard-template";

export const Route = createFileRoute("/admin/dashboards")({ component: DashboardTemplates });

type Tab = "clinician" | "patient";
type Col = "left" | "right";
type Module = { id: string; name: string; required?: boolean };

const CLIN_LEFT_DEFAULT: Module[] = [
  { id: "glucose", name: "Glucose" },
  { id: "insulin", name: "Insulin" },
  { id: "labs", name: "Labs & test results" },
  { id: "completedForms", name: "Forms" },
  { id: "appointments", name: "Appointments" },
  { id: "completedTasks", name: "Completed tasks" },
];
const CLIN_RIGHT_DEFAULT: Module[] = [
  { id: "recommendations", name: "Recommendations" },
  { id: "resources", name: "Resources" },
  { id: "assignedForms", name: "Assigned forms" },
  { id: "assignedTasks", name: "Assigned tasks" },
];
const CLIN_ALL = [...CLIN_LEFT_DEFAULT, ...CLIN_RIGHT_DEFAULT];
const CLIN_BY_ID: Record<string, Module> = Object.fromEntries(CLIN_ALL.map((m) => [m.id, m]));


const PATIENT_DEFAULT: Module[] = [
  { id: "glucose", name: "Glucose" },
  { id: "insulin", name: "Insulin" },
  { id: "forms", name: "Forms" },
  { id: "tasks", name: "Tasks" },
  { id: "recommendations", name: "Recommendations" },
  { id: "resources", name: "Resources" },
  { id: "appointments", name: "Appointments" },
  { id: "labs", name: "Labs and test results" },
];

const CARD: React.CSSProperties = {
  background: "#fff",
  border: `1px solid ${WF_MID}`,
  padding: 16,
  boxSizing: "border-box",
};

function DashboardTemplates() {
  const [tab, setTab] = useState<Tab>("clinician");

  const helper =
    tab === "clinician"
      ? "Set the default layout clinicians see when they open the patient dashboard. This only applies to clinician accounts created after this setting is saved — existing clinician dashboards will not be changed."
      : "Set the default order of modules a patient sees on first login. Patients can reorder their own modules afterward — this only sets the starting view. The Care profile sections cannot be reordered.";

  return (
    <AdminShell heading="">
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 16px", color: TEAL }}>
        Dashboard templates
      </h1>

      <div style={{ display: "inline-flex", gap: 24, marginBottom: 16, borderBottom: `1px solid ${WF_MID}` }}>
        {(["clinician", "patient"] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: active ? `2px solid ${TEAL}` : "2px solid transparent",
                padding: "8px 2px",
                fontSize: 16,
                color: active ? TEAL : WF_MID,
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {t === "clinician" ? "Clinician view" : "Patient view"}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 16, color: WF_MID, margin: "0 0 24px", lineHeight: 1.5 }}>{helper}</p>

      {tab === "clinician" ? <ClinicianBuilder /> : <PatientBuilder />}

      <PrototypeBack />
    </AdminShell>
  );
}

/* ============================== CLINICIAN ============================== */

function ClinicianBuilder() {
  const { clinicianModules, setClinicianModules } = useDashboardTemplate();
  const [left, setLeft] = useState<Module[]>(() =>
    clinicianModules.patientData.map((id) => CLIN_BY_ID[id]).filter(Boolean),
  );
  const [right, setRight] = useState<Module[]>(() =>
    clinicianModules.clinicalActions.map((id) => CLIN_BY_ID[id]).filter(Boolean),
  );
  const [showPreview, setShowPreview] = useState(false);
  const [drag, setDrag] = useState<{ id: string; col: Col } | null>(null);
  const [dropIdx, setDropIdx] = useState<{ col: Col; index: number } | null>(null);
  const [minError, setMinError] = useState(false);

  const present = new Set([...left, ...right].map((m) => m.id));
  const removed = CLIN_ALL.filter((m) => !present.has(m.id));
  const totalActive = left.length + right.length;

  const move = (id: string, dir: "up" | "down") => {
    const inLeft = left.find((m) => m.id === id);
    const list = inLeft ? left : right;
    const setList = inLeft ? setLeft : setRight;
    const idx = list.findIndex((m) => m.id === id);
    if (dir === "up" && idx > 0) {
      const a = [...list];
      [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]];
      setList(a);
    } else if (dir === "down" && idx < list.length - 1) {
      const a = [...list];
      [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]];
      setList(a);
    }
  };

  const remove = (id: string) => {
    if (totalActive <= 1) {
      setMinError(true);
      return;
    }
    setMinError(false);
    setLeft(left.filter((m) => m.id !== id));
    setRight(right.filter((m) => m.id !== id));
  };
  const addBack = (id: string) => {
    const orig = CLIN_ALL.find((m) => m.id === id);
    if (!orig) return;
    setMinError(false);
    const wasLeft = CLIN_LEFT_DEFAULT.some((m) => m.id === id);
    if (wasLeft) setLeft([...left, orig]);
    else setRight([...right, orig]);
  };

  const onDragStart = (id: string, col: Col) => setDrag({ id, col });
  const onDragOverItem = (col: Col, index: number) => {
    if (!drag || drag.col !== col) return;
    setDropIdx({ col, index });
  };
  const onDragEnd = () => {
    setDrag(null);
    setDropIdx(null);
  };
  const onDropCol = (col: Col) => {
    if (!drag || drag.col !== col || !dropIdx || dropIdx.col !== col) {
      onDragEnd();
      return;
    }
    const list = col === "left" ? left : right;
    const setList = col === "left" ? setLeft : setRight;
    const from = list.findIndex((m) => m.id === drag.id);
    if (from < 0) {
      onDragEnd();
      return;
    }
    let to = dropIdx.index;
    const a = [...list];
    const [moved] = a.splice(from, 1);
    if (to > from) to -= 1;
    a.splice(to, 0, moved);
    setList(a);
    onDragEnd();
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <ColumnZone
          label="Patient data"
          col="left"
          modules={left}
          onMove={move}
          onRemove={remove}
          drag={drag}
          dropIdx={dropIdx}
          onDragStart={onDragStart}
          onDragOverItem={onDragOverItem}
          onDragEnd={onDragEnd}
          onDropCol={onDropCol}
        />
        <ColumnZone
          label="Clinical actions"
          col="right"
          modules={right}
          onMove={move}
          onRemove={remove}
          drag={drag}
          dropIdx={dropIdx}
          onDragStart={onDragStart}
          onDragOverItem={onDragOverItem}
          onDragEnd={onDragEnd}
          onDropCol={onDropCol}
        />
      </div>

      <RemovedModules removed={removed} onAddBack={addBack} />
      {minError && (
        <div style={{ marginBottom: 12, fontSize: 14, color: WF_DARK, fontWeight: 600 }}>
          At least one module must remain on the dashboard.
        </div>
      )}





      <PreviewToggle
        label="Preview — clinician view of a patient dashboard"
        open={showPreview}
        onToggle={() => setShowPreview(!showPreview)}
      />
      {showPreview && <ClinicianPreview left={left} right={right} />}

      <SaveFooter
        tab="clinician"
        disabled={totalActive === 0}
        onCommit={() => {
          const next: ClinicianModules = {
            patientData: left.map((m) => m.id),
            clinicalActions: right.map((m) => m.id),
          };
          setClinicianModules(next);
        }}
      />
    </>
  );
}

function DropIndicator({ active }: { active: boolean }) {
  return (
    <div
      style={{
        height: active ? 0 : 0,
        borderTop: active ? `2px dashed ${WF_DARK}` : "none",
        margin: active ? "3px 0" : 0,
      }}
    />
  );
}

function ColumnZone({
  label,
  col,
  modules,
  onMove,
  onRemove,
  drag,
  dropIdx,
  onDragStart,
  onDragOverItem,
  onDragEnd,
  onDropCol,
}: {
  label: string;
  col: Col;
  modules: Module[];
  onMove: (id: string, dir: "up" | "down") => void;
  onRemove: (id: string) => void;
  drag: { id: string; col: Col } | null;
  dropIdx: { col: Col; index: number } | null;
  onDragStart: (id: string, col: Col) => void;
  onDragOverItem: (col: Col, index: number) => void;
  onDragEnd: () => void;
  onDropCol: (col: Col) => void;
}) {
  const sameCol = drag?.col === col;
  return (
    <div
      onDragOver={(e) => {
        if (sameCol) e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDropCol(col);
      }}
      style={{
        background: WF_BG,
        border: `1px dashed ${WF_MID}`,
        padding: 12,
        minHeight: 220,
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: WF_MID,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 10,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {modules.map((m, i) => (
          <div
            key={m.id}
            onDragOver={(e) => {
              if (!sameCol) return;
              e.preventDefault();
              e.stopPropagation();
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const before = e.clientY < rect.top + rect.height / 2;
              onDragOverItem(col, before ? i : i + 1);
            }}
          >
            <DropIndicator active={sameCol && dropIdx?.col === col && dropIdx?.index === i} />
            <ModuleCard
              module={m}
              onRemove={() => onRemove(m.id)}
              canMoveUp={i > 0}
              canMoveDown={i < modules.length - 1}
              onUp={() => onMove(m.id, "up")}
              onDown={() => onMove(m.id, "down")}
              draggable
              dragging={drag?.id === m.id}
              onDragStart={() => onDragStart(m.id, col)}
              onDragEnd={onDragEnd}
            />
          </div>
        ))}
        <DropIndicator active={sameCol && dropIdx?.col === col && dropIdx?.index === modules.length} />
      </div>
    </div>
  );
}

function ModuleCard({
  module: m,
  onRemove,
  canMoveUp,
  canMoveDown,
  onUp,
  onDown,
  draggable,
  dragging,
  onDragStart,
  onDragEnd,
}: {
  module: Module;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onUp: () => void;
  onDown: () => void;
  draggable?: boolean;
  dragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        ...CARD,
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: dragging ? 0.4 : 1,
        cursor: draggable ? "grab" : "default",
      }}
    >
      <span style={{ color: WF_MID, cursor: "grab", fontSize: 16, userSelect: "none" }}>⋮⋮</span>
      <span style={{ flex: 1, fontSize: 16, color: WF_DARK }}>{m.name}</span>
      <button onClick={onUp} disabled={!canMoveUp} style={iconBtnStyle(canMoveUp)} title="Move up">
        ↑
      </button>
      <button onClick={onDown} disabled={!canMoveDown} style={iconBtnStyle(canMoveDown)} title="Move down">
        ↓
      </button>
      <button onClick={onRemove} style={{ ...iconBtnStyle(true), color: WF_DARK }} title="Remove">
        ×
      </button>
    </div>
  );
}

function iconBtnStyle(enabled: boolean): React.CSSProperties {
  return {
    background: "transparent",
    border: `1px solid ${enabled ? WF_MID : "#E0E0E0"}`,
    width: 24,
    height: 24,
    fontSize: 14,
    color: enabled ? WF_DARK : "#CCC",
    cursor: enabled ? "pointer" : "not-allowed",
    padding: 0,
    lineHeight: 1,
  };
}




function RemovedModules({ removed, onAddBack }: { removed: Module[]; onAddBack: (id: string) => void }) {
  if (removed.length === 0) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 13,
          color: WF_MID,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 8,
        }}
      >
        Removed modules
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {removed.map((m) => (
          <div
            key={m.id}
            style={{
              ...CARD,
              padding: "8px 12px",
              background: WF_BG,
              color: WF_MID,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ flex: 1, fontSize: 15 }}>{m.name}</span>
            <button
              onClick={() => onAddBack(m.id)}
              style={{
                background: "transparent",
                border: "none",
                color: WF_DARK,
                fontSize: 14,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Add back
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewToggle({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <div
      style={{
        borderTop: `1px solid ${WF_MID}`,
        padding: "16px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16,
      }}
    >
      <span style={{ fontSize: 15, color: WF_DARK, fontWeight: 500 }}>{label}</span>
      <button
        onClick={onToggle}
        style={{
          background: "transparent",
          border: `1.5px solid ${TEAL}`,
          padding: "8px 16px",
          fontSize: 14,
          color: TEAL,
          fontWeight: 500,
          borderRadius: 8,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {open ? "Hide preview" : "Show preview"}
      </button>
    </div>
  );
}

/* ============================== CLINICIAN PREVIEW ============================== */

function ClinicianPreview({ left, right }: { left: Module[]; right: Module[] }) {
  const pill: React.CSSProperties = {
    background: SUCCESS_BG,
    color: SUCCESS_TEXT,
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 999,
    fontWeight: 500,
  };
  const riskPill: React.CSSProperties = {
    background: "#faeeda",
    color: "#633806",
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 999,
    fontWeight: 500,
  };
  const sep = <span style={{ color: WF_MID }}>·</span>;
  return (
    <div style={{ ...CARD, padding: 16, marginBottom: 16, position: "relative" }}>
      {/* Patient header */}
      <div style={{ borderBottom: `1px solid ${WF_MID}`, paddingBottom: 12, marginBottom: 12 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: WF_DARK,
            flexWrap: "nowrap",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: WF_BG,
              border: `1px solid ${WF_MID}`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: WF_DARK,
              flexShrink: 0,
            }}
          >
            ET
          </span>
          {sep}
          <span style={{ fontWeight: 600, fontSize: 14, color: WF_DARK }}>Emma Tremblay</span>
          {sep}
          <span style={{ color: WF_MID }}>4 Aug 2014 · Age 11</span>
          {sep}
          <span style={{ color: WF_MID }}>T1D · 3 years</span>
          {sep}
          <span style={{ color: WF_MID }}>Margaret Chen — Mother</span>
          {sep}
          <span style={{ color: WF_MID }}>Dr. Reyes</span>
          {sep}
          <span style={{ color: WF_MID }}>Last seen: 2 days ago</span>
          <span style={{ flex: 1 }} />
          <a
            href="#"
            style={{ color: TEAL, fontWeight: 500, marginLeft: 16, textDecoration: "none", flexShrink: 0 }}
          >
            View Care profile →
          </a>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <span style={pill}>Active</span>
          <span style={pill}>CGM connected</span>
          <span style={pill}>Pump connected</span>
          <span style={riskPill}>A1c</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {left.map((m) => (
            <PreviewModuleCard key={m.id} module={m} variant="clinician" />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {right.map((m) => (
            <PreviewModuleCard key={m.id} module={m} variant="clinician" />
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewModuleCard({ module: m, variant }: { module: Module; variant: "clinician" | "patient" }) {
  const compact = variant === "patient";
  return (
    <div style={{ ...CARD, padding: compact ? 10 : 12 }}>
      <ModuleHeader id={m.id} compact={compact} />
      <ModuleBody id={m.id} compact={compact} />
    </div>
  );
}

function ModuleHeader({ id, compact }: { id: string; compact: boolean }) {
  const titles: Record<string, [string, string]> = {
    glucose: ["Glucose", "Last 7 days"],
    insulin: ["Insulin", "Last 7 days"],
    recs: ["Recommendations", "+ Add"],
    recommendations: ["Recommendations", "+ Add"],
    todo: ["Things to do", "+ Add task"],
    resources: ["Resources", "+ Share resource"],
    labs: ["Labs & test results", ""],
    completedForms: ["Completed forms", "View all"],
    appointments: ["Appointments", ""],
    completedTasks: ["Completed tasks", ""],
    assignedForms: ["Assigned forms", "+ Assign"],
    assignedTasks: ["Assigned tasks", "+ Add task"],
  };
  const [t, r] = titles[id] ?? [id, ""];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <span style={{ fontSize: compact ? 13 : 14, fontWeight: 600, color: WF_DARK }}>{t}</span>
      {!compact && r && <span style={{ fontSize: 13, color: WF_MID }}>{r}</span>}
    </div>
  );
}

function LineChartStub({ height = 80 }: { height?: number }) {
  return (
    <svg width="100%" height={height} viewBox="0 0 200 80" preserveAspectRatio="none">
      <line x1="0" y1="80" x2="200" y2="80" stroke={WF_MID} strokeWidth="0.5" />
      <line x1="0" y1="0" x2="0" y2="80" stroke={WF_MID} strokeWidth="0.5" />
      <polyline
        fill="none"
        stroke={WF_DARK}
        strokeWidth="1.2"
        points="0,55 25,40 50,48 75,30 100,42 125,28 150,38 175,22 200,32"
      />
    </svg>
  );
}

function BarChartStub({ height = 80 }: { height?: number }) {
  const bars = [40, 55, 35, 60, 48, 52, 42];
  return (
    <svg width="100%" height={height} viewBox="0 0 200 80" preserveAspectRatio="none">
      <line x1="0" y1="80" x2="200" y2="80" stroke={WF_MID} strokeWidth="0.5" />
      {bars.map((h, i) => (
        <rect key={i} x={i * 28 + 6} y={80 - h} width="20" height={h} fill={WF_DARK} opacity={0.75} />
      ))}
    </svg>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 13, padding: "3px 8px", border: `1px solid ${WF_MID}`, color: WF_DARK }}>
      {children}
    </span>
  );
}

function ModuleBody({ id, compact }: { id: string; compact: boolean }) {
  if (id === "glucose") {
    return (
      <>
        <LineChartStub height={compact ? 70 : 90} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          <Chip>Avg: 7.4 mmol/L</Chip>
          <Chip>Time in range: 68%</Chip>
          {!compact && <Chip>Lows: 3 events</Chip>}
        </div>
      </>
    );
  }
  if (id === "insulin") {
    return (
      <>
        <BarChartStub height={compact ? 70 : 90} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          <Chip>Avg daily dose: 42U</Chip>
          {!compact && <Chip>Basal/Bolus: 55% / 45%</Chip>}
        </div>
      </>
    );
  }
  if (id === "recs") {
    if (compact) {
      return (
        <div style={{ fontSize: 14, color: WF_DARK }}>
          <div style={{ marginBottom: 8 }}>Increase evening basal by 1U</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={miniBtn(true)}>Accept</button>
            <button style={miniBtn(false)}>Decline</button>
          </div>
        </div>
      );
    }
    return (
      <div style={{ fontSize: 14, color: WF_DARK, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Increase evening basal by 1U</span>
          <span style={{ color: WF_MID }}>Accepted</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Review carb ratios at breakfast</span>
          <span style={{ color: WF_MID }}>Pending</span>
        </div>
      </div>
    );
  }
  if (id === "todo") {
    const tasks = compact
      ? [
          { label: "Log dinner BG reading", done: true },
          { label: "Bring meter to next visit", done: false },
        ]
      : [
          { label: "Review weekly CGM trace", done: true },
          { label: "Send carb counting resource", done: false },
          { label: "Call family re: school plan", done: false },
        ];
    return (
      <div style={{ fontSize: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        {tasks.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 12,
                height: 12,
                border: `1px solid ${WF_DARK}`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              {t.done ? "✓" : ""}
            </span>
            <span style={{ color: t.done ? WF_MID : WF_DARK, textDecoration: t.done ? "line-through" : "none" }}>
              {t.label}
            </span>
          </div>
        ))}
      </div>
    );
  }
  if (id === "resources") {
    if (compact) {
      return (
        <div style={{ fontSize: 14, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: WF_DARK }}>Carb Counting Guide</span>
          <a href="#" style={{ color: WF_DARK, textDecoration: "underline" }}>
            View
          </a>
        </div>
      );
    }
    return (
      <div style={{ fontSize: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Carb Counting Guide</span>
          <span style={{ color: WF_MID }}>Viewed</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Sick day management</span>
          <span style={{ color: WF_MID }}>Not yet viewed</span>
        </div>
      </div>
    );
  }
  if (id === "labs") {
    return (
      <div style={{ fontSize: 13, color: WF_MID, display: "flex", flexDirection: "column", gap: 4 }}>
        <div>Lipid panel · Last: 14 Jan 2025 · Next: 14 Jul 2025</div>
        <div>Renal function · Last: 14 Jan 2025 · Next: 14 Jul 2025</div>
        <div>Thyroid panel · Last: 3 Mar 2024 · Next: 3 Mar 2025</div>
        <div>Retinopathy · Last: 22 Nov 2023 · Next: 22 Nov 2024</div>
        <div>Neuropathy · Last: 22 Nov 2023 · Next: 22 Nov 2024</div>
      </div>
    );
  }
  if (id === "completedForms") {
    return (
      <div style={{ fontSize: 13, color: WF_MID, display: "flex", flexDirection: "column", gap: 4 }}>
        <div>Pre-appointment questionnaire · 28 Apr 2026</div>
        <div>Hypoglycaemia awareness · 12 Mar 2026</div>
        <div>Quality of life (PedsQL) · 1 Feb 2026</div>
      </div>
    );
  }
  if (id === "appointments") {
    return (
      <div style={{ fontSize: 13, color: WF_MID, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: WF_DARK, fontWeight: 600 }}>Next: 12 May 2026 · 10:30 AM</div>
        <div>Last: 12 Mar 2026 — Annual review</div>
        <div>4 Dec 2025 — Insulin adjustment</div>
      </div>
    );
  }
  if (id === "recommendations") {
    return (
      <div style={{ fontSize: 13, color: WF_MID, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: WF_DARK }}>Reviewed basal rate — reduce overnight dose by 10%.</div>
        <div>Dr. Reyes · 28 Apr 2026</div>
      </div>
    );
  }
  if (id === "assignedForms") {
    return (
      <div style={{ fontSize: 13, color: WF_MID, display: "flex", flexDirection: "column", gap: 4 }}>
        <div>Daily symptom log — Pending</div>
        <div>Hypoglycaemia awareness — Pending</div>
      </div>
    );
  }
  if (id === "assignedTasks") {
    return (
      <div style={{ fontSize: 13, color: WF_MID, display: "flex", flexDirection: "column", gap: 4 }}>
        <div>Log meals for 3 days — Due 15 May</div>
        <div>Check pump site daily — Ongoing</div>
      </div>
    );
  }
  if (id === "tasks") {
    return (
      <div style={{ fontSize: 13, color: WF_MID, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ textDecoration: "line-through" }}>Upload CGM data — Completed 28 Apr</div>
        <div style={{ textDecoration: "line-through" }}>Book next appointment — Completed 20 Apr</div>
      </div>
    );
  }
  if (id === "completedTasks") {
    return (
      <div style={{ fontSize: 13, color: WF_MID, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: TEAL, fontSize: 11 }}>✓</span>
          <span>Upload CGM data — Completed 28 Apr</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: TEAL, fontSize: 11 }}>✓</span>
          <span>Book next appointment — Completed 20 Apr</span>
        </div>
      </div>
    );
  }
  if (id === "labs") {
    return <div style={{ fontSize: 13, color: WF_MID }}>Lipid panel · A1c · Renal function · Thyroid panel</div>;
  }
  if (id === "completedForms") {
    return <div style={{ fontSize: 13, color: WF_MID }}>Pre-appointment questionnaire · 28 Apr 2026</div>;
  }
  if (id === "appointments") {
    return <div style={{ fontSize: 13, color: WF_MID }}>Next: 12 May 2026 · 10:30 AM</div>;
  }
  if (id === "assignedForms") {
    return <div style={{ fontSize: 13, color: WF_MID }}>Daily symptom log — Pending</div>;
  }
  if (id === "assignedTasks") {
    return <div style={{ fontSize: 13, color: WF_MID }}>Log meals for 3 days — Due 15 May</div>;
  }
  if (id === "recommendations") {
    return <div style={{ fontSize: 13, color: WF_MID }}>Reviewed basal rate — reduce overnight dose by 10%.</div>;
  }
  return null;
}

function miniBtn(primary: boolean): React.CSSProperties {
  return {
    fontSize: 13,
    padding: "4px 10px",
    border: `1px solid ${WF_DARK}`,
    background: primary ? WF_DARK : "#fff",
    color: primary ? "#fff" : WF_DARK,
    cursor: "pointer",
  };
}

function MessagesPanel({ onClose, mobile = false }: { onClose: () => void; mobile?: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: mobile ? "100%" : 320,
        background: "#fff",
        borderLeft: mobile ? "none" : `1px solid ${WF_MID}`,
        display: "flex",
        flexDirection: "column",
        boxShadow: "-4px 0 12px rgba(0,0,0,0.08)",
        zIndex: 5,
      }}
    >
      <div style={{ padding: 12, borderBottom: `1px solid ${WF_MID}`, display: "flex", alignItems: "center" }}>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: WF_DARK }}>Messages</span>
        <button
          onClick={onClose}
          style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: WF_DARK }}
        >
          ×
        </button>
      </div>
      <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
        <Bubble from="patient">Hi, my readings have been high after dinner this week.</Bubble>
        <Bubble from="patient">Should I adjust my dose?</Bubble>
        <Bubble from="clinician">Let's try increasing your evening basal by 1U and review in 3 days.</Bubble>
      </div>
      <div style={{ padding: 10, borderTop: `1px solid ${WF_MID}` }}>
        <div
          style={{
            border: `1px solid ${WF_MID}`,
            padding: "8px 10px",
            fontSize: 14,
            color: WF_MID,
          }}
        >
          Type a message…
        </div>
      </div>
    </div>
  );
}

function Bubble({ from, children }: { from: "patient" | "clinician"; children: React.ReactNode }) {
  const isPatient = from === "patient";
  return (
    <div
      style={{
        alignSelf: isPatient ? "flex-start" : "flex-end",
        maxWidth: "80%",
        fontSize: 14,
        padding: "6px 10px",
        background: isPatient ? WF_BG : WF_DARK,
        color: isPatient ? WF_DARK : "#fff",
        border: isPatient ? `1px solid ${WF_MID}` : "none",
        borderRadius: 8,
      }}
    >
      {children}
    </div>
  );
}

/* ============================== PATIENT ============================== */

function PatientBuilder() {
  const [modules, setModules] = useState<Module[]>(PATIENT_DEFAULT);
  const [minError, setMinError] = useState(false);
  const [drag, setDrag] = useState<string | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);

  const present = new Set(modules.map((m) => m.id));
  const removed = PATIENT_DEFAULT.filter((m) => !present.has(m.id));

  const onMove = (id: string, dir: "up" | "down") => {
    const idx = modules.findIndex((m) => m.id === id);
    if (dir === "up" && idx > 0) {
      const a = [...modules];
      [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]];
      setModules(a);
    } else if (dir === "down" && idx < modules.length - 1) {
      const a = [...modules];
      [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]];
      setModules(a);
    }
  };
  const remove = (id: string) => {
    if (modules.length <= 1) {
      setMinError(true);
      return;
    }
    setMinError(false);
    setModules(modules.filter((m) => m.id !== id));
  };
  const addBack = (id: string) => {
    const orig = PATIENT_DEFAULT.find((m) => m.id === id);
    if (orig) {
      setMinError(false);
      setModules([...modules, orig]);
    }
  };

  const onDragStart = (id: string) => setDrag(id);
  const onDragOverItem = (index: number) => {
    if (!drag) return;
    setDropIdx(index);
  };
  const onDragEnd = () => {
    setDrag(null);
    setDropIdx(null);
  };
  const onDrop = () => {
    if (!drag || dropIdx === null) {
      onDragEnd();
      return;
    }
    const from = modules.findIndex((m) => m.id === drag);
    if (from < 0) {
      onDragEnd();
      return;
    }
    let to = dropIdx;
    const a = [...modules];
    const [moved] = a.splice(from, 1);
    if (to > from) to -= 1;
    a.splice(to, 0, moved);
    setModules(a);
    onDragEnd();
  };

  return (
    <>
      <div
        style={{
          fontSize: 13,
          color: WF_MID,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 6,
          fontWeight: 600,
        }}
      >
        MODULE ORDER
      </div>
      <p style={{ fontSize: 14, color: WF_MID, margin: "0 0 12px" }}>
        Drag to reorder. Patients can reorder their own modules afterward — this only sets their starting view.
      </p>
      <div
        onDragOver={(e) => {
          if (drag) e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          onDrop();
        }}
        style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}
      >
        {modules.map((m, i) => (
          <div
            key={m.id}
            onDragOver={(e) => {
              if (!drag) return;
              e.preventDefault();
              e.stopPropagation();
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const before = e.clientY < rect.top + rect.height / 2;
              onDragOverItem(before ? i : i + 1);
            }}
          >
            <DropIndicator active={dropIdx === i} />
            <ModuleCard
              module={m}
              onRemove={() => remove(m.id)}
              canMoveUp={i > 0}
              canMoveDown={i < modules.length - 1}
              onUp={() => onMove(m.id, "up")}
              onDown={() => onMove(m.id, "down")}
              draggable
              dragging={drag === m.id}
              onDragStart={() => onDragStart(m.id)}
              onDragEnd={onDragEnd}
            />
          </div>
        ))}
        <DropIndicator active={dropIdx === modules.length} />
      </div>

      <RemovedModules removed={removed} onAddBack={addBack} />
      {minError && (
        <div style={{ marginBottom: 12, fontSize: 14, color: WF_DARK, fontWeight: 600 }}>
          At least one module must remain on the dashboard.
        </div>
      )}

      <PatientPreview modules={modules} />

      <SaveFooter tab="patient" disabled={modules.length === 0} />
    </>
  );
}

function PatientPreview({ modules }: { modules: Module[] }) {
  const [msgOpen, setMsgOpen] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0", marginBottom: 16 }}>
      <div style={{ fontSize: 13, color: WF_MID, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
        Mobile preview
      </div>
      <div
        style={{
          width: 375,
          maxWidth: "100%",
          background: WF_BG,
          border: `2px solid ${WF_DARK}`,
          borderRadius: 24,
          padding: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: "#fff",
            border: `1px solid ${WF_MID}`,
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              border: `1px solid ${WF_DARK}`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: WF_DARK,
            }}
          >
            H
          </span>
          <span style={{ flex: 1 }} />
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: `1px solid ${WF_MID}`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: WF_MID,
            }}
          >
            ET
          </span>
        </div>

        {/* Greeting */}
        <div style={{ padding: "0 4px 12px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: WF_DARK }}>Hello, Emma</div>
          <div style={{ fontSize: 13, color: WF_MID }}>Wednesday, May 27</div>
        </div>

        {/* Modules */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 60 }}>
          {modules.map((m) => (
            <PreviewModuleCard key={m.id} module={m} variant="patient" />
          ))}
        </div>

        {/* FAB */}
        <button
          onClick={() => setMsgOpen(true)}
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: TEAL,
            color: "#fff",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
            zIndex: 4,
          }}
          title="Messages"
        >
          💬
        </button>

        {msgOpen && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              top: 60,
              background: "#fff",
              borderTop: `1px solid ${WF_MID}`,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 -4px 12px rgba(0,0,0,0.12)",
              zIndex: 5,
            }}
          >
            <div style={{ padding: 12, borderBottom: `1px solid ${WF_MID}`, display: "flex", alignItems: "center" }}>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: WF_DARK }}>Messages</span>
              <button
                onClick={() => setMsgOpen(false)}
                style={{ background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: WF_DARK }}
              >
                ×
              </button>
            </div>
            <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
              <Bubble from="patient">Hi, my readings have been high after dinner.</Bubble>
              <Bubble from="patient">Should I adjust my dose?</Bubble>
              <Bubble from="clinician">Let's try increasing evening basal by 1U and review in 3 days.</Bubble>
            </div>
            <div style={{ padding: 10, borderTop: `1px solid ${WF_MID}` }}>
              <div style={{ border: `1px solid ${WF_MID}`, padding: "8px 10px", fontSize: 14, color: WF_MID }}>
                Type a message…
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== SAVE FOOTER ============================== */

function SaveFooter({ tab, disabled, onCommit }: { tab: Tab; disabled?: boolean; onCommit?: () => void }) {
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");

  const onSave = () => {
    // simulate occasional error
    if (Math.random() < 0.08) {
      setState("error");
      return;
    }
    onCommit?.();
    setState("saved");
    setTimeout(() => setState("idle"), 1500);
  };

  const callout =
    tab === "clinician"
      ? "Applies to new clinician accounts. Existing clinician dashboard layouts will not be changed."
      : "Applies to new patient accounts. Existing patient dashboard layouts will not be changed.";

  return (
    <>
      <div
        style={{
          marginTop: 24,
          padding: "10px 12px",
          background: WF_BG,
          border: `1px solid ${WF_MID}`,
          fontSize: 14,
          color: WF_DARK,
        }}
      >
        {callout}
      </div>
      {state === "error" && (
        <div style={{ marginTop: 8, fontSize: 14, color: WF_DARK, fontWeight: 600 }}>
          Could not save. Please try again.
        </div>
      )}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          marginTop: 12,
          padding: "12px 0",
          background: WF_BG,
          borderTop: `1px solid ${WF_MID}`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ flex: 1, fontSize: 16, color: WF_MID }}>Last saved: today at 2:34 PM</span>
        <button
          onClick={onSave}
          disabled={disabled}
          style={{
            background: disabled ? WF_MID : TEAL,
            color: "#fff",
            border: `1px solid ${disabled ? WF_MID : TEAL}`,
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 15,
            cursor: disabled ? "not-allowed" : "pointer",
            minWidth: 130,
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {state === "saved" ? "Saved ✓" : "Save template"}
        </button>
      </div>
    </>
  );
}
