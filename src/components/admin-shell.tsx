import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Settings, Users, ChevronDown, ChevronRight } from "lucide-react";
import { WF_BG, WF_DARK, WF_MID, TEAL, HAIBU_LOGO_URL } from "./wireframe";


const ADMIN_NAV: Array<{ label: string; to: string }> = [
  { label: "Clinic information", to: "/admin" },
  { label: "Platform configuration", to: "/admin/platform" },
  { label: "Dashboard templates", to: "/admin/dashboards" },
  { label: "Clinician management", to: "/admin/clinicians" },
  { label: "Patient management", to: "/admin/patients" },
  { label: "Form library", to: "/admin/forms" },
  { label: "Task library", to: "/admin/tasks" },
  { label: "Resource library", to: "/admin/resources" },
  { label: "Audit log", to: "/admin/audit" },
];

const PATIENT_ROSTER_TO = "/roster";


const TOPBAR_H = 56;

export function AdminShell({ heading, children }: { heading: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const adminActive = ADMIN_NAV.some((i) => i.to === pathname);
  const [adminOpen, setAdminOpen] = useState(true);
  const rosterActive = pathname === PATIENT_ROSTER_TO;

  return (
    <div style={{ minHeight: "100vh", background: WF_BG, color: WF_DARK, display: "flex" }}>
      {/* Sidebar (full viewport height) */}
      <aside
        style={{
          width: 220,
          background: TEAL,
          display: "flex",
          flexDirection: "column",
          alignSelf: "flex-start",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
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
          <img src={HAIBU_LOGO_URL} alt="Haibu Diabetes" style={{ height: 34, filter: "brightness(0) invert(1)" }} />
        </div>
        <nav style={{ flex: 1, paddingTop: 12 }}>
          <button
            type="button"
            onClick={() => setAdminOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              height: 40,
              padding: "0 16px",
              fontSize: 15,
              fontWeight: 600,
              color: adminActive ? "#fff" : "rgba(255,255,255,0.85)",
              background: "transparent",
              border: "none",
              borderLeft: "3px solid transparent",
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
              boxSizing: "border-box",
            }}
          >
            <Settings size={16} />
            <span style={{ flex: 1 }}>Admin</span>
            {adminOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {adminOpen &&
            ADMIN_NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: "block",
                    height: 36,
                    lineHeight: "36px",
                    padding: "0 16px 0 40px",
                    fontSize: 14,
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
          <Link
            to={PATIENT_ROSTER_TO}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 40,
              padding: "0 16px",
              fontSize: 15,
              fontWeight: 600,
              color: rosterActive ? "#fff" : "rgba(255,255,255,0.85)",
              textDecoration: "none",
              background: rosterActive ? "rgba(255,255,255,0.12)" : "transparent",
              borderLeft: rosterActive ? "3px solid #fff" : "3px solid transparent",
              boxSizing: "border-box",
            }}
          >
            <Users size={16} />
            <span>Patient roster</span>
          </Link>
          <PatientContextLinks pathname={pathname} />

        </nav>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", padding: 16 }}>
          <Link
            to="/clinician/profile"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              marginBottom: 8,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
          >
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Dr. Reyes"
              style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "1.5px solid rgba(255,255,255,0.6)", objectFit: "cover", flexShrink: 0,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }}>Dr. Reyes</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Clinician</div>
            </div>
          </Link>
          <Link
            to="/complete"
            style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
          >
            ← Back to clinic
          </Link>
        </div>
      </aside>

      {/* Right column: main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>


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

function PatientContextLinks({ pathname }: { pathname: string }) {
  const m = pathname.match(/^\/dashboard\/([^/]+)(?:\/(profile))?$/);
  if (!m) return null;
  return null;
}

