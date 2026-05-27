import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Input, Select, Modal } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

export const Route = createFileRoute("/admin/audit")({
  component: AuditLog,
});

type Entry = {
  ts: string;
  user: string;
  role: "Admin" | "Clinician";
  action: string;
  record: string;
};

const SEED: Entry[] = [
  { ts: "May 27, 2026, 9:14 AM", user: "Dr. Sarah Chen", role: "Admin", action: "Platform setting changed — chat message updated", record: "—" },
  { ts: "May 27, 2026, 8:52 AM", user: "Admin", role: "Admin", action: "Patient added — invitation sent", record: "Emma Tremblay (•••• 4821)" },
  { ts: "May 26, 2026, 4:33 PM", user: "Dr. James Okafor", role: "Clinician", action: "Assigned clinician changed", record: "Lucas Okonkwo (•••• 3347)" },
  { ts: "May 26, 2026, 2:11 PM", user: "Admin", role: "Admin", action: "Invitation resent", record: "Sofia Andersen (•••• 9103)" },
  { ts: "May 25, 2026, 11:45 AM", user: "Admin", role: "Admin", action: "Clinician added — invitation sent", record: "Dr. Lisa Bouchard" },
  { ts: "May 24, 2026, 3:20 PM", user: "Nurse Priya Mehta", role: "Clinician", action: "Form published", record: "Monthly Check-in" },
  { ts: "May 23, 2026, 10:02 AM", user: "Admin", role: "Admin", action: "Resource added", record: "School Support Template" },
  { ts: "May 22, 2026, 9:30 AM", user: "Dr. Sarah Chen", role: "Admin", action: "Role changed — Clinician → Admin", record: "Dr. Sarah Chen" },
  { ts: "May 21, 2026, 5:14 PM", user: "Admin", role: "Admin", action: "Patient removed", record: "•••• 7799" },
  { ts: "May 20, 2026, 2:48 PM", user: "Admin", role: "Admin", action: "Health number edited", record: "Mateo Rivera (•••• 6612)" },
  { ts: "May 19, 2026, 11:11 AM", user: "Dr. James Okafor", role: "Clinician", action: "Patient profile edited — assigned clinician changed", record: "Aiden Nakamura (•••• 2289)" },
  { ts: "May 18, 2026, 4:05 PM", user: "Admin", role: "Admin", action: "Form archived", record: "Old Intake Form" },
  { ts: "May 17, 2026, 10:30 AM", user: "Admin", role: "Admin", action: "Platform setting changed — default roster sort updated", record: "—" },
  { ts: "May 16, 2026, 3:15 PM", user: "Nurse Priya Mehta", role: "Clinician", action: "Invitation resent", record: "Isla MacPherson (•••• 5503)" },
  { ts: "May 15, 2026, 9:00 AM", user: "Admin", role: "Admin", action: "Patient added — profile saved, no invitation sent", record: "Noah Mensah (•••• 8874)" },
];

const MORE: Entry[] = [
  { ts: "May 14, 2026, 2:42 PM", user: "Dr. James Okafor", role: "Clinician", action: "Form published", record: "Quarterly Review" },
  { ts: "May 13, 2026, 11:20 AM", user: "Admin", role: "Admin", action: "Resource archived", record: "Outdated PDF Guide" },
  { ts: "May 12, 2026, 4:18 PM", user: "Admin", role: "Admin", action: "Clinician deactivated", record: "Dr. Marcus Field" },
  { ts: "May 11, 2026, 10:05 AM", user: "Nurse Priya Mehta", role: "Clinician", action: "Patient profile edited", record: "Olivia Park (•••• 1234)" },
  { ts: "May 10, 2026, 9:33 AM", user: "Dr. Sarah Chen", role: "Admin", action: "Platform setting changed — chat enabled toggled", record: "—" },
];

const USERS = ["All users", "Admin", "Dr. Sarah Chen", "Dr. James Okafor", "Nurse Priya Mehta"];
const ACTIONS = [
  "All actions",
  "Patient added",
  "Patient removed",
  "Invitation sent",
  "Invitation resent",
  "Clinician added",
  "Clinician deactivated",
  "Role changed",
  "Form published",
  "Form archived",
  "Resource added",
  "Resource archived",
  "Platform setting changed",
  "Health number edited",
  "Assigned clinician changed",
  "Patient profile edited",
];

const TOTAL = 47;

function AuditLog() {
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-27");
  const [user, setUser] = useState("All users");
  const [action, setAction] = useState("All actions");
  const [loaded, setLoaded] = useState(15);
  const [exportOpen, setExportOpen] = useState(false);

  const allRows = useMemo(() => [...SEED, ...MORE], []);

  const visible = allRows.slice(0, loaded);

  const filtersActive =
    startDate !== "2026-05-01" ||
    endDate !== "2026-05-27" ||
    user !== "All users" ||
    action !== "All actions";

  function clearFilters() {
    setStartDate("2026-05-01");
    setEndDate("2026-05-27");
    setUser("All users");
    setAction("All actions");
  }

  return (
    <AdminShell heading="">
      <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, margin: "0 0 6px 0" }}>
        Audit log
      </h1>
      <p style={{ fontSize: 13, color: WF_MID, margin: "0 0 24px 0" }}>
        A read-only record of all admin and clinical actions in this clinic.
      </p>

      {/* Filters */}
      <div
        style={{
          background: "#fff",
          border: `1px solid ${WF_MID}`,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1.3fr auto",
            gap: 12,
            alignItems: "end",
          }}
        >
          <div>
            <Label>Date range</Label>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: 12, color: WF_MID }}>–</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>
          <div>
            <Label>User</Label>
            <Select value={user} onChange={(e) => setUser(e.target.value)}>
              {USERS.map((u) => <option key={u}>{u}</option>)}
            </Select>
          </div>
          <div>
            <Label>Action type</Label>
            <Select value={action} onChange={(e) => setAction(e.target.value)}>
              {ACTIONS.map((a) => <option key={a}>{a}</option>)}
            </Select>
          </div>
          <Btn onClick={() => setExportOpen(true)}>Export CSV</Btn>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
          <Btn primary small>Apply filters</Btn>
          {filtersActive && (
            <button
              onClick={clearFilters}
              style={{
                background: "none",
                border: "none",
                color: WF_DARK,
                fontSize: 12,
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: `1px solid ${WF_MID}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${WF_MID}`, background: "#FAFAFA" }}>
              <Th>Timestamp</Th>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Action</Th>
              <Th>Affected record</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <Row key={i} row={row} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "20px 0" }}>
        <div style={{ fontSize: 12, color: WF_MID }}>
          Showing {visible.length} of {TOTAL} entries
        </div>
        {loaded < allRows.length && (
          <Btn onClick={() => setLoaded(Math.min(loaded + 5, allRows.length))}>
            Load more
          </Btn>
        )}
      </div>

      <PrototypeBack to="/admin" />

      <Modal open={exportOpen} title="Export audit log?" onClose={() => setExportOpen(false)}>
        <p style={{ fontSize: 13, color: WF_DARK, lineHeight: 1.5, margin: "0 0 20px 0" }}>
          This will download all log entries matching your current filters as a CSV file.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Btn onClick={() => setExportOpen(false)}>Cancel</Btn>
          <Btn primary onClick={() => setExportOpen(false)}>Export</Btn>
        </div>
      </Modal>
    </AdminShell>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: WF_MID, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
      {children}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "10px 14px",
        fontSize: 11,
        fontWeight: 600,
        color: WF_DARK,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}
    >
      {children}
    </th>
  );
}

function Row({ row }: { row: Entry }) {
  return (
    <tr
      style={{ borderBottom: `1px solid #F0F0F0` }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Td muted>{row.ts}</Td>
      <Td muted>{row.user}</Td>
      <Td muted>
        <span style={{ fontSize: 12 }}>{row.role}</span>
      </Td>
      <Td>
        <span style={{ fontWeight: 500, color: WF_DARK }}>{row.action}</span>
      </Td>
      <Td muted>{row.record}</Td>
    </tr>
  );
}

function Td({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <td
      style={{
        padding: "12px 14px",
        fontSize: 13,
        color: muted ? WF_MID : WF_DARK,
        verticalAlign: "top",
      }}
    >
      {children}
    </td>
  );
}
