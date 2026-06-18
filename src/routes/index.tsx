import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, H, Body, ReadOnlyField, PrimaryButton, Divider, TestingLink, WF_MID, WF_DARK } from "@/components/wireframe";

export const Route = createFileRoute("/")({ component: Screen1A });

function Screen1A() {
  return (
    <Page>
      <div style={{ fontSize: 14, color: WF_MID, marginBottom: 6 }}>BC CHILDREN'S HOSPITAL</div>
      <H>Welcome, Sarah.</H>
      <Body>
        You've been invited to set up your clinic admin account on Haibu Diabetes. Click below to create your password and get started.
      </Body>
      <ReadOnlyField label="Your name" value="Sarah Roberts" />
      <ReadOnlyField label="Your email" value="sarah.roberts@bcchildrens.ca" />
      <PrimaryButton to="/password">Create my account</PrimaryButton>
      <Divider />
      <div style={{ textAlign: "center", fontSize: 14, color: WF_MID, lineHeight: 1.6 }}>
        This invitation expires on July 14, 2026.
        <br />
        Need help?{" "}
        <a href="mailto:support@haibudiabetes.com" style={{ color: WF_DARK }}>
          support@haibudiabetes.com
        </a>
      </div>
      <TestingLink to="/expired">test expired state →</TestingLink>
      <TestingLink to="/admin/patients">skip to Patient management →</TestingLink>
      <TestingLink to="/patient/password">go to patient setup flow →</TestingLink>
      <TestingLink to="/patient/dashboard">skip to patient dashboard →</TestingLink>
    </Page>
  );
}
