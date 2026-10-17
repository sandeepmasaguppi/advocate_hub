// ============================================================
//   ProfileOverview.js — Premium Advocate Profile Overview Card
// ============================================================

import React from "react";
import { assetUrl } from "../../data/api";

export default function ProfileOverview({
  advocate,
  isAvailable = true,
  onEditProfile,
}) {
  const name = advocate?.name || "Adv. Chetan V Chandaragi";
  const speciality = advocate?.speciality || advocate?.practiceArea || "Corporate Law";
  const city = advocate?.city || "Gokak";
  const experience = advocate?.experience || "3–5 years";
  const fee = advocate?.fee || "₹1,500";
  const barId = advocate?.barId || "KAR/1248/2021";
  const court = advocate?.court || "High Court & District Courts";
  const bio = advocate?.bio || "Dedicated legal professional providing trusted counsel in corporate compliance, dispute resolution, contract negotiation, and civil litigation.";
  const languages = Array.isArray(advocate?.languages)
    ? advocate.languages.join(", ")
    : (advocate?.languages || "English, Kannada, Hindi");

  // Initials
  const initials = name
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
    <section className="ad-profile-overview-card" aria-label="Advocate Profile Overview">
      <div className="ad-overview-main">
        {/* Avatar with Verified Status */}
        <div className="ad-overview-avatar-wrap">
          <div className="ad-overview-avatar">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={name}
                className="ad-overview-avatar-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span className="ad-overview-avatar-fallback">{initials}</span>
            )}
          </div>
          <span className="ad-overview-verified-badge" title="Verified Advocate by Bar Council of India">
            ✓
          </span>
        </div>

        {/* Identity & Practice Details */}
        <div className="ad-overview-content">
          <div className="ad-overview-topline">
            <div className="ad-overview-name-group">
              <h1 className="ad-overview-name">{name}</h1>
              <span className="ad-overview-role-badge">Advocate</span>
            </div>

            <div className="ad-overview-actions">
              <span className={`ad-overview-avail-badge ${isAvailable ? "available" : "unavailable"}`}>
                <span className="ad-avail-pulse-dot" />
                {isAvailable ? "Available" : "Unavailable"}
              </span>

              <button
                type="button"
                className="ad-btn-edit-overview"
                onClick={onEditProfile}
                title="Edit your advocate profile"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Subtitle Details: Specialization, Location, Bar Council, Court */}
          <div className="ad-overview-subrow">
            <span className="ad-overview-pill ad-overview-spec">
              ⚖️ {speciality}
            </span>
            <span className="ad-overview-pill ad-overview-loc">
              📍 {city}
            </span>
            <span className="ad-overview-pill ad-overview-bar">
              🏛️ {court}
            </span>
            <span className="ad-overview-pill ad-overview-barid">
              📜 {barId}
            </span>
          </div>

          {/* Star Rating & Short Bio */}
          <div className="ad-overview-rating-row">
            <div className="ad-overview-stars" title="Rating: 5 Stars (Top Rated)">
              <span className="ad-star-icon">★</span>
              <span className="ad-star-icon">★</span>
              <span className="ad-star-icon">★</span>
              <span className="ad-star-icon">★</span>
              <span className="ad-star-icon">★</span>
              <span className="ad-star-score">5.0</span>
              <span className="ad-star-label">(5 Stars Rating)</span>
            </div>
            <span className="ad-overview-separator">•</span>
            <span className="ad-overview-languages" title="Languages Spoken">
              🗣️ {languages}
            </span>
          </div>

          {bio && <p className="ad-overview-bio">{bio}</p>}
        </div>
      </div>

      {/* Highlights Strip */}
      <div className="ad-overview-highlights">
        <div className="ad-overview-highlight-item">
          <div className="ad-hl-label">Practice Experience</div>
          <div className="ad-hl-val">{experience}</div>
        </div>
        <div className="ad-overview-highlight-item">
          <div className="ad-hl-label">Consultation Fee</div>
          <div className="ad-hl-val">{fee} <small>/ session</small></div>
        </div>
        <div className="ad-overview-highlight-item">
          <div className="ad-hl-label">Specialization</div>
          <div className="ad-hl-val text-primary">{speciality}</div>
        </div>
        <div className="ad-overview-highlight-item">
          <div className="ad-hl-label">Verification Status</div>
          <div className="ad-hl-val text-success">
            <span className="ad-verified-dot" /> Bar Verified
          </div>
        </div>
      </div>
    </section>
  );
}

