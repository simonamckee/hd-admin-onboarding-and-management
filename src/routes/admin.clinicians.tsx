import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Input, Select, Pill, Callout } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";
import { CLINICIANS, ROLE_REQUESTS, type Clinician } from "@/lib/clinician-store";

type StateMode = "default" | "empty" | "noresults" | "loading";
type SsoMode = "off" | "on";

export const Route = createFileRoute("/admin/clinicians")({
  validateSearch: (s: Record<string, unknown>) => ({
    state: (s.state as StateMode) || "default",
    sso: (s.sso as SsoMode) || "off",
    banner: (s.banner as string) || "",
  }),
  component: ClinicianList,
});

function statusPill(s: Clinician["status"]) {
  if (s === "Active") return <Pill label="Active" weight="dark" />;
  if (s === "Pending") return <Pill label="Pending" weight="mid" />;
  return <Pill label="Archived" weight="light" />;
}

function ClinicianList() {
  const { state, sso, banner } = useSearch({ from: "/admin/clinicians" });
  const ssoActive = sso === "on";
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [bannerOpen, setBannerOpen] = useState(true);
  const [requests, setRequests] = useState(ROLE_REQUESTS);
  const [reqBanner, setReqBanner] = useState<string>("");

  const visible: Clinician[] = useMemo(() => {
    if (state === "empty" || state === "noresults") return [];
    let rows = CLINICIANS;
    if (roleFilter !== "All roles") rows = rows.filter((c) => c.role === roleFilter);
    if (statusFilter !== "All statuses") rows = rows.filter((c) => c.status === statusFilter);
    if (q.trim())
      rows = rows.filter(
        (c) =>
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.email.toLowerCase().includes(q.toLowerCase()),
      );
    return rows;
  }, [q, roleFilter, statusFilter, state]);

  return (
    <AdminShell heading="">
      {/* Prototype SSO toggle */}
      <div style={{ marginBottom: 16, padding: 10, border: `1px dashed ${WF_MID}`, fontSize: 11, color: WF_MID, fontStyle: "italic", display: "flex", gap: 14, alignItems: "center" }}>
        <span>[ Prototype: Preview SSO active ]</span>
        <Link to="/admin/clinicians" search={{ state: "default", sso: "off", banner: "" }} style={{ fontSize: 11, color: !ssoActive ? WF_DARK : WF_MID, textDecoration: "underline", fontWeight: !ssoActive ? 600 : 400 }}>SSO off</Link>
        <Link to="/admin/clinicians" search={{ state: "default", sso: "on", banner: "" }} style={{ fontSize: 11, color: ssoActive ? WF_DARK : WF_MID, textDecoration: "underline", fontWeight: ssoActive ? 600 : 400 }}>SSO on</Link>
      </div>

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, margin: 0 }}>
          Clinician management
        </h1>
        {!ssoActive && <Btn primary to="/admin/clinicians/new">+ Add clinician</Btn>}
      </div>

      {/* Success banner */}
      {banner && bannerOpen && (
        <div style={{ border: `1px solid ${WF_DARK}`, background: "#fff", padding: "10px 14px", fontSize: 13, color: WF_DARK, margin: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{banner}</span>
          <button onClick={() => setBannerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: WF_DARK, fontSize: 16 }}>×</button>
        </div>
      )}

      {reqBanner && (
        <div style={{ border: `1px solid ${WF_DARK}`, background: "#fff", padding: "10px 14px", fontSize: 13, color: WF_DARK, margin: "16px 0" }}>
          {reqBanner}
        </div>
      )}

      {/* Role change request banners */}
      {!ssoActive && requests.map((r) => (
        <div key={r.id} style={{ border: `1px solid ${WF_MID}`, background: "#F5F5F5", padding: "10px 14px", fontSize: 13, color: WF_DARK, marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{r.name} has requested admin access.</span>
          <span style={{ display: "flex", gap: 16 }}>
            <button onClick={() => { setRequests(requests.filter((x) => x.id !== r.id)); setReqBanner(`${r.name} now has admin access.`); }} style={{ background: "none", border: "none", padding: 0, fontSize: 13, color: WF_DARK, textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}>Approve</button>
            <button onClick={() => setRequests(requests.filter((x) => x.id !== r.id))} style={{ background: "none", border: "none", padding: 0, fontSize: 13, color: WF_MID, textDecoration: "underline", cursor: "pointer" }}>Decline</button>
          </span>
        </div>
      ))}

      {/* SSO callout */}
      {ssoActive && (
        <div style={{ marginTop: 16 }}>
          <Callout>
            This clinic uses an identity provider for clinician access. Clinicians are managed
            via your clinic&apos;s directory — changes made there are reflected in Haibu
            automatically. To add or remove clinicians, update your identity provider&apos;s
            security group.
          </Callout>
        </div>
      )}

      {/* Subheader row */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, marginBottom: 16 }}>
        <div style={{ flex: 1, maxWidth: 300 }}>
          <Input placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ width: 160 }}>
          <option>All roles</option>
          <option>Clinician</option>
          <option>Admin</option>
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 180 }}>
          <option>All statuses</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Archived</option>
        </Select>
        <div style={{ flex: 1, textAlign: "right", fontSize: 12, color: WF_MID }}>
          {state === "empty" ? "0 clinicians" : `${CLINICIANS.length} clinicians`}
        </div>
      </div>

      {/* Table / states */}
      {state === "loading" ? (
        <SkeletonTable />
      ) : state === "empty" ? (
        <EmptyState ssoActive={ssoActive} />
      ) : state === "noresults" ? (
        <NoResultsState />
      ) : (
        <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, overflowX: "auto" }}>
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
                      <span style={{ fontSize: 12, color: WF_MID }}>—</span>
                    ) : (
                      <span style={{ display: "flex", gap: 14 }}>
                        <Link to="/admin/clinicians/$id" params={{ id: c.id }} style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}>Edit</Link>
                        {!ssoActive && (
                          <Link to="/admin/clinicians" search={{ state: "default", sso: "off", banner: `${c.name} has been deactivated.` }} style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}>Deactivate</Link>
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

      {/* Prototype state toggles */}
      <div style={{ marginTop: 24, padding: 12, border: `1px dashed ${WF_MID}`, fontSize: 11, color: WF_MID, fontStyle: "italic" }}>
        <div style={{ marginBottom: 6 }}>[ Prototype: switch list state ]</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(["default", "empty", "noresults", "loading"] as StateMode[]).map((s) => (
            <Link key={s} to="/admin/clinicians" search={{ state: s, sso, banner: "" }} style={{ fontSize: 11, color: state === s ? WF_DARK : WF_MID, textDecoration: "underline", fontWeight: state === s ? 600 : 400 }}>
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
          {[160, 140, 80, 180, 80, 100, 80].map((w, j) => (
            <div key={j} style={{ width: w, height: 12, background: "#F5F5F5", border: `1px solid ${WF_MID}` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ ssoActive }: { ssoActive: boolean }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 60, textAlign: "center" }}>
      <div style={{ width: 48, height: 48, border: `1.5px solid ${WF_MID}`, borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", color: WF_MID, fontSize: 22 }}>○</div>
      <div style={{ fontSize: 16, color: WF_DARK, marginBottom: 6 }}>No clinicians yet</div>
      <div style={{ fontSize: 13, color: WF_MID, marginBottom: 20 }}>
        Invite your first clinician to get started
      </div>
      {!ssoActive && <Btn primary to="/admin/clinicians/new">+ Add clinician</Btn>}
    </div>
  );
}

function NoResultsState() {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 60, textAlign: "center" }}>
      <div style={{ fontSize: 14, color: WF_DARK, marginBottom: 12 }}>No clinicians match your filters</div>
      <Link to="/admin/clinicians" search={{ state: "default", sso: "off", banner: "" }} style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}>Clear filters</Link>
    </div>
  );
}
