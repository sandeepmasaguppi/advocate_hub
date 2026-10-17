// ============================================================
//   QuickActions.js — 5 Functional Quick Action Buttons
// ============================================================

import React from "react";

const ACTION_ICONS = {
  editProfile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  earnings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <path d="M7 15h2M12 15h5" />
    </svg>
  ),
  messages: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  manageCases: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  viewSchedule: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="22" y2="10" />
    </svg>
  ),
};

export default function QuickActions({
  unreadChatCount = 0,
  onNavigate,
}) {
  const actions = [
    {
      key: "edit-profile",
      label: "Edit Profile",
      desc: "Bio, credentials & fees",
      icon: ACTION_ICONS.editProfile,
      onClick: () => onNavigate && onNavigate("profile"),
    },
    {
      key: "earnings",
      label: "Earnings",
      desc: "Fee ledger & settlements",
      icon: ACTION_ICONS.earnings,
      onClick: () => onNavigate && onNavigate("earnings"),
    },
    {
      key: "client-messages",
      label: "Client Messages",
      desc: "WhatsApp real-time chat",
      icon: ACTION_ICONS.messages,
      badge: unreadChatCount > 0 ? `${unreadChatCount} new` : null,
      onClick: () => onNavigate && onNavigate("chat"),
    },
    {
      key: "manage-cases",
      label: "Manage Cases",
      desc: "Active stages & hearings",
      icon: ACTION_ICONS.manageCases,
      onClick: () => onNavigate && onNavigate("sessions"),
    },
    {
      key: "view-schedule",
      label: "View Schedule",
      desc: "Booked consultations",
      icon: ACTION_ICONS.viewSchedule,
      onClick: () => onNavigate && onNavigate("sessions"),
    },
  ];

  return (
    <div className="ad-card ad-quick-actions-card">
      <div className="ad-card-head">
        <div className="ad-card-title-group">
          <h2 className="ad-card-title">Quick Actions</h2>
          <span className="ad-card-subtitle">Frequently accessed practice shortcuts</span>
        </div>
      </div>

      <div className="ad-quick-actions-grid">
        {actions.map((act) => (
          <button
            key={act.key}
            type="button"
            className="ad-quick-action-btn"
            onClick={act.onClick}
            title={act.desc}
          >
            <div className="ad-quick-action-icon-wrap">
              {act.icon}
              {act.badge && <span className="ad-quick-action-badge">{act.badge}</span>}
            </div>
            <div className="ad-quick-action-text">
              <span className="ad-quick-action-title">{act.label}</span>
              <span className="ad-quick-action-desc">{act.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

