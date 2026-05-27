import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Select } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

export const Route = createFileRoute("/admin/platform")({
  component: PlatformConfig,
});

const DEFAULT_MSG =
  "Our team reviews messages during clinic hours, Monday–Friday 9am–5pm. For urgent concerns, please contact the clinic directly.";

function PlatformConfig() {
  return (
    <AdminShell heading="">
      <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, margin: "0 0 24px 0" }}>
        Platform configuration
      </h1>

      <SectionCard title="Chat">
        <ChatSection />
      </SectionCard>

      <SectionCard title="Notifications">
        <NotificationsSection />
      </SectionCard>

      <SectionCard title="Patient roster defaults">
        <RosterSection />
      </SectionCard>

      <PrototypeBack to="/admin" />
    </AdminShell>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, marginBottom: 20 }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${WF_MID}`, fontSize: 14, fontWeight: 600, color: WF_DARK }}>
        {title}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

function SettingRow({
  label,
  helper,
  control,
  stack,
}: {
  label: string;
  helper?: ReactNode;
  control: ReactNode;
  stack?: boolean;
}) {
  if (stack) {
    return (
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 13, color: WF_DARK, marginBottom: 4 }}>{label}</div>
        {helper && <div style={{ fontSize: 12, color: WF_MID, marginBottom: 10, lineHeight: 1.5 }}>{helper}</div>}
        {control}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
      <div style={{ flex: 1, paddingRight: 16 }}>
        <div style={{ fontSize: 13, color: WF_DARK, marginBottom: 4 }}>{label}</div>
        {helper && <div style={{ fontSize: 12, color: WF_MID, lineHeight: 1.5 }}>{helper}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{
        width: 44,
        height: 24,
        border: `1px solid ${WF_DARK}`,
        background: on ? WF_DARK : "#fff",
        borderRadius: 999,
        position: "relative",
        cursor: "pointer",
        padding: 0,
      }}
      aria-pressed={on}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 22 : 2,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: on ? "#fff" : WF_DARK,
          transition: "left 0.15s ease",
        }}
      />
    </button>
  );
}

function SavedFlash({ visible }: { visible: boolean }) {
  return (
    <span
      style={{
        fontSize: 12,
        color: WF_MID,
        fontStyle: "italic",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      Saved
    </span>
  );
}

function useFlash() {
  const [visible, setVisible] = useState(false);
  const t = useRef<number | null>(null);
  function flash() {
    setVisible(true);
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setVisible(false), 2000);
  }
  useEffect(() => () => { if (t.current) window.clearTimeout(t.current); }, []);
  return [visible, flash] as const;
}

function ChatSection() {
  const [enabled, setEnabled] = useState(true);
  const [enabledFlash, flashEnabled] = useFlash();

  const [msg, setMsg] = useState(DEFAULT_MSG);
  const [savedMsg, setSavedMsg] = useState(DEFAULT_MSG);
  const [msgFlash, flashMsg] = useFlash();
  const dirty = msg !== savedMsg;

  return (
    <>
      <SettingRow
        label="Enable chat"
        helper="When disabled, the chat icon is hidden from all users in this clinic."
        control={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SavedFlash visible={enabledFlash} />
            <Toggle on={enabled} onChange={(v) => { setEnabled(v); flashEnabled(); }} />
          </div>
        }
      />

      <div
        style={{
          maxHeight: enabled ? 400 : 0,
          opacity: enabled ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease, opacity 0.2s ease",
          marginTop: enabled ? 24 : 0,
          borderTop: enabled ? `1px solid #F5F5F5` : "none",
          paddingTop: enabled ? 20 : 0,
        }}
      >
        <SettingRow
          stack
          label="Persistent chat message"
          helper="This message is shown to patients when they open chat. It cannot be a clinical guarantee."
          control={
            <div>
              <textarea
                value={msg}
                maxLength={160}
                onChange={(e) => setMsg(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1px solid ${WF_MID}`,
                  background: "#fff",
                  fontSize: 13,
                  color: WF_DARK,
                  fontFamily: "inherit",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                <span style={{ fontSize: 11, color: WF_MID }}>{msg.length} / 160</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <SavedFlash visible={msgFlash} />
                  {dirty && (
                    <Btn small primary onClick={() => { setSavedMsg(msg); flashMsg(); }}>Save</Btn>
                  )}
                </div>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
}

function NotificationsSection() {
  const [decline, setDecline] = useState(false);
  const [declineFlash, flashDecline] = useFlash();

  return (
    <>
      <SettingRow
        label="Notify clinician when patient declines a recommendation"
        helper="When enabled, the assigned clinician is notified when a patient declines a recommendation and provides a reason. Disable this if your clinic does not have capacity to follow up."
        control={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SavedFlash visible={declineFlash} />
            <Toggle on={decline} onChange={(v) => { setDecline(v); flashDecline(); }} />
          </div>
        }
      />

      <div style={{ borderTop: `1px solid #F5F5F5`, marginTop: 20, paddingTop: 20 }}>
        <SettingRow
          label="Clinic notification email"
          helper={
            <>
              This is set under Clinic information.{" "}
              <Link to="/admin" style={{ color: WF_DARK, textDecoration: "underline" }}>
                Go to Clinic information →
              </Link>
            </>
          }
          control={
            <div style={{ fontSize: 13, color: WF_MID, fontStyle: "italic" }}>
              notifications@sunriseclinic.ca
            </div>
          }
        />
      </div>
    </>
  );
}

const SORT_OPTIONS = ["At-risk first", "Longest unseen", "Soonest appointment", "Alphabetical (A–Z)"];

function RosterSection() {
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [saved, setSaved] = useState(SORT_OPTIONS[0]);
  const [flash, doFlash] = useFlash();
  const dirty = sort !== saved;

  return (
    <SettingRow
      stack
      label="Default sort order for the clinician's patient roster"
      helper="Clinicians can override this per session without changing this clinic-wide default."
      control={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ maxWidth: 300, flex: 1 }}>
            <Select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </Select>
          </div>
          <SavedFlash visible={flash} />
          {dirty && <Btn small primary onClick={() => { setSaved(sort); doFlash(); }}>Save</Btn>}
        </div>
      }
    />
  );
}
