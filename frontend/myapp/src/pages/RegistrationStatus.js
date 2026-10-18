import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { getTheme, toggleTheme } from "../data/themeStore";
import { getRegistrationStatus } from "../data/api";
import "./RegistrationStatus.css";

export default function RegistrationStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialEmail = searchParams.get("email") || searchParams.get("identifier") || "";

  const [identifier, setIdentifier] = useState(initialEmail);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [theme, setLocalTheme] = useState(getTheme);

  useEffect(() => {
    const handleThemeChange = (e) => setLocalTheme(e?.detail || getTheme());
    window.addEventListener("law4u_theme_change", handleThemeChange);
    return () => window.removeEventListener("law4u_theme_change", handleThemeChange);
  }, []);

  const handleFetchStatus = async (queryVal) => {
    const query = String(queryVal || identifier).trim();
    if (!query) {
      setError("Please enter your registered email address or mobile number");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(true);

    try {
      const res = await getRegistrationStatus(query);
      if (res && res.found) {
        setStatusData(res);
      } else {
        setStatusData(null);
        setError(res?.message || "No registration request found for this email address. Please verify your details.");
      }
    } catch (err) {
      setStatusData(null);
      setError(err?.message || "Could not retrieve status. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialEmail) {
      handleFetchStatus(initialEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEmail]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFetchStatus(identifier);
  };

  const isApproved = statusData?.status === "approved" || statusData?.approvalStatus === "approved";
  const isRejected = statusData?.status === "rejected" || statusData?.approvalStatus === "rejected";
  const isPending = statusData?.found && !isApproved && !isRejected;

  const getMethodBadge = (method) => {
    const m = String(method || "").toLowerCase();
    if (m === "admin_approval" || m === "admin") {
      return { label: "Admin Approval", icon: "🛡️", desc: "Submitted directly for manual administrative verification" };
    }
    if (m === "sms" || m === "sms_otp") {
      return { label: "SMS OTP Verification", icon: "💬", desc: "Phone verified via real SMS OTP" };
    }
    if (m === "whatsapp" || m === "whatsapp_otp") {
      return { label: "WhatsApp OTP Verification", icon: "🟢", desc: "Mobile verified via real WhatsApp OTP" };
    }
    return { label: "Email OTP Verification", icon: "✉️", desc: "Email verified via real 6-digit OTP (Resend)" };
  };

  const methodInfo = getMethodBadge(statusData?.verificationMethod);

  return (
    <div className={`rs-page ${theme === "dark" ? "rs-dark" : "rs-light"}`}>
      <header className="rs-header">
        <div className="rs-header-content">
          <Link to="/" className="rs-logo-link">
            <BrandLogo size={32} />
            <span className="rs-logo-text">Advocate<b>Hub</b></span>
          </Link>
          <div className="rs-header-right">
            <button
              type="button"
              className="rs-theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <Link to="/login" className="rs-btn-login-nav">
              Sign In →
            </Link>
          </div>
        </div>
      </header>

      <main className="rs-main-container">
        <div className="rs-hero">
          <div className="rs-hero-pill">
            <span>🛡️ Official Registration Verification Portal</span>
          </div>
          <h1 className="rs-title">Check Registration &amp; Approval Status</h1>
          <p className="rs-subtitle">
            Enter your registered email address or mobile number to track your application review, verification channel, and administrator approval.
          </p>

          <form className="rs-search-card" onSubmit={handleSearchSubmit}>
            <div className="rs-input-wrap">
              <span className="rs-search-icon">🔍</span>
              <input
                type="text"
                className="rs-input"
                placeholder="Enter registered email (e.g., advocate@example.com) or phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="rs-btn-search"
              disabled={loading || !identifier.trim()}
            >
              {loading ? (
                <>
                  <span className="rs-spinner" /> Checking…
                </>
              ) : (
                "Check Status →"
              )}
            </button>
          </form>

          {error && (
            <div className="rs-alert-err">
              <span className="rs-alert-icon">⚠️</span>
              <div className="rs-alert-body">
                <strong>Status Check Notice</strong>
                <p>{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Result Card */}
        {statusData && (
          <section className="rs-result-section">
            <div className={`rs-card ${isApproved ? "rs-card-approved" : isRejected ? "rs-card-rejected" : "rs-card-pending"}`}>
              {/* Card Header */}
              <div className="rs-card-top">
                <div className="rs-user-block">
                  <div className="rs-avatar-badge">
                    {statusData.role === "advocate" ? "⚖️" : "👤"}
                  </div>
                  <div>
                    <h2 className="rs-user-name">
                      {statusData.role === "advocate" && !statusData.name.startsWith("Adv.") ? "Adv. " : ""}
                      {statusData.name}
                    </h2>
                    <div className="rs-user-sub">
                      <span className="rs-role-tag">
                        {statusData.role === "advocate" ? "Advocate Applicant" : "Client Account"}
                      </span>
                      {statusData.city && <span className="rs-city-tag">📍 {statusData.city}</span>}
                      {statusData.barId && <span className="rs-bar-tag">📜 Bar ID: {statusData.barId}</span>}
                    </div>
                  </div>
                </div>

                <div className="rs-status-pill-wrap">
                  {isApproved && (
                    <span className="rs-status-badge rs-badge-approved">
                      <span className="rs-pulse-dot rs-dot-green" /> Approved &amp; Active
                    </span>
                  )}
                  {isPending && (
                    <span className="rs-status-badge rs-badge-pending">
                      <span className="rs-pulse-dot rs-dot-amber" /> Pending Administrator Review
                    </span>
                  )}
                  {isRejected && (
                    <span className="rs-status-badge rs-badge-rejected">
                      <span className="rs-pulse-dot rs-dot-red" /> Application Rejected
                    </span>
                  )}
                </div>
              </div>

              {/* Status Banner Message */}
              <div className="rs-status-banner">
                {isApproved && (
                  <div className="rs-banner-box rs-banner-approved">
                    <div className="rs-banner-title">🎉 Account Approved and Ready for Use</div>
                    <p className="rs-banner-desc">
                      Your registration has been approved. You can now log in to access your {statusData.role === "advocate" ? "Advocate Dashboard, case management, and client consultations" : "Client Portal and book consultations with verified advocates"}.
                    </p>
                    <div className="rs-banner-action">
                      <button
                        type="button"
                        className="rs-btn-login"
                        onClick={() => navigate(statusData.role === "advocate" ? "/login" : "/client-login")}
                      >
                        Proceed to {statusData.role === "advocate" ? "Advocate" : "Client"} Login →
                      </button>
                    </div>
                  </div>
                )}

                {isPending && (
                  <div className="rs-banner-box rs-banner-pending">
                    <div className="rs-banner-title">⏳ Awaiting Administrator Review</div>
                    <p className="rs-banner-desc">
                      Your registration request has been submitted successfully. Your account will be activated after administrator approval.
                    </p>
                    <div className="rs-pending-note">
                      🛡️ Our administrative compliance team manually reviews registrations to uphold trust and safety. Once approved, you can log in immediately.
                    </div>
                  </div>
                )}

                {isRejected && (
                  <div className="rs-banner-box rs-banner-rejected">
                    <div className="rs-banner-title">❌ Application Not Approved</div>
                    <p className="rs-banner-desc">
                      {statusData.rejectionReason
                        ? `Reason for rejection: ${statusData.rejectionReason}`
                        : "Your registration request was not approved by the administrator."}
                    </p>
                    <div className="rs-reject-help">
                      For clarification, resubmission, or support, please contact our administrative team at{" "}
                      <a href="mailto:advocatehub.in@gmail.com" className="rs-support-link">
                        advocatehub.in@gmail.com
                      </a>.
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Stepper */}
              <div className="rs-stepper">
                <div className="rs-step rs-step-done">
                  <div className="rs-step-circle">1</div>
                  <div className="rs-step-info">
                    <div className="rs-step-title">Details Submitted</div>
                    <div className="rs-step-sub">Registration profile recorded</div>
                  </div>
                </div>

                <div className="rs-step-line rs-line-done" />

                <div className="rs-step rs-step-done">
                  <div className="rs-step-circle">{methodInfo.icon}</div>
                  <div className="rs-step-info">
                    <div className="rs-step-title">{methodInfo.label}</div>
                    <div className="rs-step-sub">{methodInfo.desc}</div>
                  </div>
                </div>

                <div className={`rs-step-line ${isApproved || isRejected ? "rs-line-done" : "rs-line-pending"}`} />

                <div className={`rs-step ${isApproved ? "rs-step-done" : isRejected ? "rs-step-rejected" : "rs-step-current"}`}>
                  <div className="rs-step-circle">
                    {isApproved ? "✓" : isRejected ? "✕" : "⏳"}
                  </div>
                  <div className="rs-step-info">
                    <div className="rs-step-title">Administrator Review</div>
                    <div className="rs-step-sub">
                      {isApproved ? "Approved & Verified" : isRejected ? "Review Completed (Rejected)" : "Under Review"}
                    </div>
                  </div>
                </div>

                <div className={`rs-step-line ${isApproved ? "rs-line-done" : ""}`} />

                <div className={`rs-step ${isApproved ? "rs-step-done" : ""}`}>
                  <div className="rs-step-circle">{isApproved ? "🔓" : "🔒"}</div>
                  <div className="rs-step-info">
                    <div className="rs-step-title">Platform Access</div>
                    <div className="rs-step-sub">
                      {isApproved ? "Unlocked" : "Locked until approval"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Meta Grid */}
              <div className="rs-meta-grid">
                <div className="rs-meta-item">
                  <span className="rs-meta-label">Email Address</span>
                  <span className="rs-meta-val">{statusData.email}</span>
                </div>
                <div className="rs-meta-item">
                  <span className="rs-meta-label">Phone</span>
                  <span className="rs-meta-val">{statusData.phone ? `+91 ${statusData.phone}` : "—"}</span>
                </div>
                <div className="rs-meta-item">
                  <span className="rs-meta-label">Verification Channel</span>
                  <span className="rs-meta-val">
                    {methodInfo.icon} {methodInfo.label}
                  </span>
                </div>
                <div className="rs-meta-item">
                  <span className="rs-meta-label">Registration Date</span>
                  <span className="rs-meta-val">
                    {statusData.createdAt
                      ? new Date(statusData.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recently"}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="rs-card-footer">
                <button
                  type="button"
                  className="rs-btn-refresh"
                  onClick={() => handleFetchStatus(statusData.email)}
                >
                  🔄 Refresh Status
                </button>
                <Link to="/signup" className="rs-btn-signup">
                  ← Back to Registration
                </Link>
                <Link to="/" className="rs-btn-home">
                  AdvocateHub Home
                </Link>
              </div>
            </div>
          </section>
        )}

        {searched && !loading && !statusData && !error && (
          <div className="rs-empty-box">
            <span className="rs-empty-icon">📭</span>
            <h3>No Application Found</h3>
            <p>We could not find an account associated with "{identifier}".</p>
            <div style={{ marginTop: 14 }}>
              <Link to="/signup" className="rs-btn-primary">
                Register a New Account →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
