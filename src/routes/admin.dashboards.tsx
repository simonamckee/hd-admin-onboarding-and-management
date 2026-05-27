import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin-shell";

export const Route = createFileRoute("/admin/dashboards")({
  component: () => <AdminPlaceholder heading="Dashboard templates" />,
});
