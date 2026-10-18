// ============================================================
//  register.js  —  Advocate Hub CLIENT Registration Page
//  ------------------------------------------------------------
//  Standalone page (no advocate tab) for clients only.
//  On submit -> POST /api/auth/client/register
//  Success    -> shows success screen -> redirects to /login
//  Duplicate email (409) / other errors are shown inline + toast
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { getTheme, toggleTheme as toggleGlobalTheme } from "../data/themeStore";
import { CITIES, PRACTICE_AREAS } from "./Signup";
import "./Register.css";

// ── If your backend runs on a different origin/port, set it here ──
// e.g. const API_BASE = "http://localhost:5000";
const API_BASE = "";

// ── Admin-Style SVG Icons (feather/lucide style) ───────────────
export const ADMIN_ICONS = {
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  pin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  scale: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM7 21h10M12 3v18M3 7h18" />
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  key: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  verified: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  arrowLeft: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
};

// ── Data ─────────────────────────────────────────────────────
// ── Helpers ───────────────────────────────────────────────────
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isValidPhone(p) { return /^\d{10}$/.test(p.replace(/\s|-/g, "")); }

function PwStrength({ pw }) {
  if (!pw) return null;
  let s = 0;
  if (pw.length >= 6)          s++;
  if (pw.length >= 10)         s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const LV = [
    { label: "Very Weak", c: "#ef4444" },
    { label: "Weak",      c: "#f97316" },
    { label: "Fair",      c: "#f59e0b" },
    { label: "Good",      c: "#84cc16" },
    { label: "Strong",    c: "#22c55e" },
  ];
  const lv = LV[Math.min(s, 4)];
  return (
    <div className="rg-pw-strength">
      <div className="rg-pw-bars">
        {LV.map((_, i) => (
          <div key={i} className="rg-pw-bar" style={{ background: i < s ? lv.c : "#e2e8f0" }} />
        ))}
      </div>
      <span style={{ color: lv.c, fontSize: 11, fontWeight: 600 }}>{lv.label}</span>
    </div>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <div className="rg-field">
      {label && (
        <label className="rg-label">
          {label}{required && <span className="rg-req"> *</span>}
        </label>
      )}
      {children}
      {hint  && !error && <p className="rg-hint">{hint}</p>}
      {error && <p className="rg-field-err">⚠ {error}</p>}
    </div>
  );
}

function Input({ icon, error, type = "text", rightEl, ...props }) {
  return (
    <div className={`rg-input-wrap ${error ? "error" : ""}`}>
      {icon && <span className="rg-input-icon">{icon}</span>}
      <input type={type} className="rg-input" {...props} />
      {rightEl}
    </div>
  );
}

// ── Success Screen ────────────────────────────────────────────
function SuccessScreen({ name, onLogin, channel = "email", isApproved = false, email = "", phone = "", city = "" }) {
  const isPending = !isApproved || channel === "admin_approval";
  const channelLabel = channel === "admin_approval"
    ? "Admin Approval"
    : channel === "whatsapp"
    ? "WhatsApp"
    : channel === "sms"
    ? "SMS"
    : "Email";

  return (
    <div className="rg-success" style={{ maxWidth: 540, margin: "0 auto", textAlign: "center" }}>
      <div className="rg-success-icon" style={{ fontSize: "3.2rem", marginBottom: 10 }}>
        {isPending ? "⏳" : "✅"}
      </div>
      <h2 className="rg-success-title" style={{ fontSize: "1.65rem", marginBottom: 8 }}>
        {isPending
          ? "Registration Submitted · Pending Admin Approval"
          : "Registration Verified & Approved!"}
      </h2>
      <p className="rg-success-msg" style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--rg-muted, #94a3b8)", marginBottom: 18 }}>
        Welcome to AdvocateHub, <strong>{name}</strong>!<br />
        {isPending ? (
          "Your registration request has been submitted successfully. Your account will be activated after administrator approval."
        ) : (
          <>
            Your identity has been verified via <strong>{channelLabel}</strong>. Your client account has been <strong>automatically approved and activated</strong>!
          </>
        )}
      </p>

      <div style={{
        background: isPending ? "rgba(245, 158, 11, 0.08)" : "rgba(16, 185, 129, 0.08)",
        border: isPending ? "1px solid rgba(245, 158, 11, 0.35)" : "1px solid rgba(16, 185, 129, 0.35)",
        borderRadius: 12,
        padding: "16px 20px",
        textAlign: "left",
        margin: "16px 0 20px",
        fontSize: "0.88rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: isPending ? "#d97706" : "#059669", marginBottom: 10 }}>
          <span style={{ fontSize: "1.1rem" }}>{isPending ? "⏳" : "✓"}</span>
          <span>Status: {isPending ? "Awaiting Administrator Approval" : "Account Approved & Active"}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", color: "var(--rg-text, #e2e8f0)", fontSize: "0.85rem" }}>
          {email && <div style={{ wordBreak: "break-all" }}><strong>Email:</strong> {email}</div>}
          {phone && <div><strong>Mobile:</strong> {phone}</div>}
          {city && <div><strong>City:</strong> {city}</div>}
          <div><strong>Method:</strong> {channelLabel}</div>
        </div>

        {isPending && (
          <>
            <hr style={{ border: 0, borderTop: "1px solid rgba(245, 158, 11, 0.2)", margin: "12px 0 8px" }} />
            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--rg-muted, #94a3b8)", lineHeight: 1.5 }}>
              🛡️ <strong>Admin Verification:</strong> Your registration request is in the administrator approval queue. Once approved, you will be able to log in to your client portal. Check back anytime using your email address.
            </p>
          </>
        )}
      </div>

      <div className="rg-success-steps" style={{ display: "flex", flexDirection: "column", gap: 8, margin: "14px 0 22px" }}>
        <div className="rg-ss done">✅ Registration Profile Created</div>
        <div className="rg-ss done">✅ Channel: {channelLabel}</div>
        <div className="rg-ss done" style={{ color: isPending ? "#d97706" : "#16a34a", fontWeight: 700 }}>
          {isPending ? "⏳ Administrator Review (Pending Approval)" : "✅ Administrator Review (Auto-Approved)"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {isPending && (
          <Link
            to={`/registration-status?email=${encodeURIComponent(email || "")}`}
            className="rg-btn-secondary"
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              background: "rgba(59, 130, 246, 0.12)",
              color: "#3b82f6",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6
            }}
          >
            🔍 Check Live Approval Status
          </Link>
        )}
        <button className="rg-btn-primary" onClick={onLogin} style={{ padding: "10px 20px" }}>
          {isPending ? "Go to Client Login →" : "Proceed to Client Login →"}
        </button>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const MAP = {
    success: { bg: "#dcfce7", c: "#14532d", b: "#bbf7d0", i: "✅" },
    error:   { bg: "#fee2e2", c: "#7f1d1d", b: "#fecaca", i: "❌" },
    info:    { bg: "#dbeafe", c: "#1e3a5f", b: "#bfdbfe", i: "ℹ️" },
  };
  const s = MAP[toast.type] || MAP.info;
  return (
    <div className="rg-toast" style={{ background: s.bg, color: s.c, border: `1px solid ${s.b}` }}>
      {s.i} {toast.msg}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN CLIENT REGISTER COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Register() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("law4u_theme") || localStorage.getItem("law4u_client_theme") || "dark";
    } catch { return "dark"; }
  });
  const [view, setView]       = useState("form"); // "form" | "success"
  const [activeStep, setActiveStep] = useState(1);
  const [toast, setToast]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [registrationApproved, setRegistrationApproved] = useState(false);
  const [otpChannel, setOtpChannel] = useState("email"); // "email" | "sms" | "whatsapp" | "admin_approval"

  const [client, setClient] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPw: "",
    city: "", legalIssue: "", agreeTerms: false,
  });
  const [err, setErr] = useState({});

  const isStep1Done = Boolean(client.fullName.trim() && isValidPhone(client.phone) && isValidEmail(client.email));
  const isStep2Done = Boolean(client.password && client.password.length >= 6 && client.password === client.confirmPw && client.agreeTerms);
  const isStep3Done = Boolean(otpChannel);

  const validateStep1 = () => {
    const e = {};
    if (!client.fullName.trim()) e.fullName = "Full name is required";
    if (!client.phone.trim()) e.phone = "Phone is required";
    else if (!isValidPhone(client.phone)) e.phone = "Enter valid 10-digit phone";
    if (!client.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(client.email)) e.email = "Invalid email format";

    if (Object.keys(e).length > 0) {
      setErr((prev) => ({ ...prev, ...e }));
      showToast("Please fill in required personal details", "error");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const e = {};
    if (!client.password) e.password = "Password is required";
    else if (client.password.length < 6) e.password = "Min 6 characters";
    if (client.password !== client.confirmPw) e.confirmPw = "Passwords do not match";
    if (!client.agreeTerms) e.agreeTerms = "Please accept terms of service";

    if (Object.keys(e).length > 0) {
      setErr((prev) => ({ ...prev, ...e }));
      showToast("Please complete security & terms agreement", "error");
      return false;
    }
    return true;
  };

  const handleNextToStep2 = () => {
    if (validateStep1()) {
      setActiveStep(2);
    }
  };

  const handleNextToStep3 = () => {
    if (!validateStep1()) {
      setActiveStep(1);
      return;
    }
    if (validateStep2()) {
      setActiveStep(3);
    }
  };

  const handlePrevToStep1 = () => {
    setActiveStep(1);
  };

  const handlePrevToStep2 = () => {
    setActiveStep(2);
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const handleTheme = (event) => setTheme(event.detail || getTheme());
    window.addEventListener("law4u_theme_change", handleTheme);
    return () => window.removeEventListener("law4u_theme_change", handleTheme);
  }, []);

  const handleThemeToggle = () => setTheme(toggleGlobalTheme());

  const showToast = (msg, type = "info") => setToast({ msg, type });

  const setC = (k, v) => {
    setClient((p) => ({ ...p, [k]: v }));
    setErr((p) => ({ ...p, [k]: "" }));
  };

  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (!otpStep || resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpStep, resendTimer]);

  // ── Validate ──────────────────────────────────────────────
  const validate = () => {
    const e = {};
    let firstErrStep = null;
    if (!client.fullName.trim()) { e.fullName = "Full name is required"; if (!firstErrStep) firstErrStep = 1; }
    if (!client.phone.trim()) { e.phone = "Phone is required"; if (!firstErrStep) firstErrStep = 1; }
    else if (!isValidPhone(client.phone)) { e.phone = "Enter valid 10-digit phone"; if (!firstErrStep) firstErrStep = 1; }
    if (!client.email.trim()) { e.email = "Email is required"; if (!firstErrStep) firstErrStep = 1; }
    else if (!isValidEmail(client.email)) { e.email = "Invalid email format"; if (!firstErrStep) firstErrStep = 1; }

    if (!client.password) { e.password = "Password is required"; if (!firstErrStep) firstErrStep = 2; }
    else if (client.password.length < 6) { e.password = "Min 6 characters"; if (!firstErrStep) firstErrStep = 2; }
    if (client.password !== client.confirmPw) { e.confirmPw = "Passwords do not match"; if (!firstErrStep) firstErrStep = 2; }
    if (!client.agreeTerms) { e.agreeTerms = "Please accept terms of service"; if (!firstErrStep) firstErrStep = 2; }

    if (!otpChannel) {
      if (!firstErrStep) firstErrStep = 3;
    }

    setErr(e);
    if (firstErrStep) {
      setActiveStep(firstErrStep);
      showToast(
        firstErrStep === 1
          ? "Please complete personal details"
          : firstErrStep === 2
          ? "Please complete security details"
          : "Please select a verification channel",
        "error"
      );
      return false;
    }
    return !Object.keys(e).length;
  };

  // ── Send Registration OTP via Email / SMS / WhatsApp ─────────────
  const handleSendClientOtp = async (channelToUse) => {
    const activeChan = channelToUse || otpChannel || "email";
    setOtpErr("");
    setLoading(true);
    try {
      const emailLower = client.email.trim().toLowerCase();
      const phoneClean = client.phone.trim();
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: client.fullName.trim(),
          email: emailLower,
          phone: phoneClean,
          role: "client",
          channel: activeChan,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMessage = data.message || data.error || "Failed to send verification code. Try again.";
        if (res.status === 409) {
          setErr((p) => ({ ...p, email: errorMessage }));
          setActiveStep(1);
        }
        showToast(errorMessage, "error");
        setLoading(false);
        return;
      }

      setOtpChannel(activeChan);
      const chanLabel = activeChan === "whatsapp" ? "WhatsApp" : activeChan === "sms" ? "SMS" : "Email";
      const targetTxt = activeChan === "email" ? emailLower : `+91 ${phoneClean.replace(/\D/g, "").slice(-10)}`;
      showToast(`Verification code sent via ${chanLabel} to ${targetTxt} 🎉`, "success");
      setOtpStep(true);
      setResendTimer(60);
      setOtpCode("");
    } catch (err) {
      console.error(err);
      showToast("Could not reach the server. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectAdminSubmit = async () => {
    setLoading(true);
    try {
      const emailLower = client.email.trim().toLowerCase();
      const res = await fetch(`${API_BASE}/api/clients/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: client.fullName.trim(),
          email: emailLower,
          password: client.password,
          phone: client.phone.trim(),
          city: client.city,
          legalIssue: client.legalIssue,
          verificationMethod: "admin_approval",
          verificationChannel: "admin_approval",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorMsg = data.message || data.error || "Failed to submit registration request.";
        showToast(errorMsg, "error");
        setLoading(false);
        return;
      }

      setSuccessName(client.fullName.trim());
      setRegistrationApproved(false);
      setView("success");
      showToast("Registration request submitted! Awaiting administrator approval.", "success");

      // Open live status in a new tab as requested
      try {
        const statusUrl = `/registration-status?email=${encodeURIComponent(emailLower)}`;
        window.open(statusUrl, "_blank");
      } catch (e) {
        console.warn("Could not open new tab:", e);
      }
    } catch (err) {
      console.error(err);
      showToast("Could not submit registration. Check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validate()) return;
    if (otpChannel === "admin_approval") {
      handleDirectAdminSubmit();
      return;
    }
    handleSendClientOtp(otpChannel);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) return;
    await handleSendClientOtp(otpChannel);
  };

  const handleVerifyAndRegister = async (e) => {
    e?.preventDefault();
    const cleanCode = String(otpCode || "").trim();
    if (!cleanCode || cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      setOtpErr("Please enter the 6-digit numeric verification code");
      return;
    }

    setLoading(true);
    setOtpErr("");

    try {
      const emailLower = client.email.trim().toLowerCase();
      const res = await fetch(`${API_BASE}/api/clients/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: client.fullName.trim(),
          email: emailLower,
          password: client.password,
          phone: client.phone.trim(),
          city: client.city,
          legalIssue: client.legalIssue,
          otp: cleanCode,
          verificationMethod: otpChannel,
          verificationChannel: otpChannel,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg = data.message || data.error || "Invalid verification code.";
        setOtpErr(errorMsg);
        showToast(errorMsg, "error");
        setLoading(false);
        return;
      }

      // Registration successful and auto-approved
      setSuccessName(client.fullName.trim());
      setRegistrationApproved(true);
      setOtpStep(false);
      setView("success");
      showToast("Verification successful & account auto-approved! 🎉", "success");
    } catch (err) {
      console.error(err);
      setOtpErr("Could not complete registration. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => navigate("/client-login");

  if (view === "success") {
    return (
      <div className={`rg-page ${theme === "dark" ? "rg-dark" : "rg-light"}`}>
        <button type="button" className="rg-theme-toggle" onClick={handleThemeToggle} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
          {theme === "dark" ? "☀" : "☾"}
        </button>
        <Toast toast={toast} />
        <div className="rg-card rg-success-card">
          <SuccessScreen
            name={successName}
            onLogin={goToLogin}
            channel={otpChannel}
            isApproved={registrationApproved}
            email={client.email}
            phone={client.phone}
            city={client.city}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`rg-page ${theme === "dark" ? "rg-dark" : "rg-light"}`}>
      <Toast toast={toast} />

      {/* Real Multi-Channel OTP Verification Modal */}
      {otpStep && (
        <div className="rg-modal-overlay">
          <div className="rg-modal-card" style={{ maxWidth: 480, textAlign: "center" }}>
            <button
              type="button"
              className="rg-modal-theme-toggle"
              onClick={handleThemeToggle}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <div className="rg-otp-badge" style={{ fontSize: "2.2rem" }}>
              {otpChannel === "whatsapp" ? "🟢" : otpChannel === "sms" ? "💬" : "✉️"}
            </div>
            <h2 className="rg-title" style={{ fontSize: "1.55rem", marginTop: 8 }}>
              {otpChannel === "whatsapp" ? "Verify via WhatsApp" : otpChannel === "sms" ? "Verify via SMS" : "Verify Your Email"}
            </h2>

            {/* Choose Verification Channel (Email / SMS / WhatsApp) */}
            <div style={{ margin: "14px 0 16px" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--rg-muted, #64748b)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Select Verification Channel:
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    if (otpChannel !== "email" && !loading) {
                      handleSendClientOtp("email");
                    }
                  }}
                  disabled={loading}
                  style={{
                    padding: "9px 6px",
                    borderRadius: 10,
                    border: otpChannel === "email" ? "2px solid #3b82f6" : "1px solid #cbd5e1",
                    background: otpChannel === "email" ? "rgba(59, 130, 246, 0.14)" : "transparent",
                    color: otpChannel === "email" ? "#2563eb" : "inherit",
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  ✉️ Email
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (otpChannel !== "sms" && !loading) {
                      handleSendClientOtp("sms");
                    }
                  }}
                  disabled={loading}
                  style={{
                    padding: "9px 6px",
                    borderRadius: 10,
                    border: otpChannel === "sms" ? "2px solid #059669" : "1px solid #cbd5e1",
                    background: otpChannel === "sms" ? "rgba(5, 150, 105, 0.14)" : "transparent",
                    color: otpChannel === "sms" ? "#059669" : "inherit",
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  💬 SMS
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (otpChannel !== "whatsapp" && !loading) {
                      handleSendClientOtp("whatsapp");
                    }
                  }}
                  disabled={loading}
                  style={{
                    padding: "9px 6px",
                    borderRadius: 10,
                    border: otpChannel === "whatsapp" ? "2px solid #16a34a" : "1px solid #cbd5e1",
                    background: otpChannel === "whatsapp" ? "rgba(34, 197, 94, 0.14)" : "transparent",
                    color: otpChannel === "whatsapp" ? "#16a34a" : "inherit",
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  🟢 WhatsApp
                </button>
              </div>
            </div>

            <p className="rg-subtitle" style={{ fontSize: "0.93rem", margin: "6px 0 14px", color: "var(--rg-muted, #64748b)" }}>
              {otpChannel === "email" ? (
                <>
                  We've sent a 6-digit verification code to<br />
                  <strong style={{ color: "var(--rg-accent, #2563eb)", wordBreak: "break-all" }}>
                    {client.email.trim()}
                  </strong>
                </>
              ) : (
                <>
                  We've sent a 6-digit verification code via {otpChannel === "whatsapp" ? "WhatsApp" : "SMS"} to<br />
                  <strong style={{ color: "var(--rg-accent, #2563eb)" }}>
                    +91 {client.phone.replace(/\D/g, "").slice(-10)}
                  </strong>
                </>
              )}
            </p>
            <div style={{ display: "inline-block", background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: "0.82rem", fontWeight: 600, padding: "5px 14px", borderRadius: 9999, marginBottom: 18 }}>
              ⏱️ Code expires in 5 minutes
            </div>

            <form onSubmit={handleVerifyAndRegister}>
              <Field error={otpErr}>
                <input
                  type="text"
                  className="rg-input rg-otp-input"
                  placeholder="000000"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, ""));
                    setOtpErr("");
                  }}
                  autoFocus
                  disabled={loading}
                  style={{
                    textAlign: "center",
                    letterSpacing: "8px",
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}
                />
              </Field>

              <button type="submit" className="rg-btn-primary rg-btn-lg" disabled={loading} style={{ width: "100%", marginTop: 12 }}>
                {loading ? <><span className="rg-spinner" /> Verifying Code…</> : "Verify & Complete Registration →"}
              </button>
            </form>

            <div style={{ marginTop: 20, fontSize: "0.88rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                style={{ background: "none", border: 0, color: "var(--rg-muted, #64748b)", cursor: "pointer", textDecoration: "underline", font: "inherit" }}
                onClick={() => setOtpStep(false)}
                disabled={loading}
              >
                ← Change Details
              </button>

              <button
                type="button"
                style={{
                  background: "none",
                  border: 0,
                  color: resendTimer > 0 ? "var(--rg-muted, #94a3b8)" : "var(--rg-accent, #2563eb)",
                  cursor: resendTimer > 0 ? "default" : "pointer",
                  fontWeight: 700,
                  font: "inherit",
                }}
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || loading}
              >
                {resendTimer > 0 ? `Resend (${resendTimer}s)` : `Resend via ${otpChannel === "whatsapp" ? "WhatsApp" : otpChannel === "sms" ? "SMS" : "Email"}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rg-card">

        <button type="button" className="rg-theme-toggle" onClick={handleThemeToggle} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
          {theme === "dark" ? "☀" : "☾"}
        </button>

        <div className="rg-top-bar">
          <Link to="/signup" className="rg-back-link">
            <span>←</span> Back to Sign Up Page
          </Link>
          <Link to="/" className="rg-logo">
            <BrandLogo size={38} wordmark={true} dark={theme === "dark"} />
          </Link>
        </div>

        {/* Header */}
        <div className="rg-header">
          <h1 className="rg-title">Create Your Client Account</h1>
          <p className="rg-subtitle">India's Most Trusted Legal Platform</p>
        </div>

        <div className="rg-tab-desc">
          🔍 Find trusted advocates, get legal advice, and resolve your legal matters.
        </div>

        <form className="rg-form" onSubmit={handleSubmit} noValidate>
          {/* 3-Step Navigation Tabs Header */}
          <div className="rg-step-tabs-nav" role="tablist" aria-label="Registration Steps">
            <button
              type="button"
              role="tab"
              aria-selected={activeStep === 1}
              className={`rg-step-tab-btn ${activeStep === 1 ? "active" : ""} ${isStep1Done ? "completed" : ""}`}
              onClick={() => setActiveStep(1)}
            >
              <div className="rg-step-tab-indicator">
                {isStep1Done && activeStep !== 1 ? (
                  <span className="rg-step-check">{ADMIN_ICONS.check}</span>
                ) : (
                  <span className="rg-step-num">1</span>
                )}
              </div>
              <div className="rg-step-tab-content">
                <div className="rg-step-tab-title">
                  <span className="rg-tab-icon">{ADMIN_ICONS.user}</span>
                  <span>Personal Details</span>
                </div>
                <div className="rg-step-tab-sub">Name, Phone, Email & Location</div>
              </div>
              {isStep1Done && <span className="rg-step-done-badge">Done</span>}
            </button>

            <div className="rg-step-tab-connector" />

            <button
              type="button"
              role="tab"
              aria-selected={activeStep === 2}
              className={`rg-step-tab-btn ${activeStep === 2 ? "active" : ""} ${isStep2Done ? "completed" : ""}`}
              onClick={handleNextToStep2}
            >
              <div className="rg-step-tab-indicator">
                {isStep2Done && activeStep !== 2 ? (
                  <span className="rg-step-check">{ADMIN_ICONS.check}</span>
                ) : (
                  <span className="rg-step-num">2</span>
                )}
              </div>
              <div className="rg-step-tab-content">
                <div className="rg-step-tab-title">
                  <span className="rg-tab-icon">{ADMIN_ICONS.shield}</span>
                  <span>Security</span>
                </div>
                <div className="rg-step-tab-sub">Password & Account Terms</div>
              </div>
              {isStep2Done && <span className="rg-step-done-badge">Done</span>}
            </button>

            <div className="rg-step-tab-connector" />

            <button
              type="button"
              role="tab"
              aria-selected={activeStep === 3}
              className={`rg-step-tab-btn ${activeStep === 3 ? "active" : ""} ${isStep3Done ? "completed" : ""}`}
              onClick={handleNextToStep3}
            >
              <div className="rg-step-tab-indicator">
                {isStep3Done && activeStep !== 3 ? (
                  <span className="rg-step-check">{ADMIN_ICONS.check}</span>
                ) : (
                  <span className="rg-step-num">3</span>
                )}
              </div>
              <div className="rg-step-tab-content">
                <div className="rg-step-tab-title">
                  <span className="rg-tab-icon">{ADMIN_ICONS.verified}</span>
                  <span>Verification</span>
                </div>
                <div className="rg-step-tab-sub">OTP or Admin Approval</div>
              </div>
              {isStep3Done && <span className="rg-step-done-badge">Done</span>}
            </button>
          </div>

          {/* STEP 1: Personal Details */}
          {activeStep === 1 && (
            <div className="rg-step-body rg-fade-in">
              <div className="rg-form-section-title">
                <span className="rg-tab-icon" style={{ marginRight: 6 }}>{ADMIN_ICONS.user}</span>
                1. Personal Details
              </div>

              <div className="rg-grid-2">
                <Field label="Full Name" required error={err.fullName}>
                  <Input
                    icon={ADMIN_ICONS.user}
                    placeholder="Your full name"
                    value={client.fullName}
                    onChange={(e) => setC("fullName", e.target.value)}
                    error={err.fullName}
                    disabled={loading}
                  />
                </Field>

                <Field label="Phone Number" required error={err.phone}>
                  <Input
                    icon={ADMIN_ICONS.phone}
                    placeholder="10-digit mobile number"
                    type="tel"
                    value={client.phone}
                    onChange={(e) => setC("phone", e.target.value)}
                    error={err.phone}
                    disabled={loading}
                    maxLength={10}
                  />
                </Field>
              </div>

              <Field label="Email Address" required error={err.email}>
                <Input
                  icon={ADMIN_ICONS.mail}
                  type="email"
                  placeholder="your@email.com"
                  value={client.email}
                  onChange={(e) => setC("email", e.target.value)}
                  error={err.email}
                  disabled={loading}
                  rightEl={client.email && isValidEmail(client.email) && <span className="rg-valid">{ADMIN_ICONS.check}</span>}
                />
              </Field>

              <div className="rg-grid-2">
                <Field label="City" error={err.city}>
                  <ScrollSelect
                    icon={ADMIN_ICONS.pin}
                    placeholder="Select your city"
                    value={client.city}
                    onChange={(val) => setC("city", val)}
                    options={CITIES}
                    disabled={loading}
                    error={err.city}
                  />
                </Field>

                <Field label="Legal Issue" error={err.legalIssue}>
                  <ScrollSelect
                    icon={ADMIN_ICONS.scale}
                    placeholder="Select legal issue"
                    value={client.legalIssue}
                    onChange={(val) => setC("legalIssue", val)}
                    options={PRACTICE_AREAS}
                    disabled={loading}
                    error={err.legalIssue}
                  />
                </Field>
              </div>

              <div className="rg-step-nav-actions">
                <div />
                <button
                  type="button"
                  className="rg-btn-next"
                  onClick={handleNextToStep2}
                >
                  <span>Next: Security (2/3)</span>
                  {ADMIN_ICONS.arrowRight}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Security & Credentials */}
          {activeStep === 2 && (
            <div className="rg-step-body rg-fade-in">
              <div className="rg-form-section-title">
                <span className="rg-tab-icon" style={{ marginRight: 6 }}>{ADMIN_ICONS.shield}</span>
                2. Security &amp; Credentials
              </div>

              <div className="rg-grid-2">
                <Field label="Password" required error={err.password}>
                  <Input
                    icon={ADMIN_ICONS.lock}
                    type={showPw ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={client.password}
                    onChange={(e) => setC("password", e.target.value)}
                    error={err.password}
                    disabled={loading}
                    rightEl={
                      <button type="button" className="rg-eye" onClick={() => setShowPw((p) => !p)}>
                        {showPw ? "🙈" : "👁️"}
                      </button>
                    }
                  />
                  <PwStrength pw={client.password} />
                </Field>

                <Field label="Confirm Password" required error={err.confirmPw}>
                  <Input
                    icon={ADMIN_ICONS.key}
                    type={showCPw ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={client.confirmPw}
                    onChange={(e) => setC("confirmPw", e.target.value)}
                    error={err.confirmPw}
                    disabled={loading}
                    rightEl={
                      client.confirmPw && client.password === client.confirmPw ? (
                        <span className="rg-valid">{ADMIN_ICONS.check}</span>
                      ) : (
                        <button type="button" className="rg-eye" onClick={() => setShowCPw((p) => !p)}>
                          {showCPw ? "🙈" : "👁️"}
                        </button>
                      )
                    }
                  />
                </Field>
              </div>

              <label className="rg-agree">
                <input
                  type="checkbox"
                  checked={client.agreeTerms}
                  onChange={(e) => setC("agreeTerms", e.target.checked)}
                />
                <span>
                  I agree to the <a href="/terms" target="_blank" rel="noreferrer">Terms of Service</a> and{" "}
                  <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
                </span>
              </label>
              {err.agreeTerms && <p className="rg-field-err">⚠ {err.agreeTerms}</p>}

              <div className="rg-step-nav-actions">
                <button
                  type="button"
                  className="rg-btn-prev"
                  onClick={handlePrevToStep1}
                  disabled={loading}
                >
                  {ADMIN_ICONS.arrowLeft}
                  <span>Previous: Personal Details</span>
                </button>

                <button
                  type="button"
                  className="rg-btn-next"
                  onClick={handleNextToStep3}
                  disabled={loading}
                >
                  <span>Next: Verification Channel (3/3)</span>
                  {ADMIN_ICONS.arrowRight}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Select Verification Channel */}
          {activeStep === 3 && (
            <div className="rg-step-body rg-fade-in">
              <div className="rg-form-section-title">
                <span className="rg-tab-icon" style={{ marginRight: 6 }}>{ADMIN_ICONS.verified}</span>
                3. Select Verification Channel
              </div>

              {/* Select Verification Channel Section */}
              <div className="rg-verification-channel-section" style={{ margin: "10px 0 20px" }}>
                <div className="rg-channel-section-header">
                  <div className="rg-channel-section-title">
                    <span>🛡️</span>
                    <h3>Select Verification Channel</h3>
                  </div>
                  <p className="rg-channel-section-desc">
                    Please select one verification method to activate your account. OTP methods are automatically approved upon successful verification.
                  </p>
                </div>

                <div className="rg-channel-grid">
                  {/* Option 1: Email OTP */}
                  <div
                    className={`rg-channel-card ${otpChannel === "email" ? "selected" : ""}`}
                    onClick={() => setOtpChannel("email")}
                  >
                    <div className="rg-channel-radio-wrap">
                      <input
                        type="radio"
                        id="client-chan-email"
                        name="clientOtpChannel"
                        checked={otpChannel === "email"}
                        onChange={() => setOtpChannel("email")}
                      />
                    </div>
                    <span className="rg-channel-icon">✉️</span>
                    <div className="rg-channel-content">
                      <div className="rg-channel-title">Email OTP Verification</div>
                      <div className="rg-channel-desc">
                        Receive a real 6-digit OTP code sent to your registered email address.
                      </div>
                      <span className="rg-channel-badge rg-badge-auto">⚡ Auto-Approved</span>
                    </div>
                  </div>

                  {/* Option 2: SMS OTP */}
                  <div
                    className={`rg-channel-card ${otpChannel === "sms" ? "selected" : ""}`}
                    onClick={() => setOtpChannel("sms")}
                  >
                    <div className="rg-channel-radio-wrap">
                      <input
                        type="radio"
                        id="client-chan-sms"
                        name="clientOtpChannel"
                        checked={otpChannel === "sms"}
                        onChange={() => setOtpChannel("sms")}
                      />
                    </div>
                    <span className="rg-channel-icon">💬</span>
                    <div className="rg-channel-content">
                      <div className="rg-channel-title">SMS OTP Verification</div>
                      <div className="rg-channel-desc">
                        Receive a real 6-digit OTP code sent via SMS to your mobile.
                      </div>
                      <span className="rg-channel-badge rg-badge-auto">⚡ Auto-Approved</span>
                    </div>
                  </div>

                  {/* Option 3: WhatsApp OTP */}
                  <div
                    className={`rg-channel-card ${otpChannel === "whatsapp" ? "selected" : ""}`}
                    onClick={() => setOtpChannel("whatsapp")}
                  >
                    <div className="rg-channel-radio-wrap">
                      <input
                        type="radio"
                        id="client-chan-whatsapp"
                        name="clientOtpChannel"
                        checked={otpChannel === "whatsapp"}
                        onChange={() => setOtpChannel("whatsapp")}
                      />
                    </div>
                    <span className="rg-channel-icon">🟢</span>
                    <div className="rg-channel-content">
                      <div className="rg-channel-title">WhatsApp OTP Verification</div>
                      <div className="rg-channel-desc">
                        Receive a real 6-digit OTP code sent directly on WhatsApp.
                      </div>
                      <span className="rg-channel-badge rg-badge-auto">⚡ Auto-Approved</span>
                    </div>
                  </div>

                  {/* Option 4: Admin Approval */}
                  <div
                    className={`rg-channel-card ${otpChannel === "admin_approval" ? "selected" : ""}`}
                    onClick={() => setOtpChannel("admin_approval")}
                  >
                    <div className="rg-channel-radio-wrap">
                      <input
                        type="radio"
                        id="client-chan-admin"
                        name="clientOtpChannel"
                        checked={otpChannel === "admin_approval"}
                        onChange={() => setOtpChannel("admin_approval")}
                      />
                    </div>
                    <span className="rg-channel-icon">🛡️</span>
                    <div className="rg-channel-content">
                      <div className="rg-channel-title">Admin Approval</div>
                      <div className="rg-channel-desc">
                        Submit request directly for administrator review without OTP.
                      </div>
                      <span className="rg-channel-badge rg-badge-admin">⏳ Manual Approval Required</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rg-step-nav-actions">
                <button
                  type="button"
                  className="rg-btn-prev"
                  onClick={handlePrevToStep2}
                  disabled={loading}
                >
                  {ADMIN_ICONS.arrowLeft}
                  <span>Previous: Security &amp; Password</span>
                </button>

                <button type="submit" className="rg-btn-submit" disabled={loading}>
                  {loading ? (
                    <><span className="rg-spinner" /> Processing…</>
                  ) : otpChannel === "admin_approval" ? (
                    <>
                      <span>🛡️ Submit for Admin Approval</span>
                      {ADMIN_ICONS.arrowRight}
                    </>
                  ) : (
                    <>
                      <span>Verify via {otpChannel === "whatsapp" ? "WhatsApp" : otpChannel === "sms" ? "SMS" : "Email"} OTP</span>
                      {ADMIN_ICONS.arrowRight}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <p className="rg-login-link">
            Already have an account? <Link to="/client-login">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

// ── Reusable Custom Scrollable Dropdown ───────────────────────
function ScrollSelect({ icon, placeholder, value, onChange, options = [], disabled, error }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`rg-scroll-select-container ${error ? "error" : ""}`} ref={containerRef}>
      <button
        type="button"
        className={`rg-input rg-scroll-select-trigger ${error ? "error" : ""}`}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
      >
        {icon && <span className="rg-input-icon">{icon}</span>}
        <span className={`rg-select-value ${!value ? "placeholder" : ""}`}>
          {value || placeholder}
        </span>
        <span className="rg-caret">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="rg-scroll-dropdown-menu">
          <div className="rg-dropdown-search">
            <input
              type="text"
              placeholder="🔍 Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="rg-dropdown-list">
            {filtered.length === 0 ? (
              <div className="rg-dropdown-item no-match">No matches found</div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item}
                  className={`rg-dropdown-item ${item === value ? "selected" : ""}`}
                  onClick={() => {
                    onChange(item);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
