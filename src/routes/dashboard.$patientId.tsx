import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import {
  TEAL,
  SURFACE,
  WF_BG,
  WF_DARK,
  WF_MID,
  BORDER,
  SUCCESS_TEXT,
  SUCCESS_BG,
  WARN_TEXT,
  WARN_BG,
  ERROR_TEXT,
} from "@/components/wireframe";

export const Route = createFileRoute("/dashboard/$patientId")({
  component: DashboardPage,
});

const CARD: React.CSSProperties = {
  background: SURFACE,
  border: `0.5px solid ${BORDER}`,
  borderRadius: 8,
  marginBottom: 16,
};

const CARD_HEADER: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderBottom: `0.5px solid ${BORDER}`,
  fontSize: 20,
  fontWeight: 600,
  color: WF_DARK,
};

function Badge({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 10,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function PatientHeader() {
  return (
    <div
      style={{
        background: "#D7EEFA",
        borderBottom: `0.5px solid ${BORDER}`,
        padding: "14px 24px",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: "#e1f5ee", border: "2px solid #c8e8df",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: "#085041",
        }}>
          SC
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: WF_DARK }}>Sarah Chen</div>
        <span style={{ color: "#aac4cc", fontSize: 18, fontWeight: 300 }}>|</span>
        <div style={{ fontSize: 15, color: WF_MID }}>15 Jun 1978 · Age 47</div>
        <span style={{ color: "#aac4cc", fontSize: 18, fontWeight: 300 }}>|</span>
        <span
          title="Type 1 Diabetes, diagnosed 12 years ago"
          style={{
            fontSize: 15,
            color: WF_DARK,
            cursor: "help",
            borderBottom: `1px dotted ${WF_MID}`,
          }}
        >
          T1D · 12 years
        </span>
        <span style={{ color: "#aac4cc", fontSize: 18, fontWeight: 300 }}>|</span>
        <div style={{ fontSize: 15, color: WF_DARK }}>👤 Margaret Chen — Mother</div>
        <span style={{ color: "#aac4cc", fontSize: 18, fontWeight: 300 }}>|</span>
        <div style={{ fontSize: 15, color: WF_DARK }}>⚕ Dr. Reyes</div>
        <span style={{ color: "#aac4cc", fontSize: 18, fontWeight: 300 }}>|</span>
        <div style={{ fontSize: 15, color: WF_MID }}>Last seen: 2 days ago</div>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        <Badge bg={SUCCESS_BG} color={SUCCESS_TEXT}>Active</Badge>
        <Badge bg={SUCCESS_BG} color={SUCCESS_TEXT}>CGM connected</Badge>
        <Badge bg={SUCCESS_BG} color={SUCCESS_TEXT}>Pump connected</Badge>
        <Badge bg="#fcebeb" color="#791f1f">DKA risk</Badge>
        <Badge bg={WARN_BG} color={WARN_TEXT}>Low TIR</Badge>
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? TEAL : "#fff",
        color: active ? "#fff" : WF_DARK,
        border: active ? "none" : `0.5px solid ${BORDER}`,
        height: 22,
        padding: "0 8px",
        borderRadius: 11,
        fontSize: 11,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        borderBottom: active ? `2px solid ${TEAL}` : "2px solid transparent",
        padding: "8px 12px",
        fontSize: 15,
        cursor: "pointer",
        color: active ? WF_DARK : WF_MID,
        fontFamily: "inherit",
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}

function GlucoseModule() {
  const [range, setRange] = useState("14d");
  const [tab, setTab] = useState<"AGP" | "Stats" | "Daily">("AGP");
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>
        <span>Glucose</span>
        <div style={{ display: "flex", gap: 4 }}>
          {["7d", "14d", "30d", "90d"].map((r) => (
            <Pill key={r} active={range === r} onClick={() => setRange(r)}>{r}</Pill>
          ))}
        </div>
      </div>
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "0 16px", display: "flex" }}>
        <TabButton active={tab === "AGP"} onClick={() => setTab("AGP")}>AGP</TabButton>
        <TabButton active={tab === "Stats"} onClick={() => setTab("Stats")}>Statistics & Targets</TabButton>
        <TabButton active={tab === "Daily"} onClick={() => setTab("Daily")}>Daily Profiles</TabButton>
      </div>
      {tab === "AGP" && <AGPTab />}
      {tab === "Stats" && <StatsTab />}
      {tab === "Daily" && <DailyTab />}
    </div>
  );
}

function AGPTab() {
  const tir = [
    { label: "Very Low", pct: 8, color: "#7b1a1a" },
    { label: "Low", pct: 4, color: "#c0392b" },
    { label: "Target", pct: 49, color: "#27500a" },
    { label: "High", pct: 20, color: "#b45309" },
    { label: "Very High", pct: 19, color: "#f97316" },
  ];
  return (
    <div style={{ padding: 16 }}>
      <svg width="100%" height={260} viewBox="0 0 700 260">
        <rect width="700" height="260" fill="#fafafa" />
        <line x1="0" y1="230" x2="700" y2="230" stroke="#7b1a1a" strokeDasharray="4 4" strokeWidth="1" />
        <line x1="0" y1="195" x2="700" y2="195" stroke="#c0392b" strokeDasharray="4 4" strokeWidth="1" />
        <line x1="0" y1="130" x2="700" y2="130" stroke="#27500a" strokeWidth="1" />
        <line x1="0" y1="65" x2="700" y2="65" stroke="#27500a" strokeWidth="1" />
        <line x1="0" y1="30" x2="700" y2="30" stroke="#b45309" strokeDasharray="4 4" strokeWidth="1" />
        <path
          d="M 0 170 Q 100 200 175 210 T 350 140 T 525 30 T 700 150 L 700 250 L 0 250 Z"
          fill="#93c5fd"
          opacity="0.35"
        />
        <path
          d="M 0 160 Q 100 190 175 195 T 350 130 T 525 45 T 700 140 L 700 230 Q 525 160 350 200 T 0 220 Z"
          fill="#bfdbfe"
          opacity="0.45"
        />
        <path
          d="M 0 150 Q 100 175 175 180 T 350 125 T 525 55 T 700 130 L 700 200 Q 525 130 350 180 T 0 200 Z"
          fill="#dbeafe"
          opacity="0.55"
        />
        <path
          d="M 0 145 Q 100 165 175 175 T 350 110 T 525 55 T 700 120"
          stroke="#000"
          strokeWidth="2"
          fill="none"
        />
        {["350", "250", "180", "70", "54", "0"].map((l, i) => (
          <text key={l} x="4" y={20 + i * 45} fontSize="10" fill={WF_MID}>{l}</text>
        ))}
        {["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm", "12am"].map((l, i) => (
          <text key={l} x={i * 87.5} y="258" fontSize="10" fill={WF_MID}>{l}</text>
        ))}
        {["95%", "75%", "50%", "25%", "5%"].map((l, i) => (
          <text key={l} x="678" y={30 + i * 55} fontSize="10" fill={WF_MID}>{l}</text>
        ))}
      </svg>
      <div style={{ display: "flex", height: 20, marginTop: 16, borderRadius: 4, overflow: "hidden" }}>
        {tir.map((s) => (
          <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} />
        ))}
      </div>
      <div style={{ display: "flex", marginTop: 4 }}>
        {tir.map((s) => (
          <div key={s.label} style={{ width: `${s.pct}%`, fontSize: 10, color: WF_MID, textAlign: "center" }}>
            {s.label} {s.pct}%
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsTab() {
  const rows = [
    ["Target 70–180 mg/dL", ">70%", "49%"],
    ["Below 70 mg/dL", "<4%", "12%"],
    ["Below 54 mg/dL", "<1%", "8%"],
    ["Above 180 mg/dL", "<25%", "39%"],
    ["Above 250 mg/dL", "<5%", "19%"],
  ];
  const segs = [
    { label: "Very High", pct: 19, h: 38, color: "#f97316", time: "4h 34m" },
    { label: "High", pct: 20, h: 40, color: "#b45309", time: "4h 48m" },
    { label: "Target", pct: 49, h: 98, color: "#27500a", time: "11h 46m" },
    { label: "Low", pct: 4, h: 8, color: "#c0392b", time: "58m" },
    { label: "Very Low", pct: 8, h: 16, color: "#7b1a1a", time: "1h 55m" },
  ];
  return (
    <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 220px", gap: 24 }}>
      <div style={{ fontSize: 15, color: WF_DARK }}>
        <div style={{ color: WF_MID }}>21 Jul 2025 – 3 Aug 2025 (14 days)</div>
        <div style={{ marginTop: 4 }}>% CGM Active: 99.3%</div>
        <div style={{ borderTop: `0.5px solid ${BORDER}`, margin: "10px 0" }} />
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "4px 0", color: WF_MID, fontWeight: 500 }}>Range</th>
              <th style={{ textAlign: "left", padding: "4px 0", color: WF_MID, fontWeight: 500 }}>Target</th>
              <th style={{ textAlign: "left", padding: "4px 0", color: WF_MID, fontWeight: 500 }}>Actual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([r, t, a]) => (
              <tr key={r}>
                <td style={{ padding: "4px 0" }}>{r}</td>
                <td style={{ padding: "4px 0" }}>{t}</td>
                <td style={{ padding: "4px 0", fontWeight: 600 }}>{a}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ borderTop: `0.5px solid ${BORDER}`, margin: "10px 0" }} />
        <div>Average Glucose: 144 mg/dL</div>
        <div>GMI: 6.8%</div>
        <div>Glucose Variability: 33.8%</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <svg width="50" height="200">
          {(() => {
            let y = 0;
            return segs.map((s) => {
              const r = <rect key={s.label} x="10" y={y} width="30" height={s.h} fill={s.color} />;
              y += s.h;
              return r;
            });
          })()}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 11, color: WF_MID }}>
          {segs.map((s) => (
            <div key={s.label} style={{ height: s.h, display: "flex", alignItems: "center" }}>
              {s.label} {s.pct}% ({s.time})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DailyTab() {
  const days = [
    ["Sun", "21"], ["Mon", "22"], ["Tue", "23"], ["Wed", "24"], ["Thu", "25"], ["Fri", "26"], ["Sat", "27"],
    ["Sun", "28"], ["Mon", "29"], ["Tue", "30"], ["Wed", "31"], ["Thu", "1"], ["Fri", "2"], ["Sat", "3"],
  ];
  function genPoints(seed: number) {
    const pts: string[] = [];
    for (let i = 0; i < 8; i++) {
      const x = (i / 7) * 80;
      const y = 5 + ((seed * (i + 1) * 7) % 35);
      pts.push(`${x},${y}`);
    }
    return pts.join(" ");
  }
  return (
    <div style={{ padding: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
      {days.map(([d, n], i) => {
        const pts = genPoints(i + 3);
        const hasSpike = pts.split(" ").some((p) => {
          const y = parseFloat(p.split(",")[1]);
          return y < 8;
        });
        const spikePt = pts.split(" ").find((p) => parseFloat(p.split(",")[1]) < 8);
        return (
          <div
            key={i}
            style={{
              width: "calc(100% / 7 - 6px)",
              border: `0.5px solid ${BORDER}`,
              borderRadius: 4,
              padding: 4,
            }}
          >
            <div style={{ fontSize: 9, color: WF_MID }}>{d}</div>
            <div style={{ fontSize: 10, color: WF_DARK, fontWeight: 600 }}>{n}</div>
            <svg width="80" height="44">
              <rect x="0" y="14" width="80" height="16" fill="#dcfce7" opacity="0.5" />
              <polyline points={pts} fill="none" stroke={TEAL} strokeWidth="1" />
              {hasSpike && spikePt && (
                <circle cx={spikePt.split(",")[0]} cy={spikePt.split(",")[1]} r="2" fill="#c0392b" />
              )}
              <text x="0" y="42" fontSize="8" fill={WF_MID}>12a</text>
              <text x="60" y="42" fontSize="8" fill={WF_MID}>12p</text>
            </svg>
          </div>
        );
      })}
    </div>
  );
}

function InsulinModule() {
  const [tab, setTab] = useState<"Pump" | "MDI">("Pump");
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>Insulin</div>
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "0 16px", display: "flex" }}>
        <TabButton active={tab === "Pump"} onClick={() => setTab("Pump")}>Pump</TabButton>
        <TabButton active={tab === "MDI"} onClick={() => setTab("MDI")}>MDI</TabButton>
      </div>
      {tab === "Pump" ? <PumpTab /> : <MDITab />}
    </div>
  );
}

function PumpTab() {
  const [range, setRange] = useState("7d");
  const basalRows = [
    ["00:00", "0.8"], ["04:00", "0.2"], ["09:00", "0.95"], ["11:00", "1.2"],
    ["16:30", "1.3"], ["19:00", "1.2"], ["23:00", "1.25"],
  ];
  const icr = [["00:00", "15"], ["06:00", "5.5"], ["09:00", "8"], ["12:00", "11"], ["17:00", "15"]];
  const isf = [["00:00", "4.4"], ["11:00", "2.2"], ["15:00", "1.4"]];
  const target = [["00:00", "5.6"], ["14:00", "7.2"]];
  // Donut: basal 59%, bolus 41% — circumference 2*pi*50 ≈ 314.16
  const C = 2 * Math.PI * 50;
  const basalLen = C * 0.59;
  const bolusLen = C * 0.41;
  return (
    <>
      <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: WF_DARK, marginBottom: 6 }}>Historical trend</div>
          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            {["7d", "14d", "30d", "90d"].map((r) => (
              <Pill key={r} active={range === r} onClick={() => setRange(r)}>{r}</Pill>
            ))}
          </div>
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r="50" fill="none" stroke="#95d7e5" strokeWidth="22"
              strokeDasharray={`${basalLen} ${C}`} transform="rotate(-90 65 65)" />
            <circle cx="65" cy="65" r="50" fill="none" stroke={TEAL} strokeWidth="22"
              strokeDasharray={`${bolusLen} ${C}`} strokeDashoffset={-basalLen} transform="rotate(-90 65 65)" />
          </svg>
          <div style={{ fontSize: 15, color: WF_DARK, marginTop: 6 }}>
            <span style={{ color: "#95d7e5" }}>●</span> Basal/day — 59% · 12.6 units
          </div>
          <div style={{ fontSize: 15, color: WF_DARK }}>
            <span style={{ color: TEAL }}>●</span> Bolus/day — 41% · 9.6 units
          </div>
          <div style={{ borderTop: `0.5px solid ${BORDER}`, marginTop: 8, paddingTop: 8, fontSize: 15, fontWeight: 600, color: WF_DARK }}>
            Average total daily dose: 22.2 units
          </div>
        </div>
        <div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: WF_MID, marginBottom: 4 }}>Pump type</div>
            <select defaultValue="Medtronic" style={{
              border: `0.5px solid ${BORDER}`, borderRadius: 4, padding: "4px 8px",
              fontSize: 13, width: "100%", fontFamily: "inherit",
            }}>
              <option>Medtronic</option>
              <option>Tandem</option>
              <option>Omnipod</option>
              <option>Ypsomed</option>
            </select>
          </div>
          <div style={{ background: "#f4fbfa", padding: 8, borderRadius: 6, marginBottom: 10 }}>
            <div style={{ fontSize: 15, color: WF_MID }}>Active insulin time</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: WF_DARK }}>1.5 hrs</div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: WF_DARK, marginBottom: 6 }}>Basal rates</div>
          <select
            defaultValue="basal 3 (active)"
            style={{
              border: `0.5px solid ${BORDER}`,
              borderRadius: 4,
              padding: "4px 8px",
              fontSize: 15,
              width: "100%",
              marginBottom: 8,
              fontFamily: "inherit",
            }}
          >
            <option>basal 1</option>
            <option>basal 2</option>
            <option>basal 3 (active)</option>
          </select>
          <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", color: WF_MID, fontWeight: 500, padding: "2px 0" }}>Start</th>
                <th style={{ textAlign: "left", color: WF_MID, fontWeight: 500, padding: "2px 0" }}>Basal rate (U/hr)</th>
              </tr>
            </thead>
            <tbody>
              {basalRows.map(([s, v]) => (
                <tr key={s}>
                  <td style={{ color: WF_DARK, padding: "2px 0" }}>{s}</td>
                  <td style={{ color: WF_DARK, padding: "2px 0" }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "0 16px 16px" }}>
        {[
          { title: "I:C ratio settings", h1: "Start", h2: "ICR (g/U)", rows: icr },
          { title: "ISF settings", h1: "Insulin action", h2: "ISF (mmol/L/U)", rows: isf },
          { title: "Target blood glucose", h1: "Start", h2: "Target (mmol/L/U)", rows: target },
        ].map((box) => (
          <div key={box.title} style={{ flex: 1, border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: WF_DARK, marginBottom: 6 }}>{box.title}</div>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", color: WF_MID, fontWeight: 500 }}>{box.h1}</th>
                  <th style={{ textAlign: "left", color: WF_MID, fontWeight: 500 }}>{box.h2}</th>
                </tr>
              </thead>
              <tbody>
                {box.rows.map(([a, b]) => (
                  <tr key={a}>
                    <td style={{ color: WF_DARK, padding: "2px 0" }}>{a}</td>
                    <td style={{ color: WF_DARK, padding: "2px 0" }}>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 16px", borderTop: `0.5px solid ${BORDER}`, fontSize: 11, color: WF_MID }}>
        Last uploaded: 6 Sep 2022 · 9:00 AM PST
      </div>
    </>
  );
}

function MDITab() {
  const rows = ["Breakfast", "Lunch", "Snack", "Dinner", "Bedtime"];
  return (
    <>
      <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: WF_MID, textTransform: "uppercase", marginBottom: 8 }}>
            Insulin
          </div>
          <div style={{ fontSize: 15, color: WF_DARK }}>Long — Basaglar</div>
          <div style={{ fontSize: 15, color: WF_DARK }}>Rapid — (none)</div>
        </div>
        <div>
          <table style={{ width: "100%", fontSize: 15, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Dose", "Long", "ICR", "ISF", "BG target"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "4px 0", fontWeight: 600, color: WF_DARK }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r}>
                  <td style={{ padding: "4px 0", color: WF_DARK }}>{r}</td>
                  {[0, 1, 2, 3].map((i) => (
                    <td key={i} style={{ padding: "4px 0", color: WF_MID }}>–</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between", fontSize: 11, color: WF_MID,
        padding: "8px 16px", borderTop: `0.5px solid ${BORDER}`,
      }}>
        <span>Last updated by Dr. Reyes · 6 Mar 2025</span>
        <span>
          <span style={{ color: TEAL, textDecoration: "underline", cursor: "pointer", marginRight: 10 }}>Bolus calculator</span>
          <span style={{ color: TEAL, textDecoration: "underline", cursor: "pointer" }}>Edit</span>
        </span>
      </div>
    </>
  );
}

type LabRow = { id: string; name: string; last: string; next: string; overdue: boolean; recommended: string };

function LabsModule() {
  const [labs, setLabs] = useState<LabRow[]>([
    { id: "a1c", name: "A1c", last: "2026-01-01", next: "2026-04-01", overdue: false, recommended: "Every 3 months" },
    { id: "lipid", name: "Lipid panel", last: "2025-01-14", next: "2025-07-14", overdue: false, recommended: "Every 3 years" },
    { id: "renal", name: "Renal function", last: "2025-01-14", next: "2025-07-14", overdue: false, recommended: "Yearly" },
    { id: "thyroid", name: "Thyroid panel", last: "2024-03-03", next: "2025-03-03", overdue: true, recommended: "Every 2 years" },
    { id: "retino", name: "Retinopathy", last: "2023-11-22", next: "2024-11-22", overdue: true, recommended: "Yearly" },
    { id: "neuro", name: "Neuropathy", last: "2023-11-22", next: "2024-11-22", overdue: true, recommended: "Yearly" },
  ]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editLast, setEditLast] = useState("");
  const [editNext, setEditNext] = useState("");

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>Labs & test results</div>
      <div style={{ padding: 16 }}>
        {labs.map((l) => (
          <div key={l.id}>
            <div style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: `0.5px solid #f0f2f3` }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: WF_DARK, flex: 1 }}>{l.name}</div>
              <div style={{ marginRight: 16 }}>
                <div style={{ fontSize: 10, color: WF_MID }}>Last completed</div>
                <div style={{ fontSize: 15, color: WF_DARK }}>{fmt(l.last)}</div>
              </div>
              <div style={{ marginRight: 16 }}>
                <div style={{ fontSize: 10, color: WF_MID }}>Next due</div>
                <div style={{
                  fontSize: 15,
                  color: l.overdue ? ERROR_TEXT : WF_DARK,
                  fontWeight: l.overdue ? 600 : 400,
                }}>{fmt(l.next)}</div>
              </div>
              <div style={{ marginRight: 16 }}>
                <div style={{ fontSize: 10, color: WF_MID }}>Recommended</div>
                <div style={{ fontSize: 13, color: WF_DARK }}>{l.recommended}</div>
              </div>
              <span
                onClick={() => {
                  setEditId(l.id);
                  setEditLast(l.last);
                  setEditNext(l.next);
                }}
                style={{ fontSize: 15, color: TEAL, textDecoration: "underline", cursor: "pointer", marginLeft: 12 }}
              >
                Update
              </span>
            </div>
            {editId === l.id && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", padding: "8px 0", borderBottom: `0.5px solid #f0f2f3` }}>
                <label style={{ fontSize: 11, color: WF_MID }}>
                  Last completed
                  <input type="date" value={editLast} onChange={(e) => setEditLast(e.target.value)}
                    style={{ display: "block", border: `0.5px solid ${BORDER}`, borderRadius: 4, padding: "4px", fontSize: 12 }} />
                </label>
                <label style={{ fontSize: 11, color: WF_MID }}>
                  Next due
                  <input type="date" value={editNext} onChange={(e) => setEditNext(e.target.value)}
                    style={{ display: "block", border: `0.5px solid ${BORDER}`, borderRadius: 4, padding: "4px", fontSize: 12 }} />
                </label>
                <button
                  onClick={() => {
                    const today = new Date().toISOString().slice(0, 10);
                    setLabs((cur) => cur.map((x) => x.id === l.id ? { ...x, last: editLast, next: editNext, overdue: editNext < today } : x));
                    setEditId(null);
                  }}
                  style={{ background: TEAL, color: "#fff", border: "none", borderRadius: 4, fontSize: 16, padding: "5px 10px", cursor: "pointer" }}
                >
                  Save
                </button>
                <span onClick={() => setEditId(null)} style={{ fontSize: 15, color: WF_MID, cursor: "pointer" }}>Cancel</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompletedFormsModule() {
  const rows = [
    ["Pre-appointment questionnaire", "28 Apr 2026", "—"],
    ["Hypoglycaemia awareness", "12 Mar 2026", "Score: 14/20"],
    ["Quality of life (PedsQL)", "1 Feb 2026", "Score: 72/100"],
  ];
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>
        <span>Completed forms</span>
        <span style={{ fontSize: 15, color: TEAL, textDecoration: "underline", cursor: "pointer" }}>View all</span>
      </div>
      <div style={{ padding: 16 }}>
        <table style={{ width: "100%", fontSize: 15, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Form name", "Submitted", "Score/result", "Action"].map((h) => (
                <th key={h} style={{ textAlign: "left", fontSize: 11, textTransform: "uppercase", color: WF_MID, fontWeight: 500, padding: "4px 0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([n, s, sc]) => (
              <tr key={n}>
                <td style={{ padding: "6px 0", color: WF_DARK }}>{n}</td>
                <td style={{ padding: "6px 0", color: WF_DARK }}>{s}</td>
                <td style={{ padding: "6px 0", color: WF_DARK }}>{sc}</td>
                <td style={{ padding: "6px 0" }}>
                  <span style={{ color: TEAL, textDecoration: "underline", cursor: "pointer" }}>View</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: WF_MID, marginTop: 8 }}>Showing 3 of 7 completed forms</div>
      </div>
    </div>
  );
}

function AppointmentsModule() {
  const past = [
    ["12 Mar 2026", "In-person", "Dr. Reyes", "Annual review"],
    ["4 Dec 2025", "Virtual", "Dr. Reyes", "Insulin adjustment"],
    ["18 Sep 2025", "In-person", "Dr. Reyes", "Quarterly check-in"],
    ["2 Jun 2025", "In-person", "Dr. Reyes", "—"],
  ];
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>Appointments</div>
      <div style={{ padding: 16 }}>
        <div style={{
          background: "#f4fbfa", border: "0.5px solid #d8eeeb", borderRadius: 6, padding: 10, marginBottom: 14,
        }}>
          <div style={{ fontSize: 10, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
            Next appointment
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: TEAL }}>12 May 2026 · 10:30 AM</div>
          <div style={{ fontSize: 15, color: WF_MID }}>In-person — BC Children's Hospital</div>
        </div>
        <div style={{ fontSize: 10, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
          Past appointments
        </div>
        <table style={{ width: "100%", fontSize: 15, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Date", "Type", "Clinician", "Notes"].map((h) => (
                <th key={h} style={{ textAlign: "left", fontSize: 11, textTransform: "uppercase", color: WF_MID, fontWeight: 500, padding: "4px 0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {past.map((r) => (
              <tr key={r[0]}>
                {r.map((c, i) => (
                  <td key={i} style={{ padding: "6px 0", color: WF_DARK }}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecommendationsModule() {
  const [text, setText] = useState("");
  const [list, setList] = useState([
    { text: "Reviewed basal rate — consider reducing overnight dose by 10%. Monitor for 2 weeks.", meta: "Dr. Reyes · 28 Apr 2026" },
    { text: "Recommended referral to dietitian for carb-counting refresher.", meta: "Dr. Reyes · 12 Mar 2026" },
  ]);
  const [showPop, setShowPop] = useState(false);
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>Recommendations</div>
      <div style={{ padding: 16 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a recommendation…"
          style={{
            width: "100%", height: 72, border: `0.5px solid ${BORDER}`, borderRadius: 6,
            fontSize: 15, padding: 8, fontFamily: "inherit", resize: "none", boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 8, position: "relative" }}>
          <button
            onClick={() => setShowPop((v) => !v)}
            style={{
              border: `0.5px solid ${TEAL}`, background: SURFACE, color: TEAL,
              borderRadius: 5, fontSize: 16, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Add resource
          </button>
          {showPop && (
            <div style={{
              position: "absolute", top: 30, left: 0, background: "#fff",
              border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: 6, zIndex: 10, minWidth: 140,
            }}>
              {["From library", "New resource"].map((o) => (
                <div key={o} style={{ padding: "6px 10px", fontSize: 15, cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f4fbfa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  {o}
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => {
              if (text.trim()) {
                setList((cur) => [{ text: text.trim(), meta: "Dr. Reyes · Today" }, ...cur]);
                setText("");
              }
            }}
            style={{
              background: TEAL, color: "#fff", border: "none", borderRadius: 5,
              fontSize: 16, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Save
          </button>
        </div>
        {list.map((r, i) => (
          <div key={i} style={{ border: "0.5px solid #e8ecee", borderRadius: 6, padding: 10, marginTop: 8 }}>
            <div style={{ fontSize: 15, color: WF_DARK }}>{r.text}</div>
            <div style={{ fontSize: 11, color: WF_MID, marginTop: 4 }}>{r.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourcesModule() {
  const items = [
    ["CGM User Guide — Dexcom G7", "PDF"],
    ["Carb counting basics", "Video"],
    ["Sick day management plan", "Link"],
  ];
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>Resources</div>
      <div style={{ padding: 16 }}>
        {items.map(([n, t]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", paddingBottom: 8, borderBottom: "0.5px solid #f0f2f3", marginBottom: 8 }}>
            <span style={{ fontSize: 15, color: TEAL, flex: 1, textDecoration: "underline", cursor: "pointer" }}>{n}</span>
            <span style={{
              fontSize: 10, padding: "2px 6px", borderRadius: 8,
              background: "#f4f6f7", color: WF_MID, marginRight: 8,
            }}>{t}</span>
            <span style={{ fontSize: 11, color: WF_MID, cursor: "pointer" }}>Remove</span>
          </div>
        ))}
        <button style={{
          width: "100%", border: `0.5px solid ${TEAL}`, background: SURFACE, color: TEAL,
          borderRadius: 6, fontSize: 16, padding: "6px 0", cursor: "pointer", fontFamily: "inherit",
        }}>
          + Add resource
        </button>
      </div>
    </div>
  );
}

function AssignedFormsModule() {
  const [list, setList] = useState<Array<{ name: string; assigned: string; status: "Pending" | "Completed" }>>([
    { name: "Daily symptom log", assigned: "28 Apr 2026", status: "Pending" },
    { name: "Hypoglycaemia awareness", assigned: "1 May 2026", status: "Pending" },
    { name: "Pre-appointment questionnaire", assigned: "1 May 2026", status: "Completed" },
  ]);
  const [showSel, setShowSel] = useState(false);
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>Assigned forms</div>
      <div style={{ padding: 16 }}>
        <table style={{ width: "100%", fontSize: 15, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Form name", "Assigned", "Status", "Action"].map((h) => (
                <th key={h} style={{ textAlign: "left", fontSize: 11, textTransform: "uppercase", color: WF_MID, fontWeight: 500, padding: "4px 0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: "6px 0", color: WF_DARK }}>{r.name}</td>
                <td style={{ padding: "6px 0", color: WF_DARK }}>{r.assigned}</td>
                <td style={{ padding: "6px 0" }}>
                  <Badge
                    bg={r.status === "Pending" ? WARN_BG : SUCCESS_BG}
                    color={r.status === "Pending" ? WARN_TEXT : SUCCESS_TEXT}
                  >
                    {r.status}
                  </Badge>
                </td>
                <td style={{ padding: "6px 0" }}>
                  <span
                    onClick={() => setList((cur) => cur.filter((_, j) => j !== i))}
                    style={{ fontSize: 12, color: WF_MID, cursor: "pointer", textDecoration: "underline" }}
                  >
                    Remove
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => setShowSel((v) => !v)}
          style={{
            width: "100%", border: `0.5px solid ${TEAL}`, background: SURFACE, color: TEAL,
            borderRadius: 6, fontSize: 16, padding: "6px 0", cursor: "pointer", marginTop: 10, fontFamily: "inherit",
          }}
        >
          + Assign form
        </button>
        {showSel && (
          <select
            onChange={(e) => {
              const v = e.target.value;
              if (v) {
                const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                setList((cur) => [...cur, { name: v, assigned: today, status: "Pending" }]);
                setShowSel(false);
              }
            }}
            defaultValue=""
            style={{
              width: "100%", marginTop: 8, border: `0.5px solid ${BORDER}`,
              borderRadius: 4, padding: "4px 8px", fontSize: 15, fontFamily: "inherit",
            }}
          >
            <option value="" disabled>Select a form…</option>
            <option>Daily symptom log</option>
            <option>Nutrition diary</option>
            <option>Sleep & fatigue log</option>
          </select>
        )}
      </div>
    </div>
  );
}

function AssignedTasksModule() {
  const [list, setList] = useState([
    { text: "Log meals for 3 days", due: "15 May 2026" },
    { text: "Complete hypoglycaemia awareness form", due: "10 May 2026" },
    { text: "Check pump site daily and report any issues", due: "Ongoing" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");
  const [newDue, setNewDue] = useState("");
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>Assigned tasks</div>
      <div style={{ padding: 16 }}>
        {list.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 8, borderBottom: "0.5px solid #f0f2f3", marginBottom: 8 }}>
            <span style={{ width: 14, height: 14, border: `1px solid ${BORDER}`, display: "inline-flex" }} />
            <span style={{ fontSize: 15, color: WF_DARK, flex: 1 }}>{t.text}</span>
            <span style={{ fontSize: 11, color: WF_MID }}>Due: {t.due}</span>
            <span
              onClick={() => setList((cur) => cur.filter((_, j) => j !== i))}
              style={{ fontSize: 15, color: WF_MID, cursor: "pointer" }}
            >×</span>
          </div>
        ))}
        <button
          onClick={() => setShowAdd((v) => !v)}
          style={{
            width: "100%", border: `0.5px solid ${TEAL}`, background: SURFACE, color: TEAL,
            borderRadius: 6, fontSize: 16, padding: "6px 0", cursor: "pointer", marginTop: 8, fontFamily: "inherit",
          }}
        >
          + Add task
        </button>
        {showAdd && (
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <input
              placeholder="Task description"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              style={{ flex: 1, border: `0.5px solid ${BORDER}`, borderRadius: 4, padding: "4px 8px", fontSize: 12 }}
            />
            <input
              type="date"
              value={newDue}
              onChange={(e) => setNewDue(e.target.value)}
              style={{ border: `0.5px solid ${BORDER}`, borderRadius: 4, padding: "4px", fontSize: 12 }}
            />
            <button
              onClick={() => {
                if (newText.trim()) {
                  const due = newDue ? new Date(newDue).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
                  setList((cur) => [...cur, { text: newText.trim(), due }]);
                  setNewText("");
                  setNewDue("");
                  setShowAdd(false);
                }
              }}
              style={{ background: TEAL, color: "#fff", border: "none", borderRadius: 4, fontSize: 16, padding: "4px 10px", cursor: "pointer" }}
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CompletedTasksModule() {
  const items = [
    ["Upload CGM data", "Completed 28 Apr 2026"],
    ["Book next appointment", "Completed 20 Apr 2026"],
    ["Submit pre-appointment form", "Completed 28 Apr 2026"],
  ];
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>Completed tasks</div>
      <div style={{ padding: 16 }}>
        {items.map(([t, d]) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 8, borderBottom: "0.5px solid #f0f2f3", marginBottom: 8 }}>
            <span style={{
              width: 14, height: 14, background: TEAL, color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10,
            }}>✓</span>
            <span style={{ fontSize: 15, color: WF_MID, textDecoration: "line-through", flex: 1 }}>{t}</span>
            <span style={{ fontSize: 11, color: WF_MID }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <AdminShell heading="">
      <div style={{ margin: "-32px", background: WF_BG, minHeight: "100vh" }}>
        <PatientHeader />
        <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <GlucoseModule />
            <InsulinModule />
            <LabsModule />
            <CompletedFormsModule />
            <AppointmentsModule />
          </div>
          <div>
            <RecommendationsModule />
            <ResourcesModule />
            <AssignedFormsModule />
            <AssignedTasksModule />
            <CompletedTasksModule />
          </div>
        </div>
        <div style={{
          background: SURFACE, padding: "10px 24px", borderTop: `0.5px solid ${BORDER}`,
          fontSize: 11, color: WF_MID, display: "flex", justifyContent: "space-between",
        }}>
          <span>Viewing dashboard for Sarah Chen · Last updated 2 min ago</span>
          <Link to="/roster" style={{ color: TEAL, textDecoration: "underline", fontSize: 11 }}>← Back to roster</Link>
        </div>
      </div>
    </AdminShell>
  );
}
