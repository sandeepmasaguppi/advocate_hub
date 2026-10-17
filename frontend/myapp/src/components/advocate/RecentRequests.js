// ============================================================
//   RecentRequests.js — Client Intake Requests Card
// ============================================================

import React from "react";

function formatRequestDate(iso) {
  if (!iso) return "Recent";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
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

export default function RecentRequests({
  requests = [],
  advocateSpeciality = "Corporate Law",
  onOpenInbox,
  onAccept,
  onDecline,
}) {
  const hasRequests = Array.isArray(requests) && requests.length > 0;

  return (
    <div className="ad-card ad-recent-requests-card">
      <div className="ad-card-head">
        <div className="ad-card-title-group">
          <h2 className="ad-card-title">Recent Requests</h2>
          <span className="ad-card-subtitle">Client consultation applications</span>
        </div>
        <button
          type="button"
          className="ad-card-action-link"
          onClick={onOpenInbox}
          title="Open full client requests inbox"
        >
          Open Inbox →
        </button>
      </div>

      {!hasRequests ? (
        <div className="ad-requests-empty-state">
          <div className="ad-empty-icon-box">📬</div>
          <div className="ad-empty-title">Nothing waiting. New client requests will show here first.</div>
        </div>
      ) : (
        <div className="ad-recent-requests-list">
          {requests.slice(0, 3).map((req) => {
            const clientName = req.clientName || `Client #${req.id}`;
            const serviceType = req.service || req.caseType || req.message || advocateSpeciality || "Legal Consultation";
            const dateStr = formatRequestDate(req.requestedAt);

            return (
              <div key={req.id} className="ad-recent-request-item">
                <div className="ad-recent-req-main">
                  <div className="ad-recent-req-avatar">
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

                  <div className="ad-recent-req-info">
                    <div className="ad-recent-req-name-row">
                      <strong className="ad-recent-req-client">{clientName}</strong>
                      <span className="ad-recent-req-badge-pending">Pending Review</span>
                    </div>

                    <div className="ad-recent-req-meta-row">
                      <span className="ad-recent-req-date">📅 {dateStr}</span>
                      <span className="ad-recent-req-dot">•</span>
                      <span className="ad-recent-req-service" title={serviceType}>
                        ⚖️ {serviceType.length > 36 ? `${serviceType.slice(0, 36)}…` : serviceType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ad-recent-req-actions">
                  <button
                    type="button"
                    className="ad-btn-req-accept"
                    onClick={() => onAccept && onAccept(req.id)}
                    title="Accept client intake request"
                  >
                    ✓ Accept
                  </button>
                  <button
                    type="button"
                    className="ad-btn-req-decline"
                    onClick={() => onDecline && onDecline(req.id)}
                    title="Decline request"
                  >
                    ✕ Decline
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

