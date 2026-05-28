import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/resources")({
  component: () => <Outlet />,
});
