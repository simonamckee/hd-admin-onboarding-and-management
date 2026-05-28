import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Field, Input, Select, TextLink, Callout } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

export const Route = createFileRoute("/admin/clinicians/new")({ component: AddClinician });

type Tab = "individual" | "csv";

function AddClinician() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("individual");

  return (
    <AdminShell heading="">
      <div style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 20px" }}>
          {tab === "individual" ? "Add a clinician" : "Upload clinicians via CSV"}
        </h1>

        {/* Segmented control */}
        <div style={{ display: "inline-flex", border: `1px solid ${WF_DARK}`, marginBottom: 28 }}>
          {(["individual", "csv"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 18px",
                fontSize: 13,
                background: tab === t ? WF_DARK : "#fff",
                color: tab === t ? "#fff" : WF_DARK,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {t === "individual" ? "Add individually" : "Upload CSV"}
            </button>
          ))}
        </div>

        {tab === "individual" ? <IndividualForm navigate={navigate} /> : <CsvForm navigate={navigate} />}
      </div>
      <PrototypeBack to="/admin/clinicians" />
    </AdminShell>
  );
}

function IndividualForm({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const [f, setF] = useState({ first: "", last: "", email: "", title: "", role: "Clinician" });
  const valid = f.first && f.last && f.email && f.title && f.role;

  return (
    <div style={{ maxWidth: 560 }}>
      <Field label="First name" required>
        <Input value={f.first} onChange={(e) => setF({ ...f, first: e.target.value })} />
      </Field>
      <Field label="Last name" required>
        <Input value={f.last} onChange={(e) => setF({ ...f, last: e.target.value })} />
      </Field>
      <Field label="Email address" required>
        <Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      </Field>
      <Field label="Title" required helper='e.g. "Endocrinologist"'>
        <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
      </Field>
      <Field label="Role" required>
        <Select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
          <option>Clinician</option>
          <option>Admin</option>
        </Select>
      </Field>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
        <TextLink to="/admin/clinicians">Cancel</TextLink>
        <Btn
          primary
          disabled={!valid}
          onClick={() =>
            navigate({
              to: "/admin/clinicians",
              search: {
                state: "default",
                sso: "off",
                banner: `Invitation sent to ${f.first} ${f.last} at ${f.email}.`,
              },
            })
          }
        >
          Send invitation
        </Btn>
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
  status: { ok: true } | { ok: false; msg: string };
};

const MOCK_ROWS: CsvRow[] = [
  { row: 1, first: "Anna", last: "Williams", email: "a.williams@clinic.ca", title: "Endocrinologist", role: "Clinician", status: { ok: true } },
  { row: 2, first: "Ben", last: "Torres", email: "b.torres@clinic.ca", title: "Diabetes Nurse", role: "Clinician", status: { ok: true } },
  { row: 3, first: "Clare", last: "Dumont", email: "c.dumont@clinic.ca", title: "Dietician", role: "Admin", status: { ok: true } },
  { row: 4, first: "David", last: "Kim", email: "d.kim@clinic.ca", title: "Endocrinologist", role: "Clinician", status: { ok: true } },
  { row: 5, first: "", last: "", email: "missing@clinic.ca", title: "", role: "", status: { ok: false, msg: "First name and title are required" } },
];

function CsvForm({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  const [uploaded, setUploaded] = useState(false);
  const validCount = MOCK_ROWS.filter((r) => r.status.ok).length;
  const hasErrors = MOCK_ROWS.some((r) => !r.status.ok);

  return (
    <div>
      <Callout>
        <div style={{ marginBottom: 6 }}>
          <TextLink onClick={() => {}}>Download the CSV template</TextLink>
        </div>
        <div style={{ fontSize: 12, color: WF_DARK }}>
          Columns required: First name, Last name, Email, Title, Role.<br />
          Supported role values: &quot;Clinician&quot; or &quot;Admin&quot;.
        </div>
      </Callout>

      {!uploaded ? (
        <div
          style={{
            border: `1.5px dashed ${WF_MID}`,
            background: "#fff",
            padding: "40px 20px",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 14, color: WF_DARK, marginBottom: 8 }}>
            Drag and drop your CSV here
          </div>
          <div style={{ fontSize: 12, color: WF_MID, marginBottom: 16 }}>
            or <TextLink onClick={() => setUploaded(true)}>browse to upload</TextLink>
          </div>
          <div style={{ fontSize: 11, color: WF_MID }}>.csv only · Max 5MB</div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: WF_DARK, marginBottom: 12 }}>
            Validation preview — {validCount} valid, {MOCK_ROWS.length - validCount} error
          </div>
          <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, marginBottom: 20, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F5F5F5", borderBottom: `1px solid ${WF_MID}` }}>
                  {["Row", "First name", "Last name", "Email", "Title", "Role", "Status"].map((h) => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_ROWS.map((r) => (
                  <tr key={r.row} style={{ borderBottom: `0.5px solid ${WF_MID}` }}>
                    <td style={{ padding: "8px 10px", color: WF_DARK }}>{r.row}</td>
                    <td style={{ padding: "8px 10px", color: r.first ? WF_DARK : WF_MID }}>{r.first || "—"}</td>
                    <td style={{ padding: "8px 10px", color: r.last ? WF_DARK : WF_MID }}>{r.last || "—"}</td>
                    <td style={{ padding: "8px 10px", color: WF_DARK }}>{r.email}</td>
                    <td style={{ padding: "8px 10px", color: r.title ? WF_DARK : WF_MID }}>{r.title || "—"}</td>
                    <td style={{ padding: "8px 10px", color: r.role ? WF_DARK : WF_MID }}>{r.role || "—"}</td>
                    <td style={{ padding: "8px 10px" }}>
                      {r.status.ok ? (
                        <span style={{ fontSize: 12, color: WF_DARK }}>Ready</span>
                      ) : (
                        <span style={{ fontSize: 12, color: WF_DARK, fontWeight: 600 }}>
                          Error — {r.status.msg}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginBottom: 16 }}>
            <TextLink onClick={() => setUploaded(false)}>Upload a different file</TextLink>
          </div>
        </>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <TextLink to="/admin/clinicians">Cancel</TextLink>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <Btn
            primary
            disabled={!uploaded || hasErrors}
            onClick={() =>
              navigate({
                to: "/admin/clinicians",
                search: { state: "default", sso: "off", banner: `${validCount} invitations sent.` },
              })
            }
          >
            Send {validCount} invitations
          </Btn>
          {uploaded && hasErrors && (
            <div style={{ fontSize: 11, color: WF_MID, fontStyle: "italic" }}>
              Fix errors before sending
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
