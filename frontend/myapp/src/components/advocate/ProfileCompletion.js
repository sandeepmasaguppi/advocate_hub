// ============================================================
//   ProfileCompletion.js — Compact 5-Step Profile Completion Card
// ============================================================

import React from "react";

const COMPLETION_ITEMS = [
  { key: "avatar", label: "Profile photo", check: (adv) => Boolean(adv?.avatar || adv?.photo) },
  { key: "bio", label: "Bio", check: (adv) => Boolean(adv?.bio && String(adv.bio).trim().length > 3) },
  { key: "barId", label: "Bar Council ID", check: (adv) => Boolean(adv?.barId || adv?.barCouncil) },
  { key: "court", label: "Court", check: (adv) => Boolean(adv?.court && String(adv.court).trim().length > 0) },
  { key: "languages", label: "Languages", check: (adv) => Boolean(adv?.languages && (Array.isArray(adv.languages) ? adv.languages.length > 0 : String(adv.languages).trim().length > 0)) },
];

export default function ProfileCompletion({ advocate, onEditProfile }) {
  // Calculate completion dynamically from saved profile fields
  const checkedItems = COMPLETION_ITEMS.map((item) => ({
    ...item,
    isDone: item.check(advocate),
  }));

  const doneCount = checkedItems.filter((i) => i.isDone).length;
  const totalCount = COMPLETION_ITEMS.length;
  const percent = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="ad-card ad-profile-completion-card">
      <div className="ad-card-head">
        <div className="ad-card-title-group">
          <h2 className="ad-card-title">Profile Completion</h2>
          <span className="ad-card-subtitle">Complete profile to increase client trust</span>
        </div>
        <span className={`ad-completion-ratio-badge ${doneCount === totalCount ? "complete" : ""}`}>
          {doneCount}/{totalCount} Completed
        </span>
      </div>

      {/* Progress Bar */}
      <div className="ad-completion-progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
        <div
          className={`ad-completion-progress-bar ${doneCount === totalCount ? "bg-success" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* 5-Item Checklist */}
      <ul className="ad-completion-checklist">
        {checkedItems.map((item) => (
          <li key={item.key} className={`ad-completion-check-item ${item.isDone ? "done" : "pending"}`}>
            <div className="ad-check-left">
              <span className={`ad-check-bullet ${item.isDone ? "bullet-done" : "bullet-pending"}`} aria-hidden="true">
                {item.isDone ? "✓" : "○"}
              </span>
              <span className="ad-check-label">{item.label}</span>
            </div>
            <span className={`ad-check-status-tag ${item.isDone ? "tag-done" : "tag-pending"}`}>
              {item.isDone ? "Done" : "Add"}
            </span>
          </li>
        ))}
      </ul>

      {/* Edit Profile Action */}
      <div className="ad-completion-footer">
        <button
          type="button"
          className="ad-btn-edit-profile-card"
          onClick={onEditProfile}
          title="Open profile editor"
        >
          ✎ Edit Profile
        </button>
      </div>
    </div>
  );
}

