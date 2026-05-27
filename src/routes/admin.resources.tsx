import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Input, Select, Pill, Modal } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

type StateMode = "default" | "empty" | "noresults" | "loading";

type ResourceType = "Document" | "Link" | "Video";

type Resource = {
  id: string;
  name: string;
  type: ResourceType;
  added: string;
  lastUsed: string;
  addedBy: string;
  status: "Active" | "Archived";
  description?: string;
  fileName?: string;
  fileSize?: string;
  url?: string;
};

const RESOURCES: Resource[] = [
  { id: "r1", name: "Living Well with T1D", type: "Document", added: "Jan 8, 2026", lastUsed: "3 days ago", addedBy: "Admin", status: "Active", fileName: "Living_Well_T1D.pdf", fileSize: "1.4MB" },
  { id: "r2", name: "Carb Counting Guide", type: "Document", added: "Feb 1, 2026", lastUsed: "1 week ago", addedBy: "Dr. Sarah Chen", status: "Active" },
  { id: "r3", name: "How to Use Your CGM", type: "Video", added: "Feb 20, 2026", lastUsed: "2 weeks ago", addedBy: "Admin", status: "Active", url: "https://youtube.com/..." },
  { id: "r4", name: "Insulin Adjustment FAQ", type: "Link", added: "Mar 5, 2026", lastUsed: "1 month ago", addedBy: "Dr. James Okafor", status: "Active", url: "https://example.com/insulin-faq" },
  { id: "r5", name: "School Support Template", type: "Document", added: "Mar 22, 2026", lastUsed: "Never", addedBy: "Admin", status: "Active" },
  { id: "r6", name: "Old Nutrition Guide", type: "Document", added: "Aug 14, 2025", lastUsed: "5 months ago", addedBy: "Admin", status: "Archived" },
];

const TYPE_PILL_WEIGHT: Record<ResourceType, "dark" | "mid" | "light"> = {
  Document: "dark",
  Link: "mid",
  Video: "light",
};

export const Route = createFileRoute("/admin/resources")({
  validateSearch: (s: Record<string, unknown>) => ({
    state: (s.state as StateMode) || "default",
    banner: (s.banner as string) || "",
  }),
  component: ResourcesList,
});

function ResourcesList() {
  const { state, banner } = useSearch({ from: "/admin/resources" });
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [bannerOpen, setBannerOpen] = useState(true);
  const [archiveTarget, setArchiveTarget] = useState<Resource | null>(null);

  const visible: Resource[] = useMemo(() => {
    if (state === "empty" || state === "noresults") return [];
    let rows = RESOURCES;
    if (typeFilter !== "All types") rows = rows.filter((r) => r.type === typeFilter);
    if (statusFilter !== "All statuses") rows = rows.filter((r) => r.status === statusFilter);
    if (q.trim()) rows = rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
    return rows;
  }, [q, typeFilter, statusFilter, state]);

  function confirmArchive() {
    if (!archiveTarget) return;
    const name = archiveTarget.name;
    setArchiveTarget(null);
    nav({ to: "/admin/resources", search: { state: "default", banner: `${name} has been archived.` } });
  }

  return (
    <AdminShell heading="">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, margin: 0 }}>Resource library</h1>
        <Btn primary to="/admin/resources/new">+ Add resource</Btn>
      </div>

      {banner && bannerOpen && (
        <div style={{ border: `1px solid ${WF_DARK}`, background: "#fff", padding: "10px 14px", fontSize: 13, color: WF_DARK, margin: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{banner}</span>
          <button onClick={() => setBannerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: WF_DARK, fontSize: 16 }}>×</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, marginBottom: 16 }}>
        <div style={{ flex: 1, maxWidth: 280 }}>
          <Input placeholder="Search resources" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ width: 150 }}>
          <option>All types</option>
          <option>Document</option>
          <option>Link</option>
          <option>Video</option>
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 150 }}>
          <option>All statuses</option>
          <option>Active</option>
          <option>Archived</option>
        </Select>
        <div style={{ flex: 1, textAlign: "right", fontSize: 12, color: WF_MID }}>
          {state === "empty" ? "0 resources" : `${RESOURCES.length} resources`}
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
                {["Resource name", "Type", "Date added", "Last used", "Added by", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} style={{ borderBottom: `0.5px solid ${WF_MID}` }}>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{r.name}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <Pill label={r.type} weight={TYPE_PILL_WEIGHT[r.type]} />
                  </td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{r.added}</td>
                  <td style={{ padding: "12px 14px", color: r.lastUsed === "Never" ? WF_MID : WF_DARK }}>{r.lastUsed}</td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{r.addedBy}</td>
                  <td style={{ padding: "12px 14px" }}>
                    {r.status === "Active" ? (
                      <span style={{ display: "flex", gap: 14 }}>
                        <Link to="/admin/resources/$id" params={{ id: r.id }} style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}>Edit</Link>
                        <button onClick={() => setArchiveTarget(r)} style={{ background: "none", border: "none", padding: 0, fontSize: 13, color: WF_DARK, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit" }}>Archive</button>
                      </span>
                    ) : (
                      <Link to="/admin/resources" search={{ state: "default", banner: `${r.name} has been restored.` }} style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}>Restore</Link>
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
            <Link key={s} to="/admin/resources" search={{ state: s, banner: "" }} style={{ fontSize: 11, color: state === s ? WF_DARK : WF_MID, textDecoration: "underline", fontWeight: state === s ? 600 : 400 }}>{s}</Link>
          ))}
        </div>
      </div>

      <Modal open={!!archiveTarget} title={`Archive ${archiveTarget?.name}?`} onClose={() => setArchiveTarget(null)}>
        <div style={{ fontSize: 13, color: WF_DARK, marginBottom: 20, lineHeight: 1.5 }}>
          It will no longer be shareable with new patients. Existing shares retain access.
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Btn onClick={() => setArchiveTarget(null)}>Cancel</Btn>
          <Btn primary onClick={confirmArchive}>Archive resource</Btn>
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
          {[200, 80, 100, 100, 140, 100].map((w, j) => (
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
      <div style={{ fontSize: 16, color: WF_DARK, marginBottom: 6 }}>No resources yet</div>
      <div style={{ fontSize: 13, color: WF_MID, marginBottom: 20 }}>Add your first resource to make it available to clinicians.</div>
      <Btn primary to="/admin/resources/new">+ Add resource</Btn>
    </div>
  );
}

function NoResults() {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 60, textAlign: "center" }}>
      <div style={{ fontSize: 14, color: WF_DARK, marginBottom: 12 }}>No resources match your search</div>
      <Link to="/admin/resources" search={{ state: "default", banner: "" }} style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}>Clear search</Link>
    </div>
  );
}
