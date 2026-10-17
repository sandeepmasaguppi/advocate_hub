// ============================================================
//   DashboardStats.js — 4-Card Responsive Legal SaaS Metrics
// ============================================================

import React from "react";

const STAT_ICONS = {
  cases: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  pending: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  clients: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  rating: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

export default function DashboardStats({
  casesCount = 0,
  pendingCount = 0,
  acceptedCount = 6,
  rating = "5.0",
  onNavigate,
}) {
  return (
    <section className="ad-dashboard-stats-section" aria-label="Dashboard Key Statistics">
      <div className="ad-stats-grid">
        {/* 1. Cases handled */}
        <div className="ad-stat-card tone-cases">
          <div className="ad-stat-card-header">
            <span className="ad-stat-card-icon">{STAT_ICONS.cases}</span>
            <span className="ad-stat-card-tag">Casework</span>
          </div>
          <div className="ad-stat-card-body">
            <div className="ad-stat-card-value">{casesCount}</div>
            <div className="ad-stat-card-label">Cases Handled</div>
            <div className="ad-stat-card-sub">Active & closed client briefs</div>
          </div>
        </div>

        {/* 2. Pending requests */}
        <div
          className={`ad-stat-card tone-pending ${pendingCount > 0 ? "has-urgent" : ""} ad-stat-clickable`}
          onClick={() => onNavigate && onNavigate("requests")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onNavigate && onNavigate("requests");
            }
          }}
          title="Click to view Client Requests"
        >
          <div className="ad-stat-card-header">
            <span className="ad-stat-card-icon">{STAT_ICONS.pending}</span>
            {pendingCount > 0 ? (
              <span className="ad-stat-card-tag urgent">Action Required</span>
            ) : (
              <span className="ad-stat-card-tag">Cleared</span>
            )}
          </div>
          <div className="ad-stat-card-body">
            <div className={`ad-stat-card-value ${pendingCount > 0 ? "text-amber" : ""}`}>
              {pendingCount}
            </div>
            <div className="ad-stat-card-label">Pending Requests</div>
            <div className="ad-stat-card-sub">
              {pendingCount > 0 ? `${pendingCount} awaiting your acceptance` : "All client requests answered"}
            </div>
          </div>
        </div>

        {/* 3. Accepted clients */}
        <div
          className="ad-stat-card tone-clients ad-stat-clickable"
          onClick={() => onNavigate && onNavigate("chat")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onNavigate && onNavigate("chat");
            }
          }}
          title="Click to open Client Messaging"
        >
          <div className="ad-stat-card-header">
            <span className="ad-stat-card-icon">{STAT_ICONS.clients}</span>
            <span className="ad-stat-card-tag success">Active Retainers</span>
          </div>
          <div className="ad-stat-card-body">
            <div className="ad-stat-card-value">{acceptedCount}</div>
            <div className="ad-stat-card-label">Accepted Clients</div>
            <div className="ad-stat-card-sub">Retained consultations in progress</div>
          </div>
        </div>

        {/* 4. Average rating */}
        <div className="ad-stat-card tone-rating">
          <div className="ad-stat-card-header">
            <span className="ad-stat-card-icon text-gold">{STAT_ICONS.rating}</span>
            <span className="ad-stat-card-tag gold">Top Rated</span>
          </div>
          <div className="ad-stat-card-body">
            <div className="ad-stat-card-value">
              {Number(rating) > 0 ? rating : "5.0"}
            </div>
            <div className="ad-stat-card-label">Average Rating</div>
            <div className="ad-stat-card-sub">★★★★★ (5 Stars Verified)</div>
          </div>
        </div>
      </div>
    </section>
  );
}

