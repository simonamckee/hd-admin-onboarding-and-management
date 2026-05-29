import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Btn, TextLink, Callout } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

type Stage = "upload" | "review" | "done";

export const Route = createFileRoute("/admin/clinicians/batch")({
  validateSearch: (s: Record<string, unknown>) => ({
    stage: (s.stage as Stage) || "upload",
  }),
  component: BatchUploadPage,
});

function BatchUploadPage() {
  const { stage } = useSearch({ from: "/admin/clinicians/batch" });

  return (
    <AdminShell heading="">
      <div style={{ marginBottom: 12 }}>
        <Link
          to="/admin/clinicians"
          search={{ state: "default", sso: "off", banner: "" }}
          style={{ fontSize: 12, color: WF_DARK, textDecoration: "none" }}
        >
          ← Clinician management
        </Link>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 500, color: WF_DARK, margin: "0 0 24px" }}>
        Upload clinicians via CSV
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
              Fill in clinician data and save as a .csv file.
            </div>
          </div>

          <ColumnGroup label="Required columns" items={[
            "First name",
            "Last name",
            "Email address",
            "Title (e.g. Endocrinologist, Diabetes Nurse Educator)",
            'Role (must be exactly "Clinician" or "Admin" — case-insensitive)',
          ]} />

          <ColumnGroup label="File requirements" items={[
            "Format: .csv only",
            "Maximum: 200 clinicians per upload",
            "Maximum file size: 5MB",
            "First row must be the column header row",
          ]} />
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
                clinicians_june2026.csv selected
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
          <Link to="/admin/clinicians" search={{ state: "default", sso: "off", banner: "" }} style={footerLinkStyle}>
            Cancel
          </Link>
        }
        right={
          <Btn
            primary
            disabled={!fileLoaded}
            onClick={() => navigate({ to: "/admin/clinicians/batch", search: { stage: "review" } })}
          >
            Review clinicians →
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
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: WF_DARK, lineHeight: 1.8 }}>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

// ---------- STATE 2 ----------

type Row = {
  n: number;
  first: string;
  last: string;
  email: string;
  title: string;
  role: string;
  ready: boolean;
  error?: string;
};

const ROWS: Row[] = [
  { n: 1, first: "Anna", last: "Williams", email: "a.williams@clinic.ca", title: "Endocrinologist", role: "Clinician", ready: true },
  { n: 2, first: "Ben", last: "Torres", email: "b.torres@clinic.ca", title: "Diabetes Nurse", role: "Clinician", ready: true },
  { n: 3, first: "Clare", last: "Dumont", email: "c.dumont@clinic.ca", title: "Dietician", role: "Admin", ready: true },
  { n: 4, first: "David", last: "Kim", email: "d.kim@clinic.ca", title: "Endocrinologist", role: "Clinician", ready: true },
  { n: 5, first: "—", last: "—", email: "missing@clinic.ca", title: "—", role: "—", ready: false, error: "First name, last name, and title are required" },
  { n: 6, first: "Sarah", last: "Chen", email: "s.chen@clinic.ca", title: "Endocrinologist", role: "Clinician", ready: false, error: "A clinician with this email already exists in your clinic." },
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
            <span style={{ fontWeight: 500 }}>clinicians_june2026.csv</span>
            <span style={{ color: WF_MID }}> — 1.1MB · 6 rows detected</span>
          </div>
          <Link
            to="/admin/clinicians/batch"
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
                {["Row", "First name", "Last name", "Email", "Title", "Role", "Status"].map((h) => (
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
            Fix errors in your CSV and re-upload to include those clinicians. You can proceed with the {readyCount} ready rows now.
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <Callout>
            Rows with errors will not be uploaded. Fix your CSV and re-upload, or proceed with the rows that are ready.
          </Callout>
        </div>
      </div>

      <StickyFooter
        left={
          <Link to="/admin/clinicians/batch" search={{ stage: "upload" }} style={footerLinkStyle}>
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
              onClick={() => navigate({ to: "/admin/clinicians/batch", search: { stage: "done" } })}
            >
              Send {readyCount} invitations →
            </Btn>
            {tooltip && errorCount > 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  right: 0,
                  marginBottom: 8,
                  background: WF_DARK,
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
        <td style={cellStyle}>{row.first}</td>
        <td style={cellStyle}>{row.last}</td>
        <td style={cellStyle}>{row.email}</td>
        <td style={cellStyle}>{row.title}</td>
        <td style={cellStyle}>{row.role}</td>
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
        4 invitations sent
      </h1>
      <div style={{ fontSize: 13, color: WF_MID, lineHeight: 1.7, marginBottom: 28 }}>
        Invitations have been sent to 4 clinicians via email.
      </div>
      <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 32 }}>
        2 rows had errors and were not uploaded.{" "}
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>Download error report →</span>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Btn
          primary
          onClick={() =>
            navigate({
              to: "/admin/clinicians",
              search: { state: "default", sso: "off", banner: "4 clinician invitations sent." },
            })
          }
        >
          Back to Clinician management
        </Btn>
        <Btn onClick={() => navigate({ to: "/admin/clinicians/batch", search: { stage: "upload" } })}>
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
