import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Input, Select, Pill, Modal } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

type StateMode = "default" | "empty" | "noresults" | "loading";

type Form = {
  id: string;
  name: string;
  added: string;
  lastUsed: string;
  createdBy: string;
  status: "Active" | "Archived";
};

const FORMS: Form[] = [
  { id: "initial-assessment", name: "Initial Assessment", added: "Jan 5, 2026", lastUsed: "2 days ago", createdBy: "Dr. Sarah Chen", status: "Active" },
  { id: "monthly-check-in", name: "Monthly Check-in", added: "Feb 12, 2026", lastUsed: "1 week ago", createdBy: "Admin", status: "Active" },
  { id: "hypo-report", name: "Hypoglycaemia Report", added: "Mar 1, 2026", lastUsed: "3 weeks ago", createdBy: "Dr. James Okafor", status: "Active" },
  { id: "school-nurse", name: "School Nurse Briefing", added: "Mar 18, 2026", lastUsed: "Never", createdBy: "Admin", status: "Active" },
  { id: "old-intake", name: "Old Intake Form", added: "Nov 3, 2025", lastUsed: "6 months ago", createdBy: "Admin", status: "Archived" },
];

export const Route = createFileRoute("/admin/forms")({
  validateSearch: (s: Record<string, unknown>) => ({
    state: (s.state as StateMode) || "default",
    banner: (s.banner as string) || "",
  }),
  component: FormsList,
});

function FormsList() {
  const { state, banner } = useSearch({ from: "/admin/forms" });
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [bannerOpen, setBannerOpen] = useState(true);
  const [archiveTarget, setArchiveTarget] = useState<Form | null>(null);

  const visible: Form[] = useMemo(() => {
    if (state === "empty" || state === "noresults") return [];
    let rows = FORMS;
    if (statusFilter !== "All statuses") rows = rows.filter((f) => f.status === statusFilter);
    if (q.trim()) rows = rows.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));
    return rows;
  }, [q, statusFilter, state]);

  function confirmArchive() {
    if (!archiveTarget) return;
    const name = archiveTarget.name;
    setArchiveTarget(null);
    nav({ to: "/admin/forms", search: { state: "default", banner: `${name} has been archived.` } });
  }

  return (
    <AdminShell heading="">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, margin: 0 }}>Form library</h1>
        <Btn primary to="/admin/forms/$id" params={{ id: "new" }}>+ Add form</Btn>
      </div>

      {banner && bannerOpen && (
        <div style={{ border: `1px solid ${WF_DARK}`, background: "#fff", padding: "10px 14px", fontSize: 13, color: WF_DARK, margin: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{banner}</span>
          <button onClick={() => setBannerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: WF_DARK, fontSize: 16 }}>×</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, marginBottom: 16 }}>
        <div style={{ flex: 1, maxWidth: 320 }}>
          <Input placeholder="Search forms" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 180 }}>
          <option>All statuses</option>
          <option>Active</option>
          <option>Archived</option>
        </Select>
        <div style={{ flex: 1, textAlign: "right", fontSize: 12, color: WF_MID }}>
          {state === "empty" ? "0 forms" : `${FORMS.length} forms`}
        </div>
      </div>

      {state === "loading" ? (
        <Skeleton />
      ) : state === "empty" ? (
        <EmptyState />
      ) : state === "noresults" ? (
        <NoResults />
      ) : (
        <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F5F5F5", borderBottom: `1px solid ${WF_MID}` }}>
                {["Form name", "Date added", "Last used", "Created by", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((f) => (
                <tr key={f.id} style={{ borderBottom: `0.5px solid ${WF_MID}` }}>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{f.name}</td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{f.added}</td>
                  <td style={{ padding: "12px 14px", color: f.lastUsed === "Never" ? WF_MID : WF_DARK }}>{f.lastUsed}</td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{f.createdBy}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <Pill label={f.status} weight={f.status === "Active" ? "dark" : "light"} />
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    {f.status === "Active" ? (
                      <span style={{ display: "flex", gap: 14 }}>
                        <Link to="/admin/forms/$id" params={{ id: f.id }} style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}>Edit</Link>
                        <button onClick={() => setArchiveTarget(f)} style={{ background: "none", border: "none", padding: 0, fontSize: 13, color: WF_DARK, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit" }}>Archive</button>
                      </span>
                    ) : (
                      <Link to="/admin/forms" search={{ state: "default", banner: `${f.name} has been restored.` }} style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}>Restore</Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 24, padding: 12, border: `1px dashed ${WF_MID}`, fontSize: 11, color: WF_MID, fontStyle: "italic" }}>
        <div style={{ marginBottom: 6 }}>[ Prototype: switch list state ]</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(["default", "empty", "noresults", "loading"] as StateMode[]).map((s) => (
            <Link key={s} to="/admin/forms" search={{ state: s, banner: "" }} style={{ fontSize: 11, color: state === s ? WF_DARK : WF_MID, textDecoration: "underline", fontWeight: state === s ? 600 : 400 }}>{s}</Link>
          ))}
        </div>
      </div>

      <Modal open={!!archiveTarget} title={`Archive ${archiveTarget?.name}?`} onClose={() => setArchiveTarget(null)}>
        <div style={{ fontSize: 13, color: WF_DARK, marginBottom: 20, lineHeight: 1.5 }}>
          This form will no longer be assignable to new patients. Existing patient assignments retain access.
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Btn onClick={() => setArchiveTarget(null)}>Cancel</Btn>
          <Btn primary onClick={confirmArchive}>Archive form</Btn>
        </div>
      </Modal>

      <PrototypeBack to="/admin" />
    </AdminShell>
  );
}

function Skeleton() {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}` }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ display: "flex", padding: "16px 14px", borderBottom: `0.5px solid ${WF_MID}`, gap: 16 }}>
          {[200, 100, 100, 140, 80, 100].map((w, j) => (
            <div key={j} style={{ width: w, height: 12, background: "#F5F5F5", border: `1px solid ${WF_MID}` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 60, textAlign: "center" }}>
      <div style={{ width: 48, height: 48, border: `1.5px solid ${WF_MID}`, borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", color: WF_MID, fontSize: 22 }}>○</div>
      <div style={{ fontSize: 16, color: WF_DARK, marginBottom: 6 }}>No forms yet</div>
      <div style={{ fontSize: 13, color: WF_MID, marginBottom: 20 }}>Add your first form to make it available to clinicians.</div>
      <Btn primary to="/admin/forms/$id" params={{ id: "new" }}>+ Add form</Btn>
    </div>
  );
}

function NoResults() {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 60, textAlign: "center" }}>
      <div style={{ fontSize: 14, color: WF_DARK, marginBottom: 12 }}>No forms match your search</div>
      <Link to="/admin/forms" search={{ state: "default", banner: "" }} style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}>Clear search</Link>
    </div>
  );
}
