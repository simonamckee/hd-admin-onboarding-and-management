import { createFileRoute } from "@tanstack/react-router";
import { ResourceForm } from "./admin.resources.new";

const MOCK: Record<string, Parameters<typeof ResourceForm>[0]["existing"]> = {
  "living-well": { name: "Living Well with T1D", type: "Document", category: "Diabetes education", url: "", description: "", file: "Living_Well_T1D.pdf — 1.4MB" },
  "carb-counting": { name: "Carb Counting Guide", type: "Document", category: "Carb management", url: "", description: "", file: "Carb_Counting_Guide.pdf — 820KB" },
  "cgm-how-to": { name: "How to Use Your CGM", type: "Video", category: "Device education", url: "https://youtu.be/example", description: "" },
  "insulin-faq": { name: "Insulin Adjustment FAQ", type: "Link", category: "Diabetes education", url: "https://example.com/insulin-faq", description: "" },
  "school-template": { name: "School Support Template", type: "Document", category: "Mental health", url: "", description: "", file: "School_Support_Template.docx — 240KB" },
};

export const Route = createFileRoute("/admin/resources/$id")({
  component: EditResource,
});

function EditResource() {
  const { id } = Route.useParams();
  const existing = MOCK[id] || MOCK["living-well"];
  return <ResourceForm mode="edit" existing={existing} />;
}
