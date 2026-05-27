import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Input, Select, Field } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

type ResourceType = "Document" | "Link" | "Video";

type Resource = {
  id: string;
  name: string;
  type: ResourceType;
  added: string;
  lastUsed: string;
  addedBy: string;
  status: "Active" | "Archived";
  description?: string;
  fileName?: string;
  fileSize?: string;
  url?: string;
};

const RESOURCES: Resource[] = [
  { id: "r1", name: "Living Well with T1D", type: "Document", added: "Jan 8, 2026", lastUsed: "3 days ago", addedBy: "Admin", status: "Active", fileName: "Living_Well_T1D.pdf", fileSize: "1.4MB", description: "A comprehensive guide for patients newly diagnosed with Type 1 diabetes." },
  { id: "r2", name: "Carb Counting Guide", type: "Document", added: "Feb 1, 2026", lastUsed: "1 week ago", addedBy: "Dr. Sarah Chen", status: "Active" },
  { id: "r3", name: "How to Use Your CGM", type: "Video", added: "Feb 20, 2026", lastUsed: "2 weeks ago", addedBy: "Admin", status: "Active", url: "https://youtube.com/cgm-tutorial" },
  { id: "r4", name: "Insulin Adjustment FAQ", type: "Link", added: "Mar 5, 2026", lastUsed: "1 month ago", addedBy: "Dr. James Okafor", status: "Active", url: "https://example.com/insulin-faq" },
  { id: "r5", name: "School Support Template", type: "Document", added: "Mar 22, 2026", lastUsed: "Never", addedBy: "Admin", status: "Active" },
  { id: "r6", name: "Old Nutrition Guide", type: "Document", added: "Aug 14, 2025", lastUsed: "5 months ago", addedBy: "Admin", status: "Archived" },
];

export const Route = createFileRoute("/admin/resources/$id")({
  component: EditResource,
});

function EditResource() {
  const { id } = useParams({ from: "/admin/resources/$id" });
  const nav = useNavigate();
  const resource = RESOURCES.find((r) => r.id === id);

  const [name, setName] = useState(resource?.name ?? "");
  const [type, setType] = useState<ResourceType>(resource?.type ?? "Document");
  const [url, setUrl] = useState(resource?.url ?? "");
  const [description, setDescription] = useState(resource?.description ?? "");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(
    resource?.fileName ? { name: resource.fileName, size: resource.fileSize ?? "" } : null
  );
  const [urlError, setUrlError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const isValid = useMemo(() => {
    if (!name.trim()) return false;
    if (type === "Document") return !!uploadedFile;
    if (type === "Link" || type === "Video") return !!url.trim() && !urlError;
    return false;
  }, [name, type, uploadedFile, url, urlError]);

  function validateUrl(value: string) {
    if (!value.trim()) {
      setUrlError("");
      return;
    }
    try {
      new URL(value);
      setUrlError("");
    } catch {
      setUrlError("Please enter a valid URL");
    }
  }

  function handleSave() {
    nav({ to: "/admin/resources", search: { state: "default", banner: `${name} has been updated.` } });
  }

  if (!resource) {
    return (
      <AdminShell heading="">
        <div style={{ fontSize: 14, color: WF_MID }}>Resource not found.</div>
        <PrototypeBack to="/admin/resources" />
      </AdminShell>
    );
  }

  return (
    <AdminShell heading="">
      <div style={{ marginBottom: 16 }}>
        <Link to="/admin/resources" search={{ state: "default", banner: "" }} style={{ fontSize: 12, color: WF_MID, textDecoration: "underline" }}>
          ← Resource library
        </Link>
      </div>

      <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, margin: "0 0 24px 0" }}>Edit resource</h1>

      <div style={{ maxWidth: 560 }}>
        <Field label="Resource name" required>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter resource name" />
        </Field>

        <Field label="Type" required>
          <Select value={type} onChange={(e) => { setType(e.target.value as ResourceType); setUrl(""); setUrlError(""); setUploadedFile(null); }}>
            <option>Document</option>
            <option>Link</option>
            <option>Video</option>
          </Select>
        </Field>

        {type === "Document" && (
          <Field label="File upload" required>
            {uploadedFile ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", border: `1px solid ${WF_MID}`, background: "#fff", fontSize: 13 }}>
                <span style={{ color: WF_DARK }}>{uploadedFile.name} — {uploadedFile.size}</span>
                <button
                  onClick={() => setUploadedFile(null)}
                  style={{ background: "none", border: "none", color: WF_DARK, fontSize: 13, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit" }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) setUploadedFile({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(1) + "MB" });
                }}
                style={{
                  border: `${dragOver ? 2 : 1}px ${dragOver ? "solid" : "dashed"} ${WF_DARK}`,
                  background: dragOver ? "#F5F5F5" : "#fff",
                  padding: "32px 24px",
                  textAlign: "center",
                  fontSize: 13,
                  color: WF_MID,
                  cursor: "pointer",
                }}
              >
                <div style={{ marginBottom: 8 }}>Drag and drop or browse to upload</div>
                <div style={{ fontSize: 11, color: WF_MID }}>Accepted: PDF, DOCX, XLSX. Max 20MB.</div>
                <input
                  type="file"
                  accept=".pdf,.docx,.xlsx"
                  style={{ display: "none" }}
                  id="file-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setUploadedFile({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(1) + "MB" });
                  }}
                />
                <label htmlFor="file-upload" style={{ display: "inline-block", marginTop: 12, padding: "6px 14px", border: `1px solid ${WF_DARK}`, fontSize: 12, color: WF_DARK, cursor: "pointer" }}>
                  Browse files
                </label>
              </div>
            )}
          </Field>
        )}

        {type === "Link" && (
          <Field label="URL" required error={urlError}>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={(e) => validateUrl(e.target.value)}
              placeholder="https://..."
              errored={!!urlError}
            />
          </Field>
        )}

        {type === "Video" && (
          <Field label="Video URL" required error={urlError}>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={(e) => validateUrl(e.target.value)}
              placeholder="YouTube or Vimeo link"
              errored={!!urlError}
            />
          </Field>
        )}

        <Field label="Description" helper={`${description.length}/300 characters`}>
          <textarea
            value={description}
            onChange={(e) => { if (e.target.value.length <= 300) setDescription(e.target.value); }}
            placeholder="Optional description"
            rows={4}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: `1px solid ${WF_MID}`,
              background: "#fff",
              fontSize: 13,
              color: WF_DARK,
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
        </Field>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 24, paddingTop: 20, borderTop: `1px solid ${WF_MID}` }}>
        <Link to="/admin/resources" search={{ state: "default", banner: "" }} style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline" }}>
          Cancel
        </Link>
        <Btn primary disabled={!isValid} onClick={handleSave}>Save resource</Btn>
      </div>

      <PrototypeBack to="/admin/resources" />
    </AdminShell>
  );
}
