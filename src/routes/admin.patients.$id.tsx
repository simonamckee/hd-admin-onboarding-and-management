import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Card, Field, Input, Select, Pill, Modal, TextLink, DangerDivider } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";
import {
  formatPHN, phnDigits, isValidPHN,
  PHN_LABEL, PHN_HELPER, PHN_LENGTH_ERROR,
} from "@/lib/phn";

export const Route = createFileRoute("/admin/patients/$id")({ component: PatientDetail });

const CLINICIANS = ["Dr. Sarah Chen", "Dr. James Okafor", "Nurse Priya Mehta", "Dr. Lisa Bouchard", "Dietician Tom Park"];

// Mock data lookup
const MOCK: Record<string, {
  name: string; first: string; last: string; dob: string; gender: string; diagnosis: string;
  health: string; email: string; phone: string; status: "Active" | "Invited" | "Not yet invited";
  lastLogin: string; clinicians: string[]; inviteDate: string; activeSince: string; bounced?: boolean;
  supporters: { name: string; relationship: string; status: string }[];
}> = {
  "emma-tremblay": {
    name: "Emma Tremblay", first: "Emma", last: "Tremblay", dob: "2012-06-14", gender: "Female",
    diagnosis: "2024-09-01", health: "9999000001", email: "emma.t@example.com", phone: "+1 604 555 0182",
    status: "Active", lastLogin: "2 days ago", clinicians: ["Dr. Sarah Chen"],
    inviteDate: "", activeSince: "Jan 16, 2026",
    supporters: [{ name: "Marie Tremblay", relationship: "Parent", status: "Active" }],
  },
  "sofia-andersen": {
    name: "Sofia Andersen", first: "Sofia", last: "Andersen", dob: "2014-02-09", gender: "Female",
    diagnosis: "2025-01-10", health: "9999000003", email: "sofia.a@example.com", phone: "",
    status: "Invited", lastLogin: "Never", clinicians: ["Dr. James Okafor", "Nurse Priya Mehta"],
    inviteDate: "Mar 20, 2026", activeSince: "",
    supporters: [
      { name: "Erik Andersen", relationship: "Parent", status: "Invited" },
      { name: "Lena Andersen", relationship: "Parent", status: "Active" },
    ],
  },
  "lucas-okonkwo": {
    name: "Lucas Okonkwo", first: "Lucas", last: "Okonkwo", dob: "2013-08-04", gender: "Male",
    diagnosis: "2024-11-12", health: "9999000002", email: "lucas.o@example.com", phone: "",
    status: "Active", lastLogin: "1 week ago", clinicians: ["Dr. Sarah Chen"],
    inviteDate: "", activeSince: "Feb 5, 2026",
    supporters: [],
  },
  "lucas-fernandez": {
    name: "Lucas Fernandez", first: "Lucas", last: "Fernandez", dob: "2013-11-22", gender: "Male",
    diagnosis: "2024-05-18", health: "1234563312", email: "lucas.fernandez@exmple.com", phone: "",
    status: "Invited", lastLogin: "Never", clinicians: ["Dr. Lisa Bouchard"],
    inviteDate: "Apr 12, 2026", activeSince: "", bounced: true,
    supporters: [{ name: "Sofia Fernandez", relationship: "Parent", status: "Active" }],
  },
};

const FALLBACK = MOCK["emma-tremblay"];

function statusPill(s: string) {
  if (s === "Active") return <Pill label="Active" weight="dark" />;
  if (s === "Invited") return <Pill label="Invited" weight="mid" />;
  return <Pill label="Not yet invited" weight="light" />;
}

function PatientDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const base = MOCK[id] || FALLBACK;

  const [first, setFirst] = useState(base.first);
  const [last, setLast] = useState(base.last);
  const [health, setHealth] = useState(base.health);
  const [email, setEmail] = useState(base.email);
  const [phone, setPhone] = useState(base.phone);
  const [clinicians, setClinicians] = useState(base.clinicians);
  const [healthErr, setHealthErr] = useState<string | null>(null);

  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [removeText, setRemoveText] = useState("");

  const toggleClin = (c: string) => {
    if (clinicians.includes(c)) setClinicians(clinicians.filter((x) => x !== c));
    else if (clinicians.length < 4) setClinicians([...clinicians, c]);
  };

  const removeMatches = removeText.trim().toLowerCase() === base.name.toLowerCase();
  const deleteDate = new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleRemove = () => {
    navigate({
      to: "/admin/patients",
      search: { state: "default", banner: `${base.name} has been removed. Their profile will be permanently deleted on ${deleteDate}.` },
    });
  };

  return (
    <AdminShell heading="">
      <div style={{ maxWidth: 800 }}>
        <Link to="/admin/patients" search={{ state: "default", banner: "" }} style={{ fontSize: 12, color: WF_MID, textDecoration: "none" }}>
          ← Patient management
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 0 24px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>{base.name}</h1>
          {statusPill(base.status)}
        </div>

        {/* Section 1 */}
        <Card style={{ marginBottom: 16 }}>
          <SectionTitle>Personal information</SectionTitle>
          <Grid>
            <Field label="First name"><Input value={first} onChange={(e) => setFirst(e.target.value)} /></Field>
            <Field label="Last name"><Input value={last} onChange={(e) => setLast(e.target.value)} /></Field>
            <Field label="Date of birth"><ReadOnly>{base.dob}</ReadOnly></Field>
            <Field label="Gender"><ReadOnly>{base.gender}</ReadOnly></Field>
          </Grid>
          <Note>To change date of birth or gender, contact Haibu Health. All changes are audit-logged.</Note>

          <div style={{ marginTop: 16 }}>
            <Field
              label="Health number"
              error={healthErr}
              helper="Try 1234567890 (same-clinic) or 9999999999 (cross-clinic)"
            >
              <Input
                value={health}
                errored={!!healthErr}
                onChange={(e) => setHealth(e.target.value)}
                onBlur={(e) => {
                  const v = e.target.value;
                  if (v === "1234567890") setHealthErr("A patient with this health number already exists in your clinic.");
                  else if (v === "9999999999") setHealthErr("A patient with this health number already exists in Haibu Diabetes. Contact support@haibudiabetes.com to arrange a transfer.");
                  else setHealthErr(null);
                }}
              />
            </Field>
          </div>
        </Card>

        {/* Section 2 */}
        <Card style={{ marginBottom: 16 }}>
          <SectionTitle>Clinical</SectionTitle>
          <Field label="Date of diagnosis"><ReadOnly>{base.diagnosis}</ReadOnly></Field>
          <Note>To change date of diagnosis, contact Haibu Health. All changes are audit-logged.</Note>

          <div style={{ marginTop: 16 }}>
            <Field label="Assigned clinician(s)" helper="Up to 4. All changes are audit-logged.">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {clinicians.map((c) => (
                  <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${WF_DARK}`, padding: "4px 10px", fontSize: 12 }}>
                    {c}
                    <button onClick={() => toggleClin(c)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>×</button>
                  </span>
                ))}
              </div>
              <Select value="" onChange={(e) => e.target.value && toggleClin(e.target.value)} disabled={clinicians.length >= 4}>
                <option value="">Add clinician...</option>
                {CLINICIANS.filter((c) => !clinicians.includes(c)).map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
          </div>
        </Card>

        {/* Section 3 */}
        <Card style={{ marginBottom: 16 }}>
          <SectionTitle>Contact & access</SectionTitle>
          <Grid>
            <Field label="Email address"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
            <Field label="Phone number"><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
          </Grid>
          <Field label="Last login"><ReadOnly>{base.lastLogin}</ReadOnly></Field>

          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${WF_MID}` }}>
            {base.status === "Invited" && !base.bounced && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, color: WF_DARK }}>
                  Invitation sent {base.inviteDate} — pending acceptance
                </div>
                <Btn small>Resend invitation</Btn>
              </div>
            )}
            {base.status === "Invited" && base.bounced && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, color: WF_DARK, fontWeight: 600 }}>
                      Invitation sent {base.inviteDate} — bounced
                    </div>
                    <div style={{ fontSize: 11, color: WF_MID, marginTop: 4, lineHeight: 1.5 }}>
                      The invitation email could not be delivered. Check the email address above and resend.
                    </div>
                  </div>
                  <Btn small primary>Resend invitation</Btn>
                </div>
              </div>
            )}
            {base.status === "Not yet invited" && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, color: WF_DARK }}>No invitation sent</div>
                <Btn small primary>Send invitation</Btn>
              </div>
            )}
            {base.status === "Active" && (
              <div style={{ fontSize: 13, color: WF_DARK }}>Account active since {base.activeSince}</div>
            )}
          </div>
        </Card>

        {/* Section 4 */}
        <Card style={{ marginBottom: 16 }}>
          <SectionTitle>Supporters</SectionTitle>
          {base.supporters.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `0.5px solid ${WF_MID}` }}>
              <div>
                <div style={{ fontSize: 13, color: WF_DARK }}>{s.name}</div>
                <div style={{ fontSize: 11, color: WF_MID }}>{s.relationship} · {s.status}</div>
              </div>
              {s.status === "Invited" && <Btn small>Resend invitation</Btn>}
            </div>
          ))}
          <div style={{ marginTop: 12 }}>
            <Btn>+ Add supporter</Btn>
          </div>
        </Card>

        {/* Danger zone */}
        <DangerDivider />
        <Btn onClick={() => setConfirm1(true)}>Remove patient</Btn>
      </div>

      <Modal open={confirm1} title={`Remove ${base.name}?`} onClose={() => setConfirm1(false)}>
        <p style={{ fontSize: 13, color: WF_DARK, margin: "0 0 20px", lineHeight: 1.5 }}>
          Are you sure you want to remove {base.name}? This cannot be undone immediately. Their profile will be retained for 30 days before permanent deletion.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Btn onClick={() => setConfirm1(false)}>Cancel</Btn>
          <Btn primary onClick={() => { setConfirm1(false); setConfirm2(true); }}>Yes, continue</Btn>
        </div>
      </Modal>

      <Modal open={confirm2} title="Confirm removal" onClose={() => setConfirm2(false)}>
        <p style={{ fontSize: 13, color: WF_DARK, margin: "0 0 12px" }}>
          Type the patient&apos;s full name to confirm.
        </p>
        <div style={{ fontSize: 11, color: WF_MID, marginBottom: 8, fontFamily: "ui-monospace, monospace" }}>
          {base.name}
        </div>
        <Input value={removeText} onChange={(e) => setRemoveText(e.target.value)} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <Btn onClick={() => { setConfirm2(false); setRemoveText(""); }}>Cancel</Btn>
          <Btn primary disabled={!removeMatches} onClick={handleRemove}>Confirm</Btn>
        </div>
      </Modal>

      <PrototypeBack to="/admin/patients" />
    </AdminShell>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 14, fontWeight: 600, color: WF_DARK, marginBottom: 16 }}>{children}</div>;
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{children}</div>;
}
function ReadOnly({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "8px 12px", border: `1px solid ${WF_MID}`, background: "#F5F5F5", fontSize: 13, color: WF_DARK }}>
      {children}
    </div>
  );
}
function Note({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, color: WF_MID, fontStyle: "italic", marginTop: 6 }}>{children}</div>;
}
