import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { WF_DARK, WF_MID, WF_BG, TEAL, BORDER, SURFACE, HAIBU_LOGO_URL } from "@/components/wireframe";

export const Route = createFileRoute("/login")({ component: LoginScreen });

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: WF_BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 16px",
        fontFamily: '"Urbanist", system-ui, -apple-system, Segoe UI, sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: SURFACE,
          border: `0.5px solid ${BORDER}`,
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          padding: "32px 28px",
          boxSizing: "border-box",
        }}
      >
        {/* Clinic logo — visual anchor */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: TEAL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            BC
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: WF_DARK, lineHeight: 1.3 }}>
            BC Children's Hospital
          </div>
        </div>

        {!showForgot ? (
          <>
            <div style={{ fontSize: 24, fontWeight: 700, color: TEAL, marginBottom: 6 }}>
              Sign in
            </div>
            <div style={{ fontSize: 14, color: WF_MID, marginBottom: 24 }}>
              Sign in to Haibu Diabetes
            </div>

            <label style={{ fontSize: 13, color: WF_DARK, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                width: "100%", fontSize: 15, padding: "9px 12px",
                border: `0.5px solid ${BORDER}`, borderRadius: 6, marginBottom: 16,
                boxSizing: "border-box", fontFamily: "inherit",
              }}
            />

            <label style={{ fontSize: 13, color: WF_DARK, fontWeight: 500, display: "block", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
              style={{
                width: "100%", fontSize: 15, padding: "9px 12px",
                border: `0.5px solid ${BORDER}`, borderRadius: 6, marginBottom: 8,
                boxSizing: "border-box", fontFamily: "inherit",
              }}
            />

            <div style={{ textAlign: "right", marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                style={{
                  fontSize: 13, color: TEAL, background: "transparent",
                  border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit",
                }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="button"
              onClick={() => {}}
              style={{
                width: "100%", background: TEAL, color: "#fff", border: "none",
                borderRadius: 6, padding: "12px 0", fontSize: 15, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", marginBottom: 20,
              }}
            >
              Sign in
            </button>

            <div style={{ fontSize: 13, color: WF_MID, textAlign: "center" }}>
              Need help?{" "}
              <a href="mailto:support@haibudiabetes.com" style={{ color: WF_DARK }}>
                support@haibudiabetes.com
              </a>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 24, fontWeight: 700, color: TEAL, marginBottom: 6 }}>
              Reset your password
            </div>

            {!forgotSent ? (
              <>
                <div style={{ fontSize: 14, color: WF_MID, marginBottom: 24, lineHeight: 1.5 }}>
                  Enter your email and we'll send you a link to reset your password.
                </div>

                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Email"
                  style={{
                    width: "100%", fontSize: 15, padding: "9px 12px",
                    border: `0.5px solid ${BORDER}`, borderRadius: 6, marginBottom: 16,
                    boxSizing: "border-box", fontFamily: "inherit",
                  }}
                />
                <button
                  type="button"
                  onClick={() => forgotEmail.trim() && setForgotSent(true)}
                  style={{
                    width: "100%", background: TEAL, color: "#fff", border: "none",
                    borderRadius: 6, padding: "12px 0", fontSize: 15, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Send reset link
                </button>
              </>
            ) : (
              <div style={{ fontSize: 14, color: WF_MID, lineHeight: 1.5 }}>
                If an account exists for that email, a reset link has been sent.
              </div>
            )}

            <button
              type="button"
              onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); }}
              style={{
                display: "block", margin: "24px auto 0", fontSize: 13, color: TEAL,
                background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              ← Back to sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
