import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Page, H, Body, StepBar, PrimaryButton, SecondaryButton, Divider, TestingLink, BackLink, WF_MID, WF_DARK } from "@/components/wireframe";
import { OtpBoxes } from "./authenticator-verify";

export const Route = createFileRoute("/sms-verify")({ component: Screen5B });

function Screen5B() {
  const router = useRouter();
  return (
    <Page>
      <StepBar states={["done", "done", "done"]} />
      <H>Enter your verification code</H>
      <p style={{ fontSize: 16, color: WF_MID, margin: "0 0 20px 0", lineHeight: 1.5 }}>
        We sent a 6-digit code to <span style={{ color: WF_DARK }}>+1 604 555 0123</span>. It expires in 10 minutes.
      </p>
      <OtpBoxes digits="7294" activeIndex={4} />
      <div style={{ fontSize: 14, color: WF_MID, marginBottom: 12 }}>
        Didn't receive it?{" "}
        <button
          onClick={() => router.invalidate()}
          style={{ background: "none", border: "none", padding: 0, color: WF_DARK, textDecoration: "underline", cursor: "pointer", fontSize: 14 }}
        >
          Resend code
        </button>{" "}
        ·{" "}
        <Link to="/sms-phone" style={{ color: WF_DARK, textDecoration: "underline" }}>
          Change number
        </Link>
      </div>
      <PrimaryButton disabled>Verify and finish</PrimaryButton>
      <SecondaryButton to="/sms-phone">Go back</SecondaryButton>
      <Divider />
      <div style={{ textAlign: "center", fontSize: 14, color: WF_MID }}>
        Having trouble?{" "}
        <Link to="/verify-method" style={{ color: WF_DARK, textDecoration: "underline" }}>
          Use a different method
        </Link>
      </div>
      <TestingLink to="/complete">skip to setup complete →</TestingLink>
      <BackLink to="/sms-phone" />
    </Page>
  );
}
