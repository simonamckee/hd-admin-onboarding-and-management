import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AdminShell } from "@/components/admin-shell";
import { TEAL, WF_DARK, WF_MID, BORDER, SURFACE } from "@/components/wireframe";

export const Route = createFileRoute("/clinician/profile")({
  component: ClinicianProfilePage,
});

const ssoOn = false; // hardcoded for prototype — in production, read from clinic config

type MfaStep = "choose" | "qr" | "verify-app" | "phone" | "verify-sms" | "done";
type PwStep = "current" | "new" | "done";

function ClinicianProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [mfaStatus, setMfaStatus] = useState<"off" | "on">("off");
  const [mfaModalStep, setMfaModalStep] = useState<null | MfaStep>(null);
  const [mfaMethod, setMfaMethod] = useState<"app" | "sms" | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyError, setVerifyError] = useState(false);

  const [pwModalStep, setPwModalStep] = useState<null | PwStep>(null);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");

  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setAvatarUrl(URL.createObjectURL(f));
  };

  const card: CSSProperties = {
    background: SURFACE,
    border: `0.5px solid ${BORDER}`,
    borderRadius: 8,
    padding: 24,
    maxWidth: 600,
  };
  const heading: CSSProperties = {
    fontSize: 15, fontWeight: 600, color: WF_DARK, marginTop: 24, marginBottom: 12,
  };
  const fieldRow: CSSProperties = {
    display: "flex", flexDirection: "column", gap: 4, marginBottom: 16,
  };
  const fieldLabel: CSSProperties = {
    fontSize: 12, color: WF_MID, textTransform: "uppercase", letterSpacing: 0.3,
  };
  const fieldValue: CSSProperties = { fontSize: 15, color: WF_DARK };

  const fields: { label: string; value: string }[] = [
    { label: "Name", value: "Dr. James Reyes" },
    { label: "Function", value: "Endocrinologist" },
    { label: "Access level", value: "Clinician" },
    { label: "Email", value: "j.reyes@bcch.ca" },
  ];

  return (
    <AdminShell heading="My profile">
      <div style={card}>
        {/* Section 1 — Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", overflow: "hidden",
            border: `2px solid ${TEAL}`,
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "#e8f4f5", color: TEAL, fontSize: 28, fontWeight: 700,
              }}>JR</div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onPick}
          />
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              border: `0.5px solid ${TEAL}`, color: TEAL, background: "transparent",
              borderRadius: 5, fontSize: 13, padding: "4px 12px", marginTop: 8,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >Upload photo</button>
          <div style={{ fontSize: 13, color: WF_MID, marginTop: 6 }}>Dr. James Reyes</div>
        </div>

        {/* Section 2 — Account information */}
        <div style={heading}>Account information</div>
        {fields.map((f) => (
          <div key={f.label} style={fieldRow}>
            <div style={fieldLabel}>{f.label}</div>
            <div style={fieldValue}>{f.value}</div>
          </div>
        ))}
        <div style={{ fontSize: 12, color: WF_MID, fontStyle: "italic" }}>
          To update your account information, contact your clinic administrator.
        </div>

        {/* Section 3 — Security */}
        {!ssoOn && (
          <>
            <div style={heading}>Security</div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: WF_DARK }}>Two-factor authentication</div>
                <div style={{ fontSize: 13, color: WF_MID }}>
                  {mfaStatus === "on"
                    ? "Enabled — adds a second verification step each time you sign in."
                    : "Adds a second verification step each time you sign in."}
                </div>
              </div>
              {mfaStatus === "off" ? (
                <button
                  onClick={() => setMfaModalStep("choose")}
                  style={{ border: `0.5px solid ${TEAL}`, color: TEAL, background: "transparent",
                    borderRadius: 5, fontSize: 13, padding: "5px 14px", cursor: "pointer",
                    fontFamily: "inherit", flexShrink: 0 }}
                >Set up</button>
              ) : (
                <button
                  onClick={() => { setMfaStatus("off"); setMfaMethod(null); }}
                  style={{ border: `0.5px solid ${BORDER}`, color: WF_MID, background: "transparent",
                    borderRadius: 5, fontSize: 13, padding: "5px 14px", cursor: "pointer",
                    fontFamily: "inherit", flexShrink: 0 }}
                >Turn off</button>
              )}
            </div>

            <div style={{ fontSize: 13, color: WF_MID, marginTop: 20 }}>
              To update your password, use the link below.
            </div>
            <button
              onClick={() => setPwModalStep("current")}
              style={{ border: "none", background: "transparent", color: TEAL,
                fontSize: 14, textDecoration: "underline", cursor: "pointer",
                padding: 0, marginTop: 6, fontFamily: "inherit" }}
            >Change password</button>
          </>
        )}

        {/* Support */}
        <div style={heading}>Support</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: WF_DARK, marginBottom: 4 }}>
              Clinic support
            </div>
            <div style={{ fontSize: 13, color: WF_MID, lineHeight: 1.5, marginBottom: 8 }}>
              For changes to your profile information, access requests, or other
              clinic-related questions, contact your clinic administrator.
            </div>
            <a
              href="mailto:admin@bcchildrens.ca?subject=Clinic%20support%20request"
              onClick={() => showToast("Opening your email client…")}
              style={{ fontSize: 14, color: TEAL, textDecoration: "underline" }}
            >
              Contact clinic administrator
            </a>
          </div>

          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: WF_DARK, marginBottom: 4 }}>
              Platform support
            </div>
            <div style={{ fontSize: 13, color: WF_MID, lineHeight: 1.5, marginBottom: 8 }}>
              For issues with the Haibu Diabetes platform itself, or to suggest a
              new feature, reach out to the Haibu Health team.
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <a
                href="mailto:support@haibudiabetes.com?subject=Report%20an%20issue"
                onClick={() => showToast("Opening your email client…")}
                style={{ fontSize: 14, color: TEAL, textDecoration: "underline" }}
              >
                Report an issue
              </a>
              <a
                href="mailto:support@haibudiabetes.com?subject=Feature%20request"
                onClick={() => showToast("Opening your email client…")}
                style={{ fontSize: 14, color: TEAL, textDecoration: "underline" }}
              >
                Request a feature
              </a>
            </div>
          </div>
        </div>

        {toast && (
          <div
            style={{
              position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
              background: TEAL, color: "#fff", padding: "10px 18px", borderRadius: 6,
              fontSize: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 100,
            }}
          >
            {toast}
          </div>
        )}
      </div>

      {mfaModalStep && (
        <MfaModal
          step={mfaModalStep}
          setStep={setMfaModalStep}
          method={mfaMethod}
          setMethod={setMfaMethod}
          verifyCode={verifyCode}
          setVerifyCode={setVerifyCode}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          verifyError={verifyError}
          setVerifyError={setVerifyError}
          onComplete={() => { setMfaStatus("on"); setMfaModalStep(null); setVerifyCode(""); }}
          onClose={() => { setMfaModalStep(null); setVerifyCode(""); setVerifyError(false); }}
        />
      )}

      {pwModalStep && (
        <PasswordModal
          step={pwModalStep}
          setStep={setPwModalStep}
          currentPw={currentPw} setCurrentPw={setCurrentPw}
          newPw={newPw} setNewPw={setNewPw}
          confirmPw={confirmPw} setConfirmPw={setConfirmPw}
          pwError={pwError} setPwError={setPwError}
          onClose={() => {
            setPwModalStep(null); setCurrentPw(""); setNewPw("");
            setConfirmPw(""); setPwError("");
          }}
        />
      )}
    </AdminShell>
  );
}

function ModalShell({ children, onClose, width = 440 }: {
  children: ReactNode; onClose: () => void; width?: number;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100, padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 10, padding: 28, width,
          maxHeight: "85vh", overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const cancelBtnStyle: CSSProperties = {
  border: `0.5px solid ${BORDER}`, color: WF_DARK, background: "transparent",
  borderRadius: 5, fontSize: 14, padding: "6px 16px", cursor: "pointer",
  fontFamily: "inherit",
};
const primaryBtnStyle: CSSProperties = {
  background: TEAL, color: "#fff", border: "none", borderRadius: 5,
  fontSize: 14, padding: "6px 16px", cursor: "pointer", fontFamily: "inherit",
};
const actionsRow: CSSProperties = {
  display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8,
};

function MfaModal({ step, setStep, method, setMethod, verifyCode, setVerifyCode,
  phoneNumber, setPhoneNumber, verifyError, setVerifyError, onComplete, onClose }: {
  step: MfaStep;
  setStep: (s: MfaStep | null) => void;
  method: "app" | "sms" | null;
  setMethod: (m: "app" | "sms") => void;
  verifyCode: string;
  setVerifyCode: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  verifyError: boolean;
  setVerifyError: (v: boolean) => void;
  onComplete: () => void;
  onClose: () => void;
}) {
  const titleStyle: CSSProperties = { fontSize: 18, fontWeight: 700, color: WF_DARK, marginBottom: 6 };
  const bodyStyle: CSSProperties = { fontSize: 14, color: WF_MID, marginBottom: 20, lineHeight: 1.6 };

  if (step === "choose") {
    return (
      <ModalShell onClose={onClose}>
        <div style={titleStyle}>Set up two-factor authentication</div>
        <div style={bodyStyle}>Choose how you'd like to receive your verification code.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          <button onClick={() => { setMethod("app"); setStep("qr"); }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              border: `0.5px solid ${BORDER}`, borderRadius: 8, background: "transparent",
              cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: WF_DARK }}>Authenticator app</div>
          </button>
          <button onClick={() => { setMethod("sms"); setStep("phone"); }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              border: `0.5px solid ${BORDER}`, borderRadius: 8, background: "transparent",
              cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: WF_DARK }}>Text message (SMS)</div>
          </button>
        </div>
        <div style={actionsRow}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
        </div>
      </ModalShell>
    );
  }

  if (step === "qr") {
    return (
      <ModalShell onClose={onClose}>
        <div style={titleStyle}>Scan the QR code</div>
        <div style={bodyStyle}>Scan this code with your authenticator app, or enter the setup key manually.</div>
        <div style={{
          width: 180, height: 180, margin: "0 auto 16px", background: "#f0f0f0",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: WF_MID, fontSize: 13, border: `0.5px solid ${BORDER}`, borderRadius: 6,
        }}>QR CODE</div>
        <div style={{ fontSize: 13, color: WF_MID, textAlign: "center", marginBottom: 20,
          fontFamily: "ui-monospace, monospace" }}>
          Setup key: JKLM 2X9P QW3R 7TZP
        </div>
        <div style={actionsRow}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button onClick={() => setStep("verify-app")} style={primaryBtnStyle}>Continue</button>
        </div>
      </ModalShell>
    );
  }

  if (step === "verify-app" || step === "verify-sms") {
    return (
      <ModalShell onClose={onClose}>
        <div style={titleStyle}>Enter verification code</div>
        <div style={bodyStyle}>
          {step === "verify-app"
            ? "Enter the 6-digit code shown in your authenticator app."
            : `Enter the 6-digit code sent to ${phoneNumber || "your phone"}.`}
        </div>
        <input
          type="text"
          value={verifyCode}
          onChange={(e) => { setVerifyCode(e.target.value); setVerifyError(false); }}
          placeholder="000000"
          maxLength={6}
          style={{ width: "100%", fontSize: 20, letterSpacing: 6, textAlign: "center",
            padding: "10px 12px", border: `0.5px solid ${verifyError ? "#c0392b" : BORDER}`,
            borderRadius: 6, marginBottom: 8, fontFamily: "inherit", boxSizing: "border-box" }}
        />
        {verifyError && (
          <div style={{ fontSize: 13, color: "#c0392b", marginBottom: 12 }}>
            That code didn't work. Please try again.
          </div>
        )}
        <div style={actionsRow}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button
            onClick={() => {
              if (verifyCode.length === 6) { setStep("done"); }
              else setVerifyError(true);
            }}
            style={primaryBtnStyle}
          >Verify</button>
        </div>
      </ModalShell>
    );
  }

  if (step === "phone") {
    return (
      <ModalShell onClose={onClose}>
        <div style={titleStyle}>Enter your phone number</div>
        <div style={bodyStyle}>We'll send a verification code by text message.</div>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="(604) 555-0123"
          style={{ width: "100%", fontSize: 15, padding: "8px 12px",
            border: `0.5px solid ${BORDER}`, borderRadius: 6, marginBottom: 20,
            fontFamily: "inherit", boxSizing: "border-box" }}
        />
        <div style={actionsRow}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button
            onClick={() => phoneNumber.trim() && setStep("verify-sms")}
            style={primaryBtnStyle}
          >Send code</button>
        </div>
      </ModalShell>
    );
  }

  if (step === "done") {
    return (
      <ModalShell onClose={onComplete}>
        <div style={titleStyle}>Two-factor authentication is on</div>
        <div style={bodyStyle}>
          You'll be asked for a verification code the next time you sign in.
        </div>
        <div style={actionsRow}>
          <button onClick={onComplete} style={primaryBtnStyle}>Done</button>
        </div>
      </ModalShell>
    );
  }

  // suppress unused warnings
  void method; void setMethod;
  return null;
}

function PasswordModal({ step, setStep, currentPw, setCurrentPw, newPw, setNewPw,
  confirmPw, setConfirmPw, pwError, setPwError, onClose }: {
  step: PwStep;
  setStep: (s: PwStep | null) => void;
  currentPw: string; setCurrentPw: (v: string) => void;
  newPw: string; setNewPw: (v: string) => void;
  confirmPw: string; setConfirmPw: (v: string) => void;
  pwError: string; setPwError: (v: string) => void;
  onClose: () => void;
}) {
  const titleStyle: CSSProperties = { fontSize: 18, fontWeight: 700, color: WF_DARK, marginBottom: 6 };
  const bodyStyle: CSSProperties = { fontSize: 14, color: WF_MID, marginBottom: 20, lineHeight: 1.6 };
  const inputStyle: CSSProperties = { width: "100%", fontSize: 15, padding: "8px 12px",
    border: `0.5px solid ${BORDER}`, borderRadius: 6, marginBottom: 12,
    fontFamily: "inherit", boxSizing: "border-box" };

  if (step === "current") {
    return (
      <ModalShell onClose={onClose}>
        <div style={titleStyle}>Change password</div>
        <div style={bodyStyle}>Enter your current password to continue.</div>
        <input type="password" value={currentPw}
          onChange={(e) => setCurrentPw(e.target.value)}
          placeholder="Current password" style={inputStyle} />
        <div style={actionsRow}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button
            onClick={() => currentPw.trim() ? setStep("new") : setPwError("Please enter your current password.")}
            style={primaryBtnStyle}
          >Continue</button>
        </div>
        {pwError && <div style={{ fontSize: 13, color: "#c0392b", marginTop: 8 }}>{pwError}</div>}
      </ModalShell>
    );
  }

  if (step === "new") {
    return (
      <ModalShell onClose={onClose}>
        <div style={titleStyle}>Set a new password</div>
        <div style={bodyStyle}>Choose a new password with at least 8 characters.</div>
        <input type="password" value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          placeholder="New password" style={inputStyle} />
        <input type="password" value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
          placeholder="Confirm new password" style={inputStyle} />
        {pwError && <div style={{ fontSize: 13, color: "#c0392b", marginBottom: 8 }}>{pwError}</div>}
        <div style={actionsRow}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button
            onClick={() => {
              if (newPw.length < 8) { setPwError("Password must be at least 8 characters."); return; }
              if (newPw !== confirmPw) { setPwError("Passwords don't match."); return; }
              setPwError(""); setStep("done");
            }}
            style={primaryBtnStyle}
          >Update password</button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose}>
      <div style={titleStyle}>Password updated</div>
      <div style={bodyStyle}>Your password has been changed successfully.</div>
      <div style={actionsRow}>
        <button onClick={onClose} style={primaryBtnStyle}>Done</button>
      </div>
    </ModalShell>
  );
}
