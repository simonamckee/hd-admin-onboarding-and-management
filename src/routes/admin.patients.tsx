import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Input, Select, Pill, TextLink } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

type StateMode = "default" | "empty" | "noresults" | "loading";

export const Route = createFileRoute("/admin/patients")({
  validateSearch: (s: Record<string, unknown>) => ({
    state: (s.state as StateMode) || "default",
    banner: (s.banner as string) || "",
  }),
  component: PatientList,
});

type Patient = {
  id: string;
  name: string;
  last4: string;
  status: "Active" | "Invited" | "Not yet invited";
  added: string;
  lastLogin: string;
};

const PATIENTS: Patient[] = [
  { id: "emma-tremblay", name: "Emma Tremblay", last4: "4821", status: "Active", added: "Jan 14, 2026", lastLogin: "2 days ago" },
  { id: "lucas-okonkwo", name: "Lucas Okonkwo", last4: "3347", status: "Active", added: "Feb 3, 2026", lastLogin: "1 week ago" },
  { id: "sofia-andersen", name: "Sofia Andersen", last4: "9103", status: "Invited", added: "Mar 20, 2026", lastLogin: "Never" },
  { id: "mateo-rivera", name: "Mateo Rivera", last4: "6612", status: "Invited", added: "Apr 5, 2026", lastLogin: "Never" },
  { id: "chloe-bergeron", name: "Chloe Bergeron", last4: "7754", status: "Not yet invited", added: "Apr 28, 2026", lastLogin: "Never" },
  { id: "aiden-nakamura", name: "Aiden Nakamura", last4: "2289", status: "Active", added: "May 1, 2026", lastLogin: "Today" },
  { id: "isla-macpherson", name: "Isla MacPherson", last4: "5503", status: "Invited", added: "May 10, 2026", lastLogin: "Never" },
  { id: "noah-mensah", name: "Noah Mensah", last4: "8874", status: "Not yet invited", added: "May 15, 2026", lastLogin: "Never" },
];

function statusPill(s: Patient["status"]) {
  if (s === "Active") return <Pill label="Active" weight="dark" />;
  if (s === "Invited") return <Pill label="Invited" weight="mid" />;
  return <Pill label="Not yet invited" weight="light" />;
}

function PatientList() {
  const { state, banner } = useSearch({ from: "/admin/patients" });
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bannerOpen, setBannerOpen] = useState(true);

  const visible: Patient[] = useMemo(() => {
    if (state === "empty") return [];
    if (state === "noresults") return [];
    let rows = PATIENTS;
    if (statusFilter !== "All") rows = rows.filter((p) => p.status === statusFilter);
    if (q.trim()) rows = rows.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) || p.last4.includes(q),
    );
    return rows;
  }, [q, statusFilter, state]);

  return (
    <AdminShell heading="">
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, marginTop: -8 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, margin: 0 }}>
          Patient management
        </h1>
        <Btn primary to="/admin/patients/new">+ Add new patient</Btn>
      </div>

      {/* Success banner */}
      {banner && bannerOpen && (
        <div
          style={{
            border: `1px solid ${WF_DARK}`,
            background: "#fff",
            padding: "10px 14px",
            fontSize: 13,
            color: WF_DARK,
            margin: "16px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{banner}</span>
          <button
            onClick={() => setBannerOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", color: WF_DARK, fontSize: 16 }}
          >
            ×
          </button>
        </div>
      )}

      {/* Subheader row */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20, marginBottom: 16 }}>
        <div style={{ flex: 1, maxWidth: 360 }}>
          <Input
            placeholder="Search by name or health number"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 200 }}>
          <option>All statuses</option>
          <option>Active</option>
          <option>Invited</option>
          <option>Not yet invited</option>
        </Select>
        <div style={{ flex: 1, textAlign: "right", fontSize: 12, color: WF_MID }}>
          {state === "empty" ? "0 patients" : `${PATIENTS.length} patients`}
        </div>
      </div>

      {/* Table / states */}
      {state === "loading" ? (
        <SkeletonTable />
      ) : state === "empty" ? (
        <EmptyState />
      ) : state === "noresults" ? (
        <NoResultsState query="Smith" />
      ) : (
        <div style={{ background: "#fff", border: `1px solid ${WF_MID}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F5F5F5", borderBottom: `1px solid ${WF_MID}` }}>
                {["Name", "Health number", "Status", "Date added", "Last login", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id} style={{ borderBottom: `0.5px solid ${WF_MID}` }}>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{p.name}</td>
                  <td style={{ padding: "12px 14px", color: WF_DARK, fontFamily: "ui-monospace, monospace" }}>
                    •••• {p.last4}
                  </td>
                  <td style={{ padding: "12px 14px" }}>{statusPill(p.status)}</td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{p.added}</td>
                  <td style={{ padding: "12px 14px", color: p.lastLogin === "Never" ? WF_MID : WF_DARK }}>
                    {p.lastLogin}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <Link
                      to="/admin/patients/$id"
                      params={{ id: p.id }}
                      style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}
                    >
                      View
                    </Link>
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
            <Link
              key={s}
              to="/admin/patients"
              search={{ state: s, banner: "" }}
              style={{
                fontSize: 11,
                color: state === s ? WF_DARK : WF_MID,
                textDecoration: "underline",
                fontWeight: state === s ? 600 : 400,
              }}
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
          {[180, 100, 80, 100, 80, 60].map((w, j) => (
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
      <div style={{ width: 48, height: 48, border: `1.5px solid ${WF_MID}`, borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", color: WF_MID, fontSize: 22 }}>
        ○
      </div>
      <div style={{ fontSize: 16, color: WF_DARK, marginBottom: 6 }}>No patients yet</div>
      <div style={{ fontSize: 13, color: WF_MID, marginBottom: 20 }}>
        Add your first patient to get started
      </div>
      <Btn primary to="/admin/patients/new">+ Add new patient</Btn>
    </div>
  );
}

function NoResultsState({ query }: { query: string }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 60, textAlign: "center" }}>
      <div style={{ fontSize: 14, color: WF_DARK, marginBottom: 12 }}>
        No patients match &quot;{query}&quot;
      </div>
      <TextLink to="/admin/patients">Clear search</TextLink>
    </div>
  );
}
