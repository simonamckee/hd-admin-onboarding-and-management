import { Link } from "@tanstack/react-router";
import type { ReactNode, CSSProperties } from "react";
import { WF_DARK, WF_MID } from "./wireframe";

// ---------- Shared patient-section UI primitives (greyscale) ----------

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
  const style: CSSProperties = {
    display: "inline-block",
    padding: small ? "6px 12px" : "10px 18px",
    fontSize: small ? 12 : 13,
    border: `1px solid ${disabled ? WF_MID : WF_DARK}`,
    background: primary && !disabled ? WF_DARK : "#fff",
    color: primary && !disabled ? "#fff" : disabled ? WF_MID : WF_DARK,
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    width: full ? "100%" : "auto",
    textAlign: "center",
    borderWidth: danger ? 1 : 1,
  };
  if (disabled) return <button style={style} disabled>{children}</button>;
  if (to) return <Link to={to} style={style}>{children}</Link>;
  return <button style={style} onClick={onClick}>{children}</button>;
}

export function TextLink({ children, onClick, to }: { children: ReactNode; onClick?: () => void; to?: string }) {
  const style: CSSProperties = {
    fontSize: 13,
    color: WF_DARK,
    textDecoration: "underline",
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
      <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 4 }}>
        {label}
        {required && <span style={{ color: WF_DARK }}> *</span>}
      </div>
      {children}
      {helper && !error && (
        <div style={{ fontSize: 11, color: WF_MID, marginTop: 4 }}>{helper}</div>
      )}
      {error && (
        <div style={{ fontSize: 11, color: WF_DARK, marginTop: 4, fontWeight: 500 }}>
          {error}
        </div>
      )}
    </div>
  );
}

const inputBase: CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: `1px solid ${WF_MID}`,
  background: "#fff",
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
      style={{
        ...inputBase,
        border: `${errored ? 2 : 1}px solid ${errored ? WF_DARK : WF_MID}`,
        ...style,
      }}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...inputBase, ...(props.style || {}) }} />;
}

export function Pill({ label, weight }: { label: string; weight: "dark" | "mid" | "light" }) {
  const styles: Record<string, CSSProperties> = {
    dark: { background: WF_DARK, color: "#fff", border: `1px solid ${WF_DARK}` },
    mid: { background: "#E0E0E0", color: WF_DARK, border: `1px solid ${WF_MID}` },
    light: { background: "#fff", color: WF_DARK, border: `1px solid ${WF_MID}` },
  };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 11,
        ...styles[weight],
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
        background: "#fff",
        border: `1px solid ${WF_MID}`,
        borderRadius: 8,
        padding: 20,
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
  const border = weight === "dark" ? 2 : weight === "mid" ? 1 : 1;
  const opacity = weight === "light" ? 0.6 : 1;
  return (
    <div
      style={{
        border: `${border}px ${weight === "light" ? "dashed" : "solid"} ${WF_DARK}`,
        background: "#fff",
        padding: "12px 16px",
        fontSize: 13,
        color: WF_DARK,
        marginBottom: 20,
        opacity,
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
        border: `1px solid ${WF_MID}`,
        background: "#F5F5F5",
        padding: "10px 14px",
        fontSize: 12,
        color: WF_DARK,
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
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: `1px solid ${active || done ? WF_DARK : WF_MID}`,
                  background: active ? WF_DARK : "#fff",
                  color: active ? "#fff" : done ? WF_DARK : WF_MID,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {done ? "✓" : n}
              </div>
              <span style={{ fontSize: 12, color: active || done ? WF_DARK : WF_MID }}>
                {label}
              </span>
            </div>
            {n < 4 && (
              <div style={{ width: 24, height: 1, background: WF_MID }} />
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
      <div style={{ borderTop: `1px solid ${WF_MID}`, paddingTop: 16 }}>
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
        background: "rgba(0,0,0,0.4)",
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
          background: "#fff",
          border: `1px solid ${WF_DARK}`,
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
