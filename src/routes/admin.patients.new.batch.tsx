import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Btn, TextLink, Callout } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

type Stage = "upload" | "review" | "done";

export const Route = createFileRoute("/admin/patients/new/batch")({
  validateSearch: (s: Record<string, unknown>) => ({
    stage: (s.stage as Stage) || "upload",
  }),
  component: BatchUploadPage,
});

function BatchUploadPage() {
  const { stage } = useSearch({ from: "/admin/patients/new/batch" });

  return (
    <AdminShell heading="">
      <div style={{ marginBottom: 12 }}>
        <Link
          to="/admin/patients"
          search={{ state: "default", banner: "", assignedTo: "" }}
          style={{ fontSize: 12, color: WF_DARK, textDecoration: "none" }}
        >
          ← Patient management
        </Link>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 500, color: WF_DARK, margin: "0 0 24px" }}>
        Upload patients via CSV
      </h1>

      {stage === "upload" && <UploadState />}
      {stage === "review" && <ReviewState />}
      {stage === "done" && <DoneState />}
    </AdminShell>
  );
}

// ---------- STATE 1 ----------

function UploadState() {
  const navigate = useNavigate();
  const [fileLoaded, setFileLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = () => setFileLoaded(true);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "55fr 45fr", gap: 32, paddingBottom: 80 }}>
        {/* Left column */}
        <div>
          <div style={{ fontSize: 13, color: WF_DARK, fontWeight: 600, marginBottom: 14 }}>
            Before you upload
          </div>

          <div style={{ marginBottom: 20 }}>
            <TextLink>Download the CSV template</TextLink>
            <div style={{ fontSize: 12, color: WF_MID, marginTop: 4, lineHeight: 1.5 }}>
              Open the template, fill in patient and supporter data, and save as a .csv file.
            </div>
          </div>

          <ColumnGroup label="Patient columns — required" items={[
            "First name",
            "Last name",
            "Date of birth (format: YYYY-MM-DD)",
            "Health number",
          ]} />

          <ColumnGroup label="Patient columns — optional" items={[
            "Gender (Male / Female / Non-binary / Prefer not to say / Other)",
            "Date of diagnosis (format: YYYY-MM-DD)",
            "Email address",
            "Phone number",
            "Invite now (Yes / No — defaults to No if omitted)",
            "Assigned clinician email (must match an active clinician in this clinic)",
          ]} />

          <div style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginTop: 8 }}>
            Supporter columns
          </div>
          <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 6, fontStyle: "italic" }}>
            Supporter 1 — required for patients under 18 in applicable provinces; optional for all others
          </div>
          <ColumnList items={[
            "Supporter 1 first name",
            "Supporter 1 last name",
            "Supporter 1 email",
            "Supporter 1 relationship (Parent / Guardian / Grandparent / Sibling / School staff / Other)",
            "Supporter 1 phone (optional)",
            "Supporter 1 invite channel (Email / SMS / Both — defaults to Email)",
          ]} />

          <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 6, marginTop: 12, fontStyle: "italic" }}>
            Supporter 2 — optional for all patients
          </div>
          <ColumnList items={[
            "Supporter 2 first name",
            "Supporter 2 last name",
            "Supporter 2 email",
            "Supporter 2 relationship",
            "Supporter 2 phone (optional)",
            "Supporter 2 invite channel (defaults to Email)",
          ]} />

          <div style={{ fontSize: 12, color: WF_MID, marginTop: 12, marginBottom: 20, lineHeight: 1.5 }}>
            Supporters 3–6 can be added from the patient&apos;s profile after upload. The CSV supports up to 2 supporters per patient.
          </div>

          <ColumnGroup label="File requirements" items={[
            "Format: .csv only",
            "Maximum: 200 patients per upload",
            "Maximum file size: 5MB",
            "First row must be the column header row",
          ]} />

          <Callout>
            Patients and supporters will receive an invitation email with instructions to connect their diabetes device. Device connection is part of onboarding — the invitation sets this expectation before they log in for the first time.
          </Callout>
        </div>

        {/* Right column */}
        <div>
          <div
            style={{
              border: `1.5px dashed ${WF_MID}`,
              background: "#fff",
              padding: 32,
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              textAlign: "center",
            }}
          >
            <svg width="38" height="44" viewBox="0 0 38 44" fill="none" aria-hidden>
              <rect x="3" y="3" width="32" height="38" stroke={WF_DARK} strokeWidth="1.2" />
              <path d="M19 28V14M19 14l-6 6M19 14l6 6" stroke={WF_DARK} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ fontSize: 14, color: WF_DARK, fontWeight: 500 }}>
              Drag and drop your CSV here
            </div>
            <button
              onClick={() => inputRef.current?.click()}
              style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
            >
              or browse to upload
            </button>
            <input ref={inputRef} type="file" accept=".csv" hidden onChange={onFile} />
            <div style={{ fontSize: 11, color: WF_MID, marginTop: 4 }}>
              .csv files only · max 5MB
            </div>
            {fileLoaded && (
              <div style={{ fontSize: 11, color: WF_DARK, marginTop: 8, fontStyle: "italic" }}>
                patients_june2026.csv selected
              </div>
            )}
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: WF_MID, fontStyle: "italic", textAlign: "center" }}>
            [ Prototype: click &quot;or browse&quot; to simulate upload ]
          </div>
        </div>
      </div>

      <StickyFooter
        left={
          <Link to="/admin/patients" search={{ state: "default", banner: "", assignedTo: "" }} style={footerLinkStyle}>
            Cancel
          </Link>
        }
        right={
          <Btn
            primary
            disabled={!fileLoaded}
            onClick={() => navigate({ to: "/admin/patients/new/batch", search: { stage: "review" } })}
          >
            Review patients →
          </Btn>
        }
      />
    </>
  );
}

function ColumnGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
        {label}
      </div>
      <ColumnList items={items} />
    </div>
  );
}

function ColumnList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: WF_DARK, lineHeight: 1.8 }}>
      {items.map((it) => (
        <li key={it}>{it}</li>
      ))}
    </ul>
  );
}

// ---------- STATE 2 ----------

type Row = {
  n: number;
  name: string;
  dob: string;
  hn: string;
  hnMasked?: string;
  invite: "Yes" | "No";
  supporters: string;
  ready: boolean;
  error?: string;
  errorLink?: { label: string; to?: string };
};

const ROWS: Row[] = [
  { n: 1, name: "Emma Tremblay", dob: "March 4, 2018", hn: "4821", hnMasked: "•••• 4821", invite: "Yes", supporters: "1 supporter (Marie Tremblay — Parent)", ready: true },
  { n: 2, name: "Lucas Okonkwo", dob: "Jan 12, 2010", hn: "3347", hnMasked: "•••• 3347", invite: "Yes", supporters: "1 supporter (Adaeze Okonkwo — Parent)", ready: true },
  { n: 3, name: "Sofia Andersen", dob: "July 8, 2014", hn: "9103", hnMasked: "•••• 9103", invite: "No", supporters: "1 supporter (Lars Andersen — Parent)", ready: true },
  { n: 4, name: "Mateo Rivera", dob: "Feb 22, 2016", hn: "6612", hnMasked: "•••• 6612", invite: "Yes", supporters: "None", ready: false, error: "A supporter is required for patients under 18 in British Columbia. Add at least one guardian to this row." },
  { n: 5, name: "Chloe Bergeron", dob: "Sept 1, 2019", hn: "7754", hnMasked: "•••• 7754", invite: "No", supporters: "1 supporter (Isabelle Bergeron — Parent)", ready: true },
  { n: 6, name: "—", dob: "Aug 3, 2011", hn: "2289", hnMasked: "•••• 2289", invite: "Yes", supporters: "1 supporter entered", ready: false, error: "First name is required" },
  { n: 7, name: "Noah Mensah", dob: "Nov 14, 2015", hn: "1234567890", invite: "No", supporters: "None", ready: false, error: "A patient with this health number already exists in your clinic.", errorLink: { label: "View existing patient →", to: "/admin/patients/noah-mensah" } },
  { n: 8, name: "Isla MacPherson", dob: "March 20, 2013", hn: "9999999999", invite: "Yes", supporters: "1 supporter entered", ready: false, error: "This health number already exists in Haibu Diabetes. Contact support@haibudiabetes.com to arrange a transfer." },
];

function ReviewState() {
  const navigate = useNavigate();
  const readyCount = ROWS.filter((r) => r.ready).length;
  const errorCount = ROWS.length - readyCount;
  const [tooltip, setTooltip] = useState(false);

  return (
    <>
      <div style={{ paddingBottom: 80 }}>
        {/* File summary */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${WF_MID}` }}>
          <div style={{ fontSize: 13, color: WF_DARK }}>
            <span style={{ fontWeight: 500 }}>patients_june2026.csv</span>
            <span style={{ color: WF_MID }}> — 2.1MB · 8 rows detected</span>
          </div>
          <Link
            to="/admin/patients/new/batch"
            search={{ stage: "upload" }}
            style={{ fontSize: 12, color: WF_DARK, textDecoration: "underline" }}
          >
            Remove file ×
          </Link>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", border: `1px solid ${WF_MID}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#F5F5F5", borderBottom: `1px solid ${WF_MID}` }}>
                {["Row", "Patient name", "DOB", "Health number", "Invite", "Supporters", "Status"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 10, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <RowGroup key={r.n} row={r} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, color: WF_DARK, fontWeight: 500 }}>
            {readyCount} rows ready · {errorCount} errors
          </div>
          <div style={{ fontSize: 12, color: WF_MID, marginTop: 4, lineHeight: 1.5 }}>
            Fix errors in your CSV file and re-upload to include those patients. You can proceed with the {readyCount} ready rows now.
          </div>
        </div>

        {/* Validation notes */}
        <div style={{ marginTop: 16 }}>
          <Callout>
            <p style={{ margin: "0 0 8px" }}>
              Rows with errors will not be uploaded. Fix your CSV and re-upload, or proceed with the rows that are ready.
            </p>
            <p style={{ margin: 0 }}>
              Patients marked Invite: Yes and their supporters will receive an invitation email with instructions to connect their diabetes device. Patients marked Invite: No will be saved as profiles — you can send invitations later from the patient list.
            </p>
          </Callout>
        </div>
      </div>

      <StickyFooter
        left={
          <Link to="/admin/patients/new/batch" search={{ stage: "upload" }} style={footerLinkStyle}>
            ← Back to upload
          </Link>
        }
        right={
          <div
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}
          >
            <Btn
              primary
              disabled={readyCount === 0}
              onClick={() => navigate({ to: "/admin/patients/new/batch", search: { stage: "done" } })}
            >
              Upload {readyCount} patients →
            </Btn>
            {tooltip && errorCount > 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  right: 0,
                  marginBottom: 8,
                  background: TEAL,
                  color: "#fff",
                  fontSize: 11,
                  padding: "6px 10px",
                  whiteSpace: "nowrap",
                  borderRadius: 3,
                }}
              >
                {errorCount} rows with errors will be skipped.
              </div>
            )}
          </div>
        }
      />
    </>
  );
}

function RowGroup({ row }: { row: Row }) {
  const errorRowBg = row.ready ? "transparent" : "#FAFAFA";
  return (
    <>
      <tr
        style={{
          borderBottom: row.error ? "none" : `0.5px solid ${WF_MID}`,
          borderLeft: row.ready ? "none" : `3px solid ${WF_DARK}`,
          background: errorRowBg,
        }}
      >
        <td style={cellStyle}>{row.n}</td>
        <td style={cellStyle}>{row.name}</td>
        <td style={cellStyle}>{row.dob}</td>
        <td style={{ ...cellStyle, fontFamily: "ui-monospace, monospace" }}>
          {row.ready ? row.hnMasked : row.hn}
        </td>
        <td style={cellStyle}>{row.invite}</td>
        <td style={cellStyle}>{row.supporters}</td>
        <td style={cellStyle}>
          {row.ready ? (
            <span style={{ fontSize: 11, color: WF_MID }}>Ready</span>
          ) : (
            <span style={{ fontSize: 11, color: WF_DARK, fontWeight: 600, border: `1.5px solid ${WF_DARK}`, padding: "1px 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Error
            </span>
          )}
        </td>
      </tr>
      {row.error && (
        <tr style={{ borderBottom: `0.5px solid ${WF_MID}`, borderLeft: `3px solid ${WF_DARK}`, background: errorRowBg }}>
          <td colSpan={7} style={{ padding: "0 12px 12px 36px", fontSize: 12, color: WF_DARK, lineHeight: 1.5 }}>
            {row.error}
            {row.errorLink && (
              <>
                {" "}
                {row.errorLink.to ? (
                  <Link to={row.errorLink.to} style={{ color: WF_DARK, textDecoration: "underline" }}>
                    {row.errorLink.label}
                  </Link>
                ) : (
                  <span style={{ textDecoration: "underline" }}>{row.errorLink.label}</span>
                )}
              </>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

const cellStyle = { padding: "12px", color: WF_DARK, verticalAlign: "top" as const };

// ---------- STATE 3 ----------

function DoneState() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "60px 20px", textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: `2px solid ${WF_DARK}`,
          margin: "0 auto 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          color: WF_DARK,
        }}
      >
        ✓
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 500, color: WF_DARK, margin: "0 0 20px" }}>
        4 patients uploaded
      </h1>
      <div style={{ fontSize: 13, color: WF_MID, lineHeight: 1.7, marginBottom: 28 }}>
        <div>Invitations sent to 3 patients and their supporters.</div>
        <div>1 patient saved without an invitation — invite them later from the patient list.</div>
        <div>Patients and supporters will be prompted to connect their diabetes device when they complete onboarding.</div>
      </div>
      <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 32 }}>
        4 rows had errors and were not uploaded.{" "}
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>Download error report →</span>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Btn
          primary
          onClick={() =>
            navigate({
              to: "/admin/patients",
              search: { state: "default", banner: "4 patients uploaded. 3 invitations sent.", assignedTo: "" },
            })
          }
        >
          Back to Patient management
        </Btn>
        <Btn onClick={() => navigate({ to: "/admin/patients/new/batch", search: { stage: "upload" } })}>
          Upload another CSV
        </Btn>
      </div>
    </div>
  );
}

// ---------- Sticky footer ----------

function StickyFooter({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#fff",
        borderTop: `1px solid ${WF_MID}`,
        padding: "14px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 20,
      }}
    >
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

const footerLinkStyle = {
  fontSize: 13,
  color: WF_DARK,
  textDecoration: "underline",
} as const;
