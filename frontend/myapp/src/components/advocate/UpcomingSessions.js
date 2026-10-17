// ============================================================
//   UpcomingSessions.js — Upcoming Legal Appointments & Briefs
// ============================================================

import React from "react";

function formatSessionDate(iso) {
  if (!iso) return "Today";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return String(iso);
  }
}

function getInitials(name) {
  const parts = String(name || "Client").trim().replace(/^(adv|advocate|client)\.?\s+/i, "").split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return (parts[0] || "CL").slice(0, 2).toUpperCase();
}

export default function UpcomingSessions({
  sessions = [],
  earningsOverrides = {},
  onViewAll,
  onStartCase,
  onOpenChat,
  onViewRequests,
}) {
  const hasSessions = Array.isArray(sessions) && sessions.length > 0;

  return (
    <div className="ad-card ad-upcoming-sessions-card">
      <div className="ad-card-head">
        <div className="ad-card-title-group">
          <h2 className="ad-card-title">Upcoming Sessions</h2>
          <span className="ad-card-subtitle">Scheduled consultations & case meetings</span>
        </div>
        <button
          type="button"
          className="ad-card-action-link"
          onClick={onViewAll}
          title="View all booked consultations and cases"
        >
          View All →
        </button>
      </div>

      {!hasSessions ? (
        <div className="ad-sessions-empty-state">
          <div className="ad-empty-icon-box">📅</div>
          <div className="ad-empty-title">No upcoming sessions yet</div>
          <p className="ad-empty-text">
            Once you accept client requests or schedule consultations, your active appointments and case meetings will appear here.
          </p>
          {onViewRequests && (
            <button
              type="button"
              className="ad-btn-empty-action"
              onClick={onViewRequests}
            >
              Check Client Requests
            </button>
          )}
        </div>
      ) : (
        <div className="ad-sessions-compact-list">
          {sessions.slice(0, 3).map((req) => {
            const override = (earningsOverrides && earningsOverrides[req.id]) || {};
            const clientName = override.clientName || req.clientName || `Client #${req.id}`;
            const clientLocation = req.clientCity || "Online Client";
            const dateStr = formatSessionDate(override.requestedAt || req.requestedAt);
            const caseStage = req.caseStage || "Start Case";
            const stageClass = caseStage.toLowerCase().replace(/[^a-z0-9]/g, "-");

            return (
              <div key={req.id} className="ad-session-compact-item">
                <div className="ad-session-left-meta">
                  <div className="ad-session-compact-avatar">
                    {req.clientAvatar ? (
                      <img
                        src={req.clientAvatar}
                        alt={clientName}
                        className="ad-session-avatar-img"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="ad-session-avatar-fallback">{getInitials(clientName)}</span>
                    )}
                  </div>

                  <div className="ad-session-compact-info">
                    <div className="ad-session-name-row">
                      <strong className="ad-session-client-name">{clientName}</strong>
                      <span className={`ad-stage-pill ${stageClass}`}>
                        {caseStage}
                      </span>
                    </div>
                    <div className="ad-session-details-row">
                      <span className="ad-session-loc">📍 {clientLocation}</span>
                      <span className="ad-session-meta-divider">•</span>
                      <span className="ad-session-date">📅 {dateStr}</span>
                    </div>
                  </div>
                </div>

                <div className="ad-session-compact-actions">
                  {onOpenChat && (
                    <button
                      type="button"
                      className="ad-btn-session-chat"
                      onClick={() => onOpenChat(req)}
                      title="Open WhatsApp chat with client"
                    >
                      💬 Chat
                    </button>
                  )}
                  <button
                    type="button"
                    className="ad-btn-start-case"
                    onClick={() => onStartCase && onStartCase(req)}
                    title="Initialize or update case proceedings without duplicating"
                  >
                    Start Case
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

