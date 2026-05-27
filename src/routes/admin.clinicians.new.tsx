import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Field, Input, Select, TextLink } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

type Tab = "individual" | "csv";

export const Route = createFileRoute("/admin/clinicians/new")({
  validateSearch: (s: Record<string, unknown>) => ({
    tab: (s.tab as Tab) || "individual",
  }),
  component: AddClinician,
});

function AddClinician() {
  const { tab } = useSearch({ from: "/admin/clinicians/new" });

  return (
    <AdminShell heading="">
      <div style={{ marginBottom: 12 }}>
        <Link to="/admin/clinicians" search={{ state: "default", sso: "off", banner: "" }} style={{ fontSize: 12, color: WF_MID, textDecoration: "underline" }}>
          ← Clinician management
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${WF_MID}`, marginBottom: 24 }}>
        {([["individual", "Add individually"], ["csv", "Upload CSV"]] as Array<[Tab, string]>).map(([t, label]) => {
          const active = tab === t;
          return (
            <Link
              key={t}
              to="/admin/clinicians/new"
              search={{ tab: t }}
              style={{
                padding: "10px 18px",
                fontSize: 13,
                color: active ? WF_DARK : WF_MID,
                fontWeight: active ? 600 : 400,
                textDecoration: "none",
                borderBottom: active ? `2px solid ${WF_DARK}` : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {tab === "individual" ? <IndividualForm /> : <CsvUpload />}

      <PrototypeBack to="/admin/clinicians" />
    </AdminShell>
  );
}

function IndividualForm() {
  const nav = useNavigate();
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("Clinician");

  const valid = first && last && email && title && role;

  function submit() {
    nav({
      to: "/admin/clinicians",
      search: { state: "default", sso: "off", banner: `Invitation sent to ${first} ${last} at ${email}.` },
    });
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, marginTop: 0, marginBottom: 20 }}>
        Add a clinician
      </h1>

      <Field label="First name" required>
        <Input value={first} onChange={(e) => setFirst(e.target.value)} />
      </Field>
      <Field label="Last name" required>
        <Input value={last} onChange={(e) => setLast(e.target.value)} />
      </Field>
      <Field label="Email address" required>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="Title" required helper="e.g. Endocrinologist, Diabetes Nurse Educator">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Role" required>
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Clinician</option>
          <option>Admin</option>
        </Select>
      </Field>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
        <TextLink to="/admin/clinicians">Cancel</TextLink>
        <Btn primary disabled={!valid} onClick={submit}>Send invitation</Btn>
      </div>
    </div>
  );
}

type CsvRow = {
  row: number;
  first: string;
  last: string;
  email: string;
  title: string;
  role: string;
  status: "Ready" | "Error";
  error?: string;
};

const MOCK_CSV: CsvRow[] = [
  { row: 1, first: "Anna", last: "Williams", email: "a.williams@clinic.ca", title: "Endocrinologist", role: "Clinician", status: "Ready" },
  { row: 2, first: "Ben", last: "Torres", email: "b.torres@clinic.ca", title: "Diabetes Nurse", role: "Clinician", status: "Ready" },
  { row: 3, first: "Clare", last: "Dumont", email: "c.dumont@clinic.ca", title: "Dietician", role: "Admin", status: "Ready" },
  { row: 4, first: "David", last: "Kim", email: "d.kim@clinic.ca", title: "Endocrinologist", role: "Clinician", status: "Ready" },
  { row: 5, first: "", last: "", email: "missing@clinic.ca", title: "", role: "", status: "Error", error: "First name and title are required" },
];

function CsvUpload() {
  const nav = useNavigate();
  const [uploaded, setUploaded] = useState(false);

  const validCount = MOCK_CSV.filter((r) => r.status === "Ready").length;
  const hasErrors = MOCK_CSV.some((r) => r.status === "Error");

  function submit() {
    nav({
      to: "/admin/clinicians",
      search: { state: "default", sso: "off", banner: `${validCount} invitations sent.` },
    });
  }

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, marginTop: 0, marginBottom: 20 }}>
        Upload clinicians via CSV
      </h1>

      <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: WF_DARK, marginBottom: 8 }}>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: WF_DARK, textDecoration: "underline" }}>Download the CSV template</a>
        </div>
        <div style={{ fontSize: 12, color: WF_MID, lineHeight: 1.6 }}>
          Columns required: First name, Last name, Email, Title, Role<br />
          Supported role values: &quot;Clinician&quot; or &quot;Admin&quot;
        </div>
      </div>

      {!uploaded ? (
        <div
          onClick={() => setUploaded(true)}
          style={{
            border: `1.5px dashed ${WF_MID}`,
            background: "#fff",
            padding: 60,
            textAlign: "center",
            cursor: "pointer",
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 14, color: WF_DARK, marginBottom: 6 }}>Drag and drop CSV here</div>
          <div style={{ fontSize: 12, color: WF_MID }}>
            or <span style={{ textDecoration: "underline" }}>browse to upload</span> — .csv only, max 5MB
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: WF_DARK, marginBottom: 8 }}>
            Validation preview — {validCount} valid, {MOCK_CSV.length - validCount} error
          </div>
          <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, marginBottom: 20, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F5F5F5", borderBottom: `1px solid ${WF_MID}` }}>
                  {["Row", "First name", "Last name", "Email", "Title", "Role", "Status"].map((h) => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_CSV.map((r) => (
                  <tr key={r.row} style={{ borderBottom: `0.5px solid ${WF_MID}`, background: r.status === "Error" ? "#F5F5F5" : "#fff" }}>
                    <td style={{ padding: "10px 12px", color: WF_DARK }}>{r.row}</td>
                    <td style={{ padding: "10px 12px", color: r.first ? WF_DARK : WF_MID }}>{r.first || "—"}</td>
                    <td style={{ padding: "10px 12px", color: r.last ? WF_DARK : WF_MID }}>{r.last || "—"}</td>
                    <td style={{ padding: "10px 12px", color: WF_DARK }}>{r.email}</td>
                    <td style={{ padding: "10px 12px", color: r.title ? WF_DARK : WF_MID }}>{r.title || "—"}</td>
                    <td style={{ padding: "10px 12px", color: r.role ? WF_DARK : WF_MID }}>{r.role || "—"}</td>
                    <td style={{ padding: "10px 12px" }}>
                      {r.status === "Ready" ? (
                        <span style={{ fontSize: 12, color: WF_DARK }}>Ready</span>
                      ) : (
                        <span style={{ fontSize: 12, color: WF_DARK, fontWeight: 600 }}>Error — {r.error}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TextLink to="/admin/clinicians">Cancel</TextLink>
        <div title={hasErrors ? "Fix errors before sending" : undefined}>
          <Btn primary disabled={!uploaded || hasErrors} onClick={submit}>
            Send {validCount} invitations
          </Btn>
        </div>
      </div>
    </div>
  );
}
