// ============================================================
//  LegalSectionNav.js — Top Navigation Header for the 4 Legal Sections
//  Sections:
//    1. Ask a Question (/legal-advice/ask-question)
//    2. Legal Documents (/legal-advice/documents)
//    3. Bare Acts (/legal-advice/bare-acts)
//    4. Legal News (/legal-advice/news)
// ============================================================

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getTheme, toggleTheme } from "../data/themeStore";
import "./LegalSectionNav.css";

const LEGAL_SECTIONS = [
  {
    id: "ask-question",
    path: "/legal-advice/ask-question",
    icon: "💬",
    labelEn: "Ask a Question",
    labelKn: "ಪ್ರಶ್ನೆ ಕೇಳಿ",
    badgeEn: "Expert Advice",
    badgeKn: "ವಕೀಲರ ಸಲಹೆ",
  },
  {
    id: "documents",
    path: "/legal-advice/documents",
    icon: "📑",
    labelEn: "Legal Documents",
    labelKn: "ಕಾನೂನು ದಾಖಲೆಗಳು",
    badgeEn: "20+ Drafts",
    badgeKn: "೨೦+ ಕರಡುಗಳು",
  },
  {
    id: "bare-acts",
    path: "/legal-advice/bare-acts",
    icon: "📜",
    labelEn: "Bare Acts & Codes",
    labelKn: "ಕಾನೂನು ಕಾಯಿದೆಗಳು",
    badgeEn: "BNS / BNSS 2023",
    badgeKn: "ಹೊಸ ಕಾಯ್ದೆಗಳು",
  },
  {
    id: "news",
    path: "/legal-advice/news",
    icon: "📰",
    labelEn: "Legal News & SC",
    labelKn: "ಕಾನೂನು ಸುದ್ದಿಗಳು",
    badgeEn: "Live Updates",
    badgeKn: "ತಾಜಾ ಅಪ್ಡೇಟ್",
  },
];

export default function LegalSectionNav({ activeSection }) {
  const location = useLocation();

  // Theme management
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    const handleThemeChange = (e) => {
      setTheme(e?.detail || getTheme());
    };
    window.addEventListener("law4u_theme_change", handleThemeChange);
    return () => window.removeEventListener("law4u_theme_change", handleThemeChange);
  }, []);

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  // Language management
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

  const handleToggleLang = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem("law4u_home_lang", newLang);
      window.dispatchEvent(new CustomEvent("law4u_lang_change", { detail: newLang }));
    } catch {}
  };

  const isKn = lang === "kn";

  // Determine which section is currently active
  const currentActive =
    activeSection ||
    (location.pathname.includes("ask-question")
      ? "ask-question"
      : location.pathname.includes("documents")
      ? "documents"
      : location.pathname.includes("bare-acts")
      ? "bare-acts"
      : location.pathname.includes("news")
      ? "news"
      : "");

  return (
    <nav className={`ls-nav-wrap ${theme === "dark" ? "ls-dark" : "ls-light"}`} aria-label="Legal Section Navigation">
      <div className="ls-nav-inner">
        {/* Left: Brand Badge */}
        <div className="ls-nav-brand">
          <span className="ls-brand-icon">⚖️</span>
          <div className="ls-brand-text">
            <span className="ls-brand-kicker">ADVOCATE HUB</span>
            <span className="ls-brand-title">
              {isKn ? "ಕಾನೂನು ವಿಭಾಗದ ೪ ಸೇವೆಗಳು" : "Legal Services & Knowledge"}
            </span>
          </div>
        </div>

        {/* Center: 4 Legal Section Pills */}
        <div className="ls-pills-scroll">
          {LEGAL_SECTIONS.map((sec) => {
            const isActive = currentActive === sec.id;
            return (
              <Link
                key={sec.id}
                to={sec.path}
                className={`ls-nav-pill ${isActive ? "active" : ""}`}
                title={isKn ? sec.labelKn : sec.labelEn}
              >
                <span className="ls-pill-icon">{sec.icon}</span>
                <span className="ls-pill-label">{isKn ? sec.labelKn : sec.labelEn}</span>
                <span className="ls-pill-badge">{isKn ? sec.badgeKn : sec.badgeEn}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Language & Theme Controls */}
        <div className="ls-nav-controls">
          {/* Language Switcher */}
          <div className="ls-lang-pill-wrap">
            <button
              type="button"
              className={`ls-lang-btn ${!isKn ? "active" : ""}`}
              onClick={() => handleToggleLang("en")}
              title="English"
            >
              EN
            </button>
            <button
              type="button"
              className={`ls-lang-btn ${isKn ? "active" : ""}`}
              onClick={() => handleToggleLang("kn")}
              title="ಕನ್ನಡ"
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="ls-theme-toggle-btn"
            onClick={handleToggleTheme}
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label="Toggle Dark and Light Theme"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}
