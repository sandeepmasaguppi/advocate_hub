// ============================================================
//  Askquestion.js — Ask a Legal Question to Verified Advocates
//  Part of the 4 Legal Sections:
//    1. Ask a Question  2. Legal Documents  3. Bare Acts  4. Legal News
//  Supports White & Dark Themes with English & Kannada translations
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTheme } from "../data/themeStore";
import { getAdvocates } from "../data/Advocatesstore";
import { addQuestion } from "../data/QuestionStore";
import "./Askquestion.css";

export const CATEGORIES_EN = [
  { id: "family",     icon: "👨‍👩‍👧", label: "Family Law",      sub: "Divorce, custody, maintenance" },
  { id: "criminal",   icon: "🔒",      label: "Criminal Law",    sub: "FIR, bail, arrest, POCSO" },
  { id: "property",   icon: "🏠",      label: "Property Law",    sub: "Dispute, title, RERA" },
  { id: "civil",      icon: "⚖️",      label: "Civil Law",       sub: "Suits, injunction, recovery" },
  { id: "corporate",  icon: "🏢",      label: "Corporate Law",   sub: "Company, compliance, GST" },
  { id: "tax",        icon: "💰",      label: "Tax Law",         sub: "Income tax, GST, returns" },
  { id: "labour",     icon: "👷",      label: "Labour Law",      sub: "Termination, PF, ESIC" },
  { id: "consumer",   icon: "📦",      label: "Consumer Law",    sub: "Refund, product, e-commerce" },
  { id: "cyber",      icon: "💻",      label: "Cyber Law",       sub: "Online fraud, IT Act" },
  { id: "immigration",icon: "✈️",      label: "Immigration",     sub: "Visa, OCI, citizenship" },
  { id: "banking",    icon: "🏦",      label: "Banking Law",     sub: "SARFAESI, DRT, fraud" },
  { id: "other",      icon: "📋",      label: "Other Matters",   sub: "Any other legal issue" },
];

export const CATEGORIES = CATEGORIES_EN;

export const CATEGORIES_KN = [
  { id: "family",     icon: "👨‍👩‍👧", label: "ಕೌಟುಂಬಿಕ ಕಾನೂನು",  sub: "ವಿಚ್ಛೇದನ, ಮಗುವಿನ ಪಾಲನೆ, ಜೀವನಾಂಶ" },
  { id: "criminal",   icon: "🔒",      label: "ಕ್ರಿಮಿನಲ್ ಕಾನೂನು",   sub: "ಎಫ್‌ಐಆರ್, ಜಾಮೀನು, ಬಂಧನ, ಪೋಕ್ಸೋ" },
  { id: "property",   icon: "🏠",      label: "ಆಸ್ತಿ ಕಾನೂನು",      sub: "ಆಸ್ತಿ ವಿವಾದ, ಹಕ್ಕುಪತ್ರ, ರೇರಾ" },
  { id: "civil",      icon: "⚖️",      label: "ಸಿವಿಲ್ ಕಾನೂನು",     sub: "ಸಿವಿಲ್ ದಾವೆಗಳು, ತಡೆಯಾಜ್ಞೆ, ವಸೂಲಾತಿ" },
  { id: "corporate",  icon: "🏢",      label: "ಕಾರ್ಪೊರೇಟ್ ಕಾನೂನು", sub: "ಕಂಪನಿ ಕಾಯ್ದೆ, ಜಿಎಸ್‌ಟಿ, ಒಪ್ಪಂದಗಳು" },
  { id: "tax",        icon: "💰",      label: "ತೆರಿಗೆ ಕಾನೂನು",     sub: "ಆದಾಯ ತೆರಿಗೆ, ಜಿಎಸ್‌ಟಿ ರಿಟರ್ನ್ಸ್" },
  { id: "labour",     icon: "👷",      label: "ಕಾರ್ಮಿಕ ಕಾನೂನು",    sub: "ಉದ್ಯೋಗ ವಿವಾದ, ಪಿಎಫ್, ಇಎಸ್‌ಐ" },
  { id: "consumer",   icon: "📦",      label: "ಗ್ರಾಹಕ ಕಾನೂನು",     sub: "ರೀಫಂಡ್, ದೋಷಯುಕ್ತ ಸೇವೆ, ಗ್ರಾಹಕ ವೇದಿಕೆ" },
  { id: "cyber",      icon: "💻",      label: "ಸೈಬರ್ ಕಾನೂನು",      sub: "ಆನ್‌ಲೈನ್ ವಂಚನೆ, ಐಟಿ ಕಾಯ್ದೆ" },
  { id: "immigration",icon: "✈️",      label: "ವಲಸೆ / ಇಮಿಗ್ರೇಷನ್", sub: "ವೀಸಾ, ಓಸಿಐ, ಪಾಸ್‌ಪೋರ್ಟ್" },
  { id: "banking",    icon: "🏦",      label: "ಬ್ಯಾಂಕಿಂಗ್ ಕಾನೂನು",   sub: "ಸರ್ಫೇಸಿ, ಸಾಲ ವಸೂಲಾತಿ, ಚೆಕ್ ಬೌನ್ಸ್" },
  { id: "other",      icon: "📋",      label: "ಇತರ ವಿಷಯಗಳು",       sub: "ಯಾವುದೇ ಇತರ ಕಾನೂನು ಸಮಸ್ಯೆ" },
];

export const RECENT_QUESTIONS = [
  {
    id: 1,
    question: "My landlord is not returning security deposit after 3 months of vacating. What can I do?",
    questionKn: "ಮನೆ ಖಾಲಿ ಮಾಡಿ 3 ತಿಂಗಳಾದರೂ ಮಾಲೀಕರು ಅಡ್ವಾನ್ಸ್ ಹಣ ಮರಳಿಸುತ್ತಿಲ್ಲ. ಕಾನೂನು ಪರಿಹಾರವೇನು?",
    category: "Civil Law",
    categoryKn: "ಸಿವಿಲ್ ಕಾನೂನು",
    answers: 4,
    time: "2 hours ago",
    timeKn: "೨ ಗಂಟೆಗಳ ಹಿಂದೆ",
    avatar: "RK",
    color: "#2563eb",
  },
  {
    id: 2,
    question: "My husband filed for divorce. Do I get custody of my 4-year-old child automatically?",
    questionKn: "ಗಂಡ ವಿಚ್ಛೇದನ ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ್ದಾರೆ. ೪ ವರ್ಷದ ಮಗುವಿನ ಪಾಲನೆ ತಾಯಿಗೆ ಸಿಗುತ್ತದೆಯೇ?",
    category: "Family Law",
    categoryKn: "ಕೌಟುಂಬಿಕ ಕಾನೂನು",
    answers: 6,
    time: "5 hours ago",
    timeKn: "೫ ಗಂಟೆಗಳ ಹಿಂದೆ",
    avatar: "PS",
    color: "#16a34a",
  },
  {
    id: 3,
    question: "A cheque of ₹2 lakh given by my business partner bounced. What is the legal process under Sec 138?",
    questionKn: "ವ್ಯಾಪಾರ ಪಾಲುದಾರ ನೀಡಿದ ₹೨ ಲಕ್ಷದ ಚೆಕ್ ಬೌನ್ಸ್ ಆಗಿದೆ. ಸೆಕ್ಷನ್ 138 ಅಡಿ ಕ್ರಮವೇನು?",
    category: "Civil Law",
    categoryKn: "ಸಿವಿಲ್ ಕಾನೂನು",
    answers: 8,
    time: "Yesterday",
    timeKn: "ನಿನ್ನೆ",
    avatar: "AV",
    color: "#7c3aed",
  },
  {
    id: 4,
    question: "I was falsely accused in a criminal case. How do I apply for anticipatory bail under BNSS/CrPC?",
    questionKn: "ಕ್ರಿಮಿನಲ್ ಪ್ರಕರಣದಲ್ಲಿ ನನ್ನ ವಿರುದ್ಧ ಸುಳ್ಳು ದೂರು ದಾಖಲಾಗಿದೆ. ನಿರೀಕ್ಷಣಾ ಜಾಮೀನು ಪಡೆಯುವುದು ಹೇಗೆ?",
    category: "Criminal Law",
    categoryKn: "ಕ್ರಿಮಿನಲ್ ಕಾನೂನು",
    answers: 5,
    time: "2 days ago",
    timeKn: "೨ ದಿನಗಳ ಹಿಂದೆ",
    avatar: "DR",
    color: "#dc2626",
  },
  {
    id: 5,
    question: "Builder has not delivered flat after 3 years beyond agreement date. Can I file a RERA complaint?",
    questionKn: "೩ ವರ್ಷ ಕಳೆದರೂ ಬಿಲ್ಡರ್ ಫ್ಲಾಟ್ ಹಸ್ತಾಂತರಿಸಿಲ್ಲ. ರೇರಾ (RERA) ದೂರು ದಾಖಲಿಸಬಹುದೇ?",
    category: "Property Law",
    categoryKn: "ಆಸ್ತಿ ಕಾನೂನು",
    answers: 7,
    time: "3 days ago",
    timeKn: "೩ ದಿನಗಳ ಹಿಂದೆ",
    avatar: "SN",
    color: "#ea580c",
  },
];

const getExpertAdvocates = () =>
  getAdvocates()
    .slice(0, 3)
    .map((advocate, index) => ({
      ...advocate,
      spec: advocate.speciality,
      answers: advocate.cases || 140 + index * 25,
      initials: advocate.name
        .replace(/^Adv\.\s*/i, "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
      color: ["#2563eb", "#16a34a", "#7c3aed"][index % 3],
    }));

function Avatar({ initials, color, size = 42, advocate }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color || "#2563eb",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.36,
        fontWeight: 700,
        flexShrink: 0,
        overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.2)",
      }}
    >
      {advocate?.avatar ? (
        <img
          src={advocate.avatar}
          alt={advocate.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        initials
      )}
    </div>
  );
}

export default function AskQuestion() {
  const EXPERT_ADVOCATES = getExpertAdvocates();
  const navigate = useNavigate();

  // Theme Sync
  const [theme, setTheme] = useState(getTheme);
  useEffect(() => {
    const handleTheme = (e) => setTheme(e?.detail || getTheme());
    window.addEventListener("law4u_theme_change", handleTheme);
    return () => window.removeEventListener("law4u_theme_change", handleTheme);
  }, []);

  // Language Sync
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("law4u_home_lang") || "en";
    } catch {
      return "en";
    }
  });

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
    return () => window.removeEventListener("law4u_lang_change", handleLang);
  }, []);

  const isKn = lang === "kn";
  const categoriesList = isKn ? CATEGORIES_KN : CATEGORIES_EN;

  // Form State
  const [step, setStep] = useState(1); // 1=category, 2=question, 3=success
  const [selectedCat, setSelectedCat] = useState(null);
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("ask"); // ask | recent | experts
  const [searchQ, setSearchQ] = useState("");

  const filteredRecent = RECENT_QUESTIONS.filter((q) => {
    const text = isKn ? `${q.questionKn} ${q.categoryKn}` : `${q.question} ${q.category}`;
    return !searchQ || text.toLowerCase().includes(searchQ.toLowerCase());
  });

  const validate = () => {
    const e = {};
    if (!question.trim()) {
      e.question = isKn ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ" : "Please enter your question";
    } else if (question.trim().length < 15) {
      e.question = isKn ? "ಪ್ರಶ್ನೆ ತುಂಬಾ ಚಿಕ್ಕದಾಗಿದೆ (ಕನಿಷ್ಠ ೧೫ ಅಕ್ಷರಗಳು)" : "Question is too short (min 15 chars)";
    }

    if (!description.trim()) {
      e.description = isKn ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ವಿವರವಾಗಿ ಬರೆಯಿರಿ" : "Please describe your issue in detail";
    } else if (description.trim().length < 30) {
      e.description = isKn ? "ವಿವರಣೆ ತುಂಬಾ ಚಿಕ್ಕದಾಗಿದೆ (ಕನಿಷ್ಠ ೩೦ ಅಕ್ಷರಗಳು)" : "Description too short (min 30 chars)";
    }

    if (!isAnonymous) {
      if (!name.trim()) {
        e.name = isKn ? "ಹೆಸರು ಅಗತ್ಯವಿದೆ" : "Name is required";
      }
      if (!phone.trim()) {
        e.phone = isKn ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ" : "Phone is required";
      } else if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
        e.phone = isKn ? "ಮಾನ್ಯವಾದ ೧೦-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ" : "Enter valid 10-digit mobile number";
      }
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    addQuestion({
      category: selectedCat?.label || "Other",
      question: question.trim(),
      description: description.trim(),
      name: isAnonymous ? (isKn ? "ಅನಾಮಧೇಯ" : "Anonymous") : name.trim(),
      phone: isAnonymous ? "" : phone.trim(),
      isAnonymous,
    });
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1200);
  };

  return (
    <div className={`lw-aq-page ${theme === "dark" ? "aq-dark" : "aq-light"}`}>
      {/* Header Banner */}
      <div className="lw-aq-header">
        <div className="lw-aq-header-inner">
          <span className="lw-aq-header-badge">
            {isKn ? "💬 ಅಧಿಕೃತ ಕಾನೂನು ಸಮಾಲೋಚನೆ" : "💬 Verified Legal Advice"}
          </span>
          <h1 className="lw-aq-title">
            {isKn ? "ಪರಿಣಿತ ವಕೀಲರಿಗೆ ಕಾನೂನು ಪ್ರಶ್ನೆ ಕೇಳಿ" : "Ask a Verified Advocate"}
          </h1>
          <p className="lw-aq-subtitle">
            {isKn
              ? "ನಿಮ್ಮ ಕಾನೂನು ಸಮಸ್ಯೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ — ಭಾರತದ ಅನುಭವಿ ವಕೀಲರಿಂದ ೨೪ ಗಂಟೆಗಳಲ್ಲಿ ವಿಶ್ವಾಸಾರ್ಹ ಉತ್ತರ ಪಡೆಯಿರಿ."
              : "Post your legal inquiry and receive comprehensive guidance from verified High Court and District Court advocates."}
          </p>
          <div className="lw-aq-header-stats">
            <span>⚖️ {isKn ? "೫೦,೦೦೦+ ಉತ್ತರಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು" : "50,000+ Questions Answered"}</span>
            <span>👨‍⚖️ {isKn ? "೫೦೦+ ಸಕ್ರಿಯ ವಕೀಲರು" : "500+ Active Advocates"}</span>
            <span>⏱️ {isKn ? "ಸರಾಸರಿ ೨ ಗಂಟೆಗಳಲ್ಲಿ ಉತ್ತರ" : "Avg. reply within 2 hours"}</span>
            <span>🔒 {isKn ? "೧೦೦% ಗೌಪ್ಯತೆ ಖಾತರಿ" : "100% Confidential & Secure"}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="lw-aq-tabs">
        {[
          ["ask", isKn ? "❓ ಹೊಸ ಪ್ರಶ್ನೆ ಕೇಳಿ" : "❓ Ask a Question"],
          ["recent", isKn ? "💬 ಇತ್ತೀಚಿನ ಪ್ರಶ್ನೆಗಳು" : "💬 Recent Questions"],
          ["experts", isKn ? "👨‍⚖️ ಪರಿಣಿತ ವಕೀಲರು" : "👨‍⚖️ Top Advocates"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`lw-aq-tab ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="lw-aq-body">
        {/* ── ASK TAB ── */}
        {activeTab === "ask" && (
          <div className="lw-aq-form-wrap">
            {step === 3 ? (
              <div className="lw-aq-success-card">
                <div className="lw-aq-success-badge">✅</div>
                <h2>{isKn ? "ಪ್ರಶ್ನೆ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!" : "Question Submitted Successfully!"}</h2>
                <p>
                  {isKn
                    ? "ನಿಮ್ಮ ಕಾನೂನು ಪ್ರಶ್ನೆಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ಪರಿಣಿತ ವಕೀಲರು ೨೪ ಗಂಟೆಗಳಲ್ಲಿ ಉತ್ತರ ನೀಡಲಿದ್ದಾರೆ."
                    : "Your legal inquiry has been registered. Our bar-certified advocates will post answers within 24 hours."}
                </p>
                <div className="lw-aq-success-info">
                  <div>
                    <span>{isKn ? "📋 ವಿಭಾಗ:" : "📋 Category:"}</span>
                    <strong>{selectedCat?.label}</strong>
                  </div>
                  <div>
                    <span>{isKn ? "❓ ಪ್ರಶ್ನೆ:" : "❓ Question:"}</span>
                    <strong>
                      {question.slice(0, 75)}
                      {question.length > 75 ? "…" : ""}
                    </strong>
                  </div>
                  {!isAnonymous && (
                    <div>
                      <span>{isKn ? "👤 ಸಲ್ಲಿಸಿದವರು:" : "👤 Submitted by:"}</span>
                      <strong>{name}</strong>
                    </div>
                  )}
                </div>
                <div className="lw-aq-success-actions">
                  <button
                    type="button"
                    className="lw-aq-btn-outline"
                    onClick={() => {
                      setStep(1);
                      setSelectedCat(null);
                      setQuestion("");
                      setDescription("");
                    }}
                  >
                    {isKn ? "ಮತ್ತೊಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ" : "Ask Another Question"}
                  </button>
                  <button
                    type="button"
                    className="lw-aq-btn-primary"
                    onClick={() => navigate("/find-lawyer")}
                  >
                    {isKn ? "ವಕೀಲರೊಂದಿಗೆ ನೇರ ಚಾಟ್ ಮಾಡಿ →" : "Connect with Advocate Now →"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Progress bar */}
                <div className="lw-aq-progress">
                  {[
                    isKn ? "ವಿಭಾಗ ಆಯ್ಕೆ" : "Select Category",
                    isKn ? "ಪ್ರಶ್ನೆ ವಿವರ" : "Your Question",
                    isKn ? "ಸಲ್ಲಿಕೆ ಪೂರ್ಣ" : "Confirmation",
                  ].map((label, i) => (
                    <React.Fragment key={label}>
                      <div
                        className={`lw-aq-prog-step ${step > i + 1 ? "done" : ""} ${
                          step === i + 1 ? "active" : ""
                        }`}
                      >
                        <div className="lw-aq-prog-dot">{step > i + 1 ? "✓" : i + 1}</div>
                        <span>{label}</span>
                      </div>
                      {i < 2 && (
                        <div className={`lw-aq-prog-line ${step > i + 1 ? "done" : ""}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Step 1: Category */}
                {step === 1 && (
                  <div>
                    <div className="lw-aq-step-header">
                      <h3 className="lw-aq-step-title">
                        {isKn ? "೧. ನಿಮ್ಮ ಸಮಸ್ಯೆ ಯಾವ ಕಾನೂನು ವಿಭಾಗಕ್ಕೆ ಸಂಬಂಧಿಸಿದೆ?" : "1. What is your legal issue regarding?"}
                      </h3>
                      <p className="lw-aq-step-desc">
                        {isKn
                          ? "ಸೂಕ್ತ ವಿಭಾಗವನ್ನು ಆರಿಸಿ, ಇದರಿಂದ ಸಂಬಂಧಪಟ್ಟ ವಿಶೇಷಜ್ಞ ವಕೀಲರು ಶೀಘ್ರವಾಗಿ ಮಾರ್ಗದರ್ಶನ ನೀಡಬಹುದು."
                          : "Select the legal domain so our specialist advocates in that field can answer immediately."}
                      </p>
                    </div>

                    <div className="lw-aq-cat-grid">
                      {categoriesList.map((cat) => (
                        <button
                          type="button"
                          key={cat.id || cat.label}
                          className={`lw-aq-cat-card ${
                            selectedCat?.id === cat.id || selectedCat?.label === cat.label
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => setSelectedCat(cat)}
                        >
                          <span className="lw-aq-cat-icon">{cat.icon}</span>
                          <div className="lw-aq-cat-label">{cat.label}</div>
                          <div className="lw-aq-cat-sub">{cat.sub}</div>
                          {(selectedCat?.id === cat.id || selectedCat?.label === cat.label) && (
                            <span className="lw-aq-cat-check">✓</span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="lw-aq-step-footer">
                      <div className="lw-aq-footer-info">
                        {selectedCat ? (
                          <span>
                            {isKn ? "ಆಯ್ಕೆಯಾದ ವಿಭಾಗ:" : "Selected:"} <strong>{selectedCat.icon} {selectedCat.label}</strong>
                          </span>
                        ) : (
                          <span>{isKn ? "ಮುಂದುವರಿಯಲು ಒಂದು ವಿಭಾಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ" : "Please select a category above to continue"}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="lw-aq-btn-primary"
                        disabled={!selectedCat}
                        onClick={() => setStep(2)}
                      >
                        {isKn ? "ಮುಂದಿನ ಹಂತ: ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ →" : "Next: Write Your Question →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Question */}
                {step === 2 && (
                  <div>
                    <div className="lw-aq-step-header">
                      <h3 className="lw-aq-step-title">
                        {selectedCat?.icon} {selectedCat?.label} — {isKn ? "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ವಿವರಿಸಿ" : "Describe your legal matter"}
                      </h3>
                      <p className="lw-aq-step-desc">
                        {isKn
                          ? "ನಿಮ್ಮ ಪ್ರಕರಣದ ಸತ್ಯಾಂಶಗಳು, ದಿನಾಂಕಗಳು ಮತ್ತು ನೀವು ನಿರೀಕ್ಷಿಸುವ ಪರಿಹಾರವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ನಮೂದಿಸಿ."
                          : "Be clear and specific. Mention relevant dates, agreements, notices or police actions."}
                      </p>
                    </div>

                    <div className="lw-aq-field">
                      <label>
                        {isKn ? "ಮುಖ್ಯ ಪ್ರಶ್ನೆ" : "Headline Question"} <span className="lw-req">*</span>
                      </label>
                      <input
                        className={`lw-aq-input ${errors.question ? "error" : ""}`}
                        placeholder={
                          isKn
                            ? "ಉದಾ: ಮನೆ ಖಾಲಿ ಮಾಡಿದರೂ ಮಾಲೀಕರು ಅಡ್ವಾನ್ಸ್ ಹಣ ಮರಳಿಸುತ್ತಿಲ್ಲ..."
                            : "e.g. Landlord refusing to return deposit after vacating flat..."
                        }
                        value={question}
                        onChange={(e) => {
                          setQuestion(e.target.value);
                          setErrors((p) => ({ ...p, question: "" }));
                        }}
                        maxLength={200}
                      />
                      <div className="lw-aq-char">{question.length}/200</div>
                      {errors.question && <p className="lw-aq-err">⚠ {errors.question}</p>}
                    </div>

                    <div className="lw-aq-field">
                      <label>
                        {isKn ? "ವಿವರವಾದ ವಿವರಣೆ" : "Detailed Background & Facts"} <span className="lw-req">*</span>
                      </label>
                      <textarea
                        className={`lw-aq-textarea ${errors.description ? "error" : ""}`}
                        rows={6}
                        placeholder={
                          isKn
                            ? "ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯ ಸಂಪೂರ್ಣ ವಿವರಗಳು, ದಿನಾಂಕಗಳು, ದಾಖಲೆಗಳು ಮತ್ತು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ವಿವರವಾಗಿ ಬರೆಯಿರಿ..."
                            : "Provide complete facts, dates, notices received, financial amounts involved, and what specific legal remedy you are seeking..."
                        }
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setErrors((p) => ({ ...p, description: "" }));
                        }}
                        maxLength={2000}
                      />
                      <div className="lw-aq-char">{description.length}/2000</div>
                      {errors.description && <p className="lw-aq-err">⚠ {errors.description}</p>}
                    </div>

                    <div className="lw-aq-field lw-aq-anon-field">
                      <label className="lw-aq-anon-label">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                        <span>
                          {isKn
                            ? "ಅನಾಮಧೇಯವಾಗಿ ಪೋಸ್ಟ್ ಮಾಡಿ (ಸಾರ್ವಜನಿಕವಾಗಿ ನಿಮ್ಮ ಹೆಸರು ಗೋಚರಿಸುವುದಿಲ್ಲ)"
                            : "Post anonymously (your name will not be shown on public listings)"}
                        </span>
                      </label>
                    </div>

                    {!isAnonymous && (
                      <div className="lw-aq-grid-2">
                        <div className="lw-aq-field">
                          <label>
                            {isKn ? "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು" : "Your Full Name"} <span className="lw-req">*</span>
                          </label>
                          <input
                            className={`lw-aq-input ${errors.name ? "error" : ""}`}
                            placeholder={isKn ? "ನಿಮ್ಮ ಹೆಸರು" : "Full legal name"}
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              setErrors((p) => ({ ...p, name: "" }));
                            }}
                          />
                          {errors.name && <p className="lw-aq-err">⚠ {errors.name}</p>}
                        </div>
                        <div className="lw-aq-field">
                          <label>
                            {isKn ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ" : "Mobile Number"} <span className="lw-req">*</span>
                          </label>
                          <input
                            className={`lw-aq-input ${errors.phone ? "error" : ""}`}
                            placeholder="10-digit mobile"
                            type="tel"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              setErrors((p) => ({ ...p, phone: "" }));
                            }}
                          />
                          {errors.phone && <p className="lw-aq-err">⚠ {errors.phone}</p>}
                        </div>
                      </div>
                    )}

                    <div className="lw-aq-note">
                      <span>ℹ️</span>
                      <div>
                        {isKn
                          ? "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಬಾರ್ ಕೌನ್ಸಿಲ್ ಮಾನ್ಯತೆ ಪಡೆದ ಪರಿಶೀಲಿತ ವಕೀಲರು ಪರಿಶೀಲಿಸುತ್ತಾರೆ. ವೈಯಕ್ತಿಕ ವಿವರಗಳು ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ."
                          : "Your query will be published to verified Bar Council advocates for review. Sensitive contact information remains strictly encrypted."}
                      </div>
                    </div>

                    <div className="lw-aq-step-footer">
                      <button
                        type="button"
                        className="lw-aq-btn-outline"
                        onClick={() => setStep(1)}
                      >
                        {isKn ? "← ಹಿಂದಕ್ಕೆ" : "← Back to Categories"}
                      </button>
                      <button
                        type="button"
                        className="lw-aq-btn-primary"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading
                          ? (isKn ? "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ..." : "Submitting Question...")
                          : (isKn ? "ಪ್ರಶ್ನೆ ಸಲ್ಲಿಸಿ ✓" : "Submit Question ✓")}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── RECENT QUESTIONS TAB ── */}
        {activeTab === "recent" && (
          <div className="lw-aq-recent-wrap">
            <div className="lw-aq-search-wrap">
              <span className="lw-aq-search-icon">🔍</span>
              <input
                className="lw-aq-search"
                placeholder={isKn ? "ಪ್ರಶ್ನೆಗಳನ್ನು ಹುಡುಕಿ (ಉದಾ: ಮನೆ ಬಾಡಿಗೆ, ಚೆಕ್ ಬೌನ್ಸ್, ಜಾಮೀನು)..." : "Search legal queries (e.g., rent, bail, cheque bounce, divorce)..."}
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
              {searchQ && (
                <button
                  type="button"
                  className="lw-aq-search-clear"
                  onClick={() => setSearchQ("")}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="lw-aq-recent-list">
              {filteredRecent.length === 0 ? (
                <div className="lw-aq-empty">
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
                  {isKn
                    ? `"${searchQ}" ಗಾಗಿ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ`
                    : `No questions found matching "${searchQ}"`}
                </div>
              ) : (
                filteredRecent.map((q) => (
                  <div key={q.id} className="lw-aq-q-card">
                    <div className="lw-aq-q-top">
                      <Avatar initials={q.avatar} color={q.color} size={38} />
                      <div className="lw-aq-q-meta">
                        <span className="lw-aq-q-cat">{isKn ? q.categoryKn : q.category}</span>
                        <span className="lw-aq-q-time">{isKn ? q.timeKn : q.time}</span>
                      </div>
                    </div>
                    <p className="lw-aq-q-text">{isKn ? q.questionKn : q.question}</p>
                    <div className="lw-aq-q-footer">
                      <span className="lw-aq-q-answers">
                        💬 {q.answers} {isKn ? "ವಕೀಲರ ಉತ್ತರಗಳು" : "advocate answers"}
                      </span>
                      <button
                        type="button"
                        className="lw-aq-btn-sm"
                        onClick={() => {
                          setSelectedCat(
                            categoriesList.find(
                              (c) => c.label.toLowerCase() === q.category.toLowerCase()
                            ) || categoriesList[0]
                          );
                          setActiveTab("ask");
                          setStep(2);
                        }}
                      >
                        {isKn ? "ನನ್ನ ಪ್ರಶ್ನೆ ಕೇಳಿ →" : "Ask Similar Question →"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── EXPERTS TAB ── */}
        {activeTab === "experts" && (
          <div className="lw-aq-experts-wrap">
            <div className="lw-aq-experts-header">
              <h3 className="lw-aq-experts-title">
                {isKn ? "ಪ್ರಮುಖ ಉತ್ತರಿಸುವ ಪರಿಣಿತ ವಕೀಲರು" : "Top Contributing Advocates"}
              </h3>
              <p className="lw-aq-experts-subtitle">
                {isKn
                  ? "ಈ ವಕೀಲರು ನಮ್ಮ ನಾಗರಿಕರಿಗೆ ಅತಿ ಹೆಚ್ಚು ಉಚಿತ ಮಾರ್ಗದರ್ಶನ ನೀಡಿದ್ದಾರೆ. ನೇರ ಸಮಾಲೋಚನೆಗೆ ಸಂಪರ್ಕಿಸಿ."
                  : "Verified advocates with high resolution rates and prompt responses on Advocates Hub."}
              </p>
            </div>

            <div className="lw-aq-experts-grid">
              {EXPERT_ADVOCATES.map((adv) => (
                <div key={adv.name} className="lw-aq-expert-card">
                  <Avatar advocate={adv} initials={adv.initials} color={adv.color} size={64} />
                  <div className="lw-aq-expert-name">{adv.name}</div>
                  <div className="lw-aq-expert-spec">{adv.spec}</div>
                  <div className="lw-aq-expert-stats">
                    <span>💬 {adv.answers} {isKn ? "ಪ್ರಕರಣಗಳು" : "cases"}</span>
                    <span>⭐ {adv.rating || "4.9"}</span>
                    <span>🏛️ {adv.court || (isKn ? "ಜಿಲ್ಲಾ ನ್ಯಾಯಾಲಯ" : "High Court")}</span>
                  </div>
                  <button
                    type="button"
                    className="lw-aq-btn-primary"
                    style={{ marginTop: 12, width: "100%" }}
                    onClick={() =>
                      navigate(adv.email ? `/profile?email=${encodeURIComponent(adv.email)}` : `/find-lawyer`)
                    }
                  >
                    {isKn ? "ನೇರ ಸಮಾಲೋಚನೆ ಪಡೆಯಿರಿ →" : "Consult Advocate Now →"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA Banner */}
      <div className="lw-aq-bottom-cta">
        <div className="lw-aq-bottom-cta-text">
          <h4>{isKn ? "ತುರ್ತು ಕಾನೂನು ನೆರವು ಬೇಕೇ?" : "Need Urgent One-on-One Legal Assistance?"}</h4>
          <p>
            {isKn
              ? "ನಿಮ್ಮ ನಗರದ ಅನುಭವಿ ವಕೀಲರೊಂದಿಗೆ ತಕ್ಷಣವೇ ಚಾಟ್ ಮಾಡಿ ಅಥವಾ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ನಿಗದಿಪಡಿಸಿ."
              : "Connect directly with verified Advocates in your city for immediate legal representation and advisory."}
          </p>
        </div>
        <button
          type="button"
          className="lw-aq-bottom-cta-btn"
          onClick={() => navigate("/find-lawyer")}
        >
          {isKn ? "ವಕೀಲರನ್ನು ಹುಡುಕಿ →" : "Find an Advocate →"}
        </button>
      </div>
    </div>
  );
}