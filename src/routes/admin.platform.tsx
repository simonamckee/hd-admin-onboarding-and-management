import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin-shell";

export const Route = createFileRoute("/admin/platform")({
  component: () => <AdminPlaceholder heading="Platform configuration" />,
});
