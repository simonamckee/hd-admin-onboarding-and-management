import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, H, Body, StepBar, PrimaryButton, SecondaryButton, Divider, TestingLink, BackLink, WF_MID, WF_DARK } from "@/components/wireframe";
import { OtpBoxes } from "./authenticator-verify";

export const Route = createFileRoute("/patient/authenticator-verify")({ component: PatientAuthVerify });

function PatientAuthVerify() {
  return (
    <Page>
      <StepBar states={["done", "done", "active"]} />
      <H>Enter your verification code</H>
      <Body>Open your authenticator app and enter the 6-digit code shown for Haibu Diabetes.</Body>
      <OtpBoxes digits="483" activeIndex={3} />
      <PrimaryButton disabled>Verify and finish</PrimaryButton>
      <SecondaryButton to="/patient/authenticator-qr">Go back</SecondaryButton>
      <Divider />
      <div style={{ textAlign: "center", fontSize: 14, color: WF_MID }}>
        Having trouble?{" "}
        <Link to="/patient/verify-method" style={{ color: WF_DARK, textDecoration: "underline" }}>
          Use a different method
        </Link>
      </div>
      <TestingLink to="/patient/complete">skip to setup complete →</TestingLink>
      <BackLink to="/patient/authenticator-qr" />
    </Page>
  );
}
