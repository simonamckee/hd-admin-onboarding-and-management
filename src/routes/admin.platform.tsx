import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Select } from "@/components/patient-ui";
import { WF_DARK, WF_MID, WF_BG, BORDER, SUCCESS_TEXT, TEAL } from "@/components/wireframe";

export const Route = createFileRoute("/admin/platform")({
  component: PlatformConfig,
});

const SORT_OPTIONS = ["At-risk first", "Longest unseen", "Soonest appointment", "Alphabetical (A–Z)"];
const DEFAULT_CHAT_MSG =
  "Our team reviews messages during clinic hours, Monday–Friday 9am–5pm. For urgent concerns, please contact the clinic directly.";

function PlatformConfig() {
  return (
    <AdminShell heading="">
      <h1 style={{ fontSize: 24, fontWeight: 700, color: TEAL, margin: "0 0 24px" }}>
        Platform configuration
      </h1>

      <ChatSection />
      <Divider />
      <NotificationsSection />
      <Divider />
      <RosterSection />

      <PrototypeBack to="/admin" />
    </AdminShell>
  );
}

function Divider() {
  return <div style={{ height: 1, background: WF_MID, opacity: 0.6, margin: "20px 0" }} />;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}66`, padding: 24, borderRadius: 8 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: WF_DARK, margin: "0 0 18px" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, padding: "14px 0" }}>
      {children}
    </div>
  );
}

function LabelBlock({ label, helper }: { label: string; helper?: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 15, color: WF_DARK, fontWeight: 500 }}>{label}</div>
      {helper && <div style={{ fontSize: 14, color: WF_MID, marginTop: 4, lineHeight: 1.5 }}>{helper}</div>}
    </div>
  );
}

function useFade(active: boolean, ms = 2000) {
  const [show, setShow] = useState(active);
  useEffect(() => {
    if (!active) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), ms);
    return () => clearTimeout(t);
  }, [active, ms]);
  return show;
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      style={{
        width: 40,
        height: 22,
        border: "none",
        background: on ? TEAL : BORDER,
        position: "relative",
        cursor: "pointer",
        padding: 0,
        borderRadius: 999,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 20 : 2,
          width: 18,
          height: 18,
          background: "#fff",
          borderRadius: "50%",
          transition: "left 120ms",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

function SavedFlash({ when }: { when: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (when === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, [when]);
  return (
    <span
      style={{
        fontSize: 14,
        color: WF_DARK,
        fontStyle: "italic",
        opacity: visible ? 1 : 0,
        transition: "opacity 200ms",
        marginLeft: 12,
        whiteSpace: "nowrap",
      }}
    >
      ✓ Saved
    </span>
  );
}

/* ----------------- Chat ----------------- */

function ChatSection() {
  const [enabled, setEnabled] = useState(true);
  const [savedEnabledAt, setSavedEnabledAt] = useState(0);

  const [msg, setMsg] = useState(DEFAULT_CHAT_MSG);
  const initial = useRef(DEFAULT_CHAT_MSG);
  const [savedMsgAt, setSavedMsgAt] = useState(0);
  const dirty = msg !== initial.current;

  return (
    <SectionCard title="Chat">
      <Row>
        <LabelBlock
          label="Enable chat"
          helper="When disabled, the chat icon is hidden from all users in this clinic."
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <SavedFlash when={savedEnabledAt} />
          <Toggle
            on={enabled}
            onClick={() => {
              setEnabled((v) => !v);
              setSavedEnabledAt(Date.now());
            }}
          />
        </div>
      </Row>

      <div
        style={{
          maxHeight: enabled ? 400 : 0,
          opacity: enabled ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 200ms ease, opacity 200ms ease",
        }}
      >
        <div style={{ borderTop: `0.5px solid ${WF_MID}`, paddingTop: 14, marginTop: 6 }}>
          <LabelBlock
            label="Persistent chat message"
            helper="This message is shown to patients when they open chat. It cannot be a clinical guarantee."
          />
          <textarea
            value={msg}
            maxLength={160}
            onChange={(e) => setMsg(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              marginTop: 10,
              padding: "8px 12px",
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              background: WF_BG,
              fontSize: 16,
              color: WF_DARK,
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            <span style={{ fontSize: 13, color: WF_MID }}>{msg.length} / 160</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SavedFlash when={savedMsgAt} />
              {dirty && (
                <Btn
                  primary
                  onClick={() => {
                    initial.current = msg;
                    setSavedMsgAt(Date.now());
                  }}
                >
                  Save
                </Btn>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* ----------------- Notifications ----------------- */

function NotificationsSection() {
  const [notify, setNotify] = useState(false);
  const [savedAt, setSavedAt] = useState(0);

  return (
    <SectionCard title="Notifications">
      <Row>
        <LabelBlock
          label="Notify clinician when patient declines a recommendation"
          helper="When enabled, the assigned clinician is notified when a patient declines a recommendation and provides a reason. Disable this if your clinic does not have capacity to follow up."
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <SavedFlash when={savedAt} />
          <Toggle
            on={notify}
            onClick={() => {
              setNotify((v) => !v);
              setSavedAt(Date.now());
            }}
          />
        </div>
      </Row>

      <div style={{ borderTop: `0.5px solid ${WF_MID}` }} />

      <Row>
        <LabelBlock label="Clinic notification email" />
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 15, color: WF_DARK }}>notifications@sunriseclinic.ca</div>
          <div style={{ fontSize: 13, color: WF_MID, marginTop: 4 }}>
            This is set under Clinic information.{" "}
            <Link
              to="/admin"
              style={{ color: WF_DARK, textDecoration: "underline" }}
            >
              Go to Clinic information →
            </Link>
          </div>
        </div>
      </Row>
    </SectionCard>
  );
}

/* ----------------- Roster ----------------- */

function RosterSection() {
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const initial = useRef(SORT_OPTIONS[0]);
  const [savedAt, setSavedAt] = useState(0);
  const dirty = sort !== initial.current;

  return (
    <SectionCard title="Patient roster defaults">
      <div style={{ paddingTop: 6 }}>
        <LabelBlock
          label="Default sort order for the clinician's patient roster"
          helper="Clinicians can override this per session without changing this clinic-wide default."
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
          <div style={{ maxWidth: 300, flex: 1 }}>
            <Select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
          </div>
          <SavedFlash when={savedAt} />
          {dirty && (
            <Btn
              primary
              onClick={() => {
                initial.current = sort;
                setSavedAt(Date.now());
              }}
            >
              Save
            </Btn>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
