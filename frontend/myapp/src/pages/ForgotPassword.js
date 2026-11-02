// ============================================================
//  ForgotPassword.js — Advocate Hub Forgot Password Page
//  Advocate: Requires Admin Approval before reset link is sent.
//  Client: Direct Email Verification OTP -> Password Reset.
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { getTheme, toggleTheme as toggleGlobalTheme } from "../data/themeStore";
import {
  requestForgotPassword,
  verifyResetEmail,
  clientResetPassword,
} from "../data/api";
import "./Login.css";
import "./ForgotPassword.css";

function ThemeToggle({ theme, onToggle }) {
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className="am-theme-btn"
      onClick={onToggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(getTheme);

  // States: "initial" | "advocate_pending" | "client_otp" | "client_password" | "client_success"
  const [step, setStep] = useState("initial");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [advocateReqData, setAdvocateReqData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [toast, setToast] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const handleTheme = (e) => setTheme(e?.detail || getTheme());
    window.addEventListener("law4u_theme_change", handleTheme);
    return () => window.removeEventListener("law4u_theme_change", handleTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = toggleGlobalTheme();
    setTheme(next);
  }, []);

  // Cooldown timer for resending OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const showToast = (msg, type = "info") => setToast({ msg, type });

  // ── Step 1: Submit Email Address ───────────────────────────
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErr("Please enter your registered email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErr("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      const res = await requestForgotPassword(cleanEmail);

      if (!res.ok) {
        setLoading(false);
        setErr(res.message || "No account found with this email address.");
        return;
      }

      // ── ADVOCATE: Admin Approval Required ──────────────────
      if (res.role === "advocate") {
        setAdvocateReqData(res);
        setStep("advocate_pending");
        showToast("Password reset request submitted for admin approval.", "success");
      }
      // ── CLIENT: Direct OTP Verification ───────────────────
      else if (res.role === "client") {
        setStep("client_otp");
        setResendCooldown(45);
        showToast(res.message || "Verification code sent to your email.", "info");
      } else {
        setErr(res.message || "Request processed.");
      }
    } catch (error) {
      setErr(error.message || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Client Step 2: Verify OTP ──────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      setErr("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      const res = await verifyResetEmail(email.trim().toLowerCase(), cleanOtp);
      if (res.ok && res.resetToken) {
        setResetToken(res.resetToken);
        setStep("client_password");
        showToast("Email verified. Please enter your new password.", "success");
      } else {
        setErr(res.message || "Invalid verification code.");
      }
    } catch (error) {
      setErr(error.message || "Failed to verify code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend Client OTP ──────────────────────────────────────
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setErr("");
    try {
      const res = await requestForgotPassword(email.trim().toLowerCase());
      setResendCooldown(45);
      showToast(res.message || "New verification code sent.", "info");
    } catch (error) {
      setErr(error.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  // ── Client Step 3: Set New Password ────────────────────────
  const handleClientPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 8) {
      setErr("Password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setErr("Password must contain at least one uppercase letter (A-Z).");
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setErr("Password must contain at least one lowercase letter (a-z).");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setErr("Password must contain at least one number (0-9).");
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(newPassword)) {
      setErr("Password must contain at least one special character (!@#$%^&* etc.).");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      const res = await clientResetPassword({
        email: email.trim().toLowerCase(),
        resetToken,
        otp: otp.trim(),
        password: newPassword,
      });

      if (res.ok) {
        setStep("client_success");
        showToast("Password updated successfully!", "success");
        setTimeout(() => navigate("/client-login"), 2500);
      } else {
        setErr(res.message || "Failed to update password.");
      }
    } catch (error) {
      setErr(error.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`am-login-page ${theme === "dark" ? "am-dark" : ""}`}>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      {toast && (
        <div
          className="am-toast"
          style={{
            background: toast.type === "success" ? "#0f766e" : (toast.type === "info" ? "#2563eb" : "#b91c1c"),
            color: "#ffffff",
          }}
        >
          {toast.msg}
        </div>
      )}

      <div className="am-login-card fp-card">
        <BrandLogo size={52} wordmark={false} style={{ margin: "0 auto" }} />

        {/* ── STEP 1: INITIAL EMAIL ENTRY ── */}
        {step === "initial" && (
          <form onSubmit={handleEmailSubmit} noValidate>
            <div className="am-role-badge">🔒 Password Recovery</div>
            <h1 className="am-login-title" style={{ fontSize: "1.5rem" }}>
              Forgot Your Password?
            </h1>
            <p className="fp-subtitle">
              Enter your registered email address to reset your password.
            </p>

            <div className="am-field" style={{ textAlign: "left", marginTop: 12 }}>
              <label>Registered Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErr("");
                }}
                disabled={loading}
                autoFocus
              />
            </div>

            {err && <p className="am-err" style={{ marginTop: 8 }}>⚠ {err}</p>}

            <button
              type="submit"
              className="am-btn-primary"
              disabled={loading}
              style={{ marginTop: 16 }}
            >
              {loading ? "Verifying Account..." : "Continue →"}
            </button>

            <div className="fp-notice-box">
              <span className="fp-notice-icon">ℹ️</span>
              <div className="fp-notice-text">
                <strong>Advocates:</strong> Reset requests require administrator verification before activation.<br />
                <strong>Clients:</strong> You can reset immediately via email verification code.
              </div>
            </div>

            <p className="am-alt-link" style={{ marginTop: 16 }}>
              Remembered your password? <Link to="/login">Back to Login</Link>
            </p>
          </form>
        )}

        {/* ── STEP 2 (ADVOCATE): PENDING ADMIN APPROVAL ── */}
        {step === "advocate_pending" && (
          <div className="fp-pending-view">
            <div className="fp-status-icon-wrap fp-icon-warn">⏳</div>
            <div className="am-role-badge" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#d97706" }}>
              ⚖️ Advocate Account
            </div>
            <h2 className="am-login-title" style={{ fontSize: "1.35rem", marginTop: 8 }}>
              Request Submitted for Admin Approval
            </h2>

            <div className="fp-success-message">
              "Your password reset request has been submitted successfully. Your request is waiting for administrator approval. You will receive an email notification once it is approved."
            </div>

            <div className="fp-details-card">
              <div className="fp-detail-row">
                <span className="fp-detail-label">Advocate Email:</span>
                <span className="fp-detail-val">{email}</span>
              </div>
              <div className="fp-detail-row">
                <span className="fp-detail-label">Status:</span>
                <span className="fp-badge-pending">Pending Admin Approval</span>
              </div>
              <div className="fp-detail-row">
                <span className="fp-detail-label">Submission:</span>
                <span className="fp-detail-val">Just now</span>
              </div>
            </div>

            <p className="fp-help-text">
              For security compliance and Bar Council record safety, all advocate password changes undergo administrator review. Once approved, you will receive an email with a secure link to create your new password.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
              <Link to="/login" className="am-btn-primary" style={{ textDecoration: "none" }}>
                Return to Login
              </Link>
              <Link
                to={`/registration-status?email=${encodeURIComponent(email)}`}
                className="am-back-link"
              >
                🔍 Check Status Here
              </Link>
            </div>
          </div>
        )}

        {/* ── STEP 2 (CLIENT): ENTER EMAIL OTP ── */}
        {step === "client_otp" && (
          <form onSubmit={handleVerifyOtp} noValidate>
            <div className="am-role-badge" style={{ background: "rgba(37, 99, 235, 0.15)", color: "#2563eb" }}>
              👤 Client Account
            </div>
            <h2 className="am-login-title" style={{ fontSize: "1.35rem" }}>
              Enter Verification Code
            </h2>
            <p className="fp-subtitle">
              We sent a 6-digit code to <strong>{email}</strong>. Enter it below to proceed.
            </p>

            <div className="am-field" style={{ textAlign: "center", marginTop: 14 }}>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                className="fp-otp-input"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  setErr("");
                }}
                disabled={loading}
                autoFocus
              />
            </div>

            {err && <p className="am-err">⚠ {err}</p>}

            <button
              type="submit"
              className="am-btn-primary"
              disabled={loading || otp.length !== 6}
              style={{ marginTop: 12 }}
            >
              {loading ? "Verifying..." : "Verify Code →"}
            </button>

            <div style={{ marginTop: 14, fontSize: "0.85rem", color: "var(--adm-text-muted)" }}>
              {resendCooldown > 0 ? (
                <span>Resend code in {resendCooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="fp-link-btn"
                  disabled={loading}
                >
                  Didn't receive code? Resend Email
                </button>
              )}
            </div>

            <button
              type="button"
              className="am-back-link"
              onClick={() => {
                setStep("initial");
                setErr("");
              }}
              style={{ background: "none", border: "none", cursor: "pointer", marginTop: 10 }}
            >
              ← Use a different email
            </button>
          </form>
        )}

        {/* ── STEP 3 (CLIENT): ENTER NEW PASSWORD ── */}
        {step === "client_password" && (
          <form onSubmit={handleClientPasswordSubmit} noValidate>
            <div className="am-role-badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#059669" }}>
              ✅ Email Verified
            </div>
            <h2 className="am-login-title" style={{ fontSize: "1.35rem" }}>
              Create New Password
            </h2>
            <p className="fp-subtitle">
              Set a strong, secure password for your Client account.
            </p>

            <div className="am-field" style={{ textAlign: "left", marginTop: 10 }}>
              <label>New Password</label>
              <div className="am-pw-wrap">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setErr("");
                  }}
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  className="am-eye"
                  onClick={() => setShowPw((p) => !p)}
                  aria-label="Toggle password view"
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="am-field" style={{ textAlign: "left", marginTop: 8 }}>
              <label>Confirm New Password</label>
              <input
                type={showPw ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErr("");
                }}
                disabled={loading}
              />
            </div>

            {/* Password strength checklist */}
            <div className="fp-rules-card">
              <div className={newPassword.length >= 8 ? "fp-rule-ok" : "fp-rule-item"}>
                {newPassword.length >= 8 ? "✓" : "○"} At least 8 characters
              </div>
              <div className={/[A-Z]/.test(newPassword) ? "fp-rule-ok" : "fp-rule-item"}>
                {/[A-Z]/.test(newPassword) ? "✓" : "○"} One uppercase letter (A-Z)
              </div>
              <div className={/[a-z]/.test(newPassword) ? "fp-rule-ok" : "fp-rule-item"}>
                {/[a-z]/.test(newPassword) ? "✓" : "○"} One lowercase letter (a-z)
              </div>
              <div className={/[0-9]/.test(newPassword) ? "fp-rule-ok" : "fp-rule-item"}>
                {/[0-9]/.test(newPassword) ? "✓" : "○"} One number (0-9)
              </div>
              <div className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(newPassword) ? "fp-rule-ok" : "fp-rule-item"}>
                {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(newPassword) ? "✓" : "○"} One special character (!@#$)
              </div>
            </div>

            {err && <p className="am-err" style={{ marginTop: 8 }}>⚠ {err}</p>}

            <button
              type="submit"
              className="am-btn-primary"
              disabled={loading}
              style={{ marginTop: 12 }}
            >
              {loading ? "Updating Password..." : "Update Password →"}
            </button>
          </form>
        )}

        {/* ── STEP 4 (CLIENT): SUCCESS ── */}
        {step === "client_success" && (
          <div className="fp-pending-view">
            <div className="fp-status-icon-wrap fp-icon-success">🎉</div>
            <h2 className="am-login-title" style={{ fontSize: "1.35rem" }}>
              Password Reset Successful!
            </h2>
            <p className="fp-subtitle" style={{ color: "#059669", fontWeight: 600 }}>
              Your password has been changed. You will be redirected to the login page automatically.
            </p>
            <Link to="/client-login" className="am-btn-primary" style={{ marginTop: 16, textDecoration: "none" }}>
              Go to Client Login Now →
            </Link>
          </div>
        )}

        <Link to="/" className="am-back-link" style={{ marginTop: 8 }}>
          ← Back to Advocate Hub
        </Link>
      </div>
    </div>
  );
}

