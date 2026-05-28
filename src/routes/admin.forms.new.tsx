import { createFileRoute } from "@tanstack/react-router";
import { FormBuilder } from "@/components/form-builder";

export const Route = createFileRoute("/admin/forms/new")({
  component: () => <FormBuilder mode="new" />,
});
