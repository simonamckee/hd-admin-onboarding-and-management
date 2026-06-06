import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { WF_BG, WF_DARK, WF_MID, TEAL, BORDER, SURFACE, HAIBU_LOGO_URL } from "./wireframe";

const NAV: Array<{ label: string; to: string }> = [
  { label: "Clinic information", to: "/admin" },
  { label: "Platform configuration", to: "/admin/platform" },
  { label: "Dashboard templates", to: "/admin/dashboards" },
  { label: "Clinician management", to: "/admin/clinicians" },
  { label: "Patient management", to: "/admin/patients" },
  { label: "Form library", to: "/admin/forms" },
  { label: "Resource library", to: "/admin/resources" },
  { label: "Audit log", to: "/admin/audit" },
];

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={WF_DARK} strokeWidth="1.5">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

const TOPBAR_H = 56;

export function AdminShell({ heading, children }: { heading: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div style={{ minHeight: "100vh", background: WF_BG, color: WF_DARK, display: "flex" }}>
      {/* Sidebar (full viewport height) */}
      <aside
        style={{
          width: 220,
          background: TEAL,
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
        }}
      >
        <div
          style={{
            height: TOPBAR_H,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            borderBottom: "1px solid rgba(255,255,255,0.15)",
            boxSizing: "border-box",
          }}
        >
          <img src={HAIBU_LOGO_URL} alt="Haibu Diabetes" style={{ height: 30, filter: "brightness(0) invert(1)" }} />
        </div>
        <nav style={{ flex: 1, paddingTop: 12 }}>
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: "block",
                  height: 40,
                  lineHeight: "40px",
                  padding: "0 16px",
                  fontSize: 15,
                  fontWeight: 500,
                  color: active ? "#fff" : "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  background: active ? "rgba(255,255,255,0.12)" : "transparent",
                  borderLeft: active ? "3px solid #fff" : "3px solid transparent",
                  boxSizing: "border-box",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", padding: 16 }}>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
            Sarah Reid
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
            Clinic Admin
          </div>
          <Link
            to="/complete"
            style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
          >
            ← Back to clinic
          </Link>
        </div>
      </aside>

      {/* Right column: top bar + main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div
          style={{
            background: SURFACE,
            color: WF_DARK,
            height: TOPBAR_H,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            borderBottom: `1px solid ${BORDER}4D`,
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <BellIcon />
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: TEAL,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
              }}
            >
              SR
            </div>
            <span style={{ fontSize: 14, color: WF_DARK, fontWeight: 500 }}>Admin</span>
          </div>
        </div>

        <main style={{ flex: 1, padding: 32, background: WF_BG }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: TEAL, margin: "0 0 24px 0" }}>
            {heading}
          </h1>
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminPlaceholder({ heading }: { heading: string }) {
  return (
    <AdminShell heading={heading}>
      <div style={{ textAlign: "center", padding: "80px 16px" }}>
        <p style={{ fontSize: 16, color: WF_MID, margin: 0 }}>
          This section is being designed. Coming soon.
        </p>
      </div>
      <PrototypeBack />
    </AdminShell>
  );
}

export function PrototypeBack({ to = "/admin" }: { to?: string }) {
  return (
    <div style={{ textAlign: "center", marginTop: 32 }}>
      <Link
        to={to}
        style={{ fontSize: 14, fontStyle: "italic", color: WF_MID, textDecoration: "underline" }}
      >
        [ ← Back (prototype navigation only) ]
      </Link>
    </div>
  );
}
