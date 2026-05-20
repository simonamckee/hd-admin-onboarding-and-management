import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const WF_BG = "#F5F5F5";
export const WF_LIGHT = "#F5F5F5";
export const WF_MID = "#9E9E9E";
export const WF_DARK = "#333333";

export function TopBar() {
  return (
    <div
      style={{
        background: WF_DARK,
        color: "#fff",
        padding: "12px 20px",
        fontSize: 14,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      Haibu Diabetes
    </div>
  );
}

export function Page({ children, noCard = false }: { children: ReactNode; noCard?: boolean }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: WF_BG,
        fontFamily: "Inter, system-ui, sans-serif",
        color: WF_DARK,
      }}
    >
      <TopBar />
      {noCard ? (
        children
      ) : (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px 16px" }}>
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              background: "#fff",
              border: `1px solid ${WF_MID}`,
              padding: 28,
              boxSizing: "border-box",
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function StepBar({ states }: { states: Array<"done" | "active" | "inactive"> }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
      {states.map((s, i) => (
        <div
          key={i}
          style={{
            width: 24,
            height: 4,
            background: s === "inactive" ? WF_LIGHT : WF_DARK,
            border: s === "inactive" ? `1px solid ${WF_MID}` : "none",
          }}
        />
      ))}
    </div>
  );
}

export function H({ children, size = 22 }: { children: ReactNode; size?: number }) {
  return (
    <h1 style={{ fontSize: size, color: WF_DARK, margin: "0 0 12px 0", fontWeight: 600 }}>
      {children}
    </h1>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: 14, color: WF_MID, margin: "0 0 20px 0", lineHeight: 1.5 }}>
      {children}
    </p>
  );
}

export function PrimaryButton({
  children,
  disabled,
  onClick,
  to,
  href,
  params,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  to?: string;
  href?: string;
  params?: Record<string, string>;
}) {
  const style: React.CSSProperties = {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    fontSize: 14,
    textAlign: "center",
    border: `1px solid ${disabled ? WF_MID : WF_DARK}`,
    background: disabled ? "transparent" : WF_DARK,
    color: disabled ? WF_MID : "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    marginTop: 8,
  };
  if (disabled) return <button style={style} disabled>{children}</button>;
  if (href) return <a href={href} style={style}>{children}</a>;
  if (to) return <Link to={to} params={params as never} style={style}>{children}</Link>;
  return <button style={style} onClick={onClick}>{children}</button>;
}

export function SecondaryButton({
  children,
  to,
  onClick,
}: {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
}) {
  const style: React.CSSProperties = {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    fontSize: 14,
    textAlign: "center",
    border: `1px solid ${WF_MID}`,
    background: "#fff",
    color: WF_DARK,
    cursor: "pointer",
    textDecoration: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    marginTop: 8,
  };
  if (to) return <Link to={to} style={style}>{children}</Link>;
  return <button style={style} onClick={onClick}>{children}</button>;
}

export function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: WF_DARK }}>{label}</span>
        <span style={{ fontSize: 11, color: WF_MID }}>read-only</span>
      </div>
      <div
        style={{
          padding: "10px 12px",
          border: `1px solid ${WF_MID}`,
          background: WF_LIGHT,
          fontSize: 14,
          color: WF_DARK,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function Divider() {
  return <div style={{ height: 1, background: WF_MID, opacity: 0.4, margin: "20px 0" }} />;
}

export function TestingLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <div style={{ textAlign: "center", marginTop: 12 }}>
      <Link
        to={to}
        style={{
          fontSize: 12,
          fontStyle: "italic",
          color: WF_MID,
          textDecoration: "underline",
        }}
      >
        [ Testing shortcut: {children} ]
      </Link>
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 4 }}>{children}</div>
  );
}

export function TextInput({
  placeholder,
  value,
  rightIcon,
  active,
  mono,
}: {
  placeholder?: string;
  value?: string;
  rightIcon?: ReactNode;
  active?: boolean;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: `1px solid ${active ? WF_DARK : WF_MID}`,
        padding: "10px 12px",
        background: "#fff",
        marginBottom: 14,
        fontFamily: mono ? "ui-monospace, monospace" : "inherit",
      }}
    >
      <span style={{ flex: 1, fontSize: 14, color: value ? WF_DARK : WF_MID }}>
        {value || placeholder}
      </span>
      {rightIcon}
    </div>
  );
}

export function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={WF_MID} strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function CheckCircle({ filled }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={filled ? WF_DARK : WF_MID} strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" fill={filled ? WF_DARK : "none"} stroke={filled ? WF_DARK : WF_MID} />
      {filled && <path d="M8 12l3 3 5-6" stroke="#fff" />}
    </svg>
  );
}

export function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={WF_DARK} strokeWidth="1.5">
      <rect x="9" y="9" width="13" height="13" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}
