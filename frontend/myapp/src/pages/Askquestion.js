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
import LegalIcon from "../components/LegalIcons";
import "./Askquestion.css";

export const CATEGORIES_EN = [
  { id: "family",      iconName: "relationship", label: "Family Law",        sub: "Divorce, child custody, maintenance & domestic disputes" },
  { id: "criminal",    iconName: "lock",         label: "Criminal Law",      sub: "FIR, anticipatory bail, arrest, police complaints & BNSS" },
  { id: "property",    iconName: "home",         label: "Property Law",      sub: "Land dispute, partition, title deed, mutation & RERA" },
  { id: "civil",       iconName: "scale",        label: "Civil Law",         sub: "Recovery suits, injunctions, damages & breach of contract" },
  { id: "corporate",   iconName: "briefcase",    label: "Corporate Law",     sub: "Company incorporation, founder agreements & startup compliance" },
  { id: "tax",         iconName: "fees",         label: "Tax Law",           sub: "Income tax notices, GST assessments, audits & appeals" },
  { id: "labour",      iconName: "client",       label: "Labour & Service",  sub: "Wrongful termination, PF, gratuity, salary & harassment" },
  { id: "consumer",    iconName: "shieldCheck",  label: "Consumer Rights",   sub: "Defective goods, e-commerce refunds & service deficiency" },
  { id: "cyber",       iconName: "settings",     label: "Cyber Crime",       sub: "Online financial fraud, account hacking & IT Act complaints" },
  { id: "immigration", iconName: "availability", label: "Immigration",       sub: "Visa rejections, passport delays, OCI & deportation issues" },
  { id: "banking",     iconName: "fees",         label: "Banking & Cheques", sub: "Section 138 cheque bounce, loan recovery, SARFAESI & DRT" },
  { id: "other",       iconName: "documents",    label: "Other Matters",     sub: "Affidavits, legal notices, wills & general legal queries" },
];

export const CATEGORIES = CATEGORIES_EN;

export const CATEGORIES_KN = [
  { id: "family",      iconName: "relationship", label: "ಕೌಟುಂಬಿಕ ಕಾನೂನು",    sub: "ವಿಚ್ಛೇದನ, ಮಗುವಿನ ಪಾಲನೆ, ಜೀವನಾಂಶ ಮತ್ತು ಕೌಟುಂಬಿಕ ವಿವಾದ" },
  { id: "criminal",    iconName: "lock",         label: "ಕ್ರಿಮಿನಲ್ ಕಾನೂನು",     sub: "ಎಫ್‌ಐಆರ್, ನಿರೀಕ್ಷಣಾ ಜಾಮೀನು, ಬಂಧನ, ಪೊಲೀಸ್ ದೂರು ಮತ್ತು BNSS" },
  { id: "property",    iconName: "home",         label: "ಆಸ್ತಿ ಕಾನೂನು",        sub: "ಆಸ್ತಿ ವಿವಾದ, ಭಾಗಪತ್ರ, ಖಾತಾ ಬದಲಾವಣೆ, ಹಕ್ಕುಪತ್ರ ಮತ್ತು ರೇರಾ" },
  { id: "civil",       iconName: "scale",        label: "ಸಿವಿಲ್ ಕಾನೂನು",       sub: "ಸಿವಿಲ್ ದಾವೆಗಳು, ತಡೆಯಾಜ್ಞೆ, ಒಪ್ಪಂದ ಉಲ್ಲಂಘನೆ ಮತ್ತು ವಸೂಲಾತಿ" },
  { id: "corporate",   iconName: "briefcase",    label: "ಕಾರ್ಪೊರೇಟ್ ಕಾನೂನು",   sub: "ಕಂಪನಿ ಸ್ಥಾಪನೆ, ಪಾಲುದಾರಿಕೆ ಒಪ್ಪಂದ ಮತ್ತು ನಿಯಮಗಳ ಪಾಲನೆ" },
  { id: "tax",         iconName: "fees",         label: "ತೆರಿಗೆ ಕಾನೂನು",       sub: "ಆದಾಯ ತೆರಿಗೆ ನೋಟಿಸ್, ಜಿಎಸ್‌ಟಿ ತಪಾಸಣೆ ಮತ್ತು ಮೇಲ್ಮನವಿ" },
  { id: "labour",      iconName: "client",       label: "ಕಾರ್ಮಿಕ & ಸೇವಾ ಕಾನೂನು",sub: "ಉದ್ಯೋಗ ವಜಾ, ವೇತನ ಬಾಕಿ, ಪಿಎಫ್ ಮತ್ತು ಕೆಲಸದ ಸ್ಥಳದ ಸಮಸ್ಯೆ" },
  { id: "consumer",    iconName: "shieldCheck",  label: "ಗ್ರಾಹಕ ರಕ್ಷಣೆ",        sub: "ದೋಷಯುಕ್ತ ಉತ್ಪನ್ನ, ಇ-ಕಾಮರ್ಸ್ ವಂಚನೆ ಮತ್ತು ಪರಿಹಾರ" },
  { id: "cyber",       iconName: "settings",     label: "ಸೈಬರ್ ಅಪರಾಧ",        sub: "ಆನ್‌ಲೈನ್ ಹಣಕಾಸು ವಂಚನೆ, ಖಾತೆ ಹ್ಯಾಕಿಂಗ್ ಮತ್ತು ಐಟಿ ಕಾಯ್ದೆ" },
  { id: "immigration", iconName: "availability", label: "ವಲಸೆ & ಪಾಸ್‌ಪೋರ್ಟ್",   sub: "ವೀಸಾ ನಿರಾಕರಣೆ, ಪಾಸ್‌ಪೋರ್ಟ್ ವಿಳಂಬ ಮತ್ತು ಓಸಿಐ ಸಮಸ್ಯೆಗಳು" },
  { id: "banking",     iconName: "fees",         label: "ಬ್ಯಾಂಕಿಂಗ್ & ಚೆಕ್ ಬೌನ್ಸ್", sub: "ಸೆಕ್ಷನ್ 138 ಚೆಕ್ ಬೌನ್ಸ್, ಸಾಲ ವಸೂಲಾತಿ, ಸರ್ಫೇಸಿ & ಡಿಆರ್‌ಟಿ" },
  { id: "other",       iconName: "documents",    label: "ಇತರ ವಿಷಯಗಳು",         sub: "ಪ್ರಮಾಣಪತ್ರ, ಲೀಗಲ್ ನೋಟಿಸ್, ವಿಲ್ ಮತ್ತು ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು" },
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
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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
      e.question = isKn ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯ ಮುಖ್ಯ ವಿಷಯವನ್ನು ನಮೂದಿಸಿ" : "Please enter the headline of your question";
    } else if (question.trim().length < 15) {
      e.question = isKn ? "ಪ್ರಶ್ನೆ ತುಂಬಾ ಚಿಕ್ಕದಾಗಿದೆ (ಕನಿಷ್ಠ ೧೫ ಅಕ್ಷರಗಳು)" : "Question is too short (min 15 chars)";
    }

    if (!description.trim()) {
      e.description = isKn ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಮಸ್ಯೆಯ ವಿವರಗಳನ್ನು ಬರೆಯಿರಿ" : "Please describe your legal issue in detail";
    } else if (description.trim().length < 30) {
      e.description = isKn ? "ವಿವರಣೆ ತುಂಬಾ ಚಿಕ್ಕದಾಗಿದೆ (ಕನಿಷ್ಠ ೩೦ ಅಕ್ಷರಗಳು)" : "Description is too short (min 30 chars)";
    }

    if (!isAnonymous) {
      if (!name.trim()) {
        e.name = isKn ? "ನಿಮ್ಮ ಹೆಸರು ಅಗತ್ಯವಿದೆ" : "Full name is required";
      }
      if (!phone.trim()) {
        e.phone = isKn ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ" : "Mobile number is required";
      } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
        e.phone = isKn ? "ಮಾನ್ಯವಾದ ೧೦-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ" : "Enter a valid 10-digit mobile number";
      }
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    addQuestion({
      category: selectedCat?.label || "Other",
      categoryEn: selectedCat?.labelEn || selectedCat?.label || "Other",
      question: question.trim(),
      description: description.trim(),
      city: city.trim(),
      name: isAnonymous ? (isKn ? "ಅನಾಮಧೇಯ ಬಳಕೆದಾರ" : "Anonymous Citizen") : name.trim(),
      phone: isAnonymous ? "" : phone.trim(),
      email: isAnonymous ? "" : email.trim(),
      isAnonymous,
    });
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1000);
  };

  return (
    <div className={`lw-aq-page ${theme === "dark" ? "aq-dark" : "aq-light"}`}>
      {/* Header Banner */}
      <header className="lw-aq-header">
        <div className="lw-aq-header-glow"></div>
        <div className="lw-aq-header-inner">
          <div className="lw-aq-header-badge">
            <span className="lw-aq-beacon"></span>
            <LegalIcon name="shieldCheck" size={13} className="lw-aq-badge-icon" />
            <span>
              {isKn ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ • ಅಧಿಕೃತ ಕಾನೂನು ಸಮಾಲೋಚನಾ ವಿಭಾಗ" : "ADVOCATES HUB • VERIFIED LEGAL ADVICE DESK"}
            </span>
          </div>

          <h1 className="lw-aq-title">
            {isKn ? (
              <>
                ಪರಿಣಿತ ವಕೀಲರಿಗೆ{" "}
                <span className="lw-aq-gradient-text">ಕಾನೂನು ಪ್ರಶ್ನೆ ಕೇಳಿ</span>
              </>
            ) : (
              <>
                Ask a Question to{" "}
                <span className="lw-aq-gradient-text">Verified Advocates</span>
              </>
            )}
          </h1>

          <p className="lw-aq-subtitle">
            {isKn
              ? "ನಿಮ್ಮ ಕಾನೂನು ಸಮಸ್ಯೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ — ಕರ್ನಾಟಕ ಮತ್ತು ಭಾರತದ ಅನುಭವಿ ಹೈಕೋರ್ಟ್ ಮತ್ತು ಜಿಲ್ಲಾ ನ್ಯಾಯಾಲಯದ ವಕೀಲರಿಂದ ೨೪ ಗಂಟೆಗಳಲ್ಲಿ ಸ್ಪಷ್ಟ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ."
              : "Post your legal inquiry in plain language and receive authoritative answers from certified State Bar Council advocates across High Court and District benches."}
          </p>

          <div className="lw-aq-header-stats">
            <div className="lw-aq-hstat-item">
              <LegalIcon name="documents" size={14} className="lw-aq-hs-icon" />
              <span>{isKn ? "೫೦,೦೦೦+ ಉತ್ತರಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು" : "50,000+ Questions Answered"}</span>
            </div>
            <div className="lw-aq-hstat-item">
              <LegalIcon name="scale" size={14} className="lw-aq-hs-icon" />
              <span>{isKn ? "೫೦+ ಪರಿಶೀಲಿತ ಹಿರಿಯ ವಕೀಲರು" : "50+ Bar Verified Advocates"}</span>
            </div>
            <div className="lw-aq-hstat-item">
              <LegalIcon name="clock" size={14} className="lw-aq-hs-icon" />
              <span>{isKn ? "ಸರಾಸರಿ ೨-೪ ಗಂಟೆಗಳಲ್ಲಿ ಉತ್ತರ" : "Avg. reply within 2-4 hours"}</span>
            </div>
            <div className="lw-aq-hstat-item">
              <LegalIcon name="lock" size={14} className="lw-aq-hs-icon" />
              <span>{isKn ? "೧೦೦% ಶಾಸನಬದ್ಧ ಗೌಪ್ಯತೆ" : "100% Confidential & Secure"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="lw-aq-tabs" aria-label="Ask Question Navigation Tabs">
        <button
          type="button"
          className={`lw-aq-tab ${activeTab === "ask" ? "active" : ""}`}
          onClick={() => setActiveTab("ask")}
        >
          <LegalIcon name="chat" size={15} />
          <span>{isKn ? "ಹೊಸ ಪ್ರಶ್ನೆ ಕೇಳಿ" : "Ask a Question"}</span>
        </button>
        <button
          type="button"
          className={`lw-aq-tab ${activeTab === "recent" ? "active" : ""}`}
          onClick={() => setActiveTab("recent")}
        >
          <LegalIcon name="documents" size={15} />
          <span>{isKn ? "ಇತ್ತೀಚಿನ ಪ್ರಶ್ನೆಗಳು" : "Recent Questions"}</span>
        </button>
        <button
          type="button"
          className={`lw-aq-tab ${activeTab === "experts" ? "active" : ""}`}
          onClick={() => setActiveTab("experts")}
        >
          <LegalIcon name="scale" size={15} />
          <span>{isKn ? "ಪರಿಣಿತ ವಕೀಲರು" : "Top Advocates"}</span>
        </button>
      </nav>

      <main className="lw-aq-body">
        {/* ── 1. ASK TAB ── */}
        {activeTab === "ask" && (
          <div className="lw-aq-form-wrap">
            {step === 3 ? (
              <div className="lw-aq-success-card">
                <div className="lw-aq-success-badge">
                  <LegalIcon name="checkCircle" size={54} className="lw-aq-success-svg" />
                </div>
                <h2>
                  {isKn ? "ಪ್ರಶ್ನೆ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!" : "Question Registered Successfully!"}
                </h2>
                <p>
                  {isKn
                    ? "ನಿಮ್ಮ ಕಾನೂನು ವಿಚಾರಣೆಯನ್ನು ನಮ್ಮ ಪರಿಶೀಲನಾ ವ್ಯವಸ್ಥೆಯು ದಾಖಲಿಸಿದೆ. ನಮ್ಮ ಪರಿಶೀಲಿತ ವಕೀಲರು ಶೀಘ್ರವಾಗಿ ಪರಿಶೀಲಿಸಿ ಉತ್ತರ ನೀಡಲಿದ್ದಾರೆ."
                    : "Your legal inquiry has been registered on Advocates Hub. Certified practitioners in your practice area will review and provide counsel."}
                </p>

                <div className="lw-aq-success-info">
                  <div className="lw-aq-sinfo-row">
                    <span className="lw-aq-sinfo-label">
                      <LegalIcon name="briefcase" size={14} />
                      <span>{isKn ? "ಕಾನೂನು ವಿಭಾಗ:" : "Legal Domain:"}</span>
                    </span>
                    <strong className="lw-aq-sinfo-val">{selectedCat?.label}</strong>
                  </div>
                  <div className="lw-aq-sinfo-row">
                    <span className="lw-aq-sinfo-label">
                      <LegalIcon name="documents" size={14} />
                      <span>{isKn ? "ಮುಖ್ಯ ಪ್ರಶ್ನೆ:" : "Headline Question:"}</span>
                    </span>
                    <strong className="lw-aq-sinfo-val">
                      {question.slice(0, 85)}
                      {question.length > 85 ? "…" : ""}
                    </strong>
                  </div>
                  {city.trim() && (
                    <div className="lw-aq-sinfo-row">
                      <span className="lw-aq-sinfo-label">
                        <LegalIcon name="pin" size={14} />
                        <span>{isKn ? "ನ್ಯಾಯವ್ಯಾಪ್ತಿ / ನಗರ:" : "Jurisdiction / City:"}</span>
                      </span>
                      <strong className="lw-aq-sinfo-val">{city}</strong>
                    </div>
                  )}
                  {!isAnonymous && (
                    <div className="lw-aq-sinfo-row">
                      <span className="lw-aq-sinfo-label">
                        <LegalIcon name="user" size={14} />
                        <span>{isKn ? "ಸಲ್ಲಿಸಿದವರು:" : "Submitted by:"}</span>
                      </span>
                      <strong className="lw-aq-sinfo-val">{name}</strong>
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
                      setCity("");
                    }}
                  >
                    <LegalIcon name="arrowLeft" size={14} />
                    <span>{isKn ? "ಮತ್ತೊಂದು ಪ್ರಶ್ನೆ ಕೇಳಿ" : "Ask Another Question"}</span>
                  </button>
                  <button
                    type="button"
                    className="lw-aq-btn-primary"
                    onClick={() => navigate("/find-lawyer")}
                  >
                    <span>{isKn ? "ವಕೀಲರೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ" : "Connect with Advocate Now"}</span>
                    <LegalIcon name="arrowRight" size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Visual Progress Steps Tracker */}
                <div className="lw-aq-progress">
                  {[
                    isKn ? "೧. ವಿಭಾಗ ಆಯ್ಕೆ" : "1. Select Category",
                    isKn ? "೨. ಪ್ರಶ್ನೆ ವಿವರಣೆ" : "2. Your Question",
                    isKn ? "೩. ದೃಢೀಕರಣ" : "3. Confirmation",
                  ].map((label, i) => {
                    const stepNum = i + 1;
                    const isDone = step > stepNum;
                    const isActive = step === stepNum;
                    return (
                      <React.Fragment key={label}>
                        <div
                          className={`lw-aq-prog-step ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
                        >
                          <div className="lw-aq-prog-dot">
                            {isDone ? <LegalIcon name="check" size={12} /> : stepNum}
                          </div>
                          <span>{label}</span>
                        </div>
                        {i < 2 && (
                          <div className={`lw-aq-prog-line ${isDone ? "done" : ""}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* ── Step 1: Category Selection ── */}
                {step === 1 && (
                  <div className="lw-aq-step-panel">
                    <div className="lw-aq-step-header">
                      <div className="lw-aq-step-pill">
                        <LegalIcon name="briefcase" size={13} />
                        <span>{isKn ? "ಹಂತ ೧" : "STEP 1 OF 2"}</span>
                      </div>
                      <h2 className="lw-aq-step-title">
                        {isKn ? "ನಿಮ್ಮ ಸಮಸ್ಯೆ ಯಾವ ಕಾನೂನು ವಿಭಾಗಕ್ಕೆ ಸಂಬಂಧಿಸಿದೆ?" : "What is the subject of your legal inquiry?"}
                      </h2>
                      <p className="lw-aq-step-desc">
                        {isKn
                          ? "ಸೂಕ್ತ ಕಾನೂನು ವಿಭಾಗವನ್ನು ಆರಿಸಿ, ಇದರಿಂದ ಸಂಬಂಧಪಟ್ಟ ಪರಿಣಿತ ವಕೀಲರು ನಿಖರ ಉತ್ತರವನ್ನು ಶೀಘ್ರವಾಗಿ ನೀಡಬಹುದು."
                          : "Choose the relevant legal domain below so that certified practitioners with active trial experience in that area can assist you."}
                      </p>
                    </div>

                    <div className="lw-aq-cat-grid">
                      {categoriesList.map((cat) => {
                        const isSelected = selectedCat?.id === cat.id;
                        return (
                          <button
                            type="button"
                            key={cat.id}
                            className={`lw-aq-cat-card ${isSelected ? "selected" : ""}`}
                            onClick={() => setSelectedCat(cat)}
                          >
                            <div className="lw-aq-cat-top-bar">
                              <div className="lw-aq-cat-icon-box">
                                <LegalIcon name={cat.iconName} size={20} className="lw-aq-cat-icon" />
                              </div>
                              {isSelected && (
                                <span className="lw-aq-cat-check">
                                  <LegalIcon name="check" size={11} />
                                </span>
                              )}
                            </div>
                            <div className="lw-aq-cat-label">{cat.label}</div>
                            <div className="lw-aq-cat-sub">{cat.sub}</div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="lw-aq-step-footer">
                      <div className="lw-aq-footer-info">
                        {selectedCat ? (
                          <div className="lw-aq-selected-pill">
                            <LegalIcon name={selectedCat.iconName} size={15} />
                            <span>
                              {isKn ? "ಆಯ್ಕೆಯಾದ ವಿಭಾಗ:" : "Selected:"} <strong>{selectedCat.label}</strong>
                            </span>
                          </div>
                        ) : (
                          <span className="lw-aq-unselected-hint">
                            {isKn ? "ಮುಂದುವರಿಯಲು ಮೇಲಿನ ಒಂದು ವಿಭಾಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ" : "Please select a category above to proceed"}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="lw-aq-btn-primary"
                        disabled={!selectedCat}
                        onClick={() => setStep(2)}
                      >
                        <span>{isKn ? "ಮುಂದಿನ ಹಂತ: ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ" : "Next: Write Your Question"}</span>
                        <LegalIcon name="arrowRight" size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Step 2: Write Question & Client Details ── */}
                {step === 2 && (
                  <div className="lw-aq-step-panel">
                    <div className="lw-aq-step-header">
                      <div className="lw-aq-selected-cat-banner">
                        <div className="lw-aq-scb-left">
                          <LegalIcon name={selectedCat?.iconName} size={18} />
                          <div>
                            <span className="lw-aq-scb-tag">{isKn ? "ಆಯ್ಕೆಯಾದ ವಿಭಾಗ" : "SELECTED CATEGORY"}</span>
                            <h3 className="lw-aq-scb-title">{selectedCat?.label}</h3>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="lw-aq-scb-change-btn"
                          onClick={() => setStep(1)}
                        >
                          <LegalIcon name="arrowLeft" size={13} />
                          <span>{isKn ? "ವಿಭಾಗ ಬದಲಾಯಿಸಿ" : "Change Category"}</span>
                        </button>
                      </div>

                      <h2 className="lw-aq-step-title" style={{ marginTop: 16 }}>
                        {isKn ? "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಮತ್ತು ಸನ್ನಿವೇಶವನ್ನು ವಿವರಿಸಿ" : "Describe Your Legal Question & Situation"}
                      </h2>
                      <p className="lw-aq-step-desc">
                        {isKn
                          ? "ನಿಮ್ಮ ಪ್ರಕರಣದ ಪ್ರಮುಖ ಸತ್ಯಾಂಶಗಳು, ದಿನಾಂಕಗಳು ಮತ್ತು ನೀವು ನಿರೀಕ್ಷಿಸುವ ಕಾನೂನು ಪರಿಹಾರವನ್ನು ಕೆಳಗೆ ಬರೆಯಿರಿ."
                          : "Provide clear facts and dates so advocates can assess your rights under Indian law and give you practical next steps."}
                      </p>
                    </div>

                    {/* Client Helpful Guidance Box */}
                    <div className="lw-aq-guide-box">
                      <div className="lw-aq-guide-title">
                        <LegalIcon name="info" size={15} />
                        <strong>{isKn ? "ಉತ್ತಮ ಸಲಹೆ ಪಡೆಯಲು ಸರಳ ಸಲಹೆಗಳು:" : "Tips for a Fast & Accurate Answer:"}</strong>
                      </div>
                      <div className="lw-aq-guide-bullets">
                        <div className="lw-aq-gb-item">
                          <LegalIcon name="check" size={12} className="lw-aq-gb-check" />
                          <span>{isKn ? "ದಿನಾಂಕಗಳು ಮತ್ತು ಒಪ್ಪಂದಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಉಲ್ಲೇಖಿಸಿ" : "Mention approximate dates, monetary amounts, or agreements involved."}</span>
                        </div>
                        <div className="lw-aq-gb-item">
                          <LegalIcon name="check" size={12} className="lw-aq-gb-check" />
                          <span>{isKn ? "ಪೊಲೀಸ್ ದೂರು, ಕೋರ್ಟ್ ನೋಟಿಸ್ ಅಥವಾ ಕಾಗದಪತ್ರಗಳಿದ್ದರೆ ತಿಳಿಸಿ" : "State if any police FIR, legal notice, or court summon has already been issued."}</span>
                        </div>
                        <div className="lw-aq-gb-item">
                          <LegalIcon name="check" size={12} className="lw-aq-gb-check" />
                          <span>{isKn ? "ನೀವು ನಿರೀಕ್ಷಿಸುವ ತುರ್ತು ಪರಿಹಾರವನ್ನು ಸ್ಪಷ್ಟಪಡಿಸಿ" : "State what specific relief or remedy you wish to seek."}</span>
                        </div>
                      </div>
                    </div>

                    {/* Headline Question Input */}
                    <div className="lw-aq-field">
                      <label>
                        {isKn ? "ಪ್ರಶ್ನೆಯ ಮುಖ್ಯ ಶೀರ್ಷಿಕೆ" : "Headline Summary of Your Question"} <span className="lw-req">*</span>
                      </label>
                      <input
                        className={`lw-aq-input ${errors.question ? "error" : ""}`}
                        placeholder={
                          isKn
                            ? "ಉದಾ: ೩ ತಿಂಗಳು ಕಳೆದರೂ ಮನೆ ಮಾಲೀಕರು ಅಡ್ವಾನ್ಸ್ ಹಣ ಮರಳಿಸುತ್ತಿಲ್ಲ..."
                            : "e.g. Landlord refusing to return ₹50,000 security deposit after vacating flat..."
                        }
                        value={question}
                        onChange={(e) => {
                          setQuestion(e.target.value);
                          setErrors((p) => ({ ...p, question: "" }));
                        }}
                        maxLength={200}
                      />
                      <div className="lw-aq-char">{question.length}/200</div>
                      {errors.question && (
                        <p className="lw-aq-err">
                          <LegalIcon name="alertCircle" size={13} />
                          <span>{errors.question}</span>
                        </p>
                      )}
                    </div>

                    {/* Detailed Description Textarea */}
                    <div className="lw-aq-field">
                      <label>
                        {isKn ? "ವಿವರವಾದ ಸನ್ನಿವೇಶ ಮತ್ತು ಸತ್ಯಾಂಶಗಳು" : "Detailed Background & Facts"} <span className="lw-req">*</span>
                      </label>
                      <textarea
                        className={`lw-aq-textarea ${errors.description ? "error" : ""}`}
                        rows={6}
                        placeholder={
                          isKn
                            ? "ನಿಮ್ಮ ಪ್ರಕರಣದ ಪೂರ್ಣ ವಿವರಗಳು, ಒಪ್ಪಂದಗಳ ದಿನಾಂಕ, ದಾಖಲೆಗಳು ಮತ್ತು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ವಿವರವಾಗಿ ಬರೆಯಿರಿ..."
                            : "Provide complete facts, dates, notices received, what actions have been taken so far, and what guidance you are seeking..."
                        }
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setErrors((p) => ({ ...p, description: "" }));
                        }}
                        maxLength={2000}
                      />
                      <div className="lw-aq-char">{description.length}/2000</div>
                      {errors.description && (
                        <p className="lw-aq-err">
                          <LegalIcon name="alertCircle" size={13} />
                          <span>{errors.description}</span>
                        </p>
                      )}
                    </div>

                    {/* City / Jurisdiction Field */}
                    <div className="lw-aq-field">
                      <label>
                        {isKn ? "ನ್ಯಾಯವ್ಯಾಪ್ತಿ / ನಗರ (ಐಚ್ಛಿಕ)" : "City / District Jurisdiction (Optional)"}
                      </label>
                      <input
                        className="lw-aq-input"
                        placeholder={
                          isKn
                            ? "ಉದಾ: ಬೆಂಗಳೂರು, ಹುಬ್ಬಳ್ಳಿ, ಬೆಳಗಾವಿ, ಮೈಸೂರು"
                            : "e.g. Bengaluru, Hubballi, Belagavi, Mysuru, High Court Bench"
                        }
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>

                    {/* Anonymous Toggle Option */}
                    <div className="lw-aq-field lw-aq-anon-field">
                      <label className="lw-aq-anon-label">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                        <span>
                          {isKn
                            ? "ಅನಾಮಧೇಯವಾಗಿ ಪೋಸ್ಟ್ ಮಾಡಿ (ಸಾರ್ವಜನಿಕವಾಗಿ ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಗೋಚರಿಸುವುದಿಲ್ಲ)"
                            : "Post anonymously (your name and contact details will remain private from public view)"}
                        </span>
                      </label>
                    </div>

                    {/* Contact Info (if not anonymous) */}
                    {!isAnonymous && (
                      <div className="lw-aq-grid-3">
                        <div className="lw-aq-field">
                          <label>
                            {isKn ? "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು" : "Your Full Name"} <span className="lw-req">*</span>
                          </label>
                          <input
                            className={`lw-aq-input ${errors.name ? "error" : ""}`}
                            placeholder={isKn ? "ನಿಮ್ಮ ಹೆಸರು" : "e.g. Ramesh Kumar"}
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              setErrors((p) => ({ ...p, name: "" }));
                            }}
                          />
                          {errors.name && (
                            <p className="lw-aq-err">
                              <LegalIcon name="alertCircle" size={13} />
                              <span>{errors.name}</span>
                            </p>
                          )}
                        </div>

                        <div className="lw-aq-field">
                          <label>
                            {isKn ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ" : "10-Digit Mobile"} <span className="lw-req">*</span>
                          </label>
                          <input
                            className={`lw-aq-input ${errors.phone ? "error" : ""}`}
                            placeholder="10-digit number"
                            type="tel"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              setErrors((p) => ({ ...p, phone: "" }));
                            }}
                          />
                          {errors.phone && (
                            <p className="lw-aq-err">
                              <LegalIcon name="alertCircle" size={13} />
                              <span>{errors.phone}</span>
                            </p>
                          )}
                        </div>

                        <div className="lw-aq-field">
                          <label>
                            {isKn ? "ಇಮೇಲ್ ವಿಳಾಸ (ಐಚ್ಛಿಕ)" : "Email Address (Optional)"}
                          </label>
                          <input
                            className="lw-aq-input"
                            placeholder="name@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Confidentiality Privilege Notice */}
                    <div className="lw-aq-note">
                      <LegalIcon name="lock" size={18} className="lw-aq-note-icon" />
                      <div>
                        <strong>{isKn ? "ಶಾಸನಬದ್ಧ ವಕೀಲ-ಕ್ಲೈಂಟ್ ಗೌಪ್ಯತೆ:" : "Statutory Attorney-Client Privilege:"}</strong>{" "}
                        {isKn
                          ? "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕರ್ನಾಟಕ ಬಾರ್ ಕೌನ್ಸಿಲ್ ಮಾನ್ಯತೆ ಪಡೆದ ಪರಿಶೀಲಿತ ವಕೀಲರು ಪರಿಶೀಲಿಸುತ್ತಾರೆ. ಭಾರತೀಯ ಸಾಕ್ಷ್ಯ ಕಾಯ್ದೆ ಮತ್ತು BSA ಸೆಕ್ಷನ್ ೧೩೨ ರ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ವಿವರಗಳು ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ."
                          : "Your inquiry is safeguarded under Section 126 of the Indian Evidence Act and Section 132 of the Bharatiya Sakshya Adhiniyam. Personal details remain protected."}
                      </div>
                    </div>

                    <div className="lw-aq-step-footer">
                      <button
                        type="button"
                        className="lw-aq-btn-outline"
                        onClick={() => setStep(1)}
                      >
                        <LegalIcon name="arrowLeft" size={14} />
                        <span>{isKn ? "ಹಿಂದಕ್ಕೆ (ವಿಭಾಗಗಳು)" : "Back to Categories"}</span>
                      </button>
                      <button
                        type="button"
                        className="lw-aq-btn-primary"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        <span>
                          {loading
                            ? (isKn ? "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ..." : "Submitting Question...")
                            : (isKn ? "ಪ್ರಶ್ನೆ ಸಲ್ಲಿಸಿ" : "Submit Question")}
                        </span>
                        <LegalIcon name="check" size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── 2. RECENT QUESTIONS TAB ── */}
        {activeTab === "recent" && (
          <div className="lw-aq-recent-wrap">
            <div className="lw-aq-search-wrap">
              <span className="lw-aq-search-icon">
                <LegalIcon name="search" size={16} />
              </span>
              <input
                className="lw-aq-search"
                placeholder={
                  isKn
                    ? "ಪ್ರಶ್ನೆಗಳನ್ನು ಹುಡುಕಿ (ಉದಾ: ಮನೆ ಬಾಡಿಗೆ, ಚೆಕ್ ಬೌನ್ಸ್, ನಿರೀಕ್ಷಣಾ ಜಾಮೀನು, ವಿಚ್ಛೇದನ)..."
                    : "Search legal queries (e.g., rent deposit, bail, cheque bounce, divorce, RERA)..."
                }
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
              {searchQ && (
                <button
                  type="button"
                  className="lw-aq-search-clear"
                  onClick={() => setSearchQ("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="lw-aq-recent-list">
              {filteredRecent.length === 0 ? (
                <div className="lw-aq-empty">
                  <div className="lw-aq-empty-icon">
                    <LegalIcon name="search" size={36} />
                  </div>
                  <p>
                    {isKn
                      ? `"${searchQ}" ಗಾಗಿ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ`
                      : `No questions found matching "${searchQ}"`}
                  </p>
                </div>
              ) : (
                filteredRecent.map((q) => (
                  <article key={q.id} className="lw-aq-q-card">
                    <div className="lw-aq-q-top">
                      <Avatar initials={q.avatar} color={q.color} size={38} />
                      <div className="lw-aq-q-meta">
                        <span className="lw-aq-q-cat">{isKn ? q.categoryKn : q.category}</span>
                        <span className="lw-aq-q-time">
                          <LegalIcon name="clock" size={11} />
                          <span>{isKn ? q.timeKn : q.time}</span>
                        </span>
                      </div>
                    </div>
                    <p className="lw-aq-q-text">{isKn ? q.questionKn : q.question}</p>
                    <div className="lw-aq-q-footer">
                      <span className="lw-aq-q-answers">
                        <LegalIcon name="chat" size={13} />
                        <span>
                          {q.answers} {isKn ? "ವಕೀಲರ ಉತ್ತರಗಳು" : "advocate answers"}
                        </span>
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
                        <span>{isKn ? "ನನ್ನ ಪ್ರಶ್ನೆ ಕೇಳಿ" : "Ask Similar Question"}</span>
                        <LegalIcon name="arrowRight" size={12} />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── 3. EXPERTS TAB ── */}
        {activeTab === "experts" && (
          <div className="lw-aq-experts-wrap">
            <div className="lw-aq-experts-header">
              <div className="lw-aq-step-pill">
                <LegalIcon name="shieldCheck" size={13} />
                <span>{isKn ? "ಪರಿಶೀಲಿತ ವಕೀಲರು" : "ACTIVE CONTRIBUTORS"}</span>
              </div>
              <h2 className="lw-aq-experts-title">
                {isKn ? "ಪ್ರಮುಖ ಉತ್ತರಿಸುವ ಪರಿಣಿತ ವಕೀಲರು" : "Top Contributing Advocates"}
              </h2>
              <p className="lw-aq-experts-subtitle">
                {isKn
                  ? "ಈ ಹಿರಿಯ ವಕೀಲರು ನಾಗರಿಕರ ಪ್ರಶ್ನೆಗಳಿಗೆ ಅತಿ ಹೆಚ್ಚು ಸ್ಪಷ್ಟ ಮಾರ್ಗದರ್ಶನ ನೀಡಿದ್ದಾರೆ. ನೇರ ಸಮಾಲೋಚನೆಗೆ ಸಂಪರ್ಕಿಸಿ."
                  : "Certified advocates with verified Bar Council credentials, prompt response rates, and high client ratings."}
              </p>
            </div>

            <div className="lw-aq-experts-grid">
              {EXPERT_ADVOCATES.map((adv) => (
                <div key={adv.name} className="lw-aq-expert-card">
                  <Avatar advocate={adv} initials={adv.initials} color={adv.color} size={68} />
                  <div className="lw-aq-expert-name">{adv.name}</div>
                  <div className="lw-aq-expert-spec">{adv.spec}</div>
                  <div className="lw-aq-expert-stats">
                    <span className="lw-aq-es-item">
                      <LegalIcon name="briefcase" size={13} />
                      <span>{adv.answers} {isKn ? "ಪ್ರಕರಣಗಳು" : "cases"}</span>
                    </span>
                    <span className="lw-aq-es-item">
                      <LegalIcon name="star" size={13} />
                      <span>{adv.rating || "4.9"}</span>
                    </span>
                    <span className="lw-aq-es-item">
                      <LegalIcon name="platform" size={13} />
                      <span>{adv.court || (isKn ? "ಜಿಲ್ಲಾ ನ್ಯಾಯಾಲಯ" : "High Court")}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="lw-aq-btn-primary"
                    style={{ marginTop: 14, width: "100%" }}
                    onClick={() =>
                      navigate(adv.email ? `/profile?email=${encodeURIComponent(adv.email)}` : `/find-lawyer`)
                    }
                  >
                    <span>{isKn ? "ನೇರ ಸಮಾಲೋಚನೆ ಪಡೆಯಿರಿ" : "Consult Advocate Now"}</span>
                    <LegalIcon name="arrowRight" size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom CTA Banner */}
      <section className="lw-aq-bottom-cta">
        <div className="lw-aq-bottom-cta-text">
          <h4>
            {isKn ? "ತುರ್ತು ಕಾನೂನು ನೆರವು ಅಥವಾ ವಕಾಲತ್ತು ಬೇಕೇ?" : "Need Urgent One-on-One Legal Assistance?"}
          </h4>
          <p>
            {isKn
              ? "ನಿಮ್ಮ ನಗರದ ಅನುಭವಿ ವಕೀಲರೊಂದಿಗೆ ತಕ್ಷಣವೇ ಚಾಟ್ ಮಾಡಿ ಅಥವಾ ನೇರ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ನಿಗದಿಪಡಿಸಿ."
              : "Connect directly with verified Advocates in your city for immediate legal representation, bail, or drafting."}
          </p>
        </div>
        <button
          type="button"
          className="lw-aq-bottom-cta-btn"
          onClick={() => navigate("/find-lawyer")}
        >
          <span>{isKn ? "ವಕೀಲರನ್ನು ಹುಡುಕಿ" : "Find an Advocate"}</span>
          <LegalIcon name="arrowRight" size={14} />
        </button>
      </section>
    </div>
  );
}