import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Input, Select, TextLink, Modal, Pill } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

type StateMode = "default" | "empty" | "noresults" | "loading";
type Status = "Active" | "Archived";

export const Route = createFileRoute("/admin/forms/")({
  validateSearch: (s: Record<string, unknown>) => ({
    state: (s.state as StateMode) || "default",
    banner: (s.banner as string) || "",
  }),
  component: FormList,
});

type Form = {
  id: string;
  name: string;
  added: string;
  lastUsed: string;
  by: string;
  status: Status;
};

const FORMS: Form[] = [
  { id: "initial-assessment", name: "Initial Assessment", added: "Jan 5, 2026", lastUsed: "2 days ago", by: "Dr. Sarah Chen", status: "Active" },
  { id: "monthly-checkin", name: "Monthly Check-in", added: "Feb 12, 2026", lastUsed: "1 week ago", by: "Admin", status: "Active" },
  { id: "hypo-report", name: "Hypoglycaemia Report", added: "Mar 1, 2026", lastUsed: "3 weeks ago", by: "Dr. James Okafor", status: "Active" },
  { id: "school-nurse", name: "School Nurse Briefing", added: "Mar 18, 2026", lastUsed: "Never", by: "Admin", status: "Active" },
  { id: "old-intake", name: "Old Intake Form", added: "Nov 3, 2025", lastUsed: "6 months ago", by: "Admin", status: "Archived" },
];

function FormList() {
  const { state, banner } = useSearch({ from: "/admin/forms/" });
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bannerOpen, setBannerOpen] = useState(true);
  const [confirm, setConfirm] = useState<Form | null>(null);

  const visible: Form[] = useMemo(() => {
    if (state === "empty" || state === "noresults") return [];
    let rows = FORMS;
    if (statusFilter !== "All") rows = rows.filter((r) => r.status === statusFilter);
    if (q.trim()) rows = rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
    return rows;
  }, [q, statusFilter, state]);

  return (
    <AdminShell heading="">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, margin: 0 }}>Form library</h1>
        <Btn primary to="/admin/forms/new">+ Add form</Btn>
      </div>

      {banner && bannerOpen && (
        <div style={{ border: `1px solid ${WF_DARK}`, background: "#fff", padding: "10px 14px", fontSize: 13, color: WF_DARK, margin: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{banner}</span>
          <button onClick={() => setBannerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: WF_DARK, fontSize: 16 }}>×</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220, maxWidth: 280 }}>
          <Input placeholder="Search forms" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 160 }}>
          <option value="All">All statuses</option>
          <option>Active</option><option>Archived</option>
        </Select>
        <div style={{ flex: 1, textAlign: "right", fontSize: 12, color: WF_MID, minWidth: 80 }}>
          {state === "empty" ? "0 forms" : `${FORMS.length} forms`}
        </div>
      </div>

      {state === "loading" ? (
        <SkeletonTable />
      ) : state === "empty" ? (
        <EmptyState />
      ) : state === "noresults" ? (
        <NoResultsState />
      ) : (
        <div style={{ background: "#fff", border: `1px solid ${WF_MID}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F5F5F5", borderBottom: `1px solid ${WF_MID}` }}>
                {["Form name", "Date added", "Last used", "Created by", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} style={{ borderBottom: `0.5px solid ${WF_MID}`, opacity: r.status === "Archived" ? 0.6 : 1 }}>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{r.name}</td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{r.added}</td>
                  <td style={{ padding: "12px 14px", color: r.lastUsed === "Never" ? WF_MID : WF_DARK }}>{r.lastUsed}</td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{r.by}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <Pill label={r.status} weight={r.status === "Active" ? "dark" : "light"} />
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    {r.status === "Archived" ? (
                      <Link
                        to="/admin/forms"
                        search={{ state: "default", banner: `${r.name} has been restored.` }}
                        style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}
                      >
                        Restore
                      </Link>
                    ) : (
                      <span style={{ display: "inline-flex", gap: 12 }}>
                        <Link to="/admin/forms/$id" params={{ id: r.id }} style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}>Edit</Link>
                        <button
                          onClick={() => setConfirm(r)}
                          style={{ background: "none", border: "none", padding: 0, fontSize: 13, color: WF_DARK, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit" }}
                        >
                          Archive
                        </button>
                      </span>
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
            <Link
              key={s}
              to="/admin/forms"
              search={{ state: s, banner: "" }}
              style={{ fontSize: 11, color: state === s ? WF_DARK : WF_MID, textDecoration: "underline", fontWeight: state === s ? 600 : 400 }}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <Modal open={!!confirm} title={`Archive ${confirm?.name}?`} onClose={() => setConfirm(null)}>
        <p style={{ fontSize: 13, color: WF_DARK, margin: "0 0 20px", lineHeight: 1.5 }}>
          This form will no longer be assignable to new patients. Existing patient assignments retain access.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Btn onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn
            primary
            onClick={() => {
              const name = confirm?.name;
              setConfirm(null);
              navigate({ to: "/admin/forms", search: { state: "default", banner: name ? `${name} has been archived.` : "" } });
            }}
          >
            Archive form
          </Btn>
        </div>
      </Modal>

      <PrototypeBack to="/admin" />
    </AdminShell>
  );
}

function SkeletonTable() {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}` }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ display: "flex", padding: "16px 14px", borderBottom: `0.5px solid ${WF_MID}`, gap: 16 }}>
          {[220, 110, 110, 140, 80, 100].map((w, j) => (
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
      <div style={{ fontSize: 13, color: WF_MID, marginBottom: 20 }}>
        Add your first form to make it available to clinicians.
      </div>
      <Btn primary to="/admin/forms/new">+ Add form</Btn>
    </div>
  );
}

function NoResultsState() {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 60, textAlign: "center" }}>
      <div style={{ fontSize: 14, color: WF_DARK, marginBottom: 12 }}>No forms match your search</div>
      <TextLink to="/admin/forms">Clear search</TextLink>
    </div>
  );
}
