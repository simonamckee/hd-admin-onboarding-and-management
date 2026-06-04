import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Input, Select, Pill, TextLink, Modal } from "@/components/patient-ui";
import { WF_DARK, WF_MID, TEAL } from "@/components/wireframe";
import { ASSIGNED_PATIENTS, deactivateClinician } from "@/lib/clinician-assignments";

type StateMode = "default" | "empty" | "noresults" | "loading";
type SsoMode = "off" | "on";

export const Route = createFileRoute("/admin/clinicians/")({
  validateSearch: (s: Record<string, unknown>) => ({
    state: (s.state as StateMode) || "default",
    sso: (s.sso as SsoMode) || "off",
    banner: (s.banner as string) || "",
  }),
  component: ClinicianList,
});

type Clinician = {
  id: string;
  name: string;
  title: string;
  role: "Admin" | "Clinician";
  email: string;
  status: "Active" | "Pending" | "Archived";
  lastSignIn: string;
};

const CLINICIANS: Clinician[] = [
  { id: "sarah-chen", name: "Dr. Sarah Chen", title: "Endocrinologist", role: "Admin", email: "s.chen@clinic.ca", status: "Active", lastSignIn: "Today" },
  { id: "james-okafor", name: "Dr. James Okafor", title: "Endocrinologist", role: "Clinician", email: "j.okafor@clinic.ca", status: "Active", lastSignIn: "3 days ago" },
  { id: "priya-mehta", name: "Nurse Priya Mehta", title: "Diabetes Nurse Educator", role: "Clinician", email: "p.mehta@clinic.ca", status: "Active", lastSignIn: "1 week ago" },
  { id: "lisa-bouchard", name: "Dr. Lisa Bouchard", title: "Endocrinologist", role: "Clinician", email: "l.bouchard@clinic.ca", status: "Pending", lastSignIn: "Never" },
  { id: "tom-park", name: "Dietician Tom Park", title: "Registered Dietician", role: "Clinician", email: "t.park@clinic.ca", status: "Active", lastSignIn: "2 weeks ago" },
  { id: "kevin-marsh", name: "Dr. Kevin Marsh", title: "Endocrinologist", role: "Clinician", email: "k.marsh@clinic.ca", status: "Archived", lastSignIn: "4 months ago" },
];

function statusPill(s: Clinician["status"]) {
  if (s === "Active") return <Pill label="Active" weight="dark" />;
  if (s === "Pending") return <Pill label="Pending" weight="mid" />;
  return <Pill label="Archived" weight="light" />;
}

function AddClinicianSplitButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const baseHeight = 36;
  const shared: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: baseHeight,
    fontSize: 13,
    fontFamily: "inherit",
    border: `1px solid ${TEAL}`,
    background: TEAL,
    color: "#fff",
    cursor: "pointer",
    textDecoration: "none",
    boxSizing: "border-box",
    padding: "0 14px",
  };

  const itemStyle: React.CSSProperties = {
    display: "block",
    padding: "10px 14px",
    fontSize: 13,
    color: WF_DARK,
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
  };

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-flex" }}>
      <Link
        to="/admin/clinicians/new"
        style={{
          ...shared,
          borderRight: "none",
          borderRadius: "4px 0 0 4px",
          paddingRight: 12,
        }}
      >
        + Add clinician
      </Link>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          ...shared,
          width: baseHeight,
          padding: 0,
          borderRadius: "0 4px 4px 0",
          borderLeft: `1px solid rgba(255,255,255,0.25)`,
        }}
        aria-label="Add clinician options"
      >
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="#fff" strokeWidth="1.5" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: baseHeight + 4,
            right: 0,
            background: "#fff",
            border: `1px solid ${WF_MID}`,
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            zIndex: 50,
            minWidth: 160,
            overflow: "hidden",
          }}
        >
          <Link
            to="/admin/clinicians/new"
            onClick={() => setOpen(false)}
            style={itemStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            Add individually
          </Link>
          <div style={{ height: 1, background: WF_MID, opacity: 0.3 }} />
          <Link
            to="/admin/clinicians/batch"
            search={{ stage: "upload" }}
            onClick={() => setOpen(false)}
            style={itemStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            Upload CSV
          </Link>
        </div>
      )}
    </div>
  );
}

function ClinicianList() {
  const { state, sso, banner } = useSearch({ from: "/admin/clinicians/" });
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bannerOpen, setBannerOpen] = useState(true);
  const [warnId, setWarnId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const ssoOn = sso === "on";

  const visible: Clinician[] = useMemo(() => {
    if (state === "empty" || state === "noresults") return [];
    let rows = CLINICIANS;
    if (roleFilter !== "All") rows = rows.filter((p) => p.role === roleFilter);
    if (statusFilter !== "All") rows = rows.filter((p) => p.status === statusFilter);
    if (q.trim()) rows = rows.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) || p.email.toLowerCase().includes(q.toLowerCase()),
    );
    return rows;
  }, [q, roleFilter, statusFilter, state]);

  return (
    <AdminShell heading="">
      {/* SSO preview toggle */}
      <div style={{ marginBottom: 16, padding: 10, border: `1px dashed ${WF_MID}`, fontSize: 11, color: WF_MID, fontStyle: "italic", display: "flex", alignItems: "center", gap: 12 }}>
        <span>[ Preview: SSO active ]</span>
        {(["off", "on"] as SsoMode[]).map((s) => (
          <Link
            key={s}
            to="/admin/clinicians"
            search={{ state: "default", sso: s, banner: "" }}
            style={{ fontSize: 11, color: sso === s ? WF_DARK : WF_MID, textDecoration: "underline", fontWeight: sso === s ? 600 : 400 }}
          >
            {s === "off" ? "Non-SSO" : "SSO active"}
          </Link>
        ))}
      </div>

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, margin: 0 }}>
          Clinician management
        </h1>
        {!ssoOn && <AddClinicianSplitButton />}
      </div>

      {/* SSO info banner */}
      {ssoOn && (
        <div style={{ border: `1px solid ${WF_MID}`, background: "#F5F5F5", padding: "12px 16px", fontSize: 13, color: WF_DARK, margin: "16px 0", lineHeight: 1.5 }}>
          This clinic uses an identity provider for clinician access. Clinicians are managed via your clinic&apos;s directory — changes made there are reflected in Haibu automatically. To add or remove clinicians, update your identity provider&apos;s security group.
        </div>
      )}

      {/* Success banner */}
      {banner && bannerOpen && (
        <div style={{ border: `1px solid ${WF_DARK}`, background: "#fff", padding: "10px 14px", fontSize: 13, color: WF_DARK, margin: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{banner}</span>
          <button onClick={() => setBannerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: WF_DARK, fontSize: 16 }}>×</button>
        </div>
      )}

      {/* Subheader */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20, marginBottom: 16 }}>
        <div style={{ flex: 1, maxWidth: 320 }}>
          <Input placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ width: 160 }}>
          <option value="All">All roles</option>
          <option>Clinician</option>
          <option>Admin</option>
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 180 }}>
          <option value="All">All statuses</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Archived</option>
        </Select>
        <div style={{ flex: 1, textAlign: "right", fontSize: 12, color: WF_MID }}>
          {state === "empty" ? "0 clinicians" : `${CLINICIANS.length} clinicians`}
        </div>
      </div>

      {state === "loading" ? (
        <SkeletonTable />
      ) : state === "empty" ? (
        <EmptyState ssoOn={ssoOn} />
      ) : state === "noresults" ? (
        <NoResultsState />
      ) : (
        <div style={{ background: "#fff", border: `1px solid ${WF_MID}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F5F5F5", borderBottom: `1px solid ${WF_MID}` }}>
                {["Name", "Title", "Role", "Email", "Status", "Last sign-in", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr key={c.id} style={{ borderBottom: `0.5px solid ${WF_MID}` }}>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{c.name}</td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{c.title}</td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{c.role}</td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{c.email}</td>
                  <td style={{ padding: "12px 14px" }}>{statusPill(c.status)}</td>
                  <td style={{ padding: "12px 14px", color: c.lastSignIn === "Never" ? WF_MID : WF_DARK }}>{c.lastSignIn}</td>
                  <td style={{ padding: "12px 14px" }}>
                    {c.status === "Archived" ? (
                      <span style={{ color: WF_MID, fontSize: 12 }}>—</span>
                    ) : (
                      <span style={{ display: "inline-flex", gap: 12 }}>
                        <Link to="/admin/clinicians/$id" params={{ id: c.id }} search={{ sso }} style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}>Edit</Link>
                        {!ssoOn && (
                          <button
                            onClick={() => {
                              const assigned = ASSIGNED_PATIENTS[c.id] || [];
                              if (assigned.length > 0) {
                                setWarnId(c.id);
                              } else {
                                setConfirmId(c.id);
                              }
                            }}
                            style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
                          >
                            Deactivate
                          </button>
                        )}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Warning modal */}
      <Modal
        open={!!warnId}
        title={warnId ? `${CLINICIANS.find((c) => c.id === warnId)?.name} is assigned to ${(ASSIGNED_PATIENTS[warnId] || []).length} patient${(ASSIGNED_PATIENTS[warnId] || []).length === 1 ? "" : "s"}` : ""}
        onClose={() => setWarnId(null)}
      >
        {warnId && (
          <>
            <p style={{ fontSize: 13, color: WF_DARK, margin: "0 0 14px", lineHeight: 1.5 }}>
              These patients will need to be reassigned to another clinician. You can reassign
              them now or proceed with the deactivation.
            </p>
            <ul style={{ margin: "0 0 18px 18px", padding: 0, fontSize: 12, color: WF_DARK, lineHeight: 1.5 }}>
              {(ASSIGNED_PATIENTS[warnId] || []).slice(0, 5).map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            {(ASSIGNED_PATIENTS[warnId] || []).length > 5 && (
              <div style={{ fontSize: 11, color: WF_MID, margin: "-12px 0 18px", fontStyle: "italic" }}>
                + {(ASSIGNED_PATIENTS[warnId] || []).length - 5} more patients
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
              <Btn
                primary
                onClick={() => {
                  setConfirmId(warnId);
                  setWarnId(null);
                }}
              >
                Deactivate anyway →
              </Btn>
              <Btn
                onClick={() => {
                  setWarnId(null);
                  navigate({
                    to: "/admin/patients",
                    search: { state: "default", banner: "", assignedTo: warnId },
                  });
                }}
              >
                Reassign patients first
              </Btn>
              <div style={{ textAlign: "center", marginTop: 4 }}>
                <button
                  onClick={() => setWarnId(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: WF_DARK, fontSize: 12, textDecoration: "underline", fontFamily: "inherit" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* Confirmation modal */}
      <Modal
        open={!!confirmId}
        title={confirmId ? `Deactivate ${CLINICIANS.find((c) => c.id === confirmId)?.name}?` : ""}
        onClose={() => setConfirmId(null)}
      >
        {confirmId && (
          <>
            <p style={{ fontSize: 13, color: WF_DARK, margin: "0 0 20px", lineHeight: 1.5 }}>
              They will immediately lose access to Haibu and any active sessions will end.
              Their patient assignments will be preserved.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Btn onClick={() => setConfirmId(null)}>Cancel</Btn>
              <Btn
                primary
                onClick={() => {
                  const name = CLINICIANS.find((c) => c.id === confirmId)?.name || "";
                  deactivateClinician(name);
                  setConfirmId(null);
                  navigate({
                    to: "/admin/clinicians",
                    search: { state: "default", sso, banner: `${name} has been deactivated.` },
                  });
                }}
              >
                Yes, deactivate
              </Btn>
            </div>
          </>
        )}
      </Modal>

      {/* Prototype state toggles */}
      <div style={{ marginTop: 24, padding: 12, border: `1px dashed ${WF_MID}`, fontSize: 11, color: WF_MID, fontStyle: "italic" }}>
        <div style={{ marginBottom: 6 }}>[ Prototype: switch list state ]</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(["default", "empty", "noresults", "loading"] as StateMode[]).map((s) => (
            <Link
              key={s}
              to="/admin/clinicians"
              search={{ state: s, sso, banner: "" }}
              style={{ fontSize: 11, color: state === s ? WF_DARK : WF_MID, textDecoration: "underline", fontWeight: state === s ? 600 : 400 }}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <PrototypeBack to="/admin" />
    </AdminShell>
  );
}

function SkeletonTable() {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}` }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ display: "flex", padding: "16px 14px", borderBottom: `0.5px solid ${WF_MID}`, gap: 16 }}>
          {[160, 140, 70, 180, 80, 100, 80].map((w, j) => (
            <div key={j} style={{ width: w, height: 12, background: "#F5F5F5", border: `1px solid ${WF_MID}` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ ssoOn }: { ssoOn: boolean }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 60, textAlign: "center" }}>
      <div style={{ width: 48, height: 48, border: `1.5px solid ${WF_MID}`, borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", color: WF_MID, fontSize: 22 }}>○</div>
      <div style={{ fontSize: 16, color: WF_DARK, marginBottom: 6 }}>No clinicians yet</div>
      <div style={{ fontSize: 13, color: WF_MID, marginBottom: 20 }}>
        {ssoOn ? "Add clinicians via your identity provider." : "Add your first clinician to get started"}
      </div>
      {!ssoOn && <Btn primary to="/admin/clinicians/new">+ Add clinician</Btn>}
    </div>
  );
}

function NoResultsState() {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 60, textAlign: "center" }}>
      <div style={{ fontSize: 14, color: WF_DARK, marginBottom: 12 }}>No clinicians match your search</div>
      <TextLink to="/admin/clinicians">Clear search</TextLink>
    </div>
  );
}
