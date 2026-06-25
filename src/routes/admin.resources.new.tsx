import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Field, Input, Select, TextLink } from "@/components/patient-ui";
import { WF_DARK, WF_MID, TEAL } from "@/components/wireframe";

export const Route = createFileRoute("/admin/resources/new")({
  component: () => <ResourceForm mode="new" />,
});

const CATEGORIES = [
  "Mental health",
  "Device education",
  "Diabetes education",
  "Sick day management",
  "Carb management",
  "Nutrition",
];

type ResType = "Document" | "Link" | "Video";

type Existing = { name: string; type: ResType; category: string; url: string; description: string; file?: string };

export function ResourceForm({ mode, existing }: { mode: "new" | "edit"; existing?: Existing }) {
  const navigate = useNavigate();
  const [name, setName] = useState(existing?.name ?? "");
  const [type, setType] = useState<ResType | "">(existing?.type ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [url, setUrl] = useState(existing?.url ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [file, setFile] = useState<string | null>(existing?.file ?? null);
  const [urlErr, setUrlErr] = useState<string | null>(null);

  const validateUrl = (v: string) => {
    if (!v) return "URL is required";
    try { new URL(v); return null; } catch { return "Enter a valid URL"; }
  };

  const conditionalValid =
    type === "Document" ? !!file :
    type === "Link" || type === "Video" ? !!url && !urlErr : false;

  const valid = name && type && category && conditionalValid;

  const handleSave = () => {
    navigate({
      to: "/admin/resources",
      search: { state: "default", banner: `${name} has been ${mode === "new" ? "added to the library" : "updated"}.` },
    });
  };

  return (
    <AdminShell heading="">
      <div style={{ maxWidth: 640 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: TEAL, margin: "0 0 24px" }}>
          {mode === "new" ? "Add a resource" : "Edit resource"}
        </h1>

        <Field label="Resource name" required>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        <Field label="Type" required>
          <Select value={type} onChange={(e) => { setType(e.target.value as ResType); setFile(null); setUrl(""); setUrlErr(null); }}>
            <option value="">Select...</option>
            <option>Document</option>
            <option>Link</option>
            <option>Video</option>
          </Select>
        </Field>

        <Field label="Category" required>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select...</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </Select>
        </Field>

        {type === "Document" && (
          <Field label="File" required helper="PDF, DOCX, or XLSX. Max 20MB.">
            {file ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${WF_MID}`, padding: "10px 14px", background: "#F5F5F5", fontSize: 15, color: WF_DARK }}>
                <span>{file}</span>
                <button
                  onClick={() => setFile(null)}
                  style={{ background: "none", border: "none", color: WF_DARK, fontSize: 14, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit" }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                style={{
                  border: `1.5px dashed ${WF_MID}`,
                  background: "#fff",
                  padding: "30px 20px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 15, color: WF_DARK, marginBottom: 6 }}>Drag and drop your file here</div>
                <div style={{ fontSize: 14, color: WF_MID }}>
                  or <TextLink onClick={() => setFile("Living_Well_T1D.pdf — 1.4MB")}>browse to upload</TextLink>
                </div>
              </div>
            )}
          </Field>
        )}

        {type === "Link" && (
          <Field label="URL" required error={urlErr}>
            <Input
              type="url"
              value={url}
              errored={!!urlErr}
              onChange={(e) => { setUrl(e.target.value); if (urlErr) setUrlErr(null); }}
              onBlur={(e) => setUrlErr(validateUrl(e.target.value))}
              placeholder="https://"
            />
          </Field>
        )}

        {type === "Video" && (
          <Field label="Video URL" required helper="YouTube or Vimeo link" error={urlErr}>
            <Input
              type="url"
              value={url}
              errored={!!urlErr}
              onChange={(e) => { setUrl(e.target.value); if (urlErr) setUrlErr(null); }}
              onBlur={(e) => setUrlErr(validateUrl(e.target.value))}
              placeholder="https://"
            />
          </Field>
        )}

        <Field label="Description" helper={`${description.length}/300`}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 300))}
            rows={4}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: `1px solid ${WF_MID}`,
              background: "#fff",
              fontSize: 15,
              color: WF_DARK,
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
        </Field>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
          <TextLink to="/admin/resources">Cancel</TextLink>
          <Btn primary disabled={!valid} onClick={handleSave}>Save resource</Btn>
        </div>
      </div>
      <PrototypeBack to="/admin/resources" />
    </AdminShell>
  );
}
