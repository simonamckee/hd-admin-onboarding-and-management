import { createFileRoute, Link } from "@tanstack/react-router";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { usePlatformConfig } from "@/lib/platform-config";
import {
  WF_BG, WF_DARK, WF_MID, TEAL, SURFACE, BORDER, TINT,
} from "@/components/wireframe";
import { MessageBubble } from "@/components/message-bubble";

export const Route = createFileRoute("/patient/dashboard")({ component: PatientDashboard });

// ============ Notification context ============

type Category = "forms" | "tasks" | "recommendations" | "resources" | "labs";
type NotifState = Record<Category, string[]>;

type NotifCtx = {
  state: NotifState;
  markSeen: (cat: Category, id: string) => void;
  markAllSeen: (cat: Category) => void;
  hasUnreadChat: boolean;
  setHasUnreadChat: (v: boolean) => void;
};

const NotificationContext = createContext<NotifCtx | null>(null);
const useNotif = () => {
  const v = useContext(NotificationContext);
  if (!v) throw new Error("NotificationContext missing");
  return v;
};

// ============ Shared UI primitives ============

const RED = "#E24B4A";

function RedDot({ size = 8, style }: { size?: number; style?: CSSProperties }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: "50%", background: RED,
      display: "inline-block", ...style,
    }} />
  );
}

const CARD: CSSProperties = {
  background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: 8,
  marginBottom: 16, overflow: "hidden", scrollMarginTop: 72,
};
const CARD_HEADER: CSSProperties = {
  padding: "12px 16px", borderBottom: `0.5px solid ${BORDER}`,
  display: "flex", alignItems: "center", justifyContent: "space-between",
  fontSize: 17, fontWeight: 700, color: WF_DARK,
};

function ModuleHeader({ title, category, onClick }: {
  title: string; category?: Category; onClick?: () => void;
}) {
  const notif = useNotif();
  const hasDot = category ? notif.state[category].length > 0 : false;
  return (
    <div style={{ ...CARD_HEADER, cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      <span>{title}</span>
      {hasDot && <RedDot />}
    </div>
  );
}

function TabPill({ active, onClick, children, dot }: {
  active: boolean; onClick: () => void; children: ReactNode; dot?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? TEAL : "transparent",
        color: active ? "#fff" : WF_MID,
        border: `1px solid ${active ? TEAL : BORDER}`,
        borderRadius: 999, padding: "5px 12px", fontSize: 13, fontWeight: 500,
        cursor: "pointer", fontFamily: "inherit",
        display: "inline-flex", alignItems: "center", gap: 6,
      }}
    >
      {children}
      {dot && <RedDot size={7} />}
    </button>
  );
}

function TabRow({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", gap: 8, padding: "12px 16px 0" }}>{children}</div>;
}

// ============ GLUCOSE ============

function GlucoseModule() {
  const tir = [
    { label: "Very Low", pct: 8, color: "#7b1a1a" },
    { label: "Low", pct: 4, color: "#c0392b" },
    { label: "Target", pct: 49, color: "#27500a" },
    { label: "High", pct: 20, color: "#b45309" },
    { label: "Very High", pct: 19, color: "#f97316" },
  ];
  return (
    <>
      <ModuleHeader title="Glucose" />
      <div style={{ padding: 16 }}>
        <svg width="100%" height={220} viewBox="0 0 700 260" preserveAspectRatio="none">
          <rect width="700" height="260" fill="#fafafa" />
          <line x1="0" y1="230" x2="700" y2="230" stroke="#7b1a1a" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="0" y1="195" x2="700" y2="195" stroke="#c0392b" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="0" y1="130" x2="700" y2="130" stroke="#27500a" strokeWidth="1" />
          <line x1="0" y1="65" x2="700" y2="65" stroke="#27500a" strokeWidth="1" />
          <line x1="0" y1="30" x2="700" y2="30" stroke="#b45309" strokeDasharray="4 4" strokeWidth="1" />
          <path d="M 0 170 Q 100 200 175 210 T 350 140 T 525 30 T 700 150 L 700 250 L 0 250 Z" fill="#93c5fd" opacity="0.35" />
          <path d="M 0 160 Q 100 190 175 195 T 350 130 T 525 45 T 700 140 L 700 230 Q 525 160 350 200 T 0 220 Z" fill="#bfdbfe" opacity="0.45" />
          <path d="M 0 150 Q 100 175 175 180 T 350 125 T 525 55 T 700 130 L 700 200 Q 525 130 350 180 T 0 200 Z" fill="#dbeafe" opacity="0.55" />
          <path d="M 0 145 Q 100 165 175 175 T 350 110 T 525 55 T 700 120" stroke="#000" strokeWidth="2" fill="none" />
          {["350", "250", "180", "70", "54", "0"].map((l, i) => (
            <text key={l} x="4" y={20 + i * 45} fontSize="10" fill={WF_MID}>{l}</text>
          ))}
          {["12am", "6am", "12pm", "6pm", "12am"].map((l, i) => (
            <text key={l} x={i * 175} y="258" fontSize="10" fill={WF_MID}>{l}</text>
          ))}
        </svg>
        <div style={{ display: "flex", height: 18, marginTop: 14, borderRadius: 4, overflow: "hidden" }}>
          {tir.map((s) => <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} />)}
        </div>
        <div style={{ display: "flex", marginTop: 4 }}>
          {tir.map((s) => (
            <div key={s.label} style={{ width: `${s.pct}%`, fontSize: 9, color: WF_MID, textAlign: "center" }}>
              {s.label} {s.pct}%
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: WF_MID, fontStyle: "italic", marginTop: 8 }}>
          Data from your connected CGM device.
        </div>
      </div>
    </>
  );
}

// ============ INSULIN ============

function InsulinModule() {
  const [tab, setTab] = useState<"Pump" | "MDI">("Pump");
  return (
    <>
      <ModuleHeader title="Insulin" />
      <TabRow>
        <TabPill active={tab === "Pump"} onClick={() => setTab("Pump")}>Pump</TabPill>
        <TabPill active={tab === "MDI"} onClick={() => setTab("MDI")}>MDI</TabPill>
      </TabRow>
      {tab === "Pump" ? <PumpTab /> : <MDITab />}
    </>
  );
}

function PumpTab() {
  const basalRows = [
    ["00:00", "0.8"], ["04:00", "0.2"], ["09:00", "0.95"], ["11:00", "1.2"],
    ["16:30", "1.3"], ["19:00", "1.2"], ["23:00", "1.25"],
  ];
  const C = 2 * Math.PI * 50;
  const basalLen = C * 0.59;
  const bolusLen = C * 0.41;
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: WF_DARK, marginBottom: 6 }}>Daily insulin</div>
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
        <svg width="110" height="110" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r="50" fill="none" stroke="#95d7e5" strokeWidth="22"
            strokeDasharray={`${basalLen} ${C}`} transform="rotate(-90 65 65)" />
          <circle cx="65" cy="65" r="50" fill="none" stroke={TEAL} strokeWidth="22"
            strokeDasharray={`${bolusLen} ${C}`} strokeDashoffset={-basalLen} transform="rotate(-90 65 65)" />
        </svg>
        <div style={{ fontSize: 13 }}>
          <div style={{ color: WF_DARK }}><span style={{ color: "#95d7e5" }}>●</span> Basal — 59% · 12.6 U</div>
          <div style={{ color: WF_DARK }}><span style={{ color: TEAL }}>●</span> Bolus — 41% · 9.6 U</div>
          <div style={{ marginTop: 6, fontWeight: 600, color: WF_DARK }}>TDD: 22.2 units</div>
        </div>
      </div>
      <div style={{ background: "#f4fbfa", padding: 10, borderRadius: 6, marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: WF_MID }}>Pump · Active insulin time</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: WF_DARK }}>Medtronic · 1.5 hrs</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: WF_DARK, marginBottom: 6 }}>Basal rates (basal 3 – active)</div>
      <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", color: WF_MID, fontWeight: 500, padding: "2px 0" }}>Start</th>
            <th style={{ textAlign: "left", color: WF_MID, fontWeight: 500, padding: "2px 0" }}>U/hr</th>
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
      <div style={{ marginTop: 10, fontSize: 11, color: WF_MID }}>Last uploaded: 6 Sep 2026 · 9:00 AM</div>
    </div>
  );
}

function MDITab() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: WF_MID, textTransform: "uppercase", marginBottom: 6 }}>
        Insulin
      </div>
      <div style={{ fontSize: 14, color: WF_DARK }}>Long — Basaglar</div>
      <div style={{ fontSize: 14, color: WF_DARK, marginBottom: 10 }}>Rapid — (none)</div>
      <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Dose", "Long", "ICR", "ISF", "Target"].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "4px 0", fontWeight: 600, color: WF_DARK }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {["Breakfast", "Lunch", "Snack", "Dinner", "Bedtime"].map((r) => (
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
  );
}

// ============ FORMS ============

type FormItem = { id: string; name: string; meta: string };

function FormsModule() {
  const notif = useNotif();
  const [tab, setTab] = useState<"todo" | "done">("todo");
  const [todo, setTodo] = useState<FormItem[]>([
    { id: "form-1", name: "Monthly Check-in", meta: "Dr. Reyes · Due in 3 days" },
    { id: "form-2", name: "Hypoglycaemia awareness", meta: "Dr. Reyes · Due in 7 days" },
  ]);
  const [done, setDone] = useState<FormItem[]>([
    { id: "form-d1", name: "Pre-appointment questionnaire", meta: "Submitted Apr 28, 2026" },
    { id: "form-d2", name: "Quality of life (PedsQL)", meta: "Submitted Feb 1, 2026" },
  ]);
  const [openForm, setOpenForm] = useState<FormItem | null>(null);

  const goTodo = () => {
    setTab("todo");
    notif.markAllSeen("forms");
  };

  const submitForm = (f: FormItem) => {
    setTodo((t) => t.filter((x) => x.id !== f.id));
    setDone((d) => [{ id: f.id, name: f.name, meta: `Submitted ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` }, ...d]);
    notif.markSeen("forms", f.id);
    setOpenForm(null);
  };

  return (
    <>
      <ModuleHeader title="Forms" category="forms" />
      <TabRow>
        <TabPill active={tab === "todo"} onClick={goTodo} dot={notif.state.forms.length > 0}>
          To complete
        </TabPill>
        <TabPill active={tab === "done"} onClick={() => setTab("done")}>Completed</TabPill>
      </TabRow>
      <div style={{ padding: "8px 16px 16px" }}>
        {tab === "todo" && todo.map((f) => (
          <div key={f.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 0", borderBottom: `0.5px solid ${BORDER}`,
          }}>
            <div>
              <div style={{ fontSize: 15, color: WF_DARK, fontWeight: 500 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: WF_MID }}>{f.meta}</div>
            </div>
            <button
              onClick={() => setOpenForm(f)}
              style={{
                fontSize: 14, color: TEAL, border: `1px solid ${TEAL}`, borderRadius: 6,
                padding: "5px 12px", background: "transparent", cursor: "pointer", fontFamily: "inherit",
              }}
            >Fill out</button>
          </div>
        ))}
        {tab === "todo" && todo.length === 0 && (
          <div style={{ fontSize: 14, color: WF_MID, padding: "12px 0" }}>No forms to complete.</div>
        )}
        {tab === "done" && done.map((f) => (
          <div key={f.id} style={{
            padding: "12px 0", borderBottom: `0.5px solid ${BORDER}`,
          }}>
            <div style={{ fontSize: 15, color: WF_DARK }}>{f.name}</div>
            <div style={{ fontSize: 12, color: WF_MID }}>{f.meta}</div>
          </div>
        ))}
      </div>
      {openForm && (
        <FormOverlay
          form={openForm}
          onClose={() => setOpenForm(null)}
          onSubmit={() => submitForm(openForm)}
        />
      )}
    </>
  );
}

function FormOverlay({ form, onClose, onSubmit }: {
  form: FormItem; onClose: () => void; onSubmit: () => void;
}) {
  const [choice, setChoice] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [draftFlash, setDraftFlash] = useState(false);

  const saveDraft = () => {
    setDraftFlash(true);
    setTimeout(() => setDraftFlash(false), 2000);
  };

  const choices = ["Less than once a day", "1–3 times a day", "4 or more times a day"];

  return (
    <div style={{
      position: "fixed", inset: 0, background: SURFACE, zIndex: 100,
      display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto",
      fontFamily: '"Urbanist", system-ui, sans-serif',
    }}>
      <div style={{
        height: 52, borderBottom: `0.5px solid ${BORDER}`,
        display: "flex", alignItems: "center", padding: "0 16px", gap: 12,
      }}>
        <button onClick={onClose} style={{
          fontSize: 20, color: WF_DARK, background: "none", border: "none",
          cursor: "pointer", padding: 0, fontFamily: "inherit",
        }}>←</button>
        <div style={{ fontSize: 16, fontWeight: 600, color: WF_DARK, flex: 1 }}>{form.name}</div>
        {draftFlash && <span style={{ fontSize: 13, color: WF_MID }}>Draft saved</span>}
        <button onClick={saveDraft} style={{
          fontSize: 14, color: TEAL, background: "none", border: "none",
          cursor: "pointer", fontFamily: "inherit",
        }}>Save draft</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: WF_DARK, marginBottom: 10 }}>
            How often did you check your blood glucose this week?
          </div>
          {choices.map((c) => (
            <button
              key={c}
              onClick={() => setChoice(c)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                border: choice === c ? `1.5px solid ${TEAL}` : `1px solid ${BORDER}`,
                background: choice === c ? TINT : SURFACE,
                borderRadius: 6, padding: "10px 14px", marginBottom: 8, fontSize: 15,
                cursor: "pointer", fontFamily: "inherit", color: WF_DARK,
              }}
            >{c}</button>
          ))}
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: WF_DARK, marginBottom: 10 }}>
            Rate your overall wellbeing this week (1–10)
          </div>
          <div>
            {Array.from({ length: 10 }).map((_, i) => {
              const n = i + 1;
              const sel = rating === n;
              return (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  style={{
                    width: 32, height: 32, border: `1px solid ${BORDER}`, borderRadius: 4,
                    fontSize: 14, display: "inline-flex", alignItems: "center",
                    justifyContent: "center", marginRight: 4, cursor: "pointer",
                    background: sel ? TEAL : SURFACE, color: sel ? "#fff" : WF_DARK,
                    fontFamily: "inherit",
                  }}
                >{n}</button>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: WF_DARK, marginBottom: 10 }}>
            Is there anything else you'd like your care team to know?
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              width: "100%", minHeight: 80, border: `1px solid ${BORDER}`,
              borderRadius: 6, padding: "8px 12px", fontSize: 15,
              fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
            }}
          />
        </div>
      </div>
      <div style={{
        padding: "12px 16px", borderTop: `0.5px solid ${BORDER}`,
        display: "flex", justifyContent: "flex-end", gap: 8,
      }}>
        <button onClick={saveDraft} style={{
          border: `1px solid ${TEAL}`, color: TEAL, background: "transparent",
          borderRadius: 6, padding: "8px 16px", fontSize: 15, cursor: "pointer",
          fontFamily: "inherit",
        }}>Save draft</button>
        <button onClick={onSubmit} style={{
          background: TEAL, color: "#fff", border: "none",
          borderRadius: 6, padding: "8px 16px", fontSize: 15, cursor: "pointer",
          fontFamily: "inherit",
        }}>Submit</button>
      </div>
    </div>
  );
}

// ============ TASKS ============

type TaskItem = { id: string; name: string; meta: string };

function TasksModule() {
  const notif = useNotif();
  const [tab, setTab] = useState<"todo" | "done">("todo");
  const [todo, setTodo] = useState<TaskItem[]>([
    { id: "task-1", name: "Log meals for 3 days", meta: "Dr. Reyes · Due May 15, 2026" },
    { id: "task-2", name: "Check pump site daily", meta: "Dr. Reyes · Ongoing" },
  ]);
  const [done, setDone] = useState<TaskItem[]>([
    { id: "task-d1", name: "Book next appointment", meta: "Completed Apr 20, 2026" },
  ]);

  const goTodo = () => {
    setTab("todo");
    notif.markAllSeen("tasks");
  };

  const complete = (t: TaskItem) => {
    setTodo((arr) => arr.filter((x) => x.id !== t.id));
    setDone((arr) => [{ ...t, meta: `Completed ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` }, ...arr]);
    notif.markSeen("tasks", t.id);
  };

  return (
    <>
      <ModuleHeader title="Tasks" category="tasks" />
      <TabRow>
        <TabPill active={tab === "todo"} onClick={goTodo} dot={notif.state.tasks.length > 0}>
          To complete
        </TabPill>
        <TabPill active={tab === "done"} onClick={() => setTab("done")}>Completed</TabPill>
      </TabRow>
      <div style={{ padding: "8px 16px 16px" }}>
        {tab === "todo" && todo.map((t) => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 0", borderBottom: `0.5px solid ${BORDER}`,
          }}>
            <button
              onClick={() => complete(t)}
              aria-label="Mark complete"
              style={{
                width: 20, height: 20, border: `1.5px solid ${BORDER}`, borderRadius: 4,
                cursor: "pointer", background: SURFACE, padding: 0,
              }}
            />
            <div>
              <div style={{ fontSize: 15, color: WF_DARK }}>{t.name}</div>
              <div style={{ fontSize: 12, color: WF_MID }}>{t.meta}</div>
            </div>
          </div>
        ))}
        {tab === "todo" && todo.length === 0 && (
          <div style={{ fontSize: 14, color: WF_MID, padding: "12px 0" }}>All done!</div>
        )}
        {tab === "done" && done.map((t) => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 0", borderBottom: `0.5px solid ${BORDER}`,
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 4, background: TEAL,
              color: "#fff", fontSize: 11, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>✓</div>
            <div>
              <div style={{ fontSize: 15, color: WF_MID, textDecoration: "line-through" }}>{t.name}</div>
              <div style={{ fontSize: 12, color: WF_MID }}>{t.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ============ RECOMMENDATIONS ============

function RecommendationsModule() {
  const notif = useNotif();
  const recs = [
    { text: "Reviewed basal rate — consider reducing overnight dose by 10%. Monitor for 2 weeks.", meta: "Dr. Reyes · Apr 28, 2026" },
    { text: "Recommended referral to dietitian for carb-counting refresher.", meta: "Dr. Reyes · Mar 12, 2026" },
  ];
  return (
    <div onClick={() => notif.markAllSeen("recommendations")}>
      <ModuleHeader title="Recommendations" category="recommendations" />
      <div style={{ padding: "0 16px 8px" }}>
        {recs.map((r, i) => (
          <div key={i} style={{ padding: "12px 0", borderBottom: `0.5px solid ${BORDER}` }}>
            <div style={{ fontSize: 15, color: WF_DARK, lineHeight: 1.5 }}>{r.text}</div>
            <div style={{ fontSize: 12, color: WF_MID, marginTop: 4 }}>{r.meta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ RESOURCES ============

function ResourcesModule() {
  const notif = useNotif();
  const resources = [
    { id: "res-1", name: "CGM User Guide — Dexcom G7", type: "PDF" },
    { id: "res-2", name: "Carb counting basics", type: "Video" },
    { id: "res-3", name: "Sick day management plan", type: "Link" },
  ];
  return (
    <>
      <ModuleHeader title="Resources" category="resources" />
      <div style={{ padding: "0 16px 8px" }}>
        {resources.map((r) => {
          const unseen = notif.state.resources.includes(r.id);
          return (
            <div
              key={r.id}
              onClick={() => notif.markSeen("resources", r.id)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 0", borderBottom: `0.5px solid ${BORDER}`, cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15, color: TEAL, fontWeight: 500 }}>{r.name}</span>
                {unseen && <RedDot />}
              </div>
              <span style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 10,
                background: WF_BG, color: WF_MID,
              }}>{r.type}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ============ APPOINTMENTS ============

function AppointmentsModule() {
  const past = [
    ["12 Mar 2026", "In-person", "Dr. Reyes"],
    ["4 Dec 2025", "Virtual", "Dr. Reyes"],
    ["18 Sep 2025", "In-person", "Dr. Reyes"],
  ];
  return (
    <>
      <ModuleHeader title="Appointments" />
      <div style={{ padding: 16 }}>
        <div style={{
          background: "#f4fbfa", border: `0.5px solid ${BORDER}`,
          borderRadius: 6, padding: 12, marginBottom: 14,
        }}>
          <div style={{
            fontSize: 11, color: WF_MID, textTransform: "uppercase",
            letterSpacing: 0.5, marginBottom: 4,
          }}>Next appointment</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: TEAL }}>12 May 2026 · 10:30 AM</div>
          <div style={{ fontSize: 14, color: WF_MID }}>In-person — BC Children's Hospital</div>
        </div>
        <div style={{
          fontSize: 11, color: WF_MID, textTransform: "uppercase",
          letterSpacing: 0.5, marginBottom: 6,
        }}>Past appointments</div>
        {past.map((p) => (
          <div key={p[0]} style={{
            display: "flex", justifyContent: "space-between",
            padding: "8px 0", borderBottom: `0.5px solid ${BORDER}`, fontSize: 14,
          }}>
            <span style={{ color: WF_DARK }}>{p[0]}</span>
            <span style={{ color: WF_MID }}>{p[1]}</span>
            <span style={{ color: WF_MID }}>{p[2]}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ============ LABS ============

function LabsModule() {
  const notif = useNotif();
  const [tab, setTab] = useState<"upload" | "view">("upload");
  const goView = () => {
    setTab("view");
    notif.markAllSeen("labs");
  };
  return (
    <>
      <ModuleHeader title="Labs and test results" category="labs" />
      <TabRow>
        <TabPill active={tab === "upload"} onClick={() => setTab("upload")}>Upload results</TabPill>
        <TabPill active={tab === "view"} onClick={goView} dot={notif.state.labs.length > 0}>
          View results
        </TabPill>
      </TabRow>
      <div style={{ padding: "12px 16px 16px" }}>
        {tab === "upload" && (
          <>
            <div style={{
              border: `1.5px dashed ${BORDER}`, borderRadius: 8,
              padding: "32px 20px", textAlign: "center", marginBottom: 12,
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={WF_MID} strokeWidth="1.5" style={{ display: "inline-block" }}>
                <path d="M12 16V4M12 4l-5 5M12 4l5 5" />
                <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
              </svg>
              <div style={{ fontSize: 15, color: WF_DARK, marginBottom: 4, marginTop: 8 }}>
                Upload a test result
              </div>
              <div style={{ fontSize: 13, color: WF_MID, marginBottom: 8 }}>
                PDF, JPG or PNG · Max 10MB
              </div>
              <span style={{
                fontSize: 14, color: TEAL, textDecoration: "underline", cursor: "pointer",
              }}>Browse files</span>
            </div>
            <div style={{ fontSize: 13, color: WF_MID, fontStyle: "italic" }}>
              Uploaded results are visible to your care team.
            </div>
          </>
        )}
        {tab === "view" && (
          <div
            onClick={() => notif.markSeen("labs", "lab-1")}
            style={{
              padding: "12px 0", borderBottom: `0.5px solid ${BORDER}`, cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 15, color: WF_DARK }}>Lipid panel — Jan 14, 2025</span>
              {notif.state.labs.includes("lab-1") && <RedDot />}
            </div>
            <div style={{ fontSize: 12, color: WF_MID }}>Uploaded Jan 16, 2025</div>
          </div>
        )}
      </div>
    </>
  );
}

// ============ BOTTOM NAV ============

type TabKey = "dashboard" | "forms" | "tasks" | "recommendations" | "chat";

function NavIcon({ kind }: { kind: TabKey }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "dashboard":
      return <svg {...common}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>;
    case "forms":
      return <svg {...common}><rect x="6" y="3" width="12" height="18" rx="1.5" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>;
    case "tasks":
      return <svg {...common}><rect x="3" y="5" width="4" height="4" /><rect x="3" y="15" width="4" height="4" /><path d="M10 7h11M10 17h11" /></svg>;
    case "recommendations":
      return <svg {...common}><path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" /></svg>;
    case "chat":
      return null;
  }
}

function BottomNav({ active, onTab, chatEnabled }: {
  active: TabKey; onTab: (k: TabKey) => void; chatEnabled: boolean;
}) {
  const notif = useNotif();
  const tabs: { key: TabKey; label: string; dotCat?: Category }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "forms", label: "Forms", dotCat: "forms" },
    { key: "tasks", label: "Tasks", dotCat: "tasks" },
    { key: "recommendations", label: "Recommendations", dotCat: "recommendations" },
    ...(chatEnabled ? [{ key: "chat" as TabKey, label: "Chat" }] : []),
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, width: "100%",
      maxWidth: 480, margin: "0 auto", background: SURFACE,
      borderTop: `0.5px solid ${BORDER}`, height: 60, display: "flex", zIndex: 50,
    }}>
      {tabs.map((t) => {
        const isActive = active === t.key;
        const hasDot = t.key === "chat"
          ? notif.hasUnreadChat
          : t.dotCat ? notif.state[t.dotCat].length > 0 : false;
        return (
          <div
            key={t.key}
            onClick={() => onTab(t.key)}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 3,
              cursor: "pointer", position: "relative",
              color: isActive ? TEAL : WF_MID,
            }}
          >
            {isActive && (
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 2, background: TEAL,
              }} />
            )}
            {t.key === "chat"
              ? <MessageBubble hasMessages={notif.hasUnreadChat} size={20} />
              : <NavIcon kind={t.key} />}
            <div style={{ fontSize: 11, fontWeight: 500 }}>{t.label}</div>
            {hasDot && t.key !== "chat" && (
              <span style={{
                position: "absolute", top: 8, right: "calc(50% - 14px)",
                width: 7, height: 7, borderRadius: "50%", background: RED,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============ PATIENT CHAT PANEL ============

type ChatMsg = {
  id: string;
  from: "patient" | "clinician";
  text: string;
  time: string;
  status?: "delivered" | "failed";
};

type ChatThread = {
  id: string;
  name: string;
  role: string;
  initials: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  messages: ChatMsg[];
};

const INITIAL_THREADS: ChatThread[] = [
  {
    id: "reyes",
    name: "Dr. Sarah Reyes",
    role: "Pediatric Endocrinologist",
    initials: "SR",
    preview: "Your glucose levels look stable this week.",
    timestamp: "Today, 9:41 AM",
    unread: true,
    messages: [
      { id: "m1", from: "clinician", text: "Your glucose levels look stable this week.", time: "Today, 9:41 AM" },
      { id: "m2", from: "patient", text: "Thanks! I had a few highs after dinner on Wednesday.", time: "Today, 9:45 AM", status: "delivered" },
      { id: "m3", from: "clinician", text: "That can happen. Try to log what you ate so we can review it at your next visit.", time: "Today, 9:47 AM" },
    ],
  },
  {
    id: "tran",
    name: "Dr. Michael Tran",
    role: "Diabetes Nurse Educator",
    initials: "MT",
    preview: "Remember to log your meals before your next appointment.",
    timestamp: "Yesterday",
    unread: false,
    messages: [
      { id: "m1", from: "clinician", text: "Remember to log your meals before your next appointment.", time: "Yesterday, 2:15 PM" },
    ],
  },
];

function PatientChatPanel({ onClose }: { onClose: () => void }) {
  const notif = useNotif();
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const openThread = (id: string) => {
    setOpenId(id);
    setThreads((ts) => {
      const next = ts.map((t) => t.id === id ? { ...t, unread: false } : t);
      if (!next.some((t) => t.unread)) notif.setHasUnreadChat(false);
      return next;
    });
  };

  const sendMessage = () => {
    if (!draft.trim() || !openId) return;
    const newMsg: ChatMsg = {
      id: `m-${Date.now()}`,
      from: "patient",
      text: draft.trim(),
      time: "Now",
      status: "delivered",
    };
    setThreads((ts) => ts.map((t) =>
      t.id === openId ? { ...t, messages: [...t.messages, newMsg] } : t
    ));
    setDraft("");
  };

  const retry = (threadId: string, msgId: string) => {
    setTimeout(() => {
      setThreads((ts) => ts.map((t) =>
        t.id === threadId
          ? { ...t, messages: t.messages.map((m) => m.id === msgId ? { ...m, status: "delivered" } : m) }
          : t
      ));
    }, 800);
  };

  const openThreadObj = threads.find((t) => t.id === openId) || null;

  const FAIL_RED = "#EF4444";

  return (
    <div style={{
      position: "fixed", inset: 0, background: WF_BG, zIndex: 200,
      display: "flex", flexDirection: "column",
      maxWidth: 480, margin: "0 auto",
      fontFamily: '"Urbanist", system-ui, -apple-system, Segoe UI, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        position: "sticky", top: 0, background: SURFACE,
        borderBottom: `1px solid ${BORDER}`, height: 56,
        display: "flex", alignItems: "center", padding: "0 12px", gap: 8,
      }}>
        <button
          onClick={() => openThreadObj ? setOpenId(null) : onClose()}
          style={{
            background: "none", border: "none", fontSize: 22, color: WF_DARK,
            cursor: "pointer", padding: "4px 8px", fontFamily: "inherit",
          }}
        >←</button>
        <div style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: 600, color: WF_DARK }}>
          {openThreadObj ? openThreadObj.name : "Messages"}
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* Body */}
      {!openThreadObj ? (
        <div style={{ flex: 1, overflowY: "auto" }}>
          {threads.map((t) => (
            <div
              key={t.id}
              onClick={() => openThread(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 16px", background: SURFACE,
                borderBottom: `0.5px solid ${BORDER}`, cursor: "pointer",
              }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: t.unread ? TEAL : "transparent", flexShrink: 0,
              }} />
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: TEAL,
                color: "#fff", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0,
              }}>{t.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: WF_DARK }}>{t.name}</div>
                <div style={{ fontSize: 12, color: WF_MID, marginBottom: 2 }}>{t.role}</div>
                <div style={{
                  fontSize: 13, color: WF_MID, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{t.preview}</div>
              </div>
              <div style={{ fontSize: 11, color: WF_MID, flexShrink: 0, alignSelf: "flex-start" }}>
                {t.timestamp}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {openThreadObj.messages.map((m) => {
              const isPatient = m.from === "patient";
              return (
                <div key={m.id} style={{
                  display: "flex", flexDirection: "column",
                  alignItems: isPatient ? "flex-end" : "flex-start",
                  marginBottom: 14,
                }}>
                  <div style={{
                    maxWidth: "78%", padding: "10px 14px", borderRadius: 14,
                    background: isPatient ? TEAL : SURFACE,
                    color: isPatient ? "#fff" : WF_DARK,
                    border: isPatient ? "none" : `1px solid ${BORDER}`,
                    fontSize: 15, lineHeight: 1.4, wordBreak: "break-word",
                  }}>{m.text}</div>
                  <div style={{ fontSize: 11, color: WF_MID, marginTop: 4 }}>{m.time}</div>
                  {isPatient && m.status === "delivered" && (
                    <div style={{ fontSize: 11, color: WF_MID, marginTop: 2 }}>Delivered</div>
                  )}
                  {isPatient && m.status === "failed" && (
                    <div style={{ fontSize: 11, color: FAIL_RED, marginTop: 2 }}>
                      Failed ·{" "}
                      <span
                        onClick={() => retry(openThreadObj.id, m.id)}
                        style={{ textDecoration: "underline", cursor: "pointer" }}
                      >Retry</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{
            borderTop: `1px solid ${BORDER}`, background: SURFACE,
            padding: "10px 12px", display: "flex", gap: 8, alignItems: "center",
          }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Type a message…"
              style={{
                flex: 1, border: `1px solid ${BORDER}`, borderRadius: 20,
                padding: "9px 14px", fontSize: 15, fontFamily: "inherit",
                outline: "none", color: WF_DARK, background: SURFACE,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!draft.trim()}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                background: draft.trim() ? TEAL : BORDER,
                border: "none", color: "#fff",
                cursor: draft.trim() ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ============ ROOT ============

function PatientDashboard() {
  const { config } = usePlatformConfig();
  const chatEnabled = config.chatEnabled;
  const [state, setState] = useState<NotifState>({
    forms: ["form-1"],
    tasks: ["task-1"],
    recommendations: ["rec-1"],
    resources: ["res-1"],
    labs: ["lab-1"],
  });
  const markSeen = (cat: Category, id: string) =>
    setState((s) => ({ ...s, [cat]: s[cat].filter((x) => x !== id) }));
  const markAllSeen = (cat: Category) =>
    setState((s) => ({ ...s, [cat]: [] }));

  const [hasUnreadChat, setHasUnreadChat] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  const ctx = useMemo<NotifCtx>(
    () => ({ state, markSeen, markAllSeen, hasUnreadChat, setHasUnreadChat }),
    [state, hasUnreadChat],
  );

  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const refs = {
    glucose: useRef<HTMLDivElement>(null),
    insulin: useRef<HTMLDivElement>(null),
    forms: useRef<HTMLDivElement>(null),
    tasks: useRef<HTMLDivElement>(null),
    recommendations: useRef<HTMLDivElement>(null),
    resources: useRef<HTMLDivElement>(null),
    appointments: useRef<HTMLDivElement>(null),
    labs: useRef<HTMLDivElement>(null),
  };

  const scrollTo = (k: keyof typeof refs) => {
    refs[k].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onTab = (k: TabKey) => {
    setActiveTab(k);
    if (k === "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (k === "forms") {
      scrollTo("forms");
      markAllSeen("forms");
    } else if (k === "tasks") {
      scrollTo("tasks");
      markAllSeen("tasks");
    } else if (k === "recommendations") {
      scrollTo("recommendations");
      markAllSeen("recommendations");
    } else if (k === "chat") {
      setChatOpen((v) => !v);
    }
  };

  return (
    <NotificationContext.Provider value={ctx}>
      <div style={{
        minHeight: "100vh", background: WF_BG,
        fontFamily: '"Urbanist", system-ui, -apple-system, Segoe UI, sans-serif',
        color: WF_DARK,
      }}>
        <div style={{
          maxWidth: 480, margin: "0 auto", paddingBottom: 76, position: "relative",
        }}>
          {/* Top bar */}
          <div style={{
            position: "sticky", top: 0, zIndex: 40, height: 56,
            background: SURFACE, borderBottom: `0.5px solid ${BORDER}`,
            padding: "0 16px", display: "flex", alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: TEAL,
              color: "#fff", fontSize: 13, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>EC</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: WF_DARK }}>
              Welcome, Emma!
            </div>
            <Link
              to="/dashboard/$patientId/profile"
              params={{ patientId: "sarah-chen" }}
              style={{
                fontSize: 14, color: TEAL, fontWeight: 500, textDecoration: "none",
              }}
            >Care profile</Link>
          </div>

          {(config.flags.lowTIR.patient || config.flags.gmi.patient) && (
            <div style={{
              display: "flex", gap: 8, padding: "8px 16px", background: SURFACE,
              borderBottom: `0.5px solid ${BORDER}`,
            }}>
              {config.flags.lowTIR.patient && (
                <span style={{
                  fontSize: 12, fontWeight: 600, color: "#b45309",
                  background: "#fef3c7", padding: "3px 10px", borderRadius: 999,
                }}>
                  Low TIR
                </span>
              )}
              {config.flags.gmi.patient && (
                <span style={{
                  fontSize: 12, fontWeight: 600, color: "#7c3aed",
                  background: "#ede9fe", padding: "3px 10px", borderRadius: 999,
                }}>
                  High GMI
                </span>
              )}
            </div>
          )}

          {/* Modules */}
          <div style={{ padding: 16 }}>
            <div ref={refs.glucose} style={CARD}><GlucoseModule /></div>
            <div ref={refs.insulin} style={CARD}><InsulinModule /></div>
            <div ref={refs.forms} style={CARD}><FormsModule /></div>
            <div ref={refs.tasks} style={CARD}><TasksModule /></div>
            <div ref={refs.recommendations} style={CARD}><RecommendationsModule /></div>
            <div ref={refs.resources} style={CARD}><ResourcesModule /></div>
            <div ref={refs.appointments} style={CARD}><AppointmentsModule /></div>
            <div ref={refs.labs} style={CARD}><LabsModule /></div>
          </div>
        </div>
        <BottomNav active={activeTab} onTab={onTab} />
        {chatEnabled && chatOpen && <PatientChatPanel onClose={() => setChatOpen(false)} />}
      </div>
    </NotificationContext.Provider>
  );
}
