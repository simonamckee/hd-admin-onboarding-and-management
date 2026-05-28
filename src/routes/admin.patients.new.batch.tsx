import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { WF_DARK } from "@/components/wireframe";

export const Route = createFileRoute("/admin/patients/new/batch")({
  component: BatchUploadPage,
});

function BatchUploadPage() {
  return (
    <AdminShell heading="">
      <h1 style={{ fontSize: 20, fontWeight: 500, color: WF_DARK, margin: "0 0 12px" }}>
        Upload CSV
      </h1>
      <p style={{ fontSize: 13, color: "#9E9E9E" }}>
        Batch upload flow — coming in the next prompt.
      </p>
      <Link
        to="/admin/patients"
        style={{ fontSize: 13, color: WF_DARK, textDecoration: "underline", marginTop: 16, display: "inline-block" }}
      >
        ← Back to patient list
      </Link>
    </AdminShell>
  );
}
