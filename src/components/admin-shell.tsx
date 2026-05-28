import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { WF_BG, WF_DARK, WF_MID } from "./wireframe";

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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function AdminShell({ heading, children }: { heading: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div style={{ minHeight: "100vh", background: WF_BG, fontFamily: "Inter, system-ui, sans-serif", color: WF_DARK }}>
      {/* Top bar */}
      <div
        style={{
          background: WF_DARK,
          color: "#fff",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 14 }}>Haibu Diabetes</span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <BellIcon />
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "#fff",
            }}
          >
            SR
          </div>
          <span style={{ fontSize: 12, color: "#fff" }}>Admin</span>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 42px)" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 220,
            background: "#fff",
            borderRight: `0.5px solid ${WF_MID}`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: 16,
              marginBottom: 20,
              fontSize: 11,
              color: WF_MID,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Admin section
          </div>
          <nav style={{ flex: 1 }}>
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
                    fontSize: 13,
                    color: WF_DARK,
                    textDecoration: "none",
                    background: active ? "#F5F5F5" : "transparent",
                    borderLeft: active ? `2px solid ${WF_DARK}` : "2px solid transparent",
                    boxSizing: "border-box",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div style={{ borderTop: `0.5px solid ${WF_MID}`, padding: 16 }}>
            <Link
              to="/complete"
              style={{ fontSize: 13, color: WF_MID, textDecoration: "none" }}
            >
              ← Back to clinic
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: 32, background: WF_BG }}>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, margin: "0 0 24px 0" }}>
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
        <p style={{ fontSize: 14, color: WF_MID, margin: 0 }}>
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
        style={{ fontSize: 12, fontStyle: "italic", color: WF_MID, textDecoration: "underline" }}
      >
        [ ← Back (prototype navigation only) ]
      </Link>
    </div>
  );
}
