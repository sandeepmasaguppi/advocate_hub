/* eslint-disable */
// TermOfUse.js — Advocate Hub Official Terms and Conditions (Bilingual EN / KN)
// Compliant with Advocates Act 1961, BCI Rules, IT Act 2000, DPDP Act 2023, and Consumer Protection Act 2019
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import LegalIcon from "../components/LegalIcons";
import "./TermOfUse.css";

const LAST_UPDATED = "01 September 2026";
const EFFECTIVE_DATE = "01 September 2026";
const TERMS_VERSION = "1.0";
const EMAIL = "advocatehub.in@gmail.com";
const PHONE = "+91 91087 17353";
const INSTAGRAM = "@advocate__hub";
const WEBSITE_URL = "https://advocate-hub.up.railway.app/";

export const SECTIONS_META = [
  { id: "sec-1", num: 1, titleEn: "Introduction and Acceptance of Terms", titleKn: "ಪರಿಚಯ ಮತ್ತು ನಿಯಮಗಳ ಸ್ವೀಕಾರ", iconKey: "acceptance", icon: <LegalIcon name="acceptance" size={16} />, keywords: "acceptance agreement binding contract electronic 10a it act" },
  { id: "sec-2", num: 2, titleEn: "About Advocate Hub and Its Services", titleKn: "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ ಮತ್ತು ಅದರ ಸೇವೆಗಳ ಬಗ್ಗೆ", iconKey: "platform", icon: <LegalIcon name="platform" size={16} />, keywords: "about platform marketplace intermediary section 79 bci rule 36 law firm" },
  { id: "sec-3", num: 3, titleEn: "User Eligibility and Account Registration", titleKn: "ಬಳಕೆದಾರರ ಅರ್ಹತೆ ಮತ್ತು ಖಾತೆ ನೋಂದಣಿ", iconKey: "user", icon: <LegalIcon name="user" size={16} />, keywords: "eligibility 18 age contract credentials registration consent checkbox" },
  { id: "sec-4", num: 4, titleEn: "Client Responsibilities", titleKn: "ಗ್ರಾಹಕರ ಜವಾಬ್ದಾರಿಗಳು", iconKey: "client", icon: <LegalIcon name="client" size={16} />, keywords: "client responsibility truthfulness preliminary consultation conduct" },
  { id: "sec-5", num: 5, titleEn: "Advocate Registration and Professional Verification", titleKn: "ವಕೀಲರ ನೋಂದಣಿ ಮತ್ತು ವೃತ್ತಿಪರ ಪರಿಶೀಲನೆ", iconKey: "scale", icon: <LegalIcon name="scale" size={16} />, keywords: "advocate enrollment bar council sanad credentials impersonation verification" },
  { id: "sec-6", num: 6, titleEn: "Administrator Review and Approval", titleKn: "ನಿರ್ವಾಹಕರ ಪರಿಶೀಲನೆ ಮತ್ತು ಅನುಮೋದನೆ", iconKey: "shieldCheck", icon: <LegalIcon name="shieldCheck" size={16} />, keywords: "admin approval pending verification reject suspend badges review" },
  { id: "sec-7", num: 7, titleEn: "Advocate Profiles and Accuracy of Information", titleKn: "ವಕೀಲರ ಪ್ರೊಫೈಲ್‌ಗಳು ಮತ್ತು ಮಾಹಿತಿಯ ನಿಖರತೆ", iconKey: "profileAccuracy", icon: <LegalIcon name="profileAccuracy" size={16} />, keywords: "profile factual experience courts practice areas advertising prohibition" },
  { id: "sec-8", num: 8, titleEn: "Consultation Requests, Chat and Communication", titleKn: "ಸಮಾಲೋಚನೆ ವಿನಂತಿಗಳು, ಚಾಟ್ ಮತ್ತು ಸಂವಹನ", iconKey: "chat", icon: <LegalIcon name="chat" size={16} />, keywords: "consultation chat real-time messages intake confidentiality recording" },
  { id: "sec-9", num: 9, titleEn: "Fees, Payments, Cancellations and Refunds", titleKn: "ಶುಲ್ಕಗಳು, ಪಾವತಿಗಳು, ರದ್ದತಿ ಮತ್ತು ಮರುಪಾವತಿಗಳು", iconKey: "fees", icon: <LegalIcon name="fees" size={16} />, keywords: "fees payment platform charge advocate fee refund cancellation billing" },
  { id: "sec-10", num: 10, titleEn: "Legal Disclaimer and No Guarantee of Results", titleKn: "ಕಾನೂನು ಹಕ್ಕುತ್ಯಾಗ ಮತ್ತು ಫಲಿತಾಂಶದ ಯಾವುದೇ ಭರವಸೆ ಇಲ್ಲ", iconKey: "disclaimer", icon: <LegalIcon name="disclaimer" size={16} />, keywords: "disclaimer guarantee warranty results outcome ai assistant bare acts" },
  { id: "sec-11", num: 11, titleEn: "Advocate-Client Relationship", titleKn: "ವಕೀಲ-ಗ್ರಾಹಕ ಸಂಬಂಧ", iconKey: "relationship", icon: <LegalIcon name="relationship" size={16} />, keywords: "advocate client relationship vakalatnama independent intermediary safe harbor" },
  { id: "sec-12", num: 12, titleEn: "Privacy, Confidentiality and Personal Data", titleKn: "ಗೌಪ್ಯತೆ, ರಹಸ್ಯತೆ ಮತ್ತು ವೈಯಕ್ತಿಕ ದತ್ತಾಂಶ", iconKey: "lock", icon: <LegalIcon name="lock" size={16} />, keywords: "privacy dpdp act data security scrypt hash encryption otp personal data" },
  { id: "sec-13", num: 13, titleEn: "Uploaded Documents and Intellectual Property", titleKn: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಗಳು ಮತ್ತು ಬೌದ್ಧಿಕ ಆಸ್ತಿ", iconKey: "documents", icon: <LegalIcon name="documents" size={16} />, keywords: "documents case brief license intellectual property copyright trademarks" },
  { id: "sec-14", num: 14, titleEn: "Prohibited Activities and Fraud Prevention", titleKn: "ನಿಷೇಧಿತ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ವಂಚನೆ ತಡೆಗಟ್ಟುವಿಕೆ", iconKey: "prohibited", icon: <LegalIcon name="prohibited" size={16} />, keywords: "prohibited conduct fraud hacking scraping fake credentials impersonation" },
  { id: "sec-15", num: 15, titleEn: "Reporting, Complaints and Dispute Resolution", titleKn: "ವರದಿ ಮಾಡುವಿಕೆ, ದೂರುಗಳು ಮತ್ತು ವಿವಾದ ಪರಿಹಾರ", iconKey: "gavel", icon: <LegalIcon name="gavel" size={16} />, keywords: "grievance officer complaints dispute redressal consumer rights it rules" },
  { id: "sec-16", num: 16, titleEn: "Account Suspension and Termination", titleKn: "ಖಾತೆ ಅಮಾನತು ಮತ್ತು ರದ್ದತಿ", iconKey: "termination", icon: <LegalIcon name="termination" size={16} />, keywords: "suspension termination deactivation disciplinary bar council closure" },
  { id: "sec-17", num: 17, titleEn: "Service Availability and Third-Party Services", titleKn: "ಸೇವಾ ಲಭ್ಯತೆ ಮತ್ತು ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಸೇವೆಗಳು", iconKey: "availability", icon: <LegalIcon name="availability" size={16} />, keywords: "availability uptime maintenance sms whatsapp gateways hosting telecom" },
  { id: "sec-18", num: 18, titleEn: "Limitation of Liability, subject to applicable law", titleKn: "ಹೊಣೆಗಾರಿಕೆಯ ಮಿತಿ", iconKey: "liability", icon: <LegalIcon name="liability" size={16} />, keywords: "liability limitation direct damages caps statutory exceptions consumer law" },
  { id: "sec-19", num: 19, titleEn: "Amendments to Terms and Conditions", titleKn: "ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳಿಗೆ ತಿದ್ದುಪಡಿಗಳು", iconKey: "amendments", icon: <LegalIcon name="amendments" size={16} />, keywords: "amendments revisions updates notice changes modification version" },
  { id: "sec-20", num: 20, titleEn: "Governing Law and Jurisdiction in India", titleKn: "ಭಾರತದಲ್ಲಿ ಆಡಳಿತ ಕಾನೂನು ಮತ್ತು ನ್ಯಾಯವ್ಯಾಪ್ತಿ", iconKey: "governingLaw", icon: <LegalIcon name="governingLaw" size={16} />, keywords: "governing law jurisdiction bengaluru karnataka courts india" },
  { id: "sec-21", num: 21, titleEn: "Contact and Support Information", titleKn: "ಸಂಪರ್ಕ ಮತ್ತು ಬೆಂಬಲ ಮಾಹಿತಿ", iconKey: "contact", icon: <LegalIcon name="contact" size={16} />, keywords: "contact email phone support grievance officer helpdesk address" },
];

export default function TermsOfUse() {
  const navigate = useNavigate();
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("law4u_home_lang") || localStorage.getItem("law4u_terms_lang") || "en";
    } catch {
      return "en";
    }
  });
  const [activeSection, setActive] = useState("sec-1");
  const [showTOC, setTOC] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const sectionRefs = useRef({});
  const isKn = lang === "kn";

  const toggleLanguage = () => {
    const nextLang = isKn ? "en" : "kn";
    setLang(nextLang);
    try {
      localStorage.setItem("law4u_home_lang", nextLang);
      localStorage.setItem("law4u_terms_lang", nextLang);
      window.dispatchEvent(new CustomEvent("law4u_lang_change", { detail: nextLang }));
    } catch {}
  };

  // Scroll Progress and Back-To-Top listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setShowBackToTop(window.scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for sticky TOC highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
      setTOC(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copySectionLink = (id) => {
    const url = `${window.location.origin}/terms-and-conditions#${id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      });
    }
  };

  // Search filtering across the 21 sections
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS_META;
    const q = searchQuery.toLowerCase().trim();
    return SECTIONS_META.filter(
      (s) =>
        s.titleEn.toLowerCase().includes(q) ||
        s.titleKn.toLowerCase().includes(q) ||
        s.keywords.toLowerCase().includes(q) ||
        String(s.num).includes(q)
    );
  }, [searchQuery]);

  const currentSectionMeta = SECTIONS_META.find((s) => s.id === activeSection) || SECTIONS_META[0];

  return (
    <div className="tu-page-container">
      {/* ── STICKY READING SUB-BAR ── */}
      <nav className="tu-reading-bar" aria-label="Terms sub-navigation">
        <div className="tu-progress-line" style={{ width: `${scrollProgress}%` }} />
        <div className="tu-reading-bar-inner">
          <div className="tu-nav-left">
            <button
              type="button"
              className="tu-back-link"
              onClick={() => navigate("/")}
              title={isKn ? "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ" : "Back to Home"}
            >
              <LegalIcon name="arrowLeft" size={13} />
              <span>{isKn ? "ಮುಖಪುಟ" : "Home"}</span>
            </button>
            <div className="tu-active-section-pill">
              <LegalIcon name={currentSectionMeta.iconKey || "acceptance"} size={15} />
              <span>
                {isKn ? "ವಿಭಾಗ: " : "Viewing: "}
                <strong>
                  {currentSectionMeta.num}. {isKn ? currentSectionMeta.titleKn : currentSectionMeta.titleEn}
                </strong>
              </span>
            </div>
          </div>

          <div className="tu-nav-right">
            {/* Bilingual Switcher */}
            <button
              type="button"
              className="tu-lang-btn"
              onClick={toggleLanguage}
              title={isKn ? "Switch to English" : "ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಿ"}
            >
              <LegalIcon name="availability" size={14} />
              <span>{isKn ? "English" : "ಕನ್ನಡ"}</span>
            </button>

            <button
              type="button"
              className="tu-tool-btn"
              onClick={() => window.print()}
              title={isKn ? "ಮುದ್ರಿಸಿ" : "Print Document"}
            >
              <LegalIcon name="printer" size={14} />
              <span className="tu-hide-mobile">{isKn ? "ಮುದ್ರಿಸಿ" : "Print"}</span>
            </button>

            <button
              type="button"
              className="tu-tool-btn tu-tool-btn-primary"
              onClick={() => setTOC((prev) => !prev)}
              title={isKn ? "ವಿಷಯ ಸೂಚಿ ತೆರೆಯಿರಿ" : "Open Table of Contents"}
            >
              <LegalIcon name="toc" size={14} />
              <span>{isKn ? "ಸೂಚಿ" : "TOC"} ({SECTIONS_META.length})</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO BANNER ── */}
      <header className="tu-hero">
        <div className="tu-hero-inner">
          <div className="tu-hero-badge">
            <LegalIcon name="scale" size={15} />
            <span>{isKn ? "ಅಧಿಕೃತ ಕಾನೂನು ಒಪ್ಪಂದ" : "Official Legal Terms & Agreement"}</span>
          </div>
          <h1 className="tu-hero-title">
            {isKn ? "ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು" : "Terms and Conditions"}
          </h1>
          <p className="tu-hero-company">
            Advocate Hub Legal Services Platform •{" "}
            <span className="tu-placeholder-tag">[Entity Registration: Advocate Hub]</span>
          </p>

          <div className="tu-hero-meta-row">
            <div className="tu-hero-meta-pill">
              <LegalIcon name="calendar" size={14} />
              <span>{isKn ? "ಕೊನೆಯ ನವೀಕರಣ: " : "Last Updated: "}<strong>{LAST_UPDATED}</strong></span>
            </div>
            <div className="tu-hero-meta-pill">
              <LegalIcon name="pin" size={14} />
              <span>{isKn ? "ಆವೃತ್ತಿ: " : "Version: "}<strong>{TERMS_VERSION}</strong></span>
            </div>
            <div className="tu-hero-meta-pill">
              <LegalIcon name="check" size={14} />
              <span>{isKn ? "ಜಾರಿಗೆ ಬಂದ ದಿನಾಂಕ: " : "Effective Date: "}<strong>{EFFECTIVE_DATE}</strong></span>
            </div>
            <div className="tu-hero-meta-pill">
              <LegalIcon name="platform" size={14} />
              <span>{isKn ? "ಭಾರತೀಯ ಕಾಯ್ದೆಗಳ ಅನ್ವಯ" : "Governed by Indian Law"}</span>
            </div>
            <div className="tu-hero-meta-pill">
              <LegalIcon name="clock" size={14} />
              <span>{isKn ? "ಓದುವ ಸಮಯ: ~12 ನಿಮಿಷ" : "~12 min read"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── TRUST & COMPLIANCE HIGHLIGHTS STRIP ── */}
      <section className="tu-trust-bar">
        <div className="tu-trust-bar-inner">
          <div className="tu-trust-item">
            <LegalIcon name="indiaBadge" size={16} />
            <span>{isKn ? "ಭಾರತೀಯ ಕಾನೂನುಗಳ ಅನ್ವಯಿಕತೆ" : "Governed by Laws of India"}</span>
          </div>
          <div className="tu-trust-item">
            <LegalIcon name="scale" size={16} />
            <span>{isKn ? "ಬಾರ್ ಕೌನ್ಸಿಲ್ ನಿಯಮಾವಳಿಗಳಿಗೆ ಬದ್ಧ" : "BCI Rules & Ethics Aligned"}</span>
          </div>
          <div className="tu-trust-item">
            <LegalIcon name="shieldCheck" size={16} />
            <span>{isKn ? "ಐಟಿ ಕಾಯ್ದೆ ಕಲಂ 79 ರಕ್ಷಣೆ" : "IT Act Sec 79 Intermediary"}</span>
          </div>
          <div className="tu-trust-item">
            <LegalIcon name="lock" size={16} />
            <span>{isKn ? "ದತ್ತಾಂಶ ರಕ್ಷಣೆ (DPDP Act 2023)" : "DPDP Act 2023 Compliant"}</span>
          </div>
          <div className="tu-trust-item">
            <LegalIcon name="contact" size={16} />
            <span>{isKn ? "ದೂರು ಪರಿಹಾರ ಅಧಿಕಾರಿ ಲಭ್ಯತೆ" : "Statutory Grievance Officer"}</span>
          </div>
        </div>
      </section>

      {/* ── MAIN LAYOUT: SIDEBAR + CONTENT ── */}
      <div className="tu-layout">
        {/* DESKTOP/LAPTOP STICKY SIDEBAR */}
        <aside className="tu-sidebar" aria-label="Table of Contents">
          <div className="tu-sidebar-card">
            <div className="tu-sidebar-header">
              <div className="tu-sidebar-title-row">
                <span className="tu-sidebar-title">
                  {isKn ? "ಪೂರ್ಣ ವಿಷಯ ಸೂಚಿ" : "Table of Contents"}
                </span>
                <span className="tu-sidebar-count">{filteredSections.length} / 21</span>
              </div>
              <div className="tu-search-box">
                <span className="tu-search-icon"><LegalIcon name="search" size={14} /></span>
                <input
                  type="text"
                  className="tu-search-input"
                  placeholder={isKn ? "ವಿಭಾಗ ಹುಡುಕಿ (ಉದಾ: ಶುಲ್ಕ, ಪರಿಶೀಲನೆ)..." : "Filter sections (e.g. fees, verification)..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Filter sections"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="tu-search-clear"
                    onClick={() => setSearchQuery("")}
                    title="Clear filter"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <nav className="tu-nav-list">
              {filteredSections.map((sec) => (
                <button
                  type="button"
                  key={sec.id}
                  className={`tu-nav-item ${activeSection === sec.id ? "active" : ""}`}
                  onClick={() => scrollToSection(sec.id)}
                  title={isKn ? sec.titleKn : sec.titleEn}
                >
                  <span className="tu-nav-icon"><LegalIcon name={sec.iconKey} size={15} /></span>
                  <span className="tu-nav-label">
                    {sec.num}. {isKn ? sec.titleKn : sec.titleEn}
                  </span>
                </button>
              ))}

              {filteredSections.length === 0 && (
                <div style={{ padding: "16px 8px", textAlign: "center", fontSize: "0.82rem", color: "var(--tu-text-light)" }}>
                  {isKn ? `ಯಾವುದೇ ವಿಭಾಗ ಕಂಡುಬಂದಿಲ್ಲ "${searchQuery}"` : `No sections match "${searchQuery}"`}
                </div>
              )}
            </nav>

            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--tu-border-subtle)", display: "flex", flexDirection: "column", gap: 6 }}>
              <Link to="/privacy" className="tu-back-link" style={{ justifyContent: "center" }}>
                <LegalIcon name="lock" size={14} />
                <span>{isKn ? "ಗೌಪ್ಯತಾ ನೀತಿ ವೀಕ್ಷಿಸಿ" : "View Privacy Policy"}</span>
              </Link>
              <Link to="/Contact" className="tu-back-link" style={{ justifyContent: "center" }}>
                <LegalIcon name="contact" size={14} />
                <span>{isKn ? "ಸಂಪರ್ಕ ಬೆಂಬಲ" : "Contact Support"}</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN LEGAL DOCUMENT CONTENT */}
        <main className="tu-content">
          {/* STATUTORY LEGAL REVIEW NOTICE CALLOUT */}
          <section className="tu-legal-review-banner" aria-label="Legal Review Disclaimer">
            <div className="tu-legal-review-icon"><LegalIcon name="scale" size={24} /></div>
            <div className="tu-legal-review-body">
              <div className="tu-legal-review-title">
                {isKn ? "ಕಾನೂನು ಮತ್ತು ನಿಯಂತ್ರಕ ಪರಿಶೀಲನಾ ಸೂಚನೆ (Legal & Regulatory Review Notice)" : "Legal & Regulatory Review Notice (Operational Indian Law Draft)"}
              </div>
              <p style={{ margin: "0 0 6px" }}>
                {isKn
                  ? "ಈ ದಾಖಲೆಯನ್ನು ಭಾರತದ ಅನ್ವಯವಾಗುವ ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಕಾಯ್ದೆ ೨೦೦೦, ವಕೀಲರ ಕಾಯ್ದೆ ೧೯೬೧, ಬಾರ್ ಕೌನ್ಸಿಲ್ ಆಫ್ ಇಂಡಿಯಾ ನಿಯಮಾವಳಿಗಳು, ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ದತ್ತಾಂಶ ಸಂರಕ್ಷಣಾ ಕಾಯ್ದೆ ೨೦೨೩ ಮತ್ತು ಗ್ರಾಹಕ ಸಂರಕ್ಷಣಾ ಕಾಯ್ದೆ ೨೦೧೯ ರ ಮಾನದಂಡಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ರಚಿಸಲಾಗಿದೆ. ವೃತ್ತಿಪರ ವಕೀಲರ ಪ್ರಚಾರ ನಿರ್ಬಂಧಗಳು, ಮಧ್ಯವರ್ತಿ ಸುರಕ್ಷಾ ನಿಯಮಗಳು ಹಾಗೂ ವಿವಾದ ಪರಿಹಾರ ಷರತ್ತುಗಳ ಕುರಿತು ಅರ್ಹ ಭಾರತೀಯ ವಕೀಲರಿಂದ ಅಂತಿಮ ಕಾನೂನು ಪರಿಶೀಲನೆ ಬಾಕಿಯಿದೆ."
                  : "This terms document is drafted for operational deployment in the Republic of India under the Information Technology Act, 2000, Advocates Act, 1961, Bar Council of India (BCI) Rules, Digital Personal Data Protection Act, 2023 (DPDP), and Consumer Protection Act, 2019. This draft does not claim final judicial certification; all provisions—specifically advocate advertising prohibitions, platform intermediary liabilities, professional verification protocols, fee structures, and dispute resolution—remain subject to formal review by a qualified Indian legal counsel."}
              </p>
              <div style={{ fontSize: "0.8rem", color: "var(--tu-text-muted)" }}>
                {isKn
                  ? "ಯಾವುದೇ ಅಸಹಜ ಮಧ್ಯಸ್ಥಿಕೆ ಅಥವಾ ಗ್ರಾಹಕರ ಹಕ್ಕುಗಳ ವಜಾಗೊಳಿಸುವಿಕೆಯನ್ನು ಈ ಕರಡಿನಲ್ಲಿ ಸೇರಿಸಲಾಗಿಲ್ಲ."
                  : "No automatic forced arbitration, blanket consumer rights waiver, or unlawful limitation of statutory liability has been included."}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SECTION 1: Introduction and Acceptance of Terms
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-1" className="tu-section" ref={(el) => (sectionRefs.current["sec-1"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="acceptance" size={22} /></div>
                  <h2 className="tu-sec-title">
                    1. {isKn ? "ಪರಿಚಯ ಮತ್ತು ನಿಯಮಗಳ ಸ್ವೀಕಾರ" : "Introduction and Acceptance of Terms"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-1")}
                  title="Copy link to Section 1"
                >
                  {copiedId === "sec-1" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? `ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ ("Advocate Hub", "ವೇದಿಕೆ", "ನಾವು" ಅಥವಾ "ನಮ್ಮ") ವೆಬ್‌ಸೈಟ್ (${WEBSITE_URL}) ಮತ್ತು ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್‌ಗೆ ನಿಮ್ಮನ್ನು ಸ್ವಾಗತಿಸುತ್ತೇವೆ. ಈ ವೇದಿಕೆಯನ್ನು [ಸಂಸ್ಥೆಯ ಹೆಸರು: Advocate Hub / Entity Registration Pending] ನಿರ್ವಹಿಸುತ್ತಿದೆ.`
                    : `Welcome to Advocate Hub ("Advocate Hub", "Platform", "we", "us", or "our"), available at ${WEBSITE_URL} and affiliated mobile interfaces. The Platform is owned, maintained, and operated by [Entity Name: Advocate Hub / Entity Registration Pending] having its operational focal point in Bengaluru, Karnataka, India.`}
                </p>

                <p>
                  {isKn
                    ? "ಈ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು (\"ನಿಯಮಗಳು\") ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಕಾಯ್ದೆ, ೨೦೦೦ ರ ಕಲಂ ೧೦ಎ ಹಾಗೂ ಭಾರತೀಯ ಗುತ್ತಿಗೆ ಕಾಯ್ದೆ, ೧೮೭೨ ರ ಅಡಿಯಲ್ಲಿ ರಚಿಸಲಾದ ಕಾನೂನುಬದ್ಧ ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಒಪ್ಪಂದವಾಗಿದೆ. ಈ ವೇದಿಕೆಯನ್ನು ಪ್ರವೇಶಿಸುವ, ಬ್ರೌಸ್ ಮಾಡುವ ಅಥವಾ ನೋಂದಾಯಿಸಿಕೊಳ್ಳುವ ಮೂಲಕ ನೀವು ಈ ಎಲ್ಲಾ ನಿಯಮಗಳನ್ನು ಯಾವುದೇ ಬದಲಾವಣೆ ಇಲ್ಲದೆ ಸಂಪೂರ್ಣವಾಗಿ ಸ್ವೀಕರಿಸುತ್ತೀರಿ."
                    : "These Terms and Conditions (\"Terms\") constitute a legally binding electronic contract executed pursuant to Section 10A of the Information Technology Act, 2000 and the Indian Contract Act, 1872. By accessing, browsing, registering an account, utilizing the AI legal guidance features, or engaging in communication with legal professionals through Advocate Hub, you unconditionally acknowledge that you have read, understood, and agreed to be governed by these Terms and our companion Privacy Policy."}
                </p>

                <div className="tu-callout tu-callout-info">
                  <div className="tu-callout-icon"><LegalIcon name="info" size={18} /></div>
                  <div className="tu-callout-text">
                    <strong>{isKn ? "ಅಸಮ್ಮತಿಯ ಸಂದರ್ಭದಲ್ಲಿ: " : "Non-Acceptance Notice: "}</strong>
                    {isKn
                      ? "ನೀವು ಈ ನಿಯಮಗಳು ಅಥವಾ ಗೌಪ್ಯತಾ ನೀತಿಯ ಯಾವುದೇ ಷರತ್ತನ್ನು ಒಪ್ಪದಿದ್ದರೆ, ದಯವಿಟ್ಟು ಈ ವೇದಿಕೆಯನ್ನು ಬಳಸಬೇಡಿ ಮತ್ತು ನಿಮ್ಮ ಖಾತೆಯನ್ನು ತಕ್ಷಣ ರದ್ದುಗೊಳಿಸಿ."
                      : "If you do not agree with any provision contained in these Terms or our Privacy Policy, you must refrain from accessing, browsing, or creating an account on Advocate Hub immediately."}
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 2: About Advocate Hub and Its Services
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-2" className="tu-section" ref={(el) => (sectionRefs.current["sec-2"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="platform" size={22} /></div>
                  <h2 className="tu-sec-title">
                    2. {isKn ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ ಮತ್ತು ಅದರ ಸೇವೆಗಳ ಬಗ್ಗೆ" : "About Advocate Hub and Its Services"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-2")}
                  title="Copy link to Section 2"
                >
                  {copiedId === "sec-2" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ ಒಂದು ಡಿಜಿಟಲ್ ತಂತ್ರಜ್ಞಾನ ವೇದಿಕೆಯಾಗಿದ್ದು (Electronic Intermediary), ಇದು ನಾಗರಿಕರು/ಗ್ರಾಹಕರಿಗೆ ಭಾರತದ ವಿವಿಧ ನ್ಯಾಯಾಲಯಗಳಲ್ಲಿ ನೋಂದಾಯಿತ ವಕೀಲರನ್ನು ಹುಡುಕಲು ಮತ್ತು ಅವರೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ ಸಾಧಿಸಲು ತಾಂತ್ರಿಕ ಸೌಲಭ್ಯವನ್ನು ಒದಗಿಸುತ್ತದೆ."
                    : "Advocate Hub operates strictly as a digital legal marketplace and technology intermediary as defined under Section 2(1)(w) of the Information Technology Act, 2000. The Platform provides technological infrastructure facilitating discovery, profile indexing, initial intake coordination, legal information awareness (Bare Acts, legal news, situational clarity guides), and bi-directional communications between independent legal practitioners and individuals seeking legal assistance."}
                </p>

                <div className="tu-callout tu-callout-warning">
                  <div className="tu-callout-icon"><LegalIcon name="scale" size={18} /></div>
                  <div className="tu-callout-text">
                    <strong>{isKn ? "ಪ್ರಮುಖ ಕಾನೂನು ಸ್ಪಷ್ಟೀಕರಣ: " : "Crucial Statutory Disclaimer: "}</strong>
                    {isKn
                      ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ ಯಾವುದೇ ಕಾನೂನು ಸಂಸ್ಥೆಯಲ್ಲ (Not a Law Firm). ನಾವು ನೇರವಾಗಿ ಯಾವುದೇ ನ್ಯಾಯಾಲಯದಲ್ಲಿ ವಕಾಲತ್ತು ವಹಿಸುವುದಿಲ್ಲ ಅಥವಾ ಕಾನೂನು ಸಲಹೆ ನೀಡುವುದಿಲ್ಲ. ಭಾರತೀಯ ಬಾರ್ ಕೌನ್ಸಿಲ್ (BCI) ನಿಯಮಾವಳಿಗಳ ಕಲಂ ೩೬ ರ ಪ್ರಕಾರ ಯಾವುದೇ ವಕೀಲರ ಪರವಾಗಿ ಜಾಹೀರಾತು ನೀಡುವುದು ಅಥವಾ ಕಕ್ಷಿದಾರರನ್ನು ಆಕರ್ಷಿಸುವುದು ನಮ್ಮ ಉದ್ದೇಶವಲ್ಲ."
                      : "Advocate Hub is NOT a law firm and does NOT engage in the practice of law. We do not provide formal legal representation, solicit clients on behalf of any advocate, or split legal fees in violation of the Advocates Act, 1961 or Rule 36 of Chapter II, Part VI of the Bar Council of India (BCI) Rules. The Platform acts solely as a passive conduit and directory intermediary."}
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 3: User Eligibility and Account Registration
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-3" className="tu-section" ref={(el) => (sectionRefs.current["sec-3"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="user" size={22} /></div>
                  <h2 className="tu-sec-title">
                    3. {isKn ? "ಬಳಕೆದಾರರ ಅರ್ಹತೆ ಮತ್ತು ಖಾತೆ ನೋಂದಣಿ" : "User Eligibility and Account Registration"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-3")}
                  title="Copy link to Section 3"
                >
                  {copiedId === "sec-3" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ವೇದಿಕೆಯಲ್ಲಿ ಖಾತೆ ರಚಿಸಲು ನೀವು ಕನಿಷ್ಠ ೧೮ ವರ್ಷ ವಯಸ್ಸಿನವರಾಗಿರಬೇಕು ಮತ್ತು ಭಾರತೀಯ ಗುತ್ತಿಗೆ ಕಾಯ್ದೆ, ೧೮೭೨ ರ ಅಡಿಯಲ್ಲಿ ಒಪ್ಪಂದ ಮಾಡಿಕೊಳ್ಳಲು ಕಾನೂನುಬದ್ಧ ಅರ್ಹತೆ ಹೊಂದಿರಬೇಕು."
                    : "To create an account or utilize services on Advocate Hub, you must be a natural person at least eighteen (18) years of age, mentally competent, and fully qualified to enter into legally enforceable contracts under the Indian Contract Act, 1872."}
                </p>

                <h3 className="tu-subhead">
                  {isKn ? "ನೋಂದಣಿ ಮತ್ತು ಸಮ್ಮತಿ ಪರಿಶೀಲನೆ (Mandatory Consent)" : "Registration and Mandatory Consent Protocol"}
                </h3>
                <ul className="tu-list">
                  <li>
                    <strong>{isKn ? "ಸ್ಪಷ್ಟ ಸಮ್ಮತಿ ಚೆಕ್‌ಬಾಕ್ಸ್: " : "Mandatory Unchecked Consent: "}</strong>
                    {isKn
                      ? "ಖಾತೆಯನ್ನು ನೋಂದಾಯಿಸುವಾಗ ಬಳಕೆದಾರರು 'ನಾನು ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು ಹಾಗೂ ಗೌಪ್ಯತಾ ನೀತಿಯನ್ನು ಓದಿದ್ದೇನೆ ಮತ್ತು ಒಪ್ಪುತ್ತೇನೆ' ಎಂಬ ಚೆಕ್‌ಬಾಕ್ಸ್ ಅನ್ನು ಖುದ್ದಾಗಿ ಕ್ಲಿಕ್ ಮಾಡುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ. ಈ ಚೆಕ್‌ಬಾಕ್ಸ್ ಪೂರ್ವನಿಯೋಜಿತವಾಗಿ ಆಯ್ಕೆಯಾಗಿರುವುದಿಲ್ಲ (Unchecked by default)."
                      : "All users (both clients and advocates) must actively and voluntarily check the affirmative consent box: \"I have read and agree to the Terms and Conditions and Privacy Policy\". This checkbox is never pre-checked by default, and registration cannot proceed without this explicit user action."}
                  </li>
                  <li>
                    <strong>{isKn ? "ಸಮ್ಮತಿಯ ದಾಖಲಾತಿ: " : "Cryptographic Consent Logging: "}</strong>
                    {isKn
                      ? "ಬಳಕೆದಾರರು ನಿಯಮಗಳನ್ನು ಒಪ್ಪಿಕೊಂಡ ಸಮಯ, ದಿನಾಂಕ ಮತ್ತು ನಿಯಮಗಳ ಆವೃತ್ತಿಯನ್ನು (Version 1.0) ಹಿನ್ನೆಲೆ ದತ್ತಸಂಚಯದಲ್ಲಿ (Backend Database) ಶಾಶ್ವತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ."
                      : "Upon submission, the Platform backend securely logs the affirmative consent flag (`termsAccepted: true`), the exact ISO timestamp (`termsAcceptedAt`), and the corresponding document version (`termsVersion: '1.0'`) as an immutable compliance audit trail."}
                  </li>
                  <li>
                    <strong>{isKn ? "ಖಾತೆ ಭದ್ರತೆ: " : "Credential Confidentiality: "}</strong>
                    {isKn
                      ? "ಬಳಕೆದಾರರು ತಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತು ಲಾಗಿನ್ ವಿವರಗಳ ರಹಸ್ಯತೆಯನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ಸ್ವತಃ ಜವಾಬ್ದಾರರಾಗಿರುತ್ತಾರೆ. ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು ಕೇವಲ ಒನ್‌ವೇ scrypt ಹ್ಯಾಶ್‌ಗಳಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ."
                      : "Users are exclusively responsible for safeguarding their login credentials. Passwords are encrypted as one-way scrypt hashes and never stored in plain-text. Any unauthorized session activity must be reported immediately."}
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 4: Client Responsibilities
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-4" className="tu-section" ref={(el) => (sectionRefs.current["sec-4"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="client" size={22} /></div>
                  <h2 className="tu-sec-title">
                    4. {isKn ? "ಗ್ರಾಹಕರ ಜವಾಬ್ದಾರಿಗಳು" : "Client Responsibilities"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-4")}
                  title="Copy link to Section 4"
                >
                  {copiedId === "sec-4" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ವೇದಿಕೆಯನ್ನು ಬಳಸುವ ಕಕ್ಷಿದಾರರು/ಗ್ರಾಹಕರು ಈ ಕೆಳಗಿನ ಜವಾಬ್ದಾರಿಗಳನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಪಾಲಿಸಬೇಕು:"
                    : "Clients using Advocate Hub to seek legal clarity or engage advocates undertake to adhere to the following operational commitments:"}
                </p>

                <ul className="tu-list">
                  <li>
                    <strong>{isKn ? "ಸತ್ಯವಾದ ವಿವರಗಳು: " : "Truthfulness of Inquiries: "}</strong>
                    {isKn
                      ? "ತಮ್ಮ ಕಾನೂನು ಪ್ರಶ್ನೆ ಅಥವಾ ವಿವಾದದ ವಿವರಗಳನ್ನು ನಿಖರವಾಗಿ, ಸತ್ಯವಾಗಿ ಮತ್ತು ಪ್ರಾಮಾಣಿಕವಾಗಿ ಒದಗಿಸಬೇಕು."
                      : "Clients must submit truthful, accurate, and non-misleading factual narratives regarding their legal questions or ongoing legal disputes."}
                  </li>
                  <li>
                    <strong>{isKn ? "ಪ್ರಾಥಮಿಕ ಸಮಾಲೋಚನೆ ಮಿತಿ: " : "Preliminary Nature of Online Sessions: "}</strong>
                    {isKn
                      ? "ಆನ್‌ಲೈನ್ ಚಾಟ್ ಅಥವಾ ಪ್ರಾಥಮಿಕ ಸಮಾಲೋಚನೆಯು ಕೇವಲ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರವಾಗಿದ್ದು, ವಕಾಲತ್ತುನಾಮೆ ಸಲ್ಲಿಸಿ ಅಧಿಕೃತವಾಗಿ ನಿಯೋಜಿಸುವವರೆಗೆ ನ್ಯಾಯಾಲಯದ ಪ್ರಾತಿನಿಧ್ಯವಾಗಿ ಪರಿಗಣಿಸಲಾಗುವುದಿಲ್ಲ."
                      : "Clients recognize that platform discussions are exploratory and informational. A chat message or phone exchange does not constitute a formal court engagement until terms of retainer and appropriate Vakalatnama are mutually signed."}
                  </li>
                  <li>
                    <strong>{isKn ? "ವೃತ್ತಿಪರ ನಡವಳಿಕೆ: " : "Respectful Conduct: "}</strong>
                    {isKn
                      ? "ವಕೀಲರೊಂದಿಗೆ ವೃತ್ತಿಪರವಾಗಿ ಮತ್ತು ಗೌರವಯುತವಾಗಿ ಸಂವಹನ ನಡೆಸಬೇಕು. ನಿಂದನೀಯ ಭಾಷೆ, ಬೆದರಿಕೆ ಅಥವಾ ಅಸಭ್ಯ ವರ್ತನೆಯನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ."
                      : "Clients must communicate respectfully with advocates. Abuse, harassment, offensive conduct, or defamation will result in immediate permanent account termination."}
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 5: Advocate Registration and Professional Verification
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-5" className="tu-section" ref={(el) => (sectionRefs.current["sec-5"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="scale" size={22} /></div>
                  <h2 className="tu-sec-title">
                    5. {isKn ? "ವಕೀಲರ ನೋಂದಣಿ ಮತ್ತು ವೃತ್ತಿಪರ ಪರಿಶೀಲನೆ" : "Advocate Registration and Professional Verification"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-5")}
                  title="Copy link to Section 5"
                >
                  {copiedId === "sec-5" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ವಕೀಲರಾಗಿ ನೋಂದಾಯಿಸಿಕೊಳ್ಳಲು ವ್ಯಕ್ತಿಯು ಭಾರತದ ಯಾವುದೇ ರಾಜ್ಯ ಬಾರ್ ಕೌನ್ಸಿಲ್‌ನಲ್ಲಿ (State Bar Council) ವಕೀಲರ ಕಾಯ್ದೆ ೧೯೬೧ ರ ಅಡಿಯಲ್ಲಿ ಮಾನ್ಯತೆ ಪಡೆದ ವಕೀಲರಾಗಿರಬೇಕು (Advocate on Rolls)."
                    : "Individuals registering as Advocates on Advocate Hub warrant and represent that they are duly enrolled legal practitioners admitted to the rolls of a State Bar Council established under the Advocates Act, 1961, holding an active, unrevoked license to practice law in the Republic of India."}
                </p>

                <h3 className="tu-subhead">
                  {isKn ? "ಕಡ್ಡಾಯ ವೃತ್ತಿಪರ ದಾಖಲೆಗಳು ಮತ್ತು ವಿವರಗಳು:" : "Mandatory Professional Credentials Required:"}
                </h3>
                <ul className="tu-list">
                  <li>
                    <strong>{isKn ? "ಬಾರ್ ನೋಂದಣಿ ಸಂಖ್ಯೆ (Sanad ID): " : "Bar Enrollment Number: "}</strong>
                    {isKn
                      ? "ಮಾನ್ಯ ಬಾರ್ ನೋಂದಣಿ ಸಂಖ್ಯೆ (ಉದಾ: KAR/1234/2018 ಅಥವಾ BCI ಮಾನ್ಯತೆ) ಸಲ್ಲಿಸುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ."
                      : "Advocates must provide their authentic Bar Council Enrollment Number (e.g., KAR/1234/2018 or corresponding State roll identifier)."}
                  </li>
                  <li>
                    <strong>{isKn ? "ವಕಾಲತ್ತು ನ್ಯಾಯಾಲಯ ಮತ್ತು ಕ್ಷೇತ್ರಗಳು: " : "Practice Courts and Fields: "}</strong>
                    {isKn
                      ? "ಅಭ್ಯಾಸ ನಡೆಸುವ ಜಿಲ್ಲೆ, ತಾಲೂಕು, ಹೈಕೋರ್ಟ್ ಪೀಠ ಮತ್ತು ಪರಿಣತಿ ಹೊಂದಿರುವ ಕಾನೂನು ಕ್ಷೇತ್ರಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ನಮೂದಿಸಬೇಕು."
                      : "Accurate details regarding jurisdictional courts (Supreme Court, High Court Benches, District & Sessions Courts, or Taluk JMFCs) and specialized practice areas must be submitted."}
                  </li>
                  <li>
                    <strong>{isKn ? "ಸುಳ್ಳು ಹಕ್ಕುಗಳ ನಿಷೇಧ: " : "Zero Impersonation Tolerance: "}</strong>
                    {isKn
                      ? "ವಕೀಲರಲ್ಲದ ವ್ಯಕ್ತಿಗಳು ವಕೀಲರೆಂದು ಸುಳ್ಳು ಹೇಳಿಕೊಳ್ಳುವುದನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ. ಅಂತಹ ದುಷ್ಕೃತ್ಯವು ಭಾರತೀಯ ನ್ಯಾಯ ಸಂಹಿತೆ (BNS) ಮತ್ತು ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಕಾಯ್ದೆಯಡಿ ಕ್ರಿಮಿನಲ್ ಅಪರಾಧವಾಗಿದೆ."
                      : "Any false claim of advocate status or impersonation of a legal practitioner is strictly prohibited and constitutes an offence punishable under Section 66D of the IT Act, 2000 and Section 319 of Bharatiya Nyaya Sanhita (BNS). Violators will be immediately reported to law enforcement and the Bar Council."}
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 6: Administrator Review and Approval
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-6" className="tu-section" ref={(el) => (sectionRefs.current["sec-6"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="shieldCheck" size={22} /></div>
                  <h2 className="tu-sec-title">
                    6. {isKn ? "ನಿರ್ವಾಹಕರ ಪರಿಶೀಲನೆ ಮತ್ತು ಅನುಮೋದನೆ" : "Administrator Review and Approval"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-6")}
                  title="Copy link to Section 6"
                >
                  {copiedId === "sec-6" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ವಕೀಲರ ಖಾತೆಗಳ ಸುರಕ್ಷತೆ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹತೆಗಾಗಿ ವೇದಿಕೆಯಲ್ಲಿ ಕಟ್ಟುನಿಟ್ಟಾದ ನಿರ್ವಾಹಕ ಪರಿಶೀಲನಾ ವ್ಯವಸ್ಥೆ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ:"
                    : "To preserve institutional trust and comply with statutory standards, Advocate Hub enforces an administrative review protocol for all legal professional onboarding:"}
                </p>

                <ul className="tu-list">
                  <li>
                    <strong>{isKn ? "ಬಾಕಿ ಉಳಿದ ಸ್ಥಿತಿ (Pending Approval): " : "Mandatory Pending Approval State: "}</strong>
                    {isKn
                      ? "ಹೊಸದಾಗಿ ನೋಂದಾಯಿಸಿದ ಪ್ರತಿಯೊಂದು ವಕೀಲರ ಖಾತೆಯು ನಿರ್ವಾಹಕರು ಪರಿಶೀಲಿಸುವವರೆಗೆ 'Pending Approval' ಸ್ಥಿತಿಯಲ್ಲಿರುತ್ತದೆ. ಸಾರ್ವಜನಿಕ ಡೈರೆಕ್ಟರಿಯಲ್ಲಿ ಸಂಪೂರ್ಣ ವಿವರಗಳು ಗೋಚರಿಸುವುದಿಲ್ಲ."
                      : "New advocate accounts display a 'Pending Approval' (`pending_admin_approval`) status until verified and approved by an administrator. Unapproved accounts cannot be discovered in public directories or accept bookings."}
                  </li>
                  <li>
                    <strong>{isKn ? "ಪರಿಶೀಲಿತ ಸ್ಥಿತಿ (Verified Status): " : "Verified Listing Restriction: "}</strong>
                    {isKn
                      ? "ನಿರ್ವಾಹಕರು ಬಾರ್ ಕೌನ್ಸಿಲ್ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಅನುಮೋದಿಸಿದ ನಂತರವೇ ಖಾತೆಗೆ 'Verified' ಬ್ಯಾಡ್ಜ್ ನೀಡಲಾಗುತ್ತದೆ."
                      : "Only advocates approved by an administrator receive the verified status badge and appear in verified search listings across the platform."}
                  </li>
                  <li>
                    <strong>{isKn ? "ತಿರಸ್ಕರಿಸುವ ಮತ್ತು ಅಮಾನತುಗೊಳಿಸುವ ಹಕ್ಕು: " : "Discretion to Reject or Suspend: "}</strong>
                    {isKn
                      ? "ದಾಖಲೆಗಳು ಅಸ್ಪಷ್ಟವಾಗಿದ್ದರೆ, ತಪ್ಪಾಗಿದ್ದರೆ ಅಥವಾ ಬಾರ್ ಕೌನ್ಸಿಲ್ ನಿಯಮಾವಳಿಗಳಿಗೆ ವಿರುದ್ಧವಾಗಿದ್ದರೆ ನಿರ್ವಾಹಕರು ಅರ್ಜಿಯನ್ನು ತಿರಸ್ಕರಿಸುವ ಅಥವಾ ಹೆಚ್ಚಿನ ದಾಖಲೆಗಳನ್ನು ಕೇಳುವ ಅಧಿಕಾರ ಹೊಂದಿರುತ್ತಾರೆ."
                      : "Platform administrators hold full authority to reject, suspend, or request supplemental verification documentation from applicants in accordance with published platform compliance guidelines."}
                  </li>
                  <li>
                    <strong>{isKn ? "ಯಾವುದೇ ದಕ್ಷತೆಯ ಖಾತರಿ ಇಲ್ಲ: " : "No Guarantee of Competence or Outcome: "}</strong>
                    {isKn
                      ? "ವೇದಿಕೆಯ ಪರಿಶೀಲನೆಯು ಕೇವಲ ಗುರುತು ಮತ್ತು ನೋಂದಣಿಯ ಪರಿಶೀಲನೆಯಾಗಿದ್ದು, ವಕೀಲರ ವೈಯಕ್ತಿಕ ದಕ್ಷತೆ, ನ್ಯಾಯಾಲಯದ ನಡವಳಿಕೆ ಅಥವಾ ಪ್ರಕರಣದ ಫಲಿತಾಂಶದ ಯಾವುದೇ ಗ್ಯಾರಂಟಿ ನೀಡುವುದಿಲ್ಲ."
                      : "Verification by Advocate Hub represents an administrative review of submitted enrollment details and must NOT be interpreted as a guarantee, warranty, or endorsement of an advocate's legal competence, conduct, or case result."}
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 7: Advocate Profiles and Accuracy of Information
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-7" className="tu-section" ref={(el) => (sectionRefs.current["sec-7"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="profileAccuracy" size={22} /></div>
                  <h2 className="tu-sec-title">
                    7. {isKn ? "ವಕೀಲರ ಪ್ರೊಫೈಲ್‌ಗಳು ಮತ್ತು ಮಾಹಿತಿಯ ನಿಖರತೆ" : "Advocate Profiles and Accuracy of Information"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-7")}
                  title="Copy link to Section 7"
                >
                  {copiedId === "sec-7" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ವಕೀಲರ ಪ್ರೊಫೈಲ್‌ಗಳಲ್ಲಿ ಅವರ ನೈಜ ಅನುಭವ, ಅಭ್ಯಾಸ ಕ್ಷೇತ್ರಗಳು, ನ್ಯಾಯಾಲಯದ ಹಂತಗಳು ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ಪ್ರದರ್ಶಿಸಲಾಗುತ್ತದೆ."
                    : "Advocate profiles displayed on the platform are restricted to objective, factual professional data: name, enrollment year, designated bar council, recognized practice fields, primary courts of appearance, spoken languages, and contact channels."}
                </p>

                <p>
                  {isKn
                    ? "ಬಾರ್ ಕೌನ್ಸಿಲ್ ನಿಯಮ ೩೬ ರ ಪ್ರಕಾರ ಯಾವುದೇ ರೀತಿಯ ಸ್ವಯಂ-ಪ್ರಶಂಸೆ, ಅತಿಶಯೋಕ್ತಿ, 'ನಂಬರ್ ೧ ವಕೀಲ' ಅಥವಾ '೧೦೦% ಗೆಲುವಿನ ಖಾತರಿ' ಎಂಬಂತಹ ಜಾಹೀರಾತು ರೂಪದ ಪ್ರಚಾರಗಳನ್ನು ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಪ್ರಕಟಿಸುವುದನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ."
                    : "In strict conformity with Bar Council of India standards, advocate profiles must avoid self-laudatory superlatives, comparative marketing, misleading win-rate assertions, or commercial solicitations. Advocates are legally responsible for maintaining the accuracy of all information displayed on their profiles."}
                </p>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 8: Consultation Requests, Chat and Communication
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-8" className="tu-section" ref={(el) => (sectionRefs.current["sec-8"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="chat" size={22} /></div>
                  <h2 className="tu-sec-title">
                    8. {isKn ? "ಸಮಾಲೋಚನೆ ವಿನಂತಿಗಳು, ಚಾಟ್ ಮತ್ತು ಸಂವಹನ" : "Consultation Requests, Chat and Communication"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-8")}
                  title="Copy link to Section 8"
                >
                  {copiedId === "sec-8" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ವೇದಿಕೆಯು ಕಕ್ಷಿದಾರ ಮತ್ತು ವಕೀಲರ ನಡುವೆ ಸುರಕ್ಷಿತ ನೈಜ-ಸಮಯದ (Real-time Socket) ಚಾಟ್ ಮತ್ತು ಸಮಾಲೋಚನೆ ಸೌಲಭ್ಯವನ್ನು ಒದಗಿಸುತ್ತದೆ."
                    : "Advocate Hub provides an integrated, bi-directional encrypted messaging environment allowing clients and advocates to coordinate consultations, transmit intake summaries, and discuss initial matters."}
                </p>

                <ul className="tu-list">
                  <li>
                    <strong>{isKn ? "ಸಂವಹನ ಗೌಪ್ಯತೆ: " : "Confidentiality & Session Access: "}</strong>
                    {isKn
                      ? "ಚಾಟ್ ಸಂದೇಶಗಳನ್ನು ಕೇವಲ ಸಂಬಂಧಪಟ್ಟ ಕಕ್ಷಿದಾರ ಮತ್ತು ವಕೀಲರಿಗೆ ಮಾತ್ರ ಪ್ರವೇಶಿಸಲು ಅವಕಾಶವಿರುತ್ತದೆ. ಯಾವುದೇ ಅನಧಿಕೃತ ಮೂರನೇ ವ್ಯಕ್ತಿಗೆ ಸಂದೇಶಗಳು ಗೋಚರಿಸುವುದಿಲ್ಲ."
                      : "Messages are restricted to the authorized client and advocate participating in the active conversation thread. Unauthorized third parties cannot access private chat sessions."}
                  </li>
                  <li>
                    <strong>{isKn ? "ರೆಕಾರ್ಡಿಂಗ್ ಮತ್ತು ಹಂಚಿಕೆ ನಿಷೇಧ: " : "Prohibition on External Publication: "}</strong>
                    {isKn
                      ? "ಖಾಸಗಿ ಚಾಟ್ ಸಂದೇಶಗಳನ್ನು ಪರಸ್ಪರ ಲಿಖಿತ ಒಪ್ಪಿಗೆಯಿಲ್ಲದೆ ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮಗಳಲ್ಲಿ ಅಥವಾ ಸಾರ್ವಜನಿಕವಾಗಿ ಹಂಚಿಕೊಳ್ಳುವುದನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ."
                      : "Neither party may publish, screen-record, or broadcast private consultation communications on external public media without the explicit written authorization of the other party."}
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 9: Fees, Payments, Cancellations and Refunds, if applicable
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-9" className="tu-section" ref={(el) => (sectionRefs.current["sec-9"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="fees" size={22} /></div>
                  <h2 className="tu-sec-title">
                    9. {isKn ? "ಶುಲ್ಕಗಳು, ಪಾವತಿಗಳು, ರದ್ದತಿ ಮತ್ತು ಮರುಪಾವತಿಗಳು" : "Fees, Payments, Cancellations and Refunds, if applicable"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-9")}
                  title="Copy link to Section 9"
                >
                  {copiedId === "sec-9" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ಶುಲ್ಕಗಳು ಮತ್ತು ಪಾವತಿಗಳಿಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ಈ ಕೆಳಗಿನ ನಿಯಮಗಳು ಅನ್ವಯವಾಗುತ್ತವೆ:"
                    : "Financial arrangements conducted on or through Advocate Hub are governed by transparent, unambiguous standards:"}
                </p>

                <ul className="tu-list">
                  <li>
                    <strong>{isKn ? "ತಂತ್ರಜ್ಞಾನ ವೇದಿಕೆ ಶುಲ್ಕ: " : "Platform Convenience Fees: "}</strong>
                    {isKn
                      ? "ಕ್ಲೌಡ್ ಸ್ಟೋರೇಜ್, ಸರ್ವರ್ ನಿರ್ವಹಣೆ ಮತ್ತು ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ಚಾಟ್ ಸೌಲಭ್ಯಕ್ಕಾಗಿ ವೇದಿಕೆಯು ಕನಿಷ್ಠ ತಂತ್ರಜ್ಞಾನ ಸಕ್ರಿಯಗೊಳಿಸುವ ಶುಲ್ಕವನ್ನು ವಿಧಿಸಬಹುದು."
                      : "Advocate Hub may charge a nominal technology convenience or document access fee to cover encrypted cloud transmission, database infrastructure, and maintenance."}
                  </li>
                  <li>
                    <strong>{isKn ? "ವಕೀಲರ ವೃತ್ತಿಪರ ಶುಲ್ಕ: " : "Independent Advocate Professional Fees: "}</strong>
                    {isKn
                      ? "ವಕೀಲರ ಸಮಾಲೋಚನೆ ಮತ್ತು ನ್ಯಾಯಾಲಯದ ಪ್ರಾತಿನಿಧ್ಯ ಶುಲ್ಕವನ್ನು ವಕೀಲರು ಸ್ವತಂತ್ರವಾಗಿ ನಿಗದಿಪಡಿಸುತ್ತಾರೆ ಅಥವಾ ಕಕ್ಷಿದಾರ ಮತ್ತು ವಕೀಲರ ನಡುವೆ ನೇರವಾಗಿ ತೀರ್ಮಾನಿಸಲಾಗುತ್ತದೆ."
                      : "Professional consultation fees and court litigation charges are established independently by each advocate or mutually negotiated directly between advocate and client."}
                  </li>
                  <li>
                    <strong>{isKn ? "ರದ್ದತಿ ಮತ್ತು ಮರುಪಾವತಿ ನೀತಿ: " : "Refund & Cancellation Standard: "}</strong>
                    {isKn
                      ? "ಒಮ್ಮೆ ಸಮಾಲೋಚನೆ ಆರಂಭವಾದ ನಂತರ ಅಥವಾ ಡಿಜಿಟಲ್ ಕಾನೂನು ದಾಖಲೆ ಡೌನ್‌ಲೋಡ್ ಆದ ನಂತರ ಪಾವತಿಸಿದ ತಂತ್ರಜ್ಞಾನ ಶುಲ್ಕವನ್ನು ಮರುಪಾವತಿಸಲಾಗುವುದಿಲ್ಲ. ತಾಂತ್ರಿಕ ದೋಷದಿಂದ ಉಂಟಾದ ದ್ವಿಗುಣ ಕಡಿತಗಳನ್ನು ೭ ದಿನಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಿ ಮರುಪಾವತಿಸಲಾಗುತ್ತದೆ."
                      : "Technology convenience fees are non-refundable once real-time consultation access is initiated or digital documents are delivered. Genuine duplicate deductions or technical failures will be reviewed and refunded within 7 business days upon notice to support."}
                  </li>
                </ul>

                <p style={{ fontSize: "0.84rem", color: "var(--tu-text-muted)" }}>
                  Billing Entity: <span className="tu-placeholder-tag">[Advocate Hub / GSTIN: Pending Registration / As Applicable]</span>
                </p>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 10: Legal Disclaimer and No Guarantee of Results
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-10" className="tu-section" ref={(el) => (sectionRefs.current["sec-10"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="disclaimer" size={22} /></div>
                  <h2 className="tu-sec-title">
                    10. {isKn ? "ಕಾನೂನು ಹಕ್ಕುತ್ಯಾಗ ಮತ್ತು ಫಲಿತಾಂಶದ ಯಾವುದೇ ಭರವಸೆ ಇಲ್ಲ" : "Legal Disclaimer and No Guarantee of Results"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-10")}
                  title="Copy link to Section 10"
                >
                  {copiedId === "sec-10" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <div className="tu-callout tu-callout-danger">
                  <div className="tu-callout-icon"><LegalIcon name="disclaimer" size={18} /></div>
                  <div className="tu-callout-text">
                    <strong>{isKn ? "ನ್ಯಾಯಾಲಯ ಫಲಿತಾಂಶದ ಯಾವುದೇ ಭರವಸೆ ಇಲ್ಲ: " : "NO GUARANTEE OF CASE RESULTS: "}</strong>
                    {isKn
                      ? "ಭಾರತದ ಯಾವುದೇ ನ್ಯಾಯಾಲಯ, ನ್ಯಾಯಾಧೀಕರಣ ಅಥವಾ ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ನಡೆಯುವ ಯಾವುದೇ ಪ್ರಕರಣ, ಜಾಮೀನು ಅರ್ಜಿ, ಸಿವಿಲ್ ಅಥವಾ ಕ್ರಿಮಿನಲ್ ದಾವೆಯ ಫಲಿತಾಂಶ ಅಥವಾ ತೀರ್ಪಿನ ಬಗ್ಗೆ ಯಾವುದೇ ವಕೀಲರು ಅಥವಾ ವೇದಿಕೆಯು ಖಾತರಿ ಅಥವಾ ಗ್ಯಾರಂಟಿ ನೀಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ಯಾವುದೇ ವಕೀಲರು '೧೦೦% ಗೆಲುವು' ಎಂದು ಹೇಳಿಕೊಳ್ಳುವುದು ಕಾನೂನುಬಾಹಿರವಾಗಿದೆ."
                      : "NO LAWYER, ADVOCATE, OR PLATFORM CAN GUARANTEE THE OUTCOME, DURATION, OR RESULT OF ANY LITIGATION, BAIL PETITION, TRIAL, APPEAL, OR ADMINISTRATIVE PROCEEDING BEFORE ANY COURT OR TRIBUNAL IN INDIA. Any representation promising a specific outcome or guaranteed judgment is void and legally impermissible."}
                  </div>
                </div>

                <p>
                  {isKn
                    ? "ವೇದಿಕೆಯಲ್ಲಿ ಲಭ್ಯವಿರುವ ಕಾನೂನು ಕಾಯಿದೆಗಳು (Bare Acts), ಎಐ ಕಾನೂನು ಮಾರ್ಗದರ್ಶಿ ಮತ್ತು ಲೇಖನಗಳು ಕೇವಲ ಸಾರ್ವಜನಿಕ ಕಾನೂನು ಅರಿವಿಗಾಗಿ ಮಾತ್ರ ಒದಗಿಸಲಾಗಿದೆ. ಇದು ಅಧಿಕೃತ ಕಾನೂನು ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ."
                    : "All materials, statutes, legal guides, Bare Acts compilations, and AI legal assistant outputs hosted on Advocate Hub are provided strictly for general educational, academic, and situational awareness. None of the platform content constitutes legal advice or an authoritative legal opinion."}
                </p>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 11: Advocate-Client Relationship
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-11" className="tu-section" ref={(el) => (sectionRefs.current["sec-11"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="relationship" size={22} /></div>
                  <h2 className="tu-sec-title">
                    11. {isKn ? "ವಕೀಲ-ಗ್ರಾಹಕ ಸಂಬಂಧ" : "Advocate-Client Relationship"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-11")}
                  title="Copy link to Section 11"
                >
                  {copiedId === "sec-11" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ಕೇವಲ ವೇದಿಕೆಯನ್ನು ಬ್ರೌಸ್ ಮಾಡುವುದರಿಂದ, ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳುವುದರಿಂದ ಅಥವಾ ಎಐ ಸಹಾಯಕರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡುವುದರಿಂದ ಯಾವುದೇ ವಕೀಲ-ಕಕ್ಷಿದಾರ ಸಂಬಂಧ (Advocate-Client Relationship) ಸೃಷ್ಟಿಯಾಗುವುದಿಲ್ಲ."
                    : "The mere access, exploration of the Platform, or interaction with AI legal tools does not create an advocate-client relationship between you and Advocate Hub or any participating advocate."}
                </p>

                <p>
                  {isKn
                    ? "ವಕೀಲ-ಕಕ್ಷಿದಾರ ಸಂಬಂಧವು ಕೇವಲ ವಕೀಲ ಮತ್ತು ಕಕ್ಷಿದಾರರ ನಡುವೆ ಪರಸ್ಪರ ಸಮ್ಮತಿಯೊಂದಿಗೆ ಅಧಿಕೃತ ವಕಾಲತ್ತುನಾಮೆ (Vakalatnama) ಅಥವಾ ಲಿಖಿತ ಒಪ್ಪಂದಕ್ಕೆ ಸಹಿ ಹಾಕಿದ ನಂತರವೇ ಉಂಟಾಗುತ್ತದೆ. ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ ಈ ಸಂಬಂಧದಲ್ಲಿ ಯಾವುದೇ ಪಾತ್ರ ಹೊಂದಿರುವುದಿಲ್ಲ ಮತ್ತು ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಕಾಯ್ದೆ ಕಲಂ ೭೯ ರ ಅಡಿಯಲ್ಲಿ ರಕ್ಷಣೆ ಹೊಂದಿದೆ."
                    : "An advocate-client relationship is strictly created upon bilateral mutual agreement directly between the client and the respective advocate, formalized by the execution of a Vakalatnama, memorandum of appearance, or formal legal engagement retainer. Advocate Hub remains an intermediary safe harbor protected under Section 79 of the Information Technology Act, 2000."}
                </p>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 12: Privacy, Confidentiality and Personal Data
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-12" className="tu-section" ref={(el) => (sectionRefs.current["sec-12"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="lock" size={22} /></div>
                  <h2 className="tu-sec-title">
                    12. {isKn ? "ಗೌಪ್ಯತೆ, ರಹಸ್ಯತೆ ಮತ್ತು ವೈಯಕ್ತಿಕ ದತ್ತಾಂಶ" : "Privacy, Confidentiality and Personal Data"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-12")}
                  title="Copy link to Section 12"
                >
                  {copiedId === "sec-12" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ವಿವರಗಳು ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ದತ್ತಾಂಶ ಸಂರಕ್ಷಣಾ ಕಾಯ್ದೆ ೨೦೨೩ (DPDP Act) ಮತ್ತು ಐಟಿ ನಿಯಮಾವಳಿಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಕಟ್ಟುನಿಟ್ಟಾಗಿ ರಕ್ಷಿಸಲಾಗುತ್ತದೆ."
                    : "Advocate Hub handles personal information in accordance with the Information Technology Act, 2000, Information Technology (Reasonable Security Practices) Rules, 2011, and the Digital Personal Data Protection Act, 2023 (DPDP)."}
                </p>

                <ul className="tu-list">
                  <li>
                    <strong>{isKn ? "ಪಾಸ್‌ವರ್ಡ್ ಭದ್ರತೆ: " : "Password Security: "}</strong>
                    {isKn
                      ? "ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು scrypt ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ ಹ್ಯಾಶ್ ಮೂಲಕ ರಕ್ಷಿಸಲಾಗಿದ್ದು, ಸರ್ವರ್‌ನಲ್ಲಿಯೂ ಸರಳ ಪಠ್ಯದಲ್ಲಿ ಲಭ್ಯವಿರುವುದಿಲ್ಲ."
                      : "User passwords are stored strictly as salted scrypt hashes. Plain-text passwords are never stored or logged."}
                  </li>
                  <li>
                    <strong>{isKn ? "OTP ಅವಧಿ ಮತ್ತು ಭದ್ರತೆ: " : "OTP Expiry: "}</strong>
                    {isKn
                      ? "ಪರಿಶೀಲನಾ ಕೋಡ್‌ಗಳು (OTP) ಕೇವಲ ೫ ನಿಮಿಷಗಳವರೆಗೆ ಮಾತ್ರ ಮಾನ್ಯವಾಗಿದ್ದು, HMAC-SHA256 ಎನ್‌ಕ್ರಿಪ್ಶನ್ ಮೂಲಕ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ."
                      : "One-Time Passwords (OTPs) expire within 5 minutes, are hashed with HMAC-SHA256, and are invalidated immediately upon consumption."}
                  </li>
                  <li>
                    <strong>{isKn ? "ಗೌಪ್ಯತಾ ನೀತಿ ಲಿಂಕ್: " : "Companion Privacy Policy: "}</strong>
                    {isKn
                      ? "ದತ್ತಾಂಶ ಸಂಗ್ರಹಣೆ ಮತ್ತು ಹಕ್ಕುಗಳ ಪೂರ್ಣ ವಿವರಗಳಿಗಾಗಿ ನಮ್ಮ ಪ್ರತ್ಯೇಕ "
                      : "For detailed disclosures concerning data processing, storage durations, and rights, refer to our standalone "}
                    <Link to="/privacy" style={{ color: "var(--tu-primary)", fontWeight: 700 }}>
                      {isKn ? "ಗೌಪ್ಯತಾ ನೀತಿ (Privacy Policy)" : "Privacy Policy"}
                    </Link>.
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 13: Uploaded Documents and Intellectual Property
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-13" className="tu-section" ref={(el) => (sectionRefs.current["sec-13"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="documents" size={22} /></div>
                  <h2 className="tu-sec-title">
                    13. {isKn ? "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಗಳು ಮತ್ತು ಬೌದ್ಧಿಕ ಆಸ್ತಿ" : "Uploaded Documents and Intellectual Property"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-13")}
                  title="Copy link to Section 13"
                >
                  {copiedId === "sec-13" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ಕಕ್ಷಿದಾರರು ಅಥವಾ ವಕೀಲರು ವೇದಿಕೆಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡುವ ಪ್ರಕರಣದ ಕಡತಗಳು ಮತ್ತು ಕಾನೂನು ದಾಖಲೆಗಳ ಮಾಲೀಕತ್ವವು ಬಳಕೆದಾರರಿಗೆ ಸೇರಿರುತ್ತದೆ."
                    : "Users retain full title, ownership, and copyright over all case documents, pleadings, notices, or evidence uploaded to the platform."}
                </p>

                <p>
                  {isKn
                    ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನ ಲೋಗೋ, ಸಾಫ್ಟ್‌ವೇರ್, ಕೋಡ್, ಬ್ರ್ಯಾಂಡಿಂಗ್ ಮತ್ತು ವಿನ್ಯಾಸದ ಎಲ್ಲಾ ಬೌದ್ಧಿಕ ಆಸ್ತಿ ಹಕ್ಕುಗಳು ವೇದಿಕೆಗೆ ಸೇರಿರುತ್ತವೆ."
                    : "All trademarks, service marks, logos, brand elements, codebase, software, and compilation designs associated with Advocate Hub are the exclusive proprietary intellectual property of [Entity Name: Advocate Hub] and protected under the Indian Copyright Act, 1957 and Trade Marks Act, 1999."}
                </p>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 14: Prohibited Activities and Fraud Prevention
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-14" className="tu-section" ref={(el) => (sectionRefs.current["sec-14"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="prohibited" size={22} /></div>
                  <h2 className="tu-sec-title">
                    14. {isKn ? "ನಿಷೇಧಿತ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ವಂಚನೆ ತಡೆಗಟ್ಟುವಿಕೆ" : "Prohibited Activities and Fraud Prevention"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-14")}
                  title="Copy link to Section 14"
                >
                  {copiedId === "sec-14" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ವೇದಿಕೆಯಲ್ಲಿ ಈ ಕೆಳಗಿನ ಚಟುವಟಿಕೆಗಳನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ:"
                    : "Users agree not to engage in any prohibited, unlawful, or disruptive activities, including but not limited to:"}
                </p>

                <ul className="tu-list">
                  <li>
                    {isKn
                      ? "ಸುಳ್ಳು ಬಾರ್ ಕೌನ್ಸಿಲ್ ಐಡಿ ಅಥವಾ ದಾಖಲೆಗಳನ್ನು ಸಲ್ಲಿಸಿ ವಕೀಲರಂತೆ ನಟಿಸುವುದು."
                      : "Submitting counterfeit Bar credentials, fake Sanad details, or impersonating legal officers."}
                  </li>
                  <li>
                    {isKn
                      ? "ವೇದಿಕೆಯ ದತ್ತಾಂಶವನ್ನು ಸ್ಕ್ರ್ಯಾಪಿಂಗ್ (Scraping), ರಿವರ್ಸ್ ಇಂಜಿನಿಯರಿಂಗ್ ಅಥವಾ ಹ್ಯಾಕ್ ಮಾಡಲು ಪ್ರಯತ್ನಿಸುವುದು."
                      : "Automated scraping, bulk extraction of advocate contact directories, or reverse-engineering platform source code."}
                  </li>
                  <li>
                    {isKn
                      ? "ಅನಗತ್ಯ ಸ್ಪ್ಯಾಮ್ ಸಂದೇಶಗಳು, ವೈರಸ್ ಅಥವಾ ಮಾಲ್‌ವೇರ್ ಕಳುಹಿಸುವುದು."
                      : "Transmitting viruses, ransomware, malicious files, or promotional spam over chat channels."}
                  </li>
                  <li>
                    {isKn
                      ? "ಯಾವುದೇ ವ್ಯಕ್ತಿಯನ್ನು ಬೆದರಿಸುವುದು, ನಿಂದಿಸುವುದು ಅಥವಾ ಸುಲಿಗೆ ಮಾಡುವುದು."
                      : "Extorting, threatening, harassing, or defaming any user or legal practitioner."}
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 15: Reporting, Complaints and Dispute Resolution
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-15" className="tu-section" ref={(el) => (sectionRefs.current["sec-15"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="gavel" size={22} /></div>
                  <h2 className="tu-sec-title">
                    15. {isKn ? "ವರದಿ ಮಾಡುವಿಕೆ, ದೂರುಗಳು ಮತ್ತು ವಿವಾದ ಪರಿಹಾರ" : "Reporting, Complaints and Dispute Resolution"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-15")}
                  title="Copy link to Section 15"
                >
                  {copiedId === "sec-15" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ (ಮಧ್ಯವರ್ತಿ ಮಾರ್ಗಸೂಚಿಗಳು) ನಿಯಮಗಳು ೨೦೨೧ ರ ಪ್ರಕಾರ ವೇದಿಕೆಯಲ್ಲಿ ಶಾಸನಬದ್ಧ ದೂರು ಪರಿಹಾರ ವ್ಯವಸ್ಥೆಯನ್ನು (Grievance Redressal Mechanism) ಕಲ್ಪಿಸಲಾಗಿದೆ."
                    : "In compliance with Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, Advocate Hub maintains an official Grievance Redressal Mechanism."}
                </p>

                <p>
                  {isKn
                    ? "ಯಾವುದೇ ದೂರುಗಳು ಅಥವಾ ಆಕ್ಷೇಪಾರ್ಹ ವಿಷಯಗಳಿದ್ದಲ್ಲಿ, ಬಳಕೆದಾರರು ನೇರವಾಗಿ ನಮ್ಮ ಶಾಸನಬದ್ಧ ದೂರು ಅಧಿಕಾರಿಗೆ ಲಿಖಿತವಾಗಿ ದೂರು ಸಲ್ಲಿಸಬಹುದು. ದೂರನ್ನು ೨೪ ಗಂಟೆಗಳ ಒಳಗೆ ಸ್ವೀಕರಿಸಿ, ೧೫ ದಿನಗಳ ಒಳಗೆ ಪರಿಹರಿಸಲಾಗುತ್ತದೆ."
                    : "Any grievance concerning platform content, advocate misconduct, or operational dispute should be submitted in writing to the Designated Grievance Officer (contact details in Section 21). Grievances will be acknowledged within twenty-four (24) hours and resolved within fifteen (15) calendar days."}
                </p>

                <p style={{ fontSize: "0.85rem", color: "var(--tu-text-muted)" }}>
                  {isKn
                    ? "ಗಮನಿಸಿ: ಗ್ರಾಹಕ ಸಂರಕ್ಷಣಾ ಕಾಯ್ದೆ ೨೦೧೯ ರ ಅಡಿಯಲ್ಲಿ ಬಳಕೆದಾರರಿಗೆ ಲಭ್ಯವಿರುವ ಶಾಸನಬದ್ಧ ಹಕ್ಕುಗಳನ್ನು ಈ ನಿಯಮಗಳು ಯಾವುದೇ ರೀತಿಯಲ್ಲಿ ರದ್ದುಪಡಿಸುವುದಿಲ್ಲ."
                    : "Nothing herein constitutes a waiver of non-excludable statutory rights under the Consumer Protection Act, 2019."}
                </p>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 16: Account Suspension and Termination
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-16" className="tu-section" ref={(el) => (sectionRefs.current["sec-16"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="termination" size={22} /></div>
                  <h2 className="tu-sec-title">
                    16. {isKn ? "ಖಾತೆ ಅಮಾನತು ಮತ್ತು ರದ್ದತಿ" : "Account Suspension and Termination"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-16")}
                  title="Copy link to Section 16"
                >
                  {copiedId === "sec-16" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ಬಳಕೆದಾರರು ಈ ನಿಯಮಗಳನ್ನು ಉಲ್ಲಂಘಿಸಿದರೆ, ಸುಳ್ಳು ಮಾಹಿತಿ ನೀಡಿದರೆ ಅಥವಾ ಬಾರ್ ಕೌನ್ಸಿಲ್‌ನಿಂದ ಶಿಸ್ತು ಕ್ರಮಕ್ಕೆ ಒಳಗಾಗಿದ್ದರೆ, ವೇದಿಕೆಯು ಅವರ ಖಾತೆಯನ್ನು ತಕ್ಷಣ ಅಮಾನತುಗೊಳಿಸುವ ಅಥವಾ ಶಾಶ್ವತವಾಗಿ ರದ್ದುಗೊಳಿಸುವ ಹಕ್ಕನ್ನು ಹೊಂದಿರುತ್ತದೆ."
                    : "Advocate Hub reserves the right to immediately suspend or permanently terminate user accounts upon evidence of terms violation, fraudulent identity, disciplinary sanctions imposed by a State Bar Council, or compliance with court orders."}
                </p>

                <p>
                  {isKn
                    ? "ಬಳಕೆದಾರರು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ತಮ್ಮ ಖಾತೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲು advocatehub.in@gmail.com ಗೆ ಇಮೇಲ್ ಕಳುಹಿಸಿ ವಿನಂತಿಸಬಹುದು."
                    : "Users may voluntarily deactivate their accounts at any time by sending a verified deletion request to advocatehub.in@gmail.com."}
                </p>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 17: Service Availability and Third-Party Services
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-17" className="tu-section" ref={(el) => (sectionRefs.current["sec-17"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="availability" size={22} /></div>
                  <h2 className="tu-sec-title">
                    17. {isKn ? "ಸೇವಾ ಲಭ್ಯತೆ ಮತ್ತು ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಸೇವೆಗಳು" : "Service Availability and Third-Party Services"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-17")}
                  title="Copy link to Section 17"
                >
                  {copiedId === "sec-17" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ವೇದಿಕೆಯನ್ನು 'ಯಥಾಸ್ಥಿತಿ' (AS IS) ಮತ್ತು 'ಲಭ್ಯವಿರುವಂತೆ' (AS AVAILABLE) ಆಧಾರದ ಮೇಲೆ ಒದಗಿಸಲಾಗಿದೆ."
                    : "Advocate Hub and its accompanying features are provided on an 'AS IS' and 'AS AVAILABLE' basis without warranties of uninterrupted uptime."}
                </p>

                <p>
                  {isKn
                    ? "ಸರ್ವರ್ ನಿರ್ವಹಣೆ, ಇಂಟರ್ನೆಟ್ ಅಡೆತಡೆಗಳು ಅಥವಾ ಟೆಲಿಕಾಂ ಎಸ್‌ಎಂಎಸ್/ವಾಟ್ಸಾಪ್ ಗೇಟ್‌ವೇಗಳ ವಿಳಂಬಗಳಿಗೆ ವೇದಿಕೆಯು ಹೊಣೆಗಾರನಾಗಿರುವುದಿಲ್ಲ."
                    : "While we implement high-availability cloud architecture, interruptions may occur due to routine maintenance, telecommunications carrier delays in SMS/WhatsApp OTP delivery, or force majeure events."}
                </p>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 18: Limitation of Liability, subject to applicable law
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-18" className="tu-section" ref={(el) => (sectionRefs.current["sec-18"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="liability" size={22} /></div>
                  <h2 className="tu-sec-title">
                    18. {isKn ? "ಹೊಣೆಗಾರಿಕೆಯ ಮಿತಿ" : "Limitation of Liability, subject to applicable law"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-18")}
                  title="Copy link to Section 18"
                >
                  {copiedId === "sec-18" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ಭಾರತೀಯ ಕಾನೂನಿನ ಗರಿಷ್ಠ ಮಿತಿಯೊಳಗೆ, ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನ ಒಟ್ಟು ಹೊಣೆಗಾರಿಕೆಯು ಘಟನೆ ಸಂಭವಿಸಿದ ಹಿಂದಿನ ಮೂರು (೩) ತಿಂಗಳುಗಳಲ್ಲಿ ಬಳಕೆದಾರರು ವೇದಿಕೆಗೆ ಪಾವತಿಸಿದ ಮೊತ್ತಕ್ಕೆ (ಅಥವಾ ₹೧,೦೦೦ ಭಾರತೀಯ ರೂಪಾಯಿ, ಯಾವುದು ಕಡಿಮೆಯೋ ಅದಕ್ಕೆ) ಸೀಮಿತವಾಗಿರುತ್ತದೆ."
                    : "To the maximum extent permitted by applicable Indian law, the aggregate liability of Advocate Hub, its directors, developers, and administrators for direct losses arising out of platform use shall not exceed the actual fees paid by the user to the platform in the three (3) months preceding the incident or ₹1,000 INR (whichever is less)."}
                </p>

                <div className="tu-callout tu-callout-info">
                  <div className="tu-callout-icon"><LegalIcon name="info" size={18} /></div>
                  <div className="tu-callout-text">
                    <strong>{isKn ? "ಕಾನೂನು ವಿನಾಯಿತಿಗಳು: " : "Statutory Exclusions: "}</strong>
                    {isKn
                      ? "ಭಾರತೀಯ ಕಾನೂನಿನಡಿಯಲ್ಲಿ ಸೀಮಿತಗೊಳಿಸಲಾಗದ ವಿಷಯಗಳಿಗೆ (ಉದಾಹರಣೆಗೆ ವಂಚನೆ, ತೀವ್ರ ನಿರ್ಲಕ್ಷ್ಯ ಅಥವಾ ಗ್ರಾಹಕ ಹಕ್ಕುಗಳು) ಈ ಮಿತಿ ಅನ್ವಯಿಸುವುದಿಲ್ಲ."
                      : "Nothing in this agreement purports to exclude or limit liability for fraud, willful misconduct, or non-waivable statutory liabilities governed by the Consumer Protection Act, 2019."}
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 19: Amendments to Terms and Conditions
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-19" className="tu-section" ref={(el) => (sectionRefs.current["sec-19"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="amendments" size={22} /></div>
                  <h2 className="tu-sec-title">
                    19. {isKn ? "ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳಿಗೆ ತಿದ್ದುಪಡಿಗಳು" : "Amendments to Terms and Conditions"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-19")}
                  title="Copy link to Section 19"
                >
                  {copiedId === "sec-19" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ಕಾನೂನು ಬದಲಾವಣೆಗಳು ಅಥವಾ ತಾಂತ್ರಿಕ ನವೀಕರಣಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಈ ನಿಯಮಗಳನ್ನು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಮಾರ್ಪಡಿಸುವ ಹಕ್ಕನ್ನು ವೇದಿಕೆಯು ಕಾಯ್ದಿರಿಸಿಕೊಂಡಿದೆ."
                    : "Advocate Hub reserves the right to amend, update, or revise these Terms periodically to reflect evolving legal precedents, BCI guidelines, statutory updates, or feature additions."}
                </p>

                <p>
                  {isKn
                    ? "ಪ್ರಮುಖ ಬದಲಾವಣೆಗಳನ್ನು ವೆಬ್‌ಸೈಟ್ ಸೂಚನೆ ಅಥವಾ ನೋಂದಾಯಿತ ಇಮೇಲ್ ಮೂಲಕ ತಿಳಿಸಲಾಗುವುದು. ಬದಲಾವಣೆಗಳ ನಂತರ ವೇದಿಕೆಯನ್ನು ಮುಂದುವರಿಸುವುದು ಹೊಸ ನಿಯಮಗಳ ಒಪ್ಪಿಗೆಯಾಗಿದೆ."
                    : "Material changes will be notified via prominent website notification or registered email. Continued use of Advocate Hub following the posting of revisions constitutes formal acceptance of the updated terms."}
                </p>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 20: Governing Law and Jurisdiction in India
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-20" className="tu-section" ref={(el) => (sectionRefs.current["sec-20"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="governingLaw" size={22} /></div>
                  <h2 className="tu-sec-title">
                    20. {isKn ? "ಭಾರತದಲ್ಲಿ ಆಡಳಿತ ಕಾನೂನು ಮತ್ತು ನ್ಯಾಯವ್ಯಾಪ್ತಿ" : "Governing Law and Jurisdiction in India"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-20")}
                  title="Copy link to Section 20"
                >
                  {copiedId === "sec-20" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ಈ ಒಪ್ಪಂದ ಮತ್ತು ನಿಯಮಗಳು ಭಾರತ ಗಣರಾಜ್ಯದ ಕಾನೂನುಗಳಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತವೆ."
                    : "These Terms, rights, obligations, and any legal disputes arising out of or in connection with the Platform shall be governed by, construed, and enforced in accordance with the substantive laws of the Republic of India."}
                </p>

                <p>
                  {isKn
                    ? "ಈ ನಿಯಮಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಯಾವುದೇ ವಿವಾದಗಳು ಅಥವಾ ಕಾನೂನು ಪ್ರಕ್ರಿಯೆಗಳಿಗೆ ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕದ ನ್ಯಾಯಾಲಯಗಳು ಮಾತ್ರ ಪ್ರತ್ಯೇಕ ನ್ಯಾಯವ್ಯಾಪ್ತಿಯನ್ನು (Exclusive Jurisdiction) ಹೊಂದಿರುತ್ತವೆ."
                    : "Subject to initial good-faith consultation and statutory grievance redressal, the competent courts situated in Bengaluru, Karnataka, India shall have exclusive jurisdiction over all claims, suits, or proceedings."}
                </p>
              </div>
            </div>
          </article>

          {/* ══════════════════════════════════════════════════════════
              SECTION 21: Contact and Support Information
          ══════════════════════════════════════════════════════════ */}
          <article id="sec-21" className="tu-section" ref={(el) => (sectionRefs.current["sec-21"] = el)}>
            <div className="tu-card">
              <div className="tu-sec-header">
                <div className="tu-sec-title-group">
                  <div className="tu-sec-icon-box"><LegalIcon name="contact" size={22} /></div>
                  <h2 className="tu-sec-title">
                    21. {isKn ? "ಸಂಪರ್ಕ ಮತ್ತು ಬೆಂಬಲ ಮಾಹಿತಿ" : "Contact and Support Information"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="tu-sec-share-btn"
                  onClick={() => copySectionLink("sec-21")}
                  title="Copy link to Section 21"
                >
                  {copiedId === "sec-21" ? <><LegalIcon name="check" size={13} /> Copied</> : <><LegalIcon name="share" size={13} /> Share</>}
                </button>
              </div>

              <div className="tu-body">
                <p>
                  {isKn
                    ? "ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳು, ಬೆಂಬಲ ವಿನಂತಿಗಳು ಅಥವಾ ಕಾನೂನು ವಿಚಾರಣೆಗಳಿಗಾಗಿ ನಮ್ಮ ಅಧಿಕೃತ ಸಂಪರ್ಕ ಮಾರ್ಗಗಳು:"
                    : "For legal inquiries, compliance queries, or user support, contact Advocate Hub through official verified channels:"}
                </p>

                <div className="tu-grid-2">
                  <div className="tu-contact-card">
                    <div className="tu-contact-icon"><LegalIcon name="mail" size={20} /></div>
                    <div className="tu-contact-info">
                      <span className="tu-contact-label">{isKn ? "ಅಧಿಕೃತ ಇಮೇಲ್" : "Official Support Email"}</span>
                      <a href={`mailto:${EMAIL}`} className="tu-contact-val">{EMAIL}</a>
                    </div>
                  </div>

                  <div className="tu-contact-card">
                    <div className="tu-contact-icon"><LegalIcon name="contact" size={20} /></div>
                    <div className="tu-contact-info">
                      <span className="tu-contact-label">{isKn ? "ದೂರವಾಣಿ ಸಹಾಯವಾಣಿ" : "Phone Helpline"}</span>
                      <a href={`tel:${PHONE}`} className="tu-contact-val">{PHONE}</a>
                    </div>
                  </div>

                  <div className="tu-contact-card">
                    <div className="tu-contact-icon"><LegalIcon name="instagram" size={20} /></div>
                    <div className="tu-contact-info">
                      <span className="tu-contact-label">{isKn ? "ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್" : "Official Instagram"}</span>
                      <a href="https://www.instagram.com/advocate__hub/" target="_blank" rel="noopener noreferrer" className="tu-contact-val">{INSTAGRAM}</a>
                    </div>
                  </div>

                  <div className="tu-contact-card">
                    <div className="tu-contact-icon"><LegalIcon name="availability" size={20} /></div>
                    <div className="tu-contact-info">
                      <span className="tu-contact-label">{isKn ? "ವೆಬ್‌ಸೈಟ್" : "Platform URL"}</span>
                      <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="tu-contact-val">advocate-hub.up.railway.app</a>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 20, padding: "14px 18px", background: "var(--tu-bg-subtle)", borderRadius: 12, border: "1px solid var(--tu-border)" }}>
                  <div style={{ fontWeight: 750, color: "var(--tu-text-title)", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                    <LegalIcon name="scale" size={18} />
                    <span>{isKn ? "ಶಾಸನಬದ್ಧ ದೂರು ಪರಿಹಾರ ಅಧಿಕಾರಿ (Grievance Redressal Officer):" : "Designated Grievance Redressal Officer (IT Rules, 2021):"}</span>
                  </div>
                  <div style={{ fontSize: "0.86rem", color: "var(--tu-text-main)", lineHeight: 1.6 }}>
                    <div><strong>Designation:</strong> <span className="tu-placeholder-tag">[Grievance Officer, Legal Operations Division]</span></div>
                    <div><strong>Entity:</strong> <span className="tu-placeholder-tag">[Advocate Hub / Registration Pending]</span></div>
                    <div><strong>Email:</strong> <a href={`mailto:${EMAIL}`} style={{ color: "var(--tu-primary)" }}>{EMAIL}</a></div>
                    <div><strong>Helpline:</strong> {PHONE}</div>
                    <div><strong>Registered Address:</strong> <span className="tu-placeholder-tag">[Bengaluru, Karnataka, India - Full Corporate Address to be updated upon registration]</span></div>
                    <div style={{ marginTop: 4, fontSize: "0.8rem", color: "var(--tu-text-muted)" }}>
                      {isKn
                        ? "ದೂರು ಸ್ವೀಕೃತಿ: ೨೪ ಗಂಟೆಗಳ ಒಳಗೆ | ಪರಿಹಾರ: ೧೫ ದಿನಗಳ ಒಳಗೆ"
                        : "Statutory Acknowledgment: Within 24 hours | Resolution: Within 15 calendar days"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>

      {/* ── MOBILE SLIDE-OVER DRAWER (TABLE OF CONTENTS) ── */}
      {showTOC && (
        <div className="tu-drawer-backdrop" onClick={() => setTOC(false)}>
          <div className="tu-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="tu-drawer-header">
              <span className="tu-drawer-title">{isKn ? "ವಿಷಯ ಸೂಚಿ (21 ವಿಭಾಗಗಳು)" : "Table of Contents (21 Sections)"}</span>
              <button
                type="button"
                className="tu-drawer-close"
                onClick={() => setTOC(false)}
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="tu-drawer-search">
              <input
                type="text"
                placeholder={isKn ? "ಹುಡುಕಿ..." : "Search sections..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tu-search-input"
              />
            </div>
            <div className="tu-drawer-body">
              {filteredSections.map((sec) => (
                <button
                  type="button"
                  key={sec.id}
                  className={`tu-drawer-item ${activeSection === sec.id ? "active" : ""}`}
                  onClick={() => scrollToSection(sec.id)}
                >
                  <LegalIcon name={sec.iconKey} size={15} />
                  <span>{sec.num}. {isKn ? sec.titleKn : sec.titleEn}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING BACK TO TOP BUTTON ── */}
      {showBackToTop && (
        <button
          type="button"
          className="tu-floating-top-btn"
          onClick={scrollToTop}
          title={isKn ? "ಮೇಲಕ್ಕೆ ಹೋಗಿ" : "Back to top"}
          aria-label="Back to top"
        >
          <LegalIcon name="arrowUp" size={18} />
        </button>
      )}

      {/* ── MOBILE BOTTOM FIXED ACTION BAR ── */}
      <div className="tu-mobile-action-bar">
        <button
          type="button"
          className="tu-mobile-action-btn"
          onClick={() => navigate("/")}
        >
          <LegalIcon name="home" size={18} />
          <span>{isKn ? "ಮುಖಪುಟ" : "Home"}</span>
        </button>

        <button
          type="button"
          className="tu-mobile-action-btn"
          onClick={toggleLanguage}
        >
          <LegalIcon name="availability" size={18} />
          <span>{isKn ? "English" : "ಕನ್ನಡ"}</span>
        </button>

        <button
          type="button"
          className="tu-mobile-action-btn tu-mobile-action-btn-primary"
          onClick={() => setTOC(true)}
        >
          <LegalIcon name="toc" size={18} />
          <span>{isKn ? "ಸೂಚಿ (21)" : "TOC (21)"}</span>
        </button>

        <button
          type="button"
          className="tu-mobile-action-btn"
          onClick={scrollToTop}
        >
          <LegalIcon name="arrowUp" size={18} />
          <span>{isKn ? "ಮೇಲಕ್ಕೆ" : "Top"}</span>
        </button>
      </div>
    </div>
  );
}
