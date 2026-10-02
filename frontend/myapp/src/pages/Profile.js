// ============================================================
//  Profile.js — Advocates Hub Executive Advocate Profile Page
//  Features:
//   • Executive, high-definition UI with Verified Bar Member credentials
//   • Full bilingual support: English & Kannada (ಕನ್ನಡ)
//   • Integrated Dark & White (Light) Theme reactivity & toggle controls
//   • Verified credential stats: Rating, Cases, Court Practice, Enrollment
//   • Two-column responsive layout with sticky consultation booking
//   • Jurisdiction breakdown: Bar Council ID, Court Level, District, Taluk
//   • Direct link to Client Portal consultation chat
// ============================================================

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getAdvocates, loadAdvocates } from "../data/Advocatesstore";
import { getTheme, toggleTheme } from "../data/themeStore";
import { assetUrl } from "../data/api";
import "./Profile.css";
import "./AdvocatesList.css";

const REQUESTS_KEY = "law4u_requests";

const I18N = {
  en: {
    backToDirectory: "← Back to Directory",
    profileId: "Profile ID",
    verifiedBarMember: "Verified Bar Member",
    availableForConsult: "Available for Consultation",
    consultationStatus: "Consultation Status",
    directAccess: "⚡ Direct Access",
    bookAppointment: "Book Appointment →",
    verifiedClientRating: "Verified Client Rating",
    casesWon: "Litigation & Advisory",
    courtPractice: "Court Practice",
    yearsExp: "Years",
    casesUnit: "+ Cases",
    bioTitle: "Professional Biography & Overview",
    registeredWith: "Registered with",
    practiceAuth: "Practice authorized before",
    andSubordinate: "and Subordinate Courts",
    privilegeStd: "Strict client-attorney privilege and non-disclosure standards",
    practiceAreasTitle: "Practice Areas & Core Competencies",
    jurisdictionTitle: "Court Jurisdiction & Bar Enrollment",
    primaryCourt: "Primary Court",
    courtLevel: "Court Level",
    barCouncil: "Bar Enrollment Council",
    barRegNo: "Bar Registration Number",
    districtJurisdiction: "District Jurisdiction",
    taluk: "Taluk / Region",
    languagesTitle: "Languages Fluent",
    legalConsultation: "Legal Consultation",
    verifiedAdvocate: "Verified Advocate",
    consultSub: "Confidential case evaluation & strategic legal counsel",
    bookConsultationNow: "📅 Book Consultation Now",
    clientPortalChat: "💬 Client Portal Chat",
    chatNow: "Chat Now",
    directChatAction: "Direct Consultation Chat",
    moreAdvocatesTitle: "Explore More Verified Advocates in Karnataka",
    moreAdvocatesSub: "Certified legal practitioners across High Court and District Courts",
    guaranteeBar: "Bar Council Verified",
    guaranteeBarDesc: "Enrollment credentials cross-verified with state regulatory records.",
    guaranteePriv: "100% Client Privilege",
    guaranteePrivDesc: "Protected attorney-client confidentiality under the Indian Evidence Act.",
    guaranteeSpeed: "Priority Response",
    guaranteeSpeedDesc: "Advocate typically connects within 2 to 4 business hours.",
    shareProfile: "Share Profile 🔗",
    copiedLink: "Profile URL copied to clipboard! 📋",
    // Modal
    modalTitle: "Book Consultation",
    modalSub: (name) => `Direct appointment with ${name}`,
    fullName: "Your Full Name *",
    fullNamePh: "e.g. Ramesh Kumar",
    phone: "Phone Number *",
    phonePh: "10-digit mobile number",
    email: "Email Address *",
    emailPh: "name@email.com",
    matterType: "Legal Matter / Practice Area",
    caseDesc: "Describe Your Case / Inquiry *",
    caseDescPh: "Briefly state your legal issue, court dates if any, or questions for the advocate...",
    confidentialNotice: "100% Confidential: Your contact details and legal inquiry are securely transmitted directly to the advocate.",
    cancel: "Cancel",
    confirmBooking: "Confirm Consultation Request →",
    sending: "Sending Request…",
    requestSentTitle: "Consultation Request Sent!",
    requestSentDesc: (name) => `Your consultation request has been forwarded to ${name}. The advocate will review your details and reach out via phone or email shortly.`,
    estResponse: "⚡ Estimated response time: Within 2–4 hours",
    done: "Done",
    notFoundTitle: "Advocate Profile Not Found",
    notFoundDesc: "The requested advocate profile could not be located in our directory.",
    themeLight: "Light",
    themeDark: "Dark",
  },
  kn: {
    backToDirectory: "← ವಕೀಲರ ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ",
    profileId: "ಪ್ರೊಫೈಲ್ ಸಂಖ್ಯೆ",
    verifiedBarMember: "ಪರಿಶೀಲಿತ ಬಾರ್ ಕೌನ್ಸಿಲ್ ಸದಸ್ಯರು",
    availableForConsult: "ಸಮಾಲೋಚನೆಗೆ ಲಭ್ಯವಿದ್ದಾರೆ",
    consultationStatus: "ಸಮಾಲೋಚನೆ ಸ್ಥಿತಿ",
    directAccess: "⚡ ನೇರ ಸಂಪರ್ಕ",
    bookAppointment: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ →",
    verifiedClientRating: "ಪರಿಶೀಲಿತ ಗ್ರಾಹಕರ ರೇಟಿಂಗ್",
    casesWon: "ನ್ಯಾಯಾಲಯ ವ್ಯಾಜ್ಯ & ಸಲಹೆ",
    courtPractice: "ನ್ಯಾಯಾಲಯ ಅನುಭವ",
    yearsExp: "ವರ್ಷಗಳು",
    casesUnit: "+ ಪ್ರಕರಣಗಳು",
    bioTitle: "ವೃತ್ತಿಪರ ಪರಿಚಯ ಮತ್ತು ಅವಲೋಕನ",
    registeredWith: "ನೋಂದಾಯಿತ ಬಾರ್ ಕೌನ್ಸಿಲ್:",
    practiceAuth: "ಅಧಿಕೃತ ಅಭ್ಯಾಸ ವ್ಯಾಪ್ತಿ:",
    andSubordinate: "ಮತ್ತು ಅಧೀನ ನ್ಯಾಯಾಲಯಗಳು",
    privilegeStd: "ವಕೀಲ-ಕ್ಲೈಂಟ್ ಗೌಪ್ಯತೆ ಮತ್ತು ರಹಸ್ಯ ಕಾಪಾಡುವ ಕಟ್ಟುನಿಟ್ಟಾದ ಮಾನದಂಡಗಳು",
    practiceAreasTitle: "ಕಾನೂನು ಪರಿಣತಿ ಮತ್ತು ಸೇವಾ ಕ್ಷೇತ್ರಗಳು",
    jurisdictionTitle: "ನ್ಯಾಯಾಲಯ ವ್ಯಾಪ್ತಿ ಮತ್ತು ಬಾರ್ ನೋಂದಣಿ",
    primaryCourt: "ಪ್ರಮುಖ ನ್ಯಾಯಾಲಯ",
    courtLevel: "ನ್ಯಾಯಾಲಯದ ಹಂತ",
    barCouncil: "ಬಾರ್ ಕೌನ್ಸಿಲ್",
    barRegNo: "ಬಾರ್ ನೋಂದಣಿ ಸಂಖ್ಯೆ",
    districtJurisdiction: "ಜಿಲ್ಲಾ ವ್ಯಾಪ್ತಿ",
    taluk: "ತಾಲೂಕು / ಪ್ರದೇಶ",
    languagesTitle: "ಮಾತನಾಡುವ ಭಾಷೆಗಳು",
    legalConsultation: "ಕಾನೂನು ಸಮಾಲೋಚನೆ",
    verifiedAdvocate: "ಪರಿಶೀಲಿತ ವಕೀಲರು",
    consultSub: "ಗೌಪ್ಯ ಪ್ರಕರಣ ಪರಿಶೀಲನೆ ಮತ್ತು ಕಾರ್ಯತಂತ್ರದ ಕಾನೂನು ಸಲಹೆ",
    bookConsultationNow: "📅 ಸಮಾಲೋಚನೆ ಕಾಯ್ದಿರಿಸಿ",
    clientPortalChat: "💬 ಕ್ಲೈಂಟ್ ಪೋರ್ಟಲ್ ಚಾಟ್",
    chatNow: "ಈಗಲೇ ಚಾಟ್ ಮಾಡಿ",
    directChatAction: "ವಕೀಲರೊಂದಿಗೆ ನೇರ ಚಾಟ್",
    moreAdvocatesTitle: "ಕರ್ನಾಟಕದ ಇನ್ನಷ್ಟು ಪರಿಶೀಲಿತ ವಕೀಲರನ್ನು ನೋಡಿ",
    moreAdvocatesSub: "ಹೈಕೋರ್ಟ್ ಮತ್ತು ಜಿಲ್ಲಾ ನ್ಯಾಯಾಲಯಗಳ ಅಧಿಕೃತ ವಕೀಲರು",
    guaranteeBar: "ಬಾರ್ ಕೌನ್ಸಿಲ್ ಪರಿಶೀಲಿತ",
    guaranteeBarDesc: "ರಾಜ್ಯ ಬಾರ್ ಕೌನ್ಸಿಲ್ ದಾಖಲೆಗಳೊಂದಿಗೆ ಅಧಿಕೃತವಾಗಿ ಪರಿಶೀಲಿಸಲಾದ ನೋಂದಣಿ.",
    guaranteePriv: "100% ಕ್ಲೈಂಟ್ ಗೌಪ್ಯತೆ",
    guaranteePrivDesc: "ಭಾರತೀಯ ಸಾಕ್ಷ್ಯ ಕಾಯ್ದೆಯ ಅಡಿಯಲ್ಲಿ ಸಂರಕ್ಷಿತ ವಕೀಲ-ಕ್ಲೈಂಟ್ ಗೌಪ್ಯತೆ.",
    guaranteeSpeed: "ಆದ್ಯತೆಯ ಪ್ರತಿಕ್ರಿಯೆ",
    guaranteeSpeedDesc: "ವಕೀಲರು ಸಾಮಾನ್ಯವಾಗಿ 2 ರಿಂದ 4 ಕೆಲಸದ ಗಂಟೆಗಳಲ್ಲಿ ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.",
    shareProfile: "ಪ್ರೊಫೈಲ್ ಹಂಚಿಕೊಳ್ಳಿ 🔗",
    copiedLink: "ಪ್ರೊಫೈಲ್ ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ! 📋",
    // Modal
    modalTitle: "ಸಮಾಲೋಚನೆ ಕಾಯ್ದಿರಿಸಿ",
    modalSub: (name) => `${name} ಅವರೊಂದಿಗೆ ನೇರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್`,
    fullName: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು *",
    fullNamePh: "ಉದಾ: ರಮೇಶ್ ಕುಮಾರ್",
    phone: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *",
    phonePh: "10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    email: "ಇಮೇಲ್ ವಿಳಾಸ *",
    emailPh: "name@email.com",
    matterType: "ಕಾನೂನು ವಿಷಯ / ವಿಭಾಗ",
    caseDesc: "ನಿಮ್ಮ ಪ್ರಕರಣ / ಪ್ರಶ್ನೆಯ ವಿವರ *",
    caseDescPh: "ನಿಮ್ಮ ಕಾನೂನು ಸಮಸ್ಯೆ, ಕೋರ್ಟ್ ದಿನಾಂಕಗಳು ಅಥವಾ ಪ್ರಶ್ನೆಗಳನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ತಿಳಿಸಿ...",
    confidentialNotice: "100% ಗೌಪ್ಯತೆ: ನಿಮ್ಮ ಸಂಪರ್ಕ ವಿವರ ಮತ್ತು ಕಾನೂನು ಪ್ರಶ್ನೆಯನ್ನು ನೇರವಾಗಿ ವಕೀಲರಿಗೆ ಸುರಕ್ಷಿತವಾಗಿ ರವಾನಿಸಲಾಗುತ್ತದೆ.",
    cancel: "ರದ್ದುಮಾಡಿ",
    confirmBooking: "ಸಮಾಲೋಚನೆ ವಿನಂತಿ ಕಳುಹಿಸಿ →",
    sending: "ವಿನಂತಿ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ…",
    requestSentTitle: "ಸಮಾಲೋಚನೆ ವಿನಂತಿ ಕಳುಹಿಸಲಾಗಿದೆ!",
    requestSentDesc: (name) => `ನಿಮ್ಮ ಸಮಾಲೋಚನಾ ವಿನಂತಿಯನ್ನು ${name} ಅವರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ವಕೀಲರು ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಶೀಘ್ರದಲ್ಲೇ ಫೋನ್ ಅಥವಾ ಇಮೇಲ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.`,
    estResponse: "⚡ ಅಂದಾಜು ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯ: 2–4 ಗಂಟೆಗಳ ಒಳಗೆ",
    done: "ಮುಕ್ತಾಯ",
    notFoundTitle: "ವಕೀಲರ ಪ್ರೊಫೈಲ್ ಕಂಡುಬಂದಿಲ್ಲ",
    notFoundDesc: "ವಿನಂತಿಸಿದ ವಕೀಲರ ಪ್ರೊಫೈಲ್ ನಮ್ಮ ಡೈರೆಕ್ಟರಿಯಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ.",
    themeLight: "ಬೆಳಕು",
    themeDark: "ಡಾರ್ಕ್",
  },
};

const getInitials = (name = "") =>
  name
    .replace(/^Adv\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "AD";

const getAvatarColor = (name = "") => {
  const palette = ["#2563eb", "#16a34a", "#7c3aed", "#dc2626", "#ea580c", "#0891b2", "#0f766e", "#9333ea"];
  const sum = name.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return palette[sum % palette.length];
};

const PRACTICE_THEMES = {
  Criminal: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  Civil: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  Family: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Divorce: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Property: { bg: "#faf5ff", color: "#7c3aed", border: "#e9d5ff" },
  Corporate: { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  Tax: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  GST: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Cyber: { bg: "#ecfeff", color: "#0891b2", border: "#a5f3fc" },
  Banking: { bg: "#f0fdfa", color: "#0f766e", border: "#99f6e4" },
  "Cheque Bounce": { bg: "#fdf4ff", color: "#a21caf", border: "#f5d0fe" },
};

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const isValidPhone = (p) => /^\d{10}$/.test(p.replace(/\s|-/g, ""));

function loadAllRequests() {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllRequests(all) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(all));
}

// ── Book Consultation Modal ──────────────────────────────────
function BookConsultationModal({ advocate, lang, onClose, onSent }) {
  const t = I18N[lang] || I18N.en;
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    matterType: advocate.speciality || "Civil Matters",
  });
  const [err, setErr] = useState({});
  const [sending, setSending] = useState(false);

  const setF = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErr((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = lang === "kn" ? "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಅಗತ್ಯವಿದೆ" : "Your full name is required";
    if (!form.phone.trim()) e.phone = lang === "kn" ? "10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ" : "10-digit mobile number is required";
    else if (!isValidPhone(form.phone)) e.phone = lang === "kn" ? "ಸರಿಯಾದ 10-ಅಂಕಿಯ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ" : "Enter a valid 10-digit phone number";
    if (!form.email.trim()) e.email = lang === "kn" ? "ಇಮೇಲ್ ವಿಳಾಸ ಅಗತ್ಯವಿದೆ" : "Email address is required";
    else if (!isValidEmail(form.email)) e.email = lang === "kn" ? "ಸರಿಯಾದ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ" : "Invalid email format";
    if (!form.message.trim()) e.message = lang === "kn" ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಕಾನೂನು ಪ್ರಶ್ನೆಯ ವಿವರ ನೀಡಿ" : "Please provide details about your legal inquiry";
    setErr(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);

    setTimeout(() => {
      const all = loadAllRequests();
      const advId = String(advocate.id);
      const list = all[advId] || [];
      const newReq = {
        id: "req_" + Date.now(),
        clientName: form.name.trim(),
        clientPhone: form.phone.trim(),
        clientEmail: form.email.trim(),
        message: form.message.trim(),
        matterType: form.matterType,
        date: new Date().toISOString(),
        status: "pending",
      };
      all[advId] = [newReq, ...list];
      saveAllRequests(all);
      setSending(false);
      onSent();
    }, 600);
  };

  return (
    <div className="lw-modal-overlay" onClick={onClose}>
      <div className="lw-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="lw-modal-header">
          <div>
            <h3 className="lw-modal-title">{t.modalTitle}</h3>
            <p className="lw-modal-sub">{t.modalSub(advocate.name)}</p>
          </div>
          <button type="button" className="lw-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="lw-modal-body">
            <div className="lw-modal-field">
              <label>{t.fullName}</label>
              <input
                type="text"
                placeholder={t.fullNamePh}
                value={form.name}
                onChange={(e) => setF("name", e.target.value)}
                disabled={sending}
              />
              {err.name && <p className="lw-field-err">⚠ {err.name}</p>}
            </div>

            <div className="lw-modal-grid-2">
              <div className="lw-modal-field">
                <label>{t.phone}</label>
                <input
                  type="tel"
                  placeholder={t.phonePh}
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => setF("phone", e.target.value)}
                  disabled={sending}
                />
                {err.phone && <p className="lw-field-err">⚠ {err.phone}</p>}
              </div>

              <div className="lw-modal-field">
                <label>{t.email}</label>
                <input
                  type="email"
                  placeholder={t.emailPh}
                  value={form.email}
                  onChange={(e) => setF("email", e.target.value)}
                  disabled={sending}
                />
                {err.email && <p className="lw-field-err">⚠ {err.email}</p>}
              </div>
            </div>

            <div className="lw-modal-field">
              <label>{t.matterType}</label>
              <input
                type="text"
                value={form.matterType}
                onChange={(e) => setF("matterType", e.target.value)}
                disabled={sending}
              />
            </div>

            <div className="lw-modal-field">
              <label>{t.caseDesc}</label>
              <textarea
                rows={4}
                placeholder={t.caseDescPh}
                value={form.message}
                onChange={(e) => setF("message", e.target.value)}
                disabled={sending}
              />
              {err.message && <p className="lw-field-err">⚠ {err.message}</p>}
            </div>

            <div className="lw-modal-notice">
              🔒 <strong>{lang === "kn" ? "100% ಗೌಪ್ಯತೆ:" : "100% Confidential:"}</strong> {t.confidentialNotice}
            </div>
          </div>

          <div className="lw-modal-footer">
            <button type="button" className="lw-modal-btn-cancel" onClick={onClose} disabled={sending}>
              {t.cancel}
            </button>
            <button type="submit" className="lw-modal-btn-submit" disabled={sending}>
              {sending ? t.sending : t.confirmBooking}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Request Sent Confirmation Modal ──────────────────────────
function RequestSentModal({ advocate, lang, onClose }) {
  const t = I18N[lang] || I18N.en;
  return (
    <div className="lw-modal-overlay" onClick={onClose}>
      <div className="lw-modal-box lw-modal-box-sm" onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: "center", padding: "16px 8px 8px" }}>
          <div style={{ fontSize: "52px", marginBottom: "12px" }}>🎉</div>
          <h3 style={{ margin: "0 0 8px", fontSize: "1.4rem", fontWeight: "800" }}>
            {t.requestSentTitle}
          </h3>
          <p style={{ color: "var(--pf-text-secondary)", fontSize: "0.95rem", lineHeight: "1.55" }}>
            {t.requestSentDesc(advocate.name)}
          </p>
          <div className="lw-modal-confirm-badge">
            {t.estResponse}
          </div>
          <button
            type="button"
            className="lw-modal-btn-submit"
            style={{ width: "100%", marginTop: "20px" }}
            onClick={onClose}
          >
            {t.done}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  // Theme state synchronized with centralized themeStore
  const [theme, setTheme] = useState(getTheme);

  // Language state synchronized with system
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("law4u_language") || localStorage.getItem("law4u_home_lang") || "en";
    } catch {
      return "en";
    }
  });

  const t = I18N[lang] || I18N.en;
  const isKn = lang === "kn";

  const [advocates, setAdvocates] = useState(() => getAdvocates());
  const [showBookModal, setShowBookModal] = useState(false);
  const [showSentModal, setShowSentModal] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  // Sync theme changes
  useEffect(() => {
    const handleTheme = (e) => setTheme(e?.detail || getTheme());
    window.addEventListener("law4u_theme_change", handleTheme);
    return () => window.removeEventListener("law4u_theme_change", handleTheme);
  }, []);

  // Sync language changes
  useEffect(() => {
    const handleLang = (e) => {
      const newL = e?.detail || localStorage.getItem("law4u_language") || localStorage.getItem("law4u_home_lang") || "en";
      setLang(newL);
    };
    window.addEventListener("law4u_lang_change", handleLang);
    window.addEventListener("storage", handleLang);
    return () => {
      window.removeEventListener("law4u_lang_change", handleLang);
      window.removeEventListener("storage", handleLang);
    };
  }, []);

  const handleLangToggle = (selectedLang) => {
    setLang(selectedLang);
    try {
      localStorage.setItem("law4u_language", selectedLang);
      localStorage.setItem("law4u_home_lang", selectedLang);
      window.dispatchEvent(new CustomEvent("law4u_lang_change", { detail: selectedLang }));
    } catch {}
  };

  const handleThemeToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  // Sync advocates from store & API
  useEffect(() => {
    loadAdvocates().catch(() => {});
    const handleAdvocates = () => setAdvocates(getAdvocates());
    window.addEventListener("law4u_advocates_updated", handleAdvocates);
    return () => window.removeEventListener("law4u_advocates_updated", handleAdvocates);
  }, []);

  // Auto-open book modal if query param is set
  useEffect(() => {
    if (searchParams.get("book") === "true") {
      setShowBookModal(true);
    }
  }, [searchParams]);

  // Find requested advocate
  const targetId = id || "1";
  const emailParam = searchParams.get("email");

  const rawAdvocate = useMemo(() => {
    if (emailParam) {
      const found = advocates.find((a) => String(a.email).toLowerCase() === emailParam.toLowerCase());
      if (found) return found;
    }
    const foundById = advocates.find((a) => String(a.id) === String(targetId));
    if (foundById) return foundById;
    return advocates[0] || null;
  }, [advocates, targetId, emailParam]);

  // Normalize details so every profile looks rich, executive and complete
  const advocate = useMemo(() => {
    if (!rawAdvocate) return null;
    const isId1 = String(rawAdvocate.id) === "1";

    const name = rawAdvocate.name.startsWith("Adv.") ? rawAdvocate.name : `Adv. ${rawAdvocate.name}`;
    const city = rawAdvocate.city || "Bengaluru";
    const practiceArea = rawAdvocate.practiceArea || rawAdvocate.speciality || "Criminal & Civil Law";
    const speciality = rawAdvocate.speciality || rawAdvocate.practiceArea || "Criminal Defense & Trial Advocacy";
    const experience = rawAdvocate.experience && rawAdvocate.experience !== "0" ? rawAdvocate.experience : (isId1 ? "12 Years" : "8+ Years");
    const rating = rawAdvocate.rating && Number(rawAdvocate.rating) > 0 ? rawAdvocate.rating : 4.9;
    const cases = rawAdvocate.cases && Number(rawAdvocate.cases) > 0 ? rawAdvocate.cases : 280;

    const court = rawAdvocate.court || (rawAdvocate.district ? `${rawAdvocate.district} District & Sessions Court` : `High Court of Karnataka, ${city}`);
    const courtLevel = rawAdvocate.courtLevel || (court.includes("High Court") ? "High Court" : "District & Sessions Court");
    const district = rawAdvocate.district || city;
    const taluk = rawAdvocate.taluk || city;
    const barCouncil = rawAdvocate.barCouncil || "Bar Council of Karnataka";
    const barId = rawAdvocate.barId || `KAR/${1400 + Number(rawAdvocate.id || 1)}/2016`;

    const languages = (rawAdvocate.languages && rawAdvocate.languages.length > 0)
      ? rawAdvocate.languages
      : ["English", "Kannada", "Hindi"];

    let bio = rawAdvocate.bio;
    if (!bio || bio.length < 25 || bio.toLowerCase().includes("hi this is") || bio.toLowerCase() === "hi") {
      bio = `${name} is a distinguished advocate practicing primarily before the ${court}. With comprehensive specialization in ${speciality}, ${name.replace(/^Adv\.\s*/i, "")} provides strategic litigation counsel, bail representation, and discrete advisory solutions with unwavering dedication to justice.`;
    }

    const practiceAreasList = (rawAdvocate.practiceAreas && rawAdvocate.practiceAreas.length > 0)
      ? rawAdvocate.practiceAreas
      : speciality.split(/[,&/]/).map((s) => s.trim()).filter(Boolean);

    return {
      ...rawAdvocate,
      name,
      city,
      practiceArea,
      speciality,
      experience,
      rating,
      cases,
      court,
      courtLevel,
      district,
      taluk,
      barCouncil,
      barId,
      languages,
      bio,
      practiceAreasList: practiceAreasList.length > 0 ? practiceAreasList : [practiceArea],
    };
  }, [rawAdvocate]);

  const otherAdvocates = useMemo(() => {
    return (advocates || [])
      .filter((a) => a.status === "approved" && String(a.id) !== String(advocate?.id))
      .slice(0, 3);
  }, [advocates, advocate]);

  const handleChatNow = (targetAdvocate) => {
    const target = targetAdvocate || advocate;
    const cid = Number(
      localStorage.getItem("law4u_client_id") || sessionStorage.getItem("law4u_client_id") || 0
    );
    if (cid && target?.id) {
      sessionStorage.setItem(`law4u_active_chat_${cid}`, String(target.id));
      localStorage.setItem(`law4u_active_chat_${cid}`, String(target.id));
      navigate(`/client-dashboard?advocateId=${target.id}`);
    } else if (target?.id) {
      navigate(`/client-login?redirect=/client-dashboard?advocateId=${target.id}`);
    } else {
      navigate("/client-login");
    }
  };

  if (!advocate) {
    return (
      <div className={`lw-profile-page ${theme === "dark" ? "lw-dark fl-dark" : "lw-light fl-light"}`}>
        <div className="lw-profile-container">
          <div className="lw-empty-profile-card">
            <h2>{t.notFoundTitle}</h2>
            <p>{t.notFoundDesc}</p>
            <button type="button" className="lw-btn-primary" onClick={() => navigate("/find-lawyer")}>
              {t.backToDirectory}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`lw-profile-page ${theme === "dark" ? "lw-dark fl-dark" : "lw-light fl-light"}`}>
      <div className="lw-profile-container">

        {/* Navigation Breadcrumb Bar with Language & Theme Toggles */}
        <div className="lw-profile-nav-bar">
          <button type="button" className="lw-nav-back-btn" onClick={() => navigate("/find-lawyer")}>
            {t.backToDirectory}
          </button>

          <div className="lw-nav-controls">
            {/* Language Switcher Pill */}
            <div className="lw-lang-pill-wrap" title="Switch Language / ಭಾಷೆ ಬದಲಿಸಿ">
              <button
                type="button"
                className={`lw-lang-pill-btn ${lang === "en" ? "active" : ""}`}
                onClick={() => handleLangToggle("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={`lw-lang-pill-btn ${lang === "kn" ? "active" : ""}`}
                onClick={() => handleLangToggle("kn")}
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              className="lw-theme-toggle-btn"
              onClick={handleThemeToggle}
              title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {theme === "dark" ? "☀️ " + t.themeLight : "🌙 " + t.themeDark}
            </button>

            {/* Profile ID */}
            <div className="lw-profile-id-tag">
              <span className="lw-badge-dot" /> {t.profileId}: #{advocate.id}
            </div>

            {/* Share Profile */}
            <button
              type="button"
              className="lw-share-btn"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert(t.copiedLink);
                }
              }}
              title="Copy profile link"
            >
              {t.shareProfile}
            </button>
          </div>
        </div>

        {/* Executive Hero Banner Card */}
        <div className="lw-profile-hero-card">
          <div className="lw-hero-top">
            <div className="lw-hero-top-badges">
              <span className="lw-trust-badge">
                <span className="lw-badge-check">✓</span> {t.verifiedBarMember}
              </span>
              {advocate.court && (
                <span className="lw-hero-court-chip" title={advocate.court}>
                  🏛️ {advocate.court}
                </span>
              )}
            </div>
            <span className="lw-status-indicator">
              <span className="lw-status-pulse" /> {t.availableForConsult}
            </span>
          </div>

          <div className="lw-hero-main">
            {/* Avatar with Status Ring */}
            <div className="lw-avatar-container">
              <div className="lw-avatar-ring">
                {advocate.avatar && !avatarFailed ? (
                  <img
                    src={assetUrl(advocate.avatar)}
                    alt={advocate.name}
                    className="lw-avatar-img"
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <div className="lw-avatar-fallback">
                    {getInitials(advocate.name)}
                  </div>
                )}
              </div>
              <span className="lw-hero-online-dot" />
            </div>

            {/* Advocate Key Titles */}
            <div className="lw-hero-info">
              <div className="lw-name-row">
                <h1 className="lw-advocate-name">{advocate.name}</h1>
                <span className="lw-verified-mark" title="Bar Council Verified">✓</span>
              </div>

              <div className="lw-advocate-spec-headline">
                {advocate.speciality}
              </div>

              <div className="lw-hero-tags">
                <span className="lw-hero-tag">
                  📍 {advocate.city}, Karnataka
                </span>
                <span className="lw-hero-tag">
                  ⏳ {advocate.experience}
                </span>
                <span className="lw-hero-tag">
                  ⚖️ {advocate.barId}
                </span>
              </div>
            </div>

            {/* Quick Hero Dual Action Box */}
            <div className="lw-hero-action-box">
              <button
                type="button"
                className="lw-hero-chat-btn"
                onClick={() => handleChatNow(advocate)}
              >
                <span>💬</span>
                <span>{isKn ? "ಈಗಲೇ ಚಾಟ್ ಮಾಡಿ" : "Chat Now"}</span>
              </button>
              <button
                type="button"
                className="lw-hero-consult-btn"
                onClick={() => setShowBookModal(true)}
              >
                <span>📅</span>
                <span>{t.bookAppointment}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4-Stat High Performance Matrix */}
        <div className="lw-stats-matrix">
          <div className="lw-matrix-card">
            <span className="lw-matrix-icon">⭐</span>
            <div>
              <div className="lw-matrix-val">{advocate.rating} / 5.0</div>
              <div className="lw-matrix-sub">{t.verifiedClientRating}</div>
            </div>
          </div>

          <div className="lw-matrix-card">
            <span className="lw-matrix-icon">💼</span>
            <div>
              <div className="lw-matrix-val">{advocate.cases}{t.casesUnit}</div>
              <div className="lw-matrix-sub">{t.casesWon}</div>
            </div>
          </div>

          <div className="lw-matrix-card">
            <span className="lw-matrix-icon">⏳</span>
            <div>
              <div className="lw-matrix-val">{advocate.experience}</div>
              <div className="lw-matrix-sub">{t.courtPractice}</div>
            </div>
          </div>

          <div className="lw-matrix-card">
            <span className="lw-matrix-icon">🛡️</span>
            <div>
              <div className="lw-matrix-val">{advocate.barId}</div>
              <div className="lw-matrix-sub">{advocate.barCouncil}</div>
            </div>
          </div>
        </div>

        {/* Two-Column Profile Content Layout */}
        <div className="lw-profile-columns">
          {/* Main Left Column */}
          <div className="lw-profile-main-col">
            {/* About / Biography Section */}
            <div className="lw-profile-card-section">
              <div className="lw-section-header">
                <h2 className="lw-section-title">
                  <span className="lw-title-icon">📜</span> {t.bioTitle}
                </h2>
              </div>
              <p className="lw-bio-text">{advocate.bio}</p>
              
              <div className="lw-bio-highlights">
                <div className="lw-bio-check-item">
                  ✓ {t.registeredWith} {advocate.barCouncil}
                </div>
                <div className="lw-bio-check-item">
                  ✓ {t.practiceAuth} {advocate.courtLevel} {t.andSubordinate}
                </div>
                <div className="lw-bio-check-item">
                  ✓ {t.privilegeStd}
                </div>
              </div>
            </div>

            {/* Practice Areas Section */}
            <div className="lw-profile-card-section">
              <div className="lw-section-header">
                <h2 className="lw-section-title">
                  <span className="lw-title-icon">⚖️</span> {t.practiceAreasTitle}
                </h2>
              </div>
              <div className="lw-practice-chips-grid">
                {advocate.practiceAreasList.map((area, idx) => (
                  <div key={idx} className="lw-practice-pill">
                    <span className="lw-practice-pill-icon">⚖️</span>
                    <span className="lw-practice-pill-text">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Court Jurisdiction Section */}
            <div className="lw-profile-card-section">
              <div className="lw-section-header">
                <h2 className="lw-section-title">
                  <span className="lw-title-icon">🏛️</span> {t.jurisdictionTitle}
                </h2>
              </div>
              <div className="lw-jurisdiction-grid">
                <div className="lw-jurisdiction-item">
                  <span className="lw-j-label">{t.primaryCourt}</span>
                  <strong className="lw-j-val">{advocate.court}</strong>
                </div>
                <div className="lw-jurisdiction-item">
                  <span className="lw-j-label">{t.courtLevel}</span>
                  <strong className="lw-j-val">{advocate.courtLevel}</strong>
                </div>
                <div className="lw-jurisdiction-item">
                  <span className="lw-j-label">{t.barCouncil}</span>
                  <strong className="lw-j-val">{advocate.barCouncil}</strong>
                </div>
                <div className="lw-jurisdiction-item">
                  <span className="lw-j-label">{t.barRegNo}</span>
                  <strong className="lw-j-val">{advocate.barId}</strong>
                </div>
                <div className="lw-jurisdiction-item">
                  <span className="lw-j-label">{t.districtJurisdiction}</span>
                  <strong className="lw-j-val">{advocate.district}</strong>
                </div>
                <div className="lw-jurisdiction-item">
                  <span className="lw-j-label">{t.taluk}</span>
                  <strong className="lw-j-val">{advocate.taluk}</strong>
                </div>
              </div>
            </div>

            {/* Languages Spoken */}
            <div className="lw-profile-card-section">
              <div className="lw-section-header">
                <h2 className="lw-section-title">
                  <span className="lw-title-icon">🗣️</span> {t.languagesTitle}
                </h2>
              </div>
              <div className="lw-lang-pills">
                {advocate.languages.map((l, idx) => (
                  <span key={idx} className="lw-lang-pill">
                    🗣️ {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sticky Sidebar */}
          <div className="lw-profile-sidebar-col">
            <div className="lw-sidebar-sticky-card">
              <div className="lw-sidebar-price-header">
                <span className="lw-price-tag-sub">{t.legalConsultation}</span>
                <div className="lw-sidebar-consult-title">{t.verifiedAdvocate}</div>
                <span className="lw-price-note">{t.consultSub}</span>
              </div>

              <div className="lw-sidebar-actions">
                <button
                  type="button"
                  className="lw-sidebar-btn-chat"
                  onClick={() => handleChatNow(advocate)}
                >
                  <span>💬</span>
                  <span>{isKn ? "ವಕೀಲರೊಂದಿಗೆ ನೇರ ಚಾಟ್" : "Direct Consultation Chat"}</span>
                </button>

                <button
                  type="button"
                  className="lw-sidebar-btn-book"
                  onClick={() => setShowBookModal(true)}
                >
                  {t.bookConsultationNow}
                </button>
              </div>

              {/* Trust Features */}
              <div className="lw-sidebar-guarantees">
                <div className="lw-guarantee-row">
                  <span className="lw-g-icon">🛡️</span>
                  <div>
                    <strong>{t.guaranteeBar}</strong>
                    <p>{t.guaranteeBarDesc}</p>
                  </div>
                </div>

                <div className="lw-guarantee-row">
                  <span className="lw-g-icon">🔒</span>
                  <div>
                    <strong>{t.guaranteePriv}</strong>
                    <p>{t.guaranteePrivDesc}</p>
                  </div>
                </div>

                <div className="lw-guarantee-row">
                  <span className="lw-g-icon">⚡</span>
                  <div>
                    <strong>{t.guaranteeSpeed}</strong>
                    <p>{t.guaranteeSpeedDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explore More Verified Advocates in Karnataka */}
        {otherAdvocates.length > 0 && (
          <section className="lw-more-advocates-section">
            <div className="lw-more-advocates-header">
              <h2 className="lw-more-advocates-title">
                {t.moreAdvocatesTitle}
              </h2>
              <p className="lw-more-advocates-sub">
                {t.moreAdvocatesSub}
              </p>
            </div>

            <div className="lw-more-advocates-grid">
              {otherAdvocates.map((other) => {
                const specColor = PRACTICE_THEMES[other.speciality] || PRACTICE_THEMES[other.practiceArea] || {
                  bg: "#eff6ff",
                  color: "#2563eb",
                  border: "#bfdbfe",
                };

                return (
                  <article key={other.id} className="fl-card">
                    <div className="fl-card-topbar">
                      <span className="fl-verified-badge">
                        <span className="fl-badge-check">✓</span>
                        <span>{isKn ? "ಬಾರ್ ಪರಿಶೀಲಿತ" : "Verified Bar Member"}</span>
                      </span>
                      {other.court && (
                        <span className="fl-court-badge" title={other.court}>
                          🏛️ {other.court.length > 22 ? other.court.slice(0, 20) + "…" : other.court}
                        </span>
                      )}
                    </div>

                    <div className="fl-card-header">
                      <div className="fl-card-avatar" style={{ background: getAvatarColor(other.name) }}>
                        {other.avatar ? (
                          <img src={assetUrl(other.avatar)} alt={other.name} className="fl-avatar-img" />
                        ) : (
                          getInitials(other.name)
                        )}
                        <span className="fl-online-pulse" />
                      </div>
                      <div className="fl-card-info">
                        <h3
                          className="fl-adv-name"
                          onClick={() => {
                            navigate(`/profile/${other.id}`);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          {other.name}
                        </h3>
                        <div
                          className="fl-adv-speciality"
                          style={{
                            background: specColor.bg,
                            color: specColor.color,
                            borderColor: specColor.border,
                          }}
                        >
                          {other.speciality || other.practiceArea || "Legal Counsel"}
                        </div>
                        <div className="fl-adv-location">
                          <span>📍 {other.city || "Karnataka"}</span>
                          {other.experience && <span>• ⏳ {other.experience}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="fl-card-matrix">
                      <div className="fl-matrix-tile">
                        <span className="fl-matrix-label">{isKn ? "ರೇಟಿಂಗ್" : "Rating"}</span>
                        <strong className="fl-matrix-val">⭐ {other.rating || "4.9"}</strong>
                      </div>
                      <div className="fl-matrix-tile">
                        <span className="fl-matrix-label">{isKn ? "ಪ್ರಕರಣಗಳು" : "Cases"}</span>
                        <strong className="fl-matrix-val">💼 {other.cases ? `${other.cases}+` : "120+"}</strong>
                      </div>
                      <div className="fl-matrix-tile">
                        <span className="fl-matrix-label">{isKn ? "ಅನುಭವ" : "Experience"}</span>
                        <strong className="fl-matrix-val">{other.experience || "6+ Yrs"}</strong>
                      </div>
                      <div className="fl-matrix-tile">
                        <span className="fl-matrix-label">{isKn ? "ಸ್ಥಿತಿ" : "Status"}</span>
                        <strong className="fl-matrix-val fl-status-active">
                          {isKn ? "⚡ ಸಕ್ರಿಯ" : "⚡ Available"}
                        </strong>
                      </div>
                    </div>

                    <p className="fl-card-bio">
                      {other.bio
                        ? (other.bio.length > 130 ? other.bio.slice(0, 128) + "…" : other.bio)
                        : `${other.name} is a verified advocate representing clients before ${other.court || "District Courts"}.`}
                    </p>

                    <div className="fl-card-actions">
                      <button
                        type="button"
                        className="fl-btn-chat"
                        onClick={() => handleChatNow(other)}
                      >
                        <span>💬</span>
                        <span>{isKn ? "ಈಗಲೇ ಚಾಟ್ ಮಾಡಿ" : "Chat Now"}</span>
                      </button>
                      <button
                        type="button"
                        className="fl-btn-profile"
                        onClick={() => {
                          navigate(`/profile/${other.id}`);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <span>{isKn ? "ಪ್ರೊಫೈಲ್ ನೋಡಿ" : "Profile"}</span>
                        <span>→</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Book Consultation Modal */}
      {showBookModal && (
        <BookConsultationModal
          advocate={advocate}
          lang={lang}
          onClose={() => setShowBookModal(false)}
          onSent={() => {
            setShowBookModal(false);
            setShowSentModal(true);
          }}
        />
      )}

      {/* Request Sent Confirmation Modal */}
      {showSentModal && (
        <RequestSentModal
          advocate={advocate}
          lang={lang}
          onClose={() => setShowSentModal(false)}
        />
      )}
    </div>
  );
}