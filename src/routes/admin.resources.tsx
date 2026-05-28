import { createFileRoute } from "@tanstack/react-router";
import { AdminPlaceholder } from "@/components/admin-shell";

export const Route = createFileRoute("/admin/resources")({
  component: () => <AdminPlaceholder heading="Resource library" />,
});
