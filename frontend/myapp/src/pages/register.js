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
const CLIENT_SESSION_KEY = "law4u_client_id";
const CLIENT_OBJECT_KEY = "law4u_client";
const CLIENT_TOKEN_KEY = "law4u_client_token";

// ── Data ─────────────────────────────────────────────────────
// ── Helpers ───────────────────────────────────────────────────
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isValidPhone(p) { return /^\d{10}$/.test(p.replace(/\s|-/g, "")); }
function formatOtpChannels(channels) {
  const labels = { email: "Email", sms: "SMS", phone: "SMS", whatsapp: "WhatsApp" };
  const expanded = channels.flatMap((channel) => channel === "all" ? ["email", "sms", "whatsapp"] : [channel]);
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

function Select({ icon, error, children, ...props }) {
  return (
    <div className={`rg-input-wrap ${error ? "error" : ""}`}>
      {icon && <span className="rg-input-icon">{icon}</span>}
      <select className="rg-input rg-select" {...props}>{children}</select>
    </div>
  );
}

// ── Success Screen ────────────────────────────────────────────
function SuccessScreen({ name, onLogin }) {
  return (
    <div className="rg-success">
      <div className="rg-success-icon">✅</div>
      <h2 className="rg-success-title">Registration Successful</h2>
      <p className="rg-success-msg">
        Welcome to Advocate Hub, <strong>{name}</strong>!<br />
        Your client account is active and you are signed in automatically.
      </p>
      <div className="rg-success-steps">
        <div className="rg-ss done">✅ Account created</div>
        <div className="rg-ss done">✅ Logged in automatically</div>
      </div>
      <button className="rg-btn-primary rg-btn-lg" onClick={onLogin}>
        Continue to Client Portal →
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
  const [toast, setToast]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [successName, setSuccessName] = useState("");

  const [client, setClient] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPw: "",
    city: "", legalIssue: "", agreeTerms: false,
  });
  const [err, setErr] = useState({});

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

  useEffect(() => {
    if (!otpStep || resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpStep, resendTimer]);

  const [otpChannel, setOtpChannel] = useState("all"); // "all" | "email" | "phone" | "whatsapp"

  // ── Validate ──────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!client.fullName.trim())          e.fullName  = "Full name is required";
    if (!client.email.trim())              e.email     = "Email is required";
    else if (!isValidEmail(client.email))  e.email     = "Invalid email format";
    if (!client.phone.trim())              e.phone     = "Phone is required";
    else if (!isValidPhone(client.phone))  e.phone     = "Enter valid 10-digit phone";
    if (!client.password)                  e.password  = "Password is required";
    else if (client.password.length < 6)   e.password  = "Min 6 characters";
    if (client.password !== client.confirmPw) e.confirmPw = "Passwords do not match";
    if (!client.agreeTerms)                e.agreeTerms = "Please accept terms";
    setErr(e);
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
    setShowChannelModal(false);
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
          showToast(errorMessage, "error");
          setLoading(false);
          return;
        }

        const sentChannels = Array.isArray(data.sentChannels)
          ? data.sentChannels
          : [channelToUse === "phone" ? "sms" : channelToUse];
        setOtpSentChannels(sentChannels);
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
        showToast(
          data.message || `A new verification code was sent via ${formatOtpChannels(sentChannels)}.`,
          data.failedChannels?.length ? "info" : "success"
        );
        setResendTimer(60);
      } else {
        showToast(data.message || data.error || "Failed to resend code.", "error");
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

      // Auto-authenticate / login client immediately
      const clientObj = data.client || data;
      const token = data.token || "client-session-token";
      const clientId = clientObj.id || Date.now();

      localStorage.setItem(CLIENT_SESSION_KEY, String(clientId));
      localStorage.setItem(CLIENT_OBJECT_KEY, JSON.stringify(clientObj));
      localStorage.setItem(CLIENT_TOKEN_KEY, token);
      sessionStorage.setItem(CLIENT_SESSION_KEY, String(clientId));
      sessionStorage.setItem(CLIENT_OBJECT_KEY, JSON.stringify(clientObj));
      sessionStorage.setItem(CLIENT_TOKEN_KEY, token);

      showToast("Email verified & Client Account Approved! 🎉", "success");

      const requestedRedirect = new URLSearchParams(window.location.search).get("redirect");
      const redirectPath = requestedRedirect && requestedRedirect.startsWith("/") && !requestedRedirect.startsWith("//")
        ? requestedRedirect
        : "/client-main";

      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 600);
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
          <SuccessScreen name={successName} onLogin={goToLogin} />
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
            <div className="rg-otp-badge">📲</div>
            <h2 className="rg-title" style={{ fontSize: "1.55rem" }}>Select OTP Delivery Channel</h2>
            <p className="rg-subtitle" style={{ fontSize: "0.92rem", margin: "6px 0 20px" }}>
              How would you like to receive your 6-digit verification code?
            </p>

            <div className="rg-channel-card-list">
              <button
                type="button"
                className="rg-channel-option-card chan-email"
                onClick={() => handleConfirmChannelAndSend("email")}
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
                className="rg-channel-option-card chan-all"
                onClick={() => handleConfirmChannelAndSend("all")}
              >
                <div className="rg-channel-icon-avatar">✨</div>
                <div className="rg-channel-body">
                  <div className="rg-channel-title">
                    All Channels <span className="rg-channel-badge">Recommended</span>
                  </div>
                  <div className="rg-channel-desc">Receive code via Email, SMS & WhatsApp simultaneously</div>
                </div>
                <div className="rg-channel-arrow">→</div>
              </button>
            </div>

            <button
              type="button"
              style={{ background: "none", border: 0, color: "var(--rg-muted)", cursor: "pointer", textDecoration: "underline", font: "inherit", fontSize: "0.88rem" }}
              onClick={() => setShowChannelModal(false)}
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

          <div className="rg-form-section-title">Personal Information</div>

          <div className="rg-grid-2">
            <Field label="Full Name" required error={err.fullName}>
              <Input icon="👤" placeholder="Your full name"
                value={client.fullName} onChange={(e) => setC("fullName", e.target.value)}
                error={err.fullName} disabled={loading} />
            </Field>

            <Field label="Phone Number" required error={err.phone}>
              <Input icon="📱" placeholder="10-digit mobile number" type="tel"
                value={client.phone} onChange={(e) => setC("phone", e.target.value)}
                error={err.phone} disabled={loading} maxLength={10} />
            </Field>
          </div>

          <Field label="Email Address" required error={err.email}>
            <Input icon="✉️" type="email" placeholder="your@email.com"
              value={client.email} onChange={(e) => setC("email", e.target.value)}
              error={err.email} disabled={loading}
              rightEl={client.email && isValidEmail(client.email) && <span className="rg-valid">✓</span>} />
          </Field>

          <div className="rg-grid-2">
            <Field label="City" error={err.city}>
              <ScrollSelect
                icon="📍"
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
                icon="⚖️"
                placeholder="Select legal issue"
                value={client.legalIssue}
                onChange={(val) => setC("legalIssue", val)}
                options={PRACTICE_AREAS}
                disabled={loading}
                error={err.legalIssue}
              />
            </Field>
          </div>

          <div className="rg-form-section-title" style={{ marginTop: 8 }}>Security</div>

          <div className="rg-grid-2">
            <Field label="Password" required error={err.password}>
              <Input icon="🔒" type={showPw ? "text" : "password"} placeholder="Min 6 characters"
                value={client.password} onChange={(e) => setC("password", e.target.value)}
                error={err.password} disabled={loading}
                rightEl={<button type="button" className="rg-eye" onClick={() => setShowPw((p) => !p)}>{showPw ? "🙈" : "👁️"}</button>} />
              <PwStrength pw={client.password} />
            </Field>

            <Field label="Confirm Password" required error={err.confirmPw}>
              <Input icon="🔑" type={showCPw ? "text" : "password"} placeholder="Re-enter password"
                value={client.confirmPw} onChange={(e) => setC("confirmPw", e.target.value)}
                error={err.confirmPw} disabled={loading}
                rightEl={
                  client.confirmPw && client.password === client.confirmPw
                    ? <span className="rg-valid">✓</span>
                    : <button type="button" className="rg-eye" onClick={() => setShowCPw((p) => !p)}>{showCPw ? "🙈" : "👁️"}</button>
                } />
            </Field>
          </div>

          <label className="rg-agree">
            <input type="checkbox" checked={client.agreeTerms} onChange={(e) => setC("agreeTerms", e.target.checked)} />
            <span>I agree to the <a href="/terms" target="_blank" rel="noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a></span>
          </label>
          {err.agreeTerms && <p className="rg-field-err">⚠ {err.agreeTerms}</p>}

          <button type="submit" className="rg-btn-primary rg-btn-lg" disabled={loading}>
            {loading ? <><span className="rg-spinner" /> Validating details…</> : "Send Verification Code →"}
          </button>

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
