import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

// ============= Haibu Diabetes design tokens =============
export const WF_BG = "#F4F6ED";        // Page background (warm off-white)
export const WF_LIGHT = "#F4F6ED";     // Disabled / readonly surfaces
export const WF_MID = "#737373";       // Secondary text / captions
export const WF_DARK = "#1A1A1A";      // Primary text

export const TEAL = "#12575C";         // Primary brand
export const TEAL_DARK = "#0D4449";    // Primary hover
export const SEAFOAM = "#78C8AB";      // Secondary accent
export const TINT = "#B7E3F2";         // Selected states / info banners
export const HOVER = "#D7EEFA";        // Hover fill
export const BORDER = "#B4B4B4";       // Default border / dividers / disabled
export const SURFACE = "#FFFFFF";      // Card / modal / input surface

// Semantic
export const SUCCESS_TEXT = "#1A7F5A";
export const SUCCESS_BG = "#E8F7F1";
export const WARN_TEXT = "#B45309";
export const WARN_BG = "#FEF3E2";
export const ERROR_TEXT = "#C0392B";
export const ERROR_BG = "#FDEDEC";

const FONT_STACK = '"Urbanist", system-ui, -apple-system, Segoe UI, sans-serif';

export function TopBar() {
  return (
    <div
      style={{
        background: SURFACE,
        color: WF_DARK,
        padding: "12px 20px",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: FONT_STACK,
        borderBottom: `1px solid ${BORDER}66`,
      }}
    >
      <span style={{ color: TEAL }}>Haibu Diabetes</span>
    </div>
  );
}

export function Page({ children, noCard = false }: { children: ReactNode; noCard?: boolean }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: WF_BG,
        fontFamily: FONT_STACK,
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
              background: SURFACE,
              border: `1px solid ${BORDER}66`,
              borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
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
            borderRadius: 2,
            background: s === "inactive" ? BORDER : TEAL,
          }}
        />
      ))}
    </div>
  );
}

export function H({ children, size = 22 }: { children: ReactNode; size?: number }) {
  return (
    <h1 style={{ fontSize: size, color: TEAL, margin: "0 0 12px 0", fontWeight: 700 }}>
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
    fontWeight: 500,
    textAlign: "center",
    border: "none",
    borderRadius: 8,
    background: disabled ? BORDER : TEAL,
    color: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    marginTop: 8,
    opacity: disabled ? 0.6 : 1,
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
    fontWeight: 500,
    textAlign: "center",
    border: `1.5px solid ${TEAL}`,
    borderRadius: 8,
    background: "transparent",
    color: TEAL,
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
        <span style={{ fontSize: 12, color: WF_DARK, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 11, color: WF_MID }}>read-only</span>
      </div>
      <div
        style={{
          padding: "10px 12px",
          border: `1.5px solid ${BORDER}`,
          borderRadius: 8,
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
  return <div style={{ height: 1, background: BORDER, opacity: 0.4, margin: "20px 0" }} />;
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
    <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 4, fontWeight: 500 }}>{children}</div>
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
        border: active ? `2px solid ${TEAL}` : `1.5px solid ${BORDER}`,
        borderRadius: 8,
        padding: "10px 12px",
        background: SURFACE,
        marginBottom: 14,
        fontFamily: mono ? "ui-monospace, monospace" : "inherit",
      }}
    >
      <span style={{ flex: 1, fontSize: 14, color: value ? WF_DARK : BORDER }}>
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={filled ? TEAL : BORDER} strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" fill={filled ? TEAL : "none"} stroke={filled ? TEAL : BORDER} />
      {filled && <path d="M8 12l3 3 5-6" stroke="#fff" />}
    </svg>
  );
}

export function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="1.5">
      <rect x="9" y="9" width="13" height="13" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function BackLink({ to }: { to: string }) {
  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <Link
        to={to}
        style={{
          fontSize: 12,
          fontStyle: "italic",
          color: WF_MID,
          textDecoration: "underline",
        }}
      >
        [ ← Back (prototype navigation only) ]
      </Link>
    </div>
  );
}

export function RestartLink() {
  return (
    <div style={{ textAlign: "center", marginTop: 8 }}>
      <Link
        to="/"
        style={{
          fontSize: 12,
          fontStyle: "italic",
          color: WF_MID,
          textDecoration: "underline",
        }}
      >
        [ ← Restart flow (prototype navigation only) ]
      </Link>
    </div>
  );
}
