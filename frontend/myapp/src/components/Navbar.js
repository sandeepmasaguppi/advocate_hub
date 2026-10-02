import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { getTheme, toggleTheme } from "../data/themeStore";

// Professional SVG Icons matching Admin Console pattern (24x24 stroke-based)
const NAV_ICONS = {
  // Navigation Bar Section Icons
  navLawyer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  navAdvice: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h18" />
    </svg>
  ),
  navAbout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),

  // Legal Advice Items
  askQuestion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7" />
      <path d="M12 17h.01" />
    </svg>
  ),
  documents: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  bareActs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="14" y2="11" />
    </svg>
  ),
  news: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <rect x="10" y="6" width="8" height="4" rx="1" />
    </svg>
  ),

  // About Items
  aboutUs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  partners: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),

  // Lawyer Categories
  family: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 20v-1a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v1" />
      <circle cx="10" cy="8" r="3.5" />
      <path d="M21 20v-1a3 3 0 0 0-2-2.8" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
    </svg>
  ),
  criminal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  civil: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h18" />
    </svg>
  ),
  corporate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),

  // Chevrons & Indicators
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  advocate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  client: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

const LAWYER_CATEGORIES_EN = [
  { icon: NAV_ICONS.family, label: "Person / Family", desc: "Divorce, custody, marriage, adoption", path: "/find-lawyer?cat=family" },
  { icon: NAV_ICONS.criminal, label: "Criminal / Property", desc: "FIR, bail, property disputes, theft", path: "/find-lawyer?cat=criminal" },
  { icon: NAV_ICONS.civil, label: "Civil / Debt Matter", desc: "Civil suits, debt recovery, contracts", path: "/find-lawyer?cat=civil" },
  { icon: NAV_ICONS.corporate, label: "Corporate Law", desc: "Company, GST, tax, compliance", path: "/find-lawyer?cat=corporate" },
];

const LAWYER_CATEGORIES_KN = [
  { icon: NAV_ICONS.family, label: "ವ್ಯಕ್ತಿ / ಕುಟುಂಬ", desc: "ವಿಚ್ಛೇದನ, ಪಾಲನೆ, ವಿವಾಹ, ದತ್ತು", path: "/find-lawyer?cat=family" },
  { icon: NAV_ICONS.criminal, label: "ಕ್ರಿಮಿನಲ್ / ಆಸ್ತಿ", desc: "ಎಫ್‌ಐಆರ್, ಜಾಮೀನು, ಆಸ್ತಿ ವಿವಾದಗಳು", path: "/find-lawyer?cat=criminal" },
  { icon: NAV_ICONS.civil, label: "ಸಿವಿಲ್ / ಸಾಲ ಪ್ರಕರಣ", desc: "ಸಿವಿಲ್ ದಾವೆಗಳು, ಸಾಲ ವಸೂಲಾತಿ, ಒಪ್ಪಂದಗಳು", path: "/find-lawyer?cat=civil" },
  { icon: NAV_ICONS.corporate, label: "ಕಾರ್ಪೊರೇಟ್ ಕಾನೂನು", desc: "ಕಂಪನಿ, ಜಿಎಸ್‌ಟಿ, ತೆರಿಗೆ, ನಿಯಮಾವಳಿ", path: "/find-lawyer?cat=corporate" },
];

const LEGAL_ADVICE_EN = [
  { icon: NAV_ICONS.askQuestion, label: "Ask a Question", path: "/legal-advice/ask-question" },
  { icon: NAV_ICONS.documents, label: "Legal Documents", path: "/legal-advice/documents" },
  { icon: NAV_ICONS.bareActs, label: "Bare Acts", path: "/legal-advice/bare-acts" },
  { icon: NAV_ICONS.news, label: "Legal News", path: "/legal-advice/news" },
];

const LEGAL_ADVICE_KN = [
  { icon: NAV_ICONS.askQuestion, label: "ಪ್ರಶ್ನೆ ಕೇಳಿ", path: "/legal-advice/ask-question" },
  { icon: NAV_ICONS.documents, label: "ಕಾನೂನು ದಾಖಲೆಗಳು", path: "/legal-advice/documents" },
  { icon: NAV_ICONS.bareActs, label: "ಕಾನೂನು ಕಾಯಿದೆಗಳು", path: "/legal-advice/bare-acts" },
  { icon: NAV_ICONS.news, label: "ಕಾನೂನು ಸುದ್ದಿಗಳು", path: "/legal-advice/news" },
];

const ABOUT_EN = [
  { icon: NAV_ICONS.aboutUs, label: "About Us", path: "/aboutus" },
  { icon: NAV_ICONS.contact, label: "Contact", path: "/Contact" },
  { icon: NAV_ICONS.partners, label: "Partners", path: "/Partners" },
];

const ABOUT_KN = [
  { icon: NAV_ICONS.aboutUs, label: "ನಮ್ಮ ಬಗ್ಗೆ", path: "/aboutus" },
  { icon: NAV_ICONS.contact, label: "ಸಂಪರ್ಕಿಸಿ", path: "/Contact" },
  { icon: NAV_ICONS.partners, label: "ಪಾಲುದಾರರು", path: "/Partners" },
];

function Dropdown({ items, onClose }) {
  return (
    <div className="lw-dropdown-single-panel" onClick={(e) => e.stopPropagation()}>
      <div className="lw-dropdown-single-list">
        {items.map((item) => (
          <Link key={item.label} to={item.path} className="lw-dropdown-single-card" onClick={onClose}>
            <span className="lw-dropdown-single-icon">{item.icon}</span>
            <span className="lw-dropdown-single-label">{item.label}</span>
            <span className="lw-dropdown-single-arrow">{NAV_ICONS.arrowRight}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LawyerMegaMenu({ onClose, isKn }) {
  const navigate = useNavigate();
  const categories = isKn ? LAWYER_CATEGORIES_KN : LAWYER_CATEGORIES_EN;

  return (
    <div className="lw-mega-menu" onClick={(e) => e.stopPropagation()}>
      <div className="lw-mega-header">
        <div className="lw-mega-title-wrap">
          <span className="lw-mega-title-badge">{NAV_ICONS.navLawyer}</span>
          <div className="lw-mega-title-content">
            <div className="lw-mega-title">
              {isKn ? "ವಿಭಾಗವಾರು ವಕೀಲರನ್ನು ಹುಡುಕಿ" : "Find A Lawyer By Category"}
            </div>
            <div className="lw-mega-subtitle">
              {isKn
                ? "ಸೂಕ್ತ ವಕೀಲರನ್ನು ಹುಡುಕಲು ನಿಮ್ಮ ಕಾನೂನು ಪ್ರಕರಣದ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ"
                : "Choose your legal matter type to find the right advocate"}
            </div>
          </div>
        </div>
      </div>
      <div className="lw-mega-grid">
        {categories.map((cat) => (
          <Link key={cat.label} to={cat.path} className="lw-mega-card" onClick={onClose}>
            <span className="lw-mega-icon">{cat.icon}</span>
            <div className="lw-mega-card-body">
              <div className="lw-mega-card-top">
                <span className="lw-mega-card-label">{cat.label}</span>
                <span className="lw-mega-card-arrow">{NAV_ICONS.arrowRight}</span>
              </div>
              <div className="lw-mega-card-desc">{cat.desc}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="lw-mega-footer">
        <Link to="/find-lawyer" className="lw-mega-all" onClick={onClose}>
          <span>{isKn ? "ಎಲ್ಲಾ ವಕೀಲರನ್ನು ನೋಡಿ" : "View All Lawyers"}</span>
          <span className="lw-mega-all-arrow">{NAV_ICONS.arrowRight}</span>
        </Link>
        <button
          className="lw-mega-talk"
          onClick={() => {
            onClose();
            navigate("/talk-to-advocate");
          }}
        >
          <span className="lw-mega-talk-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 16, height: 16, verticalAlign: "middle" }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span>{isKn ? "ಈಗಲೇ ವಕೀಲರೊಂದಿಗೆ ಮಾತನಾಡಿ" : "Talk to a Lawyer Now"}</span>
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  // Safety guard against stale HMR chunks or legacy references
  const showScrollTop = false;

  const [openMenu, setOpenMenu] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

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
    window.addEventListener("storage", handleLang);
    return () => {
      window.removeEventListener("law4u_lang_change", handleLang);
      window.removeEventListener("storage", handleLang);
    };
  }, []);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem("law4u_home_lang", newLang);
      window.dispatchEvent(new CustomEvent("law4u_lang_change", { detail: newLang }));
    } catch {}
  };

  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const [theme, setNavTheme] = useState(getTheme);

  useEffect(() => {
    const handleTheme = (e) => {
      setNavTheme(e?.detail || getTheme());
    };
    window.addEventListener("law4u_theme_change", handleTheme);
    return () => window.removeEventListener("law4u_theme_change", handleTheme);
  }, []);

  const hoverTimeoutRef = useRef(null);

  const handleNavMouseEnter = (menu) => {
    if (window.innerWidth >= 992) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setIsProfileOpen(false);
      setOpenMenu(menu);
    }
  };

  const handleNavMouseLeave = () => {
    if (window.innerWidth >= 992) {
      hoverTimeoutRef.current = setTimeout(() => {
        setOpenMenu(null);
      }, 180);
    }
  };

  const toggle = (menu) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsProfileOpen(false);
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const toggleProfile = (e) => {
    if (e) e.stopPropagation();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setOpenMenu(null);
    setIsProfileOpen((prev) => !prev);
  };

  // Close all menus and mobile drawer when any link is clicked
  const handleLinkClick = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setOpenMenu(null);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Smoothly scroll back to the .home-page section and top: 0
  const scrollToHome = () => {
    // 1. Specifically scroll the home page container into view
    const homeEl = document.getElementById("home-page") || document.querySelector(".home-page") || document.querySelector(".lw-hero");
    if (homeEl && typeof homeEl.scrollIntoView === "function") {
      try {
        homeEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (err) {}
    }
    // 2. Window and document scroll
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } catch (err) {}
    try {
      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } catch (err) {}
    try {
      document.body.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } catch (err) {}
  };

  // When clicking Logo or Home, close menus and smoothly navigate/scroll to class="home-page"
  const handleHomeClick = (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    handleLinkClick();

    if (location.pathname === "/") {
      scrollToHome();
    } else {
      navigate("/");
      setTimeout(() => {
        scrollToHome();
      }, 60);
    }
  };

  // If a client is logged in and on client pages, hide the global navbar
  const clientId = Number(localStorage.getItem("law4u_client_id") || sessionStorage.getItem("law4u_client_id") || 0);
  if (clientId && (location.pathname === "/client-dashboard" || location.pathname.startsWith("/client"))) {
    return null;
  }

  const isKn = lang === "kn";
  const legalAdviceItems = isKn ? LEGAL_ADVICE_KN : LEGAL_ADVICE_EN;
  const aboutItems = isKn ? ABOUT_KN : ABOUT_EN;

  return (
    <nav
      className={`lw-navbar ${theme === "dark" ? "theme-dark is-dark" : "theme-light"}`}
      data-theme={theme}
      ref={navRef}
    >
        {/* ── Main 100% Full-Width Navbar (Black upper strip removed) ── */}
        <div className="lw-nav-inner">
          {/* Logo */}
          <Link to="/" className="lw-logo" onClick={handleHomeClick}>
            <BrandLogo size={34} dark={theme === "dark"} />
            <span className="lw-logo-tagline">
              {isKn ? "ಅತ್ಯುತ್ತಮ ಕಾನೂನು ವೇದಿಕೆ" : "Best Legal Platform"}
            </span>
          </Link>

        {/* Nav links (100% fluid) */}
        <div className={`lw-nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          {/* Mobile Settings Section: One row per setting */}
          <div className="lw-mobile-profile-details">
            {/* Row 1: Language */}
            <div className="lw-mobile-row">
              <span className="lw-mobile-label">🌐 {isKn ? "ಭಾಷೆ:" : "Language:"}</span>
              <div className="lw-mobile-lang-pills">
                <button
                  type="button"
                  className={`lw-mobile-lang-pill ${lang === "en" ? "active" : ""}`}
                  onClick={() => handleLangChange("en")}
                >
                  English
                </button>
                <button
                  type="button"
                  className={`lw-mobile-lang-pill ${lang === "kn" ? "active" : ""}`}
                  onClick={() => handleLangChange("kn")}
                >
                  ಕನ್ನಡ
                </button>
              </div>
            </div>

            {/* Row 2: Theme */}
            <div className="lw-mobile-row">
              <span className="lw-mobile-label">{theme === "dark" ? "🌙" : "☀️"} {isKn ? "ಥೀಮ್:" : "Theme:"}</span>
              <button
                type="button"
                className={`lw-mobile-theme-btn ${theme === "dark" ? "is-dark" : "is-light"}`}
                onClick={() => toggleTheme()}
                title={theme === "dark" ? (isKn ? "ಬೆಳಕಿನ ಥೀಮ್‌ಗೆ ಬದಲಿಸಿ" : "Switch to Light Theme") : (isKn ? "ಕಪ್ಪು ಥೀಮ್‌ಗೆ ಬದಲಿಸಿ" : "Switch to Dark Theme")}
              >
                <span>{theme === "dark" ? (isKn ? "☀️ ಬೆಳಕು (Light)" : "☀️ Light Mode") : (isKn ? "🌙 ಕಪ್ಪು (Dark)" : "🌙 Dark Mode")}</span>
              </button>
            </div>
          </div>

          <Link to="/" className="lw-nav-link" onClick={handleHomeClick}>
            {isKn ? "ಮುಖಪುಟ" : "Home"}
          </Link>

          {/* Find A Lawyer */}
          <div
            className="lw-nav-item"
            onMouseEnter={() => handleNavMouseEnter("lawyer")}
            onMouseLeave={handleNavMouseLeave}
          >
            <button
              type="button"
              className={`lw-nav-link lw-has-drop ${openMenu === "lawyer" ? "active" : ""}`}
              onClick={() => toggle("lawyer")}
              aria-expanded={openMenu === "lawyer"}
            >
              <span className="lw-nav-btn-icon">{NAV_ICONS.navLawyer}</span>
              <span>{isKn ? "ವಕೀಲರನ್ನು ಹುಡುಕಿ" : "Find A Lawyer"}</span>
              <span className="lw-nav-chevron">{NAV_ICONS.chevronDown}</span>
            </button>
            {openMenu === "lawyer" && <LawyerMegaMenu onClose={handleLinkClick} isKn={isKn} />}
          </div>

          {/* Legal Advice */}
          <div
            className="lw-nav-item"
            onMouseEnter={() => handleNavMouseEnter("advice")}
            onMouseLeave={handleNavMouseLeave}
          >
            <button
              type="button"
              className={`lw-nav-link lw-has-drop ${openMenu === "advice" ? "active" : ""}`}
              onClick={() => toggle("advice")}
              aria-expanded={openMenu === "advice"}
            >
              <span className="lw-nav-btn-icon">{NAV_ICONS.navAdvice}</span>
              <span>{isKn ? "ಕಾನೂನು ಸಲಹೆ" : "Legal Advice"}</span>
              <span className="lw-nav-chevron">{NAV_ICONS.chevronDown}</span>
            </button>
            {openMenu === "advice" && <Dropdown items={legalAdviceItems} onClose={handleLinkClick} />}
          </div>

          {/* About */}
          <div
            className="lw-nav-item"
            onMouseEnter={() => handleNavMouseEnter("about")}
            onMouseLeave={handleNavMouseLeave}
          >
            <button
              type="button"
              className={`lw-nav-link lw-has-drop ${openMenu === "about" ? "active" : ""}`}
              onClick={() => toggle("about")}
              aria-expanded={openMenu === "about"}
            >
              <span className="lw-nav-btn-icon">{NAV_ICONS.navAbout}</span>
              <span>{isKn ? "ನಮ್ಮ ಬಗ್ಗೆ" : "About"}</span>
              <span className="lw-nav-chevron">{NAV_ICONS.chevronDown}</span>
            </button>
            {openMenu === "about" && <Dropdown items={aboutItems} onClose={handleLinkClick} />}
          </div>

          {/* Sign Up & Admin links */}
          <Link to="/signup" className="lw-nav-link" onClick={handleLinkClick}>
            {isKn ? "ನೋಂದಣಿ" : "Sign Up"}
          </Link>
          <Link to="/admin" className="lw-nav-link" onClick={handleLinkClick}>
            {isKn ? "ಅಡ್ಮಿನ್" : "Admin"}
          </Link>

          {/* Mobile direct auth links inside drawer */}
          <div className="lw-mobile-auth-links">
            <Link to="/login" className="lw-nav-link lw-mobile-only" style={{ textDecoration: "none" }} onClick={handleLinkClick}>
              <span className="lw-mobile-btn-icon">{NAV_ICONS.advocate}</span>
              <span>{isKn ? "ವಕೀಲರ ಲಾಗಿನ್" : "Advocate Login"}</span>
            </Link>
            <Link to="/client-login" className="lw-nav-link lw-mobile-only" style={{ textDecoration: "none" }} onClick={handleLinkClick}>
              <span className="lw-mobile-btn-icon">{NAV_ICONS.client}</span>
              <span>{isKn ? "ಗ್ರಾಹಕರ ಲಾಗಿನ್" : "Client Login"}</span>
            </Link>
          </div>
        </div>

        {/* ── Right Actions: Profile / Three-Dot Settings Menu + Mobile Toggle ── */}
        <div className="lw-nav-right-actions">
          {/* Profile & Three-Dot Menu Trigger */}
          <div className="lw-nav-profile-wrapper" ref={profileRef}>
            <button
              type="button"
              className={`lw-nav-profile-btn ${isProfileOpen ? "active" : ""}`}
              onClick={toggleProfile}
              title={isKn ? "ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್ಸ್" : "Advocate Hub – Profile & Settings"}
              aria-label="Advocate Hub Profile and Settings"
              aria-expanded={isProfileOpen}
            >
              <span className="lw-profile-avatar-circle">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span className="lw-profile-dots-icon" aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="4" r="2.2" />
                  <circle cx="12" cy="12" r="2.2" />
                  <circle cx="12" cy="20" r="2.2" />
                </svg>
              </span>
            </button>

            {/* Profile Dropdown Opened on Click */}
            {isProfileOpen && (
              <div className="lw-profile-dropdown" onClick={(e) => e.stopPropagation()}>
                {/* Row 1: Language Switcher */}
                <div className="lw-profile-row">
                  <div className="lw-profile-row-label">
                    <span className="lw-row-icon">🌐</span>
                    <span>{isKn ? "ಭಾಷೆ" : "Language"}</span>
                  </div>
                  <div className="lw-profile-lang-pills">
                    <button
                      type="button"
                      className={`lw-profile-lang-pill ${lang === "en" ? "active" : ""}`}
                      onClick={() => handleLangChange("en")}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      className={`lw-profile-lang-pill ${lang === "kn" ? "active" : ""}`}
                      onClick={() => handleLangChange("kn")}
                    >
                      ಕನ್ನಡ
                    </button>
                  </div>
                </div>

                <div className="lw-profile-dropdown-divider" />

                {/* Row 2: Theme Switcher */}
                <div className="lw-profile-row">
                  <div className="lw-profile-row-label">
                    <span className="lw-row-icon">{theme === "dark" ? "🌙" : "☀️"}</span>
                    <span>{isKn ? "ಥೀಮ್" : "Theme"}</span>
                  </div>
                  <button
                    type="button"
                    className={`lw-profile-theme-toggle ${theme === "dark" ? "is-dark" : "is-light"}`}
                    onClick={() => toggleTheme()}
                    title={theme === "dark" ? (isKn ? "ಬೆಳಕಿನ ಥೀಮ್‌ಗೆ ಬದಲಿಸಿ" : "Switch to Light Theme") : (isKn ? "ಕಪ್ಪು ಥೀಮ್‌ಗೆ ಬದಲಿಸಿ" : "Switch to Dark Theme")}
                  >
                    <span className="lw-ptt-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
                    <span className="lw-ptt-text">
                      {theme === "dark" ? (isKn ? "ಬೆಳಕು (Light)" : "Light") : (isKn ? "ಕಪ್ಪು (Dark)" : "Dark")}
                    </span>
                  </button>
                </div>

                <div className="lw-profile-dropdown-divider" />

                {/* Row 3: Sign Up (Create Account) */}
                <div className="lw-profile-link-row">
                  <Link to="/signup" className="lw-profile-dropdown-link" style={{ textDecoration: "none" }} onClick={handleLinkClick}>
                    <div className="lw-pdl-left">
                      <span className="lw-pml-icon">✨</span>
                      <span>{isKn ? "ನೋಂದಣಿ (ಖಾತೆ ರಚಿಸಿ)" : "Sign Up (Create Account)"}</span>
                    </div>
                    <span className="lw-pdl-arrow">{NAV_ICONS.arrowRight}</span>
                  </Link>
                </div>

                <div className="lw-profile-dropdown-divider" />

                {/* Row 4: Advocate Login */}
                <div className="lw-profile-link-row">
                  <Link to="/login" className="lw-profile-dropdown-link" style={{ textDecoration: "none" }} onClick={handleLinkClick}>
                    <div className="lw-pdl-left">
                      <span className="lw-pml-icon lw-pml-svg">{NAV_ICONS.advocate}</span>
                      <span>{isKn ? "ವಕೀಲರ ಲಾಗಿನ್" : "Advocate Login"}</span>
                    </div>
                    <span className="lw-pdl-arrow">{NAV_ICONS.arrowRight}</span>
                  </Link>
                </div>

                <div className="lw-profile-dropdown-divider" />

                {/* Row 4: Client Login */}
                <div className="lw-profile-link-row">
                  <Link to="/client-login" className="lw-profile-dropdown-link" style={{ textDecoration: "none" }} onClick={handleLinkClick}>
                    <div className="lw-pdl-left">
                      <span className="lw-pml-icon lw-pml-svg">{NAV_ICONS.client}</span>
                      <span>{isKn ? "ಗ್ರಾಹಕರ ಲಾಗಿನ್" : "Client Login"}</span>
                    </div>
                    <span className="lw-pdl-arrow">{NAV_ICONS.arrowRight}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Menu Toggle Button for Mobile/Tabs */}
          <button 
            className="lw-menu-toggle" 
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </nav>
  );
}
