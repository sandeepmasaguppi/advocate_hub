// ============================================================
//  Partners.js — Advocates Hub "Institutional Partnerships"
//  Features:
//    • Full Black & White (Dark & Light) Theme Architecture
//    • Real-Time Synchronization with ThemeStore & LanguageStore
//    • Bilingual English / Kannada Support
//    • 6 Strategic Partnership Tracks with Perks & Badges
//    • Verified Institutional Alliances Showcase
//    • Value Proposition & Strategic Advantages
//    • 4 Working One-Tap Action Cards (Call, WhatsApp, Email, Office)
//    • Interactive Partnership Proposal Form with Validation & Store Sync
//    • Interactive Partnership FAQ Accordion
//    • Statutory Bar Council & Privacy Compliance Guarantee
// ============================================================

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { addMessage } from "../data/MessageStore";
import { getTheme } from "../data/themeStore";
import sandeepImg from "../images/sandeep.jpeg";
import "./Partners.css";

// ── PARTNERSHIP TRACKS / CATEGORIES ──
const PARTNER_VERTICALS = [
  {
    id: "law-firms",
    icon: "⚖️",
    titleEn: "Law Firms & Chambers",
    titleKn: "ಕಾನೂನು ಸಂಸ್ಥೆಗಳು & ಚೇಂಬರ್ಸ್",
    descEn:
      "Empanel your multi-advocate firm on Advocates Hub. Streamline institutional client intake, co-counsel across High Courts, and monitor practice caseloads in one unified dashboard.",
    descKn:
      "ನಿಮ್ಮ ಕಾನೂನು ಸಂಸ್ಥೆಯನ್ನು ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನೊಂದಿಗೆ ಜೋಡಿಸಿ. ಕೇಸ್ ನಿರ್ವಹಣೆ ಮತ್ತು ಗ್ರಾಹಕರ ಸಂಪರ್ಕವನ್ನು ಏಕೀಕೃತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಸುಲಭಗೊಳಿಸಿ.",
    perksEn: [
      "Centralized multi-advocate firm dashboard",
      "High-value corporate & commercial briefs",
      "Co-counseling across all 31 Karnataka districts"
    ],
    perksKn: [
      "ಕೇಂದ್ರೀಕೃತ ಮಲ್ಟಿ-ವಕೀಲರ ಸಂಸ್ಥೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      "ಪ್ರಮುಖ ಕಾರ್ಪೊರೇಟ್ ಕೇಸ್‌ಗಳ ಆದ್ಯತೆ",
      "ಕರ್ನಾಟಕದ ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಜಂಟಿ ಪ್ರಾಕ್ಟೀಸ್"
    ],
    badgeEn: "Enterprise Empanelment",
    badgeKn: "ಸಾಂಸ್ಥಿಕ ಸೇರ್ಪಡೆ"
  },
  {
    id: "bar-associations",
    icon: "🏛️",
    titleEn: "Bar Associations & Councils",
    titleKn: "ಬಾರ್ ಅಸೋಸಿಯೇಷನ್‌ಗಳು & ಕೌನ್ಸಿಲ್‌ಗಳು",
    descEn:
      "Digitize advocate member credentials, host Continuing Legal Education (CLE) masterclasses, and equip members with verified, trustworthy digital profiles.",
    descKn:
      "ಸದಸ್ಯ ವಕೀಲರ ಡಿಜಿಟಲ್ ಪರಿಶೀಲನೆ, ನಿರಂತರ ಕಾನೂನು ತರಬೇತಿ ಮತ್ತು ಸದಸ್ಯರಿಗೆ ಡಿಜಿಟಲ್ ಪ್ರೊಫೈಲ್ ಸೌಲಭ್ಯ ಒದಗಿಸಿ.",
    perksEn: [
      "Automated State Bar Council roll synchronization",
      "Free legaltech workshops & digital chambers training",
      "District advocate welfare & legal empowerment drives"
    ],
    perksKn: [
      "ಸ್ವಯಂಚಾಲಿತ ಬಾರ್ ರೋಲ್ ಪರಿಶೀಲನೆ ಸಂಯೋಜನೆ",
      "ಉಚಿತ ಲೀಗಲ್‌ಟೆಕ್ ಕಾರ್ಯಾಗಾರಗಳು",
      "ವಕೀಲರ ಕ್ಷೇಮಾಭಿವೃದ್ಧಿ ಮತ್ತು ಸಬಲೀಕರಣ ಅಭಿಯಾನ"
    ],
    badgeEn: "Institutional MoU",
    badgeKn: "ಸಾಂಸ್ಥಿಕ ಒಡಂಬಡಿಕೆ"
  },
  {
    id: "corporates",
    icon: "🏢",
    titleEn: "Enterprises & In-House Counsel",
    titleKn: "ಕಾರ್ಪೊರೇಟ್‌ಗಳು & ಇನ್‌ಹೌಸ್ ಲೀಗಲ್",
    descEn:
      "On-demand retained advocates across Karnataka for regulatory compliance, labor disputes, contract review, real estate due diligence, and expedited local court filings.",
    descKn:
      "ಕಾರ್ಪೊರೇಟ್ ಸಂಸ್ಥೆಗಳಿಗೆ ತಕ್ಷಣದ ನಿಯಂತ್ರಕ ಅನುಸರಣೆ, ಒಪ್ಪಂದಗಳ ಪರಿಶೀಲನೆ ಮತ್ತು ವಿವಾದ ಪರಿಹಾರಕ್ಕೆ ಪರಿಶೀಲಿತ ವಕೀಲರು.",
    perksEn: [
      "Standardized institutional billing & SLAs",
      "Pan-Karnataka trial & appellate court coverage",
      "Direct Senior Advocate supervision & oversight"
    ],
    perksKn: [
      "ಪೂರ್ವ-ನಿಗದಿತ ಬಿಲ್ಲಿಂಗ್ ಮತ್ತು ಎಸ್‌ಎಲ್‌ಎ",
      "ಕರ್ನಾಟಕದಾದ್ಯಂತ ನ್ಯಾಯಾಲಯಗಳ ವ್ಯಾಪ್ತಿ",
      "ಹಿರಿಯ ವಕೀಲರ ನೇರ ಮೇಲ್ವಿಚಾರಣೆ"
    ],
    badgeEn: "Retainer Solutions",
    badgeKn: "ರಿಟೈನರ್ ಪರಿಹಾರ"
  },
  {
    id: "academia",
    icon: "🎓",
    titleEn: "Law Universities & Clinics",
    titleKn: "ಕಾನೂನು ವಿಶ್ವವಿದ್ಯಾಲಯಗಳು",
    descEn:
      "Sponsor national moot courts, power free community legal aid clinics, and guarantee mentorship internships under vetted Senior High Court Advocates.",
    descKn:
      "ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಉಚಿತ ಕಾನೂನು ಚಿಕಿತ್ಸಾಲಯ, ಮೂಟ್ ಕೋರ್ಟ್ ಪ್ರಾಯೋಜಕತ್ವ ಮತ್ತು ಹಿರಿಯ ವಕೀಲರೊಂದಿಗೆ ಇಂಟರ್ನ್‌ಶಿಪ್ ಅವಕಾಶ.",
    perksEn: [
      "Student legal aid clinic digitization",
      "Direct mentorship under Senior Advocates",
      "Full digital library access to Bare Acts & case digests"
    ],
    perksKn: [
      "ಡಿಜಿಟಲ್ ಲೀಗಲ್ ಏಡ್ ಕ್ಲಿನಿಕ್ ನಿರ್ವಹಣೆ",
      "ಹಿರಿಯ ವಕೀಲರ ನೇರ ಮಾರ್ಗದರ್ಶನ",
      "ಡಿಜಿಟಲ್ ಬೇರ್ ಆಕ್ಟ್ಸ್ ಮತ್ತು ಕೇಸ್ ಲೈಬ್ರರಿ ಪ್ರವೇಶ"
    ],
    badgeEn: "Academic Alliance",
    badgeKn: "ಶೈಕ್ಷಣಿಕ ಮೈತ್ರಿ"
  },
  {
    id: "legaltech",
    icon: "💻",
    titleEn: "LegalTech & Enterprise APIs",
    titleKn: "ಲೀಗಲ್‌ಟೆಕ್ & ಸಾಫ್ಟ್‌ವೇರ್ ಎಪಿಐ",
    descEn:
      "Embed our verified advocate directory and automated verification engine into your enterprise ERP, fintech, or proptech workflow via secure REST APIs.",
    descKn:
      "ನಿಮ್ಮ ಸಾಫ್ಟ್‌ವೇರ್ ಅಥವಾ ಆ್ಯಪ್‌ನಲ್ಲಿ ನಮ್ಮ ಪರಿಶೀಲಿತ ವಕೀಲರ ನೆಟ್‌ವರ್ಕ್ ಮತ್ತು ಎಪಿಐಗಳನ್ನು ಸುಲಭವಾಗಿ ಸಂಯೋಜಿಸಿ.",
    perksEn: [
      "REST API & real-time webhook event synchronization",
      "OAuth 2.0 & 256-bit encrypted data transport",
      "Enterprise SLA with 99.9% uptime guarantee"
    ],
    perksKn: [
      "ಸುರಕ್ಷಿತ REST API ಮತ್ತು ರಿಯಲ್-ಟೈಮ್ ವೆಬ್‌ಹುಕ್",
      "OAuth 2.0 ಮತ್ತು 256-ಬಿಟ್ ಗೂಢಲಿಪೀಕರಣ",
      "99.9% ಅಪ್‌ಟೈಮ್ ಖಾತರಿಯೊಂದಿಗೆ ಎಂಟರ್‌ಪ್ರೈಸ್ ಎಸ್‌ಎಲ್‌ಎ"
    ],
    badgeEn: "API & Developers",
    badgeKn: "ಎಪಿಐ & ಡೆವಲಪರ್ಸ್"
  },
  {
    id: "ngos",
    icon: "🤝",
    titleEn: "NGOs & Legal Aid Societies",
    titleKn: "ಎನ್‌ಜಿಒ & ಸಾರ್ವಜನಿಕ ಕಾನೂನು ನೆರವು",
    descEn:
      "Coordinate subsidized and pro-bono representation for marginalized citizens, rural litigants, and public interest litigations (PIL) statewide.",
    descKn:
      "ಗ್ರಾಮೀಣ ಮತ್ತು ಬಡ ನಾಗರಿಕರಿಗೆ ಉಚಿತ ಹಾಗೂ ಸಬ್ಸಿಡಿ ದರದಲ್ಲಿ ನುರಿತ ವಕೀಲರ ಕಾನೂನು ನೆರವು ಒದಗಿಸಲು ಜಂಟಿ ಉಪಕ್ರಮ.",
    perksEn: [
      "100% subsidized pro-bono matter matching",
      "Direct alignment with District Legal Services (DLSA)",
      "Transparent progress updates and court milestone tracking"
    ],
    perksKn: [
      "100% ಉಚಿತ ಪ್ರೊ-ಬೋನೋ ಕೇಸ್ ಹೊಂದಾಣಿಕೆ",
      "ಜಿಲ್ಲಾ ಕಾನೂನು ಸೇವೆಗಳ ಪ್ರಾಧಿಕಾರದೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ",
      "ಪಾರದರ್ಶಕ ಕೇಸ್ ಹಂತಗಳ ಪರಿಶೀಲನೆ"
    ],
    badgeEn: "Social Justice",
    badgeKn: "ಸಾಮಾಜಿಕ ನ್ಯಾಯ"
  }
];

// ── INSTITUTIONAL ALLIANCES & BODIES ──
const ALLIANCE_BODIES = [
  {
    acronym: "BCK",
    nameEn: "Bar Council of Karnataka",
    nameKn: "ಕರ್ನಾಟಕ ಬಾರ್ ಕೌನ್ಸಿಲ್",
    roleEn: "Statutory Advocate Verification & Enrollment Alignment",
    roleKn: "ಶಾಸನಬದ್ಧ ವಕೀಲರ ಪರಿಶೀಲನೆ ಮತ್ತು ನೋಂದಣಿ",
    type: "Regulatory Council",
    color: "#2563eb",
    established: "Est. 1961"
  },
  {
    acronym: "AAB",
    nameEn: "Advocates Association Bengaluru",
    nameKn: "ಅಡ್ವೊಕೇಟ್ಸ್ ಅಸೋಸಿಯೇಷನ್ ಬೆಂಗಳೂರು",
    roleEn: "High Court & City Civil Court Practice Network",
    roleKn: "ಹೈಕೋರ್ಟ್ ಮತ್ತು ಸಿವಿಲ್ ಕೋರ್ಟ್ ವಕೀಲರ ಜಾಲ",
    type: "Bar Association",
    color: "#059669",
    established: "Est. 1883"
  },
  {
    acronym: "NLSIU",
    nameEn: "National Law School of India",
    nameKn: "ನ್ಯಾಷನಲ್ ಲಾ ಸ್ಕೂಲ್ ಆಫ್ ಇಂಡಿಯಾ",
    roleEn: "Academic Research, Legal Aid Clinics & Moot Sponsorship",
    roleKn: "ಶೈಕ್ಷಣಿಕ ಸಂಶೋಧನೆ ಮತ್ತು ಕಾನೂನು ನೆರವು ಕ್ಲಿನಿಕ್",
    type: "Academic Pioneer",
    color: "#7c3aed",
    established: "Bengaluru"
  },
  {
    acronym: "KSLSA",
    nameEn: "Karnataka State Legal Services",
    nameKn: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಕಾನೂನು ಸೇವೆಗಳ ಪ್ರಾಧಿಕಾರ",
    roleEn: "Pro-Bono Case Routing & Legal Awareness Camps",
    roleKn: "ಉಚಿತ ಕಾನೂನು ನೆರವು ಮತ್ತು ಜಾಗೃತಿ ಶಿಬಿರಗಳು",
    type: "Legal Aid Authority",
    color: "#dc2626",
    established: "Statutory"
  },
  {
    acronym: "BDBA",
    nameEn: "Belagavi District Bar Association",
    nameKn: "ಬೆಳಗಾವಿ ಜಿಲ್ಲಾ ಬಾರ್ ಅಸೋಸಿಯೇಷನ್",
    roleEn: "District & Taluk Court Legal Tech Empowerment",
    roleKn: "ಜಿಲ್ಲಾ ಮತ್ತು ತಾಲೂಕು ಕೋರ್ಟ್‌ಗಳ ಡಿಜಿಟಲೀಕರಣ",
    type: "District Alliance",
    color: "#ea580c",
    established: "Belagavi"
  },
  {
    acronym: "CCCI",
    nameEn: "Corporate Counsel Forum India",
    nameKn: "ಕಾರ್ಪೊರೇಟ್ ಕೌನ್ಸೆಲ್ ಫೋರಮ್ ಇಂಡಿಯಾ",
    roleEn: "Enterprise Retainer Empanelment & Compliance",
    roleKn: "ಕಾರ್ಪೊರೇಟ್ ಲೀಗಲ್ ಎಂಪ್ಯಾನೆಲ್‌ಮೆಂಟ್ & ನಿಯಮಾವಳಿ",
    type: "Enterprise Alliance",
    color: "#0891b2",
    established: "Pan-India"
  }
];

// ── PARTNERSHIP VALUE PROPOSITIONS ──
const ALLIANCE_BENEFITS = [
  {
    icon: "🚀",
    titleEn: "Expanded Litigant Reach",
    titleKn: "ಹೆಚ್ಚಿದ ಗ್ರಾಹಕರ ಸಂಪರ್ಕ",
    descEn:
      "Connect your empanelled advocates with thousands of active monthly litigants seeking verified legal representation across Karnataka."
  },
  {
    icon: "🛡️",
    titleEn: "Tamper-Proof Verification",
    titleKn: "ಪರಿಶೀಲಿತ ಅಧಿಕೃತ ಮುದ್ರೆ",
    descEn:
      "Every associated advocate undergoes manual verification of State Bar Council enrollment numbers and active Certificate of Practice (COP)."
  },
  {
    icon: "⚡",
    titleEn: "Institutional Dashboard",
    titleKn: "ಸಾಂಸ್ಥಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    descEn:
      "Manage all associate advocates, assign incoming corporate briefs, track client appointments, and monitor compliance in one place."
  },
  {
    icon: "💼",
    titleEn: "Dedicated Alliance Manager",
    titleKn: "ಮೀಸಲಾದ ಸಂಬಂಧ ವ್ಯವಸ್ಥಾಪಕರು",
    descEn:
      "Direct access to our executive partnerships leadership for priority onboarding, customized SLA workflows, and institutional billing."
  },
  {
    icon: "📊",
    titleEn: "Quarterly Analytics & Insights",
    titleKn: "ಪಾರದರ್ಶಕ ವರದಿಗಾರಿಕೆ",
    descEn:
      "Comprehensive institutional reporting on consultation volumes, turnaround times, and client satisfaction metrics for governing committees."
  },
  {
    icon: "🔒",
    titleEn: "256-Bit Cryptographic Security",
    titleKn: "ಗರಿಷ್ಠ ದರ್ಜೆಯ ಡೇಟಾ ಭದ್ರತೆ",
    descEn:
      "All document transfers and communications are protected by statutory Attorney-Client Privilege and encrypted with AES-256 protocols."
  }
];

// ── FREQUENTLY ASKED QUESTIONS ──
const PARTNER_FAQS = [
  {
    qEn: "How long does institutional partner onboarding and verification take?",
    qKn: "ಪಾಲುದಾರಿಕೆ ನೋಂದಣಿ ಮತ್ತು ಪರಿಶೀಲನೆಗೆ ಎಷ್ಟು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ?",
    aEn:
      "Our strategic partnerships executive desk reviews and contacts applicant organizations within 4 to 24 business hours. Verification of institutional credentials, digital onboarding, and roster setup are typically finalized within 2 to 3 business days.",
    aKn:
      "ನಮ್ಮ ಸಾಂಸ್ಥಿಕ ತಂಡವು 4 ರಿಂದ 24 ಗಂಟೆಗಳಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಸ್ತಾವನೆಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ. ಎಲ್ಲಾ ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆ ಮತ್ತು ಆನ್‌ಬೋರ್ಡಿಂಗ್ 2 ರಿಂದ 3 ವ್ಯವಹಾರಿಕ ದಿನಗಳಲ್ಲಿ ಪೂರ್ಣಗೊಳ್ಳುತ್ತದೆ."
  },
  {
    qEn: "Is there any financial cost for Bar Associations or Law Universities?",
    qKn: "ಬಾರ್ ಅಸೋಸಿಯೇಷನ್ ಅಥವಾ ಕಾನೂನು ಕಾಲೇಜುಗಳಿಗೆ ಯಾವುದೇ ಶುಲ್ಕವಿದೆಯೇ?",
    aEn:
      "No. Partnerships with Bar Associations, Legal Aid Authorities, and Academic Institutions are 100% free under our public Access to Justice and Continuing Legal Education (CLE) initiatives.",
    aKn:
      "ಖಂಡಿತ ಇಲ್ಲ. ಬಾರ್ ಅಸೋಸಿಯೇಷನ್‌ಗಳು, ಕಾನೂನು ಕಾಲೇಜುಗಳು ಮತ್ತು ಕಾನೂನು ನೆರವು ಪ್ರಾಧಿಕಾರಗಳೊಂದಿಗೆ ಪಾಲುದಾರಿಕೆ ಸಂಪೂರ್ಣ ಉಚಿತವಾಗಿರುತ್ತದೆ."
  },
  {
    qEn: "Can our law firm manage multiple advocates and distribute client inquiries?",
    qKn: "ನಮ್ಮ ಸಂಸ್ಥೆಯ ಅನೇಕ ವಕೀಲರನ್ನು ನಿರ್ವಹಿಸಲು ಮತ್ತು ಕೇಸ್‌ಗಳನ್ನು ಹಂಚಲು ಸಾಧ್ಯವೇ?",
    aEn:
      "Yes. Our Law Firm Enterprise portal gives managing partners a centralized dashboard to add senior and junior associates, route incoming client inquiries by legal domain, and monitor active court representations.",
    aKn:
      "ಹೌದು. ಸಂಸ್ಥೆಯ ಮುಖ್ಯಸ್ಥರಿಗೆ ಕೇಂದ್ರೀಕೃತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಸಿಗಲಿದ್ದು, ಕಿರಿಯ ಹಾಗೂ ಹಿರಿಯ ವಕೀಲರಿಗೆ ವಿಷಯವಾರು ಕೇಸ್‌ಗಳನ್ನು ಹಂಚಬಹುದು ಮತ್ತು ಸಮಾಲೋಚನೆಗಳನ್ನು ನಿರ್ವಹಿಸಬಹುದು."
  },
  {
    qEn: "How does Advocates Hub ensure compliance with Bar Council of India (BCI) rules?",
    qKn: "ಬಾರ್ ಕೌನ್ಸಿಲ್ ಆಫ್ ಇಂಡಿಯಾ ನಿಯಮಾವಳಿಗಳಿಗೆ ಹೇಗೆ ಬದ್ಧವಾಗಿದೆ?",
    aEn:
      "Advocates Hub operates strictly within Rule 36, Section IV, Chapter II of the Bar Council of India Rules and Section 35 of the Advocates Act, 1961. The platform functions as a verified directory and digital facilitator, ensuring no unlawful solicitation or advertising occurs.",
    aKn:
      "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ ಬಾರ್ ಕೌನ್ಸಿಲ್ ಆಫ್ ಇಂಡಿಯಾ ನಿಯಮಾವಳಿಗಳು ಮತ್ತು 1961ರ ವಕೀಲರ ಕಾಯ್ದೆಯ ನಿಯಮಗಳಿಗೆ ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಬದ್ಧವಾಗಿದ್ದು, ಕೇವಲ ಪರಿಶೀಲಿತ ಮಾಹಿತಿ ಮತ್ತು ತಾಂತ್ರಿಕ ವೇದಿಕೆಯಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ."
  },
  {
    qEn: "Can we integrate Advocates Hub directory via API into our existing enterprise portal?",
    qKn: "ನಮ್ಮ ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಪೋರ್ಟಲ್‌ಗೆ ಎಪಿಐ ಮೂಲಕ ಸಂಯೋಜಿಸಬಹುದೇ?",
    aEn:
      "Yes. We offer secure, authenticated REST APIs and Webhook endpoints for verified enterprise partners, allowing real-time advocate directory queries, background credential verification, and appointment scheduling.",
    aKn:
      "ಹೌದು. ಕಾರ್ಪೊರೇಟ್ ಪಾಲುದಾರರಿಗೆ ಸುರಕ್ಷಿತ REST API ಮತ್ತು ವೆಬ್‌ಹುಕ್ ಸೌಲಭ್ಯವಿದ್ದು, ನಿಮ್ಮ ಆಂತರಿಕ ಸಾಫ್ಟ್‌ವೇರ್‌ನೊಂದಿಗೆ ಸುಲಭವಾಗಿ ಸಂಯೋಜಿಸಬಹುದು."
  }
];

export default function Partners() {
  // Theme state synchronized with global theme store
  const [theme, setTheme] = useState(getTheme);

  // Language state synchronized with global language selector
  const [lang, setLang] = useState(() => localStorage.getItem("law4u_lang") || "en");
  const isKn = lang === "kn";

  // Form state & error tracking
  const [form, setForm] = useState({
    orgName: "",
    contactName: "",
    email: "",
    phone: "",
    type: "",
    rosterSize: "",
    city: "",
    message: ""
  });
  const [err, setErr] = useState({});
  const [sending, setSending] = useState(false);
  const [sentData, setSentData] = useState(null);

  // Active FAQ accordion state
  const [activeFaq, setActiveFaq] = useState(null);

  // Synchronize theme & language listeners
  useEffect(() => {
    const handleTheme = (e) => {
      setTheme(e.detail || getTheme());
    };
    const handleLang = (e) => {
      setLang(e.detail || localStorage.getItem("law4u_lang") || "en");
    };

    window.addEventListener("law4u_theme_change", handleTheme);
    window.addEventListener("law4u_lang_change", handleLang);

    return () => {
      window.removeEventListener("law4u_theme_change", handleTheme);
      window.removeEventListener("law4u_lang_change", handleLang);
    };
  }, []);

  const setF = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    setErr((prev) => ({ ...prev, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneClean = form.phone.replace(/[\s\-()+]/g, "");

    if (!form.orgName.trim() || form.orgName.trim().length < 2) {
      e.orgName = isKn ? "ಸಂಸ್ಥೆಯ ಹೆಸರನ್ನು ನಮೂದಿಸಿ" : "Organization or chamber name is required";
    }
    if (!form.contactName.trim() || form.contactName.trim().length < 2) {
      e.contactName = isKn ? "ಸಂಪರ್ಕಿಸುವ ವ್ಯಕ್ತಿಯ ಹೆಸರನ್ನು ನಮೂದಿಸಿ" : "Contact person's name is required";
    }
    if (!form.email.trim()) {
      e.email = isKn ? "ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ" : "Work email address is required";
    } else if (!emailRegex.test(form.email.trim())) {
      e.email = isKn ? "ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ" : "Please provide a valid email format";
    }
    if (!form.phone.trim()) {
      e.phone = isKn ? "ದೂರವಾಣಿ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ" : "Contact phone number is required";
    } else if (phoneClean.length < 10) {
      e.phone = isKn ? "ಮಾನ್ಯವಾದ 10 ಅಂಕಿಯ ದೂರವಾಣಿ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ" : "Please enter a valid 10-digit phone number";
    }
    if (!form.type) {
      e.type = isKn ? "ಪಾಲುದಾರಿಕೆಯ ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Please select a partnership category";
    }
    if (!form.city.trim()) {
      e.city = isKn ? "ನಗರ ಅಥವಾ ಜಿಲ್ಲೆಯನ್ನು ನಮೂದಿಸಿ" : "Headquarter city/state is required";
    }

    setErr(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);

    const refId = `AH-PTR-${Math.floor(10000 + Math.random() * 90000)}`;
    const payload = {
      type: "partner",
      orgName: form.orgName.trim(),
      contactName: form.contactName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      partnershipType: form.type,
      rosterSize: form.rosterSize || "Not specified",
      city: form.city.trim(),
      referenceId: refId,
      message:
        form.message.trim() ||
        `Partnership proposal submitted for ${form.type} (${form.orgName.trim()}, ${form.city.trim()})`
    };

    setTimeout(() => {
      // Save permanently to MessageStore (visible immediately in Admin Messages tab)
      addMessage(payload);

      setSending(false);
      setSentData({
        refId,
        orgName: form.orgName.trim(),
        contactName: form.contactName.trim(),
        email: form.email.trim().toLowerCase(),
        type: form.type
      });

      // Clear form
      setForm({
        orgName: "",
        contactName: "",
        email: "",
        phone: "",
        type: "",
        rosterSize: "",
        city: "",
        message: ""
      });
    }, 600);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={`pt-page ${theme === "dark" ? "pt-dark" : "pt-light"}`}>
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="pt-hero">
        <div className="pt-hero-inner">
          <div className="pt-hero-badge">
            <span className="pt-badge-icon">🤝</span>
            <span>
              {isKn
                ? "ಸಾಂಸ್ಥಿಕ ಪಾಲುದಾರಿಕೆಗಳು & ವ್ಯೂಹಾತ್ಮಕ ಮೈತ್ರಿ"
                : "STRATEGIC ALLIANCES & INSTITUTIONAL PARTNERSHIPS"}
            </span>
          </div>

          <h1 className="pt-hero-title">
            {isKn ? (
              <>
                ಭಾರತದಾದ್ಯಂತ <span className="pt-title-highlight">ನ್ಯಾಯದ ಸುಲಭ ಲಭ್ಯತೆಗೆ</span> ಬಲವಾದ ಸಾಂಸ್ಥಿಕ ಸಹಯೋಗ
              </>
            ) : (
              <>
                Empowering Legal Excellence Across India Through{" "}
                <span className="pt-title-highlight">Strategic Alliances</span>
              </>
            )}
          </h1>

          <p className="pt-hero-sub">
            {isKn
              ? "ನಾವು ಪ್ರಮುಖ ಬಾರ್ ಕೌನ್ಸಿಲ್‌ಗಳು, ಕಾನೂನು ಸಂಸ್ಥೆಗಳು, ಉನ್ನತ ವಿಶ್ವವಿದ್ಯಾಲಯಗಳು ಮತ್ತು ಕಾರ್ಪೊರೇಟ್ ಲೀಗಲ್ ವಿಭಾಗಗಳೊಂದಿಗೆ ಕೈಜೋಡಿಸಿ ತ್ವರಿತ, ಪರಿಶೀಲಿತ ಹಾಗೂ ಪಾರದರ್ಶಕ ಕಾನೂನು ಸೇವೆಗಳನ್ನು ತಲುಪಿಸುತ್ತಿದ್ದೇವೆ."
              : "Advocates Hub partners with premier Bar Councils, leading law firms, academic law clinics, and enterprise legal departments to deliver fast, verified, and accessible justice to every citizen."}
          </p>

          <div className="pt-hero-ctas">
            <button
              type="button"
              className="pt-btn-primary pt-hero-btn"
              onClick={() => scrollToSection("pt-proposal-form")}
            >
              <span>{isKn ? "ಪ್ರಸ್ತಾವನೆ ಸಲ್ಲಿಸಿ ↓" : "Submit Partnership Proposal ↓"}</span>
            </button>
            <button
              type="button"
              className="pt-btn-secondary pt-hero-btn"
              onClick={() => scrollToSection("pt-executive-desk")}
            >
              <span>{isKn ? "ನೇರ ಸಂಪರ್ಕ ವಿವರ 📞" : "Direct Executive Desk 📞"}</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-metrics-bar">
            <div className="pt-metric-item">
              <span className="pt-metric-val">25+</span>
              <span className="pt-metric-lbl">
                {isKn ? "ಬಾರ್ ಅಸೋಸಿಯೇಷನ್‌ಗಳು" : "Bar Associations"}
              </span>
            </div>
            <div className="pt-metric-divider" />
            <div className="pt-metric-item">
              <span className="pt-metric-val">180+</span>
              <span className="pt-metric-lbl">
                {isKn ? "ಕಾನೂನು ಸಂಸ್ಥೆಗಳು" : "Empanelled Law Firms"}
              </span>
            </div>
            <div className="pt-metric-divider" />
            <div className="pt-metric-item">
              <span className="pt-metric-val">10,000+</span>
              <span className="pt-metric-lbl">
                {isKn ? "ಪರಿಶೀಲಿತ ವಕೀಲರು" : "Verified Advocates"}
              </span>
            </div>
            <div className="pt-metric-divider" />
            <div className="pt-metric-item">
              <span className="pt-metric-val">99.8%</span>
              <span className="pt-metric-lbl">
                {isKn ? "ಸಮಯೋಚಿತ ಪ್ರತಿಕ್ರಿಯೆ" : "On-Time Turnaround"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT CONTAINER ──────────────────────── */}
      <div className="pt-container">
        {/* SECTION 1: Partnership Verticals */}
        <section className="pt-section" id="pt-programs">
          <div className="pt-section-header">
            <span className="pt-subheading">
              {isKn ? "ಪಾಲುದಾರಿಕೆ ವಿಭಾಗಗಳು" : "COLLABORATION TRACKS"}
            </span>
            <h2 className="pt-section-title">
              {isKn ? "ನಾವು ಯಾರೊಂದಿಗೆ ಪಾಲುದಾರಿಕೆ ಹೊಂದುತ್ತೇವೆ?" : "Who We Partner With"}
            </h2>
            <p className="pt-section-desc">
              {isKn
                ? "ಸಾಂಸ್ಥಿಕ ಅಗತ್ಯಗಳಿಗೆ ತಕ್ಕಂತೆ ವಿಶೇಷ ಸೌಲಭ್ಯಗಳು, ತಾಂತ್ರಿಕ ಬೆಂಬಲ ಮತ್ತು ವಕೀಲರ ಜಾಲದೊಂದಿಗೆ ಬೆಂಬಲ ನೀಡುತ್ತೇವೆ."
                : "Tailored institutional frameworks designed for state bar bodies, dynamic law firms, enterprises, and legal educators."}
            </p>
          </div>

          <div className="pt-verticals-grid">
            {PARTNER_VERTICALS.map((v) => (
              <div key={v.id} className="pt-vertical-card">
                <div className="pt-card-top">
                  <span className="pt-vertical-icon">{v.icon}</span>
                  <span className="pt-vertical-badge">{isKn ? v.badgeKn : v.badgeEn}</span>
                </div>
                <h3 className="pt-vertical-title">{isKn ? v.titleKn : v.titleEn}</h3>
                <p className="pt-vertical-desc">{isKn ? v.descKn : v.descEn}</p>
                <div className="pt-perks-title">
                  {isKn ? "ಪ್ರಮುಖ ಸೌಲಭ್ಯಗಳು:" : "Key Institutional Perks:"}
                </div>
                <ul className="pt-perks-list">
                  {(isKn ? v.perksKn : v.perksEn).map((p, idx) => (
                    <li key={idx}>
                      <span className="pt-perk-check">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: Institutional Alliances Showcase */}
        <section className="pt-section pt-alliances-section">
          <div className="pt-section-header">
            <span className="pt-subheading">
              {isKn ? "ವಿಶ್ವಾಸಾರ್ಹ ಮೈತ್ರಿಕೂಟಗಳು" : "ESTABLISHED ALLIANCES"}
            </span>
            <h2 className="pt-section-title">
              {isKn ? "ನಮ್ಮ ಪ್ರಮುಖ ಸಾಂಸ್ಥಿಕ ಪಾಲುದಾರರು" : "Institutional Network & Alliances"}
            </h2>
            <p className="pt-section-desc">
              {isKn
                ? "ರಾಜ್ಯದ ಕಾನೂನು ಸಂಸ್ಥೆಗಳು, ಬಾರ್ ಕೌನ್ಸಿಲ್‌ಗಳು ಮತ್ತು ಪ್ರತಿಷ್ಠಿತ ಶೈಕ್ಷಣಿಕ ಸಂಸ್ಥೆಗಳೊಂದಿಗೆ ಸಕ್ರಿಯ ಬಾಂಧವ್ಯ."
                : "Proudly collaborating with regulatory councils, historic bar associations, and academic pioneers."}
            </p>
          </div>

          <div className="pt-alliances-grid">
            {ALLIANCE_BODIES.map((body) => (
              <div key={body.acronym} className="pt-alliance-card">
                <div className="pt-alliance-header">
                  <div className="pt-alliance-logo" style={{ background: body.color }}>
                    {body.acronym}
                  </div>
                  <div className="pt-alliance-meta">
                    <span className="pt-alliance-type">{body.type}</span>
                    <span className="pt-alliance-est">{body.established}</span>
                  </div>
                </div>
                <div className="pt-alliance-name">{isKn ? body.nameKn : body.nameEn}</div>
                <div className="pt-alliance-role">{isKn ? body.roleKn : body.roleEn}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Strategic Value & Benefits */}
        <section className="pt-section">
          <div className="pt-section-header">
            <span className="pt-subheading">
              {isKn ? "ಪಾಲುದಾರಿಕೆಯ ಅನುಕೂಲಗಳು" : "STRATEGIC VALUE"}
            </span>
            <h2 className="pt-section-title">
              {isKn ? "ನಮ್ಮೊಂದಿಗೆ ಪಾಲುದಾರಿಕೆ ಏಕೆ?" : "Why Partner With Advocates Hub?"}
            </h2>
            <p className="pt-section-desc">
              {isKn
                ? "ಪರಿಶೀಲಿತ ವಕೀಲರ ಜಾಲ ಮತ್ತು ಅತ್ಯಾಧುನಿಕ ತಂತ್ರಜ್ಞಾನದ ಸಮನ್ವಯದೊಂದಿಗೆ ಸಾಂಸ್ಥಿಕ ಶಕ್ತಿ."
                : "Engineered to deliver high accountability, frictionless technology, and measurable community legal impact."}
            </p>
          </div>

          <div className="pt-benefits-grid">
            {ALLIANCE_BENEFITS.map((b, idx) => (
              <div key={idx} className="pt-benefit-card">
                <div className="pt-benefit-icon-wrap">{b.icon}</div>
                <h4 className="pt-benefit-title">{isKn ? b.titleKn : b.titleEn}</h4>
                <p className="pt-benefit-desc">{isKn ? b.descKn : b.descEn}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Strategic Partnerships Desk (Executive Spotlight) */}
        <section className="pt-section pt-executive-section" id="pt-executive-desk">
          <div className="pt-section-header">
            <span className="pt-subheading">
              {isKn ? "ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಂಪರ್ಕ & ನಾಯಕತ್ವ" : "EXECUTIVE LIAISON & ALLIANCES"}
            </span>
            <h2 className="pt-section-title">
              {isKn ? "ಕಾರ್ಯತಂತ್ರದ ಪಾಲುದಾರಿಕೆ ವಿಭಾಗ" : "Strategic Partnerships & Bar Alliances Desk"}
            </h2>
            <p className="pt-section-desc">
              {isKn
                ? "ಬಾರ್ ಕೌನ್ಸಿಲ್‌ಗಳು, ಹೈಕೋರ್ಟ್ ಪೀಠಗಳು, ಕಾನೂನು ಸಂಸ್ಥೆಗಳು ಮತ್ತು ಕಾರ್ಪೊರೇಟ್ ಲೀಗಲ್ ವಿಭಾಗಗಳಿಗೆ ನೇರ ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಂಪರ್ಕ."
                : "Direct executive leadership connecting Bar Associations, State Councils, High Court Benches, Law Firms, and Enterprise Legal Departments."}
            </p>
          </div>

          <div className="pt-executive-card">
            {/* Left Column: Executive Identity, Role Mandate & Vision */}
            <div className="pt-exec-col-left">
              {/* Prestige Header Badge Bar */}
              <div className="pt-exec-badge-bar">
                <div className="pt-exec-badge-left">
                  <span className="pt-exec-badge-seal">⚖️</span>
                  <span className="pt-exec-badge-title">
                    {isKn
                      ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ • ಕಾರ್ಯತಂತ್ರದ ಪಾಲುದಾರಿಕೆ ವಿಭಾಗ"
                      : "ADVOCATES HUB • STRATEGIC PARTNERSHIPS DESK"}
                  </span>
                </div>
                <span className="pt-exec-active-chip">
                  🛡️ {isKn ? "ಪರಿಶೀಲಿತ ನಾಯಕತ್ವ" : "Verified Leadership"}
                </span>
              </div>

              {/* Executive Profile Avatar & Name */}
              <div className="pt-exec-profile-section">
                <div className="pt-exec-avatar-frame">
                  <img
                    src={sandeepImg}
                    alt="Sandeep Masaguppi"
                    className="pt-exec-photo"
                  />
                </div>

                <div className="pt-exec-identity">
                  <div className="pt-exec-meta">
                    <span className="pt-exec-loc">
                      📍 {isKn ? "ಬೆಂಗಳೂರು & ಗೋಕಾಕ, ಕರ್ನಾಟಕ" : "Bengaluru & Gokak, Karnataka"}
                    </span>
                  </div>
                  <h3 className="pt-exec-name">Sandeep Masaguppi</h3>
                  <div className="pt-exec-designation">
                    {isKn
                      ? "ಸಹ-ಸಂಸ್ಥಾಪಕರು & ಕಾರ್ಯತಂತ್ರದ ಪಾಲುದಾರಿಕೆಗಳ ಮುಖ್ಯಸ್ಥರು"
                      : "Co-Founder & Head of Strategic Partnerships"}
                  </div>
                  <div className="pt-exec-department">
                    {isKn ? "ಬಾರ್ ಒಕ್ಕೂಟಗಳು & ಪ್ರಾದೇಶಿಕ ವಿಸ್ತರಣೆ" : "Bar Alliances & Regional Expansion"}
                  </div>
                </div>
              </div>

              {/* Mandate & Focus Box */}
              <div className="pt-exec-work-box">
                <div className="pt-exec-work-label">
                  <span>💼</span> {isKn ? "ಪಾಲುದಾರಿಕೆ ಜವಾಬ್ದಾರಿ & ವ್ಯಾಪ್ತಿ" : "Partnership Mandate & Focus"}
                </div>
                <p className="pt-exec-work-text">
                  {isKn
                    ? "ಕರ್ನಾಟಕ ಹೈಕೋರ್ಟ್ ಮತ್ತು ಜಿಲ್ಲಾ ಬಾರ್ ಒಕ್ಕೂಟಗಳ ಸಹಭಾಗಿತ್ವ, ಸಾಂಸ್ಥಿಕ ಒಡಂಬಡಿಕೆಗಳು ಮತ್ತು 18+ ನಗರಗಳಲ್ಲಿ ಪರಿಶೀಲಿತ ವಕೀಲರ ಜಾಲದ ವಿಸ್ತರಣೆಯನ್ನು ನೇರವಾಗಿ ಮುನ್ನಡೆಸುತ್ತಾರೆ."
                    : "Directs High Court & District Bar alliances, institutional empanelment, and strategic partnerships, expanding verified legal access across 18+ Karnataka cities."}
                </p>
              </div>

              {/* Executive Quote */}
              <div className="pt-exec-quote-box">
                <span className="pt-exec-quote-mark">“</span>
                <p className="pt-exec-quote-text">
                  {isKn
                    ? "ಕಾನೂನು ಸೇವೆ ಕೇವಲ ಮಹಾನಗರಗಳಿಗೆ ಸೀಮಿತವಾಗಬಾರದು. ಕರ್ನಾಟಕದ ಪ್ರತಿಯೊಂದು ಜಿಲ್ಲೆ, ತಾಲೂಕುಗಳಿಗೂ ಅತ್ಯುನ್ನತ ವಕೀಲರನ್ನು ತಲುಪಿಸುವುದೇ ನಮ್ಮ ಗುರಿ."
                    : "Justice shouldn't stop at metro borders. We are taking verified advocates and premier legal technology to every district and taluk across Karnataka."}
                </p>
              </div>
            </div>

            {/* Right Column: Direct Executive Action Channels & Statutory Compliance */}
            <div className="pt-exec-col-right">
              <div className="pt-exec-actions-wrap">
                <h4 className="pt-exec-actions-heading">
                  <span>📞</span> {isKn ? "ನೇರ ಸಂಪರ್ಕ & ಅಧಿಕೃತ ಮಾರ್ಗಗಳು" : "Direct Channels & Executive Contact"}
                </h4>
                <p className="pt-exec-actions-sub">
                  {isKn
                    ? "ಸಾಂಸ್ಥಿಕ ಒಡಂಬಡಿಕೆ, ಎಂಪ್ಯಾನೆಲ್‌ಮೆಂಟ್ ಅಥವಾ ತಾಂತ್ರಿಕ ಸಹಯೋಗಕ್ಕಾಗಿ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ."
                    : "Connect directly with executive leadership for MoUs, firm empanelment, or institutional integration."}
                </p>

                <div className="pt-exec-channels-grid">
                  {/* Phone Call */}
                  <a href="tel:+919108717353" className="pt-exec-channel phone">
                    <div className="pt-channel-icon">📞</div>
                    <div className="pt-channel-info">
                      <span className="pt-channel-label">{isKn ? "ದೂರವಾಣಿ ಸಂಖ್ಯೆ" : "Direct Phone Line"}</span>
                      <strong className="pt-channel-val">+91 91087 17353</strong>
                      <span className="pt-channel-sub">
                        {isKn ? "ಸೋಮ–ಶನಿ, ಬೆಳಿಗ್ಗೆ 9 - ಸಂಜೆ 7:30" : "Mon–Sat, 9:00 AM – 7:30 PM IST"}
                      </span>
                    </div>
                    <span className="pt-channel-arrow">{isKn ? "ಕರೆ ಮಾಡಿ →" : "Call Now →"}</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/919108717353?text=Hello%20Sandeep%20Masaguppi,%20I%20am%20reaching%20out%20via%20Advocates%20Hub%20regarding%20an%20institutional%20partnership."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-exec-channel whatsapp"
                  >
                    <div className="pt-channel-icon">💬</div>
                    <div className="pt-channel-info">
                      <span className="pt-channel-label">{isKn ? "ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್" : "Official WhatsApp"}</span>
                      <strong className="pt-channel-val">+91 91087 17353</strong>
                      <span className="pt-channel-sub">
                        {isKn ? "ತ್ವರಿತ ಸಾಂಸ್ಥಿಕ ಚಾಟ್" : "Instant partnership inquiries"}
                      </span>
                    </div>
                    <span className="pt-channel-arrow">{isKn ? "ಸಂದೇಶ ಕಳುಹಿಸಿ →" : "Chat on WhatsApp →"}</span>
                  </a>

                  {/* Direct Executive Email */}
                  <a
                    href="mailto:sandeeprmasaguppi@gmail.com?subject=Strategic%20Partnership%20Inquiry%20-%20Advocates%20Hub"
                    className="pt-exec-channel email"
                  >
                    <div className="pt-channel-icon">✉️</div>
                    <div className="pt-channel-info">
                      <span className="pt-channel-label">{isKn ? "ನೇರ ಕಾರ್ಯನಿರ್ವಾಹಕ ಇಮೇಲ್" : "Direct Executive Email"}</span>
                      <strong className="pt-channel-val">sandeeprmasaguppi@gmail.com</strong>
                      <span className="pt-channel-sub">
                        {isKn ? "4 ಗಂಟೆಗಳಲ್ಲಿ ಪರಿಶೀಲನೆ" : "Reviewed within 4 business hours"}
                      </span>
                    </div>
                    <span className="pt-channel-arrow">{isKn ? "ಇಮೇಲ್ ಕಳುಹಿಸಿ →" : "Send Email →"}</span>
                  </a>

                  {/* Company Official Email */}
                  <a
                    href="mailto:advocatehub.in@gmail.com?subject=Strategic%20Partnership%20Inquiry%20-%20Advocates%20Hub"
                    className="pt-exec-channel email"
                  >
                    <div className="pt-channel-icon">📫</div>
                    <div className="pt-channel-info">
                      <span className="pt-channel-label">{isKn ? "ಕಂಪನಿ ಅಧಿಕೃತ ಇಮೇಲ್" : "Official Company Email"}</span>
                      <strong className="pt-channel-val">advocatehub.in@gmail.com</strong>
                      <span className="pt-channel-sub">
                        {isKn ? "ಸಾಂಸ್ಥಿಕ ಡೆಸ್ಕ್ ಇನ್‌ಬಾಕ್ಸ್" : "Institutional Desk Inbox"}
                      </span>
                    </div>
                    <span className="pt-channel-arrow">{isKn ? "ಇಮೇಲ್ ಕಳುಹಿಸಿ →" : "Send Email →"}</span>
                  </a>

                  {/* Official Instagram */}
                  <a
                    href="https://www.instagram.com/advocate__hub/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-exec-channel instagram"
                  >
                    <div className="pt-channel-icon">📸</div>
                    <div className="pt-channel-info">
                      <span className="pt-channel-label">{isKn ? "ಅಧಿಕೃತ ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್" : "Official Instagram"}</span>
                      <strong className="pt-channel-val">@advocate__hub</strong>
                      <span className="pt-channel-sub">
                        {isKn ? "ಅಧಿಕೃತ ಅಪ್‌ಡೇಟ್‌ಗಳು ಮತ್ತು ಪ್ರಕಟಣೆಗಳು" : "Official updates & bar network news"}
                      </span>
                    </div>
                    <span className="pt-channel-arrow">{isKn ? "ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್ ನೋಡಿ →" : "Follow on IG →"}</span>
                  </a>

                  {/* Location / Chambers */}
                  <a
                    href="https://maps.google.com/?q=Bengaluru,Karnataka,India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-exec-channel office"
                  >
                    <div className="pt-channel-icon">📍</div>
                    <div className="pt-channel-info">
                      <span className="pt-channel-label">{isKn ? "ಪ್ರಧಾನ ಕಚೇರಿ" : "Executive Chambers"}</span>
                      <strong className="pt-channel-val">Bengaluru & Gokak, Karnataka</strong>
                      <span className="pt-channel-sub">
                        {isKn ? "ಹೈಕೋರ್ಟ್ & ಜಿಲ್ಲಾ ಬಾರ್ ಸಂಪರ್ಕ" : "High Court & District Bar Liaison"}
                      </span>
                    </div>
                    <span className="pt-channel-arrow">{isKn ? "ವಿಳಾಸ ವಿವರ →" : "View on Map →"}</span>
                  </a>
                </div>
              </div>

              {/* Statutory Privilege Guarantee */}
              <div className="pt-exec-trust-footer">
                <span className="pt-trust-shield">🛡️</span>
                <span className="pt-trust-text">
                  {isKn
                    ? "1961ರ ವಕೀಲರ ಕಾಯ್ದೆ, ಬಾರ್ ಕೌನ್ಸಿಲ್ ಆಫ್ ಇಂಡಿಯಾ ನೈತಿಕ ಮಾನದಂಡಗಳು ಮತ್ತು ಶಾಸನಬದ್ಧ ವಕೀಲ-ಕ್ಲೈಂಟ್ ಗೌಪ್ಯತೆಯಿಂದ ಕಟ್ಟುನಿಟ್ಟಾಗಿ ರಕ್ಷಿಸಲ್ಪಟ್ಟಿದೆ."
                    : "Strictly bound by the Advocates Act, 1961, Bar Council of India standards, and statutory Attorney-Client Privilege."}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Official Application (Proposal Form + Advocate Onboarding) */}
        <section className="pt-section" id="pt-proposal-form">
          <div className="pt-section-header">
            <span className="pt-subheading">
              {isKn ? "ಅರ್ಜಿ ನಮೂನೆ" : "OFFICIAL APPLICATION"}
            </span>
            <h2 className="pt-section-title">
              {isKn ? "ಸಾಂಸ್ಥಿಕ ಪಾಲುದಾರಿಕೆಗೆ ಪ್ರಸ್ತಾವನೆ ಸಲ್ಲಿಸಿ" : "Submit Partnership Proposal"}
            </h2>
            <p className="pt-section-desc">
              {isKn
                ? "ನಿಮ್ಮ ಸಂಸ್ಥೆಯ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ. ನಮ್ಮ ಕಾರ್ಯನಿರ್ವಾಹಕ ತಂಡವು 4 ರಿಂದ 24 ಗಂಟೆಗಳಲ್ಲಿ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ."
                : "Complete the inquiry form below to initiate an institutional alliance. All submissions are assigned an executive case manager."}
            </p>
          </div>

          <div className="pt-split-container">
            {/* Left Column: Interactive Form */}
            <div className="pt-form-card">
              <div className="pt-form-header">
                <span className="pt-form-badge">
                  {isKn ? "ಅರ್ಜಿ ನಮೂನೆ" : "OFFICIAL APPLICATION"}
                </span>
                <h3 className="pt-form-main-title">
                  {isKn ? "ಸಾಂಸ್ಥಿಕ ವಿವರಗಳು" : "Institutional Application Form"}
                </h3>
                <p className="pt-form-sub-text">
                  {isKn
                    ? "ಅಗತ್ಯವಿರುವ ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ ಪ್ರಸ್ತಾವನೆಯನ್ನು ಸಲ್ಲಿಸಿ."
                    : "Fill in your organization details below to register your partnership proposal."}
                </p>
              </div>

              {sentData ? (
                <div className="pt-success-box">
                  <div className="pt-success-icon">✅</div>
                  <h4 className="pt-success-title">
                    {isKn ? "ಪ್ರಸ್ತಾವನೆ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!" : "Proposal Successfully Submitted!"}
                  </h4>
                  <div className="pt-success-ref">
                    <span>{isKn ? "ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ:" : "Reference ID:"}</span>
                    <strong>{sentData.refId}</strong>
                  </div>
                  <p className="pt-success-msg">
                    {isKn
                      ? `ಧನ್ಯವಾದಗಳು. ${sentData.orgName} ಸಂಸ್ಥೆಯ ಪರವಾಗಿ ${sentData.contactName} ಅವರ ಪ್ರಸ್ತಾವನೆಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನಮ್ಮ ಪಾಲುದಾರಿಕೆ ವಿಭಾಗವು ${sentData.email} ಮೂಲಕ ಶೀಘ್ರದಲ್ಲಿಯೇ ಉತ್ತರಿಸುತ್ತದೆ.`
                      : `Thank you for your proposal for ${sentData.orgName}. Our executive alliances desk will review your details and reach out to ${sentData.contactName} at ${sentData.email} within 4 business hours.`}
                  </p>
                  <div className="pt-success-actions">
                    <a
                      href={`https://wa.me/919108717353?text=Hello%20Advocates%20Hub%20Partnerships,%20we%20have%20submitted%20Proposal%20Reference%20${sentData.refId}%20for%20${encodeURIComponent(
                        sentData.orgName
                      )}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pt-btn-whatsapp"
                    >
                      <span>💬 {isKn ? "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ತಕ್ಷಣ ಚರ್ಚಿಸಿ" : "Connect on WhatsApp Now"}</span>
                    </a>
                    <button
                      type="button"
                      className="pt-btn-secondary"
                      onClick={() => setSentData(null)}
                    >
                      {isKn ? "ಮತ್ತೊಂದು ಪ್ರಸ್ತಾವನೆ ಸಲ್ಲಿಸಿ" : "Submit Another Proposal"}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="pt-form-inner">
                  {/* Organization Name */}
                  <div className="pt-field-group">
                    <label className="pt-label">
                      {isKn ? "ಸಂಸ್ಥೆ / ಚೇಂಬರ್ ಹೆಸರು *" : "Organization / Law Firm Name *"}
                    </label>
                    <input
                      type="text"
                      className={`pt-input ${err.orgName ? "pt-input-err" : ""}`}
                      placeholder={isKn ? "ಉದಾ: ಮೈಸೂರು ಬಾರ್ ಅಸೋಸಿಯೇಷನ್" : "e.g., Lex Veritas Law Chambers"}
                      value={form.orgName}
                      onChange={(e) => setF("orgName", e.target.value)}
                      disabled={sending}
                      autoComplete="organization"
                    />
                    {err.orgName && <div className="pt-err-text">⚠ {err.orgName}</div>}
                  </div>

                  {/* Representative Name & Phone */}
                  <div className="pt-grid-2">
                    <div className="pt-field-group">
                      <label className="pt-label">
                        {isKn ? "ಅಧಿಕೃತ ಪ್ರತಿನಿಧಿ ಹೆಸರು *" : "Contact Person Name *"}
                      </label>
                      <input
                        type="text"
                        className={`pt-input ${err.contactName ? "pt-input-err" : ""}`}
                        placeholder={isKn ? "ಉದಾ: ರಮೇಶ್ ಕುಮಾರ್" : "e.g., Adv. Rajesh Hegde"}
                        value={form.contactName}
                        onChange={(e) => setF("contactName", e.target.value)}
                        disabled={sending}
                        autoComplete="name"
                      />
                      {err.contactName && <div className="pt-err-text">⚠ {err.contactName}</div>}
                    </div>

                    <div className="pt-field-group">
                      <label className="pt-label">
                        {isKn ? "ದೂರವಾಣಿ / ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ *" : "Official Phone / WhatsApp *"}
                      </label>
                      <input
                        type="tel"
                        inputMode="tel"
                        className={`pt-input ${err.phone ? "pt-input-err" : ""}`}
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setF("phone", e.target.value)}
                        disabled={sending}
                        autoComplete="tel"
                      />
                      {err.phone && <div className="pt-err-text">⚠ {err.phone}</div>}
                    </div>
                  </div>

                  {/* Email Address & Location */}
                  <div className="pt-grid-2">
                    <div className="pt-field-group">
                      <label className="pt-label">
                        {isKn ? "ಅಧಿಕೃತ ಇಮೇಲ್ ವಿಳಾಸ *" : "Official Work Email *"}
                      </label>
                      <input
                        type="email"
                        inputMode="email"
                        className={`pt-input ${err.email ? "pt-input-err" : ""}`}
                        placeholder="alliances@organization.in"
                        value={form.email}
                        onChange={(e) => setF("email", e.target.value)}
                        disabled={sending}
                        autoComplete="email"
                      />
                      {err.email && <div className="pt-err-text">⚠ {err.email}</div>}
                    </div>

                    <div className="pt-field-group">
                      <label className="pt-label">
                        {isKn ? "ಪ್ರಧಾನ ಕಚೇರಿ / ನಗರ *" : "City / District *" }
                      </label>
                      <input
                        type="text"
                        className={`pt-input ${err.city ? "pt-input-err" : ""}`}
                        placeholder={isKn ? "ಉದಾ: ಬೆಂಗಳೂರು / ಧಾರವಾಡ" : "e.g., Bengaluru, Karnataka"}
                        value={form.city}
                        onChange={(e) => setF("city", e.target.value)}
                        disabled={sending}
                        autoComplete="address-level2"
                      />
                      {err.city && <div className="pt-err-text">⚠ {err.city}</div>}
                    </div>
                  </div>

                  {/* Partnership Category & Team Size */}
                  <div className="pt-grid-2">
                    <div className="pt-field-group">
                      <label className="pt-label">
                        {isKn ? "ಪಾಲುದಾರಿಕೆ ವಿಭಾಗ *" : "Partnership Category *"}
                      </label>
                      <select
                        className={`pt-select ${err.type ? "pt-input-err" : ""}`}
                        value={form.type}
                        onChange={(e) => setF("type", e.target.value)}
                        disabled={sending}
                      >
                        <option value="">{isKn ? "ವಿಭಾಗವನ್ನು ಆರಿಸಿ…" : "Select category…"}</option>
                        <option value="Law Firm / Chamber">
                          {isKn ? "ಕಾನೂನು ಸಂಸ್ಥೆ / ಚೇಂಬರ್ (Law Firm)" : "Law Firm / Chamber"}
                        </option>
                        <option value="Bar Association / Council">
                          {isKn ? "ಬಾರ್ ಅಸೋಸಿಯೇಷನ್ / ಕೌನ್ಸಿಲ್ (Bar Body)" : "Bar Association / Council"}
                        </option>
                        <option value="Corporate / Enterprise">
                          {isKn ? "ಕಾರ್ಪೊರೇಟ್ / ಉದ್ಯಮ (Enterprise)" : "Corporate / Enterprise"}
                        </option>
                        <option value="University / Law School">
                          {isKn ? "ಕಾನೂನು ವಿಶ್ವವಿದ್ಯಾಲಯ (Academic)" : "University / Law School"}
                        </option>
                        <option value="LegalTech / API Partner">
                          {isKn ? "ಲೀಗಲ್‌ಟೆಕ್ / ಸಾಫ್ಟ್‌ವೇರ್ ಎಪಿಐ" : "LegalTech / API Partner"}
                        </option>
                        <option value="NGO / Legal Aid Society">
                          {isKn ? "ಎನ್‌ಜಿಒ / ಉಚಿತ ಕಾನೂನು ನೆರವು" : "NGO / Legal Aid Society"}
                        </option>
                        <option value="Other Institutional">
                          {isKn ? "ಇತರ ಸಾಂಸ್ಥಿಕ" : "Other Institutional"}
                        </option>
                      </select>
                      {err.type && <div className="pt-err-text">⚠ {err.type}</div>}
                    </div>

                    <div className="pt-field-group">
                      <label className="pt-label">
                        {isKn ? "ವಕೀಲರ ಅಥವಾ ತಂಡದ ಸಂಖ್ಯೆ" : "Advocate Roster / Team Size"}
                      </label>
                      <select
                        className="pt-select"
                        value={form.rosterSize}
                        onChange={(e) => setF("rosterSize", e.target.value)}
                        disabled={sending}
                      >
                        <option value="">{isKn ? "ಆಯ್ಕೆಮಾಡಿ (ಐಚ್ಛಿಕ)" : "Select size (optional)"}</option>
                        <option value="1-10 Advocates">1 – 10 Advocates</option>
                        <option value="11-50 Advocates">11 – 50 Advocates</option>
                        <option value="51-200 Advocates">51 – 200 Advocates</option>
                        <option value="200+ Advocates">200+ Advocates / Members</option>
                      </select>
                    </div>
                  </div>

                  {/* Collaboration Scope / Message */}
                  <div className="pt-field-group">
                    <label className="pt-label">
                      {isKn ? "ಸಹಯೋಗದ ವಿವರಗಳು & ಉದ್ದೇಶ" : "Proposed Collaboration Scope & Objectives"}
                    </label>
                    <textarea
                      rows={4}
                      className="pt-textarea"
                      placeholder={
                        isKn
                          ? "ನಿಮ್ಮ ಸಹಯೋಗದ ನಿರೀಕ್ಷೆಗಳು, ವ್ಯಾಪ್ತಿ ಅಥವಾ ವಿಶೇಷ ಅಗತ್ಯತೆಗಳನ್ನು ನಮೂದಿಸಿ…"
                          : "Briefly outline your alliance objectives, practice focus, integration goals, or specific institutional requirements…"
                      }
                      value={form.message}
                      onChange={(e) => setF("message", e.target.value)}
                      disabled={sending}
                    />
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="pt-btn-primary pt-btn-full" disabled={sending}>
                    {sending ? (
                      <span className="pt-btn-loader">
                        <span className="pt-spinner" />
                        <span>{isKn ? "ಪ್ರಸ್ತಾವನೆ ಸಲ್ಲಿಕೆಯಾಗುತ್ತಿದೆ…" : "Submitting Proposal…"}</span>
                      </span>
                    ) : (
                      <span>{isKn ? "ಪ್ರಸ್ತಾವನೆ ಸಲ್ಲಿಸಿ →" : "Submit Partnership Proposal →"}</span>
                    )}
                  </button>

                  <div className="pt-form-privacy-note">
                    🔒{" "}
                    {isKn
                      ? "ಎಲ್ಲಾ ಪ್ರಸ್ತಾವನೆಗಳನ್ನು ಭಾರತೀಯ ಸಾಕ್ಷ್ಯ ಕಾಯ್ದೆಯನ್ವಯ ಕಟ್ಟುನಿಟ್ಟಾದ ಗೌಪ್ಯತೆಯಲ್ಲಿ ಇರಿಸಲಾಗುತ್ತದೆ."
                      : "All submissions are confidential, encrypted, and governed by non-disclosure legal standards."}
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Individual Advocate & SLA Info */}
            <div className="pt-sidebar-column">
              {/* Individual Advocate Callout Box */}
              <div className="pt-individual-card">
                <div className="pt-indiv-icon">⚖️</div>
                <h4 className="pt-indiv-title">
                  {isKn ? "ನೀವು ವೈಯಕ್ತಿಕ ವಕೀಲರೇ?" : "Are You An Individual Practicing Advocate?"}
                </h4>
                <p className="pt-indiv-desc">
                  {isKn
                    ? "ನೀವು ವೈಯಕ್ತಿಕವಾಗಿ ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ಗೆ ಸೇರಲು ಬಯಸಿದರೆ, ನೇರವಾಗಿ ಉಚಿತ ವಕೀಲರ ನೋಂದಣಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ."
                    : "Individual advocates looking to verify credentials and receive direct client consultations can sign up individually for free."}
                </p>
                <Link to="/signup" className="pt-btn-outline">
                  {isKn ? "ವಕೀಲರ ನೋಂದಣಿ (ಉಚಿತ) →" : "Advocate Free Registration →"}
                </Link>
              </div>

              {/* Statutory Guarantee Badge */}
              <div className="pt-compliance-badge">
                <div className="pt-comp-shield">🛡️</div>
                <div className="pt-comp-text">
                  <strong>
                    {isKn ? "ಶಾಸನಬದ್ಧ ಅನುಸರಣೆ ಖಾತರಿ" : "Statutory Bar Council Compliance"}
                  </strong>
                  <p>
                    {isKn
                      ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ 1961ರ ವಕೀಲರ ಕಾಯ್ದೆ ಮತ್ತು ಬಾರ್ ಕೌನ್ಸಿಲ್ ಆಫ್ ಇಂಡಿಯಾ ನಿಬಂಧನೆಗಳಿಗೆ ಸಂಪೂರ್ಣವಾಗಿ ಬದ್ಧವಾಗಿದೆ."
                      : "Strictly aligned with Rule 36 of Bar Council of India Rules and Section 35 of the Advocates Act, 1961."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Institutional FAQ Accordion */}
        <section className="pt-section pt-faq-section">
          <div className="pt-section-header">
            <span className="pt-subheading">
              {isKn ? "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು" : "COMMON INQUIRIES"}
            </span>
            <h2 className="pt-section-title">
              {isKn ? "ಪಾಲುದಾರಿಕೆ ಕುರಿತು ಪ್ರಶ್ನೋತ್ತರಗಳು" : "Frequently Asked Questions"}
            </h2>
            <p className="pt-section-desc">
              {isKn
                ? "ಸಾಂಸ್ಥಿಕ ಒಡಂಬಡಿಕೆಗಳು, ಶುಲ್ಕ, ಎಪಿಐ ಮತ್ತು ಬಾರ್ ಕೌನ್ಸಿಲ್ ಅನುಸರಣೆ ಕುರಿತ ಸ್ಪಷ್ಟ ಮಾಹಿತಿ."
                : "Clear details regarding our onboarding timeline, governance, technology APIs, and regulatory compliance."}
            </p>
          </div>

          <div className="pt-faq-list">
            {PARTNER_FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`pt-faq-item ${isOpen ? "pt-faq-item-open" : ""}`}
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                >
                  <button
                    type="button"
                    className="pt-faq-question"
                    aria-expanded={isOpen}
                  >
                    <span>{isKn ? faq.qKn : faq.qEn}</span>
                    <span className="pt-faq-arrow">{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && (
                    <div className="pt-faq-answer">
                      <p>{isKn ? faq.aKn : faq.aEn}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}