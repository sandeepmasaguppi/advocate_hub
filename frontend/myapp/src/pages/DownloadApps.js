// ============================================================
//  DownloadApps.js  —  Advocate Hub Mobile App Downloads
//  Dual Scanner Page: Google Play Store (Android) & Apple App Store (iOS)
//  Route: /download
// ============================================================

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getTheme } from "../data/themeStore";
import "./DownloadApps.css";

// Default reference store links (Editable by developer / user upon deployment)
export const DEFAULT_APP_LINKS = {
  androidPlayStore: "https://play.google.com/store/apps/details?id=in.advocatehub.app",
  iosAppStore: "https://apps.apple.com/app/advocate-hub/id6470000000",
};

export default function DownloadApps() {
  const [theme, setTheme] = useState(() => getTheme() || "dark");
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("law4u_home_lang") || "en";
    } catch {
      return "en";
    }
  });

  // Store URLs with local override support for easy testing & production deployment
  const [playStoreUrl, setPlayStoreUrl] = useState(() => {
    return localStorage.getItem("law4u_playstore_url") || DEFAULT_APP_LINKS.androidPlayStore;
  });
  const [appStoreUrl, setAppStoreUrl] = useState(() => {
    return localStorage.getItem("law4u_appstore_url") || DEFAULT_APP_LINKS.iosAppStore;
  });

  const [copiedType, setCopiedType] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // Sync theme
  useEffect(() => {
    const handleTheme = (e) => setTheme(e.detail || getTheme());
    window.addEventListener("law4u_theme_change", handleTheme);
    return () => window.removeEventListener("law4u_theme_change", handleTheme);
  }, []);

  // Sync language
  useEffect(() => {
    const handleLang = (e) => {
      if (e?.detail) setLang(e.detail);
      else {
        try {
          setLang(localStorage.getItem("law4u_home_lang") || "en");
        } catch {}
      }
    };
    window.addEventListener("law4u_lang_change", handleLang);
    window.addEventListener("storage", handleLang);
    return () => {
      window.removeEventListener("law4u_lang_change", handleLang);
      window.removeEventListener("storage", handleLang);
    };
  }, []);

  const isKn = lang === "kn";

  const handleCopyLink = (text, type) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch (e) {
      console.warn("Clipboard copy failed:", e);
    }
  };

  const handleSaveCustomUrls = (androidLink, iosLink) => {
    setPlayStoreUrl(androidLink);
    setAppStoreUrl(iosLink);
    localStorage.setItem("law4u_playstore_url", androidLink);
    localStorage.setItem("law4u_appstore_url", iosLink);
  };

  const handleResetDefaults = () => {
    handleSaveCustomUrls(DEFAULT_APP_LINKS.androidPlayStore, DEFAULT_APP_LINKS.iosAppStore);
  };

  // Dynamic QR Code URLs via fast global QR server
  const androidQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=${encodeURIComponent(playStoreUrl)}`;
  const iosQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=${encodeURIComponent(appStoreUrl)}`;

  return (
    <div className={`dl-page ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <div className="dl-container">

        {/* ── Hero Header ────────────────────────────────────────────── */}
        <div className="dl-hero">
          <div className="dl-pill-badge">
            <span>📱</span>
            <span>{isKn ? "ಅಧಿಕೃತ ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳು" : "Official Mobile Applications"}</span>
          </div>

          <h1 className="dl-title">
            {isKn ? (
              <>
                <span className="dl-gradient-text">ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್</span> ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ
              </>
            ) : (
              <>
                Download <span className="dl-gradient-text">AdvocateHub</span> for Mobile
              </>
            )}
          </h1>

          <p className="dl-subtitle">
            {isKn
              ? "ನಿಮ್ಮ ಮೊಬೈಲ್ ಕ್ಯಾಮೆರಾದಿಂದ ಕೆಳಗಿನ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ, ಅಥವಾ ನೇರವಾಗಿ ಗೂಗಲ್ ಪ್ಲೇ ಸ್ಟೋರ್ ಮತ್ತು ಆಪಲ್ ಆಪ್ ಸ್ಟೋರ್‌ನಿಂದ ಉಚಿತವಾಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ."
              : "Scan the QR code below with your phone camera, or click the download buttons to install AdvocateHub directly on Android or iPhone."}
          </p>
        </div>

        {/* ── Dual Scanner Grid (Play Store & App Store) ───────────────── */}
        <div className="dl-grid">

          {/* ── CARD 1: Google Play Store (Android) ───────────────────── */}
          <div className="dl-card android">
            <div className="dl-card-glow" />

            <div className="dl-card-header">
              <div className="dl-platform-icon-wrap android">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0003 0-.5517.4482-1.0002.9993-1.0002.5517 0 .9998.4485.9998 1.0002 0 .5517-.4481 1.0003-.9998 1.0003m-11.046 0c-.5511 0-.9993-.4486-.9993-1.0003 0-.5517.4482-1.0002.9993-1.0002.5516 0 .9997.4485.9997 1.0002 0 .5517-.4481 1.0003-.9997 1.0003m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1523-.5676.416.416 0 00-.5676.1523l-2.0223 3.503C15.5902 8.4126 13.8533 8.0834 12 8.0834c-1.8533 0-3.5902.3292-5.1367.8665L4.841 5.4469a.416.416 0 00-.5676-.1523.416.416 0 00-.1523.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.74h24c-.3432-4.0811-2.6889-7.5533-6.1185-9.4186"/>
                </svg>
              </div>
              <h2 className="dl-card-title">Google Play Store</h2>
              <p className="dl-card-desc">
                {isKn ? "ಆಂಡ್ರಾಯ್ಡ್ ಫೋನ್ ಮತ್ತು ಟ್ಯಾಬ್ಲೆಟ್‌ಗಳಿಗಾಗಿ" : "For Android Phones & Tablets"}
              </p>
            </div>

            {/* QR Scanner Stage */}
            <div className="dl-qr-stage">
              <div className="dl-qr-frame">
                <div className="dl-corner-bracket dl-cb-tl" />
                <div className="dl-corner-bracket dl-cb-tr" />
                <div className="dl-corner-bracket dl-cb-bl" />
                <div className="dl-corner-bracket dl-cb-br" />
                <div className="dl-laser-line" />

                <img
                  src={androidQrUrl}
                  alt="Scan for Android App on Google Play"
                  className="dl-qr-img"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = document.getElementById("dl-qr-fallback-android");
                    if (fallback) fallback.style.display = "block";
                  }}
                />

                {/* Local SVG Fallback if network blocks qrserver */}
                <svg id="dl-qr-fallback-android" style={{ display: "none", width: 170, height: 170 }} viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="#ffffff" />
                  <rect x="10" y="10" width="26" height="26" fill="#059669" />
                  <rect x="14" y="14" width="18" height="18" fill="#fff" />
                  <rect x="18" y="18" width="10" height="10" fill="#059669" />
                  <rect x="64" y="10" width="26" height="26" fill="#059669" />
                  <rect x="68" y="14" width="18" height="18" fill="#fff" />
                  <rect x="72" y="18" width="10" height="10" fill="#059669" />
                  <rect x="10" y="64" width="26" height="26" fill="#059669" />
                  <rect x="14" y="68" width="18" height="18" fill="#fff" />
                  <rect x="18" y="72" width="10" height="10" fill="#059669" />
                  <rect x="44" y="20" width="8" height="8" fill="#059669" />
                  <rect x="44" y="44" width="16" height="16" fill="#10b981" />
                  <rect x="70" y="46" width="10" height="10" fill="#059669" />
                  <rect x="44" y="70" width="12" height="12" fill="#059669" />
                  <rect x="68" y="72" width="18" height="12" fill="#059669" />
                </svg>
              </div>
            </div>

            <div className="dl-qr-instruction">
              <span className="icon">📷</span>
              <span>{isKn ? "ಆಂಡ್ರಾಯ್ಡ್ ಕ್ಯಾಮೆರಾದಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ" : "Point Android Camera to Scan"}</span>
            </div>

            {/* Direct Google Play Button */}
            <a
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dl-store-btn"
              title="Open Google Play Store"
            >
              <span className="dl-store-btn-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186c-.37-.34-.61-.83-.61-1.396V3.21c0-.566.24-1.056.61-1.396z" fill="#00E676" />
                  <path d="M17.18 8.614l-3.387 3.386 3.387 3.386 3.82-2.183c1.09-.623 1.09-1.637 0-2.26L17.18 8.614z" fill="#FFD600" />
                  <path d="M13.793 12L3.609 1.814l10.184 6.8z" fill="#00B0FF" />
                  <path d="M13.793 12l-10.184 10.186 10.184-6.8z" fill="#FF3D00" />
                </svg>
              </span>
              <div className="dl-store-btn-text">
                <span className="sub">GET IT ON</span>
                <span className="main">Google Play</span>
              </div>
            </a>

            <div className="dl-meta-badge">
              Android 8.0+ · Official Release · Free
            </div>

            {/* Copy Link Option */}
            <div className="dl-copy-link-wrap">
              <button
                type="button"
                className="dl-copy-btn"
                onClick={() => handleCopyLink(playStoreUrl, "android")}
              >
                {copiedType === "android" ? "✅ Copied Play Store Link!" : "🔗 Copy Play Store Link"}
              </button>
            </div>
          </div>

          {/* ── CARD 2: Apple App Store (iPhone / iOS) ────────────────── */}
          <div className="dl-card ios">
            <div className="dl-card-glow" />

            <div className="dl-card-header">
              <div className="dl-platform-icon-wrap ios">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96.99-3.11-1 .04-2.18.66-2.87 1.47-.61.71-1.14 1.87-.99 2.98 1.11.09 2.22-.53 2.87-1.34z"/>
                </svg>
              </div>
              <h2 className="dl-card-title">Apple App Store</h2>
              <p className="dl-card-desc">
                {isKn ? "ಐಫೋನ್ ಮತ್ತು ಐಪ್ಯಾಡ್‌ಗಳಿಗಾಗಿ" : "For iPhone & iPad"}
              </p>
            </div>

            {/* QR Scanner Stage */}
            <div className="dl-qr-stage">
              <div className="dl-qr-frame">
                <div className="dl-corner-bracket dl-cb-tl" />
                <div className="dl-corner-bracket dl-cb-tr" />
                <div className="dl-corner-bracket dl-cb-bl" />
                <div className="dl-corner-bracket dl-cb-br" />
                <div className="dl-laser-line" />

                <img
                  src={iosQrUrl}
                  alt="Scan for iOS App on Apple App Store"
                  className="dl-qr-img"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = document.getElementById("dl-qr-fallback-ios");
                    if (fallback) fallback.style.display = "block";
                  }}
                />

                {/* Local SVG Fallback if network blocks qrserver */}
                <svg id="dl-qr-fallback-ios" style={{ display: "none", width: 170, height: 170 }} viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="#ffffff" />
                  <rect x="10" y="10" width="26" height="26" fill="#0f172a" />
                  <rect x="14" y="14" width="18" height="18" fill="#fff" />
                  <rect x="18" y="18" width="10" height="10" fill="#0f172a" />
                  <rect x="64" y="10" width="26" height="26" fill="#0f172a" />
                  <rect x="68" y="14" width="18" height="18" fill="#fff" />
                  <rect x="72" y="18" width="10" height="10" fill="#0f172a" />
                  <rect x="10" y="64" width="26" height="26" fill="#0f172a" />
                  <rect x="14" y="68" width="18" height="18" fill="#fff" />
                  <rect x="18" y="72" width="10" height="10" fill="#0f172a" />
                  <rect x="44" y="16" width="8" height="12" fill="#0f172a" />
                  <rect x="42" y="42" width="16" height="16" fill="#6366f1" />
                  <rect x="70" y="44" width="12" height="12" fill="#0f172a" />
                  <rect x="44" y="68" width="12" height="12" fill="#0f172a" />
                  <rect x="68" y="70" width="16" height="14" fill="#0f172a" />
                </svg>
              </div>
            </div>

            <div className="dl-qr-instruction">
              <span className="icon">📷</span>
              <span>{isKn ? "ಐಫೋನ್ ಕ್ಯಾಮೆರಾದಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ" : "Point iPhone Camera to Scan"}</span>
            </div>

            {/* Direct Apple App Store Button */}
            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dl-store-btn"
              title="Open Apple App Store"
            >
              <span className="dl-store-btn-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.13-1.96.99-3.11-1 .04-2.18.66-2.87 1.47-.61.71-1.14 1.87-.99 2.98 1.11.09 2.22-.53 2.87-1.34z"/>
                </svg>
              </span>
              <div className="dl-store-btn-text">
                <span className="sub">Download on the</span>
                <span className="main">App Store</span>
              </div>
            </a>

            <div className="dl-meta-badge">
              iOS 14.0+ · Official Release · Free
            </div>

            {/* Copy Link Option */}
            <div className="dl-copy-link-wrap">
              <button
                type="button"
                className="dl-copy-btn"
                onClick={() => handleCopyLink(appStoreUrl, "ios")}
              >
                {copiedType === "ios" ? "✅ Copied App Store Link!" : "🔗 Copy App Store Link"}
              </button>
            </div>
          </div>

        </div>

        {/* ── Developer Reference & Store Links Customizer ───────────── */}
        <div className="dl-settings-panel">
          <div className="dl-settings-header">
            <h3 className="dl-settings-title">
              <span>⚙️</span>
              <span>
                {isKn ? "ಆ್ಯಪ್ ಸ್ಟೋರ್ ಲಿಂಕ್ ಕಾನ್ಫಿಗರೇಶನ್ (ರೆಫರೆನ್ಸ್)" : "App Store Links Reference & Setup"}
              </span>
            </h3>
            <button
              type="button"
              className="dl-copy-btn"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? "▲ Hide Setup Settings" : "▼ Change / Test Store URLs"}
            </button>
          </div>

          <p className="dl-settings-desc">
            {isKn
              ? "ಈ ಎರಡು ಲಿಂಕ್‌ಗಳು ಗೂಗಲ್ ಪ್ಲೇ ಸ್ಟೋರ್ ಮತ್ತು ಆಪಲ್ ಆಪ್ ಸ್ಟೋರ್‌ಗೆ ಸಿದ್ಧವಾಗಿವೆ. ನೀವು ಆ್ಯಪ್ ಪಬ್ಲಿಶ್ ಮಾಡಿದ ನಂತರ ನಿಮ್ಮದೇ ಆದ ಲೈವ್ ಲಿಂಕ್‌ಗಳನ್ನು ಸುಲಭವಾಗಿ ನವೀಕರಿಸಬಹುದು."
              : "These two scanner links are configured with production reference URLs for Google Play Store and Apple App Store. When you publish your mobile apps, you can easily change or test your live URLs below."}
          </p>

          {showSettings && (
            <div className="dl-settings-grid">
              <div className="dl-input-group">
                <label>Android Play Store URL:</label>
                <input
                  type="text"
                  value={playStoreUrl}
                  onChange={(e) => handleSaveCustomUrls(e.target.value, appStoreUrl)}
                  placeholder="https://play.google.com/store/apps/details?id=..."
                />
              </div>

              <div className="dl-input-group">
                <label>iPhone / iOS App Store URL:</label>
                <input
                  type="text"
                  value={appStoreUrl}
                  onChange={(e) => handleSaveCustomUrls(playStoreUrl, e.target.value)}
                  placeholder="https://apps.apple.com/app/id..."
                />
              </div>

              <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  className="dl-copy-btn"
                  onClick={handleResetDefaults}
                >
                  ↺ Reset to Default Links
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Key App Features Strip ─────────────────────────────────── */}
        <div className="dl-features-section">
          <h2 className="dl-features-title">
            {isKn ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ ಮೊಬೈಲ್ ಆ್ಯಪ್‌ನ ವೈಶಿಷ್ಟ್ಯಗಳು" : "Why Download the AdvocateHub Mobile App?"}
          </h2>

          <div className="dl-features-grid">
            <div className="dl-feature-card">
              <div className="dl-feature-icon">💬</div>
              <h3 className="dl-feature-h">{isKn ? "ತಕ್ಷಣದ ವಕೀಲರ ಚಾಟ್" : "1-Click Lawyer Chat"}</h3>
              <p className="dl-feature-p">
                {isKn
                  ? "ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಪರಿಶೀಲಿಸಿದ ವಕೀಲರೊಂದಿಗೆ ನೇರವಾಗಿ ಸಂದೇಶ ಕಳುಹಿಸಿ."
                  : "Message verified advocates directly from your phone anytime, anywhere."}
              </p>
            </div>

            <div className="dl-feature-card">
              <div className="dl-feature-icon">🛡️</div>
              <h3 className="dl-feature-h">{isKn ? "ಪರಿಶೀಲಿಸಿದ ವಕೀಲರು" : "Verified Credentials"}</h3>
              <p className="dl-feature-p">
                {isKn
                  ? "ಬಾರ್ ಕೌನ್ಸಿಲ್ ಪರಿಶೀಲಿಸಿದ ಅನುಭವಿ ವಕೀಲರ ವಿವರವಾದ ಪ್ರೊಫೈಲ್‌ಗಳು."
                  : "Browse verified Bar Council records, ratings, and experience."}
              </p>
            </div>

            <div className="dl-feature-card">
              <div className="dl-feature-icon">📑</div>
              <h3 className="dl-feature-h">{isKn ? "ಕಾನೂನು ದಾಖಲೆಗಳು" : "Legal Document Vault"}</h3>
              <p className="dl-feature-p">
                {isKn
                  ? "ಕರಾರು ಪತ್ರಗಳು, ಅಫಿಡವಿಟ್ ಮತ್ತು ಕಾನೂನು ದಾಖಲೆಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ."
                  : "Access legal drafts, affidavits, and case files on the go."}
              </p>
            </div>

            <div className="dl-feature-card">
              <div className="dl-feature-icon">🔔</div>
              <h3 className="dl-feature-h">{isKn ? "ತಕ್ಷಣದ ನೋಟಿಫಿಕೇಶನ್‌ಗಳು" : "Live Hearing Alerts"}</h3>
              <p className="dl-feature-p">
                {isKn
                  ? "ಪ್ರಕರಣದ ವಿಚಾರಣೆ ದಿನಾಂಕಗಳು ಮತ್ತು ವಕೀಲರ ಸಂದೇಶಗಳ ಲೈವ್ ಅಲರ್ಟ್‌ಗಳು."
                  : "Get push notifications for message replies and court updates."}
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom Navigation ──────────────────────────────────────── */}
        <div className="dl-bottom-nav">
          <Link to="/" className="dl-back-home-btn">
            <span>←</span>
            <span>{isKn ? "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ" : "Back to Home"}</span>
          </Link>
          <Link to="/find-lawyer" className="dl-find-lawyer-btn">
            <span>🔍</span>
            <span>{isKn ? "ವಕೀಲರನ್ನು ಹುಡುಕಿ" : "Find an Advocate"}</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
