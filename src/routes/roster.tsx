import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  Activity,
  Circle,
  CircleCheck,
} from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { MessageBubble } from "@/components/message-bubble";
import { usePlatformConfig } from "@/lib/platform-config";

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

type Risk = "DKA" | "A1c" | "Low TIR" | "GMI" | "DD";

const FLAG_KEY_MAP: Record<Risk, "dka" | "a1c" | "lowTIR" | "gmi" | "dd"> = {
  DKA: "dka",
  A1c: "a1c",
  "Low TIR": "lowTIR",
  GMI: "gmi",
  DD: "dd",
};

type AccordionData = {
  hospitalVisits: number;
  pendingForms: number;
  pendingTasks: number;
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
    accordion: { hospitalVisits: 1, pendingForms: 1, pendingTasks: 2 },
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
    accordion: { hospitalVisits: 0, pendingForms: 1, pendingTasks: 0 },
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
    accordion: { hospitalVisits: 0, pendingForms: 1, pendingTasks: 0 },
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
    accordion: { hospitalVisits: 0, pendingForms: 0, pendingTasks: 0 },
  },
  { id: "amara-osei", name: "Amara Osei", dob: "12 Mar 2012", age: 13, risks: ["DKA", "GMI"], tir: 44, gmi: 8.6, cgm: true, pump: false, lastVisit: "15 Jan 2026", lastVisitDaysAgo: 158, nextAppt: null, messages: true, group: "atRisk", accordion: { hospitalVisits: 2, pendingForms: 1, pendingTasks: 3 } },
  { id: "ben-hartley", name: "Ben Hartley", dob: "7 Nov 2015", age: 10, risks: [], tir: 78, gmi: 6.8, cgm: true, pump: true, lastVisit: "10 May 2026", lastVisitDaysAgo: 13, nextAppt: "15 Jul 2026", messages: false, group: "others", accordion: { hospitalVisits: 0, pendingForms: 0, pendingTasks: 1 } },
  { id: "chloe-martin", name: "Chloe Martin", dob: "22 Jun 2010", age: 15, risks: ["A1c", "Low TIR", "DD"], tir: 52, gmi: 8.1, cgm: true, pump: true, lastVisit: "3 Mar 2026", lastVisitDaysAgo: 81, nextAppt: "Today", nextApptSub: "Today · 11:00 AM", messages: true, group: "atRisk", accordion: { hospitalVisits: 1, pendingForms: 2, pendingTasks: 1 } },
  { id: "daniel-nguyen", name: "Daniel Nguyen", dob: "5 Sep 2013", age: 12, risks: [], tir: 71, gmi: 7.0, cgm: false, pump: false, lastVisit: "22 Apr 2026", lastVisitDaysAgo: 31, nextAppt: "30 Jun 2026", messages: false, group: "others", accordion: { hospitalVisits: 0, pendingForms: 1, pendingTasks: 0 } },
  { id: "elena-volkov", name: "Elena Volkov", dob: "18 Jan 2009", age: 17, risks: ["DKA", "GMI"], tir: 38, gmi: 9.1, cgm: true, pump: false, lastVisit: "5 Nov 2025", lastVisitDaysAgo: 199, nextAppt: "Today", nextApptSub: "Today · 3:30 PM", messages: true, group: "atRisk", accordion: { hospitalVisits: 3, pendingForms: 1, pendingTasks: 2 } },
  { id: "finn-obrien", name: "Finn O'Brien", dob: "30 Apr 2016", age: 9, risks: [], tir: 82, gmi: 6.5, cgm: true, pump: true, lastVisit: "18 May 2026", lastVisitDaysAgo: 5, nextAppt: "18 Aug 2026", messages: false, group: "others", accordion: { hospitalVisits: 0, pendingForms: 0, pendingTasks: 0 } },
  { id: "grace-kim", name: "Grace Kim", dob: "14 Aug 2011", age: 14, risks: ["Low TIR", "DD"], tir: 58, gmi: 7.8, cgm: true, pump: true, lastVisit: "2 Feb 2026", lastVisitDaysAgo: 141, nextAppt: "25 Jun 2026", messages: false, group: "atRisk", accordion: { hospitalVisits: 0, pendingForms: 1, pendingTasks: 1 } },
  { id: "henry-patel", name: "Henry Patel", dob: "9 Dec 2014", age: 11, risks: [], tir: 69, gmi: 7.4, cgm: true, pump: false, lastVisit: "14 Apr 2026", lastVisitDaysAgo: 39, nextAppt: "14 Jul 2026", messages: true, group: "others", accordion: { hospitalVisits: 0, pendingForms: 0, pendingTasks: 2 } },
  { id: "isla-santos", name: "Isla Santos", dob: "3 Feb 2018", age: 7, risks: [], tir: 74, gmi: 6.9, cgm: true, pump: true, lastVisit: "6 May 2026", lastVisitDaysAgo: 17, nextAppt: "Today", nextApptSub: "Today · 9:00 AM", messages: false, group: "today", accordion: { hospitalVisits: 0, pendingForms: 1, pendingTasks: 0 } },
  { id: "jake-morrison", name: "Jake Morrison", dob: "27 Jul 2008", age: 17, risks: ["A1c"], tir: 61, gmi: 7.9, cgm: false, pump: false, lastVisit: "20 Jan 2026", lastVisitDaysAgo: 153, nextAppt: "1 Jul 2026", messages: false, group: "atRisk", accordion: { hospitalVisits: 1, pendingForms: 0, pendingTasks: 1 } },
  { id: "kira-lefevre", name: "Kira Lefèvre", dob: "11 Oct 2015", age: 10, risks: [], tir: 76, gmi: 7.0, cgm: true, pump: true, lastVisit: "30 Apr 2026", lastVisitDaysAgo: 23, nextAppt: "30 Jul 2026", messages: false, group: "others", accordion: { hospitalVisits: 0, pendingForms: 0, pendingTasks: 0 } },
  { id: "liam-chen", name: "Liam Chen", dob: "16 May 2013", age: 12, risks: ["DKA", "A1c", "GMI"], tir: 35, gmi: 9.4, cgm: true, pump: true, lastVisit: "8 Dec 2025", lastVisitDaysAgo: 196, nextAppt: null, messages: true, group: "atRisk", accordion: { hospitalVisits: 2, pendingForms: 2, pendingTasks: 3 } },
  { id: "mia-johansson", name: "Mia Johansson", dob: "25 Jun 2017", age: 8, risks: [], tir: 80, gmi: 6.6, cgm: true, pump: false, lastVisit: "12 May 2026", lastVisitDaysAgo: 11, nextAppt: "12 Aug 2026", messages: false, group: "others", accordion: { hospitalVisits: 0, pendingForms: 1, pendingTasks: 0 } },
  { id: "noah-ibrahim", name: "Noah Ibrahim", dob: "8 Mar 2020", age: 5, risks: [], tir: 73, gmi: 7.1, cgm: true, pump: true, lastVisit: "25 Apr 2026", lastVisitDaysAgo: 28, nextAppt: "Today", nextApptSub: "Today · 1:00 PM", messages: false, group: "today", accordion: { hospitalVisits: 0, pendingForms: 0, pendingTasks: 1 } },
  { id: "olivia-tremblay", name: "Olivia Tremblay", dob: "19 Nov 2012", age: 13, risks: ["Low TIR", "DD"], tir: 55, gmi: 8.0, cgm: true, pump: false, lastVisit: "18 Feb 2026", lastVisitDaysAgo: 124, nextAppt: "2 Jul 2026", messages: true, group: "atRisk", accordion: { hospitalVisits: 0, pendingForms: 1, pendingTasks: 2 } },
];

function deriveGroup(p: Patient): "atRisk" | "today" | "others" {
  if (p.risks.length > 0) return "atRisk";
  if (p.nextAppt === "Today") return "today";
  return "others";
}

function lastName(name: string): string {
  const parts = name.trim().split(" ");
  return parts[parts.length - 1] || name;
}

const SORT_OPTIONS = ["At risk first", "Longest unseen", "A – Z"];

type FilterKey = "risk" | "tir" | "gmi" | "cgm" | "pump" | "messages";
const FILTERS: { key: FilterKey; label: string; icon: ReactNode }[] = [
  { key: "risk", label: "Flags", icon: <AlertTriangle size={10} /> },
  { key: "tir", label: "High TIR", icon: null },
  { key: "gmi", label: "High GMI", icon: null },
  { key: "cgm", label: "Using CGM", icon: <Watch size={10} /> },
  { key: "pump", label: "Using pump", icon: <Droplet size={10} /> },
  { key: "messages", label: "Pending messages", icon: <MessageBubble hasMessages={true} size={12} /> },
];


function RiskPills({ risks }: { risks: Risk[] }) {
  const { config } = usePlatformConfig();
  const visibleRisks = risks.filter(
    (r) => config.flags[FLAG_KEY_MAP[r]]?.clinician !== false,
  );
  if (visibleRisks.length === 0) return <span style={{ color: MUTED }}>—</span>;
  const styles: Record<Risk, { bg: string; color: string }> = {
    DKA: { bg: "#fcebeb", color: "#791f1f" },
    A1c: { bg: "#faeeda", color: "#633806" },
    "Low TIR": { bg: "#fff3e0", color: "#854f0b" },
    GMI: { bg: "#e8f5e9", color: "#1b5e20" },
    DD: { bg: "#f3e5f5", color: "#4a148c" },
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
      {visibleRisks.map((r) => (
        <span
          key={r}
          style={{
            fontSize: 14,
            fontWeight: 600,
            padding: "3px 8px",
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
        fontSize: 14,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 4,
        background: on ? "#e1f5ee" : "#f1efe8",
        color: on ? "#085041" : "#888780",
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {label}
      {on ? <CircleCheck size={10} style={{ marginLeft: 4 }} /> : <Circle size={10} style={{ marginLeft: 4 }} />}
    </span>
  );
}

const GRID = "34px minmax(200px, 1.5fr) repeat(6, 1fr) 112px";

function GroupHeader({ label, icon, bg, color }: { label: string; icon: ReactNode; bg: string; color: string }) {
  return (
    <div
      style={{
        background: bg,
        color,
        padding: "5px 12px",
        fontSize: 12,
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
  const navigate = useNavigate();
  const tirRed = p.tir < 70;
  const lastVisitRed = (p.lastVisitDaysAgo ?? 0) > 90;
  const avatarColors: Record<string, { bg: string; color: string }> = {
    "sarah-chen":     { bg: "#e1f5ee", color: "#085041" },
    "marcus-thompson":{ bg: "#e6f1fb", color: "#0c447c" },
    "lily-park":      { bg: "#faeeda", color: "#633806" },
    "james-wilson":   { bg: "#f1efe8", color: "#444441" },
  };
  const av = avatarColors[p.id] ?? { bg: "#e8ecee", color: "#445558" };
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: GRID,
          alignItems: "center",
          padding: "8px 10px",
          borderBottom: `0.5px solid ${ROW_BORDER}`,
          background: open ? "#f4fbfa" : "#fff",
          gap: 8,
          fontFamily: "inherit",
          color: DARK,
        }}
      >
        <MessageBubble hasMessages={p.messages} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
            background: av.bg, border: `1.5px solid #c8e8df`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 600, color: av.color, overflow: "hidden",
          }}>
            {p.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}>
              <span>{p.dob}</span>
              <span style={{ color: MUTED, opacity: 0.4 }}>|</span>
              <span>Age {p.age}</span>
            </div>
          </div>
        </div>
        <RiskPills risks={p.risks} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: tirRed ? DANGER : SUCCESS }}>
            {p.tir}%
          </div>
          <div style={{ fontSize: 12, color: MUTED }}>{tirRed ? "Low" : "In range"}</div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{p.gmi}%</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
          <DevicePill label="CGM" on={p.cgm} />
          <DevicePill label="Pump" on={p.pump} />
        </div>
        <div
          style={{
            fontSize: 14,
            color: lastVisitRed ? DANGER : DARK,
            fontWeight: lastVisitRed ? 700 : 400,
          }}
        >
          {p.lastVisit}
        </div>
        <div>
          {p.risks.length > 0 && p.nextAppt === "Today" ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 14, color: TEAL, fontWeight: 700 }}>
              <Calendar size={12} color={TEAL} />
              Today
            </div>
          ) : p.nextAppt ? (
            <>
              <div style={{ fontSize: 14, color: TEAL, fontWeight: 600 }}>{p.nextAppt}</div>
              {p.nextApptSub && <div style={{ fontSize: 12, color: MUTED }}>{p.nextApptSub}</div>}
            </>
          ) : (
            <span style={{ fontSize: 14, color: MUTED }}>No appt</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: '/dashboard/$patientId', params: { patientId: p.id } });
            }}
            style={{
              padding: "4px 10px",
              background: TEAL,
              color: "#fff",
              border: "none",
              borderRadius: 5,
              fontSize: 15,
              fontFamily: "inherit",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Dashboard
          </button>
          <button
            type="button"
            aria-label={open ? "Collapse patient row" : "Expand patient row"}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            style={{
              border: "none",
              background: "transparent",
              padding: 2,
              margin: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <ChevronDown
              size={14}
              color={TEAL}
              style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
            />
          </button>
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
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                marginBottom: 4,
              }}
            >
              {s.icon}
              {s.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color }}>{s.value}</div>
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

  const groups = useMemo(() => {
    const filtered = activeFilters.has("messages")
      ? PATIENTS.filter((p) => p.messages === true)
      : PATIENTS;
    const sortFn = (a: Patient, b: Patient) => {
      if (sort === "A – Z") {
        return lastName(a.name).localeCompare(lastName(b.name));
      }
      if (sort === "Longest unseen") {
        return (b.lastVisitDaysAgo ?? 0) - (a.lastVisitDaysAgo ?? 0);
      }
      return 0;
    };
    const sorted = [...filtered].sort(sortFn);
    return {
      atRisk: sorted.filter((p) => deriveGroup(p) === "atRisk"),
      today: sorted.filter((p) => deriveGroup(p) === "today"),
      others: sorted.filter((p) => deriveGroup(p) === "others"),
    };
  }, [activeFilters, sort]);

  const selectStyle: CSSProperties = {
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    background: `transparent url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' stroke='%2300565B' stroke-width='1.5' fill='none'/></svg>") no-repeat right center`,
    border: "none",
    color: TEAL,
    fontSize: 16,
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
            <span style={{ fontSize: 12, color: MUTED }}>{orgLine}</span>
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
                  fontSize: 14,
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
          <span style={{ fontSize: 14, color: MUTED }}>Sort:</span>
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
                  fontSize: 15,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  background: active ? TEAL : "#f4f6f7",
                  color: active ? "#fff" : DARK,
                  border: "none",
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
              fontSize: 15,
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
            <span style={{ fontSize: 14, color: MUTED }}>Filter by:</span>
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
                    fontSize: 15,
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
              fontSize: 12,
              fontWeight: 600,
              color: MUTED,
              textTransform: "uppercase",
              letterSpacing: 0.3,
              borderBottom: `0.5px solid ${ROW_BORDER}`,
            }}
          >
            <span />
            <span>Patient</span>
            <span>Flags</span>
            <span>TIR (14d)</span>
            <span>GMI</span>
            <span>Devices</span>
            <span>Last appointment</span>
            <span>Next appt</span>
            <span />
          </div>

          {groups.atRisk.length > 0 && (
            <>
              <GroupHeader label="At risk" icon={<AlertCircle size={11} />} bg="#fff8f8" color="#a32d2d" />
              {groups.atRisk.map((p) => (
                <PatientRow key={p.id} p={p} open={openRows.has(p.id)} onToggle={() => toggleRow(p.id)} />
              ))}
            </>
          )}

          {groups.today.length > 0 && (
            <>
              <GroupHeader label="Today's appointments" icon={<Calendar size={11} />} bg="#f4fbfa" color={TEAL} />
              {groups.today.map((p) => (
                <PatientRow key={p.id} p={p} open={openRows.has(p.id)} onToggle={() => toggleRow(p.id)} />
              ))}
            </>
          )}

          {groups.others.length > 0 && (
            <>
              <GroupHeader label="All others" icon={<Users size={11} />} bg="#fafafa" color={MUTED} />
              {groups.others.map((p) => (
                <PatientRow key={p.id} p={p} open={openRows.has(p.id)} onToggle={() => toggleRow(p.id)} />
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            background: "#fff",
            padding: "8px 20px",
            borderTop: `0.5px solid ${BORDER}`,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
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
