import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo, useState, useRef, useEffect } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Input, Select, Pill, TextLink } from "@/components/patient-ui";
import { WF_DARK, WF_MID, TEAL, WARN_BG, WARN_TEXT } from "@/components/wireframe";
import { CLINICIAN_TO_PATIENT_IDS } from "@/lib/clinician-assignments";

type StateMode = "default" | "empty" | "noresults" | "loading";

const CLINICIAN_NAMES: Record<string, string> = {
  "sarah-chen": "Dr. Sarah Chen",
  "james-okafor": "Dr. James Okafor",
  "priya-mehta": "Nurse Priya Mehta",
  "lisa-bouchard": "Dr. Lisa Bouchard",
  "tom-park": "Dietician Tom Park",
  "kevin-marsh": "Dr. Kevin Marsh",
};

export const Route = createFileRoute("/admin/patients/")({
  validateSearch: (s: Record<string, unknown>) => ({
    state: (s.state as StateMode) || "default",
    banner: (s.banner as string) || "",
    assignedTo: (s.assignedTo as string) || "",
  }),
  component: PatientList,
});

type Patient = {
  id: string;
  name: string;
  last4: string;
  status: "Active" | "Invited" | "Not yet invited" | "Expired" | "Bounced";
  added: string;
  lastLogin: string;
};

const PATIENTS: Patient[] = [
  { id: "emma-tremblay", name: "Emma Tremblay", last4: "0001", status: "Active", added: "Jan 14, 2026", lastLogin: "2 days ago" },
  { id: "lucas-okonkwo", name: "Lucas Okonkwo", last4: "0002", status: "Active", added: "Feb 3, 2026", lastLogin: "1 week ago" },
  { id: "sofia-andersen", name: "Sofia Andersen", last4: "0003", status: "Invited", added: "Mar 20, 2026", lastLogin: "Never" },
  { id: "mateo-rivera", name: "Mateo Rivera", last4: "6612", status: "Invited", added: "Apr 5, 2026", lastLogin: "Never" },
  { id: "chloe-bergeron", name: "Chloe Bergeron", last4: "7754", status: "Not yet invited", added: "Apr 28, 2026", lastLogin: "Never" },
  { id: "aiden-nakamura", name: "Aiden Nakamura", last4: "2289", status: "Active", added: "May 1, 2026", lastLogin: "Today" },
  { id: "isla-macpherson", name: "Isla MacPherson", last4: "5503", status: "Invited", added: "May 10, 2026", lastLogin: "Never" },
  { id: "noah-mensah", name: "Noah Mensah", last4: "8874", status: "Not yet invited", added: "May 15, 2026", lastLogin: "Never" },
  { id: "lucas-fernandez", name: "Lucas Fernandez", last4: "3312", status: "Bounced", added: "Apr 12, 2026", lastLogin: "Never" },
  { id: "maya-thornton", name: "Maya Thornton", last4: "6628", status: "Expired", added: "Feb 3, 2026", lastLogin: "Never" },
];

function statusPill(s: Patient["status"]) {
  if (s === "Active") return <Pill label="Active" weight="dark" />;
  if (s === "Invited") return <Pill label="Invited" weight="mid" />;
  if (s === "Expired") return <Pill label="Expired" weight="light" />;
  if (s === "Bounced") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: WARN_BG,
          color: WARN_TEXT,
          borderRadius: 999,
          padding: "2px 10px",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        Bounced
      </span>
    );
  }
  return <Pill label="Not yet invited" weight="light" />;
}

function StatusCell({ p }: { p: Patient }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
      {statusPill(p.status)}
    </div>
  );
}

function AddPatientSplitButton() {
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
    fontSize: 15,
    fontFamily: "inherit",
    border: `1px solid ${TEAL}`,
    background: TEAL,
    color: "#fff",
    cursor: "pointer",
    textDecoration: "none",
    boxSizing: "border-box",
    padding: "0 14px",
  };

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-flex" }}>
      <Link
        to="/admin/patients/new"
        style={{
          ...shared,
          borderRight: "none",
          borderRadius: "4px 0 0 4px",
          paddingRight: 12,
        }}
      >
        + Add new patient
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
        aria-label="Add patient options"
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
            to="/admin/patients/new"
            onClick={() => setOpen(false)}
            style={{
              display: "block",
              padding: "10px 14px",
              fontSize: 15,
              color: WF_DARK,
              textDecoration: "none",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            Add individually
          </Link>
          <div style={{ height: 1, background: WF_MID, opacity: 0.3 }} />
          <Link
            to="/admin/patients/new/batch"
            onClick={() => setOpen(false)}
            style={{
              display: "block",
              padding: "10px 14px",
              fontSize: 15,
              color: WF_DARK,
              textDecoration: "none",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
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

function PatientList() {
  const { state, banner, assignedTo } = useSearch({ from: "/admin/patients/" });
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bannerOpen, setBannerOpen] = useState(true);

  const assignedClinicianName = assignedTo ? CLINICIAN_NAMES[assignedTo] : "";
  const assignedIds = assignedTo ? CLINICIAN_TO_PATIENT_IDS[assignedTo] || [] : null;

  const visible: Patient[] = useMemo(() => {
    if (state === "empty") return [];
    if (state === "noresults") return [];
    let rows = PATIENTS;
    if (assignedIds) rows = rows.filter((p) => assignedIds.includes(p.id));
    if (statusFilter !== "All") rows = rows.filter((p) => p.status === statusFilter);
    if (q.trim()) rows = rows.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) || p.last4.includes(q),
    );
    return rows;
  }, [q, statusFilter, state, assignedIds]);

  const clearAssignedFilter = () =>
    navigate({ to: "/admin/patients", search: { state: "default", banner: "", assignedTo: "" } });

  return (
    <AdminShell heading="">
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, marginTop: -8 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "rgb(18, 87, 92)", margin: 0 }}>
          Patient management
        </h1>
        <AddPatientSplitButton />
      </div>

      {/* Assigned-to filter chip */}
      {assignedClinicianName && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 0" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: `1px solid ${WF_DARK}`,
              padding: "6px 10px",
              fontSize: 14,
              color: WF_DARK,
              background: "#F5F5F5",
            }}
          >
            Showing patients assigned to {assignedClinicianName}
            <button
              onClick={clearAssignedFilter}
              aria-label="Clear filter"
              style={{ background: "none", border: "none", cursor: "pointer", color: WF_DARK, fontSize: 16, lineHeight: 1, padding: 0 }}
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* Success banner */}
      {banner && bannerOpen && (
        <div
          style={{
            border: `1px solid ${WF_DARK}`,
            background: "#fff",
            padding: "10px 14px",
            fontSize: 15,
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
            style={{ background: "none", border: "none", cursor: "pointer", color: WF_DARK, fontSize: 18 }}
          >
            ×
          </button>
        </div>
      )}

      {/* Expiry action banner — persistent */}
      {PATIENTS.some((p) => p.status === "Expired") && (
        <div
          style={{
            border: `2px solid ${WF_DARK}`,
            background: "#fff",
            padding: "12px 16px",
            fontSize: 15,
            color: WF_DARK,
            margin: "16px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            {PATIENTS.filter((p) => p.status === "Expired").length} invitation
            {PATIENTS.filter((p) => p.status === "Expired").length === 1 ? "" : "s"} have expired and need your attention.
          </span>
          <button
            onClick={() => setStatusFilter("Expired")}
            style={{ background: "none", border: "none", cursor: "pointer", color: WF_DARK, fontSize: 15, textDecoration: "underline", fontFamily: "inherit", padding: 0 }}
          >
            Review
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
          <option>Expired</option>
        </Select>
        <div style={{ flex: 1, textAlign: "right", fontSize: 14, color: WF_MID }}>
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
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr style={{ background: "#F5F5F5", borderBottom: `1px solid ${WF_MID}` }}>
                {["Name", "Health number", "Status", "Date added", "Last login", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 13, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}>
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
                  <td style={{ padding: "12px 14px" }}><StatusCell p={p} /></td>
                  <td style={{ padding: "12px 14px", color: WF_DARK }}>{p.added}</td>
                  <td style={{ padding: "12px 14px", color: p.lastLogin === "Never" ? WF_MID : WF_DARK }}>
                    {p.lastLogin}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <Link
                      to="/admin/patients/$id"
                      params={{ id: p.id }}
                      style={{ fontSize: 15, color: WF_DARK, textDecoration: "underline" }}
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
      <div style={{ marginTop: 24, padding: 12, border: `1px dashed ${WF_MID}`, fontSize: 13, color: WF_MID, fontStyle: "italic" }}>
        <div style={{ marginBottom: 6 }}>[ Prototype: switch list state ]</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(["default", "empty", "noresults", "loading"] as StateMode[]).map((s) => (
            <Link
              key={s}
              to="/admin/patients"
              search={{ state: s, banner: "", assignedTo: "" }}
              style={{
                fontSize: 13,
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
      <div style={{ width: 48, height: 48, border: `1.5px solid ${WF_MID}`, borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", color: WF_MID, fontSize: 24 }}>
        ○
      </div>
      <div style={{ fontSize: 18, color: WF_DARK, marginBottom: 6 }}>No patients yet</div>
      <div style={{ fontSize: 15, color: WF_MID, marginBottom: 20 }}>
        Add your first patient to get started
      </div>
      <Btn primary to="/admin/patients/new">+ Add new patient</Btn>
    </div>
  );
}

function NoResultsState({ query }: { query: string }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 60, textAlign: "center" }}>
      <div style={{ fontSize: 16, color: WF_DARK, marginBottom: 12 }}>
        No patients match &quot;{query}&quot;
      </div>
      <TextLink to="/admin/patients">Clear search</TextLink>
    </div>
  );
}
