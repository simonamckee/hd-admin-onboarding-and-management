import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Field, Input, Select, StepIndicator, Banner, TextLink } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";
import { loadDraft, saveDraft, type Supporter } from "@/lib/patient-store";

type BannerMode = "required" | "advisory" | "optional";

export const Route = createFileRoute("/admin/patients/new/supporters")({
  validateSearch: (s: Record<string, unknown>) => ({
    banner: (s.banner as BannerMode) || "required",
  }),
  component: Step2,
});

const blankSupporter: Supporter = {
  firstName: "", lastName: "", email: "", phone: "", relationship: "", channel: "Email",
};

function Step2() {
  const navigate = useNavigate();
  const { banner } = Route.useSearch();
  const [d, setD] = useState(loadDraft());
  const [supporters, setSupporters] = useState<Supporter[]>(
    d.supporters.length ? d.supporters : [blankSupporter],
  );

  useEffect(() => {
    const next = { ...d, supporters };
    setD(next);
    saveDraft(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supporters]);

  const updateS = (i: number, patch: Partial<Supporter>) =>
    setSupporters((arr) => arr.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const remove = (i: number) => setSupporters((arr) => arr.filter((_, idx) => idx !== i));
  const add = () => setSupporters((arr) => arr.length < 6 ? [...arr, blankSupporter] : arr);

  const validCount = supporters.filter((s) => s.firstName && s.lastName && s.email && s.relationship).length;
  const canContinue = banner === "required" ? validCount >= 1 : true;

  return (
    <AdminShell heading="">
      <div style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 6px" }}>Add supporters</h1>
        <div style={{ fontSize: 12, color: WF_MID, marginBottom: 24 }}>Step 2 of 4</div>

        <StepIndicator step={2} />

        {/* Prototype banner state switcher */}
        <div style={{ marginBottom: 12, fontSize: 11, color: WF_MID, fontStyle: "italic" }}>
          [ Prototype: banner state ]{" "}
          {(["required", "advisory", "optional"] as BannerMode[]).map((b, i) => (
            <span key={b}>
              {i > 0 && " · "}
              <Link
                to="/admin/patients/new/supporters"
                search={{ banner: b }}
                style={{ color: banner === b ? WF_DARK : WF_MID, textDecoration: "underline", fontWeight: banner === b ? 600 : 400 }}
              >
                {b}
              </Link>
            </span>
          ))}
        </div>

        {banner === "required" && (
          <Banner weight="dark">
            At least one supporter is required for patients under 18 in this province. You must add a guardian before proceeding.
          </Banner>
        )}
        {banner === "advisory" && (
          <Banner weight="mid">
            We recommend adding a supporter for patients under 18. You can proceed without one.
          </Banner>
        )}
        {banner === "optional" && (
          <Banner weight="light">
            Adding a supporter for an adult patient requires their consent. This is optional.
          </Banner>
        )}

        {supporters.map((s, i) => (
          <div key={i} style={{ border: `1px solid ${WF_MID}`, background: "#fff", padding: 20, marginBottom: 16, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Supporter {i + 1}
              </div>
              {i > 0 && <TextLink onClick={() => remove(i)}>Remove</TextLink>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="First name" required>
                <Input value={s.firstName} onChange={(e) => updateS(i, { firstName: e.target.value })} />
              </Field>
              <Field label="Last name" required>
                <Input value={s.lastName} onChange={(e) => updateS(i, { lastName: e.target.value })} />
              </Field>
              <Field label="Email address" required>
                <Input type="email" value={s.email} onChange={(e) => updateS(i, { email: e.target.value })} />
              </Field>
              <Field label="Phone number">
                <Input type="tel" value={s.phone} onChange={(e) => updateS(i, { phone: e.target.value })} />
              </Field>
              <Field label="Relationship to patient" required>
                <Select value={s.relationship} onChange={(e) => updateS(i, { relationship: e.target.value })}>
                  <option value="">Select...</option>
                  <option>Parent</option><option>Guardian</option><option>Grandparent</option>
                  <option>Sibling</option><option>School staff</option><option>Other</option>
                </Select>
              </Field>
              <Field label="Preferred invite channel">
                <Select value={s.channel} onChange={(e) => updateS(i, { channel: e.target.value })}>
                  <option>Email</option><option>SMS</option><option>Both</option>
                </Select>
              </Field>
            </div>
          </div>
        ))}

        {supporters.length < 6 ? (
          <Btn onClick={add}>+ Add another supporter</Btn>
        ) : (
          <div style={{ fontSize: 12, color: WF_MID, fontStyle: "italic" }}>
            Maximum 6 supporters at profile creation. The patient can add more later from their profile.
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
          <TextLink onClick={() => navigate({ to: "/admin/patients/new" })}>← Back</TextLink>
          <Btn
            primary
            disabled={!canContinue}
            onClick={() => navigate({ to: "/admin/patients/new/review" })}
          >
            Continue to Review →
          </Btn>
        </div>
      </div>
      <PrototypeBack to="/admin/patients/new" />
    </AdminShell>
  );
}
