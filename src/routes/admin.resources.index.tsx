import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Input, Select, TextLink, Modal } from "@/components/patient-ui";
import { WF_DARK, WF_MID, TEAL } from "@/components/wireframe";

type StateMode = "default" | "empty" | "noresults" | "loading";
type ResType = "Document" | "Link" | "Video";
type Status = "Active" | "Archived";

export const Route = createFileRoute("/admin/resources/")({
  validateSearch: (s: Record<string, unknown>) => ({
    state: (s.state as StateMode) || "default",
    banner: (s.banner as string) || "",
  }),
  component: ResourceList,
});

const CATEGORIES = [
  "Mental health",
  "Device education",
  "Diabetes education",
  "Sick day management",
  "Carb management",
  "Nutrition",
];

type Resource = {
  id: string;
  name: string;
  type: ResType;
  category: string;
  added: string;
  lastUsed: string;
  by: string;
  status: Status;
};

const RESOURCES: Resource[] = [
  { id: "living-well", name: "Living Well with T1D", type: "Document", category: "Diabetes education", added: "Jan 8, 2026", lastUsed: "3 days ago", by: "Admin", status: "Active" },
  { id: "carb-counting", name: "Carb Counting Guide", type: "Document", category: "Carb management", added: "Feb 1, 2026", lastUsed: "1 week ago", by: "Dr. Sarah Chen", status: "Active" },
  { id: "cgm-how-to", name: "How to Use Your CGM", type: "Video", category: "Device education", added: "Feb 20, 2026", lastUsed: "2 weeks ago", by: "Admin", status: "Active" },
  { id: "insulin-faq", name: "Insulin Adjustment FAQ", type: "Link", category: "Diabetes education", added: "Mar 5, 2026", lastUsed: "1 month ago", by: "Dr. James Okafor", status: "Active" },
  { id: "school-template", name: "School Support Template", type: "Document", category: "Mental health", added: "Mar 22, 2026", lastUsed: "Never", by: "Admin", status: "Active" },
  { id: "old-nutrition", name: "Old Nutrition Guide", type: "Document", category: "Nutrition", added: "Aug 14, 2025", lastUsed: "5 months ago", by: "Admin", status: "Archived" },
];

function typeText(t: ResType) {
  return <span style={{ fontSize: 15, color: WF_DARK }}>{t}</span>;
}

function ResourceList() {
  const { state, banner } = useSearch({ from: "/admin/resources/" });
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bannerOpen, setBannerOpen] = useState(true);
  const [confirm, setConfirm] = useState<Resource | null>(null);

  const visible: Resource[] = useMemo(() => {
    if (state === "empty" || state === "noresults") return [];
    let rows = RESOURCES;
    if (typeFilter !== "All") rows = rows.filter((r) => r.type === typeFilter);
    if (catFilter !== "All") rows = rows.filter((r) => r.category === catFilter);
    if (statusFilter !== "All") rows = rows.filter((r) => r.status === statusFilter);
    if (q.trim()) rows = rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
    return rows;
  }, [q, typeFilter, catFilter, statusFilter, state]);

  return (
    <AdminShell heading="">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: TEAL, margin: 0 }}>Resource library</h1>
        <Btn primary to="/admin/resources/new">+ Add resource</Btn>
      </div>

      {banner && bannerOpen && (
        <div style={{ border: `1px solid ${WF_DARK}`, background: "#fff", padding: "10px 14px", fontSize: 15, color: WF_DARK, margin: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{banner}</span>
          <button onClick={() => setBannerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: WF_DARK, fontSize: 18 }}>×</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220, maxWidth: 280 }}>
          <Input placeholder="Search resources" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ width: 140 }}>
          <option value="All">All types</option>
          <option>Document</option><option>Link</option><option>Video</option>
        </Select>
        <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ width: 180 }}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 140 }}>
          <option value="All">All statuses</option>
          <option>Active</option><option>Archived</option>
        </Select>
        <div style={{ flex: 1, textAlign: "right", fontSize: 14, color: WF_MID, minWidth: 80 }}>
          {state === "empty" ? "0 resources" : `${RESOURCES.length} resources`}
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
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr style={{ background: "#F5F5F5", borderBottom: `1px solid ${WF_MID}` }}>
                {["Resource name", "Type", "Category", "Date added", "Last used", "Added by", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 13, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} style={{ borderBottom: `0.5px solid ${WF_MID}`, opacity: r.status === "Archived" ? 0.6 : 1 }}>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{r.name}</td>
                  <td style={{ padding: "12px 14px" }}>{typeText(r.type)}</td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{r.category}</td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{r.added}</td>
                  <td style={{ padding: "12px 14px", color: r.lastUsed === "Never" ? WF_MID : WF_DARK }}>{r.lastUsed}</td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{r.by}</td>
                  <td style={{ padding: "12px 14px" }}>
                    {r.status === "Archived" ? (
                      <Link
                        to="/admin/resources"
                        search={{ state: "default", banner: `${r.name} has been restored.` }}
                        style={{ fontSize: 15, color: WF_DARK, textDecoration: "underline" }}
                      >
                        Restore
                      </Link>
                    ) : (
                      <span style={{ display: "inline-flex", gap: 12 }}>
                        <Link to="/admin/resources/$id" params={{ id: r.id }} style={{ fontSize: 15, color: WF_DARK, textDecoration: "underline" }}>Edit</Link>
                        <button
                          onClick={() => setConfirm(r)}
                          style={{ background: "none", border: "none", padding: 0, fontSize: 15, color: WF_DARK, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit" }}
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

      <div style={{ marginTop: 24, padding: 12, border: `1px dashed ${WF_MID}`, fontSize: 13, color: WF_MID, fontStyle: "italic" }}>
        <div style={{ marginBottom: 6 }}>[ Prototype: switch list state ]</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(["default", "empty", "noresults", "loading"] as StateMode[]).map((s) => (
            <Link
              key={s}
              to="/admin/resources"
              search={{ state: s, banner: "" }}
              style={{ fontSize: 13, color: state === s ? WF_DARK : WF_MID, textDecoration: "underline", fontWeight: state === s ? 600 : 400 }}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <Modal open={!!confirm} title={`Archive ${confirm?.name}?`} onClose={() => setConfirm(null)}>
        <p style={{ fontSize: 15, color: WF_DARK, margin: "0 0 20px", lineHeight: 1.5 }}>
          It will no longer be shareable with new patients. Existing shares retain access.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Btn onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn
            primary
            to={`/admin/resources`}
            onClick={() => setConfirm(null)}
          >
            Archive resource
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
          {[200, 80, 140, 100, 100, 100, 80].map((w, j) => (
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
      <div style={{ width: 48, height: 48, border: `1.5px solid ${WF_MID}`, borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", color: WF_MID, fontSize: 24 }}>○</div>
      <div style={{ fontSize: 18, color: WF_DARK, marginBottom: 6 }}>No resources yet</div>
      <div style={{ fontSize: 15, color: WF_MID, marginBottom: 20 }}>
        Add your first resource to make it available to clinicians.
      </div>
      <Btn primary to="/admin/resources/new">+ Add resource</Btn>
    </div>
  );
}

function NoResultsState() {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 60, textAlign: "center" }}>
      <div style={{ fontSize: 16, color: WF_DARK, marginBottom: 12 }}>No resources match your search</div>
      <TextLink to="/admin/resources">Clear search</TextLink>
    </div>
  );
}
