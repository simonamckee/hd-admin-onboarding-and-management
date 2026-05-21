import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, H, Body, StepBar, PrimaryButton, SecondaryButton, Divider, TestingLink, BackLink, WF_MID, WF_DARK } from "@/components/wireframe";

export const Route = createFileRoute("/authenticator-verify")({ component: Screen4B });

export function OtpBoxes({ digits, activeIndex, length = 6 }: { digits: string; activeIndex: number; length?: number }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
      {Array.from({ length }).map((_, i) => {
        const d = digits[i];
        const isActive = i === activeIndex;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: 48,
              border: `1px solid ${isActive ? WF_DARK : WF_MID}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: WF_DARK,
              background: "#fff",
            }}
          >
            {d || ""}
          </div>
        );
      })}
    </div>
  );
}

function Screen4B() {
  return (
    <Page>
      <StepBar states={["done", "done", "done"]} />
      <H>Enter your verification code</H>
      <Body>Open your authenticator app and enter the 6-digit code shown for Haibu Diabetes.</Body>
      <OtpBoxes digits="483" activeIndex={3} />
      <PrimaryButton disabled>Verify and finish</PrimaryButton>
      <SecondaryButton to="/authenticator-qr">Go back</SecondaryButton>
      <Divider />
      <div style={{ textAlign: "center", fontSize: 12, color: WF_MID }}>
        Having trouble?{" "}
        <Link to="/verify-method" style={{ color: WF_DARK, textDecoration: "underline" }}>
          Use a different method
        </Link>
      </div>
      <TestingLink to="/complete">skip to setup complete →</TestingLink>
      <BackLink to="/authenticator-qr" />
    </Page>
  );
}
