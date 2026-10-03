// ============================================================
//  Contact.js — Advocates Hub "Contact Us" Portal
//  Features:
//    • Full Dark & White Theme Management (ThemeStore Sync)
//    • Bilingual English / Kannada Real-Time Synchronization
//    • 4 Working One-Tap Action Cards (Call, WhatsApp, Email, Office)
//    • Interactive Contact Inquiry Form with Validation & Store Sync
//    • Interactive FAQ Accordion
// ============================================================

import React, { useState, useEffect } from "react";
import { addMessage } from "../data/MessageStore";
import { getTheme } from "../data/themeStore";
import "./Contact.css";

// ── Contact Information Cards (1-Tap Direct Working Links) ──
const CONTACT_CARDS = [
  {
    icon: "📞",
    type: "phone",
    labelEn: "Direct Phone Line",
    labelKn: "ನೇರ ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
    value: "+91 91087 17353",
    actionTextEn: "Call Now →",
    actionTextKn: "ಕರೆ ಮಾಡಿ →",
    href: "tel:+919108717353",
    hintEn: "Mon–Sat, 9:00 AM – 7:00 PM IST",
    hintKn: "ಸೋಮವಾರ–ಶನಿವಾರ, ಬೆಳಿಗ್ಗೆ 9 ರಿಂದ ಸಂಜೆ 7"
  },
  {
    icon: "💬",
    type: "whatsapp",
    labelEn: "Official WhatsApp",
    labelKn: "ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್",
    value: "+91 91087 17353",
    actionTextEn: "Chat on WhatsApp →",
    actionTextKn: "ವಾಟ್ಸಾಪ್ ಸಂದೇಶ →",
    href: "https://wa.me/919108717353?text=Hello%20Advocates%20Hub%20Support,%20I%20have%20an%20inquiry.",
    hintEn: "Instant reply for urgent inquiries",
    hintKn: "ತ್ವರಿತ ಸಂದೇಶ ಪ್ರತಿಕ್ರಿಯೆ"
  },
  {
    icon: "✉️",
    type: "email",
    labelEn: "Official Email",
    labelKn: "ಅಧಿಕೃತ ಇಮೇಲ್",
    value: "advocatehub.in@gmail.com",
    actionTextEn: "Send Email →",
    actionTextKn: "ಇಮೇಲ್ ಕಳುಹಿಸಿ →",
    href: "mailto:advocatehub.in@gmail.com",
    hintEn: "We respond within 24 hours",
    hintKn: "24 ಗಂಟೆಗಳಲ್ಲಿ ಪ್ರತಿಕ್ರಿಯೆ"
  },
  {
    icon: "📸",
    type: "instagram",
    labelEn: "Official Instagram",
    labelKn: "ಅಧಿಕೃತ ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್",
    value: "@advocate__hub",
    actionTextEn: "Follow on Instagram →",
    actionTextKn: "ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್ ನೋಡಿ →",
    href: "https://www.instagram.com/advocate__hub/",
    hintEn: "Legal updates & awareness",
    hintKn: "ದೈನಂದಿನ ಕಾನೂನು ಅಪ್‌ಡೇಟ್‌ಗಳು"
  },
  {
    icon: "📍",
    type: "office",
    labelEn: "Head Office",
    labelKn: "ಪ್ರಧಾನ ಕಚೇರಿ",
    value: "Bengaluru & Gokak, Karnataka",
    actionTextEn: "View on Map →",
    actionTextKn: "ವಿಳಾಸ ವಿವರ →",
    href: "https://maps.google.com/?q=Bengaluru,Karnataka,India",
    hintEn: "In-Chamber visits by prior appointment",
    hintKn: "ಮುಂಚಿತ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಮೂಲಕ ಭೇಟಿ"
  }
];

// ── Frequently Asked Questions ──
const FAQS = [
  {
    qEn: "How do I find and consult a verified advocate near me?",
    qKn: "ನನ್ನ ಹತ್ತಿರದ ಪರಿಶೀಲಿತ ವಕೀಲರನ್ನು ಹೇಗೆ ಹುಡುಕುವುದು ಮತ್ತು ಸಂಪರ್ಕಿಸುವುದು?",
    aEn:
      "Navigate to the 'Find An Advocate' directory on Advocates Hub. You can filter practitioners by court jurisdiction (High Court, District Courts), legal domain (Criminal, Civil, Family, Property), and consultation mode (Phone, Video, or In-Chamber).",
    aKn:
      "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನ 'ವಕೀಲರನ್ನು ಹುಡುಕಿ' ಪುಟಕ್ಕೆ ಭೇಟಿ ನೀಡಿ. ನಗರ, ನ್ಯಾಯಾಲಯ ಅಥವಾ ವಿಷಯದ (ಕ್ರಿಮಿನಲ್, ಸಿವಿಲ್, ಆಸ್ತಿ, ಕುಟುಂಬ) ಪ್ರಕಾರ ಸುಲಭವಾಗಿ ಶೋಧಿಸಿ ಮುಂಗಡ ಶುಲ್ಕದೊಂದಿಗೆ ನೇರ ಸಮಾಲೋಚನೆ ನಿಗದಿಪಡಿಸಬಹುದು."
  },
  {
    qEn: "Are my inquiries, case briefs, and consultation details confidential?",
    qKn: "ನನ್ನ ಸಮಾಲೋಚನೆ ವಿವರಗಳು ಮತ್ತು ಸಂದೇಶಗಳು ಗೌಪ್ಯವಾಗಿರುತ್ತವೆಯೇ?",
    aEn:
      "Yes, absolutely. All communications, messages, and document exchanges on Advocates Hub are protected by statutory Attorney-Client Privilege under Section 126 of the Indian Evidence Act and Section 132 of the Bharatiya Sakshya Adhiniyam, secured with 256-bit encryption.",
    aKn:
      "ಖಂಡಿತವಾಗಿ. ವೇದಿಕೆಯಲ್ಲಿನ ಎಲ್ಲಾ ಸಂದೇಶಗಳು, ದಸ್ತಾವೇಜುಗಳು ಮತ್ತು ಸಮಾಲೋಚನೆ ವಿವರಗಳು ಭಾರತೀಯ ಸಾಕ್ಷ್ಯ ಕಾಯ್ದೆಯನ್ವಯ ವಕೀಲ-ಕ್ಲೈಂಟ್ ಗೌಪ್ಯತೆಯಿಂದ ರಕ್ಷಿಸಲ್ಪಟ್ಟಿದ್ದು ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ."
  },
  {
    qEn: "Is registering as a practicing advocate free on Advocates Hub?",
    qKn: "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನಲ್ಲಿ ವಕೀಲರ ನೋಂದಣಿ ಉಚಿತವೇ?",
    aEn:
      "Yes. Joining the Advocates Hub advocate network is free. Every profile undergoes manual verification of State Bar Council enrollment numbers and Certificate of Practice (COP) before going live for public consultations.",
    aKn:
      "ಹೌದು, ವಕೀಲರ ನೋಂದಣಿ ಸಂಪೂರ್ಣ ಉಚಿತವಾಗಿದೆ. ನಿಮ್ಮ ರಾಜ್ಯ ಬಾರ್ ಕೌನ್ಸಿಲ್ ನೋಂದಣಿ ಸಂಖ್ಯೆ ಮತ್ತು ಸಕ್ರಿಯ ಪ್ರಾಕ್ಟಿಸ್ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಪರಿಶೀಲಿಸಿದ ನಂತರವೇ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲಾಗುತ್ತದೆ."
  },
  {
    qEn: "How fast will the support team or advocate respond to my inquiry?",
    qKn: "ನನ್ನ ಸಂದೇಶಕ್ಕೆ ಎಷ್ಟು ಬೇಗ ಪ್ರತಿಕ್ರಿಯೆ ದೊರೆಯುತ್ತದೆ?",
    aEn:
      "Our institutional support desk responds to digital contact submissions within 2 to 4 business hours. For urgent consultation bookings, advocates typically respond within 1 to 2 hours during active court days.",
    aKn:
      "ನಮ್ಮ ಸಹಾಯವಾಣಿ ತಂಡವು 2 ರಿಂದ 4 ಗಂಟೆಗಳಲ್ಲಿ ಇಮೇಲ್ ಮತ್ತು ಸಂದೇಶಗಳಿಗೆ ಉತ್ತರಿಸುತ್ತದೆ. ತುರ್ತು ಸಮಾಲೋಚನೆಗಾಗಿ ನೇರವಾಗಿ ವಾಟ್ಸಾಪ್ ಅಥವಾ ಫೋನ್ ಲೈನ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಬಹುದು."
  }
];

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export default function Contact() {
  // Theme state synchronized with global themeStore
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    const handleThemeChange = (e) => {
      setTheme(e?.detail || getTheme());
    };
    window.addEventListener("law4u_theme_change", handleThemeChange);
    return () => window.removeEventListener("law4u_theme_change", handleThemeChange);
  }, []);

  // Language state synchronized with navbar
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("law4u_home_lang") || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    const handleLangChange = (e) => {
      if (e?.detail) setLang(e.detail);
      else {
        try {
          setLang(localStorage.getItem("law4u_home_lang") || "en");
        } catch {}
      }
    };
    window.addEventListener("law4u_lang_change", handleLangChange);
    return () => window.removeEventListener("law4u_lang_change", handleLangChange);
  }, []);

  const isKn = lang === "kn";

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [err, setErr] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  // Active FAQ index
  const [openFaq, setOpenFaq] = useState(0);

  const setF = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErr((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) {
      e.name = isKn ? "ಹೆಸರನ್ನು ನಮೂದಿಸಿ" : "Full name is required";
    }
    if (!form.email.trim()) {
      e.email = isKn ? "ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ" : "Email address is required";
    } else if (!isValidEmail(form.email)) {
      e.email = isKn ? "ಮಾನ್ಯವಾದ ಇಮೇಲ್ ನಮೂದಿಸಿ" : "Please enter a valid email address";
    }
    if (form.phone.trim() && !/^\d{10}$/.test(form.phone.trim().replace(/\D/g, ""))) {
      e.phone = isKn ? "10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ" : "Please enter a 10-digit mobile number";
    }
    if (!form.message.trim()) {
      e.message = isKn ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಬರೆಯಿರಿ" : "Please write your inquiry message";
    }
    setErr(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);

    setTimeout(() => {
      // Persist submission into message store (localStorage)
      addMessage({
        type: "contact",
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        subject: form.subject.trim() || (isKn ? "ಸಾಮಾನ್ಯ ವಿಚಾರಣೆ" : "General Inquiry"),
        message: form.message.trim()
      });

      setSending(false);
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 600);
  };

  return (
    <div className={`ct-page ${theme === "dark" ? "ct-dark" : "ct-light"}`}>
      {/* ── 1. Prestigious Hero Header ── */}
      <header className="ct-hero">
        <div className="ct-hero-glow"></div>
        <div className="ct-hero-container">
          <div className="ct-hero-badge">
            <span className="ct-hero-beacon"></span>
            <span>{isKn ? "📩 ಅಧಿಕೃತ ಸಂಪರ್ಕ ಕೇಂದ್ರ" : "📩 ADVOCATES HUB • OFFICIAL CONNECT DESK"}</span>
          </div>

          <h1 className="ct-hero-title">
            {isKn ? (
              <>
                ನಿಮ್ಮ ಕಾನೂನು ಪ್ರಶ್ನೆಗಳಿಗೆ{" "}
                <span className="ct-text-gradient">ವಿಶ್ವಾಸಾರ್ಹ ಪರಿಹಾರ</span>
              </>
            ) : (
              <>
                Connect Directly with Our{" "}
                <span className="ct-text-gradient">Legal Support Desk</span>
              </>
            )}
          </h1>

          <p className="ct-hero-sub">
            {isKn
              ? "ವಕೀಲರ ಸಮಾಲೋಚನೆ, ದಸ್ತಾವೇಜುಗಳ ರಚನೆ ಅಥವಾ ಸಾಂಸ್ಥಿಕ ಸಹಭಾಗಿತ್ವದ ಕುರಿತು ಯಾವುದೇ ಸಹಾಯಕ್ಕೆ ನಮ್ಮ ತಂಡ ಸದಾ ಲಭ್ಯವಿದೆ."
              : "Questions about finding an advocate, legal drafting, or partnership — our compliance and operations team is here to assist."}
          </p>
        </div>
      </header>

      {/* ── 2. Main Content Container ── */}
      <main className="ct-container">
        {/* 4 Direct Working Action Cards */}
        <div className="ct-info-grid">
          {CONTACT_CARDS.map((card, idx) => (
            <div key={idx} className={`ct-info-card card-${card.type}`}>
              <div className="ct-info-top">
                <span className="ct-info-icon">{card.icon}</span>
                <span className="ct-info-label">{isKn ? card.labelKn : card.labelEn}</span>
              </div>
              <div className="ct-info-value">{card.value}</div>
              <div className="ct-info-hint">{isKn ? card.hintKn : card.hintEn}</div>
              <div className="ct-info-action-wrap">
                <a
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noreferrer" : undefined}
                  className="ct-info-action-btn"
                >
                  {isKn ? card.actionTextKn : card.actionTextEn}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 2-Column Split: Contact Form + FAQs */}
        <div className="ct-body-grid">
          {/* Left Column: Interactive Contact Form */}
          <section className="ct-form-card">
            {sent ? (
              <div className="ct-sent">
                <div className="ct-sent-icon">✅</div>
                <h3 className="ct-sent-title">
                  {isKn ? "ಸಂದೇಶ ಯಶಸ್ವಿಯಾಗಿ ತಲುಪಿದೆ!" : "Inquiry Submitted Successfully!"}
                </h3>
                <p className="ct-sent-desc">
                  {isKn
                    ? "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ನಮ್ಮ ಪರಿಶೀಲನಾ ತಂಡವು ಸ್ವೀಕರಿಸಿದೆ. ಶೀಘ್ರದಲ್ಲೇ ನಮ್ಮ ಅಧಿಕಾರಿಗಳು ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತಾರೆ."
                    : "Thank you for reaching out. Our support desk has logged your inquiry and an executive will contact you shortly."}
                </p>
                <button
                  type="button"
                  className="ct-btn-primary ct-btn-sent-reset"
                  onClick={() => setSent(false)}
                >
                  {isKn ? "ಮತ್ತೊಂದು ಸಂದೇಶ ಕಳುಹಿಸಿ ↺" : "Send Another Message ↺"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="ct-form-header">
                  <h2 className="ct-form-title">
                    {isKn ? "ನಮಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ" : "Send Us a Direct Message"}
                  </h2>
                  <p className="ct-form-sub">
                    {isKn
                      ? "ಕೆಳಗಿನ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ, ನಮ್ಮ ತಂಡವು 24 ಗಂಟೆಗಳಲ್ಲಿ ಮರುಸಂಪರ್ಕಿಸುತ್ತದೆ."
                      : "Fill out the fields below and our institutional support desk will reply promptly."}
                  </p>
                </div>

                <div className="ct-grid-2">
                  <div className="ct-field">
                    <label>
                      {isKn ? "ಪೂರ್ಣ ಹೆಸರು *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setF("name", e.target.value)}
                      placeholder={isKn ? "ನಿಮ್ಮ ಹೆಸರು" : "e.g. Ramesh Kumar"}
                      disabled={sending}
                      className={err.name ? "has-err" : ""}
                    />
                    {err.name && <p className="ct-err">⚠ {err.name}</p>}
                  </div>

                  <div className="ct-field">
                    <label>
                      {isKn ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setF("phone", e.target.value)}
                      maxLength={10}
                      placeholder={isKn ? "10 ಅಂಕಿಯ ಸಂಖ್ಯೆ" : "10-digit mobile number"}
                      disabled={sending}
                      className={err.phone ? "has-err" : ""}
                    />
                    {err.phone && <p className="ct-err">⚠ {err.phone}</p>}
                  </div>
                </div>

                <div className="ct-field">
                  <label>
                    {isKn ? "ಇಮೇಲ್ ವಿಳಾಸ *" : "Official Email Address *"}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setF("email", e.target.value)}
                    placeholder={isKn ? "name@example.com" : "name@example.com"}
                    disabled={sending}
                    className={err.email ? "has-err" : ""}
                  />
                  {err.email && <p className="ct-err">⚠ {err.email}</p>}
                </div>

                <div className="ct-field">
                  <label>
                    {isKn ? "ವಿಷಯ / ವಿಚಾರಣೆ ವಿಧ" : "Inquiry Subject / Topic"}
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setF("subject", e.target.value)}
                    placeholder={
                      isKn
                        ? "ಉದಾ: ವಕೀಲರ ಸಮಾಲೋಚನೆ ಅಥವಾ ದಸ್ತಾವೇಜು ನೆರವು"
                        : "e.g. Consultation Booking, Document Drafting, or Advocate Join"
                    }
                    disabled={sending}
                  />
                </div>

                <div className="ct-field">
                  <label>
                    {isKn ? "ಸಂದೇಶ ವಿವರಗಳು *" : "Inquiry Message & Details *"}
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setF("message", e.target.value)}
                    placeholder={
                      isKn
                        ? "ನಿಮ್ಮ ಪ್ರಕರಣ ಅಥವಾ ಪ್ರಶ್ನೆಯ ವಿವರಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
                        : "Describe your legal matter, court jurisdiction, or specific inquiry..."
                    }
                    disabled={sending}
                    className={err.message ? "has-err" : ""}
                  />
                  {err.message && <p className="ct-err">⚠ {err.message}</p>}
                </div>

                <button
                  type="submit"
                  className="ct-btn-primary ct-btn-lg"
                  disabled={sending}
                >
                  {sending
                    ? (isKn ? "ಸಂದೇಶ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ..." : "Submitting Inquiry...")
                    : (isKn ? "ಸಂದೇಶ ಕಳುಹಿಸಿ →" : "Send Inquiry Message →")}
                </button>
              </form>
            )}
          </section>

          {/* Right Column: Frequently Asked Questions */}
          <section className="ct-faq-card">
            <div className="ct-faq-card-header">
              <span className="ct-faq-badge">{isKn ? "ಸ್ಪಷ್ಟತೆ" : "QUICK ANSWERS"}</span>
              <h2 className="ct-form-title">
                {isKn ? "ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು" : "Frequently Asked Questions"}
              </h2>
              <p className="ct-form-sub">
                {isKn
                  ? "ನಮ್ಮ ಸೇವೆಗಳು ಮತ್ತು ವಕೀಲರ ಸಂಪರ್ಕದ ಕುರಿತು ತ್ವರಿತ ಉತ್ತರಗಳು."
                  : "Common queries regarding advocate consultations, confidentiality, and platform operations."}
              </p>
            </div>

            <div className="ct-faq-list">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={`ct-faq-item ${isOpen ? "open" : ""}`}>
                    <button
                      type="button"
                      className="ct-faq-q"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="ct-faq-q-text">
                        {isKn ? faq.qKn : faq.qEn}
                      </span>
                      <span className="ct-faq-arrow">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="ct-faq-a">
                        <p>{isKn ? faq.aKn : faq.aEn}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Trust Verification Box */}
            <div className="ct-trust-box">
              <span className="ct-trust-icon">🛡️</span>
              <div className="ct-trust-text">
                <strong>{isKn ? "ಶಾಸನಬದ್ಧ ಕ್ಲೈಂಟ್ ಗೌಪ್ಯತೆ" : "Statutory Attorney-Client Privilege"}</strong>
                <p>
                  {isKn
                    ? "ಎಲ್ಲಾ ಸಂದೇಶಗಳು ಮತ್ತು ಪ್ರಕರಣದ ವಿವರಗಳು ಭಾರತೀಯ ಸಾಕ್ಷ್ಯ ಕಾಯ್ದೆಯ ಅಡಿಯಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ."
                    : "Inquiries and consultations are safeguarded under Section 132 of the Bharatiya Sakshya Adhiniyam."}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ── Official Company Channels Strip ── */}
        <section className="ct-company-strip">
          <div className="ct-company-strip-left">
            <span className="ct-company-strip-seal">⚖️</span>
            <div>
              <h3 className="ct-company-strip-title">
                {isKn ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ • ಅಧಿಕೃತ ಸಂಪರ್ಕ ಕೇಂದ್ರ" : "ADVOCATES HUB • OFFICIAL CONNECT DESK"}
              </h3>
              <p className="ct-company-strip-desc">
                {isKn
                  ? "ನಮ್ಮ ಅಧಿಕೃತ ಇಮೇಲ್ ಮತ್ತು ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್ ಖಾತೆಯ ಮೂಲಕ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ."
                  : "Reach out via our company inbox or follow our official Instagram handle for legal insights."}
              </p>
            </div>
          </div>
          <div className="ct-company-strip-links">
            <a
              href="mailto:advocatehub.in@gmail.com"
              className="ct-company-badge-link"
              title="Official Company Email"
            >
              <span className="ct-cbl-icon">✉️</span>
              <div className="ct-cbl-meta">
                <span className="ct-cbl-sub">{isKn ? "ಅಧಿಕೃತ ಇಮೇಲ್" : "Official Company Email"}</span>
                <strong className="ct-cbl-val">advocatehub.in@gmail.com</strong>
              </div>
            </a>
            <a
              href="https://www.instagram.com/advocate__hub/"
              target="_blank"
              rel="noopener noreferrer"
              className="ct-company-badge-link ct-cbl-insta"
              title="Official Instagram @advocate__hub"
            >
              <span className="ct-cbl-icon">📸</span>
              <div className="ct-cbl-meta">
                <span className="ct-cbl-sub">{isKn ? "ಅಧಿಕೃತ ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್" : "Official Instagram"}</span>
                <strong className="ct-cbl-val">@advocate__hub</strong>
              </div>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}