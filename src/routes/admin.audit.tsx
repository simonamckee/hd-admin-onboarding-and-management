import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Btn, Input, Select, TextLink, Modal } from "@/components/patient-ui";
import { WF_DARK, WF_MID, TEAL } from "@/components/wireframe";

export const Route = createFileRoute("/admin/audit")({
  component: AuditLog,
});

const USERS = [
  "All users",
  "Admin",
  "Dr. Sarah Chen",
  "Dr. James Okafor",
  "Nurse Priya Mehta",
  "Dr. Lisa Bouchard",
];

const ACTION_TYPES = [
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

type AuditRow = {
  timestamp: string;
  user: string;
  role: "Admin" | "Clinician";
  action: string;
  affected: string;
};

const ALL_ROWS: AuditRow[] = [
  { timestamp: "May 27, 2026, 9:14 AM", user: "Dr. Sarah Chen", role: "Admin", action: "Platform setting changed — chat message updated", affected: "—" },
  { timestamp: "May 27, 2026, 8:52 AM", user: "Admin", role: "Admin", action: "Patient added — invitation sent", affected: "Emma Tremblay (•••• 4821)" },
  { timestamp: "May 26, 2026, 4:33 PM", user: "Dr. James Okafor", role: "Clinician", action: "Assigned clinician changed", affected: "Lucas Okonkwo (•••• 3347)" },
  { timestamp: "May 26, 2026, 2:11 PM", user: "Admin", role: "Admin", action: "Invitation resent", affected: "Sofia Andersen (•••• 9103)" },
  { timestamp: "May 25, 2026, 11:45 AM", user: "Admin", role: "Admin", action: "Clinician added — invitation sent", affected: "Dr. Lisa Bouchard" },
  { timestamp: "May 24, 2026, 3:20 PM", user: "Nurse Priya Mehta", role: "Clinician", action: "Form published", affected: "Monthly Check-in" },
  { timestamp: "May 23, 2026, 10:02 AM", user: "Admin", role: "Admin", action: "Resource added", affected: "School Support Template" },
  { timestamp: "May 22, 2026, 9:30 AM", user: "Dr. Sarah Chen", role: "Admin", action: "Role changed — Clinician → Admin", affected: "Dr. Sarah Chen" },
  { timestamp: "May 21, 2026, 5:14 PM", user: "Admin", role: "Admin", action: "Patient removed", affected: "•••• 7799" },
  { timestamp: "May 20, 2026, 2:48 PM", user: "Admin", role: "Admin", action: "Health number edited", affected: "Mateo Rivera (•••• 6612)" },
  { timestamp: "May 19, 2026, 11:11 AM", user: "Dr. James Okafor", role: "Clinician", action: "Patient profile edited — assigned clinician changed", affected: "Aiden Nakamura (•••• 2289)" },
  { timestamp: "May 18, 2026, 4:05 PM", user: "Admin", role: "Admin", action: "Form archived", affected: "Old Intake Form" },
  { timestamp: "May 17, 2026, 10:30 AM", user: "Admin", role: "Admin", action: "Platform setting changed — default roster sort updated", affected: "—" },
  { timestamp: "May 16, 2026, 3:15 PM", user: "Nurse Priya Mehta", role: "Clinician", action: "Invitation resent", affected: "Isla MacPherson (•••• 5503)" },
  { timestamp: "May 15, 2026, 9:00 AM", user: "Admin", role: "Admin", action: "Patient added — profile saved, no invitation sent", affected: "Noah Mensah (•••• 8874)" },
  { timestamp: "May 14, 2026, 4:22 PM", user: "Dr. Sarah Chen", role: "Admin", action: "Clinician deactivated", affected: "Dr. Michael Torres" },
  { timestamp: "May 13, 2026, 11:05 AM", user: "Admin", role: "Admin", action: "Resource archived", affected: "Old Nutrition Guide" },
  { timestamp: "May 12, 2026, 9:47 AM", user: "Dr. James Okafor", role: "Clinician", action: "Patient profile edited — contact updated", affected: "Emma Tremblay (•••• 4821)" },
  { timestamp: "May 11, 2026, 3:30 PM", user: "Nurse Priya Mehta", role: "Clinician", action: "Platform setting changed — reminder frequency updated", affected: "—" },
  { timestamp: "May 10, 2026, 10:15 AM", user: "Admin", role: "Admin", action: "Patient added — invitation sent", affected: "Olivia Chen (•••• 1124)" },
  { timestamp: "May 9, 2026, 2:05 PM", user: "Dr. Lisa Bouchard", role: "Clinician", action: "Assigned clinician changed", affected: "Lucas Okonkwo (•••• 3347)" },
  { timestamp: "May 8, 2026, 8:40 AM", user: "Admin", role: "Admin", action: "Health number edited", affected: "Sofia Andersen (•••• 9103)" },
  { timestamp: "May 7, 2026, 1:12 PM", user: "Dr. Sarah Chen", role: "Admin", action: "Role changed — Admin → Clinician", affected: "Nurse Priya Mehta" },
  { timestamp: "May 6, 2026, 11:00 AM", user: "Admin", role: "Admin", action: "Form published", affected: "Annual Review" },
  { timestamp: "May 5, 2026, 9:30 AM", user: "Dr. James Okafor", role: "Clinician", action: "Patient removed", affected: "•••• 2210" },
  { timestamp: "May 4, 2026, 4:45 PM", user: "Admin", role: "Admin", action: "Resource added", affected: "CGM Troubleshooting" },
  { timestamp: "May 3, 2026, 10:20 AM", user: "Dr. Lisa Bouchard", role: "Clinician", action: "Invitation resent", affected: "Mateo Rivera (•••• 6612)" },
  { timestamp: "May 2, 2026, 8:00 AM", user: "Admin", role: "Admin", action: "Clinician added — invitation sent", affected: "Nurse Priya Mehta" },
  { timestamp: "May 1, 2026, 3:15 PM", user: "Dr. Sarah Chen", role: "Admin", action: "Platform setting changed — clinic name format updated", affected: "—" },
  { timestamp: "May 1, 2026, 9:00 AM", user: "Admin", role: "Admin", action: "Patient added — profile saved, no invitation sent", affected: "Zara Patel (•••• 3391)" },
];

function AuditLog() {
  const [startDate, setStartDate] = useState("May 1, 2026");
  const [endDate, setEndDate] = useState("May 27, 2026");
  const [userFilter, setUserFilter] = useState("All users");
  const [actionFilter, setActionFilter] = useState("All actions");
  const [visibleCount, setVisibleCount] = useState(15);
  const [exportOpen, setExportOpen] = useState(false);

  const filtersActive = userFilter !== "All users" || actionFilter !== "All actions";

  const filteredRows = useMemo(() => {
    let rows = ALL_ROWS;
    if (userFilter !== "All users") {
      rows = rows.filter((r) => r.user === userFilter);
    }
    if (actionFilter !== "All actions") {
      rows = rows.filter((r) => r.action.toLowerCase().includes(actionFilter.toLowerCase()));
    }
    return rows;
  }, [userFilter, actionFilter]);

  const visibleRows = filteredRows.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRows.length;

  const inputStyle: React.CSSProperties = {
    padding: "8px 12px",
    border: `1px solid ${WF_MID}`,
    background: "#fff",
    fontSize: 15,
    color: WF_DARK,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
  };

  return (
    <AdminShell heading="">
      {/* Title + subtitle */}
      <h1 style={{ fontSize: 24, fontWeight: 700, color: TEAL, margin: "0 0 6px 0" }}>Audit log</h1>
      <p style={{ fontSize: 15, color: WF_MID, margin: "0 0 20px 0" }}>
        A read-only record of all admin and clinical actions in this clinic.
      </p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ minWidth: 180, flex: 1 }}>
          <div style={{ fontSize: 13, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Date range</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={inputStyle}
            />
            <span style={{ fontSize: 15, color: WF_MID }}>–</span>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ minWidth: 160, flex: 1 }}>
          <div style={{ fontSize: 13, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>User</div>
          <Select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} style={{ width: "100%" }}>
            {USERS.map((u) => <option key={u}>{u}</option>)}
          </Select>
        </div>
        <div style={{ minWidth: 200, flex: 2 }}>
          <div style={{ fontSize: 13, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Action type</div>
          <Select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} style={{ width: "100%" }}>
            {ACTION_TYPES.map((a) => <option key={a}>{a}</option>)}
          </Select>
        </div>
        <div style={{ minWidth: 120 }}>
          <Btn onClick={() => setExportOpen(true)}>Export CSV</Btn>
        </div>
      </div>

      {/* Apply / Clear */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <Btn primary onClick={() => {/* prototype only */}}>Apply filters</Btn>
        {filtersActive && (
          <TextLink onClick={() => { setUserFilter("All users"); setActionFilter("All actions"); }}>
            Clear filters
          </TextLink>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: `1px solid ${WF_MID}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
          <thead>
            <tr style={{ background: "#F5F5F5", borderBottom: `1px solid ${WF_MID}` }}>
              {["Timestamp", "User", "Role", "Action", "Affected record"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    fontSize: 13,
                    color: WF_MID,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontWeight: 500,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: `0.5px solid ${WF_MID}`,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "#FAFAFA"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
              >
                <td style={{ padding: "12px 14px", color: WF_MID, fontSize: 14, fontWeight: 400, whiteSpace: "nowrap" }}>
                  {row.timestamp}
                </td>
                <td style={{ padding: "12px 14px", color: WF_MID, fontWeight: 400 }}>
                  {row.user}
                </td>
                <td style={{ padding: "12px 14px", color: WF_MID, fontSize: 14, fontWeight: 400 }}>
                  {row.role}
                </td>
                <td style={{ padding: "12px 14px", color: WF_DARK, fontWeight: 500 }}>
                  {row.action}
                </td>
                <td style={{ padding: "12px 14px", color: WF_MID, fontWeight: 400 }}>
                  {row.affected}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
        <span style={{ fontSize: 14, color: WF_MID }}>
          Showing {visibleRows.length} of {filteredRows.length} entries
        </span>
        {hasMore && (
          <Btn onClick={() => setVisibleCount((c) => c + 5)}>Load more</Btn>
        )}
      </div>

      {/* Export modal */}
      <Modal open={exportOpen} title="Export audit log?" onClose={() => setExportOpen(false)}>
        <p style={{ fontSize: 15, color: WF_DARK, margin: "0 0 20px", lineHeight: 1.5 }}>
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
