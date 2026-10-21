/* eslint-disable */
// PrivacyPolicy.js — Advocate Hub Official Privacy Policy
// Compliant with Information Technology Act 2000, IT Rules 2011, and Digital Personal Data Protection Act 2023 (DPDP)
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import LegalIcon from "../components/LegalIcons";
import "./PrivacyPolicy.css";

const LAST_UPDATED = "01 September 2026";
const EFFECTIVE_DATE = "01 September 2026";
const COMPANY = "Advocate Hub Legal Services Platform";
const ENTITY_PLACEHOLDER = "[Entity Registration: Advocate Hub]";
const EMAIL = "advocatehub.in@gmail.com";
const PHONE = "+91 91087 17353";
const INSTAGRAM = "@advocate__hub";
const ADDRESS = "Bengaluru, Karnataka, India";
const WEBSITE_URL = "https://advocate-hub.up.railway.app/";

const SECTIONS = [
  { id: "introduction",         title: "1. Introduction",                        iconKey: "acceptance",  icon: <LegalIcon name="acceptance" size={17} /> },
  { id: "information-collect",  title: "2. Information We Collect",              iconKey: "collection",  icon: <LegalIcon name="collection" size={17} /> },
  { id: "how-we-use",           title: "3. How We Use Your Information",         iconKey: "settings",    icon: <LegalIcon name="settings" size={17} /> },
  { id: "sharing",              title: "4. Sharing of Information",              iconKey: "sharing",     icon: <LegalIcon name="sharing" size={17} /> },
  { id: "advocate-data",        title: "5. Advocate-Specific Data",              iconKey: "scale",       icon: <LegalIcon name="scale" size={17} /> },
  { id: "client-data",          title: "6. Client-Specific Data",               iconKey: "user",        icon: <LegalIcon name="user" size={17} /> },
  { id: "cookies",              title: "7. Cookies & Tracking Technologies",     iconKey: "cookie",      icon: <LegalIcon name="cookie" size={17} /> },
  { id: "data-security",        title: "8. Data Security",                       iconKey: "lock",        icon: <LegalIcon name="lock" size={17} /> },
  { id: "data-retention",       title: "9. Data Retention",                      iconKey: "retention",   icon: <LegalIcon name="retention" size={17} /> },
  { id: "user-rights",          title: "10. Your Rights",                        iconKey: "rights",      icon: <LegalIcon name="rights" size={17} /> },
  { id: "third-party",          title: "11. Third-Party Links & Services",       iconKey: "thirdParty",  icon: <LegalIcon name="thirdParty" size={17} /> },
  { id: "children",             title: "12. Children's Privacy",                 iconKey: "children",    icon: <LegalIcon name="children" size={17} /> },
  { id: "grievance",            title: "13. Grievance Officer",                  iconKey: "grievance",   icon: <LegalIcon name="grievance" size={17} /> },
  { id: "changes",              title: "14. Changes to This Policy",             iconKey: "amendments",  icon: <LegalIcon name="amendments" size={17} /> },
  { id: "contact",              title: "15. Contact Us",                         iconKey: "contact",     icon: <LegalIcon name="contact" size={17} /> },
];

const CONTENT = {
  introduction: {
    paragraphs: [
      `Welcome to Advocate Hub ("Advocate Hub", "we", "us", or "our"). We are committed to protecting and respecting your personal privacy. This Privacy Policy outlines how we collect, process, store, disclose, and safeguard your data when you visit our website (${WEBSITE_URL}), use our mobile interfaces, or access our legal intermediary and discovery features.`,
      `This Privacy Policy applies to all individuals engaging with the Advocate Hub platform, including registered legal practitioners (advocates), clients seeking legal assistance, general visitors browsing Bare Acts and legal information, and any person interacting with our communication or AI guidance channels.`,
      `By registering an account, accessing, or using Advocate Hub's services, you acknowledge that you have read and agreed to the data collection and processing practices described herein. This Privacy Policy is incorporated into and subject to our Terms and Conditions.`,
      `This policy is published in strict compliance with Section 43A and Section 79 of the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the statutory requirements of the Digital Personal Data Protection Act, 2023 (DPDP).`,
    ],
  },
  "information-collect": {
    intro: "We collect the following categories of information to provide transparent, secure intermediary services:",
    subsections: [
      {
        title: "A. Information You Provide Directly",
        items: [
          "Full name, email address, mobile phone number, and location/city",
          "Profile photograph and verified bar credentials (for advocates)",
          "Bar Council Enrollment Number, State Bar Council name, and enrollment year (for advocates)",
          "Practice courts (District, High Court, Supreme Court), practice areas, and years of active standing",
          "Educational degrees, bar association memberships, and professional qualifications",
          "Consultation mode preferences, availability calendar, and consultation fee structure",
          "Billing details and payment transaction identifiers (processed securely through authorized gateways)",
          "Legal queries, factual summaries, and situational descriptions submitted by clients",
          "Encrypted consultation messages and documents exchanged between matched clients and advocates",
          "User ratings, reviews, feedback, and support inquiries",
        ],
      },
      {
        title: "B. Information Collected Automatically",
        items: [
          "Internet Protocol (IP) address, browser type, operating system, and hardware configuration",
          "Page interaction metrics, visit timestamps, and navigation paths across Bare Acts and guides",
          "Referring website URLs and search queries used to locate advocate profiles",
          "Cryptographic session tokens, device identifiers, and server access audit logs",
          "Approximate geographical location (city/district level) to facilitate regional advocate discovery",
          "Security logs tracking failed login attempts and OTP delivery status",
        ],
      },
      {
        title: "C. Information from Verified Third Parties",
        items: [
          "State Bar Council directory verification data for advocate credential authentication",
          "Authentication assertions from secure OAuth providers (e.g., Google Sign-In) if selected",
          "Payment authorization and transaction confirmation webhooks from licensed payment gateways",
          "Authorized identity verification data required for administrative compliance",
        ],
      },
    ],
  },
  "how-we-use": {
    intro: "Advocate Hub processes personal data strictly for lawful, legitimate purposes under Indian law:",
    groups: [
      {
        title: "Platform Operation & Intermediary Services",
        items: [
          "To establish, authenticate, and manage user accounts for clients and advocates",
          "To index advocate profiles by practice court, district, and legal subject matter for client discovery",
          "To facilitate real-time chat, appointment coordination, and consultation intake between users",
          "To display factual advocate credentials, language proficiency, and client ratings",
          "To securely process platform convenience fees and provide transaction receipts",
          "To deliver transactional notifications, appointment alerts, and service updates",
        ],
      },
      {
        title: "Professional Verification & Security",
        items: [
          "To authenticate advocate Bar enrollment numbers and prevent identity impersonation",
          "To maintain administrative review pipelines ensuring only approved advocates receive verified badges",
          "To detect, investigate, and prevent fraudulent activities, cyber threats, and terms violations",
          "To maintain immutable audit logs of terms acceptance and statutory compliance",
        ],
      },
      {
        title: "Platform Enhancement & Legal Awareness",
        items: [
          "To improve navigation, search relevance, and mobile responsiveness",
          "To maintain and update public legal resources, Bare Acts compilations, and legal guidance tools",
          "To generate anonymized, aggregated platform performance analytics",
          "To optimize infrastructure reliability, uptime, and database response speeds",
        ],
      },
      {
        title: "User Support & Dispute Redressal",
        items: [
          "To process and resolve user inquiries, billing questions, and technical support requests",
          "To enable the Designated Grievance Officer to address data protection and platform complaints",
          "To comply with lawful directives, judicial notices, and statutory reporting obligations in India",
        ],
      },
    ],
  },
  sharing: {
    intro: "We do not sell, rent, or trade your personal information. We disclose data solely in accordance with statutory guidelines:",
    items: [
      { title: "Direct Client-Advocate Interaction", desc: "Public advocate profiles (name, designated court, experience, practice fields, ratings) are viewable across the platform. Private case descriptions and consultation chats are accessible only to the specific client and advocate engaged in that conversation." },
      { title: "Technology Infrastructure Providers", desc: "Data is processed through vetted technical service providers under strict data-protection contracts: high-availability cloud servers, licensed payment gateways (Razorpay/PayU), SMS/WhatsApp telecommunications gateways (for OTP verification), and encrypted database hosting." },
      { title: "Professional Verification Authorities", desc: "Advocate enrollment credentials may be cross-referenced with official State Bar Council public records solely to substantiate verified listing credentials." },
      { title: "Statutory & Law Enforcement Requirements", desc: "We may disclose user data if required by an enforceable court order, summons, regulatory directive, or under Section 69 of the Information Technology Act, 2000." },
      { title: "Corporate Reorganization", desc: "In the event of an operational transfer, restructuring, or statutory reorganization of Advocate Hub, user records will transition under the same binding privacy protections." },
      { title: "Explicit Consent", desc: "Any disclosure beyond platform intermediary functionality will occur only upon obtaining affirmative, informed user consent." },
    ],
  },
  "advocate-data": {
    paragraphs: [
      `Advocates onboarding onto Advocate Hub submit professional credentials to establish verified public directory profiles.`,
      `Verified profiles display factual data: advocate full name, practice standing, courts of regular appearance (High Court, District Courts, Taluk JMFCs), specialized practice fields, consultation availability, spoken languages, and client reviews.`,
      `Submitted Bar enrollment credentials (e.g., State Roll IDs, Sanad numbers) are verified by platform administrators. Unapproved advocate accounts remain in a 'Pending Approval' state and are excluded from public search directories until approved.`,
      `Advocate-client communications conducted over the platform are treated as confidential. While Advocate Hub maintains technical infrastructure and transmission metadata, the substance of legal exchanges between advocates and clients is privileged under Section 126 of the Indian Evidence Act, 1872 (and Section 132 of Bharatiya Sakshya Adhiniyam, 2023).`,
      `Advocates are ethically and contractually responsible for ensuring their profile details remain accurate, current, and non-misleading. Comparative advertising or commercial solicitations prohibited by Bar Council of India Rule 36 are strictly disallowed.`,
    ],
  },
  "client-data": {
    paragraphs: [
      `For clients seeking legal assistance, the security and confidentiality of your inquiries are paramount.`,
      `Factual narratives, question descriptions, and documents submitted during consultation intake are shared exclusively with the advocate you select or engage with. Platform administrative staff do not inspect confidential legal intake content except when investigating technical failures or responding to explicit user support requests.`,
      `Client contact details (phone number, email address) are shared with the advocate solely after a consultation request is initiated. Participating advocates are bound by professional ethics not to disseminate or repurpose client information.`,
      `Client consultation history, account credentials, and billing records remain accessible in your password-protected profile. You may request account deactivation and personal data deletion at any time under Section 10.`,
      `Questions submitted to the public Legal Q&A forum are visible to all visitors. Users are cautioned never to publish Aadhaar numbers, bank details, or sensitive personal identifiers in public forums.`,
    ],
  },
  cookies: {
    intro: "Advocate Hub uses essential and analytical cookies to ensure platform functionality, remember user preferences, and safeguard user sessions:",
    types: [
      { name: "Strictly Necessary Cookies", desc: "Required for core security, user authentication, session persistence, and CSRF protection. These cannot be disabled." },
      { name: "Preference Cookies", desc: "Store interface preferences, such as English/Kannada language selection, dark/light theme choice, and saved jurisdictional court filters." },
      { name: "Analytics & Performance Cookies", desc: "Collect aggregated, anonymized usage telemetry to measure page load times, Bare Acts popularity, and feature adoption." },
      { name: "Security & Fraud Detection Cookies", desc: "Identify anomalous browser behavior, prevent automated scraping, and mitigate brute-force authentication attacks." },
    ],
    footer: "You can configure cookie settings through your browser preferences. Restricting strictly necessary cookies may prevent secure authentication and session persistence.",
  },
  "data-security": {
    paragraphs: [
      `Advocate Hub enforces comprehensive technical and organizational safeguards in accordance with the Information Technology (Reasonable Security Practices) Rules, 2011:`,
      `Transport Security: All communications between your device and our servers are encrypted using modern Transport Layer Security (TLS 1.2/1.3) with 256-bit encryption.`,
      `Credential Protection: User passwords are encrypted using salted one-way scrypt / bcrypt hashing algorithms. Plain-text passwords are never stored, logged, or visible to system administrators.`,
      `OTP Architecture: One-Time Passwords (OTPs) generated for registration and login expire automatically within 5 minutes, are hashed using HMAC-SHA256, and are invalidated immediately upon consumption.`,
      `Infrastructure Isolation: Application databases reside within isolated virtual private networks with restricted access, continuous monitoring, and automated database backups.`,
      `Access Controls: Administrative privileges are strictly limited to authorized engineering personnel using multi-factor authentication and role-based access controls (RBAC).`,
      `Security Incident Protocol: In the unlikely event of a confirmed data incident affecting personal data, Advocate Hub will notify affected users and the statutory authorities within the timeframes prescribed by the DPDP Act, 2023.`,
    ],
  },
  "data-retention": {
    intro: "We retain personal data only for as long as necessary to fulfill the operational purposes for which it was collected or to satisfy statutory obligations under Indian law:",
    table: [
      { dataType: "Active Account Profiles", retention: "Retained for the active duration of user account + 180 days post deactivation" },
      { dataType: "Terms Consent Audit Trail", retention: "7 years from account deactivation (statutory audit requirement under IT Rules)" },
      { dataType: "Billing & Payment Invoices", retention: "8 years (as mandated by Indian tax and financial compliance regulations)" },
      { dataType: "Advocate Bar Verification Records", retention: "Maintained for duration of advocate platform standing + 5 years" },
      { dataType: "Encrypted Consultation Messages", retention: "Retained during active matter; purgable upon mutual account deletion" },
      { dataType: "Technical Access & Error Logs", retention: "Rotated and purged within 180 days (anonymized metrics retained for analytics)" },
      { dataType: "Grievance & Dispute Records", retention: "3 years following the formal resolution of the complaint" },
    ],
    footer: "Upon the expiration of the applicable retention schedule, personal data is permanently deleted from production systems or rendered completely non-identifiable through irreversible anonymization.",
  },
  "user-rights": {
    intro: "Under the Digital Personal Data Protection Act, 2023 (DPDP) and applicable Indian information technology rules, data principals possess the following enforceable rights:",
    rights: [
      {
        iconKey: "eye",
        icon: <LegalIcon name="eye" size={20} />,
        title: "Right to Access & Summary",
        desc: "You have the right to obtain a summary of personal data being processed by Advocate Hub, the processing activities undertaken, and the identities of third-party intermediaries with whom data has been shared.",
      },
      {
        iconKey: "amendments",
        icon: <LegalIcon name="amendments" size={20} />,
        title: "Right to Correction & Updating",
        desc: "You can request the prompt correction of misleading, inaccurate, or outdated personal data, or complete incomplete records via account settings or verified request.",
      },
      {
        iconKey: "trash",
        icon: <LegalIcon name="trash" size={20} />,
        title: "Right to Erasure / Deletion",
        desc: "You may request the deletion of your account and associated personal data, unless retention is required by applicable law, court order, or statutory tax regulations.",
      },
      {
        iconKey: "grievance",
        icon: <LegalIcon name="grievance" size={20} />,
        title: "Right to Grievance Redressal",
        desc: "You have the right to accessible, timely grievance redressal through our designated Grievance Officer regarding any matter relating to your personal data.",
      },
      {
        iconKey: "user",
        icon: <LegalIcon name="user" size={20} />,
        title: "Right to Nominate",
        desc: "You have the statutory right under the DPDP Act, 2023 to designate a nominee to exercise your data rights in the event of death or incapacity.",
      },
      {
        iconKey: "prohibited",
        icon: <LegalIcon name="prohibited" size={20} />,
        title: "Right to Withdraw Consent",
        desc: "Where processing is predicated upon voluntary consent, you may withdraw your consent at any time. Withdrawal does not affect the legality of prior processing.",
      },
    ],
    footer: `To exercise any statutory data right, please contact our data compliance desk at ${EMAIL}. Requests are verified and acknowledged within 48 hours.`,
  },
  "third-party": {
    paragraphs: [
      `Advocate Hub may contain links to official external websites, such as the Supreme Court of India, State High Court portals, Bar Council registries, and authorized payment gateways.`,
      `When you navigate to third-party services, their independent privacy terms and data-handling standards govern your interaction. We encourage you to review their policies prior to submitting personal information.`,
      `Third-party cloud infrastructure and telecom gateways (such as cloud hosting and SMS OTP delivery) operate as technical data processors under strict contractual non-disclosure and security safeguards.`,
    ],
  },
  children: {
    paragraphs: [
      `Advocate Hub is designed exclusively for individuals who are at least eighteen (18) years of age and competent to contract under the Indian Contract Act, 1872.`,
      `We do not knowingly solicit or collect personal information from individuals under the age of 18. If a parent or guardian discovers that a minor has created an account or provided personal details without lawful consent, please alert us immediately at advocatehub.in@gmail.com.`,
      `Upon verification, we will promptly deactivate the account and delete any associated records from our active servers.`,
    ],
  },
  grievance: {
    paragraphs: [
      `In strict compliance with Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and Section 12 of the DPDP Act, 2023, Advocate Hub has appointed an official Grievance Officer:`,
    ],
    officer: {
      name: "Adv. Grievance Officer",
      title: "Designated Grievance & Data Protection Officer",
      company: COMPANY,
      entity: ENTITY_PLACEHOLDER,
      email: EMAIL,
      phone: PHONE,
      address: ADDRESS,
      hours: "Monday to Friday, 10:00 AM – 6:00 PM IST (Excluding Public Holidays)",
      response: "Statutory Acknowledgment: Within 48 hours | Resolution: Within 15 to 30 calendar days",
    },
  },
  changes: {
    paragraphs: [
      `Advocate Hub reserves the right to amend, update, or revise this Privacy Policy to maintain conformity with evolving Indian laws, DPDP regulations, judicial precedents, and platform features.`,
      `Material modifications will be notified through a prominent banner on the website or via communication to your registered email address prior to the effective date.`,
      `Your continued use of Advocate Hub following the posting of an updated Privacy Policy constitutes formal acknowledgment and acceptance of the revised provisions. Historical policy versions may be requested via our compliance desk.`,
    ],
  },
  contact: {
    paragraphs: [
      `For any questions, compliance queries, privacy clarifications, or assistance regarding this Privacy Policy, our dedicated support team is available across official channels:`,
    ],
    details: {
      company: COMPANY,
      entity: ENTITY_PLACEHOLDER,
      email: EMAIL,
      phone: PHONE,
      instagram: INSTAGRAM,
      address: ADDRESS,
      website: "https://advocate-hub.up.railway.app/privacy",
    },
  },
};

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [activeSection, setActive] = useState("introduction");
  const [showTOC, setTOC] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    Object.values(sectionRefs.current).forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
    setTOC(false);
  };

  const setRef = (id) => (el) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", color: "#1e293b", background: "#f8fafc", minHeight: "100vh" }}>
      {/* ── STICKY TOP SUB-BAR ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(255,255,255,.96)" : "#ffffff",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid #e2e8f0",
          padding: "0 24px",
          height: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,.06)" : "none",
          transition: "all .2s ease",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            background: "#f1f5f9",
            border: "1px solid #e2e8f0",
            borderRadius: 7,
            padding: "5px 12px",
            cursor: "pointer",
            color: "#2563eb",
            fontSize: 13,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "inherit",
          }}
          title="Back to previous page"
        >
          <LegalIcon name="arrowLeft" size={13} />
          <span>Back</span>
        </button>

        <div style={{ fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#2563eb", fontWeight: 900 }}>Advocate</span>
          <span style={{ color: "#0f766e", fontWeight: 900 }}>Hub</span>
          <span style={{ color: "#64748b", fontSize: 13, fontWeight: 500, marginLeft: 6, borderLeft: "1px solid #cbd5e1", paddingLeft: 8 }}>
            Privacy Policy
          </span>
        </div>

        <button
          type="button"
          onClick={() => setTOC((p) => !p)}
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 7,
            padding: "5px 13px",
            color: "#1d4ed8",
            fontSize: 12.5,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
          title="Open Table of Contents"
        >
          <LegalIcon name="toc" size={14} />
          <span>Contents ({SECTIONS.length})</span>
        </button>
      </div>

      {/* ── MOBILE SLIDE-OVER TOC DRAWER ── */}
      {showTOC && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 200 }} onClick={() => setTOC(false)}>
          <div
            style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 290, background: "#fff", padding: "20px 14px", overflowY: "auto", boxShadow: "-4px 0 20px rgba(0,0,0,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#1e293b", display: "flex", alignItems: "center", gap: 6 }}>
                <LegalIcon name="toc" size={16} />
                <span>Contents ({SECTIONS.length} Sections)</span>
              </div>
              <button
                type="button"
                onClick={() => setTOC(false)}
                style={{ background: "none", border: "none", fontSize: 18, color: "#64748b", cursor: "pointer", padding: "2px 6px" }}
              >
                ×
              </button>
            </div>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`pp-nav-item ${activeSection === s.id ? "active" : ""}`}
                onClick={() => scrollTo(s.id)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 7, border: "none", background: activeSection === s.id ? "#dbeafe" : "transparent", color: activeSection === s.id ? "#1d4ed8" : "#64748b", fontWeight: activeSection === s.id ? 700 : 500, fontSize: 13, width: "100%", textAlign: "left", cursor: "pointer", marginBottom: 3 }}
              >
                <LegalIcon name={s.iconKey} size={15} />
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── HERO BANNER ── */}
      <div style={{ background: "linear-gradient(135deg, #090e17 0%, #0f1f3d 50%, #1e3a8a 100%)", color: "#ffffff", padding: "52px 24px 44px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 68, height: 68, borderRadius: 16, background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.15)", marginBottom: 16 }}>
          <LegalIcon name="lock" size={32} style={{ color: "#38bdf8" }} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 8px", letterSpacing: "-.5px" }}>Privacy Policy</h1>
        <p style={{ fontSize: 14.5, opacity: 0.9, margin: "0 0 20px" }}>
          {COMPANY} • <span style={{ opacity: 0.8, fontFamily: "monospace" }}>{ENTITY_PLACEHOLDER}</span>
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", fontSize: 13, opacity: 0.88 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <LegalIcon name="calendar" size={14} />
            Last Updated: <strong>{LAST_UPDATED}</strong>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <LegalIcon name="check" size={14} />
            Effective: <strong>{EFFECTIVE_DATE}</strong>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <LegalIcon name="platform" size={14} />
            Governed by Indian Law
          </span>
        </div>
      </div>

      {/* ── QUICK SUMMARY BAR ── */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "14px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { iconKey: "prohibited", text: "We never sell your data" },
            { iconKey: "lock", text: "256-bit SSL encrypted platform" },
            { iconKey: "shieldCheck", text: "DPDP Act 2023 compliant" },
            { iconKey: "trash", text: "Right to delete your data" },
            { iconKey: "contact", text: "Statutory grievance officer" },
          ].map((item) => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#334155", fontWeight: 600 }}>
              <LegalIcon name={item.iconKey} size={16} style={{ color: "#2563eb" }} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN LAYOUT: SIDEBAR + CONTENT ── */}
      <div className="pp-layout" style={{ maxWidth: 1220, margin: "0 auto", padding: "32px 20px 60px", display: "flex", gap: 28, alignItems: "flex-start" }}>
        {/* DESKTOP STICKY SIDEBAR */}
        <aside className="pp-sidebar" style={{ width: 260, flexShrink: 0, position: "sticky", top: 72 }}>
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 12px", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.6, padding: "0 10px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Table of Contents</span>
              <span style={{ background: "#eff6ff", color: "#2563eb", padding: "2px 7px", borderRadius: 999 }}>{SECTIONS.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`pp-nav-item ${activeSection === s.id ? "active" : ""}`}
                  onClick={() => scrollTo(s.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "none",
                    background: activeSection === s.id ? "#eff6ff" : "transparent",
                    color: activeSection === s.id ? "#2563eb" : "#64748b",
                    fontWeight: activeSection === s.id ? 700 : 500,
                    fontSize: 12.5,
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all .15s ease",
                  }}
                >
                  <LegalIcon name={s.iconKey} size={15} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 6 }}>
              <Link
                to="/terms-and-conditions"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "7px 10px",
                  borderRadius: 7,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  color: "#2563eb",
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                <LegalIcon name="acceptance" size={13} />
                <span>Terms and Conditions</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN DOCUMENT BODY */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Section 1: Introduction */}
          <div id="introduction" className="pp-section" ref={setRef("introduction")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="acceptance" size={20} /></span>
                {SECTIONS[0].title}
              </h2>
              {CONTENT.introduction.paragraphs.map((p, i) => (
                <p key={i} className="pp-para">{p}</p>
              ))}
            </div>
          </div>

          {/* Section 2: Information We Collect */}
          <div id="information-collect" className="pp-section" ref={setRef("information-collect")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="collection" size={20} /></span>
                {SECTIONS[1].title}
              </h2>
              <p className="pp-para">{CONTENT["information-collect"].intro}</p>
              {CONTENT["information-collect"].subsections.map((sub) => (
                <div key={sub.title}>
                  <div className="pp-sub-title">{sub.title}</div>
                  <ul className="pp-list">
                    {sub.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: How We Use */}
          <div id="how-we-use" className="pp-section" ref={setRef("how-we-use")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="settings" size={20} /></span>
                {SECTIONS[2].title}
              </h2>
              <p className="pp-para">{CONTENT["how-we-use"].intro}</p>
              {CONTENT["how-we-use"].groups.map((grp) => (
                <div key={grp.title}>
                  <div className="pp-group-title">{grp.title}</div>
                  <ul className="pp-list">
                    {grp.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Sharing */}
          <div id="sharing" className="pp-section" ref={setRef("sharing")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="sharing" size={20} /></span>
                {SECTIONS[3].title}
              </h2>
              <p className="pp-para">{CONTENT.sharing.intro}</p>
              {CONTENT.sharing.items.map((item) => (
                <div key={item.title} className="pp-share-item">
                  <div>
                    <div className="pp-share-title">{item.title}</div>
                    <div className="pp-share-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Advocate Data */}
          <div id="advocate-data" className="pp-section" ref={setRef("advocate-data")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="scale" size={20} /></span>
                {SECTIONS[4].title}
              </h2>
              {CONTENT["advocate-data"].paragraphs.map((p, i) => (
                <p key={i} className="pp-para">{p}</p>
              ))}
            </div>
          </div>

          {/* Section 6: Client Data */}
          <div id="client-data" className="pp-section" ref={setRef("client-data")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="user" size={20} /></span>
                {SECTIONS[5].title}
              </h2>
              {CONTENT["client-data"].paragraphs.map((p, i) => (
                <p key={i} className="pp-para">{p}</p>
              ))}
            </div>
          </div>

          {/* Section 7: Cookies */}
          <div id="cookies" className="pp-section" ref={setRef("cookies")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="cookie" size={20} /></span>
                {SECTIONS[6].title}
              </h2>
              <p className="pp-para">{CONTENT.cookies.intro}</p>
              {CONTENT.cookies.types.map((c) => (
                <div key={c.name} className="pp-cookie-card">
                  <div className="pp-cookie-name">{c.name}</div>
                  <div className="pp-cookie-desc">{c.desc}</div>
                </div>
              ))}
              <p className="pp-para" style={{ marginTop: 14 }}>{CONTENT.cookies.footer}</p>
            </div>
          </div>

          {/* Section 8: Data Security */}
          <div id="data-security" className="pp-section" ref={setRef("data-security")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="lock" size={20} /></span>
                {SECTIONS[7].title}
              </h2>
              {CONTENT["data-security"].paragraphs.map((p, i) => (
                <p key={i} className="pp-para">{p}</p>
              ))}
            </div>
          </div>

          {/* Section 9: Data Retention */}
          <div id="data-retention" className="pp-section" ref={setRef("data-retention")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="retention" size={20} /></span>
                {SECTIONS[8].title}
              </h2>
              <p className="pp-para">{CONTENT["data-retention"].intro}</p>
              <table className="pp-table">
                <thead>
                  <tr>
                    <th>Data Category</th>
                    <th>Retention Period & Statutory Basis</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTENT["data-retention"].table.map((row) => (
                    <tr key={row.dataType}>
                      <td style={{ fontWeight: 600 }}>{row.dataType}</td>
                      <td>{row.retention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="pp-para" style={{ marginTop: 14 }}>{CONTENT["data-retention"].footer}</p>
            </div>
          </div>

          {/* Section 10: User Rights */}
          <div id="user-rights" className="pp-section" ref={setRef("user-rights")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="rights" size={20} /></span>
                {SECTIONS[9].title}
              </h2>
              <p className="pp-para">{CONTENT["user-rights"].intro}</p>
              {CONTENT["user-rights"].rights.map((r) => (
                <div key={r.title} className="pp-right-card">
                  <div className="pp-right-icon">{r.icon}</div>
                  <div>
                    <div className="pp-right-title">{r.title}</div>
                    <div className="pp-right-desc">{r.desc}</div>
                  </div>
                </div>
              ))}
              <div className="pp-info-box" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LegalIcon name="mail" size={16} />
                <span>To exercise your statutory data rights, email: <strong>{EMAIL}</strong></span>
              </div>
            </div>
          </div>

          {/* Section 11: Third Party */}
          <div id="third-party" className="pp-section" ref={setRef("third-party")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="thirdParty" size={20} /></span>
                {SECTIONS[10].title}
              </h2>
              {CONTENT["third-party"].paragraphs.map((p, i) => (
                <p key={i} className="pp-para">{p}</p>
              ))}
            </div>
          </div>

          {/* Section 12: Children */}
          <div id="children" className="pp-section" ref={setRef("children")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="children" size={20} /></span>
                {SECTIONS[11].title}
              </h2>
              {CONTENT.children.paragraphs.map((p, i) => (
                <p key={i} className="pp-para">{p}</p>
              ))}
            </div>
          </div>

          {/* Section 13: Grievance Officer */}
          <div id="grievance" className="pp-section" ref={setRef("grievance")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="grievance" size={20} /></span>
                {SECTIONS[12].title}
              </h2>
              {CONTENT.grievance.paragraphs.map((p, i) => (
                <p key={i} className="pp-para">{p}</p>
              ))}
              <div className="pp-officer-card">
                {[
                  { label: "Designation", val: CONTENT.grievance.officer.title },
                  { label: "Platform Entity", val: CONTENT.grievance.officer.entity },
                  { label: "Email", val: CONTENT.grievance.officer.email },
                  { label: "Helpline", val: CONTENT.grievance.officer.phone },
                  { label: "Location", val: CONTENT.grievance.officer.address },
                  { label: "Working Hours", val: CONTENT.grievance.officer.hours },
                  { label: "Resolution SLA", val: CONTENT.grievance.officer.response },
                ].map((row) => (
                  <div key={row.label} className="pp-detail-row">
                    <span className="pp-detail-label">{row.label}</span>
                    <span className="pp-detail-val">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 14: Changes */}
          <div id="changes" className="pp-section" ref={setRef("changes")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="amendments" size={20} /></span>
                {SECTIONS[13].title}
              </h2>
              {CONTENT.changes.paragraphs.map((p, i) => (
                <p key={i} className="pp-para">{p}</p>
              ))}
            </div>
          </div>

          {/* Section 15: Contact Us */}
          <div id="contact" className="pp-section" ref={setRef("contact")}>
            <div className="pp-card">
              <h2 className="pp-section-title">
                <span><LegalIcon name="contact" size={20} /></span>
                {SECTIONS[14].title}
              </h2>
              {CONTENT.contact.paragraphs.map((p, i) => (
                <p key={i} className="pp-para">{p}</p>
              ))}
              <div className="pp-contact-card">
                {[
                  { label: "Platform", val: CONTENT.contact.details.company },
                  { label: "Entity Status", val: CONTENT.contact.details.entity },
                  { label: "Email", val: CONTENT.contact.details.email },
                  { label: "Instagram", val: CONTENT.contact.details.instagram },
                  { label: "Helpline", val: CONTENT.contact.details.phone },
                  { label: "Location", val: CONTENT.contact.details.address },
                  { label: "Website", val: CONTENT.contact.details.website },
                ].map((row) => (
                  <div key={row.label} className="pp-detail-row">
                    <span className="pp-detail-label">{row.label}</span>
                    <span className="pp-detail-val">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: "20px 24px",
              textAlign: "center",
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.7,
            }}
          >
            This Privacy Policy is effective as of <strong>{EFFECTIVE_DATE}</strong> and was last updated on <strong>{LAST_UPDATED}</strong>.<br />
            By using Advocate Hub, you acknowledge that you have read and understood this Privacy Policy.<br />
            <span style={{ color: "#2563eb", fontWeight: 600 }}>© 2026 {COMPANY}. All rights reserved.</span>
          </div>
        </main>
      </div>
    </div>
  );
}
