import { createFileRoute } from "@tanstack/react-router";
import { FormBuilder, type FormDraft } from "@/components/form-builder";

const T1DAL_ITEMS: Array<{ section: string; text: string }> = [
  { section: "Emotional Well-being", text: "I feel worried about my child's blood sugar levels." },
  { section: "Emotional Well-being", text: "I feel anxious about what could happen if my child's diabetes is not well managed." },
  { section: "Emotional Well-being", text: "I feel overwhelmed by the demands of managing my child's diabetes." },
  { section: "Emotional Well-being", text: "I feel sad or depressed because of my child's diabetes." },
  { section: "Emotional Well-being", text: "Managing my child's diabetes affects my own emotional health." },
  { section: "Diabetes Management Burden", text: "I feel confident managing my child's diabetes day-to-day." },
  { section: "Diabetes Management Burden", text: "My child's diabetes management interferes with our family's daily routines." },
  { section: "Diabetes Management Burden", text: "I find it difficult to manage my child's diabetes at night." },
  { section: "Diabetes Management Burden", text: "I feel prepared to handle unexpected changes in my child's blood sugar." },
  { section: "Diabetes Management Burden", text: "Keeping up with my child's diabetes care feels like a full-time job." },
  { section: "Support & Relationships", text: "I feel supported by my partner or family in managing my child's diabetes." },
  { section: "Support & Relationships", text: "My child's healthcare team listens to my concerns and questions." },
  { section: "Support & Relationships", text: "I feel comfortable asking the healthcare team for help." },
  { section: "Support & Relationships", text: "I feel isolated because of my child's diabetes." },
  { section: "Impact on Family Life", text: "My child's diabetes affects the activities our family can do together." },
  { section: "Impact on Family Life", text: "My child's diabetes affects my ability to work or maintain my own health." },
  { section: "Impact on Family Life", text: "I feel that my other children (if any) miss out because of my child's diabetes." },
  { section: "Impact on Family Life", text: "I am able to take breaks from diabetes management when needed." },
];

const MOCK: Record<string, FormDraft> = {
  "t1dal-parent-u8": {
    name: "T1DAL – Parent of Child Under 8",
    status: "Active",
    questions: T1DAL_ITEMS.map((q, i) => ({
      id: `t${i + 1}`,
      type: "Number / Rating",
      text: `[${q.section}] ${q.text}`,
      required: true,
      min: 1,
      max: 5,
      minLabel: "Never",
      maxLabel: "Always",
    })),
  },
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
