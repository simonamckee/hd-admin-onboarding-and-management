import { Link } from "@tanstack/react-router";
import type { ReactNode, CSSProperties } from "react";
import {
  WF_DARK, WF_MID, WF_BG, TEAL, BORDER, SURFACE, HOVER, TINT,
  SUCCESS_TEXT, SUCCESS_BG, WARN_TEXT, WARN_BG, ERROR_TEXT, ERROR_BG,
} from "./wireframe";

// ---------- Shared patient-section UI primitives ----------

export function Btn({
  children,
  primary,
  disabled,
  onClick,
  to,
  full,
  small,
  danger,
}: {
  children: ReactNode;
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  to?: string;
  full?: boolean;
  small?: boolean;
  danger?: boolean;
}) {
  const base: CSSProperties = {
    display: "inline-block",
    padding: small ? "6px 12px" : "10px 18px",
    fontSize: small ? 12 : 13,
    fontWeight: 500,
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    width: full ? "100%" : "auto",
    textAlign: "center",
  };

  let style: CSSProperties;
  if (disabled) {
    style = {
      ...base,
      background: BORDER,
      color: "#fff",
      border: `1.5px solid ${BORDER}`,
      opacity: 0.6,
    };
  } else if (danger) {
    style = {
      ...base,
      background: "transparent",
      color: ERROR_TEXT,
      border: `1.5px solid ${ERROR_TEXT}`,
    };
  } else if (primary) {
    style = {
      ...base,
      background: TEAL,
      color: "#fff",
      border: `1.5px solid ${TEAL}`,
    };
  } else {
    style = {
      ...base,
      background: "transparent",
      color: TEAL,
      border: `1.5px solid ${TEAL}`,
    };
  }
  if (disabled) return <button style={style} disabled>{children}</button>;
  if (to) return <Link to={to} style={style}>{children}</Link>;
  return <button style={style} onClick={onClick}>{children}</button>;
}

export function TextLink({ children, onClick, to }: { children: ReactNode; onClick?: () => void; to?: string }) {
  const style: CSSProperties = {
    fontSize: 13,
    color: TEAL,
    fontWeight: 500,
    textDecoration: "none",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    fontFamily: "inherit",
  };
  if (to) return <Link to={to} style={style}>{children}</Link>;
  return <button style={style} onClick={onClick}>{children}</button>;
}

export function Field({
  label,
  required,
  helper,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  helper?: string;
  error?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 4, fontWeight: 500 }}>
        {label}
        {required && <span style={{ color: ERROR_TEXT }}> *</span>}
      </div>
      {children}
      {helper && !error && (
        <div style={{ fontSize: 11, color: WF_MID, marginTop: 4 }}>{helper}</div>
      )}
      {error && (
        <div style={{ fontSize: 11, color: ERROR_TEXT, marginTop: 4, fontWeight: 500 }}>
          {error}
        </div>
      )}
    </div>
  );
}

const inputBase: CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: `1.5px solid ${BORDER}`,
  borderRadius: 8,
  background: SURFACE,
  fontSize: 13,
  color: WF_DARK,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { errored?: boolean }) {
  const { errored, style, ...rest } = props;
  return (
    <input
      {...rest}
      className={`hb-input${errored ? " hb-input--error" : ""}`}
      style={{
        ...inputBase,
        border: errored ? `1.5px solid ${ERROR_TEXT}` : `1.5px solid ${BORDER}`,
        background: errored ? ERROR_BG : SURFACE,
        ...style,
      }}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className="hb-input" style={{ ...inputBase, ...(props.style || {}) }} />;
}

type PillWeight = "dark" | "mid" | "light";

export function Pill({ label, weight }: { label: string; weight: PillWeight }) {
  // Map by label first for semantic accuracy; fall back to weight.
  const l = label.toLowerCase();
  let bg: string;
  let fg: string;
  if (l === "active") { bg = SUCCESS_BG; fg = SUCCESS_TEXT; }
  else if (l === "invited" || l === "pending") { bg = WARN_BG; fg = WARN_TEXT; }
  else if (l === "expired") { bg = ERROR_BG; fg = ERROR_TEXT; }
  else if (l === "archived") { bg = WF_BG; fg = BORDER; }
  else if (l === "not yet invited") { bg = WF_BG; fg = WF_MID; }
  else {
    // Fallback to weight
    if (weight === "dark") { bg = SUCCESS_BG; fg = SUCCESS_TEXT; }
    else if (weight === "mid") { bg = WARN_BG; fg = WARN_TEXT; }
    else { bg = WF_BG; fg = WF_MID; }
  }
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 500,
        background: bg,
        color: fg,
      }}
    >
      {label}
    </span>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}66`,
        borderRadius: 8,
        padding: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Banner({
  weight,
  children,
}: {
  weight: "dark" | "mid" | "light";
  children: ReactNode;
}) {
  let bg: string; let fg: string;
  if (weight === "mid") { bg = WARN_BG; fg = WARN_TEXT; }
  else if (weight === "light") { bg = HOVER; fg = TEAL; }
  else { bg = TINT; fg = TEAL; }
  return (
    <div
      style={{
        border: `1px solid ${fg}4D`,
        borderRadius: 8,
        background: bg,
        padding: "12px 16px",
        fontSize: 13,
        color: fg,
        marginBottom: 20,
      }}
    >
      {children}
    </div>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: `1px solid ${TEAL}4D`,
        borderRadius: 8,
        background: TINT,
        padding: "10px 14px",
        fontSize: 12,
        color: TEAL,
        lineHeight: 1.5,
        marginBottom: 20,
      }}
    >
      {children}
    </div>
  );
}

export function StepIndicator({
  step,
}: {
  step: 1 | 2 | 3 | 4;
}) {
  const steps = ["Patient information", "Add supporters", "Review", "Done"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        const filled = active || done;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: filled ? TEAL : BORDER,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {done ? "✓" : n}
              </div>
              <span style={{ fontSize: 12, color: filled ? WF_DARK : WF_MID, fontWeight: filled ? 500 : 400 }}>
                {label}
              </span>
            </div>
            {n < 4 && (
              <div style={{ width: 24, height: 1, background: BORDER }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DangerDivider() {
  return (
    <div style={{ marginTop: 48 }}>
      <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
        <div style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
          Danger zone
        </div>
      </div>
    </div>
  );
}

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,26,26,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}66`,
          borderRadius: 8,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          padding: 24,
          maxWidth: 440,
          width: "100%",
        }}
      >
        <div style={{ fontSize: 15, color: WF_DARK, marginBottom: 16, fontWeight: 600 }}>
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}
