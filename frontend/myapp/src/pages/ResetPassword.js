// ============================================================
//  ResetPassword.js — Advocate Hub Set New Password Page
//  Route: /reset-password?token=SECURE_TOKEN
//  Validates token, enforces strong password rules, updates password.
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { getTheme, toggleTheme as toggleGlobalTheme } from "../data/themeStore";
import { verifyResetToken, advocateResetPassword } from "../data/api";
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

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [theme, setTheme] = useState(getTheme);
  const [checking, setChecking] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [invalidMsg, setInvalidMsg] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleTheme = (e) => setTheme(e?.detail || getTheme());
    window.addEventListener("law4u_theme_change", handleTheme);
    return () => window.removeEventListener("law4u_theme_change", handleTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = toggleGlobalTheme();
    setTheme(next);
  }, []);

  const showToast = (msg, type = "info") => setToast({ msg, type });

  // ── Verify Reset Token on Mount ─────────────────────────────
  useEffect(() => {
    if (!token) {
      setChecking(false);
      setTokenValid(false);
      setInvalidMsg("No password reset token was provided in the link.");
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        const res = await verifyResetToken(token);
        if (!isMounted) return;

        if (res.valid) {
          setTokenValid(true);
          setTokenInfo(res);
        } else {
          setTokenValid(false);
          setInvalidMsg(res.message || "This password reset link is invalid or has expired.");
        }
      } catch (e) {
        if (!isMounted) return;
        setTokenValid(false);
        setInvalidMsg("Could not verify reset token. Please check your link or request a new one.");
      } finally {
        if (isMounted) setChecking(false);
      }
    })();

    return () => { isMounted = false; };
  }, [token]);

  // ── Submit New Password ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password.length < 8) {
      setErr("Password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setErr("Password must contain at least one uppercase letter (A-Z).");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setErr("Password must contain at least one lowercase letter (a-z).");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setErr("Password must contain at least one number (0-9).");
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
      setErr("Password must contain at least one special character (!@#$%^&* etc.).");
      return;
    }
    if (password !== confirmPassword) {
      setErr("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      const res = await advocateResetPassword({
        token,
        password,
      });

      if (res.ok) {
        setSuccess(true);
        showToast("Password updated successfully!", "success");
        setTimeout(() => navigate("/login"), 2500);
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
            background: toast.type === "success" ? "#0f766e" : "#b91c1c",
            color: "#ffffff",
          }}
        >
          {toast.msg}
        </div>
      )}

      <div className="am-login-card fp-card">
        <BrandLogo size={52} wordmark={false} style={{ margin: "0 auto" }} />

        {/* ── 1. LOADING TOKEN VERIFICATION ── */}
        {checking && (
          <div style={{ padding: "30px 0", color: "var(--adm-text-muted)" }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔄</div>
            <div style={{ fontWeight: 600 }}>Verifying password reset link...</div>
          </div>
        )}

        {/* ── 2. INVALID / EXPIRED TOKEN ── */}
        {!checking && !tokenValid && !success && (
          <div className="fp-pending-view">
            <div className="fp-status-icon-wrap" style={{ background: "rgba(239, 68, 68, 0.15)", border: "2px solid rgba(239, 68, 68, 0.35)" }}>
              ❌
            </div>
            <h2 className="am-login-title" style={{ fontSize: "1.35rem", color: "#b91c1c" }}>
              Invalid or Expired Link
            </h2>
            <p className="fp-subtitle" style={{ marginTop: 8 }}>
              {invalidMsg || "This password reset link is invalid, expired, or has already been used."}
            </p>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/forgot-password" className="am-btn-primary" style={{ textDecoration: "none" }}>
                Request New Password Reset →
              </Link>
              <Link to="/login" className="am-back-link">
                ← Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* ── 3. VALID TOKEN -> ENTER NEW PASSWORD ── */}
        {!checking && tokenValid && !success && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="am-role-badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#059669" }}>
              ⚖️ Approved Advocate Reset
            </div>
            <h1 className="am-login-title" style={{ fontSize: "1.45rem", marginTop: 4 }}>
              Set New Password
            </h1>
            {tokenInfo && (
              <p className="fp-subtitle">
                Resetting password for <strong>{tokenInfo.name}</strong> ({tokenInfo.email})
              </p>
            )}

            <div className="am-field" style={{ textAlign: "left", marginTop: 14 }}>
              <label>New Password</label>
              <div className="am-pw-wrap">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
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
              <div className={password.length >= 8 ? "fp-rule-ok" : "fp-rule-item"}>
                {password.length >= 8 ? "✓" : "○"} Minimum 8 characters
              </div>
              <div className={/[A-Z]/.test(password) ? "fp-rule-ok" : "fp-rule-item"}>
                {/[A-Z]/.test(password) ? "✓" : "○"} At least one uppercase letter (A-Z)
              </div>
              <div className={/[a-z]/.test(password) ? "fp-rule-ok" : "fp-rule-item"}>
                {/[a-z]/.test(password) ? "✓" : "○"} At least one lowercase letter (a-z)
              </div>
              <div className={/[0-9]/.test(password) ? "fp-rule-ok" : "fp-rule-item"}>
                {/[0-9]/.test(password) ? "✓" : "○"} At least one number (0-9)
              </div>
              <div className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password) ? "fp-rule-ok" : "fp-rule-item"}>
                {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password) ? "✓" : "○"} At least one special character (!@#$)
              </div>
            </div>

            {err && <p className="am-err" style={{ marginTop: 10 }}>⚠ {err}</p>}

            <button
              type="submit"
              className="am-btn-primary"
              disabled={loading}
              style={{ marginTop: 14 }}
            >
              {loading ? "Updating Password..." : "Update Password →"}
            </button>

            <p className="am-alt-link" style={{ marginTop: 14 }}>
              <Link to="/login">← Back to Login</Link>
            </p>
          </form>
        )}

        {/* ── 4. SUCCESS SCREEN ── */}
        {success && (
          <div className="fp-pending-view">
            <div className="fp-status-icon-wrap fp-icon-success">✅</div>
            <h2 className="am-login-title" style={{ fontSize: "1.35rem", color: "#059669" }}>
              Password Reset Complete!
            </h2>
            <p className="fp-subtitle" style={{ margin: "10px 0" }}>
              Your Advocate password has been updated. You will be redirected to the login page automatically.
            </p>
            <Link to="/login" className="am-btn-primary" style={{ marginTop: 14, textDecoration: "none" }}>
              Login with New Password Now →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

