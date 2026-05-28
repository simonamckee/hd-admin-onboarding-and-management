import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, PrototypeBack } from "@/components/admin-shell";
import { Btn, Input, TextLink, Pill } from "@/components/patient-ui";
import { WF_DARK, WF_MID } from "@/components/wireframe";

export type QType = "Yes / No" | "Free text" | "Number / Rating" | "Multiple choice" | "Date";

export type Question = {
  id: string;
  type: QType;
  text: string;
  required: boolean;
  options?: string[];
  multi?: boolean;
  min?: number;
  max?: number;
};

export type FormDraft = {
  name: string;
  status: "Draft" | "Active";
  questions: Question[];
};

const Q_TYPES: QType[] = ["Yes / No", "Free text", "Number / Rating", "Multiple choice", "Date"];

const DEFAULTS: Record<QType, Omit<Question, "id">> = {
  "Yes / No": { type: "Yes / No", text: "New yes/no question", required: false },
  "Free text": { type: "Free text", text: "New free text question", required: false },
  "Number / Rating": { type: "Number / Rating", text: "New rating question", required: false, min: 1, max: 10 },
  "Multiple choice": { type: "Multiple choice", text: "How often do you check your blood glucose?", required: false, options: ["Less than once a day", "1–3 times a day", "4 or more times a day"], multi: false },
  "Date": { type: "Date", text: "New date question", required: false },
};

let uid = 100;
const nextId = () => `q${++uid}`;

export function FormBuilder({ mode, existing }: { mode: "new" | "edit"; existing?: FormDraft }) {
  const navigate = useNavigate();
  const [name, setName] = useState(existing?.name ?? "New form");
  const [editingName, setEditingName] = useState(false);
  const [status] = useState<"Draft" | "Active">(existing?.status ?? "Draft");
  const [questions, setQuestions] = useState<Question[]>(existing?.questions ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(existing?.questions?.[0]?.id ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const selected = questions.find((q) => q.id === selectedId) || null;

  const addQuestion = (t: QType) => {
    const q: Question = { id: nextId(), ...DEFAULTS[t] };
    setQuestions((arr) => [...arr, q]);
    setSelectedId(q.id);
    setPickerOpen(false);
  };

  const updateQuestion = (id: string, patch: Partial<Question>) => {
    setQuestions((arr) => arr.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const removeQuestion = (id: string) => {
    setQuestions((arr) => arr.filter((q) => q.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const from = questions.findIndex((q) => q.id === dragId);
    const to = questions.findIndex((q) => q.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...questions];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setQuestions(next);
    setDragId(null);
    setOverId(null);
  };

  const save = (publish: boolean) => {
    navigate({
      to: "/admin/forms",
      search: {
        state: "default",
        banner: publish
          ? `${name} has been published and is available to clinicians.`
          : `${name} has been saved as a draft.`,
      },
    });
  };

  return (
    <AdminShell heading="">
      <div style={{ paddingBottom: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          {editingName ? (
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => { if (e.key === "Enter") setEditingName(false); }}
              style={{ fontSize: 22, fontWeight: 500, maxWidth: 420 }}
            />
          ) : (
            <h1
              onClick={() => setEditingName(true)}
              title="Click to rename"
              style={{ fontSize: 22, fontWeight: 500, margin: 0, cursor: "text", borderBottom: `1px dashed transparent` }}
              onMouseEnter={(e) => (e.currentTarget.style.borderBottom = `1px dashed ${WF_MID}`)}
              onMouseLeave={(e) => (e.currentTarget.style.borderBottom = `1px dashed transparent`)}
            >
              {name}
            </h1>
          )}
          <Pill label={status} weight={status === "Active" ? "dark" : "light"} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, marginTop: 24, alignItems: "start" }}>
          {/* Left: question list */}
          <div>
            <div style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
              Questions
            </div>
            {questions.length === 0 && (
              <div style={{ border: `1px dashed ${WF_MID}`, background: "#fff", padding: 30, textAlign: "center", fontSize: 13, color: WF_MID, marginBottom: 12 }}>
                No questions yet. Add your first question below.
              </div>
            )}
            <div>
              {questions.map((q, idx) => {
                const isSelected = selectedId === q.id;
                const isOver = overId === q.id && dragId !== q.id;
                return (
                  <div
                    key={q.id}
                    draggable
                    onDragStart={() => setDragId(q.id)}
                    onDragOver={(e) => { e.preventDefault(); setOverId(q.id); }}
                    onDragLeave={() => setOverId((v) => (v === q.id ? null : v))}
                    onDrop={(e) => { e.preventDefault(); onDrop(q.id); }}
                    onDragEnd={() => { setDragId(null); setOverId(null); }}
                    onClick={() => setSelectedId(q.id)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "12px 14px",
                      background: "#fff",
                      border: isOver
                        ? `1.5px dashed ${WF_DARK}`
                        : isSelected
                        ? `1.5px solid ${WF_DARK}`
                        : `1px solid ${WF_MID}`,
                      borderBottom: isOver ? `1.5px dashed ${WF_DARK}` : isSelected ? `1.5px solid ${WF_DARK}` : "none",
                      cursor: "pointer",
                      marginBottom: -1,
                      opacity: dragId === q.id ? 0.5 : 1,
                    }}
                  >
                    <span style={{ color: WF_MID, fontSize: 14, cursor: "grab", userSelect: "none", lineHeight: "20px" }}>⋮⋮</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: WF_DARK }}>
                        {idx + 1}. {q.text}
                        {q.required && <span style={{ color: WF_DARK, marginLeft: 4 }}>*</span>}
                      </div>
                      <div style={{ fontSize: 11, color: WF_MID, marginTop: 2 }}>{q.type}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, opacity: 0.85 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedId(q.id); }}
                        style={{ background: "none", border: "none", color: WF_DARK, fontSize: 12, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeQuestion(q.id); }}
                        style={{ background: "none", border: "none", color: WF_DARK, fontSize: 12, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 16, position: "relative" }}>
              <button
                onClick={() => setPickerOpen((v) => !v)}
                style={{
                  background: "#fff",
                  border: `1px dashed ${WF_DARK}`,
                  padding: "10px 16px",
                  fontSize: 13,
                  color: WF_DARK,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                + Add question
              </button>
              {pickerOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 4, background: "#fff", border: `1px solid ${WF_DARK}`, zIndex: 10, minWidth: 220 }}>
                  {Q_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => addQuestion(t)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 14px",
                        background: "none",
                        border: "none",
                        borderBottom: `0.5px solid ${WF_MID}`,
                        fontSize: 13,
                        color: WF_DARK,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: settings panel */}
          <div style={{ background: "#fff", border: `1px solid ${WF_MID}`, padding: 18, position: "sticky", top: 24 }}>
            <div style={{ fontSize: 11, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
              Question settings
            </div>
            {!selected ? (
              <div style={{ fontSize: 13, color: WF_MID }}>
                Select a question to edit its settings, or add a new one.
              </div>
            ) : (
              <QuestionSettings q={selected} onChange={(p) => updateQuestion(selected.id, p)} />
            )}
          </div>
        </div>

        {/* Sticky footer */}
        <div style={{ position: "fixed", left: 240, right: 0, bottom: 0, background: "#fff", borderTop: `1px solid ${WF_DARK}`, padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20 }}>
          <TextLink to="/admin/forms">Cancel</TextLink>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => save(false)}>Save as draft</Btn>
            <Btn primary onClick={() => save(true)} disabled={questions.length === 0}>Publish form</Btn>
          </div>
        </div>
      </div>
      <PrototypeBack to="/admin/forms" />
    </AdminShell>
  );
}

function QuestionSettings({ q, onChange }: { q: Question; onChange: (p: Partial<Question>) => void }) {
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 12, color: WF_DARK, marginBottom: 4 }}>Question text</label>
        <Input value={q.text} onChange={(e) => onChange({ text: e.target.value })} />
      </div>

      <div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: WF_DARK }}>Required</span>
        <Toggle on={q.required} onClick={() => onChange({ required: !q.required })} />
      </div>

      {q.type === "Multiple choice" && (
        <>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: WF_DARK, marginBottom: 6 }}>Answer options</div>
            {(q.options ?? []).map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
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
                    const next = (q.options ?? []).filter((_, idx) => idx !== i);
                    onChange({ options: next });
                  }}
                  style={{ background: "none", border: "none", color: WF_DARK, fontSize: 14, cursor: "pointer", padding: "0 6px" }}
                >
                  ×
                </button>
              </div>
            ))}
            <TextLink onClick={() => onChange({ options: [...(q.options ?? []), "New option"] })}>+ Add option</TextLink>
          </div>
          <div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: WF_DARK }}>Allow multiple selections</span>
            <Toggle on={!!q.multi} onClick={() => onChange({ multi: !q.multi })} />
          </div>
        </>
      )}

      {q.type === "Number / Rating" && (
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, color: WF_DARK, marginBottom: 4 }}>Min</label>
            <Input type="number" value={q.min ?? 1} onChange={(e) => onChange({ min: Number(e.target.value) })} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, color: WF_DARK, marginBottom: 4 }}>Max</label>
            <Input type="number" value={q.max ?? 10} onChange={(e) => onChange({ max: Number(e.target.value) })} />
          </div>
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 11, color: WF_MID, fontStyle: "italic" }}>Type: {q.type}</div>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 36,
        height: 20,
        border: `1px solid ${WF_DARK}`,
        background: on ? WF_DARK : "#fff",
        position: "relative",
        cursor: "pointer",
        padding: 0,
        borderRadius: 999,
      }}
      aria-pressed={on}
    >
      <span
        style={{
          position: "absolute",
          top: 1,
          left: on ? 17 : 1,
          width: 16,
          height: 16,
          background: on ? "#fff" : WF_DARK,
          borderRadius: "50%",
          transition: "left 120ms",
        }}
      />
    </button>
  );
}
