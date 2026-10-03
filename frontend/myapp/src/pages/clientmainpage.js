// ============================================================
//  clientmainpage.js — Client Main Portal & Legal Clarity Hub
//  Supports: English & Kannada (ಕನ್ನಡ), Word-Target Filtering,
//  and One-Click Advocate Setup.
// ============================================================

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import defaultClarityData from "../data/clarityguide.json";
import { assetUrl } from "../data/api";
import { getTheme, setTheme as setGlobalTheme } from "../data/themeStore";
import { getAdvocates, loadAdvocates } from "../data/Advocatesstore";
import { BARE_ACTS, CATEGORIES as BARE_ACTS_CATEGORIES, CAT_COLORS as BARE_ACTS_COLORS } from "./BareActs";
import { LEGAL_DOCUMENTS, LEGAL_DOC_CATEGORIES } from "./LegalDocuments";
import "./clientmainpage.css";

const SESSION_KEY = "law4u_client_id";
const CLIENT_OBJ_KEY = "law4u_client";
const CLIENT_TOKEN_KEY = "law4u_client_token";
const LANG_KEY = "law4u_language";
const ITEMS_PER_PAGE = 20;

const AVATAR_PRESETS = [
  "/uploads/chetan.png",
  "/uploads/karna.png",
  "/uploads/anand.png",
  "/uploads/kiran.png",
  "/uploads/deep-p.png",
];

// Professional stroke SVG icons for Client Portal
const CMP_ICONS = {
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
    </svg>
  ),
  clarity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h18" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  lawyer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  ),
  bot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="2.5" />
      <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="2.5" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10" />
      <path d="M6 10h10" />
    </svg>
  ),
  document: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// Localized strings
const I18N = {
  en: {
    portalTitle: "Client Portal",
    clientArea: "👤 Client Area",
    logout: "Logout",
    langButton: "ಕನ್ನಡ",
    theme: "Theme Mode",
    lightTheme: "☀️ Light",
    darkTheme: "🌙 Dark",
    language: "Language",
    chooseAvatar: "Change Avatar Photo",
    uploadPhoto: "Upload Custom Photo",
    chatNav: "💬 Chat with Advocates",
    clarityNav: "⚖️ Legal Clarity Guide",
    navHub: "Dashboard",
    navChat: "Advocate Chat",
    navClarity: "Clarity Guide",
    navFind: "Find Lawyers",
    heroTrust1: "End-to-End Encrypted",
    heroTrust2: "Instant Advocate Connect",
    heroTrust3: "770+ Legal Situations",
    card1Point1: "Verified Bar Council Legal Practitioners",
    card1Point2: "Confidential Document & Case Details Sharing",
    card1Point3: "Real-Time Expert Legal Guidance & Action Plan",
    card2Point1: "Identify Governing Acts, Laws (BNS/IPC) & Sections",
    card2Point2: "Determine Standing to File & Accused Liability",
    card2Point3: "1-Click Case Setup & Automatic Specialist Match",
    quickServicesTitle: "Quick Legal Services & Tools",
    quickServicesSub: "Access essential resources across the Advocates Hub ecosystem",
    qs1Title: "Find Lawyers By City",
    qs1Desc: "Explore 50,000+ advocates across 700+ cities in India",
    qs2Title: "AI Legal Assistant",
    qs2Desc: "Ask 24/7 legal questions and get instant guidance",
    qs3Title: "Indian Bare Acts & Laws",
    qs3Desc: "Access complete statutes, BNS, penal codes & acts",
    qs4Title: "Legal Documents & Drafts",
    qs4Desc: "Download rental agreements, notices, wills & drafts",
    clientRole: "Client Account",
    profileSettings: "Profile & Settings",
    hubBadge: "🌟 Client Services Hub",
    welcome: "Welcome",
    hubSubtitle: "Select an option below to proceed. Connect directly with legal experts or explore our comprehensive case clarity guide to understand which advocate fits your legal matter.",
    card1Tag: "Direct Communication",
    card1Title: "Chat with Advocates",
    card1Desc: "Browse approved legal practitioners, ask real-time questions, discuss your case details, and get professional advice directly through our secure chat.",
    card1Btn: "Open Advocate Chat →",
    card2Tag: "Case Clarity Purpose",
    card2Title: "Advocate & Case Clarity",
    card2Desc: "Confused about laws, accused parties, or who to hire? Review our legal clarity guide with practical examples to pinpoint the exact law and advocate specialization you need.",
    card2Btn: "View Clarity Guide →",
    backBtn: "← Back to Main Menu",
    chatCta: "💬 Ready to Consult? Chat with Advocates →",
    guideTitle: "⚖️ Legal Clarity Guide for Clients",
    guideSubtitle: "Use this guide to understand your legal situation, identify the governing acts/laws, see who bears liability, confirm who has standing to file, and find the right type of advocate.",
    guideBadge: "📚 Database of 770+ Legal Situations & Specializations",
    allCategories: "All",
    searchPlaceholder: "🔍 Search situation, act/law, accused, who can file, or advocate...",
    clearBtn: "Clear",
    foundResults: (count) => `Found ${count} situation${count === 1 ? "" : "s"}`,
    thSituation: "Situation",
    thActLaw: "Act / Law",
    thAccused: "Who is accused?",
    thWhoCanFile: "Who can file/apply?",
    thAdvocate: "Advocate",
    chatWithAdvocate: "Chat with Advocate →",
    setUpCase: "⚡ Set Up This Case →",
    noResults: (q) => `No legal situations matching "${q}". Try different keywords.`,
    pageOf: (current, total) => `Page ${current} of ${total}`,
    showingOf: (from, to, total) => `Showing ${from} to ${to} of ${total} situations`,
    first: "« First",
    prev: "‹ Prev",
    next: "Next ›",
    last: "Last »",
    tipTitle: "💡 Legal Guidance Tip:",
    tipText: "Many legal matters involve both civil compensation and criminal liability. For example, in road accidents, criminal charges for negligence run in court while the Motor Accident Claims Tribunal (MACT) handles insurance compensation.",
    bannerTitle: "Found the situation matching your case?",
    bannerDesc: "Chat directly with approved advocates specializing in your specific legal domain.",
    bannerBtn: "Proceed to Advocate Chat →",
    // Embedded Sub-views
    flBadge: "📍 50,000+ Advocates Across 700+ Cities",
    flTitle: "Find Lawyers By City & Specialization",
    flSub: "Explore verified advocates practicing across District Courts, High Courts, and specialized tribunals across India.",
    flCityAll: "All Cities / Regions",
    flPracticeAll: "All Practices",
    flSearchPlaceholder: "Search advocate by name, court, city, or bar ID...",
    flFound: (count) => `Showing ${count} verified advocate${count === 1 ? "" : "s"}`,
    flChatNow: "Chat Now",
    flViewProfile: "View Details",
    flNoMatches: "No advocates match your search criteria. Try selecting 'All Cities' or clearing search.",
    flResetFilters: "Reset Filters",
    flConsultFee: "₹10 Instant Consultation",
    aiBadge: "🤖 24/7 AI Legal Intelligence",
    aiTitle: "AI Legal Assistant & Statutory Advisor",
    aiSub: "Ask legal questions regarding Indian statutes, BNS 2023, bail procedures, property disputes, or family laws and receive instant guidance.",
    aiConsultAdvocate: "💬 Consult Human Advocate →",
    aiInputPlaceholder: "Type your legal question (e.g. 'How to file for anticipatory bail?')...",
    aiSend: "Send",
    aiListening: "Listening...",
    aiClear: "Clear Chat",
    aiDisclaimer: "ℹ️ AI Legal Assistant provides statutory guidance based on Indian law. For binding legal representation, please consult a verified advocate.",
    aiPromptsTitle: "💡 Quick Legal Prompts:",
    baBadge: "📜 Official Statutes & Legislation",
    baTitle: "Indian Bare Acts & Statutory Codes",
    baSub: "Browse, search, read and download complete Indian legislation including new criminal laws (BNS, BNSS, BSA 2023).",
    baConsultAdvocate: "💬 Consult Advocate on Act →",
    baNewBanner: "🆕 New Criminal Laws 2023 (BNS, BNSS & BSA) have replaced IPC, CrPC and Indian Evidence Act.",
    baSearchPlaceholder: "Search bare acts by title, short name or keyword (e.g. BNS, IPC, RERA)...",
    baReadBtn: "📖 Read Act",
    baDownloadBtn: "⬇ PDF",
    baDownloadFull: "⬇ Download Full PDF",
    baSectionsHeader: "Sections & Chapters",
    baShowingSample: "Showing sample statutory provisions. Download for complete act text.",
    ldBadge: "📝 20+ Verified Drafts & Templates",
    ldTitle: "Legal Documents, Agreements & Court Drafts",
    ldSub: "Download ready-to-use Indian legal formats, contract templates, notices, and court petitions verified by legal experts.",
    ldConsultAdvocate: "💬 Have an Advocate Review Draft →",
    ldSearchPlaceholder: "Search drafts (e.g. Rental Agreement, Bail Application, NDA, Sale Deed)...",
    ldPreviewBtn: "👁 Preview Draft",
    ldDownloadBtn: "⬇ Download Template",
    ldFree: "FREE",
    ldPremium: "PREMIUM",
    ldDownloads: (n) => `${n.toLocaleString()} downloads`,
    ldClose: "Close Preview",
  },
  kn: {
    portalTitle: "ಕ್ಲೈಂಟ್ ಪೋರ್ಟಲ್",
    clientArea: "👤 ಕ್ಲೈಂಟ್ ವಿಭಾಗ",
    logout: "ಲಾಗ್‌ಔಟ್",
    langButton: "English",
    theme: "ಥೀಮ್ ಮೋಡ್ (Theme)",
    lightTheme: "☀️ ಲೈಟ್ (Light)",
    darkTheme: "🌙 ಡಾರ್ಕ್ (Dark)",
    language: "ಭಾಷೆ (Language)",
    chooseAvatar: "ಅವತಾರ್ ಬದಲಾಯಿಸಿ",
    uploadPhoto: "ಕಸ್ಟಮ್ ಫೋಟೋ ಅಪ್‌ಲೋಡ್",
    chatNav: "💬 ವಕೀಲರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ",
    clarityNav: "⚖️ ಕಾನೂನು ಸ್ಪಷ್ಟತೆ ಮಾರ್ಗದರ್ಶಿ",
    navHub: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navChat: "ವಕೀಲರ ಚಾಟ್",
    navClarity: "ಸ್ಪಷ್ಟತೆ ಮಾರ್ಗದರ್ಶಿ",
    navFind: "ವಕೀಲರನ್ನು ಹುಡುಕಿ",
    heroTrust1: "ಎಂಡ್‌-ಟು-ಎಂಡ್‌ ಎನ್‌ಕ್ರಿಪ್ಟೆಡ್‌",
    heroTrust2: "ತಕ್ಷಣದ ವಕೀಲರ ಸಂಪರ್ಕ",
    heroTrust3: "೭೭೦+ ಪ್ರಕರಣಗಳ ಡಾಟಾಬೇಸ್",
    card1Point1: "ಬಾರ್ ಕೌನ್ಸಿಲ್ ಮಾನ್ಯತೆ ಪಡೆದ ತಜ್ಞ ವಕೀಲರು",
    card1Point2: "ಸುರಕ್ಷಿತ ದಾಖಲೆ ಹಂಚಿಕೆ ಮತ್ತು ಕೇಸ್ ವಿವರಣೆ",
    card1Point3: "ತಕ್ಷಣದ ಸಲಹೆ ಮತ್ತು ನೈಜ ಸಮಯದ ಸಂಭಾಷಣೆ",
    card2Point1: "ಅನ್ವಯವಾಗುವ ಕಾಯ್ದೆಗಳು (BNS, IPC) ಮತ್ತು ಕಲಂಗಳು",
    card2Point2: "ಯಾರು ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು ಮತ್ತು ಆರೋಪಿ ಹೊಣೆಗಾರಿಕೆ",
    card2Point3: "೧-ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಕೇಸ್ ಸೆಟ್ ಮಾಡಿ ಸೂಕ್ತ ವಕೀಲರ ಹೊಂದಾಣಿಕೆ",
    quickServicesTitle: "ತ್ವರಿತ ಕಾನೂನು ಸೇವೆಗಳು ಮತ್ತು ಪರಿಕರಗಳು",
    quickServicesSub: "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನ ಎಲ್ಲಾ ಪ್ರಮುಖ ಸೇವೆಗಳನ್ನು ಸುಲಭವಾಗಿ ಬಳಸಿ",
    qs1Title: "ನಗರವಾರು ವಕೀಲರನ್ನು ಹುಡುಕಿ",
    qs1Desc: "ಬೆಂಗಳೂರು, ದೆಹಲಿ ಸೇರಿದಂತೆ ೭೦೦+ ನಗರಗಳ ೫೦,೦೦೦+ ವಕೀಲರು",
    qs2Title: "ಎಐ ಕಾನೂನು ಸಹಾಯಕ",
    qs2Desc: "೨೪/೭ ತಕ್ಷಣವೇ ಕಾನೂನು ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರ ಪಡೆಯಿರಿ",
    qs3Title: "ಭಾರತೀಯ ಕಾಯ್ದೆಗಳು (Bare Acts)",
    qs3Desc: "BNS, BNSS, ಸಂವಿಧಾನ ಮತ್ತು ಎಲ್ಲಾ ಪ್ರಮುಖ ಕಾಯ್ದೆಗಳು",
    qs4Title: "ಕಾನೂನು ದಾಖಲೆಗಳು (Documents)",
    qs4Desc: "ಕರಾರು ಒಪ್ಪಂದಗಳು, ನೋಟಿಸ್‌ಗಳು ಮತ್ತು ಫಾರ್ಮ್‌ಗಳು",
    clientRole: "ಕ್ಲೈಂಟ್ ಖಾತೆ",
    profileSettings: "ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್ಸ್",
    hubBadge: "🌟 ಕ್ಲೈಂಟ್ ಸೇವಾ ಕೇಂದ್ರ",
    welcome: "ಸ್ವಾಗತ",
    hubSubtitle: "ಮುಂದುವರಿಯಲು ಕೆಳಗಿನ ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ. ನೀವು ನೇರವಾಗಿ ವಕೀಲರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಬಹುದು ಅಥವಾ ನಿಮ್ಮ ಕೇಸ್‌ಗೆ ಸೂಕ್ತವಾದ ವಕೀಲರನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ನಮ್ಮ ಸ್ಪಷ್ಟತೆ ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಪರಿಶೀಲಿಸಬಹುದು.",
    card1Tag: "ನೇರ ಸಂಭಾಷಣೆ",
    card1Title: "ವಕೀಲರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ",
    card1Desc: "ಅನುಮೋದಿತ ವಕೀಲರನ್ನು ಹುಡುಕಿ, ನಿಮ್ಮ ಕಾನೂನು ಸಮಸ್ಯೆಗಳನ್ನು ಚರ್ಚಿಸಿ, ಸಂದೇಹಗಳನ್ನು ಕೇಳಿ ಮತ್ತು ಸುರಕ್ಷಿತ ಚಾಟ್ ಮೂಲಕ ತಕ್ಷಣವೇ ಸಲಹೆ ಪಡೆಯಿರಿ.",
    card1Btn: "ವಕೀಲರ ಚಾಟ್ ತೆರೆಯಿರಿ →",
    card2Tag: "ಕೇಸ್ ಸ್ಪಷ್ಟತೆ ಉದ್ದೇಶ",
    card2Title: "ವಕೀಲರು ಮತ್ತು ಕೇಸ್ ಸ್ಪಷ್ಟತೆ",
    card2Desc: "ಯಾವ ಕಾಯ್ದೆ ಅನ್ವಯವಾಗುತ್ತದೆ? ಆರೋಪಿ ಯಾರು? ಯಾವ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಬೇಕು? ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಗೆ ಸೂಕ್ತವಾದ ನಿಖರ ಕಾಯ್ದೆ ಮತ್ತು ವಕೀಲರನ್ನು ತಿಳಿಯಿರಿ.",
    card2Btn: "ಸ್ಪಷ್ಟತೆ ಮಾರ್ಗದರ್ಶಿ ವೀಕ್ಷಿಸಿ →",
    backBtn: "← ಮುಖ್ಯ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    chatCta: "💬 ಸಮಾಲೋಚನೆಗೆ ಸಿದ್ಧವೇ? ವಕೀಲರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ →",
    guideTitle: "⚖️ ಗ್ರಾಹಕರಿಗಾಗಿ ಕಾನೂನು ಸ್ಪಷ್ಟತೆ ಮಾರ್ಗದರ್ಶಿ",
    guideSubtitle: "ನಿಮ್ಮ ಕಾನೂನು ಪರಿಸ್ಥಿತಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ, ಅನ್ವಯವಾಗುವ ಕಾಯ್ದೆಗಳನ್ನು ತಿಳಿಯಿರಿ, ಹೊಣೆಗಾರಿಕೆ ಯಾರದ್ದು ಮತ್ತು ಯಾವ ವಕೀಲರು ಅಗತ್ಯವೆಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
    guideBadge: "📚 770+ ಕಾನೂನು ಸನ್ನಿವೇಶಗಳು ಮತ್ತು ಪರಿಹಾರಗಳು",
    allCategories: "ಎಲ್ಲಾ",
    searchPlaceholder: "🔍 ಪರಿಸ್ಥಿತಿ, ಕಾಯ್ದೆ, ಆರೋಪಿ, ಅರ್ಜಿ ಸಲ್ಲಿಸುವವರು, ವಕೀಲರನ್ನು ಹುಡುಕಿ...",
    clearBtn: "ತೆರವುಗೊಳಿಸಿ",
    foundResults: (count) => `${count} ಸನ್ನಿವೇಶಗಳು ಕಂಡುಬಂದಿವೆ`,
    thSituation: "ಪರಿಸ್ಥಿತಿ (Situation)",
    thActLaw: "ಕಾಯ್ದೆ / ಕಾನೂನು (Act / Law)",
    thAccused: "ಆರೋಪಿ ಯಾರು? (Accused)",
    thWhoCanFile: "ಯಾರು ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು? (Who can file)",
    thAdvocate: "ವಕೀಲರು (Advocate)",
    chatWithAdvocate: "ವಕೀಲರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ →",
    setUpCase: "⚡ ಈ ಕೇಸ್ ಸೆಟ್ ಮಾಡಿ →",
    noResults: (q) => `"${q}" ಗೆ ಸಂಬಂಧಿಸಿದ ಯಾವುದೇ ಸನ್ನಿವೇಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಬೇರೆ ಪದಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ.`,
    pageOf: (current, total) => `ಪುಟ ${current} / ${total}`,
    showingOf: (from, to, total) => `${total} ಸನ್ನಿವೇಶಗಳಲ್ಲಿ ${from} ರಿಂದ ${to} ತೋರಿಸಲಾಗುತ್ತಿದೆ`,
    first: "« ಮೊದಲನೆಯದು",
    prev: "‹ ಹಿಂದಿನದು",
    next: "ಮುಂದಿನದು ›",
    last: "ಕೊನೆಯದು »",
    tipTitle: "💡 ಕಾನೂನು ಸಲಹೆ:",
    tipText: "ಅನೇಕ ಕಾನೂನು ವಿಷಯಗಳು ಸಿವಿಲ್ ಪರಿಹಾರ ಮತ್ತು ಕ್ರಿಮಿನಲ್ ಹೊಣೆಗಾರಿಕೆ ಎರಡನ್ನೂ ಒಳಗೊಂಡಿರುತ್ತವೆ. ಉದಾಹರಣೆಗೆ ರಸ್ತೆ ಅಪಘಾತಗಳಲ್ಲಿ ಕ್ರಿಮಿನಲ್ ಪ್ರಕರಣ ನಡೆಯುವ ಜೊತೆಗೆ MACT ನ್ಯಾಯಮಂಡಳಿಯಲ್ಲಿ ಪರಿಹಾರ ಕ್ಲೈಮ್ ಮಾಡಲಾಗುತ್ತದೆ.",
    bannerTitle: "ನಿಮ್ಮ ಸಮಸ್ಯೆಗೆ ಸೂಕ್ತವಾದ ಸನ್ನಿವೇಶ ಸಿಕ್ಕಿತೇ?",
    bannerDesc: "ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಕಾನೂನು ಕ್ಷೇತ್ರದಲ್ಲಿ ಪರಿಣಿತಿ ಹೊಂದಿರುವ ಅನುಮೋದಿತ ವಕೀಲರೊಂದಿಗೆ ನೇರವಾಗಿ ಚಾಟ್ ಮಾಡಿ.",
    bannerBtn: "ವಕೀಲರ ಚಾಟ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ →",
    // Embedded Sub-views
    flBadge: "📍 ೭೦೦+ ನಗರಗಳ ೫೦,೦೦೦+ ಮಾನ್ಯತೆ ಪಡೆದ ವಕೀಲರು",
    flTitle: "ನಗರ ಮತ್ತು ಪರಿಣತಿ ಆಧಾರಿತ ವಕೀಲರನ್ನು ಹುಡುಕಿ",
    flSub: "ಜಿಲ್ಲಾ ನ್ಯಾಯಾಲಯ, ಹೈಕೋರ್ಟ್ ಮತ್ತು ಸುಪ್ರೀಂ ಕೋರ್ಟ್‌ನಲ್ಲಿ ಅಭ್ಯಾಸ ಮಾಡುವ ಪರಿಣಿತ ವಕೀಲರನ್ನು ಸುಲಭವಾಗಿ ಹುಡುಕಿ ಸಂಪರ್ಕಿಸಿ.",
    flCityAll: "ಎಲ್ಲಾ ನಗರಗಳು / ಪ್ರದೇಶಗಳು",
    flPracticeAll: "ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳು",
    flSearchPlaceholder: "ವಕೀಲರ ಹೆಸರು, ಕೋರ್ಟ್, ನಗರ ಅಥವಾ ಬಾರ್ ಐಡಿ ಹುಡುಕಿ...",
    flFound: (count) => `${count} ಪರಿಶೀಲಿಸಿದ ವಕೀಲರು ಲಭ್ಯವಿದ್ದಾರೆ`,
    flChatNow: "ಚಾಟ್ ಮಾಡಿ",
    flViewProfile: "ವಿವರ ವೀಕ್ಷಿಸಿ",
    flNoMatches: "ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುವ ವಕೀಲರು ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಿ.",
    flResetFilters: "ಫಿಲ್ಟರ್ ಮರುಹೊಂದಿಸಿ",
    flConsultFee: "₹೧೦ ತಕ್ಷಣದ ಸಮಾಲೋಚನೆ",
    aiBadge: "🤖 ೨೪/೭ ಎಐ ಕಾನೂನು ಗುಪ್ತಚರ",
    aiTitle: "ಎಐ ಕಾನೂನು ಸಹಾಯಕ ಮತ್ತು ಶಾಸನಬದ್ಧ ಸಲಹೆಗಾರ",
    aiSub: "ಭಾರತೀಯ ಕಾಯ್ದೆಗಳು (BNS, BNSS, IPC, CrPC, ಆಸ್ತಿ, ಕೌಟುಂಬಿಕ) ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ ಮತ್ತು ತಕ್ಷಣದ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.",
    aiConsultAdvocate: "💬 ನೈಜ ವಕೀಲರೊಂದಿಗೆ ಸಮಾಲೋಚಿಸಿ →",
    aiInputPlaceholder: "ನಿಮ್ಮ ಕಾನೂನು ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ (ಉದಾ: 'ನಿರೀಕ್ಷಣಾ ಜಾಮೀನು ಹೇಗೆ ಪಡೆಯುವುದು?')...",
    aiSend: "ಕಳುಹಿಸಿ",
    aiListening: "ಆಲಿಸುತ್ತಿದೆ...",
    aiClear: "ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ",
    aiDisclaimer: "ℹ️ ಎಐ ಕಾನೂನು ಸಹಾಯಕ ಭಾರತೀಯ ಕಾಯ್ದೆಗಳ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸುತ್ತದೆ. ನ್ಯಾಯಾಲಯದಲ್ಲಿ ಪ್ರತಿನಿಧಿಸಲು ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    aiPromptsTitle: "💡 ತ್ವರಿತ ಕಾನೂನು ಪ್ರಶ್ನೆಗಳು:",
    baBadge: "📜 ಅಧಿಕೃತ ಭಾರತೀಯ ಕಾಯ್ದೆಗಳು ಮತ್ತು ಸಂಹಿತೆಗಳು",
    baTitle: "ಭಾರತೀಯ ಕಾಯ್ದೆಗಳು (Bare Acts & Codes)",
    baSub: "BNS, BNSS, BSA ಸೇರಿದಂತೆ ಎಲ್ಲಾ ಪ್ರಮುಖ ಭಾರತೀಯ ಕಾಯ್ದೆಗಳನ್ನು ಓದಿ ಮತ್ತು ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.",
    baConsultAdvocate: "💬 ಕಾಯ್ದೆಯ ಬಗ್ಗೆ ವಕೀಲರೊಂದಿಗೆ ಚರ್ಚಿಸಿ →",
    baNewBanner: "🆕 ಹೊಸ ಅಪರಾಧ ಕಾಯ್ದೆಗಳು 2023 (BNS, BNSS ಮತ್ತು BSA) ಜುಲೈ 2024 ರಿಂದ IPC, CrPC ಬದಲಿಗೆ ಜಾರಿಗೆ ಬಂದಿವೆ.",
    baSearchPlaceholder: "ಕಾಯ್ದೆಯ ಹೆಸರು ಅಥವಾ ಸಂಕ್ಷಿಪ್ತ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ (BNS, IPC, RERA)...",
    baReadBtn: "📖 ಕಾಯ್ದೆ ಓದಿ",
    baDownloadBtn: "⬇ ಪಿಡಿಎಫ್",
    baDownloadFull: "⬇ ಪೂರ್ಣ ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್",
    baSectionsHeader: "ಕಲಂಗಳು ಮತ್ತು ಅಧ್ಯಾಯಗಳು",
    baShowingSample: "ಮಾದರಿ ಕಲಂಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ. ಸಂಪೂರ್ಣ ಕಾಯ್ದೆಗೆ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.",
    ldBadge: "📝 ೨೦+ ಪರಿಶೀಲಿಸಿದ ಕಾನೂನು ಕರಡುಗಳು",
    ldTitle: "ಕಾನೂನು ದಾಖಲೆಗಳು, ಒಪ್ಪಂದಗಳು ಮತ್ತು ಕರಡುಗಳು",
    ldSub: "ನ್ಯಾಯಾಲಯದ ಅರ್ಜಿಗಳು, ಬಾಡಿಗೆ ಒಪ್ಪಂದಗಳು, ನೋಟಿಸ್‌ಗಳು ಮತ್ತು ಕಾನೂನು ಕರಡುಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.",
    ldConsultAdvocate: "💬 ವಕೀಲರಿಂದ ಕರಡು ಪರಿಶೀಲನೆ ಮಾಡಿಸಿ →",
    ldSearchPlaceholder: "ಕರಡುಗಳನ್ನು ಹುಡುಕಿ (ಬಾಡಿಗೆ ಒಪ್ಪಂದ, ಜಾಮೀನು ಅರ್ಜಿ, NDA)...",
    ldPreviewBtn: "👁 ಮುನ್ನೋಟ",
    ldDownloadBtn: "⬇ ಟೆಂಪ್ಲೇಟ್ ಡೌನ್‌ಲೋಡ್",
    ldFree: "ಉಚಿತ",
    ldPremium: "ಪ್ರೀಮಿಯಂ",
    ldDownloads: (n) => `${n.toLocaleString()} ಡೌನ್‌ಲೋಡ್‌ಗಳು`,
    ldClose: "ಮುಚ್ಚಿ",
  },
};

// Target keyword mapping to locate matching advocate in ClientDashboard
function getAdvocateSearchKeyword(item) {
  const combined = `${item.advocate || ""} ${item.category || ""} ${item.actLaw || ""}`.toLowerCase();
  if (combined.includes("tax") || combined.includes("income tax") || combined.includes("gst")) return "Tax";
  if (combined.includes("criminal") || combined.includes("bns") || combined.includes("murder") || combined.includes("assault")) return "Criminal";
  if (combined.includes("family") || combined.includes("divorce") || combined.includes("matrimonial") || combined.includes("custody")) return "Family";
  if (combined.includes("property") || combined.includes("land") || combined.includes("rera") || combined.includes("partition")) return "Property";
  if (combined.includes("corporate") || combined.includes("commercial") || combined.includes("company")) return "Corporate";
  if (combined.includes("cyber") || combined.includes("it act") || combined.includes("phishing")) return "Cyber";
  if (combined.includes("motor") || combined.includes("accident") || combined.includes("mact") || combined.includes("civil")) return "Civil";
  if (combined.includes("consumer")) return "Consumer";
  if (combined.includes("labor") || combined.includes("employment")) return "Labor";
  return "Law";
}

// Text Highlighter for Word Targets
function Highlight({ text, words }) {
  if (!text || !words || words.length === 0) return <span>{text || ""}</span>;
  const str = String(text);
  const regex = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = str.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="cmp-highlight">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

export default function ClientMainPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Language state: 'en' or 'kn'
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || "en");
  const t = I18N[lang] || I18N.en;


  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState(getTheme);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setGlobalTheme(newTheme);
  };

  useEffect(() => {
    const handle = (e) => {
      if (e?.detail) setTheme(e.detail);
    };
    window.addEventListener("law4u_theme_change", handle);
    return () => window.removeEventListener("law4u_theme_change", handle);
  }, []);

  // Views: "hub", "clarity", "find-lawyers", "ai-assistant", "bare-acts", "documents"
  const [activeView, setActiveView] = useState(() => searchParams.get("view") || "hub");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [clarityData, setClarityData] = useState(defaultClarityData || []);

  // Sync activeView with URL search params
  useEffect(() => {
    const v = searchParams.get("view");
    if (v) {
      setActiveView(v);
    } else {
      setActiveView("hub");
    }
  }, [searchParams]);

  const openSubView = (viewKey) => {
    setActiveView(viewKey);
    setSearchParams({ view: viewKey });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToHub = () => {
    setActiveView("hub");
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openClarity = () => {
    openSubView("clarity");
    setCurrentPage(1);
  };

  const navigateToChat = () => {
    navigate("/client-dashboard");
  };

  // --- SUB-VIEW: Find Lawyers by City ---
  const [advocates, setAdvocates] = useState(() => getAdvocates() || []);
  const [flCity, setFlCity] = useState("All");
  const [flPractice, setFlPractice] = useState("All");
  const [flSearch, setFlSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    loadAdvocates().then((list) => {
      if (isMounted && Array.isArray(list) && list.length > 0) {
        setAdvocates(list);
      }
    }).catch(() => {});

    const handleAdvUpdate = () => {
      if (isMounted) setAdvocates(getAdvocates());
    };
    window.addEventListener("law4u_advocates_updated", handleAdvUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("law4u_advocates_updated", handleAdvUpdate);
    };
  }, []);

  const flCitiesList = useMemo(() => {
    const set = new Set();
    (advocates || []).forEach((a) => {
      const c = (a.city || a.district || a.place || "").trim();
      if (c) set.add(c);
    });
    const defaults = ["Bengaluru", "Belagavi", "Gokak", "Mysore", "Hubballi", "Mangaluru", "Kalaburagi", "Delhi", "Mumbai", "Hyderabad"];
    defaults.forEach((d) => set.add(d));
    return ["All", ...Array.from(set).sort()];
  }, [advocates]);

  const flPracticesList = [
    { id: "All", en: "All Practices", kn: "ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳು" },
    { id: "Criminal", en: "Criminal Law", kn: "ಕ್ರಿಮಿನಲ್ ಕಾನೂನು" },
    { id: "Civil", en: "Civil Matters", kn: "ಸಿವಿಲ್ ವಿಷಯಗಳು" },
    { id: "Family", en: "Family & Divorce", kn: "ಕೌಟುಂಬಿಕ ಮತ್ತು ವಿಚ್ಛೇದನ" },
    { id: "Property", en: "Property & Real Estate", kn: "ಆಸ್ತಿ ಮತ್ತು ರಿಯಲ್ ಎಸ್ಟೇಟ್" },
    { id: "Corporate", en: "Corporate & GST", kn: "ಕಾರ್ಪೊರೇಟ್ ಮತ್ತು ತೆರಿಗೆ" },
    { id: "Cyber", en: "Cybercrime & IT", kn: "ಸೈಬರ್ ಕ್ರೈಮ್ ಮತ್ತು ಐಟಿ" },
    { id: "Cheque", en: "Cheque Bounce (NI Act)", kn: "ಚೆಕ್ ಬೌನ್ಸ್ (NI Act)" },
  ];

  const filteredAdvocates = useMemo(() => {
    let list = Array.isArray(advocates) ? advocates : [];
    if (flCity !== "All" && flCity) {
      const c = flCity.toLowerCase();
      list = list.filter((a) => (a.city || a.district || a.place || "").toLowerCase().includes(c));
    }
    if (flPractice !== "All" && flPractice) {
      const p = flPractice.toLowerCase();
      list = list.filter((a) =>
        (a.speciality || a.practiceArea || "").toLowerCase().includes(p) ||
        (a.specialityKn || "").toLowerCase().includes(p)
      );
    }
    if (flSearch.trim()) {
      const q = flSearch.toLowerCase();
      list = list.filter((a) =>
        (a.name || "").toLowerCase().includes(q) ||
        (a.court || "").toLowerCase().includes(q) ||
        (a.city || "").toLowerCase().includes(q) ||
        (a.speciality || "").toLowerCase().includes(q) ||
        String(a.barId || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [advocates, flCity, flPractice, flSearch]);

  // --- SUB-VIEW: AI Legal Assistant ---
  const [aiMessages, setAiMessages] = useState(() => [
    {
      id: 1,
      role: "bot",
      text: lang === "kn"
        ? `ನಮಸ್ಕಾರ! ನಾನು ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನ ೨೪/೭ ಎಐ ಕಾನೂನು ಸಹಾಯಕ.\n\nಭಾರತೀಯ ಕಾಯ್ದೆಗಳು (BNS 2023, BNSS, IPC, CrPC), ಜಾಮೀನು ಅರ್ಜಿಗಳು, ಆಸ್ತಿ ವಿವಾದಗಳು, ಚೆಕ್ ಬೌನ್ಸ್ (Sec 138), ಅಥವಾ ವಿಚ್ಛೇದನ ಕುರಿತು ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಬಹುದು.`
        : `Hello! I am your 24/7 AI Legal Assistant powered by Advocates Hub.\n\nAsk me any question regarding Indian statutes (BNS 2023, BNSS, IPC, CrPC), anticipatory bail, property disputes, cheque bounce (Sec 138 NI Act), mutual consent divorce, or finding the right advocate.`,
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiIsListening, setAiIsListening] = useState(false);
  const aiBottomRef = useRef(null);
  const aiRecognitionRef = useRef(null);

  useEffect(() => {
    if (activeView === "ai-assistant") {
      aiBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiMessages, aiLoading, activeView]);

  const startAiListening = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert(lang === "kn" ? "ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ." : "Voice recognition not supported in this browser. Please use Chrome/Edge.");
      return;
    }
    try {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = lang === "kn" ? "kn-IN" : "en-IN";
      rec.onstart = () => setAiIsListening(true);
      rec.onresult = (e) => {
        let tr = "";
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          tr += e.results[i][0].transcript;
        }
        if (tr) setAiInput(tr);
      };
      rec.onerror = () => setAiIsListening(false);
      rec.onend = () => setAiIsListening(false);
      rec.start();
      aiRecognitionRef.current = rec;
    } catch {
      setAiIsListening(false);
    }
  };

  const stopAiListening = () => {
    if (aiRecognitionRef.current) {
      try { aiRecognitionRef.current.stop(); } catch {}
    }
    setAiIsListening(false);
  };

  const handleSendAiMessage = async (customQuery) => {
    const query = (customQuery || aiInput).trim();
    if (!query || aiLoading) return;
    if (aiIsListening) stopAiListening();

    const userMsg = { id: Date.now(), role: "user", text: query };
    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput("");
    setAiLoading(true);

    try {
      let responseText = "";
      let matchedItem = null;

      // 1. Backend chat if active
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query, lang }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.text) responseText = json.text;
        }
      } catch {}

      // 2. Intelligent statutory legal response engine fallback
      if (!responseText) {
        const qLower = query.toLowerCase();

        // Check clarityData for matching situations
        const found = clarityData.find((item) => {
          const combined = [
            item.situation,
            item.actLaw,
            item.accused,
            item.whoCanFile,
            item.advocate,
            item.situationKn,
            item.actLawKn,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return qLower.split(/\s+/).some((w) => w.length > 3 && combined.includes(w));
        });

        if (found) matchedItem = found;

        if (qLower.includes("anticipatory bail") || qLower.includes("bail") || qLower.includes("ಜಾಮೀನು")) {
          responseText = lang === "kn"
            ? `⚖️ **ನಿರೀಕ್ಷಣಾ ಜಾಮೀನು (Anticipatory Bail) ಪ್ರಕ್ರಿಯೆ:**\n\n• **ಅನ್ವಯವಾಗುವ ಕಾಯ್ದೆ:** ಭಾರತೀಯ ನಾಗರಿಕ ಸುರಕ್ಷಾ ಸಂಹಿತೆ (BNSS, 2023) ಸೆಕ್ಷನ್ 482 (ಹಿಂದಿನ CrPC ಸೆಕ್ಷನ್ 438).\n• **ಸಲ್ಲಿಸಬೇಕಾದ ನ್ಯಾಯಾಲಯ:** ಸೆಷನ್ಸ್ ನ್ಯಾಯಾಲಯ ಅಥವಾ ಹೈಕೋರ್ಟ್.\n• **ಅಗತ್ಯತೆ:** ಜಾಮೀನು ರಹಿತ ಅಪರಾಧದ ಆರೋಪದ ಮೇಲೆ ಬಂಧನವಾಗುವ ಸಾಧ್ಯತೆ ಇದ್ದಾಗ.\n• **ಸಲಹೆ:** ತಕ್ಷಣವೇ ಅನುಭವಿ ಕ್ರಿಮಿನಲ್ ವಕೀಲರ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಮಧ್ಯಂತರ ರಕ್ಷಣೆ ಪಡೆದುಕೊಳ್ಳಿ.`
            : `⚖️ **Anticipatory Bail Procedure under Indian Law:**\n\n• **Governing Statute:** Section 482 of Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 (formerly Section 438 of CrPC).\n• **Competent Court:** Sessions Court or the High Court having territorial jurisdiction.\n• **Grounds:** Reasonable apprehension of arrest in a non-bailable accusation with bona fide defense.\n• **Action Plan:** File an Anticipatory Bail application supported by an affidavit and proof of apprehension through a Criminal Defense Advocate.`;
        } else if (qLower.includes("cheque") || qLower.includes("bounce") || qLower.includes("138") || qLower.includes("ಚೆಕ್ ಬೌನ್ಸ್")) {
          responseText = lang === "kn"
            ? `💳 **ಚೆಕ್ ಬೌನ್ಸ್ (Section 138 NI Act) ಕಾನೂನು ಕ್ರಮಗಳು:**\n\n1. **30 ದಿನಗಳಲ್ಲಿ ನೋಟಿಸ್:** ಬ್ಯಾಂಕ್‌ನಿಂದ ಚೆಕ್ ಬೌನ್ಸ್ ಮೆಮೊ ಬಂದ 30 ದಿನಗಳೊಳಗೆ ಹಣ ಪಾವತಿಸಲು ಲಿಖಿತ ಲೀಗಲ್ ನೋಟಿಸ್ ಕಳುಹಿಸಬೇಕು.\n2. **15 ದಿನಗಳ ಕಾಲಾವಕಾಶ:** ನೋಟಿಸ್ ತಲುಪಿದ 15 ದಿನಗಳಲ್ಲಿ ಹಣ ಪಾವತಿಸಲು ಅವಕಾಶವಿರುತ್ತದೆ.\n3. **ದೂರು ದಾಖಲು:** ಹಣ ಪಾವತಿಸದಿದ್ದರೆ ಮುಂದಿನ 30 ದಿನಗಳಲ್ಲಿ ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ನ್ಯಾಯಾಲಯದಲ್ಲಿ ಕ್ರಿಮಿನಲ್ ಮೊಕದ್ದಮೆ ಹೂಡಬೇಕು.\n4. **ಪರಿಹಾರ:** ಗರಿಷ್ಠ 2 ವರ್ಷಗಳ ಸಜೆ ಅಥವಾ ಚೆಕ್ ಮೊತ್ತದ ಎರಡರಷ್ಟು ದಂಡ.`
            : `💳 **Cheque Bounce Procedure under Section 138 Negotiable Instruments Act:**\n\n1. **Statutory Demand Notice:** Must be served upon the drawer within 30 days of receiving the unpaid memo from the bank.\n2. **15-Day Cure Period:** Drawer is given 15 days from notice delivery to make payment.\n3. **Magistrate Complaint:** If unpaid, file a private criminal complaint under Section 138 within 30 days before the Judicial Magistrate.\n4. **Statutory Relief:** Imprisonment up to 2 years, fine up to twice the cheque amount, and interim compensation under Section 143A.`;
        } else if (qLower.includes("divorce") || qLower.includes("marriage") || qLower.includes("custody") || qLower.includes("ವಿಚ್ಛೇದನ")) {
          responseText = lang === "kn"
            ? `👨‍👩‍👧 **ವಿಚ್ಛೇದನ ಮತ್ತು ಕೌಟುಂಬಿಕ ನ್ಯಾಯಾಲಯದ ಪ್ರಕ್ರಿಯೆ:**\n\n• **ಪರಸ್ಪರ ಒಪ್ಪಿಗೆಯ ವಿಚ್ಛೇದನ (Mutual Consent):** ಹಿಂದೂ ವಿವಾಹ ಕಾಯ್ದೆ ಸೆಕ್ಷನ್ 13B ಅಡಿಯಲ್ಲಿ 6 ತಿಂಗಳ ಕೂಲಿಂಗ್ ಅವಧಿಯೊಂದಿಗೆ ಜಂಟಿ ಅರ್ಜಿ.\n• **ತಕರಾರು ವಿಚ್ಛೇದನ (Contested Divorce):** ಸೆಕ್ಷನ್ 13 ಅಡಿಯಲ್ಲಿ ಕ್ರೌರ್ಯ, ಪರಿತ್ಯಾಗ ಅಥವಾ ವ್ಯಭಿಚಾರದ ಆಧಾರದ ಮೇಲೆ ಅರ್ಜಿ.\n• **ಜೀವನಾಂಶ ಮತ್ತು ಕಸ್ಟಡಿ:** ಸೆಕ್ಷನ್ 24/25 ಅಡಿಯಲ್ಲಿ ಜೀವನಾಂಶ ಮತ್ತು ಅಪ್ರಾಪ್ತ ಮಕ್ಕಳ ಪಾಲನೆ ನಿರ್ಧಾರವಾಗುತ್ತದೆ.`
            : `👨‍👩‍👧 **Divorce Proceedings under the Hindu Marriage Act, 1955:**\n\n• **Mutual Consent Divorce:** Filed under Section 13B as a joint petition with settlement terms on alimony, child custody, and streedhan.\n• **Contested Divorce:** Filed under Section 13(1) on grounds including cruelty, desertion, or adultery.\n• **Maintenance & Custody:** Interim maintenance (Section 24) and permanent alimony (Section 25) can be granted by the Family Court.`;
        } else if (qLower.includes("tenant") || qLower.includes("rent") || qLower.includes("eviction") || qLower.includes("ಬಾಡಿಗೆ")) {
          responseText = lang === "kn"
            ? `🏠 **ಬಾಡಿಗೆದಾರರ ತೆರವು (Tenant Eviction) ಮತ್ತು ಒಪ್ಪಂದ ವಿವಾದಗಳು:**\n\n• **ಕಾನೂನುಬದ್ಧ ನೋಟಿಸ್:** ಬಾಡಿಗೆ ಒಪ್ಪಂದದ ಪ್ರಕಾರ 15 ರಿಂದ 30 ದಿನಗಳ ಮುಂಚಿತ ತೆರವು ನೋಟಿಸ್ ಜಾರಿ ಮಾಡಬೇಕು.\n• **ತೆರವು ದಾವೆ:** ಬಾಡಿಗೆ ಬಾಕಿ ಅಥವಾ ಅವಧಿ ಮುಕ್ತಾಯದ ನಂತರವೂ ತೆರವು ಮಾಡದಿದ್ದರೆ ಸ್ಮಾಲ್ ಕಾಸಸ್ ಕೋರ್ಟ್ ಅಥವಾ ರೆಂಟ್ ಕಂಟ್ರೋಲರ್ ಮುಂದೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು.\n• **ಎಚ್ಚರಿಕೆ:** ಬಲವಂತವಾಗಿ ನೀರು ಅಥವಾ ವಿದ್ಯುತ್ ಸಂಪರ್ಕ ಕಡಿತಗೊಳಿಸುವುದು ಕಾನೂನುಬಾಹಿರ.`
            : `🏠 **Tenant Eviction & Rental Disputes under Indian Law:**\n\n• **Eviction Notice:** Issue a formal 15–30 days registered legal notice specifying the ground for eviction (lease expiry, rent default, personal need).\n• **Court Eviction Petition:** If the tenant fails to vacate, file an eviction petition before the competent Civil Court or Rent Controller.\n• **Legal Safeguard:** Forceful dispossession or disconnecting utility services is illegal without a court decree.`;
        } else if (qLower.includes("bns") || qLower.includes("bnss") || qLower.includes("bsa") || qLower.includes("new act")) {
          responseText = lang === "kn"
            ? `📜 **ಭಾರತದ ೩ ಹೊಸ ಅಪರಾಧ ಕಾಯ್ದೆಗಳು (2024 ಜುಲೈ 1 ರಿಂದ ಜಾರಿಗೆ):**\n\n1. **BNS (ಭಾರತೀಯ ನ್ಯಾಯ ಸಂಹಿತೆ, 2023):** 1860 ರ IPC ಬದಲಿಗೆ ಜಾರಿಯಾಗಿದೆ.\n2. **BNSS (ಭಾರತೀಯ ನಾಗರಿಕ ಸುರಕ್ಷಾ ಸಂಹಿತೆ, 2023):** 1973 ರ CrPC ಬದಲಿಗೆ ಜಾರಿಯಾಗಿದೆ (ಡಿಜಿಟಲ್ ಸಮನ್ಸ್, ಕಡ್ಡಾಯ ವಿಡಿಯೋಗ್ರಫಿ).\n3. **BSA (ಭಾರತೀಯ ಸಾಕ್ಷ್ಯ ಅಧಿನಿಯಮ, 2023):** 1872 ರ ಸಾಕ್ಷ್ಯ ಕಾಯ್ದೆ ಬದಲಿಗೆ ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಮತ್ತು ಡಿಜಿಟಲ್ ಸಾಕ್ಷ್ಯಕ್ಕೆ ಪೂರ್ಣ ಶಾಸನಬದ್ಧ ಮಾನ್ಯತೆ ನೀಡುತ್ತದೆ.`
            : `📜 **The Three New Criminal Codes in India (Effective July 1, 2024):**\n\n1. **Bharatiya Nyaya Sanhita (BNS), 2023:** Superseded the Indian Penal Code (IPC) 1860.\n2. **Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023:** Superseded the Code of Criminal Procedure (CrPC) 1973, introducing digital FIRs, electronic summons, and forensic evidence mandates.\n3. **Bharatiya Sakshya Adhiniyam (BSA), 2023:** Superseded the Indian Evidence Act 1872, codifying modern admissibility for electronic and cloud records.`;
        } else if (matchedItem) {
          responseText = lang === "kn"
            ? `🔍 **ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಸೂಕ್ತ ಕಾನೂನು ಮಾಹಿತಿ:**\n\n• **ಪ್ರಕರಣ:** ${matchedItem.situationKn || matchedItem.situation}\n• **ಅನ್ವಯವಾಗುವ ಕಾಯ್ದೆ:** ${matchedItem.actLawKn || matchedItem.actLaw} ${matchedItem.actLawDetail ? `(${matchedItem.actLawDetail})` : ""}\n• **ಯಾರು ದೂರು ಸಲ್ಲಿಸಬಹುದು:** ${matchedItem.whoCanFileKn || matchedItem.whoCanFile}\n• **ಆರೋಪಿ ಹೊಣೆಗಾರಿಕೆ:** ${matchedItem.accusedKn || matchedItem.accused}\n• **ಶಿಫಾರಸು ಮಾಡಿದ ವಕೀಲರು:** ${matchedItem.advocateKn || matchedItem.advocate}`
            : `🔍 **Matching Legal Situation & Statutory Provisions:**\n\n• **Situation:** ${matchedItem.situation}\n• **Statute / Sections:** ${matchedItem.actLaw} ${matchedItem.actLawDetail ? `(${matchedItem.actLawDetail})` : ""}\n• **Standing to File:** ${matchedItem.whoCanFile}\n• **Accused Liability:** ${matchedItem.accused}\n• **Recommended Specialist:** ${matchedItem.advocate}`;
        } else {
          responseText = lang === "kn"
            ? `ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ನಿಖರವಾದ ಕಾನೂನು ಪರಿಹಾರ ಮತ್ತು ನ್ಯಾಯಾಲಯದ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ತಿಳಿಯಲು ನಮ್ಮ ಸ್ಪಷ್ಟತೆ ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಪರಿಶೀಲಿಸಬಹುದು ಅಥವಾ ನೇರವಾಗಿ ಪರಿಣಿತ ವಕೀಲರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಬಹುದು.`
            : `Thank you for your question. Under Indian jurisprudence, legal remedies depend on whether the matter is civil, criminal, or regulatory. You can explore relevant statutes in our Legal Clarity Guide or connect directly with a specialist advocate.`;
        }
      }

      setAiMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: responseText,
          matchedItem,
        },
      ]);
    } catch {
      setAiMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: lang === "kn" ? "⚠️ ಕ್ಷಮಿಸಿ, ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ." : "⚠️ Unable to fetch guidance. Please retry.",
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // --- SUB-VIEW: Bare Acts ---
  const [baCategory, setBaCategory] = useState("All");
  const [baSearch, setBaSearch] = useState("");
  const [baSelectedAct, setBaSelectedAct] = useState(null);
  const [baActiveSection, setBaActiveSection] = useState(1);

  const filteredBareActs = useMemo(() => {
    let list = [...BARE_ACTS];
    if (baCategory !== "All") {
      if (baCategory === "New Acts") list = list.filter((a) => a.isNew);
      else list = list.filter((a) => a.category === baCategory);
    }
    if (baSearch.trim()) {
      const q = baSearch.toLowerCase();
      list = list.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.shortName.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q)
      );
    }
    return list;
  }, [baCategory, baSearch]);

  const handleDownloadActPdf = (act) => {
    const blob = new Blob([
      `ADVOCATES HUB — INDIAN BARE ACTS\n\nTitle: ${act.title}\nShort Name: ${act.shortName}\nCategory: ${act.category}\nYear: ${act.year}\nSections: ${act.sections}\n\nSummary:\n${act.desc}\n\n---\nFull statutory enactment reference text. Provided by Advocates Hub Legal Library.`
    ], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${act.shortName}_Bare_Act.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const sampleSections = useMemo(() => {
    if (!baSelectedAct) return [];
    return [
      { no: 1, title: "Short title, extent and commencement", content: `(1) This Act may be called the ${baSelectedAct.title}.\n(2) It extends to the whole of India.\n(3) It shall come into force on such date as the Central Government may, by notification in the Official Gazette, appoint.` },
      { no: 2, title: "Definitions and Interpretations", content: `In this Act, unless the context otherwise requires—\n\n(a) "appropriate Government" means—\n    (i) in relation to a matter concerning the Union territory, the Central Government;\n    (ii) in relation to a matter concerning a State, the State Government;\n\n(b) "court" means the court referred to in the Code of Criminal/Civil Procedure;\n\n(c) "legal entity" includes individuals, registered societies, and incorporated companies.` },
      { no: 3, title: "Application and Jurisdiction", content: `The provisions of this Act shall apply to all persons within the territory of India, and to any offence committed or civil right arising under the provisions herein.` },
      { no: 4, title: "General Exceptions and Statutory Defences", content: `Nothing is an offence or a breach of obligation under this Act which is done by any person who is justified by law, or who by reason of mistake of fact in good faith believes himself to be justified by law.` },
    ];
  }, [baSelectedAct]);

  // --- SUB-VIEW: Legal Documents ---
  const [ldCategory, setLdCategory] = useState("All");
  const [ldSearch, setLdSearch] = useState("");
  const [ldPreviewDoc, setLdPreviewDoc] = useState(null);

  const filteredDocuments = useMemo(() => {
    let list = [...LEGAL_DOCUMENTS];
    if (ldCategory !== "All") {
      list = list.filter((d) => d.category === ldCategory);
    }
    if (ldSearch.trim()) {
      const q = ldSearch.toLowerCase();
      list = list.filter((d) =>
        d.title.toLowerCase().includes(q) ||
        d.desc.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [ldCategory, ldSearch]);

  const handleDownloadDocument = (doc) => {
    const blob = new Blob([
      `ADVOCATES HUB — LEGAL DRAFT TEMPLATE\n\nDocument: ${doc.title.toUpperCase()}\nCategory: ${doc.category}\nPages: ${doc.pages}\nStatus: ${doc.free ? "Free Format" : "Standard Verified Format"}\n\nDescription: ${doc.desc}\n\n---\n\nIN THE RELEVANT COURT / BEFORE THE COMPETENT AUTHORITY\n\nBETWEEN:\n[PARTY ONE / FIRST PARTY NAME], residing at [Address]\n... FIRST PARTY\n\nAND\n[PARTY TWO / SECOND PARTY NAME], residing at [Address]\n... SECOND PARTY\n\nWHEREAS:\n1. The parties are desirous of entering into this legally binding arrangement...\n2. Both parties have agreed to the terms, covenants and undertakings set forth herein.\n\nNOW THIS DEED WITNESSETH AS FOLLOWS:\nClause 1: Scope, Purpose and Consideration...\nClause 2: Covenants, Rights and Obligations...\nClause 3: Default, Remedy and Termination...\nClause 4: Dispute Resolution & Governing Jurisdiction.\n\nIN WITNESS WHEREOF the parties hereto have signed on this [Date] day of [Month, Year].\n\n_________________________           _________________________\nFIRST PARTY SIGNATURE               SECOND PARTY SIGNATURE\n\nWitness 1: __________________       Witness 2: __________________\n`
    ], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, "_")}_Template.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Retrieve client information
  const clientId = Number(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || 0);
  const clientObj = useMemo(() => {
    try {
      const raw = localStorage.getItem(CLIENT_OBJ_KEY) || sessionStorage.getItem(CLIENT_OBJ_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(() => {
    if (clientId) {
      const saved = localStorage.getItem(`law4u_client_avatar_${clientId}`);
      if (saved) return saved;
    }
    if (clientObj?.avatar) return clientObj.avatar;
    if (clientObj?.name && clientObj.name.toLowerCase().includes("chetan")) {
      return "/uploads/chetan.png";
    }
    return "/uploads/chetan.png";
  });

  const [avatarTabOpen, setAvatarTabOpen] = useState(false);
  const avatarMenuRef = useRef(null);

  // Close avatar dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
        setAvatarTabOpen(false);
      }
    };
    if (avatarTabOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [avatarTabOpen]);

  const handleSelectAvatar = (url) => {
    setAvatarUrl(url);
    if (clientId) {
      localStorage.setItem(`law4u_client_avatar_${clientId}`, url);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      handleSelectAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Fetch from backend /api/clarity-guide if available
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/clarity-guide");
        if (res.ok) {
          const remoteData = await res.json();
          if (isMounted && Array.isArray(remoteData) && remoteData.length > 0) {
            setClarityData(remoteData);
          }
        }
      } catch (err) {
        // Fallback to imported JSON
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Unique categories list for Clarity Guide
  const categories = useMemo(() => {
    const set = new Set();
    clarityData.forEach((item) => {
      const c = lang === "kn" ? (item.categoryKn || item.category) : item.category;
      if (c) set.add(c);
    });
    return ["All", ...Array.from(set)];
  }, [clarityData, lang]);

  const handleLogout = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(CLIENT_OBJ_KEY);
      sessionStorage.removeItem(CLIENT_OBJ_KEY);
      localStorage.removeItem(CLIENT_TOKEN_KEY);
      sessionStorage.removeItem(CLIENT_TOKEN_KEY);
    } catch (e) {
      /* ignore */
    }
    navigate("/client-login");
  };

  // Word-Target Tokenizer
  const wordTargets = useMemo(() => {
    return searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
  }, [searchTerm]);

  // Filter clarity data according to Word Targets across all fields
  const filteredData = useMemo(() => {
    let result = clarityData;

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((item) => {
        const cat = lang === "kn" ? (item.categoryKn || item.category) : item.category;
        return cat === selectedCategory || item.category === selectedCategory;
      });
    }

    // Word Target Filtering (checks situation, actLaw, accused, whoCanFile, advocate in both EN & KN)
    if (wordTargets.length > 0) {
      result = result.filter((item) => {
        const fullSearchableText = [
          String(item.id || ""),
          item.situation || "",
          item.actLaw || "",
          item.actLawDetail || "",
          item.accused || "",
          item.whoCanFile || "",
          item.advocate || "",
          item.category || "",
          item.situationKn || "",
          item.actLawKn || "",
          item.accusedKn || "",
          item.whoCanFileKn || "",
          item.advocateKn || "",
          item.categoryKn || "",
        ]
          .join(" ")
          .toLowerCase();

        // Every word target must match
        return wordTargets.every((word) => fullSearchableText.includes(word));
      });
    }

    return result;
  }, [clarityData, selectedCategory, wordTargets, lang]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // "Set up that one" — Navigate to Chat with advocate and prefill case details
  const handleSetUpCase = (item) => {
    // Pass the advocate requirement so ClientDashboard filters for matching specialists
    const searchTarget = item.advocate || getAdvocateSearchKeyword(item);
    const situationText = lang === "kn" && item.situationKn ? item.situationKn : item.situation;
    const actText = lang === "kn" && item.actLawKn ? item.actLawKn : item.actLaw;

    const draftMsg =
      lang === "kn"
        ? `ನಮಸ್ಕಾರ ವಕೀಲರೇ, ನನಗೆ ಈ ವಿಷಯದಲ್ಲಿ ಕಾನೂನು ಸಲಹೆ ಬೇಕಾಗಿದೆ: ${situationText} (${actText}).`
        : `Hello Advocate, I need legal consultation regarding my case: ${situationText} (Governed by ${actText}).`;

    const matchingAdv = (advocates || []).find((a) => {
      const sp = `${a.speciality || ""} ${a.practiceArea || ""}`.toLowerCase();
      return sp.includes(searchTarget.toLowerCase()) || searchTarget.toLowerCase().includes(sp);
    });

    if (matchingAdv && clientId) {
      sessionStorage.setItem(`law4u_active_chat_${clientId}`, String(matchingAdv.id));
      localStorage.setItem(`law4u_active_chat_${clientId}`, String(matchingAdv.id));
    }

    const advParam = matchingAdv ? `&advocateId=${matchingAdv.id}` : "";

    navigate(
      `/client-dashboard?search=${encodeURIComponent(searchTarget)}&prefill=${encodeURIComponent(draftMsg)}&caseId=${item.id}${advParam}`
    );
  };

  return (
    <div className={`cmp-page ${theme === "dark" ? "cmp-dark" : ""}`}>
      {/* Top Navbar */}
      <header className="cmp-navbar">
        <div className="cmp-brand" onClick={backToHub} title="Go to Client Hub">
          <BrandLogo size={34} />
          <div className="cmp-brand-title">
            Advocates <span>Hub</span>
          </div>
          <span className="cmp-brand-portal-badge">{t.portalTitle}</span>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="cmp-nav-links" aria-label="Portal Navigation">
          <button
            type="button"
            className={`cmp-nav-link ${activeView === "hub" ? "active" : ""}`}
            onClick={backToHub}
          >
            <span>🏠 {t.navHub}</span>
          </button>
          <button
            type="button"
            className="cmp-nav-link"
            onClick={navigateToChat}
          >
            <span>💬 {t.navChat}</span>
          </button>
          <button
            type="button"
            className={`cmp-nav-link ${activeView === "clarity" ? "active" : ""}`}
            onClick={openClarity}
          >
            <span>⚖️ {t.navClarity}</span>
          </button>
          <button
            type="button"
            className={`cmp-nav-link ${activeView === "find-lawyers" ? "active" : ""}`}
            onClick={() => openSubView("find-lawyers")}
          >
            <span>🔍 {t.navFind}</span>
          </button>
        </nav>

        <div className="cmp-nav-actions">
          {/* Direct 1-Click Language Toggle */}
          <button
            type="button"
            className="cmp-quick-lang-btn"
            onClick={() => {
              const nextLang = lang === "en" ? "kn" : "en";
              setLang(nextLang);
              localStorage.setItem(LANG_KEY, nextLang);
            }}
            title="Switch Language (English / ಕನ್ನಡ)"
          >
            <span>🌐 {lang === "en" ? "ಕನ್ನಡ" : "English"}</span>
          </button>

          {/* Direct 1-Click Theme Toggle */}
          <button
            type="button"
            className="cmp-quick-theme-btn"
            onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
            title="Toggle Light / Dark Theme"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Right-end Profile Avatar Button & Dropdown Menu Tab */}
          <div className="cmp-avatar-wrap" ref={avatarMenuRef}>
            <button
              type="button"
              className={`cmp-avatar-btn ${avatarTabOpen ? "open" : ""}`}
              onClick={() => setAvatarTabOpen((prev) => !prev)}
              aria-expanded={avatarTabOpen}
              title={t.profileSettings}
            >
              <div className="cmp-avatar-circle">
                {avatarUrl ? (
                  <img
                    src={assetUrl(avatarUrl)}
                    alt={clientObj?.name || "Client"}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      if (e.currentTarget.parentElement) {
                        e.currentTarget.parentElement.innerText = (clientObj?.name || "C").charAt(0).toUpperCase();
                      }
                    }}
                  />
                ) : (
                  (clientObj?.name || "C").charAt(0).toUpperCase()
                )}
              </div>
              <span className="cmp-avatar-name">{clientObj?.name || "Client"}</span>
              <span className="cmp-avatar-caret">▼</span>
            </button>

            {avatarTabOpen && (
              <div className="cmp-avatar-tab">
                {/* Header with Photo & Details */}
                <div className="cmp-tab-header">
                  <div className="cmp-tab-avatar-wrap">
                    <div className="cmp-tab-avatar">
                      {avatarUrl ? (
                        <img
                          src={assetUrl(avatarUrl)}
                          alt={clientObj?.name || "Client"}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            if (e.currentTarget.parentElement) {
                              e.currentTarget.parentElement.innerText = (clientObj?.name || "C").charAt(0).toUpperCase();
                            }
                          }}
                        />
                      ) : (
                        (clientObj?.name || "C").charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>
                  <div className="cmp-tab-info">
                    <div className="cmp-tab-name">{clientObj?.name || "Client"}</div>
                    <div className="cmp-tab-email">{clientObj?.email || "client@advocatehub.in"}</div>
                    <span className="cmp-tab-badge">{t.clientRole}</span>
                  </div>
                </div>

                {/* Theme Selector: Dark and White/Light Theme */}
                <div className="cmp-tab-section">
                  <div className="cmp-tab-label">{t.theme}</div>
                  <div className="cmp-segmented-control">
                    <button
                      type="button"
                      className={`cmp-seg-btn ${theme === "light" ? "active" : ""}`}
                      onClick={() => handleThemeChange("light")}
                    >
                      {t.lightTheme}
                    </button>
                    <button
                      type="button"
                      className={`cmp-seg-btn ${theme === "dark" ? "active" : ""}`}
                      onClick={() => handleThemeChange("dark")}
                    >
                      {t.darkTheme}
                    </button>
                  </div>
                </div>

                {/* Language Selector: English and Kannada */}
                <div className="cmp-tab-section">
                  <div className="cmp-tab-label">{t.language}</div>
                  <div className="cmp-segmented-control">
                    <button
                      type="button"
                      className={`cmp-seg-btn ${lang === "en" ? "active" : ""}`}
                      onClick={() => {
                        setLang("en");
                        localStorage.setItem(LANG_KEY, "en");
                      }}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      className={`cmp-seg-btn ${lang === "kn" ? "active" : ""}`}
                      onClick={() => {
                        setLang("kn");
                        localStorage.setItem(LANG_KEY, "kn");
                      }}
                    >
                      ಕನ್ನಡ
                    </button>
                  </div>
                </div>

                {/* Avatar Selection: Presets + Upload */}
                <div className="cmp-tab-section">
                  <div className="cmp-tab-label">{t.chooseAvatar}</div>
                  <div className="cmp-avatar-presets">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        className={`cmp-preset-circle ${avatarUrl === preset ? "selected" : ""}`}
                        onClick={() => handleSelectAvatar(preset)}
                        title={`Select Avatar ${idx + 1}`}
                      >
                        <img src={assetUrl(preset)} alt={`Preset ${idx + 1}`} />
                      </button>
                    ))}
                    <label className="cmp-upload-label" title={t.uploadPhoto}>
                      📷
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="cmp-tab-links">
                  <button
                    type="button"
                    className="cmp-tab-link-btn"
                    onClick={() => {
                      setAvatarTabOpen(false);
                      backToHub();
                    }}
                  >
                    🏠 {lang === "kn" ? "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ (Dashboard)" : "Client Dashboard"}
                  </button>
                  <button
                    type="button"
                    className="cmp-tab-link-btn"
                    onClick={() => {
                      setAvatarTabOpen(false);
                      navigateToChat();
                    }}
                  >
                    {t.chatNav}
                  </button>
                  <button
                    type="button"
                    className="cmp-tab-link-btn"
                    onClick={() => {
                      setAvatarTabOpen(false);
                      openClarity();
                    }}
                  >
                    {t.clarityNav}
                  </button>
                  <button
                    type="button"
                    className="cmp-tab-link-btn"
                    onClick={() => {
                      setAvatarTabOpen(false);
                      openSubView("find-lawyers");
                    }}
                  >
                    🔍 {t.qs1Title}
                  </button>
                  <button
                    type="button"
                    className="cmp-tab-link-btn"
                    onClick={() => {
                      setAvatarTabOpen(false);
                      openSubView("ai-assistant");
                    }}
                  >
                    🤖 {t.qs2Title}
                  </button>
                  <button
                    type="button"
                    className="cmp-tab-link-btn"
                    onClick={() => {
                      setAvatarTabOpen(false);
                      openSubView("bare-acts");
                    }}
                  >
                    📜 {t.qs3Title}
                  </button>
                  <button
                    type="button"
                    className="cmp-tab-link-btn"
                    onClick={() => {
                      setAvatarTabOpen(false);
                      openSubView("documents");
                    }}
                  >
                    📝 {t.qs4Title}
                  </button>
                  <button
                    type="button"
                    className="cmp-tab-link-btn"
                    onClick={() => {
                      setAvatarTabOpen(false);
                      navigate("/");
                    }}
                  >
                    🏛️ {lang === "kn" ? "ಮುಖಪುಟ (Home)" : "Platform Home"}
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  className="cmp-tab-logout-btn"
                  onClick={() => {
                    setAvatarTabOpen(false);
                    handleLogout();
                  }}
                >
                  🚪 {t.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="cmp-container">
        {activeView === "hub" && (
          /* ========================================================
             VIEW 1: Main Page with 2 Primary Icons / Cards + Quick Tools
             ======================================================== */
          <>
            <section className="cmp-hero">
              <div className="cmp-badge">
                <span className="cmp-badge-dot" />
                <span>{lang === "kn" ? "೧೦೦% ಸುರಕ್ಷಿತ ಕ್ಲೈಂಟ್ ಸೇವಾ ಕೇಂದ್ರ" : "100% Secure & Confidential Legal Hub"}</span>
              </div>
              <h1 className="cmp-title">
                {t.welcome},{" "}
                <span className="cmp-title-gradient">
                  {clientObj?.name || (lang === "kn" ? "ಗ್ರಾಹಕರೇ" : "Valued Client")}
                </span>{" "}
                👋
              </h1>
              <p className="cmp-subtitle">{t.hubSubtitle}</p>

              <div className="cmp-hero-trust-bar">
                <div className="cmp-trust-item">
                  <span className="cmp-trust-icon">🔒</span>
                  <span>{t.heroTrust1}</span>
                </div>
                <div className="cmp-trust-sep" />
                <div className="cmp-trust-item">
                  <span className="cmp-trust-icon">⚡</span>
                  <span>{t.heroTrust2}</span>
                </div>
                <div className="cmp-trust-sep" />
                <div className="cmp-trust-item">
                  <span className="cmp-trust-icon">📚</span>
                  <span>{t.heroTrust3}</span>
                </div>
              </div>
            </section>

            <div className="cmp-cards-grid">
              {/* Card 1: Chat with Advocates */}
              <div
                className="cmp-card chat-card"
                onClick={navigateToChat}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigateToChat();
                }}
              >
                <div className="cmp-card-header-row">
                  <div className="cmp-icon-wrapper chat-icon">
                    <span className="cmp-svg-icon">{CMP_ICONS.chat}</span>
                  </div>
                  <span className="cmp-card-tag chat-tag">
                    <span>💬</span>
                    <span>{t.card1Tag}</span>
                  </span>
                </div>

                <div className="cmp-card-content">
                  <h2 className="cmp-card-title">{t.card1Title}</h2>
                  <p className="cmp-card-desc">{t.card1Desc}</p>

                  <ul className="cmp-card-points">
                    <li>
                      <span className="cmp-point-check">{CMP_ICONS.check}</span>
                      <span>{t.card1Point1}</span>
                    </li>
                    <li>
                      <span className="cmp-point-check">{CMP_ICONS.check}</span>
                      <span>{t.card1Point2}</span>
                    </li>
                    <li>
                      <span className="cmp-point-check">{CMP_ICONS.check}</span>
                      <span>{t.card1Point3}</span>
                    </li>
                  </ul>
                </div>

                <div className="cmp-card-footer">
                  <button
                    className="cmp-card-btn chat-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToChat();
                    }}
                  >
                    <span>{t.card1Btn}</span>
                    <span className="cmp-btn-arrow">{CMP_ICONS.arrowRight}</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Legal Clarity Guide */}
              <div
                className="cmp-card clarity-card"
                onClick={openClarity}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") openClarity();
                }}
              >
                <div className="cmp-card-header-row">
                  <div className="cmp-icon-wrapper clarity-icon">
                    <span className="cmp-svg-icon">{CMP_ICONS.clarity}</span>
                  </div>
                  <span className="cmp-card-tag clarity-tag">
                    <span>⚖️</span>
                    <span>{t.card2Tag} ({clarityData.length}+)</span>
                  </span>
                </div>

                <div className="cmp-card-content">
                  <h2 className="cmp-card-title">{t.card2Title}</h2>
                  <p className="cmp-card-desc">{t.card2Desc}</p>

                  <ul className="cmp-card-points">
                    <li>
                      <span className="cmp-point-check">{CMP_ICONS.check}</span>
                      <span>{t.card2Point1}</span>
                    </li>
                    <li>
                      <span className="cmp-point-check">{CMP_ICONS.check}</span>
                      <span>{t.card2Point2}</span>
                    </li>
                    <li>
                      <span className="cmp-point-check">{CMP_ICONS.check}</span>
                      <span>{t.card2Point3}</span>
                    </li>
                  </ul>
                </div>

                <div className="cmp-card-footer">
                  <button
                    className="cmp-card-btn clarity-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openClarity();
                    }}
                  >
                    <span>{t.card2Btn}</span>
                    <span className="cmp-btn-arrow">{CMP_ICONS.arrowRight}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Legal Services Section */}
            <section className="cmp-services-section">
              <div className="cmp-services-header">
                <div className="cmp-services-badge">
                  <span className="cmp-badge-dot" />
                  <span>{lang === "kn" ? "ತ್ವರಿತ ಸೇವೆಗಳು" : "Quick Access"}</span>
                </div>
                <h3 className="cmp-services-title">{t.quickServicesTitle}</h3>
                <p className="cmp-services-sub">{t.quickServicesSub}</p>
              </div>

              <div className="cmp-services-grid">
                <div
                  className="cmp-service-card"
                  onClick={() => openSubView("find-lawyers")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openSubView("find-lawyers");
                  }}
                >
                  <div className="cmp-service-icon-wrap blue">
                    <span className="cmp-svg-icon">{CMP_ICONS.lawyer}</span>
                  </div>
                  <div className="cmp-service-info">
                    <h4>{t.qs1Title}</h4>
                    <p>{t.qs1Desc}</p>
                  </div>
                  <span className="cmp-service-arrow">{CMP_ICONS.arrowRight}</span>
                </div>

                <div
                  className="cmp-service-card"
                  onClick={() => openSubView("ai-assistant")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openSubView("ai-assistant");
                  }}
                >
                  <div className="cmp-service-icon-wrap indigo">
                    <span className="cmp-svg-icon">{CMP_ICONS.bot}</span>
                  </div>
                  <div className="cmp-service-info">
                    <h4>{t.qs2Title}</h4>
                    <p>{t.qs2Desc}</p>
                  </div>
                  <span className="cmp-service-arrow">{CMP_ICONS.arrowRight}</span>
                </div>

                <div
                  className="cmp-service-card"
                  onClick={() => openSubView("bare-acts")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openSubView("bare-acts");
                  }}
                >
                  <div className="cmp-service-icon-wrap teal">
                    <span className="cmp-svg-icon">{CMP_ICONS.book}</span>
                  </div>
                  <div className="cmp-service-info">
                    <h4>{t.qs3Title}</h4>
                    <p>{t.qs3Desc}</p>
                  </div>
                  <span className="cmp-service-arrow">{CMP_ICONS.arrowRight}</span>
                </div>

                <div
                  className="cmp-service-card"
                  onClick={() => openSubView("documents")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openSubView("documents");
                  }}
                >
                  <div className="cmp-service-icon-wrap amber">
                    <span className="cmp-svg-icon">{CMP_ICONS.document}</span>
                  </div>
                  <div className="cmp-service-info">
                    <h4>{t.qs4Title}</h4>
                    <p>{t.qs4Desc}</p>
                  </div>
                  <span className="cmp-service-arrow">{CMP_ICONS.arrowRight}</span>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ========================================================
           VIEW 2: Inside 2nd Icon - Legal Clarity Guide
           ======================================================== */}
        {activeView === "clarity" && (
          <section className="cmp-clarity-view">
            <div className="cmp-view-topbar">
              <button className="cmp-btn-back" onClick={backToHub}>
                {t.backBtn}
              </button>

              <button className="cmp-btn-chat-cta" onClick={navigateToChat}>
                {t.chatCta}
              </button>
            </div>

            <div className="cmp-clarity-header">
              <h2>{t.guideTitle}</h2>
              <div className="cmp-case-badge">{t.guideBadge}</div>
            </div>

            {/* Category Filter Scroll */}
            <div className="cmp-filter-scroll">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`cmp-filter-pill ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => handleCategorySelect(cat)}
                >
                  {cat === "All" ? (lang === "kn" ? "ಎಲ್ಲಾ" : "All") : cat}
                </button>
              ))}
            </div>

            {/* Quick Word-Target Search Toolbar */}
            <div className="cmp-search-toolbar">
              <input
                type="text"
                className="cmp-search-input"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="cmp-search-clear-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                >
                  {t.clearBtn}
                </button>
              )}
              <span className="cmp-search-count">
                {t.foundResults(filteredData.length)}
              </span>
            </div>

            {/* Mobile swipe hint */}
            <div className="cmp-table-hint">
              <span>👉 {lang === "kn" ? "ಎಲ್ಲಾ ಅಂಕಣಗಳನ್ನು ನೋಡಲು ಬಲಕ್ಕೆ ಸ್ವೈಪ್ ಮಾಡಿ (Swipe right)" : "Swipe horizontally to view all columns & legal acts"}</span>
            </div>

            {/* Clarity Table with Word-Target Highlighting */}
            <div className="cmp-table-wrapper">
              <table className="cmp-table">
                <thead>
                  <tr>
                    <th style={{ width: "23%" }}>{t.thSituation}</th>
                    <th style={{ width: "22%" }}>{t.thActLaw}</th>
                    <th style={{ width: "18%" }}>{t.thAccused}</th>
                    <th style={{ width: "19%" }}>{t.thWhoCanFile}</th>
                    <th style={{ width: "18%" }}>{t.thAdvocate}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row) => {
                    const displaySituation = lang === "kn" && row.situationKn ? row.situationKn : row.situation;
                    const displayActLaw = lang === "kn" && row.actLawKn ? row.actLawKn : row.actLaw;
                    const displayAccused = lang === "kn" && row.accusedKn ? row.accusedKn : row.accused;
                    const displayWhoCanFile = lang === "kn" && row.whoCanFileKn ? row.whoCanFileKn : row.whoCanFile;
                    const displayAdvocate = lang === "kn" && row.advocateKn ? row.advocateKn : row.advocate;
                    const displayCategory = lang === "kn" && row.categoryKn ? row.categoryKn : row.category;

                    return (
                      <tr key={row.id}>
                        <td>
                          <div className="cmp-situation-title">
                            <Highlight text={displaySituation} words={wordTargets} />
                          </div>
                          {displayCategory && (
                            <div style={{ marginTop: 4 }}>
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  background: "#f1f5f9",
                                  color: "#475569",
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                }}
                              >
                                🏷️ <Highlight text={displayCategory} words={wordTargets} />
                              </span>
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="cmp-law-tag">
                            <Highlight text={displayActLaw} words={wordTargets} />
                          </span>
                          {row.actLawDetail && (
                            <div className="cmp-law-sub">
                              <Highlight text={row.actLawDetail} words={wordTargets} />
                            </div>
                          )}
                        </td>
                        <td>
                          <strong>
                            <Highlight text={displayAccused} words={wordTargets} />
                          </strong>
                        </td>
                        <td>
                          <Highlight text={displayWhoCanFile} words={wordTargets} />
                        </td>
                        <td>
                          <div className="cmp-advocate-chip">
                            🛡️ <Highlight text={displayAdvocate} words={wordTargets} />
                          </div>
                          <div>
                            <button
                              className="cmp-row-cta-btn"
                              onClick={() => handleSetUpCase(row)}
                              title={lang === "kn" ? "ಈ ಪ್ರಕರಣವನ್ನು ಸೆಟ್ ಮಾಡಿ ವಕೀಲರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ" : "Set up and chat with an advocate"}
                            >
                              {t.setUpCase}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: 36, color: "#64748b" }}>
                        {t.noResults(searchTerm)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="cmp-pagination">
                <div className="cmp-page-info">
                  {t.showingOf(
                    (currentPage - 1) * ITEMS_PER_PAGE + 1,
                    Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length),
                    filteredData.length
                  )}{" "}
                  ({t.pageOf(currentPage, totalPages)})
                </div>
                <div className="cmp-page-controls">
                  <button
                    className="cmp-page-btn"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    {t.first}
                  </button>
                  <button
                    className="cmp-page-btn"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    {t.prev}
                  </button>
                  <span style={{ fontSize: "0.85rem", padding: "0 8px", fontWeight: 600 }}>
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    className="cmp-page-btn"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    {t.next}
                  </button>
                  <button
                    className="cmp-page-btn"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    {t.last}
                  </button>
                </div>
              </div>
            )}

            {/* Practical Example Tip */}
            <div className="cmp-tip-box">
              <strong>{t.tipTitle}</strong> {t.tipText}
            </div>

            {/* Bottom Banner */}
            <div className="cmp-bottom-banner">
              <div className="cmp-banner-text">
                <h3>{t.bannerTitle}</h3>
                <p>{t.bannerDesc}</p>
              </div>
              <button className="cmp-banner-btn" onClick={navigateToChat}>
                {t.bannerBtn}
              </button>
            </div>
          </section>
        )}

        {/* ========================================================
           VIEW 3: Find Lawyers By City (Embedded in Client Portal)
           ======================================================== */}
        {activeView === "find-lawyers" && (
          <section className="cmp-subview-section cmp-findlawyers-view">
            <div className="cmp-view-topbar">
              <button className="cmp-btn-back" onClick={backToHub}>
                {t.backBtn}
              </button>
              <button className="cmp-btn-chat-cta" onClick={navigateToChat}>
                {t.chatCta}
              </button>
            </div>

            <div className="cmp-subview-header">
              <div className="cmp-subview-badge">
                <span className="cmp-badge-dot" />
                <span>{t.flBadge}</span>
              </div>
              <h2>{t.flTitle}</h2>
              <p>{t.flSub}</p>
            </div>

            {/* Filter Toolbar */}
            <div className="cmp-fl-toolbar">
              <div className="cmp-fl-field">
                <label>📍 {lang === "kn" ? "ನಗರ / ಪ್ರದೇಶ" : "City / Region"}</label>
                <select
                  className="cmp-fl-select"
                  value={flCity}
                  onChange={(e) => setFlCity(e.target.value)}
                >
                  {flCitiesList.map((c) => (
                    <option key={c} value={c}>
                      {c === "All" ? t.flCityAll : c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cmp-fl-field">
                <label>🏛️ {lang === "kn" ? "ಕಾರ್ಯಾಚರಣೆ ಕ್ಷೇತ್ರ" : "Practice Area"}</label>
                <select
                  className="cmp-fl-select"
                  value={flPractice}
                  onChange={(e) => setFlPractice(e.target.value)}
                >
                  {flPracticesList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {lang === "kn" ? p.kn : p.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="cmp-fl-search-field">
                <label>🔍 {lang === "kn" ? "ವಕೀಲರ ಹುಡುಕಾಟ" : "Search Advocates"}</label>
                <div className="cmp-fl-input-wrap">
                  <input
                    type="text"
                    className="cmp-fl-input"
                    placeholder={t.flSearchPlaceholder}
                    value={flSearch}
                    onChange={(e) => setFlSearch(e.target.value)}
                  />
                  {flSearch && (
                    <button className="cmp-fl-clear" onClick={() => setFlSearch("")}>
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results Stats */}
            <div className="cmp-fl-stats">
              <span>{t.flFound(filteredAdvocates.length)}</span>
              {(flCity !== "All" || flPractice !== "All" || flSearch) && (
                <button
                  className="cmp-fl-reset-btn"
                  onClick={() => {
                    setFlCity("All");
                    setFlPractice("All");
                    setFlSearch("");
                  }}
                >
                  {t.flResetFilters}
                </button>
              )}
            </div>

            {/* Advocate Cards Grid */}
            <div className="cmp-fl-grid">
              {filteredAdvocates.map((adv) => {
                const rating = adv.rating || 5.0;
                const court = adv.court || (lang === "kn" ? "ಜಿಲ್ಲಾ ಮತ್ತು ಸೆಷನ್ಸ್ ನ್ಯಾಯಾಲಯ" : "District & Sessions Court");
                const spec = lang === "kn" ? (adv.specialityKn || adv.speciality || "ಕಾನೂನು ಸಲಹೆಗಾರ") : (adv.speciality || adv.practiceArea || "Legal Counsel");
                const loc = adv.city || adv.district || "Karnataka";
                const exp = adv.experience || "7+ Years";

                return (
                  <div key={adv.id} className="cmp-fl-card">
                    <div className="cmp-fl-card-topbar">
                      <span className="cmp-fl-verified">
                        <span className="cmp-fl-check">✓</span> {lang === "kn" ? "ಬಾರ್ ಕೌನ್ಸಿಲ್ ಮಾನ್ಯತೆ" : "Verified Bar Member"}
                      </span>
                      <span className="cmp-fl-court" title={court}>
                        🏛️ {court.length > 24 ? court.slice(0, 22) + "…" : court}
                      </span>
                    </div>

                    <div className="cmp-fl-card-body">
                      <div className="cmp-fl-avatar-wrap">
                        <div className="cmp-fl-avatar">
                          {adv.avatar ? (
                            <img src={assetUrl(adv.avatar)} alt="" aria-hidden="true" />
                          ) : (
                            (adv.name || "A").replace(/^Adv\.\s*/i, "").charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="cmp-fl-online-beacon" title="Online for instant consultation" />
                      </div>

                      <div className="cmp-fl-details">
                        <h3 className="cmp-fl-name">{adv.name}</h3>
                        <div className="cmp-fl-spec">{spec}</div>
                        <div className="cmp-fl-meta">
                          <span>📍 {loc}</span>
                          <span>•</span>
                          <span>⏳ {exp}</span>
                        </div>
                        <div className="cmp-fl-rating">
                          <span className="cmp-fl-stars">★ {rating}</span>
                          <span className="cmp-fl-fee">{t.flConsultFee}</span>
                        </div>
                      </div>
                    </div>

                    <div className="cmp-fl-card-actions">
                      <button
                        className="cmp-fl-chat-btn"
                        onClick={() => {
                          const advId = Number(adv.id);
                          if (clientId) {
                            sessionStorage.setItem(`law4u_active_chat_${clientId}`, String(advId));
                            localStorage.setItem(`law4u_active_chat_${clientId}`, String(advId));
                            navigate(`/client-dashboard?advocateId=${advId}`);
                          } else {
                            navigate(`/signup?role=client&advocateId=${advId}&advocateName=${encodeURIComponent(adv.name || "")}&redirect=${encodeURIComponent(`/client-dashboard?advocateId=${advId}`)}`);
                          }
                        }}
                      >
                        <span>💬 {t.flChatNow}</span>
                        <span className="cmp-btn-arrow">{CMP_ICONS.arrowRight}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredAdvocates.length === 0 && (
              <div className="cmp-fl-empty">
                <p>{t.flNoMatches}</p>
                <button
                  className="cmp-fl-reset-btn"
                  onClick={() => {
                    setFlCity("All");
                    setFlPractice("All");
                    setFlSearch("");
                  }}
                >
                  {t.flResetFilters}
                </button>
              </div>
            )}
          </section>
        )}

        {/* ========================================================
           VIEW 4: AI Legal Assistant (Embedded in Client Portal)
           ======================================================== */}
        {activeView === "ai-assistant" && (
          <section className="cmp-subview-section cmp-ai-view">
            <div className="cmp-view-topbar">
              <button className="cmp-btn-back" onClick={backToHub}>
                {t.backBtn}
              </button>
              <button className="cmp-btn-chat-cta" onClick={navigateToChat}>
                {t.aiConsultAdvocate}
              </button>
            </div>

            <div className="cmp-subview-header">
              <div className="cmp-subview-badge">
                <span className="cmp-badge-dot" />
                <span>{t.aiBadge}</span>
              </div>
              <h2>{t.aiTitle}</h2>
              <p>{t.aiSub}</p>
            </div>

            {/* Quick Prompts Strip */}
            <div className="cmp-ai-prompts-wrap">
              <div className="cmp-ai-prompts-label">{t.aiPromptsTitle}</div>
              <div className="cmp-ai-prompts-scroll">
                {[
                  { label: "⚖️ Anticipatory Bail (BNSS)", text: "What is the procedure for Anticipatory Bail under BNSS 2023?" },
                  { label: "💳 Cheque Bounce (Sec 138)", text: "How to send notice and file case for Cheque Bounce under Section 138 NI Act?" },
                  { label: "👨‍👩‍👧 Mutual Divorce (HMA)", text: "What is the procedure and timeline for Mutual Consent Divorce?" },
                  { label: "🏠 Tenant Eviction", text: "How can a landlord legally evict a non-paying tenant under rent laws?" },
                  { label: "🔒 Cybercrime Complaint", text: "How to file a cyber financial fraud complaint and freeze beneficiary bank accounts?" },
                  { label: "📜 BNS vs IPC (2024)", text: "Explain the key differences between Bharatiya Nyaya Sanhita (BNS) and IPC 1860." },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    className="cmp-ai-prompt-chip"
                    onClick={() => handleSendAiMessage(p.text)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Box */}
            <div className="cmp-ai-chat-box">
              <div className="cmp-ai-messages-list">
                {aiMessages.map((msg) => (
                  <div key={msg.id} className={`cmp-ai-msg-row ${msg.role === "bot" ? "bot" : "user"}`}>
                    {msg.role === "bot" && <div className="cmp-ai-bot-avatar">⚖️</div>}
                    <div className={`cmp-ai-bubble ${msg.role === "bot" ? "bot-bubble" : "user-bubble"}`}>
                      <div className="cmp-ai-bubble-text">
                        {msg.text.split("\n").map((line, i) => (
                          <p key={i} style={{ margin: line === "" ? "8px 0" : "4px 0" }}>
                            {line}
                          </p>
                        ))}
                      </div>

                      {msg.matchedItem && (
                        <div className="cmp-ai-matched-card">
                          <div className="cmp-ai-matched-tag">
                            <span>📌 Relevant Statutory Mapping</span>
                          </div>
                          <div className="cmp-ai-matched-title">
                            {msg.matchedItem.situation}
                          </div>
                          <div className="cmp-ai-matched-meta">
                            <strong>Act / Law:</strong> {msg.matchedItem.actLaw} {msg.matchedItem.actLawDetail ? `(${msg.matchedItem.actLawDetail})` : ""}
                          </div>
                          <div className="cmp-ai-matched-meta">
                            <strong>Specialist:</strong> {msg.matchedItem.advocate}
                          </div>
                          <button
                            className="cmp-ai-matched-btn"
                            onClick={() => handleSetUpCase(msg.matchedItem)}
                          >
                            💬 Chat with Specialist Advocate →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {aiLoading && (
                  <div className="cmp-ai-msg-row bot">
                    <div className="cmp-ai-bot-avatar">⚖️</div>
                    <div className="cmp-ai-bubble bot-bubble cmp-ai-typing">
                      <span className="cmp-dot-flashing" />
                      <span>Analyzing Indian legal statutes...</span>
                    </div>
                  </div>
                )}
                <div ref={aiBottomRef} />
              </div>

              {/* Input Bar */}
              <div className="cmp-ai-input-bar">
                <button
                  type="button"
                  className={`cmp-ai-mic-btn ${aiIsListening ? "listening" : ""}`}
                  onClick={aiIsListening ? stopAiListening : startAiListening}
                  title={aiIsListening ? "Stop Listening" : "Voice input in English / Kannada"}
                >
                  {CMP_ICONS.mic}
                </button>

                <input
                  type="text"
                  className="cmp-ai-input"
                  placeholder={aiIsListening ? t.aiListening : t.aiInputPlaceholder}
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendAiMessage();
                  }}
                />

                <button
                  type="button"
                  className="cmp-ai-send-btn"
                  disabled={!aiInput.trim() || aiLoading}
                  onClick={() => handleSendAiMessage()}
                >
                  {CMP_ICONS.send}
                </button>
              </div>

              <div className="cmp-ai-disclaimer">
                <span>{t.aiDisclaimer}</span>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
           VIEW 5: Indian Bare Acts & Laws (Embedded in Client Portal)
           ======================================================== */}
        {activeView === "bare-acts" && (
          <section className="cmp-subview-section cmp-bareacts-view">
            <div className="cmp-view-topbar">
              <button className="cmp-btn-back" onClick={backToHub}>
                {t.backBtn}
              </button>
              <button className="cmp-btn-chat-cta" onClick={navigateToChat}>
                {t.baConsultAdvocate}
              </button>
            </div>

            <div className="cmp-subview-header">
              <div className="cmp-subview-badge">
                <span className="cmp-badge-dot" />
                <span>{t.baBadge}</span>
              </div>
              <h2>{t.baTitle}</h2>
              <p>{t.baSub}</p>
            </div>

            {/* New Acts Alert Banner */}
            <div className="cmp-ba-alert-banner">
              <span className="cmp-ba-alert-icon">🆕</span>
              <div className="cmp-ba-alert-text">
                <strong>{lang === "kn" ? "ಹೊಸ ಅಪರಾಧ ಕಾಯ್ದೆಗಳು 2023 ಲಭ್ಯವಿದೆ!" : "New Criminal Laws 2023 Now Active!"}</strong>
                <span> {t.baNewBanner}</span>
              </div>
              <button
                className="cmp-ba-alert-btn"
                onClick={() => {
                  setBaCategory("New Acts");
                  setBaSearch("");
                }}
              >
                {lang === "kn" ? "ಹೊಸ ಕಾಯ್ದೆಗಳನ್ನು ನೋಡಿ →" : "Explore New Acts →"}
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="cmp-filter-scroll">
              {BARE_ACTS_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`cmp-filter-pill ${baCategory === cat ? "active" : ""}`}
                  onClick={() => setBaCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Toolbar */}
            <div className="cmp-search-toolbar">
              <input
                type="text"
                className="cmp-search-input"
                placeholder={t.baSearchPlaceholder}
                value={baSearch}
                onChange={(e) => setBaSearch(e.target.value)}
              />
              {baSearch && (
                <button className="cmp-search-clear-btn" onClick={() => setBaSearch("")}>
                  ✕
                </button>
              )}
              <span className="cmp-search-count">
                {filteredBareActs.length} {lang === "kn" ? "ಕಾಯ್ದೆಗಳು" : "Acts"}
              </span>
            </div>

            {/* Acts Grid */}
            <div className="cmp-ba-grid">
              {filteredBareActs.map((act) => (
                <div key={act.id} className="cmp-ba-card">
                  <div className="cmp-ba-card-top">
                    <span className="cmp-ba-act-icon">{act.icon}</span>
                    <div className="cmp-ba-card-badges">
                      {act.isNew && <span className="cmp-ba-badge new">🆕 New (2023)</span>}
                      {act.popular && <span className="cmp-ba-badge popular">🔥 Popular</span>}
                    </div>
                  </div>

                  <div
                    className="cmp-ba-short"
                    style={{ color: BARE_ACTS_COLORS[act.category] || "#2563eb" }}
                  >
                    {act.shortName}
                  </div>
                  <h3 className="cmp-ba-title">{act.title}</h3>
                  <p className="cmp-ba-desc">{act.desc}</p>

                  <div className="cmp-ba-meta">
                    <span>📅 {act.year}</span>
                    <span>📋 {act.sections} Sections</span>
                    <span
                      className="cmp-ba-cat"
                      style={{
                        background: (BARE_ACTS_COLORS[act.category] || "#2563eb") + "18",
                        color: BARE_ACTS_COLORS[act.category] || "#2563eb",
                      }}
                    >
                      {act.category}
                    </span>
                  </div>

                  <div className="cmp-ba-actions">
                    <button
                      className="cmp-ba-btn-read"
                      onClick={() => {
                        setBaSelectedAct(act);
                        setBaActiveSection(1);
                      }}
                    >
                      {t.baReadBtn}
                    </button>
                    <button
                      className="cmp-ba-btn-dl"
                      onClick={() => handleDownloadActPdf(act)}
                    >
                      {t.baDownloadBtn}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
           VIEW 6: Legal Documents & Drafts (Embedded in Client Portal)
           ======================================================== */}
        {activeView === "documents" && (
          <section className="cmp-subview-section cmp-documents-view">
            <div className="cmp-view-topbar">
              <button className="cmp-btn-back" onClick={backToHub}>
                {t.backBtn}
              </button>
              <button className="cmp-btn-chat-cta" onClick={navigateToChat}>
                {t.ldConsultAdvocate}
              </button>
            </div>

            <div className="cmp-subview-header">
              <div className="cmp-subview-badge">
                <span className="cmp-badge-dot" />
                <span>{t.ldBadge}</span>
              </div>
              <h2>{t.ldTitle}</h2>
              <p>{t.ldSub}</p>
            </div>

            {/* Category Filter Pills */}
            <div className="cmp-filter-scroll">
              {LEGAL_DOC_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`cmp-filter-pill ${ldCategory === cat ? "active" : ""}`}
                  onClick={() => setLdCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Toolbar */}
            <div className="cmp-search-toolbar">
              <input
                type="text"
                className="cmp-search-input"
                placeholder={t.ldSearchPlaceholder}
                value={ldSearch}
                onChange={(e) => setLdSearch(e.target.value)}
              />
              {ldSearch && (
                <button className="cmp-search-clear-btn" onClick={() => setLdSearch("")}>
                  ✕
                </button>
              )}
              <span className="cmp-search-count">
                {filteredDocuments.length} {lang === "kn" ? "ಕರಡುಗಳು" : "Templates"}
              </span>
            </div>

            {/* Documents Grid */}
            <div className="cmp-ld-grid">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="cmp-ld-card">
                  <div className="cmp-ld-card-top">
                    <span className="cmp-ld-icon">{doc.icon}</span>
                    <div className="cmp-ld-badges">
                      <span className={`cmp-ld-badge ${doc.free ? "free" : "premium"}`}>
                        {doc.free ? t.ldFree : t.ldPremium}
                      </span>
                      <span className="cmp-ld-pages">{doc.pages} pages</span>
                    </div>
                  </div>

                  <h3 className="cmp-ld-title">{doc.title}</h3>
                  <p className="cmp-ld-desc">{doc.desc}</p>
                  <div className="cmp-ld-downloads">⬇ {t.ldDownloads(doc.downloads)}</div>

                  <div className="cmp-ld-actions">
                    <button
                      className="cmp-ld-btn-prev"
                      onClick={() => setLdPreviewDoc(doc)}
                    >
                      {t.ldPreviewBtn}
                    </button>
                    <button
                      className="cmp-ld-btn-dl"
                      onClick={() => handleDownloadDocument(doc)}
                    >
                      {t.ldDownloadBtn}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ========================================================
         MODAL 1: Bare Acts Section Reader Modal
         ======================================================== */}
      {baSelectedAct && (
        <div
          className="cmp-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setBaSelectedAct(null)}
        >
          <div className="cmp-modal-box ba-modal">
            <div
              className="cmp-modal-header"
              style={{ borderBottom: `3px solid ${BARE_ACTS_COLORS[baSelectedAct.category] || "#2563eb"}` }}
            >
              <div>
                <span
                  className="cmp-modal-tag"
                  style={{ color: BARE_ACTS_COLORS[baSelectedAct.category] || "#2563eb" }}
                >
                  {baSelectedAct.shortName}
                </span>
                <h3>{baSelectedAct.title}</h3>
                <div className="cmp-modal-meta">
                  Year: {baSelectedAct.year} · {baSelectedAct.sections} Sections · {baSelectedAct.category}
                </div>
              </div>
              <button
                className="cmp-modal-close"
                onClick={() => setBaSelectedAct(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="cmp-modal-body">
              <div className="cmp-modal-sidebar">
                <div className="cmp-sidebar-title">{t.baSectionsHeader}</div>
                {sampleSections.map((s) => (
                  <button
                    key={s.no}
                    className={`cmp-sidebar-item ${baActiveSection === s.no ? "active" : ""}`}
                    onClick={() => setBaActiveSection(s.no)}
                  >
                    <span className="cmp-section-num">§ {s.no}</span>
                    <span className="cmp-section-name">{s.title}</span>
                  </button>
                ))}
                <div className="cmp-sidebar-more">
                  + {baSelectedAct.sections - 4} more statutory sections available
                </div>
              </div>

              <div className="cmp-modal-content">
                {sampleSections.filter((s) => s.no === baActiveSection).map((s) => (
                  <div key={s.no}>
                    <h4>Section {s.no} — {s.title}</h4>
                    <div className="cmp-section-text">
                      {s.content.split("\n").map((line, idx) => (
                        <p key={idx} style={{ margin: line === "" ? "8px 0" : "4px 0" }}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cmp-modal-footer">
              <span className="cmp-modal-note">📖 {t.baShowingSample}</span>
              <button
                className="cmp-modal-dl-btn"
                onClick={() => handleDownloadActPdf(baSelectedAct)}
              >
                {t.baDownloadFull}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
         MODAL 2: Legal Document Formatted Preview Modal
         ======================================================== */}
      {ldPreviewDoc && (
        <div
          className="cmp-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setLdPreviewDoc(null)}
        >
          <div className="cmp-modal-box ld-modal">
            <div className="cmp-modal-header">
              <div>
                <h3>{ldPreviewDoc.icon} {ldPreviewDoc.title}</h3>
                <p>
                  {ldPreviewDoc.category} · {ldPreviewDoc.pages} pages ·{" "}
                  {ldPreviewDoc.free ? t.ldFree : t.ldPremium}
                </p>
              </div>
              <button
                className="cmp-modal-close"
                onClick={() => setLdPreviewDoc(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="cmp-modal-body">
              <div className="cmp-doc-preview-sheet">
                <div className="cmp-sheet-top">
                  <strong>ADVOCATES HUB LEGAL DOCUMENT VAULT</strong>
                  <span>Standard Indian Legal Format · Verified Draft</span>
                </div>
                <hr />
                <h4 style={{ textAlign: "center", margin: "16px 0", letterSpacing: "1px" }}>
                  {ldPreviewDoc.title.toUpperCase()}
                </h4>
                <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.82rem" }}>
                  (Drafted under Indian Contract Act, Registration Act & Relevant Local Statutes)
                </p>
                <div style={{ marginTop: "16px", lineHeight: 1.7, fontSize: "0.88rem" }}>
                  <p><strong>THIS DEED / AGREEMENT</strong> is entered into on this _____ day of ____________, 202X at [City/Place], Karnataka.</p>
                  <p><strong>BY AND BETWEEN:</strong><br /><strong>[NAME OF FIRST PARTY]</strong>, Aged about ___ years, Residing at [Complete Address], hereinafter called the <strong>'FIRST PARTY'</strong> (which expression shall unless repugnant to the context include successors and assigns).</p>
                  <p style={{ textAlign: "center", fontWeight: "bold" }}>AND</p>
                  <p><strong>[NAME OF SECOND PARTY]</strong>, Aged about ___ years, Residing at [Complete Address], hereinafter called the <strong>'SECOND PARTY'</strong> (which expression shall unless repugnant to the context include successors and assigns).</p>
                  <p><strong>WHEREAS:</strong><br />1. The First Party is the lawful authority/owner possessing requisite legal standing.<br />2. The Second Party has agreed to the covenants, representations and mutual undertakings as specified below.</p>
                  <p><strong>NOW THIS INDENTURE WITNESSETH AS FOLLOWS:</strong><br />1. <strong>Scope & Consideration:</strong> The parties agree to adhere to all statutory and contractual duties without default.<br />2. <strong>Rights & Remedies:</strong> In event of breach, the aggrieved party is entitled to statutory relief and notice period.<br />3. <strong>Dispute Resolution:</strong> Any dispute arising shall be resolved under the Arbitration and Conciliation Act, 1996, before courts in Karnataka.</p>
                  <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid #cbd5e1" }}>
                    <div>[SIGNATURE FIRST PARTY]</div>
                    <div>[SIGNATURE SECOND PARTY]</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="cmp-modal-footer">
              <button
                className="cmp-modal-cancel-btn"
                onClick={() => setLdPreviewDoc(null)}
              >
                {t.ldClose}
              </button>
              <button
                className="cmp-modal-dl-btn"
                onClick={() => handleDownloadDocument(ldPreviewDoc)}
              >
                {t.ldDownloadBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}