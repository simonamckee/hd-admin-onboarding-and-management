import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, BackLink, RestartLink, WF_MID, WF_DARK } from "@/components/wireframe";

export const Route = createFileRoute("/admin")({ component: Screen7 });

function Screen7() {
  return (
    <Page noCard>
      <div
        style={{
          minHeight: "calc(100vh - 46px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 24, color: WF_DARK, margin: 0, fontWeight: 600 }}>Admin section</h1>
        <p style={{ fontSize: 14, color: WF_MID, maxWidth: 440, marginTop: 12 }}>
          This is where the admin will land after completing account setup. To be built in a subsequent prototype.
        </p>
        <Link to="/complete" style={{ fontSize: 12, color: WF_DARK, textDecoration: "underline", marginTop: 20 }}>
          ← Back to setup complete
        </Link>
        <BackLink to="/complete" />
        <RestartLink />
      </div>
    </Page>
  );
}
