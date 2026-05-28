import { createFileRoute } from "@tanstack/react-router";
import { FormBuilder, type FormDraft } from "@/components/form-builder";

const MOCK: Record<string, FormDraft> = {
  "monthly-checkin": {
    name: "Monthly Check-in",
    status: "Active",
    questions: [
      { id: "q1", type: "Multiple choice", text: "How often do you check your blood glucose?", required: true, options: ["Less than once a day", "1–3 times a day", "4 or more times a day"], multi: false },
      { id: "q2", type: "Number / Rating", text: "How would you rate your overall wellbeing this month?", required: true, min: 1, max: 10, minLabel: "Very poor", maxLabel: "Excellent" },
      { id: "q3", type: "Free text", text: "Is there anything else you'd like your care team to know?", required: false, limitLength: false, maxLength: 500 },
    ],
  },
  "initial-assessment": {
    name: "Initial Assessment",
    status: "Active",
    questions: [
      { id: "q1", type: "Multiple choice", text: "How often do you check your blood glucose?", required: true, options: ["Less than once a day", "1–3 times a day", "4 or more times a day"], multi: false },
      { id: "q2", type: "Free text", text: "Describe your current insulin regimen.", required: false },
    ],
  },
  "hypo-report": {
    name: "Hypoglycaemia Report",
    status: "Active",
    questions: [
      { id: "q1", type: "Date", text: "When did the episode occur?", required: true },
      { id: "q2", type: "Number / Rating", text: "Severity (1–10)", required: true, min: 1, max: 10 },
      { id: "q3", type: "Free text", text: "What did you do to treat it?", required: false },
    ],
  },
  "school-nurse": {
    name: "School Nurse Briefing",
    status: "Active",
    questions: [
      { id: "q1", type: "Free text", text: "Brief description for the school nurse.", required: true },
    ],
  },
  "old-intake": {
    name: "Old Intake Form",
    status: "Active",
    questions: [
      { id: "q1", type: "Yes / No", text: "Do you have a previous diagnosis?", required: true },
    ],
  },
};

export const Route = createFileRoute("/admin/forms/$id")({
  component: EditForm,
});

function EditForm() {
  const { id } = Route.useParams();
  const existing = MOCK[id] || MOCK["monthly-checkin"];
  return <FormBuilder mode="edit" existing={existing} />;
}
