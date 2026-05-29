import { useEffect, useMemo, useRef, useState } from "react";
import { useBlocker } from "@tanstack/react-router";
import { Btn, Modal, TextLink } from "./patient-ui";
import { WF_DARK, WF_MID } from "./wireframe";

// ---------- Save draft footer button + inline "Draft saved" flash ----------

export function SaveDraftButton({
  onSave,
  flash,
}: {
  onSave: () => void;
  flash: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button
        onClick={onSave}
        style={{
          fontSize: 13,
          color: WF_DARK,
          background: "none",
          border: "none",
          padding: "6px 10px",
          cursor: "pointer",
          fontFamily: "inherit",
          fontWeight: 500,
          textDecoration: "underline",
        }}
      >
        Save draft
      </button>
      <span
        aria-live="polite"
        style={{
          fontSize: 12,
          color: WF_MID,
          opacity: flash ? 1 : 0,
          transition: "opacity 300ms ease",
          pointerEvents: "none",
        }}
      >
        Draft saved
      </span>
    </div>
  );
}

// ---------- Hook: track dirty state, persist, intercept nav away ----------

export function useDraftPersistence<T>(args: {
  current: T;
  scopePrefix: string;          // e.g. "/admin/patients/new"
  persist: (v: T) => void;      // save to localStorage
  onLeaveDiscard?: () => void;  // optional: clear session working state
}) {
  const { current, scopePrefix, persist, onLeaveDiscard } = args;
  const [baseline, setBaseline] = useState<T>(current);
  const [flash, setFlash] = useState(false);
  const dirtyRef = useRef(false);

  const dirty = useMemo(
    () => JSON.stringify(current) !== JSON.stringify(baseline),
    [current, baseline],
  );
  useEffect(() => { dirtyRef.current = dirty; }, [dirty]);

  const save = () => {
    persist(current);
    setBaseline(current);
    dirtyRef.current = false;
    setFlash(true);
    window.setTimeout(() => setFlash(false), 2000);
  };

  // Allow callers (e.g. Cancel confirm) to bypass the blocker for the
  // next navigation without waiting for React to flush state.
  const markClean = () => {
    setBaseline(current);
    dirtyRef.current = false;
  };

  const blocker = useBlocker({
    shouldBlockFn: ({ next }) =>
      dirtyRef.current && !next.pathname.startsWith(scopePrefix),
    withResolver: true,
    enableBeforeUnload: () => dirtyRef.current,
  });

  // Reset flash on unmount
  useEffect(() => () => setFlash(false), []);

  const modal =
    blocker.status === "blocked" ? (
      <Modal open title="You have unsaved changes" onClose={() => blocker.reset()}>
        <p style={{ fontSize: 13, color: WF_DARK, margin: "0 0 20px", lineHeight: 1.5 }}>
          Save a draft before leaving? You can resume this profile later from
          where you left off.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <TextLink onClick={() => blocker.reset()}>Keep editing</TextLink>
          <Btn
            onClick={() => {
              onLeaveDiscard?.();
              blocker.proceed();
            }}
          >
            Leave without saving
          </Btn>
          <Btn
            primary
            onClick={() => {
              persist(current);
              setBaseline(current);
              blocker.proceed();
            }}
          >
            Save draft and leave
          </Btn>
        </div>
      </Modal>
    ) : null;

  return { save, flash, dirty, modal, markClean };
}

// ---------- Resume-draft banner shown on the initial form ----------

export function ResumeDraftBanner({
  message,
  onResume,
  onStartFresh,
}: {
  message: string;
  onResume: () => void;
  onStartFresh: () => void;
}) {
  return (
    <div
      style={{
        border: `1px solid ${WF_DARK}`,
        background: "#fff",
        padding: "12px 16px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontSize: 13, color: WF_DARK }}>{message}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <TextLink onClick={onResume}>Resume draft →</TextLink>
        <TextLink onClick={onStartFresh}>Start fresh</TextLink>
      </div>
    </div>
  );
}
