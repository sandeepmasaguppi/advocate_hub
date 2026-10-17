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
function formatOtpChannels(channels) {
  const labels = { email: "Email", sms: "SMS", phone: "SMS", whatsapp: "WhatsApp" };
  const expanded = channels.flatMap((channel) => channel === "all" ? ["email", "sms"] : [channel]);
  return expanded.map((channel) => labels[channel] || channel).join(", ");
}
function maskPhone(p) {
  if (!p) return "";
  const cleaned = p.replace(/\D/g, "");
  if (cleaned.length <= 4) return cleaned;
  const last4 = cleaned.slice(-4);
  return `******${last4}`;
}

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
function SuccessScreen({ name, onLogin, isDirectAdmin = false }) {
  return (
    <div className="rg-success">
      <div className="rg-success-icon">⏳</div>
      <h2 className="rg-success-title">Registration Submitted!</h2>
      <p className="rg-success-msg">
        Welcome to Advocate Hub, <strong>{name}</strong>!<br />
        Your client account has been registered and is <strong>awaiting administrator approval</strong>. Once your profile is reviewed and approved by the admin, you will be able to log in.
      </p>
      <div className="rg-success-steps">
        <div className="rg-ss done">{isDirectAdmin ? "🏛️ Submitted for Admin Verification" : "✅ 6-digit OTP code verified"}</div>
        <div className="rg-ss done" style={{ color: "#d97706", fontWeight: 700 }}>⏳ Awaiting Admin Approval</div>
      </div>
      <button className="rg-btn-primary rg-btn-lg" onClick={onLogin} style={{ marginTop: 20 }}>
        Go to Client Login →
      </button>
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
  const [isDirectAdmin, setIsDirectAdmin] = useState(false);

  const [client, setClient] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPw: "",
    city: "", legalIssue: "", agreeTerms: false,
  });
  const [err, setErr] = useState({});

  const isStep1Done = Boolean(client.fullName.trim() && isValidPhone(client.phone) && isValidEmail(client.email));
  const isStep2Done = Boolean(client.password && client.password.length >= 6 && client.password === client.confirmPw && client.agreeTerms);

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

  const handleNextStep = () => {
    if (validateStep1()) {
      setActiveStep(2);
    }
  };

  const handlePrevStep = () => {
    setActiveStep(1);
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

  const [showChannelModal, setShowChannelModal] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [otpSentChannels, setOtpSentChannels] = useState([]);
  const [otpSetupError, setOtpSetupError] = useState("");
  const [activeWhatsappUrl, setActiveWhatsappUrl] = useState("");

  useEffect(() => {
    if (!otpStep || resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpStep, resendTimer]);

  const [otpChannel, setOtpChannel] = useState("all"); // "all" | "email" | "phone" | "whatsapp"

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
    if (!client.agreeTerms) { e.agreeTerms = "Please accept terms"; if (!firstErrStep) firstErrStep = 2; }

    setErr(e);
    if (firstErrStep) {
      setActiveStep(firstErrStep);
      showToast(firstErrStep === 1 ? "Please complete personal details" : "Please complete security details", "error");
      return false;
    }
    return !Object.keys(e).length;
  };

  // ── Initiate Signup: Open Channel Modal ───────────────────
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setShowChannelModal(true);
  };

  // ── Dispatch OTP via Selected Channel ─────────────────────
  const handleConfirmChannelAndSend = (selectedChannel) => {
    const channelToUse = selectedChannel || otpChannel;
    setOtpChannel(channelToUse);
    setOtpSetupError("");
    setLoading(true);

    (async () => {
      try {
        const emailLower = client.email.trim().toLowerCase();
        const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: client.fullName.trim(),
            email: emailLower,
            phone: client.phone.trim(),
            role: "client",
            channel: channelToUse,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const errorMessage = data.message || data.error || "Failed to send verification code. Try again.";
          if (res.status === 409) {
            setErr((p) => ({ ...p, email: errorMessage }));
          }
          setOtpSetupError(errorMessage);
          showToast(errorMessage, "error");
          setLoading(false);
          return;
        }

        const sentChannels = Array.isArray(data.sentChannels)
          ? data.sentChannels
          : [channelToUse === "phone" ? "sms" : channelToUse];
        setOtpSetupError("");
        setOtpSentChannels(sentChannels);
        if (data.whatsappUrl) {
          setActiveWhatsappUrl(data.whatsappUrl);
        } else {
          setActiveWhatsappUrl("");
        }
        setShowChannelModal(false);
        showToast(
          data.message || `Verification code sent via ${formatOtpChannels(sentChannels)}.`,
          data.failedChannels?.length ? "info" : "success"
        );
        setOtpStep(true);
        setResendTimer(60);
      } catch (err) {
        console.error(err);
        showToast("Could not reach the server. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleSelectAdminApproval = async () => {
    setLoading(true);
    setOtpSetupError("");
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
          channel: "admin",
          verificationMethod: "admin",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMessage = data.message || data.error || "Failed to submit for Admin Approval.";
        if (res.status === 409) {
          setErr((p) => ({ ...p, email: errorMessage }));
        }
        setOtpSetupError(errorMessage);
        showToast(errorMessage, "error");
        setLoading(false);
        return;
      }

      setSuccessName(client.fullName.trim());
      setIsDirectAdmin(true);
      setShowChannelModal(false);
      setOtpStep(false);
      setView("success");
      showToast("Registration submitted directly for Admin Approval ⏳", "success");
    } catch (err) {
      console.error(err);
      showToast("Could not reach the server. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      const emailLower = client.email.trim().toLowerCase();
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: client.fullName.trim(),
          email: emailLower,
          phone: client.phone.trim(),
          role: "client",
          channel: otpChannel,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const sentChannels = Array.isArray(data.sentChannels)
          ? data.sentChannels
          : [otpChannel === "phone" ? "sms" : otpChannel];
        setOtpSentChannels(sentChannels);
        if (data.whatsappUrl) {
          setActiveWhatsappUrl(data.whatsappUrl);
        }
        setOtpSetupError("");
        showToast(
          data.message || `A new verification code was sent via ${formatOtpChannels(sentChannels)}.`,
          data.failedChannels?.length ? "info" : "success"
        );
        setResendTimer(60);
      } else {
        const errorMessage = data.message || data.error || "Failed to resend code.";
        setOtpSetupError(errorMessage);
        showToast(errorMessage, "error");
      }
    } catch {
      showToast("Network error during resend.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e?.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setOtpErr("Please enter the 6-digit verification code");
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
          otp: otpCode.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setOtpErr(data.message || "Invalid verification code.");
        showToast(data.message || "Verification failed.", "error");
        setLoading(false);
        return;
      }

      // Registration successful with pending status
      setSuccessName(client.fullName.trim());
      setOtpStep(false);
      setView("success");
      showToast("OTP verified! Account submitted for admin approval ⏳", "success");
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
          <SuccessScreen name={successName} onLogin={goToLogin} isDirectAdmin={isDirectAdmin} />
        </div>
      </div>
    );
  }

  return (
    <div className={`rg-page ${theme === "dark" ? "rg-dark" : "rg-light"}`}>
      <Toast toast={toast} />

      {/* Full Screen OTP Delivery Channel Selection Modal (Mobile App Style) */}
      {showChannelModal && (
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
            <div className="rg-otp-badge">📲</div>
            <h2 className="rg-title" style={{ fontSize: "1.55rem" }}>Select OTP Delivery Channel</h2>
            <p className="rg-subtitle" style={{ fontSize: "0.92rem", margin: "6px 0 20px" }}>
              How would you like to receive your 6-digit verification code?
            </p>
            {otpSetupError && <p className="rg-otp-setup-error" role="alert">{otpSetupError}</p>}
            {loading && <p className="rg-otp-sending" role="status">Sending your verification code…</p>}

            <div className="rg-channel-card-list">
              <button
                type="button"
                className="rg-channel-option-card chan-email"
                onClick={() => handleConfirmChannelAndSend("email")}
                disabled={loading}
              >
                <div className="rg-channel-icon-avatar">✉️</div>
                <div className="rg-channel-body">
                  <div className="rg-channel-title">Email Address Only</div>
                  <div className="rg-channel-desc">Sent directly to {client.email}</div>
                </div>
                <div className="rg-channel-arrow">→</div>
              </button>

              <button
                type="button"
                className="rg-channel-option-card chan-sms"
                onClick={() => handleConfirmChannelAndSend("phone")}
                disabled={loading}
              >
                <div className="rg-channel-icon-avatar">📱</div>
                <div className="rg-channel-body">
                  <div className="rg-channel-title">Mobile SMS Message</div>
                  <div className="rg-channel-desc">Sent via SMS to +91 {maskPhone(client.phone)}</div>
                </div>
                <div className="rg-channel-arrow">→</div>
              </button>

              <button
                type="button"
                className="rg-channel-option-card chan-wa"
                onClick={() => handleConfirmChannelAndSend("whatsapp")}
                disabled={loading}
              >
                <div className="rg-channel-icon-avatar">💬</div>
                <div className="rg-channel-body">
                  <div className="rg-channel-title">WhatsApp Chat Message</div>
                  <div className="rg-channel-desc">Instant OTP to WhatsApp number {maskPhone(client.phone)}</div>
                </div>
                <div className="rg-channel-arrow">→</div>
              </button>

              <button
                type="button"
                className="rg-channel-option-card chan-admin"
                onClick={handleSelectAdminApproval}
                disabled={loading}
              >
                <div className="rg-channel-icon-avatar">🏛️</div>
                <div className="rg-channel-body">
                  <div className="rg-channel-title">
                    Admin Approval <span className="rg-channel-badge badge-admin">Direct Review</span>
                  </div>
                  <div className="rg-channel-desc">Submit application directly to Admin for verification & approval</div>
                </div>
                <div className="rg-channel-arrow">→</div>
              </button>
            </div>

            <button
              type="button"
              style={{ background: "none", border: 0, color: "var(--rg-muted)", cursor: "pointer", textDecoration: "underline", font: "inherit", fontSize: "0.88rem" }}
              onClick={() => {
                setOtpSetupError("");
                setShowChannelModal(false);
              }}
              disabled={loading}
            >
              ← Cancel & Back to Form
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {otpStep && (
        <div className="rg-modal-overlay">
          <div className="rg-modal-card">
            <button
              type="button"
              className="rg-modal-theme-toggle"
              onClick={handleThemeToggle}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <div className="rg-otp-badge">🔐</div>
            <h2 className="rg-title" style={{ fontSize: "1.6rem" }}>Verify Client Account</h2>
            <p className="rg-subtitle" style={{ fontSize: "0.95rem", margin: "8px 0 16px" }}>
              Verification code sent via<br />
              <strong style={{ color: "var(--rg-accent)" }}>
                {formatOtpChannels(otpSentChannels.length ? otpSentChannels : [otpChannel])}
              </strong>
            </p>
            <p style={{ fontSize: "0.82rem", color: "var(--rg-muted, #64748b)", background: "rgba(0,0,0,0.04)", padding: "8px 12px", borderRadius: "8px", margin: "0 0 20px" }}>
              Check the listed inboxes/messages and enter the code below to complete registration.
            </p>
            {otpSetupError && <p className="rg-otp-setup-error" role="alert">{otpSetupError}</p>}

            {activeWhatsappUrl && (
              <div style={{ marginBottom: 16 }}>
                <a
                  href={activeWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                    padding: "12px 18px",
                    background: "#22c55e",
                    color: "#ffffff",
                    borderRadius: 10,
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(34, 197, 94, 0.35)",
                  }}
                >
                  💬 Receive Verification Code on WhatsApp →
                </a>
              </div>
            )}

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
                />
              </Field>

              <button type="submit" className="rg-btn-primary rg-btn-lg" disabled={loading}>
                {loading ? <><span className="rg-spinner" /> Verifying…</> : "Verify & Complete Registration →"}
              </button>
            </form>

            <div style={{ marginTop: 18, fontSize: "0.88rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                style={{ background: "none", border: 0, color: "var(--rg-muted)", cursor: "pointer", textDecoration: "underline", font: "inherit" }}
                onClick={() => setOtpStep(false)}
                disabled={loading}
              >
                ← Edit Registration Details
              </button>

              <button
                type="button"
                style={{ background: "none", border: 0, color: resendTimer > 0 ? "var(--rg-muted)" : "var(--rg-accent)", cursor: resendTimer > 0 ? "default" : "pointer", fontWeight: 700, font: "inherit" }}
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || loading}
              >
                {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : "Resend OTP Code"}
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
          {/* 2-Step Navigation Tabs Header */}
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
              onClick={() => {
                if (validateStep1()) {
                  setActiveStep(2);
                }
              }}
            >
              <div className="rg-step-tab-indicator">
                {isStep2Done ? (
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
                  onClick={handleNextStep}
                >
                  <span>Next: Security (2/2)</span>
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
                  onClick={handlePrevStep}
                  disabled={loading}
                >
                  {ADMIN_ICONS.arrowLeft}
                  <span>Previous: Personal Details</span>
                </button>

                <button type="submit" className="rg-btn-submit" disabled={loading}>
                  {loading ? (
                    <><span className="rg-spinner" /> Validating details…</>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
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
