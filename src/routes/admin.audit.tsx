import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin-shell";

export const Route = createFileRoute("/admin/audit")({
  component: () => <AdminPlaceholder heading="Audit log" />,
});
