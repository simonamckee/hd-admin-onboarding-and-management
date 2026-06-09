import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode, type CSSProperties } from "react";
import {
  AlertCircle,
  Calendar,
  Users,
  Search,
  SlidersHorizontal,
  ChevronDown,
  AlertTriangle,
  Watch,
  Droplet,
  FileText,
  ClipboardList,
  CheckSquare,
  Activity,
} from "lucide-react";
import { AdminShell } from "@/components/admin-shell";

export const Route = createFileRoute("/roster")({
  component: RosterPage,
});

const TEAL = "#00565B";
const BORDER = "#e0e4e5";
const ROW_BORDER = "#f0f2f3";
const MUTED = "#7f949b";
const DARK = "#1f2a2c";
const DANGER = "#a32d2d";
const SUCCESS = "#27500a";

type Risk = "DKA" | "A1c" | "Low TIR";

type AccordionData = {
  hospitalVisits: number;
  pendingForms: number;
  pendingTasks: number;
  pendingActions: number;
};

type Patient = {
  id: string;
  name: string;
  dob: string;
  age: number;
  risks: Risk[];
  tir: number;
  gmi: number;
  cgm: boolean;
  pump: boolean;
  lastVisit: string;
  lastVisitDaysAgo?: number;
  nextAppt: string | null;
  nextApptSub?: string;
  messages: boolean;
  group: "atRisk" | "today" | "others";
  accordion: AccordionData;
};

const PATIENTS: Patient[] = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    dob: "15 Jun 1978",
    age: 47,
    risks: ["DKA", "Low TIR"],
    tir: 41,
    gmi: 8.2,
    cgm: true,
    pump: true,
    lastVisit: "147 days ago",
    lastVisitDaysAgo: 147,
    nextAppt: "2 May 2026",
    nextApptSub: "Tomorrow",
    messages: true,
    group: "atRisk",
    accordion: { hospitalVisits: 1, pendingForms: 1, pendingTasks: 2, pendingActions: 1 },
  },
  {
    id: "marcus-thompson",
    name: "Marcus Thompson",
    dob: "3 Nov 1965",
    age: 60,
    risks: [],
    tir: 72,
    gmi: 7.1,
    cgm: true,
    pump: false,
    lastVisit: "28 Jan 2026",
    nextAppt: "Today",
    nextApptSub: "Today · 10:30 AM",
    messages: false,
    group: "today",
    accordion: { hospitalVisits: 0, pendingForms: 1, pendingTasks: 0, pendingActions: 0 },
  },
  {
    id: "lily-park",
    name: "Lily Park",
    dob: "4 Aug 2014",
    age: 11,
    risks: ["A1c"],
    tir: 65,
    gmi: 7.5,
    cgm: true,
    pump: true,
    lastVisit: "14 Feb 2026",
    nextAppt: "Today",
    nextApptSub: "Today · 2:00 PM",
    messages: true,
    group: "today",
    accordion: { hospitalVisits: 0, pendingForms: 1, pendingTasks: 0, pendingActions: 0 },
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    dob: "8 Sep 1983",
    age: 42,
    risks: [],
    tir: 68,
    gmi: 7.3,
    cgm: true,
    pump: false,
    lastVisit: "147 days ago",
    lastVisitDaysAgo: 147,
    nextAppt: null,
    messages: false,
    group: "others",
    accordion: { hospitalVisits: 0, pendingForms: 0, pendingTasks: 0, pendingActions: 0 },
  },
];

const SORT_OPTIONS = ["At risk first", "TIR ↓", "GMI ↓", "Longest unseen", "A – Z"];

type FilterKey = "risk" | "tir" | "gmi" | "cgm" | "pump";
const FILTERS: { key: FilterKey; label: string; icon: ReactNode }[] = [
  { key: "risk", label: "Predicted risk", icon: <AlertTriangle size={10} /> },
  { key: "tir", label: "High TIR", icon: null },
  { key: "gmi", label: "High GMI", icon: null },
  { key: "cgm", label: "Using CGM", icon: <Watch size={10} /> },
  { key: "pump", label: "Using pump", icon: <Droplet size={10} /> },
];

function MessageBubble({ hasMessages }: { hasMessages: boolean }) {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: hasMessages ? "#e24b4a" : "#fff",
        border: hasMessages ? "none" : "0.5px solid #c8d2d4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2.5,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: hasMessages ? "#fff" : "#c8d2d4",
          }}
        />
      ))}
    </div>
  );
}

function RiskPills({ risks }: { risks: Risk[] }) {
  if (risks.length === 0) return <span style={{ color: MUTED }}>—</span>;
  const styles: Record<Risk, { bg: string; color: string }> = {
    DKA: { bg: "#fcebeb", color: "#791f1f" },
    A1c: { bg: "#faeeda", color: "#633806" },
    "Low TIR": { bg: "#fff3e0", color: "#854f0b" },
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
      {risks.map((r) => (
        <span
          key={r}
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 6px",
            borderRadius: 4,
            background: styles[r].bg,
            color: styles[r].color,
          }}
        >
          {r}
        </span>
      ))}
    </div>
  );
}

function DevicePill({ label, on }: { label: string; on: boolean }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: "2px 6px",
        borderRadius: 4,
        background: on ? "#e1f5ee" : "#f1efe8",
        color: on ? "#085041" : "#888780",
        display: "inline-block",
      }}
    >
      {label} {on ? "✓" : "–"}
    </span>
  );
}

const GRID = "34px minmax(0,130px) minmax(0,110px) minmax(0,72px) minmax(0,54px) minmax(0,90px) minmax(0,72px) minmax(0,90px) 80px";

function GroupHeader({ label, icon, bg, color }: { label: string; icon: ReactNode; bg: string; color: string }) {
  return (
    <div
      style={{
        background: bg,
        color,
        padding: "5px 12px",
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        display: "flex",
        alignItems: "center",
        gap: 6,
        borderBottom: `0.5px solid ${ROW_BORDER}`,
      }}
    >
      {icon}
      {label}
    </div>
  );
}

function PatientRow({
  p,
  open,
  onToggle,
}: {
  p: Patient;
  open: boolean;
  onToggle: () => void;
}) {
  const tirRed = p.tir < 70;
  const lastVisitRed = (p.lastVisitDaysAgo ?? 0) > 90;
  return (
    <>
      <div
        onClick={onToggle}
        style={{
          display: "grid",
          gridTemplateColumns: GRID,
          alignItems: "center",
          padding: "8px 10px",
          borderBottom: `0.5px solid ${ROW_BORDER}`,
          cursor: "pointer",
          background: open ? "#f4fbfa" : "#fff",
          gap: 8,
          fontFamily: "inherit",
          color: DARK,
        }}
      >
        <MessageBubble hasMessages={p.messages} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{p.name}</div>
          <div style={{ fontSize: 10, color: MUTED }}>{p.dob}</div>
          <div style={{ fontSize: 10, color: MUTED }}>Age {p.age}</div>
        </div>
        <RiskPills risks={p.risks} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: tirRed ? DANGER : SUCCESS }}>
            {p.tir}%
          </div>
          <div style={{ fontSize: 10, color: MUTED }}>{tirRed ? "Low" : "In range"}</div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: DARK }}>{p.gmi}%</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <DevicePill label="CGM" on={p.cgm} />
          <DevicePill label="Pump" on={p.pump} />
        </div>
        <div
          style={{
            fontSize: 11,
            color: lastVisitRed ? DANGER : DARK,
            fontWeight: lastVisitRed ? 700 : 400,
          }}
        >
          {p.lastVisit}
        </div>
        <div>
          {p.nextAppt ? (
            <>
              <div style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>{p.nextAppt}</div>
              {p.nextApptSub && <div style={{ fontSize: 10, color: MUTED }}>{p.nextApptSub}</div>}
            </>
          ) : (
            <span style={{ fontSize: 11, color: MUTED }}>No appt</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
          <button
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: "4px 10px",
              background: TEAL,
              color: "#fff",
              border: "none",
              borderRadius: 5,
              fontSize: 10,
              fontFamily: "inherit",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Dashboard
          </button>
          <ChevronDown
            size={11}
            color="#aab5b7"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
          />
        </div>
      </div>
      {open && <AccordionRow data={p.accordion} />}
    </>
  );
}

function AccordionRow({ data }: { data: AccordionData }) {
  const sections: { label: string; value: number; icon: ReactNode; teal?: boolean }[] = [
    { label: "Hospital visits", value: data.hospitalVisits, icon: <Activity size={11} /> },
    { label: "Pending forms", value: data.pendingForms, icon: <FileText size={11} /> },
    { label: "Pending tasks", value: data.pendingTasks, icon: <ClipboardList size={11} /> },
    { label: "Pending actions", value: data.pendingActions, icon: <CheckSquare size={11} />, teal: true },
  ];
  return (
    <div
      style={{
        background: "#f4fbfa",
        borderTop: "0.5px solid #d8eeeb",
        borderBottom: `0.5px solid ${ROW_BORDER}`,
        padding: "8px 10px 8px 44px",
        display: "flex",
      }}
    >
      {sections.map((s, i) => {
        const flagged = s.value > 0;
        const color = flagged ? (s.teal ? TEAL : DANGER) : "#b4b2a9";
        return (
          <div
            key={s.label}
            style={{
              flex: 1,
              padding: "0 14px",
              borderLeft: i === 0 ? "none" : "0.5px solid #d8eeeb",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: MUTED,
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                marginBottom: 4,
              }}
            >
              {s.icon}
              {s.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color }}>{s.value}</div>
          </div>
        );
      })}
    </div>
  );
}

function RosterPage() {
  const [clinician, setClinician] = useState("Dr. Reyes");
  const [sort, setSort] = useState("At risk first");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set());
  const [openRows, setOpenRows] = useState<Set<string>>(new Set());

  const orgLine = clinician === "All patients"
    ? "All clinicians — BC Children's Hospital"
    : "BC Children's Hospital";

  const toggleFilter = (k: FilterKey) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };

  const toggleRow = (id: string) => {
    setOpenRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const groups = useMemo(() => ({
    atRisk: PATIENTS.filter((p) => p.group === "atRisk"),
    today: PATIENTS.filter((p) => p.group === "today"),
    others: PATIENTS.filter((p) => p.group === "others"),
  }), []);

  const selectStyle: CSSProperties = {
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    background: `transparent url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%2300565B' stroke-width='1.5' fill='none'/></svg>") no-repeat right center`,
    border: "none",
    color: TEAL,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "Urbanist, system-ui, sans-serif",
    cursor: "pointer",
    paddingRight: 16,
    outline: "none",
  };

  return (
    <AdminShell heading="">
      <div style={{ margin: -32, background: "#fafbfb", minHeight: "calc(100vh - 56px)" }}>
        {/* Header bar */}
        <div
          style={{
            background: "#fff",
            height: 52,
            borderBottom: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <select value={clinician} onChange={(e) => setClinician(e.target.value)} style={selectStyle}>
              <option>Dr. Reyes</option>
              <option>Nurse Chen</option>
              <option>Dr. Kapoor</option>
              <option>All patients</option>
            </select>
            <span style={{ fontSize: 10, color: MUTED }}>{orgLine}</span>
          </div>

          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                height: 30,
                padding: "0 12px",
                border: `0.5px solid ${BORDER}`,
                borderRadius: 20,
                background: "#fff",
                width: "100%",
                maxWidth: 320,
              }}
            >
              <Search size={13} color={MUTED} />
              <input
                placeholder="Search patients…"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 12,
                  fontFamily: "inherit",
                  background: "transparent",
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  color: MUTED,
                  background: "#f1f3f4",
                  padding: "2px 5px",
                  borderRadius: 3,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                fuzzy
              </span>
            </div>
          </div>

          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#e24b4a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2.5,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff" }} />
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div
          style={{
            background: "#fff",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: `0.5px solid ${BORDER}`,
          }}
        >
          <span style={{ fontSize: 11, color: MUTED }}>Sort:</span>
          {SORT_OPTIONS.map((opt) => {
            const active = sort === opt;
            return (
              <button
                key={opt}
                onClick={() => setSort(opt)}
                style={{
                  height: 24,
                  padding: "0 12px",
                  borderRadius: 12,
                  fontSize: 11,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  background: active ? TEAL : "#fff",
                  color: active ? "#fff" : DARK,
                  border: `0.5px solid ${active ? TEAL : "#c8d2d4"}`,
                  fontWeight: active ? 600 : 500,
                }}
              >
                {opt}
              </button>
            );
          })}
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setFilterOpen((v) => !v)}
            style={{
              height: 24,
              padding: "0 12px",
              borderRadius: 12,
              fontSize: 11,
              fontFamily: "inherit",
              cursor: "pointer",
              background: "#fff",
              color: TEAL,
              border: `0.5px solid ${TEAL}`,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontWeight: 600,
            }}
          >
            <SlidersHorizontal size={11} />
            Filter
          </button>
        </div>

        {/* Filter row */}
        {filterOpen && (
          <div
            style={{
              background: "#fff",
              padding: "8px 20px",
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
              borderBottom: `0.5px solid ${BORDER}`,
            }}
          >
            <span style={{ fontSize: 11, color: MUTED }}>Filter by:</span>
            {FILTERS.map((f) => {
              const on = activeFilters.has(f.key);
              return (
                <button
                  key={f.key}
                  onClick={() => toggleFilter(f.key)}
                  style={{
                    height: 22,
                    padding: "0 10px",
                    borderRadius: 11,
                    fontSize: 11,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    background: on ? "#e1f5ee" : "#f9fafb",
                    color: on ? TEAL : DARK,
                    border: `0.5px solid ${on ? TEAL : "#c8d2d4"}`,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontWeight: on ? 600 : 500,
                  }}
                >
                  {f.icon}
                  {f.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Table */}
        <div
          style={{
            margin: "16px 20px",
            background: "#fff",
            border: "0.5px solid #dde2e4",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: GRID,
              gap: 8,
              padding: "7px 10px",
              background: "#f4f6f7",
              fontSize: 10,
              fontWeight: 600,
              color: MUTED,
              textTransform: "uppercase",
              letterSpacing: 0.3,
              borderBottom: `0.5px solid ${ROW_BORDER}`,
            }}
          >
            <span />
            <span>Patient</span>
            <span>Predicted risk</span>
            <span>TIR (14d)</span>
            <span>GMI</span>
            <span>Devices</span>
            <span>Last visit</span>
            <span>Next appt</span>
            <span />
          </div>

          <GroupHeader label="At risk" icon={<AlertCircle size={11} />} bg="#fff8f8" color="#a32d2d" />
          {groups.atRisk.map((p) => (
            <PatientRow key={p.id} p={p} open={openRows.has(p.id)} onToggle={() => toggleRow(p.id)} />
          ))}

          <GroupHeader label="Today's appointments" icon={<Calendar size={11} />} bg="#f4fbfa" color={TEAL} />
          {groups.today.map((p) => (
            <PatientRow key={p.id} p={p} open={openRows.has(p.id)} onToggle={() => toggleRow(p.id)} />
          ))}

          <GroupHeader label="All others" icon={<Users size={11} />} bg="#fafafa" color={MUTED} />
          {groups.others.map((p) => (
            <PatientRow key={p.id} p={p} open={openRows.has(p.id)} onToggle={() => toggleRow(p.id)} />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            background: "#fff",
            padding: "8px 20px",
            borderTop: `0.5px solid ${BORDER}`,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: MUTED,
          }}
        >
          <span>Showing 4 of 24 active patients · Sorted by: {sort.toLowerCase()}</span>
          <span>Active accounts only</span>
        </div>
      </div>
    </AdminShell>
  );
}
