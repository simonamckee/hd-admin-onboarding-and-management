import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, User, X, ArrowLeft, ChevronUp, Calendar } from "lucide-react";
import { MessageBubble } from "@/components/message-bubble";
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
  ERROR_BG,
} from "@/components/wireframe";
import { useDashboardTemplate } from "@/lib/dashboard-template";
import { usePlatformConfig } from "@/lib/platform-config";

export const Route = createFileRoute("/dashboard/$patientId/")({
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

type ChatMsg = {
  id: string;
  from: "clinician" | "recipient";
  text: string;
  status?: "Delivered" | "Sending…" | "Failed";
  time: string;
  unread?: boolean;
};

type ThreadId = "margaret" | "sarah";

const INITIAL_THREADS: Record<ThreadId, ChatMsg[]> = {
  margaret: [
    {
      id: "m1",
      from: "clinician",
      text: "Hi Margaret, just a reminder that Sarah's appointment is tomorrow at 2pm. Please bring her CGM reader if possible.",
      status: "Delivered",
      time: "2 days ago",
    },
    {
      id: "m2",
      from: "recipient",
      text: "Thank you! We'll be there. Should she fast beforehand?",
      time: "1 day ago",
      unread: true,
    },
    {
      id: "m3",
      from: "clinician",
      text: "Also, can you confirm her insulin-to-carb ratio hasn't changed?",
      status: "Failed",
      time: "3 hours ago",
    },
  ],
  sarah: [],
};

const RECIPIENTS: Record<ThreadId, { name: string; relationship: string }> = {
  margaret: { name: "Margaret Chen", relationship: "Parent" },
  sarah: { name: "Sarah Chen", relationship: "Patient" },
};

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeThread, setActiveThread] = useState<ThreadId | null>(null);
  const [draft, setDraft] = useState("");

  const updateStatus = (threadId: ThreadId, msgId: string, status: ChatMsg["status"]) => {
    setThreads((prev) => ({
      ...prev,
      [threadId]: prev[threadId].map((m) => (m.id === msgId ? { ...m, status } : m)),
    }));
  };

  const retry = (threadId: ThreadId, msgId: string) => {
    updateStatus(threadId, msgId, "Sending…");
    setTimeout(() => updateStatus(threadId, msgId, "Delivered"), 1500);
  };

  const sendMessage = () => {
    if (!draft.trim() || !activeThread) return;
    const newMsg: ChatMsg = {
      id: `c${Date.now()}`,
      from: "clinician",
      text: draft.trim(),
      status: "Delivered",
      time: "Just now",
    };
    setThreads((prev) => ({ ...prev, [activeThread]: [...prev[activeThread], newMsg] }));
    setDraft("");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 360,
        height: 500,
        background: "#fff",
        border: "0.5px solid #e0e4e5",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {activeThread === null ? (
        <>
          <div style={{
            padding: "14px 16px", borderBottom: `0.5px solid ${BORDER}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: WF_DARK }}>Messages</span>
            <button onClick={onClose} style={{
              background: "transparent", border: "none", cursor: "pointer", color: WF_MID,
              padding: 4, display: "flex",
            }}>
              <X size={18} />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {(Object.keys(RECIPIENTS) as ThreadId[]).map((tid) => {
              const r = RECIPIENTS[tid];
              const msgs = threads[tid];
              const last = msgs[msgs.length - 1];
              const hasUnread = msgs.some((m) => m.unread);
              return (
                <button
                  key={tid}
                  onClick={() => setActiveThread(tid)}
                  style={{
                    width: "100%", textAlign: "left", background: "transparent",
                    border: "none", borderBottom: `0.5px solid ${BORDER}`,
                    padding: "12px 16px", cursor: "pointer", fontFamily: "inherit",
                    display: "flex", flexDirection: "column", gap: 4,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: WF_DARK }}>
                      {r.name} · <span style={{ color: WF_MID, fontWeight: 400 }}>{r.relationship}</span>
                    </span>
                    {hasUnread && (
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e24b4a" }} />
                    )}
                  </div>
                  <div style={{
                    fontSize: 13, color: last ? WF_MID : "#aac4cc",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    fontStyle: last ? "normal" : "italic",
                  }}>
                    {last ? last.text : "No messages yet"}
                  </div>
                  {last && (
                    <div style={{ fontSize: 11, color: WF_MID }}>
                      {tid === "margaret" ? "1d ago" : ""}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div style={{
            padding: "12px 16px", borderBottom: `0.5px solid ${BORDER}`,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <button onClick={() => setActiveThread(null)} style={{
              background: "transparent", border: "none", cursor: "pointer", color: WF_MID,
              padding: 4, display: "flex",
            }}>
              <ArrowLeft size={18} />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: WF_DARK }}>
                {RECIPIENTS[activeThread].name}
              </div>
              <div style={{ fontSize: 12, color: WF_MID }}>
                {RECIPIENTS[activeThread].relationship}
              </div>
            </div>
            <button onClick={onClose} style={{
              background: "transparent", border: "none", cursor: "pointer", color: WF_MID,
              padding: 4, display: "flex",
            }}>
              <X size={18} />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {threads[activeThread].length === 0 ? (
              <div style={{
                margin: "auto", textAlign: "center", color: WF_MID, fontSize: 13,
                padding: "0 24px",
              }}>
                No messages yet. Send a message to start the conversation.
              </div>
            ) : (
              threads[activeThread].map((m) => {
                const isClin = m.from === "clinician";
                return (
                  <div key={m.id} style={{
                    display: "flex", flexDirection: "column",
                    alignItems: isClin ? "flex-end" : "flex-start",
                    gap: 2,
                  }}>
                    <div style={{
                      maxWidth: "80%",
                      background: isClin ? "#00565B" : "#f0f2f3",
                      color: isClin ? "#fff" : WF_DARK,
                      padding: "8px 12px",
                      borderRadius: 12,
                      fontSize: 13,
                      lineHeight: 1.4,
                    }}>
                      {m.text}
                    </div>
                    <div style={{ fontSize: 10, color: WF_MID, display: "flex", gap: 6, alignItems: "center" }}>
                      {isClin && m.status === "Failed" ? (
                        <span
                          onClick={() => retry(activeThread, m.id)}
                          style={{ color: ERROR_TEXT, cursor: "pointer", fontWeight: 500 }}
                        >
                          Failed · Retry
                        </span>
                      ) : isClin && m.status ? (
                        <span>{m.status}</span>
                      ) : !isClin && m.unread ? (
                        <span style={{
                          background: TEAL, color: "#fff", padding: "1px 6px",
                          borderRadius: 6, fontSize: 9, fontWeight: 600,
                        }}>NEW</span>
                      ) : null}
                      <span>· {m.time}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div style={{
            borderTop: `0.5px solid ${BORDER}`, padding: 10,
            display: "flex", gap: 8,
          }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Type a message…"
              style={{
                flex: 1, fontSize: 13, padding: "8px 10px",
                border: `0.5px solid ${BORDER}`, borderRadius: 6,
                fontFamily: "inherit", outline: "none",
              }}
            />
            <button onClick={sendMessage} style={{
              background: TEAL, color: "#fff", border: "none", borderRadius: 6,
              padding: "0 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit",
            }}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const BADGE_OFFSET = 20; // first separator width (~6) + row gap (14), aligns badges under DOB

function PatientHeader({ role }: { role: Role }) {
  const { config } = usePlatformConfig();
  const [hover, setHover] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const chatEnabled = config.chatEnabled;
  const patientTIR = 65;
  const patientGMI = 8.1;

  return (
    <div
      style={{
        background: "#D7EEFA",
        borderBottom: `0.5px solid ${BORDER}`,
        padding: "14px 24px",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Sarah Chen"
            style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              border: "2px solid #c8e8df", objectFit: "cover",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: WF_DARK, lineHeight: 1.1 }}>
              Sarah Chen
            </div>
            <Link
              to="/dashboard/$patientId/profile"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: TEAL,
                textDecoration: hover ? "underline" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <User size={14} />
              View Care profile →
            </Link>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
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
            {chatEnabled && (
              <button
                onClick={() => setChatOpen((v) => !v)}
                aria-label="Open messages"
                style={{
                  marginLeft: "auto",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MessageBubble hasMessages={true} size={26} />
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: 6, paddingLeft: BADGE_OFFSET }}>
            <Badge bg={SUCCESS_BG} color={SUCCESS_TEXT}>Active</Badge>
            <Badge bg={SUCCESS_BG} color={SUCCESS_TEXT}>CGM connected</Badge>
            <Badge bg={SUCCESS_BG} color={SUCCESS_TEXT}>Pump connected</Badge>
            {role === "clinician" && <Badge bg="#fcebeb" color="#791f1f">DKA risk</Badge>}
            {role === "clinician" && <Badge bg={WARN_BG} color={WARN_TEXT}>Low TIR</Badge>}
            {role === "patient" && config.flags.lowTIR.patient && patientTIR < 70 && (
              <Badge bg="#fff3e0" color="#854f0b">Low TIR</Badge>
            )}
            {role === "patient" && config.flags.gmi.patient && patientGMI > 8 && (
              <Badge bg="#e8f5e9" color="#1b5e20">High GMI</Badge>
            )}
          </div>
        </div>
      </div>
      {chatEnabled && chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
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
        {[
          { label: "12am", key: "12am-start" },
          { label: "3am", key: "3am" },
          { label: "6am", key: "6am" },
          { label: "9am", key: "9am" },
          { label: "12pm", key: "12pm" },
          { label: "3pm", key: "3pm" },
          { label: "6pm", key: "6pm" },
          { label: "9pm", key: "9pm" },
          { label: "12am", key: "12am-end" },
        ].map(({ label, key }, i) => (
          <text key={key} x={i * 87.5} y="258" fontSize="10" fill={WF_MID}>{label}</text>
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
            <div style={{ fontSize: 15, fontWeight: 600, color: WF_DARK, marginBottom: 6 }}>Pump type</div>
            <select defaultValue="Medtronic" style={{
              border: `0.5px solid ${BORDER}`, borderRadius: 4, padding: "4px 8px",
              fontSize: 15, width: "100%", fontFamily: "inherit", marginBottom: 8,
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
          <table style={{ width: "100%", fontSize: 15, borderCollapse: "collapse" }}>
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
            <table style={{ width: "100%", fontSize: 15, borderCollapse: "collapse" }}>
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

type LabRow = {
  id: string;
  name: string;
  last: string;
  next: string;
  overdue: boolean;
  recommended: string;
  labUrl: string;
};

function LabsModule() {
  const [labs, setLabs] = useState<LabRow[]>([
    { id: "a1c", name: "A1c",
      last: "2026-01-01", next: "2026-04-01", overdue: false,
      recommended: "Every 3 months",
      labUrl: "https://labresults.example.com/patient/sarah-chen/a1c" },
    { id: "lipid", name: "Lipid panel",
      last: "2025-01-14", next: "2028-01-14", overdue: false,
      recommended: "Every 3 years",
      labUrl: "https://labresults.example.com/patient/sarah-chen/lipid" },
    { id: "renal", name: "Renal function",
      last: "2025-01-14", next: "2026-01-14", overdue: false,
      recommended: "Yearly",
      labUrl: "https://labresults.example.com/patient/sarah-chen/renal" },
    { id: "thyroid", name: "Thyroid panel",
      last: "2024-03-03", next: "2025-03-03", overdue: true,
      recommended: "Every 2 years",
      labUrl: "https://labresults.example.com/patient/sarah-chen/thyroid" },
    { id: "retino", name: "Retinopathy",
      last: "2023-11-22", next: "2024-11-22", overdue: true,
      recommended: "Yearly",
      labUrl: "https://labresults.example.com/patient/sarah-chen/retinopathy" },
    { id: "neuro", name: "Neuropathy",
      last: "2023-11-22", next: "2024-11-22", overdue: true,
      recommended: "Yearly",
      labUrl: "https://labresults.example.com/patient/sarah-chen/neuropathy" },
  ]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editLast, setEditLast] = useState("");
  const [editNext, setEditNext] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>Labs & test results</div>
      <div style={{ padding: 16 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 100px 105px 140px",
          gap: 8,
          padding: "0 0 6px 0",
          borderBottom: `0.5px solid ${BORDER}`,
          marginBottom: 4,
        }}>
          {["Test", "View results", "Last completed", "Next due", ""].map((h) => (
            <div key={h} style={{ fontSize: 11, fontWeight: 600, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.3 }}>{h}</div>
          ))}
        </div>
        {labs.map((l) => (
          <div key={l.id}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 100px 105px 140px",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "0.5px solid #f0f2f3",
              gap: 8,
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: WF_DARK }}>{l.name}</span>
                  <button
                    onClick={() => setExpandedId(expandedId === l.id ? null : l.id)}
                    aria-label={expandedId === l.id ? "Hide info" : "Show info"}
                    style={{
                      width: 18, height: 18, borderRadius: "50%",
                      border: `1px solid ${TEAL}`, background: expandedId === l.id ? TEAL : "transparent",
                      color: expandedId === l.id ? "#fff" : TEAL,
                      fontSize: 11, fontWeight: 700,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", flexShrink: 0, fontFamily: "inherit",
                      lineHeight: 1,
                    }}
                  >i</button>
                </div>
                {expandedId === l.id && (
                  <div style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: WF_MID,
                    lineHeight: 1.6,
                    background: "#f7f8f8",
                    borderLeft: `3px solid ${TEAL}`,
                    borderRadius: 4,
                    padding: "6px 10px",
                  }}>
                    <div style={{ fontWeight: 500, color: WF_DARK }}>
                      Recommended: {l.recommended}
                    </div>
                  </div>
                )}
              </div>
              <a
                href={l.labUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 14, color: TEAL,
                  textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 4,
                }}
              >
                View results
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              <div style={{ fontSize: 15, color: WF_DARK, whiteSpace: "nowrap" }}>{fmt(l.last)}</div>
              <div>
                <div style={{
                  fontSize: 15,
                  color: l.overdue ? ERROR_TEXT : WF_DARK,
                  fontWeight: l.overdue ? 600 : 400,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 6,
                }}>
                  <span style={{ whiteSpace: "nowrap" }}>{fmt(l.next)}</span>
                  {l.overdue && (
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      background: ERROR_BG, color: ERROR_TEXT,
                      borderRadius: 4, padding: "2px 6px",
                      flexShrink: 0,
                    }}>Overdue</span>
                  )}
                </div>
                <span
                  onClick={() => { setEditId(l.id); setEditLast(l.last); setEditNext(l.next); }}
                  style={{
                    fontSize: 12, color: WF_MID,
                    textDecoration: "underline", cursor: "pointer",
                    display: "inline-block", marginTop: 2,
                  }}
                >Update</span>
              </div>
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

type T1dalSub = { label: string; score: number };
const T1DAL_SUBSCALES: T1dalSub[] = [
  { label: "Emotional Well-being", score: 2.4 },
  { label: "Diabetes Management Burden", score: 2.8 },
  { label: "Support & Relationships", score: 3.6 },
  { label: "Impact on Family Life", score: 2.2 },
];
const T1DAL_OVERALL = 2.7;

function t1dalTier(score: number): { label: string; bar: string; bg: string; text: string } {
  if (score < 2.5) return { label: "Needs Attention", bar: "#C0392B", bg: "#FDEDEC", text: "#7B1A1A" };
  if (score < 3.5) return { label: "Moderate", bar: "#E0A800", bg: "#FEF3E2", text: "#8A5A00" };
  return { label: "Good", bar: "#1A7F5A", bg: "#E8F7F1", text: "#0E5A3F" };
}

const T1DAL_RESPONSES: Array<{ section: string; q: string; ans: string; val: number }> = [
  { section: "Emotional Well-being", q: "I feel worried about my child's blood sugar levels.", ans: "Often", val: 4 },
  { section: "Emotional Well-being", q: "I feel anxious about what could happen if my child's diabetes is not well managed.", ans: "Often", val: 4 },
  { section: "Emotional Well-being", q: "I feel overwhelmed by the demands of managing my child's diabetes.", ans: "Sometimes", val: 3 },
  { section: "Emotional Well-being", q: "I feel sad or depressed because of my child's diabetes.", ans: "Rarely", val: 2 },
  { section: "Emotional Well-being", q: "Managing my child's diabetes affects my own emotional health.", ans: "Sometimes", val: 3 },
  { section: "Diabetes Management Burden", q: "I feel confident managing my child's diabetes day-to-day.", ans: "Sometimes", val: 3 },
  { section: "Diabetes Management Burden", q: "My child's diabetes management interferes with our family's daily routines.", ans: "Often", val: 4 },
  { section: "Diabetes Management Burden", q: "I find it difficult to manage my child's diabetes at night.", ans: "Often", val: 4 },
  { section: "Diabetes Management Burden", q: "I feel prepared to handle unexpected changes in my child's blood sugar.", ans: "Sometimes", val: 3 },
  { section: "Diabetes Management Burden", q: "Keeping up with my child's diabetes care feels like a full-time job.", ans: "Often", val: 4 },
  { section: "Support & Relationships", q: "I feel supported by my partner or family in managing my child's diabetes.", ans: "Often", val: 4 },
  { section: "Support & Relationships", q: "My child's healthcare team listens to my concerns and questions.", ans: "Often", val: 4 },
  { section: "Support & Relationships", q: "I feel comfortable asking the healthcare team for help.", ans: "Often", val: 4 },
  { section: "Support & Relationships", q: "I feel isolated because of my child's diabetes.", ans: "Rarely", val: 2 },
  { section: "Impact on Family Life", q: "My child's diabetes affects the activities our family can do together.", ans: "Often", val: 4 },
  { section: "Impact on Family Life", q: "My child's diabetes affects my ability to work or maintain my own health.", ans: "Often", val: 4 },
  { section: "Impact on Family Life", q: "I feel that my other children miss out because of my child's diabetes.", ans: "Sometimes", val: 3 },
  { section: "Impact on Family Life", q: "I am able to take breaks from diabetes management when needed.", ans: "Rarely", val: 2 },
];

function T1dalResultPanel() {
  const [showResponses, setShowResponses] = useState(false);
  const tiers = [
    { label: "Needs Attention (1.0–2.4)", bar: "#C0392B" },
    { label: "Moderate (2.5–3.4)", bar: "#E0A800" },
    { label: "Good (3.5–5.0)", bar: "#1A7F5A" },
  ];
  return (
    <div style={{
      marginTop: 12, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: 16, background: "#FAFBFB",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: WF_DARK }}>T1DAL – Parent of Child Under 8</div>
          <div style={{ fontSize: 13, color: WF_MID, marginTop: 2 }}>
            Completed by Sarah M. (Parent) · June 10, 2025
          </div>
          <div style={{ fontSize: 13, color: WF_MID }}>
            Patient: Brandon Chen, Age 6
          </div>
        </div>
        <div style={{
          textAlign: "right", padding: "8px 14px", borderRadius: 8,
          background: t1dalTier(T1DAL_OVERALL).bg, color: t1dalTier(T1DAL_OVERALL).text,
        }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>Overall score</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{T1DAL_OVERALL.toFixed(1)} / 5</div>
          <div style={{ fontSize: 11, fontWeight: 600 }}>{t1dalTier(T1DAL_OVERALL).label}</div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {T1DAL_SUBSCALES.map((s) => {
          const tier = t1dalTier(s.score);
          const pct = (s.score / 5) * 100;
          return (
            <div key={s.label} style={{ display: "grid", gridTemplateColumns: "180px 1fr 60px", gap: 10, alignItems: "center" }}>
              <div style={{ fontSize: 13, color: WF_DARK, fontWeight: s.score < 2.5 ? 600 : 400 }}>{s.label}</div>
              <div style={{ position: "relative", height: 22, background: "#fff", border: `0.5px solid ${BORDER}`, borderRadius: 4, overflow: "hidden" }}>
                {/* zone dividers at 2.5 (50%) and 3.5 (70%) */}
                <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#E0E0E0" }} />
                <div style={{ position: "absolute", left: "70%", top: 0, bottom: 0, width: 1, background: "#E0E0E0" }} />
                <div style={{ width: `${pct}%`, height: "100%", background: tier.bar, transition: "width 240ms" }} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: tier.bar }}>{s.score.toFixed(1)}</div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
        {tiers.map((t) => (
          <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: WF_MID }}>
            <span style={{ width: 12, height: 12, background: t.bar, borderRadius: 2, display: "inline-block" }} />
            {t.label}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, fontSize: 12, color: WF_MID, fontStyle: "italic" }}>
        Higher scores indicate better quality of life. Please discuss results with the care team at the next visit.
      </div>

      {/* Expandable responses */}
      <div style={{ borderTop: `0.5px solid ${BORDER}`, marginTop: 14, paddingTop: 10 }}>
        <button
          onClick={() => setShowResponses((v) => !v)}
          style={{ background: "none", border: "none", color: TEAL, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit" }}
        >
          {showResponses ? "▾ Hide Full Responses" : "▸ View Full Responses"}
        </button>
        {showResponses && (
          <div style={{ marginTop: 10 }}>
            {["Emotional Well-being", "Diabetes Management Burden", "Support & Relationships", "Impact on Family Life"].map((section) => (
              <div key={section} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                  {section}
                </div>
                {T1DAL_RESPONSES.filter((r) => r.section === section).map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "4px 0", borderBottom: "0.5px solid #f0f2f3", fontSize: 13 }}>
                    <span style={{ color: WF_DARK, flex: 1 }}>{r.q}</span>
                    <span style={{ color: WF_MID, whiteSpace: "nowrap" }}>{r.ans} ({r.val})</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
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

function RecommendationsModule({ role }: { role: Role }) {
  const [list, setList] = useState([
    { text: "Reviewed basal rate — consider reducing overnight dose by 10%. Monitor for 2 weeks.", meta: "Dr. Reyes · 28 Apr 2026" },
    { text: "Recommended referral to dietitian for carb-counting refresher.", meta: "Dr. Reyes · 12 Mar 2026" },
  ]);
  const [composing, setComposing] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [draft, setDraft] = useState("");

  const tryClose = () => {
    if (draft.trim() && !window.confirm("Discard this recommendation?")) return;
    setComposing(false);
    setMinimised(false);
    setDraft("");
  };

  const save = () => {
    if (!draft.trim()) return;
    setList((cur) => [{ text: draft.trim(), meta: "Dr. Reyes · Today" }, ...cur]);
    setDraft("");
    setComposing(false);
    setMinimised(false);
  };

  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>Recommendations</div>
      <div style={{ padding: 16 }}>
        {role === "clinician" && (
          <button
            onClick={() => { setComposing(true); setMinimised(false); }}
            style={{
              width: "100%", border: `0.5px solid ${TEAL}`, background: SURFACE, color: TEAL,
              borderRadius: 6, fontSize: 15, padding: "6px 0", cursor: "pointer", fontFamily: "inherit",
              marginBottom: 8,
            }}
          >
            + Write recommendation
          </button>
        )}
        {list.map((r, i) => (
          <div key={i} style={{ border: "0.5px solid #e8ecee", borderRadius: 6, padding: 10, marginTop: 8 }}>
            <div style={{ fontSize: 15, color: WF_DARK }}>{r.text}</div>
            <div style={{ fontSize: 11, color: WF_MID, marginTop: 4 }}>{r.meta}</div>
          </div>
        ))}
      </div>
      {role === "clinician" && composing && (
        <div
          style={{
            position: "fixed", bottom: 24, right: 24, width: 380,
            background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.16)", zIndex: 100,
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}
        >
          <div
            style={{
              background: TEAL, padding: "10px 14px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>New recommendation</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {minimised ? (
                <button
                  onClick={() => setMinimised(false)}
                  style={{ border: "none", background: "transparent", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1, display: "flex", alignItems: "center" }}
                  aria-label="Restore"
                >
                  <ChevronUp size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setMinimised(true)}
                  style={{ border: "none", background: "transparent", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}
                  aria-label="Minimise"
                >
                  –
                </button>
              )}
              <button
                onClick={tryClose}
                style={{ border: "none", background: "transparent", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: 20, padding: 0, lineHeight: 1 }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
          {!minimised && (
            <>
              <div style={{ padding: 12 }}>
                <textarea
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a recommendation for this patient…"
                  style={{
                    width: "100%", height: 140, border: `0.5px solid ${BORDER}`, borderRadius: 6,
                    fontSize: 15, padding: 10, fontFamily: "inherit", resize: "none", boxSizing: "border-box",
                  }}
                />
              </div>
              <div
                style={{
                  padding: "10px 12px", borderTop: `0.5px solid ${BORDER}`,
                  display: "flex", justifyContent: "flex-end", gap: 8,
                }}
              >
                <button
                  onClick={tryClose}
                  style={{
                    border: `0.5px solid ${WF_MID}`, color: WF_MID, background: "transparent",
                    borderRadius: 5, fontSize: 14, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={!draft.trim()}
                  style={{
                    background: TEAL, color: "#fff", border: "none", borderRadius: 5,
                    fontSize: 14, padding: "4px 14px", cursor: draft.trim() ? "pointer" : "not-allowed",
                    fontFamily: "inherit", opacity: draft.trim() ? 1 : 0.5,
                  }}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ResourcesModule() {
  const [items, setItems] = useState([
    ["CGM User Guide — Dexcom G7", "PDF"],
    ["Carb counting basics", "Video"],
    ["Sick day management plan", "Link"],
  ]);
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>Resources</div>
      <div style={{ padding: 16 }}>
        {items.map(([n, t], idx) => (
          <div key={n} style={{ display: "flex", alignItems: "center", paddingBottom: 8, borderBottom: "0.5px solid #f0f2f3", marginBottom: 8 }}>
            <span style={{ fontSize: 15, color: TEAL, flex: 1, textDecoration: "underline", cursor: "pointer" }}>{n}</span>
            <span style={{
              fontSize: 10, padding: "2px 6px", borderRadius: 8,
              background: "#f4f6f7", color: WF_MID, marginRight: 8,
            }}>{t}</span>
            <Trash2
              size={14}
              color={WF_MID}
              style={{ cursor: "pointer", flexShrink: 0 }}
              onClick={() => setItems((cur) => cur.filter((_, j) => j !== idx))}
            />
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

type Role = "clinician" | "patient";

const TODAY_REF = new Date("2026-06-23T00:00:00");
function parseDueDate(s: string): Date | null {
  if (!s || s === "—" || s.toLowerCase() === "ongoing") return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}
function isOverdueDate(s: string): boolean {
  const d = parseDueDate(s);
  return d ? d.getTime() < TODAY_REF.getTime() : false;
}

function OverdueBadge() {
  return (
    <span
      style={{
        marginLeft: 6,
        background: ERROR_BG,
        color: ERROR_TEXT,
        fontSize: 11,
        padding: "1px 8px",
        borderRadius: 10,
        fontWeight: 600,
      }}
    >
      Overdue
    </span>
  );
}

function GhostBtnSmall({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: TEAL,
        border: `0.5px solid ${TEAL}`,
        borderRadius: 4,
        fontSize: 11,
        padding: "2px 8px",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

function FormsModule({ role }: { role: Role }) {
  const [tab, setTab] = useState<"Assigned" | "Completed">("Assigned");
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>
        <span>Forms</span>
      </div>
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "0 16px", display: "flex" }}>
        <TabButton active={tab === "Assigned"} onClick={() => setTab("Assigned")}>Assigned</TabButton>
        <TabButton active={tab === "Completed"} onClick={() => setTab("Completed")}>Completed</TabButton>
      </div>
      {tab === "Assigned" && <AssignedFormsTab role={role} />}
      {tab === "Completed" && <CompletedFormsTab role={role} />}
    </div>
  );
}

function AssignedFormsTab({ role }: { role: Role }) {
  const [list, setList] = useState<Array<{ name: string; assigned: string; due: string; status: "Pending" | "Completed" }>>([
    { name: "T1DAL – Parent of Child Under 8", assigned: "1 Jun 2026", due: "30 Jun 2026", status: "Pending" },
    { name: "Monthly Check-in", assigned: "1 May 2026", due: "15 Jun 2026", status: "Pending" },
    { name: "Daily symptom log", assigned: "28 Apr 2026", due: "10 Jun 2026", status: "Pending" },
    { name: "Hypoglycaemia awareness", assigned: "1 May 2026", due: "1 Jul 2026", status: "Pending" },
  ]);
  const [showSel, setShowSel] = useState(false);
  const [selName, setSelName] = useState("");
  const [selDue, setSelDue] = useState("");
  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 100px 100px 90px 32px",
          gap: 8,
          padding: "0 0 6px 0",
          borderBottom: `0.5px solid ${BORDER}`,
          marginBottom: 4,
        }}
      >
        {["Form name", "Assigned", "Due date", "Status", ""].map((h) => (
          <div key={h} style={{ fontSize: 11, fontWeight: 600, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.3 }}>{h}</div>
        ))}
      </div>
      {list.map((r, i) => {
        const overdue = r.status === "Pending" && isOverdueDate(r.due);
        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 100px 100px 90px 32px",
              gap: 8,
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "0.5px solid #f0f2f3",
            }}
          >
            <div style={{ fontSize: 15, color: WF_DARK, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
              <span>{r.name}</span>
              {overdue && <OverdueBadge />}
              {overdue && <GhostBtnSmall>Send reminder</GhostBtnSmall>}
            </div>
            <div style={{ fontSize: 15, color: WF_DARK }}>{r.assigned}</div>
            <div style={{ fontSize: 11, color: overdue ? ERROR_TEXT : WF_MID, fontWeight: overdue ? 600 : 400, display: "flex", alignItems: "center", gap: 3 }}>
              <Calendar size={11} color={overdue ? ERROR_TEXT : WF_MID} />
              <span>{r.due}</span>
            </div>
            <div>
              <Badge
                bg={r.status === "Pending" ? WARN_BG : SUCCESS_BG}
                color={r.status === "Pending" ? WARN_TEXT : SUCCESS_TEXT}
              >
                {r.status}
              </Badge>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {role === "clinician" && r.status !== "Completed" && (
                <Trash2
                  size={14}
                  color={WF_MID}
                  style={{ cursor: "pointer" }}
                  onClick={() => setList((cur) => cur.filter((_, j) => j !== i))}
                />
              )}
            </div>
          </div>
        );
      })}
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
        <div style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "center" }}>
          <select
            value={selName}
            onChange={(e) => setSelName(e.target.value)}
            style={{
              flex: 1, border: `0.5px solid ${BORDER}`,
              borderRadius: 4, padding: "4px 8px", fontSize: 12, fontFamily: "inherit",
            }}
          >
            <option value="" disabled>Select a form…</option>
            <option>T1DAL – Parent of Child Under 8</option>
            <option>Daily symptom log</option>
            <option>Nutrition diary</option>
            <option>Sleep & fatigue log</option>
          </select>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <label style={{ fontSize: 11, color: WF_MID, fontWeight: 500 }}>
              Due date — the patient will be asked to complete this form by this date
            </label>
            <input
              type="date"
              value={selDue}
              onChange={(e) => setSelDue(e.target.value)}
              style={{ border: `0.5px solid ${BORDER}`, borderRadius: 4, padding: "4px", fontSize: 12 }}
            />
          </div>
          <button
            onClick={() => {
              if (!selName) return;
              const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
              const due = selDue ? new Date(selDue).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
              setList((cur) => [...cur, { name: selName, assigned: today, due, status: "Pending" }]);
              setSelName("");
              setSelDue("");
              setShowSel(false);
            }}
            style={{ background: TEAL, color: "#fff", border: "none", borderRadius: 4, fontSize: 16, padding: "4px 10px", cursor: "pointer" }}
          >
            Assign
          </button>
        </div>
      )}
    </div>
  );
}

function CompletedFormsTab({ role }: { role: Role }) {
  const [openT1dal, setOpenT1dal] = useState(false);
  const allRows = [
    { name: "T1DAL – Parent of Child Under 8", date: "10 Jun 2025", score: "Overall: 2.7/5", t1dal: true },
    { name: "Pre-appointment questionnaire", date: "28 Apr 2026", score: "—", t1dal: false },
    { name: "Hypoglycaemia awareness", date: "12 Mar 2026", score: "Score: 14/20", t1dal: false },
    { name: "Quality of life (PedsQL)", date: "1 Feb 2026", score: "Score: 72/100", t1dal: false },
  ];
  const rows = role === "patient" ? allRows.filter((r) => !r.t1dal) : allRows;
  return (
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
          {rows.map((r) => (
            <tr key={r.name}>
              <td style={{ padding: "6px 0", color: WF_DARK }}>{r.name}</td>
              <td style={{ padding: "6px 0", color: WF_DARK }}>{r.date}</td>
              <td style={{ padding: "6px 0", color: WF_DARK }}>{r.score}</td>
              <td style={{ padding: "6px 0" }}>
                {r.t1dal ? (
                  <span
                    onClick={() => setOpenT1dal((v) => !v)}
                    style={{ color: TEAL, textDecoration: "underline", cursor: "pointer" }}
                  >
                    {openT1dal ? "Hide" : "View"}
                  </span>
                ) : (
                  <span style={{ color: TEAL, textDecoration: "underline", cursor: "pointer" }}>View</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: 11, color: WF_MID, marginTop: 8 }}>
        Showing {rows.length} of {rows.length + 3} completed forms
      </div>
      {openT1dal && role !== "patient" && <T1dalResultPanel />}
    </div>
  );
}

function TasksModule({ role }: { role: Role }) {
  const [tab, setTab] = useState<"Assigned" | "Completed">("Assigned");
  return (
    <div style={CARD}>
      <div style={CARD_HEADER}>
        <span>Tasks</span>
      </div>
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "0 16px", display: "flex" }}>
        <TabButton active={tab === "Assigned"} onClick={() => setTab("Assigned")}>Assigned</TabButton>
        <TabButton active={tab === "Completed"} onClick={() => setTab("Completed")}>Completed</TabButton>
      </div>
      {tab === "Assigned" && <AssignedTasksTab role={role} />}
      {tab === "Completed" && <CompletedTasksTab />}
    </div>
  );
}

function AssignedTasksTab({ role }: { role: Role }) {
  const [list, setList] = useState([
    { text: "Log meals for 3 days", due: "15 May 2026" },
    { text: "Complete hypoglycaemia awareness form", due: "10 May 2026" },
    { text: "Check pump site daily and report any issues", due: "Ongoing" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [addMode, setAddMode] = useState<"library" | "free">("free");
  const [newText, setNewText] = useState("");
  const [newDue, setNewDue] = useState("");
  const [libPick, setLibPick] = useState("");
  const LIBRARY_TASKS = [
    "Log meals for 3 days",
    "Check pump site daily",
    "Upload CGM data before appointment",
    "Log blood glucose 4x daily",
    "Share school diabetes management plan",
  ];
  return (
    <div style={{ padding: 16 }}>
      {list.map((t, i) => {
        const overdue = isOverdueDate(t.due);
        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto auto",
              gap: 8,
              alignItems: "center",
              paddingBottom: 8,
              borderBottom: "0.5px solid #f0f2f3",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 15, color: WF_DARK, minWidth: 0 }}>{t.text}</span>
            <span style={{ fontSize: 11, color: overdue ? ERROR_TEXT : WF_MID, fontWeight: overdue ? 600 : 400, display: "inline-flex", alignItems: "center", gap: 3 }}>
              <Calendar size={11} color={overdue ? ERROR_TEXT : WF_MID} />
              <span>{t.due}</span>
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {overdue && <OverdueBadge />}
              {overdue && <GhostBtnSmall>Send reminder</GhostBtnSmall>}
            </span>
            <span style={{ display: "inline-flex", justifyContent: "flex-end", minWidth: 14 }}>
              {role === "clinician" && (
                <Trash2
                  size={14}
                  color={WF_MID}
                  style={{ cursor: "pointer", flexShrink: 0 }}
                  onClick={() => setList((cur) => cur.filter((_, j) => j !== i))}
                />
              )}
            </span>
          </div>
        );
      })}
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
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {(["library", "free"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setAddMode(m)}
                style={{
                  border: `0.5px solid ${addMode === m ? TEAL : BORDER}`,
                  background: addMode === m ? TEAL : SURFACE,
                  color: addMode === m ? "#fff" : WF_DARK,
                  borderRadius: 999, fontSize: 12, padding: "4px 10px",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {m === "library" ? "From library" : "Free text"}
              </button>
            ))}
          </div>
          {addMode === "free" ? (
            <div style={{ display: "flex", gap: 6 }}>
              <input
                placeholder="Task description"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                style={{ flex: 1, border: `0.5px solid ${BORDER}`, borderRadius: 4, padding: "4px 8px", fontSize: 12 }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <label style={{ fontSize: 11, color: WF_MID, fontWeight: 500 }}>
                  Due date — the patient will be asked to complete this task by this date
                </label>
                <input
                  type="date"
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                  style={{ border: `0.5px solid ${BORDER}`, borderRadius: 4, padding: "4px", fontSize: 12 }}
                />
              </div>
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
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <select
                value={libPick}
                onChange={(e) => setLibPick(e.target.value)}
                style={{ flex: 1, border: `0.5px solid ${BORDER}`, borderRadius: 4, padding: "4px 8px", fontSize: 12, fontFamily: "inherit" }}
              >
                <option value="" disabled>Select a task…</option>
                {LIBRARY_TASKS.map((t) => <option key={t}>{t}</option>)}
              </select>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <label style={{ fontSize: 11, color: WF_MID, fontWeight: 500 }}>
                  Due date — the patient will be asked to complete this task by this date
                </label>
                <input
                  type="date"
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                  style={{ border: `0.5px solid ${BORDER}`, borderRadius: 4, padding: "4px", fontSize: 12 }}
                />
              </div>
              <button
                onClick={() => {
                  if (!libPick) return;
                  const due = newDue ? new Date(newDue).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
                  setList((cur) => [...cur, { text: libPick, due }]);
                  setLibPick("");
                  setNewDue("");
                  setShowAdd(false);
                }}
                style={{ background: TEAL, color: "#fff", border: "none", borderRadius: 4, fontSize: 16, padding: "4px 10px", cursor: "pointer" }}
              >
                Assign
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CompletedTasksTab() {
  const items = [
    ["Upload CGM data", "Completed 28 Apr 2026"],
    ["Book next appointment", "Completed 20 Apr 2026"],
    ["Submit pre-appointment form", "Completed 28 Apr 2026"],
  ];
  return (
    <div style={{ padding: 16 }}>
      {items.map(([t, d]) => (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 8, borderBottom: "0.5px solid #f0f2f3", marginBottom: 8 }}>
          <span style={{
            width: 14, height: 14, background: TEAL, color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10,
          }}>✓</span>
          <span style={{ fontSize: 15, color: WF_MID, flex: 1 }}>{t}</span>
          <span style={{ fontSize: 11, color: WF_MID }}>{d}</span>
        </div>
      ))}
    </div>
  );
}

const MODULE_COMPONENTS: Record<string, React.ComponentType> = {
  glucose: GlucoseModule,
  insulin: InsulinModule,
  labs: LabsModule,
  appointments: AppointmentsModule,
  resources: ResourcesModule,
};

function DashboardPage() {
  const { clinicianModules } = useDashboardTemplate();
  const { config } = usePlatformConfig();
  void config;
  const [role, setRole] = useState<Role>("clinician");
  const normaliseId = (id: string): string =>
    id === "completedForms" || id === "assignedForms" ? "forms"
    : id === "completedTasks" || id === "assignedTasks" ? "tasks"
    : id;

  const seenGlobal = new Set<string>();
  const leftIds: string[] = [];
  const rightIds: string[] = [];

  clinicianModules.patientData.map(normaliseId).forEach((id) => {
    if (!seenGlobal.has(id)) { seenGlobal.add(id); leftIds.push(id); }
  });
  clinicianModules.clinicalActions.map(normaliseId).forEach((id) => {
    if (!seenGlobal.has(id)) { seenGlobal.add(id); rightIds.push(id); }
  });

  const renderColumn = (ids: string[]) =>
    ids.map((id) => {
      if (id === "forms") return <FormsModule key={`forms-${role}`} role={role} />;
      if (id === "tasks") return <TasksModule key={`tasks-${role}`} role={role} />;
      if (id === "recommendations") return <RecommendationsModule key={`recommendations-${role}`} role={role} />;
      const C = MODULE_COMPONENTS[id];
      return C ? <C key={id} /> : null;
    });
  return (
    <AdminShell heading="">
      <div style={{ margin: "-32px", background: WF_BG, minHeight: "100vh" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 10 }}>
          <PatientHeader role={role} />
          <div
            style={{
              background: SURFACE,
              padding: "6px 24px",
              borderBottom: `0.5px solid ${BORDER}`,
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: WF_MID,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              View as
            </span>
            {(["clinician", "patient"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  background: role === r ? TEAL : "transparent",
                  color: role === r ? "#fff" : WF_DARK,
                  border: `0.5px solid ${role === r ? TEAL : BORDER}`,
                  borderRadius: 4,
                  padding: "2px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textTransform: "capitalize",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
          <div>{renderColumn(leftIds)}</div>
          <div>{renderColumn(rightIds)}</div>
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
