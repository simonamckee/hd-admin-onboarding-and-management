import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { WF_BG, WF_DARK, WF_MID, TEAL } from "@/components/wireframe";

export const Route = createFileRoute("/admin/dashboards")({ component: DashboardTemplates });

type Tab = "clinician" | "patient";
type Col = "left" | "right";
type Module = { id: string; name: string; required?: boolean };

const CLIN_LEFT_DEFAULT: Module[] = [
  { id: "glucose", name: "Glucose", required: true },
  { id: "insulin", name: "Insulin", required: true },
];
const CLIN_RIGHT_DEFAULT: Module[] = [
  { id: "recs", name: "Recommendations", required: true },
  { id: "todo", name: "Things to do", required: true },
  { id: "resources", name: "Resources", required: true },
];
const CLIN_ALL = [...CLIN_LEFT_DEFAULT, ...CLIN_RIGHT_DEFAULT];

const PATIENT_DEFAULT: Module[] = [
  { id: "glucose", name: "Glucose", required: true },
  { id: "insulin", name: "Insulin", required: true },
  { id: "todo", name: "Things to do", required: true },
  { id: "recs", name: "Recommendations", required: true },
  { id: "resources", name: "Resources", required: true },
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
      ? "Define how the patient dashboard is laid out when a clinician opens it. Changes apply to new clinician accounts only — existing layouts are not affected."
      : "Define how the patient dashboard is laid out when a patient opens it. Most patients access Haibu on mobile. Changes apply to new patient accounts only — existing layouts are not affected.";

  return (
    <AdminShell heading="">
      <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 16px", color: WF_DARK }}>
        Dashboard templates
      </h1>

      <div style={{ display: "flex", borderBottom: `1px solid ${WF_MID}`, marginBottom: 16 }}>
        {(["clinician", "patient"] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "transparent",
                border: "none",
                padding: "10px 16px",
                fontSize: 14,
                color: active ? WF_DARK : WF_MID,
                fontWeight: active ? 600 : 400,
                borderBottom: active ? `2px solid ${WF_DARK}` : "2px solid transparent",
                marginBottom: -1,
                cursor: "pointer",
              }}
            >
              {t === "clinician" ? "Clinician view" : "Patient view"}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 13, color: WF_MID, margin: "0 0 24px", lineHeight: 1.5 }}>{helper}</p>

      {tab === "clinician" ? <ClinicianBuilder /> : <PatientBuilder />}

      <PrototypeBack />
    </AdminShell>
  );
}

/* ============================== CLINICIAN ============================== */

function ClinicianBuilder() {
  const [left, setLeft] = useState<Module[]>(CLIN_LEFT_DEFAULT);
  const [right, setRight] = useState<Module[]>(CLIN_RIGHT_DEFAULT);
  const [showPreview, setShowPreview] = useState(false);
  const [drag, setDrag] = useState<{ id: string; col: Col } | null>(null);
  const [dropIdx, setDropIdx] = useState<{ col: Col; index: number } | null>(null);

  const present = new Set([...left, ...right].map((m) => m.id));
  const removed = CLIN_ALL.filter((m) => !present.has(m.id) && !m.required);

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
    setLeft(left.filter((m) => m.id !== id));
    setRight(right.filter((m) => m.id !== id));
  };
  const addBack = (id: string) => {
    const orig = CLIN_ALL.find((m) => m.id === id);
    if (!orig) return;
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

      <MessagesInfoRow
        rightText="Always accessible from the patient header"
        tooltip="Messages opens as a panel from the patient header bar. It is always available to clinicians and does not need to be placed in the layout."
      />


      <PreviewToggle
        label="Preview — clinician view of a patient dashboard"
        open={showPreview}
        onToggle={() => setShowPreview(!showPreview)}
      />
      {showPreview && <ClinicianPreview left={left} right={right} />}

      <SaveFooter tab="clinician" />
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
          fontSize: 11,
          color: WF_MID,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 10,
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
      <span style={{ color: WF_MID, cursor: "grab", fontSize: 14, userSelect: "none" }}>⋮⋮</span>
      <span style={{ flex: 1, fontSize: 14, color: WF_DARK }}>{m.name}</span>
      {m.required && (
        <span style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.3 }}>
          Required
        </span>
      )}
      <button onClick={onUp} disabled={!canMoveUp} style={iconBtnStyle(canMoveUp)} title="Move up">
        ↑
      </button>
      <button onClick={onDown} disabled={!canMoveDown} style={iconBtnStyle(canMoveDown)} title="Move down">
        ↓
      </button>
      {!m.required && (
        <button onClick={onRemove} style={{ ...iconBtnStyle(true), color: WF_DARK }} title="Remove">
          ×
        </button>
      )}
    </div>
  );
}

function iconBtnStyle(enabled: boolean): React.CSSProperties {
  return {
    background: "transparent",
    border: `1px solid ${enabled ? WF_MID : "#E0E0E0"}`,
    width: 24,
    height: 24,
    fontSize: 12,
    color: enabled ? WF_DARK : "#CCC",
    cursor: enabled ? "pointer" : "not-allowed",
    padding: 0,
    lineHeight: 1,
  };
}

function MessagesInfoRow({ rightText, tooltip }: { rightText: string; tooltip: string }) {
  return (
    <>
      <div style={{ height: 1, background: WF_MID, opacity: 0.3, margin: "16px 0" }} />
      <div
        style={{
          ...CARD,
          background: WF_BG,
          borderColor: "#E0E0E0",
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: WF_MID,
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 14 }}>Messages</span>
        <span
          title={tooltip}
          style={{
            display: "inline-flex",
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: `1px solid ${WF_MID}`,
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            cursor: "help",
          }}
        >
          ⓘ
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 12 }}>{rightText}</span>
      </div>
    </>
  );
}

function RemovedModules({ removed, onAddBack }: { removed: Module[]; onAddBack: (id: string) => void }) {
  if (removed.length === 0) return null;
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 11,
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
            <span style={{ flex: 1, fontSize: 13 }}>{m.name}</span>
            <button
              onClick={() => onAddBack(m.id)}
              style={{
                background: "transparent",
                border: "none",
                color: WF_DARK,
                fontSize: 12,
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
      <span style={{ fontSize: 13, color: WF_DARK, fontWeight: 500 }}>{label}</span>
      <button
        onClick={onToggle}
        style={{
          background: "transparent",
          border: `1px solid ${WF_MID}`,
          padding: "6px 12px",
          fontSize: 12,
          color: WF_DARK,
          cursor: "pointer",
        }}
      >
        {open ? "Hide preview" : "Show preview"}
      </button>
    </div>
  );
}

/* ============================== CLINICIAN PREVIEW ============================== */

function ClinicianPreview({ left, right }: { left: Module[]; right: Module[] }) {
  const [msgOpen, setMsgOpen] = useState(false);
  return (
    <div style={{ ...CARD, padding: 16, marginBottom: 16, position: "relative" }}>
      {/* Patient header */}
      <div style={{ borderBottom: `1px solid ${WF_MID}`, paddingBottom: 12, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: WF_DARK }}>Emma Tremblay</span>
            <span style={{ fontSize: 11, border: `1px solid ${WF_DARK}`, padding: "2px 6px", color: WF_DARK }}>
              Active
            </span>
          </div>
          <div style={{ fontSize: 11, color: WF_MID, marginTop: 4 }}>
            DOB: March 4, 2018 · Diagnosed: June 12, 2020 · Last sync: 2h ago
          </div>
        </div>
        <button
          onClick={() => setMsgOpen(true)}
          style={{
            border: `1px solid ${WF_DARK}`,
            background: "#fff",
            padding: "6px 12px",
            fontSize: 12,
            color: WF_DARK,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          💬 Messages
        </button>
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

      {msgOpen && <MessagesPanel onClose={() => setMsgOpen(false)} />}
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
    todo: ["Things to do", "+ Add task"],
    resources: ["Resources", "+ Share resource"],
  };
  const [t, r] = titles[id] ?? [id, ""];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <span style={{ fontSize: compact ? 13 : 14, fontWeight: 600, color: WF_DARK }}>{t}</span>
      {!compact && r && <span style={{ fontSize: 11, color: WF_MID }}>{r}</span>}
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
    <span style={{ fontSize: 11, padding: "3px 8px", border: `1px solid ${WF_MID}`, color: WF_DARK }}>
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
        <div style={{ fontSize: 12, color: WF_DARK }}>
          <div style={{ marginBottom: 8 }}>Increase evening basal by 1U</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={miniBtn(true)}>Accept</button>
            <button style={miniBtn(false)}>Decline</button>
          </div>
        </div>
      );
    }
    return (
      <div style={{ fontSize: 12, color: WF_DARK, display: "flex", flexDirection: "column", gap: 6 }}>
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
      <div style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
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
                fontSize: 10,
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
        <div style={{ fontSize: 12, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: WF_DARK }}>Carb Counting Guide</span>
          <a href="#" style={{ color: WF_DARK, textDecoration: "underline" }}>
            View
          </a>
        </div>
      );
    }
    return (
      <div style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
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
  return null;
}

function miniBtn(primary: boolean): React.CSSProperties {
  return {
    fontSize: 11,
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
        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: WF_DARK }}>Messages</span>
        <button
          onClick={onClose}
          style={{ background: "transparent", border: "none", fontSize: 16, cursor: "pointer", color: WF_DARK }}
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
            fontSize: 12,
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
        fontSize: 12,
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
  const [showPreview, setShowPreview] = useState(false);

  const present = new Set(modules.map((m) => m.id));
  const removed = PATIENT_DEFAULT.filter((m) => !present.has(m.id) && !m.required);

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
  const remove = (id: string) => setModules(modules.filter((m) => m.id !== id));
  const addBack = (id: string) => {
    const orig = PATIENT_DEFAULT.find((m) => m.id === id);
    if (orig) setModules([...modules, orig]);
  };

  return (
    <>
      <div
        style={{
          fontSize: 11,
          color: WF_MID,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 6,
        }}
      >
        Module order
      </div>
      <p style={{ fontSize: 12, color: WF_MID, margin: "0 0 12px" }}>
        Drag to reorder. Required modules cannot be removed. Patients can reorder after their first login —
        this sets their starting view.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 4 }}>
        {modules.map((m, i) => (
          <ModuleCard
            key={m.id}
            module={m}
            onRemove={() => remove(m.id)}
            canMoveUp={i > 0}
            canMoveDown={i < modules.length - 1}
            onUp={() => onMove(m.id, "up")}
            onDown={() => onMove(m.id, "down")}
          />
        ))}
      </div>

      <MessagesInfoRow
        rightText="Always accessible as a floating button"
        tooltip="On mobile, Messages appears as a floating chat button fixed to the bottom of the screen. It is always accessible and does not need to be placed in the layout."
      />

      

      <PreviewToggle
        label="Preview — patient view on mobile"
        open={showPreview}
        onToggle={() => setShowPreview(!showPreview)}
      />
      {showPreview && <PatientPreview modules={modules} />}

      <SaveFooter tab="patient" />
    </>
  );
}

function PatientPreview({ modules }: { modules: Module[] }) {
  const [msgOpen, setMsgOpen] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0", marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: WF_MID, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
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
              fontSize: 12,
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
              fontSize: 10,
              color: WF_MID,
            }}
          >
            ET
          </span>
        </div>

        {/* Greeting */}
        <div style={{ padding: "0 4px 12px" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: WF_DARK }}>Hello, Emma</div>
          <div style={{ fontSize: 11, color: WF_MID }}>Wednesday, May 27</div>
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
            fontSize: 20,
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
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: WF_DARK }}>Messages</span>
              <button
                onClick={() => setMsgOpen(false)}
                style={{ background: "transparent", border: "none", fontSize: 16, cursor: "pointer", color: WF_DARK }}
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
              <div style={{ border: `1px solid ${WF_MID}`, padding: "8px 10px", fontSize: 12, color: WF_MID }}>
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

function SaveFooter({ tab }: { tab: Tab }) {
  const [state, setState] = useState<"idle" | "saved" | "error">("idle");

  const onSave = () => {
    // simulate occasional error
    if (Math.random() < 0.08) {
      setState("error");
      return;
    }
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
          fontSize: 12,
          color: WF_DARK,
        }}
      >
        {callout}
      </div>
      {state === "error" && (
        <div style={{ marginTop: 8, fontSize: 12, color: WF_DARK, fontWeight: 600 }}>
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
        <span style={{ flex: 1, fontSize: 12, color: WF_MID }}>Last saved: today at 2:34 PM</span>
        <button
          onClick={onSave}
          style={{
            background: TEAL,
            color: "#fff",
            border: `1px solid ${TEAL}`,
            padding: "8px 16px",
            fontSize: 13,
            cursor: "pointer",
            minWidth: 130,
          }}
        >
          {state === "saved" ? "Saved ✓" : "Save template"}
        </button>
      </div>
    </>
  );
}
