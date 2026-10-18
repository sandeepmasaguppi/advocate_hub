// ============================================================
//   AdvocateHeader.js — Clean, Modern Legal SaaS Header
// ============================================================

import React from "react";
import BrandLogo from "../BrandLogo";
import { assetUrl } from "../../data/api";

const NAV_ICONS = {
  sun: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  moon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
  bell: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

export default function AdvocateHeader({
  advocate,
  theme,
  toggleTheme,
  unreadChatCount = 0,
  latestUnreadMsg,
  openConversation,
  setActiveNav,
  onOpenMobileMenu,
  onOpenProfile,
  isAvailable = true,
}) {
  const displayName = advocate?.name || "Adv. Chetan V Chandaragi";

  // Compute clean initials
  const initials = displayName
    .replace(/^Adv\.?\s*/i, "")
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "CV";

  const rawAvatar = advocate?.avatar || advocate?.photo;
  const avatarSrc = rawAvatar ? (assetUrl ? assetUrl(rawAvatar) : rawAvatar) : null;

  return (
    <header className="ad-topbar" role="banner">
      <div className="ad-topbar-left">
        <button
          type="button"
          className="ad-hamburger-btn"
          onClick={onOpenMobileMenu}
          aria-label="Open mobile navigation menu"
          title="Open Menu"
        >
          ☰
        </button>
        <div className="ad-topbar-brand">
          <BrandLogo size={32} />
        </div>
        <div className="ad-topbar-portal-badge" title="Legal Practice Portal">
          <span>Advocate Workspace</span>
        </div>
      </div>

      <div className="ad-topbar-actions">
        {/* Unread message notification pill */}
        {unreadChatCount > 0 && (
          <button
            type="button"
            className="ad-topbar-notify-pill"
            onClick={() => {
              if (latestUnreadMsg?.conv) {
                openConversation(latestUnreadMsg.conv);
              } else {
                setActiveNav("chat");
              }
            }}
            title={`New message from ${latestUnreadMsg?.clientName || "Client"} - click to open chat`}
          >
            <span className="ad-notify-bell" aria-hidden="true">
              {NAV_ICONS.bell}
            </span>
            <span className="ad-notify-text">
              <b>{latestUnreadMsg?.clientName}</b>: <em>"{latestUnreadMsg?.text?.slice(0, 24)}{latestUnreadMsg?.text?.length > 24 ? "…" : ""}"</em>
            </span>
            <span className="ad-topbar-badge">{unreadChatCount}</span>
          </button>
        )}

        {/* Light / Dark Mode Toggle */}
        <button
          type="button"
          className="ad-theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light theme" : "Switch to Dark theme"}
          aria-label={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
        >
          <span className="ad-theme-icon" aria-hidden="true">
            {theme === "dark" ? NAV_ICONS.sun : NAV_ICONS.moon}
          </span>
          <span className="ad-theme-label">{theme === "dark" ? "Light" : "Dark"}</span>
        </button>

        {/* Advocate Profile Pill in Header */}
        <div
          className="ad-topbar-profile"
          onClick={onOpenProfile}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenProfile();
            }
          }}
          title={`Signed in as ${displayName}. Click to view or edit profile.`}
        >
          <div className="ad-topbar-avatar">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={displayName}
                className="ad-topbar-avatar-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span className="ad-topbar-avatar-initials">{initials}</span>
            )}
            <span
              className={`ad-topbar-status-dot ${isAvailable ? "online" : ""}`}
              title={isAvailable ? "Status: Available for clients" : "Status: Unavailable"}
            />
          </div>
          
        </div>
      </div>
    </header>
  );
}

