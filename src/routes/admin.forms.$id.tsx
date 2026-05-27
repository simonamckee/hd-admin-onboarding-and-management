import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState, type CSSProperties } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Input, Pill, TextLink } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

type QType = "yesno" | "text" | "number" | "multiple" | "date";

type Question = {
  id: string;
  type: QType;
  text: string;
  required?: boolean;
  options?: string[];
  multiSelect?: boolean;
  min?: number;
  max?: number;
};

const TYPE_LABELS: Record<QType, string> = {
  yesno: "Yes / No",
  text: "Free text",
  number: "Number / Rating",
  multiple: "Multiple choice",
  date: "Date",
};

const SEED_MONTHLY: Question[] = [
  { id: "q1", type: "yesno", text: "Have you had any hypoglycaemic episodes this month?", required: true },
  { id: "q2", type: "number", text: "How would you rate your overall wellbeing this month?", min: 1, max: 10, required: true },
  { id: "q3", type: "text", text: "Is there anything else you'd like your care team to know?" },
];

const SEED_MULTIPLE_EXAMPLE: Question = {
  id: "qx",
  type: "multiple",
  text: "How often do you check your blood glucose?",
  required: true,
  options: ["Less than once a day", "1–3 times a day", "4 or more times a day"],
  multiSelect: false,
};

const FORM_NAMES: Record<string, string> = {
  "initial-assessment": "Initial Assessment",
  "monthly-check-in": "Monthly Check-in",
  "hypo-report": "Hypoglycaemia Report",
  "school-nurse": "School Nurse Briefing",
  "old-intake": "Old Intake Form",
};

export const Route = createFileRoute("/admin/forms/$id")({
  component: FormBuilder,
});

function FormBuilder() {
  const { id } = useParams({ from: "/admin/forms/$id" });
  const nav = useNavigate();
  const isNew = id === "new";

  const [name, setName] = useState(isNew ? "New form" : (FORM_NAMES[id] ?? "Untitled form"));
  const [renaming, setRenaming] = useState(false);

  const [questions, setQuestions] = useState<Question[]>(
    isNew ? [SEED_MULTIPLE_EXAMPLE] : id === "monthly-check-in" ? SEED_MONTHLY : SEED_MONTHLY,
  );
  const [selectedId, setSelectedId] = useState<string>(questions[0]?.id ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const selected = questions.find((q) => q.id === selectedId);

  function updateSelected(patch: Partial<Question>) {
    setQuestions((qs) => qs.map((q) => (q.id === selectedId ? { ...q, ...patch } : q)));
  }

  function addQuestion(type: QType) {
    const q: Question = {
      id: `q${Date.now()}`,
      type,
      text: "New question",
      ...(type === "multiple" ? { options: ["Option 1", "Option 2"], multiSelect: false } : {}),
      ...(type === "number" ? { min: 1, max: 10 } : {}),
    };
    setQuestions((qs) => [...qs, q]);
    setSelectedId(q.id);
    setPickerOpen(false);
  }

  function deleteQuestion(qid: string) {
    setQuestions((qs) => qs.filter((q) => q.id !== qid));
    if (selectedId === qid) setSelectedId("");
  }

  function reorder(fromId: string, toId: string) {
    if (fromId === toId) return;
    const fromIdx = questions.findIndex((q) => q.id === fromId);
    const toIdx = questions.findIndex((q) => q.id === toId);
    if (fromIdx < 0 || toIdx < 0) return;
    const next = [...questions];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setQuestions(next);
  }

  function publish() {
    nav({ to: "/admin/forms", search: { state: "default", banner: `${name} has been published.` } });
  }
  function saveDraft() {
    nav({ to: "/admin/forms", search: { state: "default", banner: `${name} saved as draft.` } });
  }

  return (
    <AdminShell heading="">
      <div style={{ marginBottom: 12 }}>
        <Link to="/admin/forms" search={{ state: "default", banner: "" }} style={{ fontSize: 12, color: WF_MID, textDecoration: "underline" }}>
          ← Form library
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        {renaming ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setRenaming(false)}
            onKeyDown={(e) => { if (e.key === "Enter") setRenaming(false); }}
            style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, border: `1px solid ${WF_MID}`, padding: "4px 8px", fontFamily: "inherit", outline: "none" }}
          />
        ) : (
          <h1
            onClick={() => setRenaming(true)}
            title="Click to rename"
            style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, margin: 0, cursor: "text", borderBottom: `1px dashed transparent` }}
          >
            {name}
          </h1>
        )}
        <Pill label="Draft" weight="mid" />
      </div>
      <div style={{ fontSize: 12, color: WF_MID, marginBottom: 24, fontStyle: "italic" }}>Click the title to rename</div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.85fr) minmax(0, 1fr)", gap: 20, marginBottom: 80 }}>
        {/* Left: question list */}
        <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 20 }}>
          {questions.length === 0 && (
            <div style={{ fontSize: 13, color: WF_MID, fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
              No questions yet. Add your first below.
            </div>
          )}
          {questions.map((q, i) => {
            const isSelected = q.id === selectedId;
            const isOver = overId === q.id && dragId !== q.id;
            const rowStyle: CSSProperties = {
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: 12,
              border: `${isSelected ? 2 : 1}px ${isOver ? "dashed" : "solid"} ${isSelected || isOver ? WF_DARK : WF_MID}`,
              marginBottom: 10,
              background: "#fff",
              cursor: "pointer",
              opacity: dragId === q.id ? 0.5 : 1,
            };
            return (
              <div
                key={q.id}
                style={rowStyle}
                onClick={() => setSelectedId(q.id)}
                draggable
                onDragStart={() => setDragId(q.id)}
                onDragEnd={() => { setDragId(null); setOverId(null); }}
                onDragOver={(e) => { e.preventDefault(); setOverId(q.id); }}
                onDrop={(e) => { e.preventDefault(); if (dragId) reorder(dragId, q.id); setDragId(null); setOverId(null); }}
              >
                <span style={{ color: WF_MID, fontSize: 14, cursor: "grab", userSelect: "none", lineHeight: "20px" }}>⋮⋮</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: WF_DARK, marginBottom: 4 }}>
                    {i + 1}. {q.text}
                  </div>
                  <div style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {TYPE_LABELS[q.type]}{q.required ? " · Required" : ""}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteQuestion(q.id); }}
                  style={{ background: "none", border: "none", color: WF_MID, fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
                >
                  Delete
                </button>
              </div>
            );
          })}

          {/* Add question */}
          <div style={{ marginTop: 12 }}>
            {!pickerOpen ? (
              <Btn onClick={() => setPickerOpen(true)}>+ Add question</Btn>
            ) : (
              <div style={{ border: `1px solid ${WF_DARK}`, background: "#fff", padding: 12 }}>
                <div style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Pick a question type</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(Object.keys(TYPE_LABELS) as QType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => addQuestion(t)}
                      style={{ padding: "6px 12px", border: `1px solid ${WF_DARK}`, background: "#fff", fontSize: 12, color: WF_DARK, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      {TYPE_LABELS[t]}
                    </button>
                  ))}
                  <button onClick={() => setPickerOpen(false)} style={{ padding: "6px 12px", background: "none", border: "none", fontSize: 12, color: WF_MID, textDecoration: "underline", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: settings panel */}
        <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 20, alignSelf: "start" }}>
          <div style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 }}>
            Question settings
          </div>
          {!selected ? (
            <div style={{ fontSize: 13, color: WF_MID, fontStyle: "italic" }}>
              Select a question to edit its settings.
            </div>
          ) : (
            <SettingsPanel q={selected} onChange={updateSelected} />
          )}
        </div>
      </div>

      {/* Sticky footer */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#fff",
          borderTop: `1px solid ${WF_MID}`,
          padding: "14px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginLeft: -32,
          marginRight: -32,
          marginBottom: -32,
        }}
      >
        <TextLink to="/admin/forms">Cancel</TextLink>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={saveDraft}>Save as draft</Btn>
          <Btn primary onClick={publish}>Publish form</Btn>
        </div>
      </div>

      <PrototypeBack to="/admin/forms" />
    </AdminShell>
  );
}

function ToggleMini({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{
        width: 36, height: 20, border: `1px solid ${WF_DARK}`, background: on ? WF_DARK : "#fff",
        borderRadius: 999, position: "relative", cursor: "pointer", padding: 0,
      }}
    >
      <span style={{ position: "absolute", top: 2, left: on ? 18 : 2, width: 14, height: 14, borderRadius: "50%", background: on ? "#fff" : WF_DARK, transition: "left 0.15s ease" }} />
    </button>
  );
}

function SettingsPanel({ q, onChange }: { q: Question; onChange: (p: Partial<Question>) => void }) {
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 4 }}>Question text</div>
        <Input value={q.text} onChange={(e) => onChange({ text: e.target.value })} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: WF_DARK }}>Required</div>
        <ToggleMini on={!!q.required} onChange={(v) => onChange({ required: v })} />
      </div>

      {q.type === "multiple" && (
        <>
          <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 8 }}>Answer options</div>
          {(q.options ?? []).map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <Input
                value={opt}
                onChange={(e) => {
                  const next = [...(q.options ?? [])];
                  next[i] = e.target.value;
                  onChange({ options: next });
                }}
              />
              <button
                onClick={() => {
                  const next = (q.options ?? []).filter((_, j) => j !== i);
                  onChange({ options: next });
                }}
                style={{ background: "none", border: "none", color: WF_MID, fontSize: 12, textDecoration: "underline", cursor: "pointer" }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange({ options: [...(q.options ?? []), "New option"] })}
            style={{ background: "none", border: "none", color: WF_DARK, fontSize: 13, textDecoration: "underline", cursor: "pointer", padding: 0, marginBottom: 18 }}
          >
            + Add option
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            <div style={{ fontSize: 13, color: WF_DARK }}>Allow multiple selections</div>
            <ToggleMini on={!!q.multiSelect} onChange={(v) => onChange({ multiSelect: v })} />
          </div>
        </>
      )}

      {q.type === "number" && (
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 4 }}>Min</div>
            <Input type="number" value={q.min ?? 1} onChange={(e) => onChange({ min: Number(e.target.value) })} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 4 }}>Max</div>
            <Input type="number" value={q.max ?? 10} onChange={(e) => onChange({ max: Number(e.target.value) })} />
          </div>
        </div>
      )}
    </div>
  );
}
