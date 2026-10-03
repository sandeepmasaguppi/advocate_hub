// ============================================================
//   AboutUs.js — Advocates Hub Executive Leadership & About Portal
//   Designed for World-Class Corporate LegalTech Excellence
//   Features:
//     • Bilingual English / Kannada Real-Time Synchronization
//     • Dynamic Theme Management (Dark & Light)
//     • THE FULL SHOW: Expansive Executive Dossier Modal (960px)
//     • Executive Identity, Full Bio, Key Initiatives & Direct Connect
//     • Impact Metrics & Institutional Infrastructure
//     • Interactive Journey / Milestones Timeline
//     • Institutional Compliance FAQ Accordion & Action Triggers
// ============================================================

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Aboutus.css";
import chetanImg from "../images/chetan.png";
import sandeepImg from "../images/sandeep.jpeg";
import { getTheme } from "../data/themeStore";

// ── Impact Statistics ──
const STATS = [
  {
    icon: "⚖️",
    value: "50+",
    labelEn: "Verified Advocates",
    labelKn: "ಪರಿಶೀಲಿತ ವಕೀಲರು",
    descEn: "State Bar Council Enrolled Practitioners",
    descKn: "ಕರ್ನಾಟಕ ಬಾರ್ ಕೌನ್ಸಿಲ್ ಮಾನ್ಯತೆ ಪಡೆದವರು"
  },
  {
    icon: "🏛️",
    value: "18+",
    labelEn: "Judicial Districts",
    labelKn: "ನ್ಯಾಯಾಂಗ ಜಿಲ್ಲೆಗಳು",
    descEn: "High Court Benches & District Courts",
    descKn: "ಹೈಕೋರ್ಟ್ ಪೀಠಗಳು ಮತ್ತು ಜಿಲ್ಲಾ ನ್ಯಾಯಾಲಯಗಳು"
  },
  {
    icon: "📁",
    value: "5,000+",
    labelEn: "Legal Matters Handled",
    labelKn: "ಪರಿಹರಿಸಲಾದ ಕಾನೂನು ವಿಷಯಗಳು",
    descEn: "Civil, Criminal, Property & Corporate",
    descKn: "ಸಿವಿಲ್, ಕ್ರಿಮಿನಲ್, ಆಸ್ತಿ ಮತ್ತು ಕಾರ್ಪೊರೇಟ್"
  },
  {
    icon: "⭐",
    value: "4.9 / 5",
    labelEn: "Client Trust Rating",
    labelKn: "ಗ್ರಾಹಕರ ವಿಶ್ವಾಸಾರ್ಹತೆ ರೇಟಿಂಗ್",
    descEn: "Audited Client Reviews Across Karnataka",
    descKn: "ಕರ್ನಾಟಕದಾದ್ಯಂತ ಗ್ರಾಹಕರ ವಿಶ್ವಾಸಾರ್ಹ ವಿಮರ್ಶೆಗಳು"
  }
];

// ── Core Pillars of Excellence ──
const PILLARS = [
  {
    icon: "🛡️",
    titleEn: "100% Bar Council Verified Credentials",
    titleKn: "100% ಬಾರ್ ಕೌನ್ಸಿಲ್ ಪರಿಶೀಲಿತ ಪ್ರಮಾಣಪತ್ರಗಳು",
    descEn:
      "Every legal practitioner on Advocates Hub undergoes a rigorous 3-tier background verification process, checking active State Bar Council enrollment numbers, Certificate of Practice (COP), and courtroom standing before public listing.",
    descKn:
      "ನಮ್ಮ ವೇದಿಕೆಯಲ್ಲಿರುವ ಪ್ರತಿಯೊಬ್ಬ ವಕೀಲರ ಬಾರ್ ಕೌನ್ಸಿಲ್ ನೋಂದಣಿ ಸಂಖ್ಯೆ, ಪ್ರಾಕ್ಟಿಸ್ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ನ್ಯಾಯಾಲಯದ ಸಕ್ರಿಯ ಸೇವೆಯನ್ನು ಪರಿಶೀಲಿಸಿದ ನಂತರವೇ ಸಾರ್ವಜನಿಕ ಸಮಾಲೋಚನೆಗೆ ಅನುಮೋದಿಸಲಾಗುತ್ತದೆ."
  },
  {
    icon: "🌐",
    titleEn: "Bilingual Legal Accessibility (English & ಕನ್ನಡ)",
    titleKn: "ದ್ವಿಭಾಷಾ ಕಾನೂನು ಸೇವೆ (ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಕನ್ನಡ)",
    descEn:
      "Language must never be an impediment to justice. We offer seamless bilingual interfaces and connect citizens with senior advocates who practice fluently in both Kannada and English across High Courts and subordinate tribunals.",
    descKn:
      "ನ್ಯಾಯ ಪಡೆಯಲು ಭಾಷೆ ಎಂದಿಗೂ ತಡೆಯಾಗಬಾರದು. ಹೈಕೋರ್ಟ್ ಹಾಗೂ ಜಿಲ್ಲಾ ನ್ಯಾಯಾಲಯಗಳಲ್ಲಿ ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಎರಡರಲ್ಲೂ ನಿರರ್ಗಳವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಪರಿಣಿತ ವಕೀಲರನ್ನು ನಾವು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ."
  },
  {
    icon: "💎",
    titleEn: "Transparent, Upfront Fixed Fees",
    titleKn: "ಸ್ಪಷ್ಟ ಮತ್ತು ನಿಗದಿತ ಪಾರದರ್ಶಕ ಶುಲ್ಕ",
    descEn:
      "Eliminating the anxiety of hidden retainers and unexpected legal bills. Every consultation, document drafting task, and courtroom appearance has pre-determined, transparent pricing with instant digital invoicing.",
    descKn:
      "ಯಾವುದೇ ಅನಿರೀಕ್ಷಿತ ಅಥವಾ ಗುಪ್ತ ಶುಲ್ಕಗಳಿಲ್ಲ. ಸಮಾಲೋಚನೆ, ದಸ್ತಾವೇಜುಗಳ ರಚನೆ ಮತ್ತು ವಕಾಲತ್ತಿಗೆ ಮುಂಚಿತವಾಗಿಯೇ ನಿಖರ ಶುಲ್ಕದ ಸ್ಪಷ್ಟತೆ ಮತ್ತು ಡಿಜಿಟಲ್ ರಸೀದಿ ನೀಡಲಾಗುತ್ತದೆ."
  },
  {
    icon: "🔒",
    titleEn: "Absolute Attorney-Client Privilege",
    titleKn: "ಸಂಪೂರ್ಣ ವಕೀಲ-ಕ್ಲೈಂಟ್ ಕಾನೂನುಬದ್ಧ ಗೌಪ್ಯತೆ",
    descEn:
      "All consultations, case briefs, and draft documents are legally privileged under Section 126 of the Indian Evidence Act and Section 132 of the Bharatiya Sakshya Adhiniyam, secured with enterprise 256-bit encryption.",
    descKn:
      "ನಿಮ್ಮ ಪ್ರಕರಣದ ಎಲ್ಲಾ ವಿವರಗಳು, ದಸ್ತಾವೇಜುಗಳು ಮತ್ತು ಚರ್ಚೆಗಳು ಭಾರತೀಯ ಸಾಕ್ಷ್ಯ ಕಾಯ್ದೆಯ ಅನ್ವಯ ವಕೀಲ-ಕ್ಲೈಂಟ್ ಗೌಪ್ಯತೆಗೆ ಒಳಪಟ್ಟಿದ್ದು, ಬ್ಯಾಂಕಿಂಗ್ ದರ್ಜೆಯ 256-ಬಿಟ್ ಎನ್‌ಕ್ರಿಪ್ಶನ್‌ನೊಂದಿಗೆ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ."
  }
];

// ── Leadership Team Data (Clean, Client-Friendly Format) ──
const TEAM = [
  {
    id: "chetan",
    initials: "CC",
    name: "Chetan Chandaragi",
    designation: "Founder & Chief Executive Officer (CEO)",
    designationKn: "ಸಂಸ್ಥಾಪಕರು ಮತ್ತು ಮುಖ್ಯ ಕಾರ್ಯನಿರ್ವಾಹಕ ಅಧಿಕಾರಿ",
    department: "Executive Leadership & Tech Architecture",
    departmentKn: "ಕಾರ್ಯನಿರ್ವಾಹಕ ನಾಯಕತ್ವ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ",
    photo: chetanImg,
    color: "#2563eb",
    accent: "#3b82f6",
    email: "chetanchandaragi@gmail.com",
    phone: "8884393044",
    phoneDisplay: "+91 88843 93044",
    whatsapp: "918884393044",
    location: "Bengaluru & Hubballi-Dharwad, Karnataka",
    locationKn: "ಬೆಂಗಳೂರು ಮತ್ತು ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ, ಕರ್ನಾಟಕ",
    barCouncil: "Karnataka State Bar Council Liaison",
    barCouncilKn: "ಕರ್ನಾಟಕ ಬಾರ್ ಕೌನ್ಸಿಲ್ ಸಂಪರ್ಕ",
    education: "B.E. in Computer Science & Enterprise Systems Engineering",
    simpleRoleEn: "Pioneers platform technology, digital legal drafting tools, and the Indian criminal law converter.",
    simpleRoleKn: "ತಂತ್ರಜ್ಞಾನ ವಾಸ್ತುಶಿಲ್ಪ, ಆನ್‌ಲೈನ್ ಕಾನೂನು ದಸ್ತಾವೇಜುಗಳು ಮತ್ತು ಹೊಸ ಕ್ರಿಮಿನಲ್ ಕಾನೂನು ಪರಿವರ್ತಕದ ಮುಖ್ಯಸ್ಥರು.",
    quoteEn:
      "“Technology must serve justice, not complicate it. Our pledge is to make verified legal counsel accessible to every citizen without fear or hidden costs.”",
    quoteKn:
      "“ತಂತ್ರಜ್ಞಾನವು ನ್ಯಾಯವನ್ನು ಸುಲಭಗೊಳಿಸಬೇಕು. ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕರಿಗೂ ಪಾರದರ್ಶಕ, ಪರಿಶೀಲಿತ ಕಾನೂನು ನೆರವು ತಲುಪಿಸುವುದೇ ನಮ್ಮ ಸಂಕಲ್ಪ.”",
    bioEn:
      "Chetan Chandaragi is the visionary founder and Chief Executive Officer of Advocates Hub. With deep expertise at the intersection of enterprise software engineering, distributed systems, and Indian procedural legal frameworks, Chetan pioneered the platform's multi-layered digital architecture. He spearheaded the design of Advocates Hub's core legal pillars—encompassing verified advocate discovery, bilingual document generation, automated UPI payment infrastructure, and the landmark Criminal Law Converter (mapping IPC/CrPC to BNS/BNSS). Under his stewardship, Advocates Hub has scaled across 18+ judicial districts in Karnataka, building institutional trust with both litigants and Bar associations.",
    bioKn:
      "ಚೇತನ್ ಚಂದರಗಿ ಅವರು ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನ ಸಂಸ್ಥಾಪಕರು ಮತ್ತು ಸಿಇಒ ಆಗಿದ್ದಾರೆ. ಸಾಫ್ಟ್‌ವೇರ್ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಭಾರತೀಯ ಕಾನೂನು ವ್ಯವಸ್ಥೆಯ ಆಳವಾದ ಅನುಭವದೊಂದಿಗೆ, ಅವರು ಈ ವೇದಿಕೆಯನ್ನು ರೂಪಿಸಿದ್ದಾರೆ. ಪರಿಶೀಲಿತ ವಕೀಲರ ಜಾಲ, ದ್ವಿಭಾಷಾ ದಸ್ತಾವೇಜುಗಳ ರಚನೆ, ಯುಪಿಐ ಪಾವತಿ ವ್ಯವಸ್ಥೆ ಮತ್ತು ಹೊಸ ಕ್ರಿಮಿನಲ್ ಕಾನೂನುಗಳ ಪರಿವರ್ತಕವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಜಾರಿಗೆ ತಂದಿದ್ದಾರೆ.",
    expertise: [
      "LegalTech Architecture & AI Systems",
      "Strategic Growth & Enterprise Scale",
      "Litigant Data Privacy & Security Governance",
      "Statutory Mapping & Regulatory Frameworks",
      "Digital Courtroom Operations"
    ],
    milestones: [
      "Architected the 4-part legal intelligence framework (Ask Question, Legal Docs, Bare Acts, Legal News).",
      "Engineered automated UPI escrow & instant purchase receipt generation for legal services.",
      "Established data privacy protocols compliant with Section 126 Evidence Act & Section 132 BSA.",
      "Scaled the platform to support seamless bilingual (Kannada & English) workflows."
    ],
    keyPointsEn: [
      "Built the core 4-pillar legal infrastructure (Advocate Discovery, Legal Docs, Bare Acts, Legal News).",
      "Engineered the Indian Criminal Law Converter (IPC/CrPC to BNS/BNSS/BSA).",
      "Architected instant UPI digital payments with transparent billing and instant invoicing.",
      "Developed bilingual Kannada & English legal workflow support across 18+ districts."
    ],
    keyPointsKn: [
      "4 ಪ್ರಮುಖ ಕಾನೂನು ಸೇವೆಗಳನ್ನು (ವಕೀಲರ ಸಮಾಲೋಚನೆ, ದಸ್ತಾವೇಜು, ಬೇರ್ ಆಕ್ಟ್ಸ್, ಕಾನೂನು ಸುದ್ದಿ) ರೂಪಿಸಿದ್ದಾರೆ.",
      "ಹೊಸ ಕ್ರಿಮಿನಲ್ ಕಾನೂನುಗಳ (BNS/BNSS/BSA) ನೇರ ಪರಿವರ್ತಕವನ್ನು ನಿರ್ಮಿಸಿದ್ದಾರೆ.",
      "ತ್ವರಿತ ಯುಪಿಐ ಡಿಜಿಟಲ್ ಪಾವತಿ ಮತ್ತು ಪಾರದರ್ಶಕ ರಸೀದಿ ವ್ಯವಸ್ಥೆಯನ್ನು ಜಾರಿಗೆ ತಂದಿದ್ದಾರೆ.",
      "ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ದ್ವಿಭಾಷಾ ತಂತ್ರಜ್ಞಾನವನ್ನು 18+ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಅಭಿವೃದ್ಧಿಪಡಿಸಿದ್ದಾರೆ."
    ],
    memberships: "All India Legal Technology Alliance • Karnataka Tech Founders Forum"
  },
  {
    id: "vidhvath",
    initials: "VC",
    name: "Vidhvath Chandaragi",
    designation: "Co-Founder & Head of Legal Operations",
    designationKn: "ಸಹ-ಸಂಸ್ಥಾಪಕರು ಮತ್ತು ಕಾನೂನು ಕಾರ್ಯಾಚರಣೆ ಮುಖ್ಯಸ್ಥರು",
    department: "Legal Operations & Ethics Compliance",
    departmentKn: "ಕಾನೂನು ಕಾರ್ಯಾಚರಣೆ ಮತ್ತು ನೀತಿ ಸಂಹಿತೆ",
    photo: null,
    color: "#16a34a",
    accent: "#22c55e",
    email: "vidhwat@gmail.com",
    phone: "9346738291",
    phoneDisplay: "+91 93467 38291",
    whatsapp: "919346738291",
    location: "Bengaluru & Belagavi, Karnataka",
    locationKn: "ಬೆಂಗಳೂರು ಮತ್ತು ಬೆಳಗಾವಿ, ಕರ್ನಾಟಕ",
    barCouncil: "Advocates Act 1961 Compliance Desk",
    barCouncilKn: "ವಕೀಲರ ಕಾಯ್ದೆ 1961 ಅನುಸರಣಾ ವಿಭಾಗ",
    education: "B.A., LL.B. (Specialization in Constitutional & Corporate Compliance)",
    simpleRoleEn: "Oversees advocate credentials vetting, State Bar Council compliance, and client-lawyer confidentiality.",
    simpleRoleKn: "ವಕೀಲರ ಬಾರ್ ಕೌನ್ಸಿಲ್ ಪರಿಶೀಲನೆ, ನೈತಿಕತೆ ಮತ್ತು ಕ್ಲೈಂಟ್-ವಕೀಲರ ಗೌಪ್ಯತೆಯನ್ನು ಖಚಿತಪಡಿಸುತ್ತಾರೆ.",
    quoteEn:
      "“Integrity is the bedrock of the legal profession. Every advocate listed on Advocates Hub undergoes rigorous scrutiny to ensure authentic, honorable counsel.”",
    quoteKn:
      "“ವಕೀಲಿ ವೃತ್ತಿಗೆ ಪ್ರಾಮಾಣಿಕತೆಯೇ ಮೂಲಾಧಾರ. ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನಲ್ಲಿರುವ ಪ್ರತಿಯೊಬ್ಬ ವಕೀಲರ ದಾಖಲೆಗಳನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.”",
    bioEn:
      "Vidhvath Chandaragi directs legal operations, institutional ethics, and statutory compliance across Advocates Hub. He oversees the platform's multi-step manual verification protocol, ensuring that every advocate's State Bar Council enrollment, Certificate of Practice (COP), and good-standing records are authenticated before public consultation clearance. Vidhvath also leads dispute resolution workflows, practitioner quality assurance, and client grievance mechanisms, maintaining the platform's adherence to Bar Council of India guidelines and the Advocates Act, 1961.",
    bioKn:
      "ವಿಧ್ವತ್ ಚಂದರಗಿ ಅವರು ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನ ಕಾನೂನು ಕಾರ್ಯಾಚರಣೆ ಮತ್ತು ನೀತಿ ಸಂಹಿತೆ ವಿಭಾಗವನ್ನು ಮುನ್ನಡೆಸುತ್ತಿದ್ದಾರೆ. ಬಾರ್ ಕೌನ್ಸಿಲ್ ನೋಂದಣಿ ಸಂಖ್ಯೆ, ಪ್ರಾಕ್ಟಿಸ್ ಸರ್ಟಿಫಿಕೇಟ್ ಮತ್ತು ವಕೀಲರ ದಾಖಲೆಗಳ ಅಧಿಕೃತತೆಯನ್ನು ಪರಿಶೀಲಿಸುವ ವ್ಯವಸ್ಥೆಯನ್ನು ಇವರು ರೂಪಿಸಿದ್ದಾರೆ. ಕ್ಲೈಂಟ್ ಮತ್ತು ವಕೀಲರ ನಡುವಿನ ವೃತ್ತಿಪರ ನೈತಿಕತೆಯನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಲು ಬದ್ಧರಾಗಿದ್ದಾರೆ.",
    expertise: [
      "Bar Council Verification & Certification (State Bar of Karnataka)",
      "Advocates Act, 1961 & BCI Ethics Compliance",
      "Legal Practice Quality Assurance & Audit",
      "Dispute Escalation & Grievance Redressal",
      "Court Practice Standards & Chambers Operations"
    ],
    milestones: [
      "Designed the 3-tier advocate verification protocol vetting over 50+ senior advocates.",
      "Formulated the institutional attorney-client privilege guidelines under Section 132 BSA.",
      "Created the client feedback monitoring and quality assurance framework.",
      "Established standard operating procedures for dispute mediation and legal audits."
    ],
    keyPointsEn: [
      "Created the 3-tier advocate verification protocol vetting 50+ senior advocates.",
      "Enforces Bar Council of India guidelines and statutory attorney-client privilege.",
      "Manages client dispute escalation and transparent consultation quality.",
      "Established standard operating procedures for dispute mediation and legal audits."
    ],
    keyPointsKn: [
      "50+ ಹಿರಿಯ ವಕೀಲರನ್ನು ಪರಿಶೀಲಿಸುವ 3 ಹಂತದ ನೀತಿಯನ್ನು ರೂಪಿಸಿದ್ದಾರೆ.",
      "ಬಾರ್ ಕೌನ್ಸಿಲ್ ನಿಯಮಗಳು ಮತ್ತು ವಕೀಲ-ಕ್ಲೈಂಟ್ ಗೌಪ್ಯತೆಯನ್ನು ಖಾತರಿಪಡಿಸುತ್ತಾರೆ.",
      "ಕ್ಲೈಂಟ್ ಸಮಸ್ಯೆಗಳ ಪರಿಹಾರ ಮತ್ತು ಗುಣಮಟ್ಟದ ಸಮಾಲೋಚನೆಯನ್ನು ನಿರ್ವಹಿಸುತ್ತಾರೆ.",
      "ಕಾನೂನು ಪರಿಶೀಲನೆಗೆ ಪ್ರಮಾಣಿತ ಕಾರ್ಯಾಚರಣಾ ವಿಧಾನಗಳನ್ನು ರೂಪಿಸಿದ್ದಾರೆ."
    ],
    memberships: "Karnataka Bar Association Liaison • Legal Ethics & Compliance Society"
  },
  {
    id: "sandeep",
    initials: "SM",
    name: "Sandeep Masaguppi",
    designation: "Co-Founder & Head of Strategic Partnerships",
    designationKn: "ಸಹ-ಸಂಸ್ಥಾಪಕರು ಮತ್ತು ಕಾರ್ಯತಂತ್ರದ ಪಾಲುದಾರಿಕೆಗಳ ಮುಖ್ಯಸ್ಥರು",
    department: "Bar Alliances & Regional Expansion",
    departmentKn: "ಬಾರ್ ಒಕ್ಕೂಟಗಳು ಮತ್ತು ಪ್ರಾದೇಶಿಕ ವಿಸ್ತರಣೆ",
    photo: sandeepImg,
    color: "#7c3aed",
    accent: "#a855f7",
    email: "sandeeprmasaguppi@gmail.com",
    phone: "9108717353",
    phoneDisplay: "+91 91087 17353",
    whatsapp: "919108717353",
    location: "Bengaluru & Gokak, Karnataka",
    locationKn: "ಬೆಂಗಳೂರು ಮತ್ತು ಗೋಕಾಕ, ಕರ್ನಾಟಕ",
    barCouncil: "High Court & District Bar Association Relations",
    barCouncilKn: "ಹೈಕೋರ್ಟ್ ಮತ್ತು ಜಿಲ್ಲಾ ಬಾರ್ ಅಸೋಸಿಯೇಷನ್ ಸಂಪರ್ಕ",
    education: "Leadership & Enterprise Alliances • Utthunga Technologies Corporate Alum",
    simpleRoleEn: "Leads High Court and district Bar alliances, expanding verified legal access across 18+ Karnataka cities.",
    simpleRoleKn: "ಹೈಕೋರ್ಟ್ ಮತ್ತು ಜಿಲ್ಲಾ ಬಾರ್ ಒಕ್ಕೂಟಗಳ ಸಹಭಾಗಿತ್ವ, 18+ ನಗರಗಳಿಗೆ ವಿಸ್ತರಣೆ ಮತ್ತು ಕ್ಲೈಂಟ್ ನೆರವು ಮುನ್ನಡೆಸುತ್ತಾರೆ.",
    quoteEn:
      "“Justice shouldn't stop at metro borders. We are taking verified advocates and premier legal technology to every district and taluk across Karnataka.”",
    quoteKn:
      "“ಕಾನೂನು ಸೇವೆ ಕೇವಲ ಮಹಾನಗರಗಳಿಗೆ ಸೀಮಿತವಾಗಬಾರದು. ಕರ್ನಾಟಕದ ಪ್ರತಿಯೊಂದು ಜಿಲ್ಲೆ, ತಾಲೂಕುಗಳಿಗೂ ಅತ್ಯುನ್ನತ ವಕೀಲರನ್ನು ತಲುಪಿಸುವುದೇ ನಮ್ಮ ಗುರಿ.”",
    bioEn:
      "Sandeep Masaguppi heads strategic partnerships, Bar association alliances, and regional expansion at Advocates Hub. Recognized for his leadership in building collaborative networks across the High Court of Karnataka (Principal Bench Bengaluru, Dharwad, and Kalaburagi) and district court associations, Sandeep has been the driving force behind expanding the platform's footprint into 18+ cities. He is a passionate champion of bilingual accessibility, ensuring that litigants in North and South Karnataka can consult senior advocates in Kannada with absolute confidence and fixed fees.",
    bioKn:
      "ಸಂದೀಪ್ ಮಸಗುಪ್ಪಿ ಅವರು ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನ ಕಾರ್ಯತಂತ್ರದ ಪಾಲುದಾರಿಕೆಗಳು ಮತ್ತು ವಿಸ್ತರಣೆಯ ಮುಖ್ಯಸ್ಥರಾಗಿದ್ದಾರೆ. ಕರ್ನಾಟಕ ಹೈಕೋರ್ಟ್ (ಬೆಂಗಳೂರು, ಧಾರವಾಡ, ಕಲಬುರಗಿ ಪೀಠಗಳು) ಮತ್ತು ಜಿಲ್ಲಾ ಬಾರ್ ಅಸೋಸಿಯೇಷನ್‌ಗಳೊಂದಿಗೆ ನಿಕಟ ಸಂಪರ್ಕ ಹೊಂದಿದ್ದು, 18ಕ್ಕೂ ಹೆಚ್ಚು ನಗರಗಳಿಗೆ ಜಾಲವನ್ನು ವಿಸ್ತರಿಸಿದ್ದಾರೆ. ಕನ್ನಡದಲ್ಲಿ ಸುಲಭವಾಗಿ ಕಾನೂನು ಸಲಹೆ ದೊರಕುವಂತೆ ಮಾಡುವಲ್ಲಿ ಪ್ರಮುಖ ಪಾತ್ರ ವಹಿಸಿದ್ದಾರೆ.",
    expertise: [
      "High Court & District Bar Association Alliances",
      "Regional Expansion (Karnataka Tier-2 & Tier-3 Hubs)",
      "Advocate Community Engagement & Practice Growth",
      "Grassroots Legal Literacy & Litigant Advocacy",
      "Corporate & Institutional Legal Partnerships"
    ],
    milestones: [
      "Expanded Advocates Hub's active advocate footprint across 18+ Karnataka cities and districts.",
      "Championed the full-scale Kannada bilingual interface and regional legal access campaigns.",
      "Built strategic tie-ups with leading law chambers, real-estate firms, and startup incubators.",
      "Spearheaded direct legal consultation drives for citizen property and civil disputes."
    ],
    keyPointsEn: [
      "Expanded Advocates Hub's active advocate footprint across 18+ Karnataka cities and districts.",
      "Spearheaded regional outreach ensuring accessible legal counsel in North and South Karnataka.",
      "Built strategic tie-ups with leading law chambers, real-estate firms, and startup incubators.",
      "Spearheaded direct legal consultation drives for citizen property and civil disputes."
    ],
    keyPointsKn: [
      "ಕರ್ನಾಟಕದ 18ಕ್ಕೂ ಹೆಚ್ಚು ನಗರ ಮತ್ತು ಜಿಲ್ಲೆಗಳಿಗೆ ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ ಜಾಲವನ್ನು ವಿಸ್ತರಿಸಿದ್ದಾರೆ.",
      "ಉತ್ತರ ಮತ್ತು ದಕ್ಷಿಣ ಕರ್ನಾಟಕದಾದ್ಯಂತ ಸುಲಭವಾಗಿ ಕಾನೂನು ಸಲಹೆ ದೊರಕುವಂತೆ ಮಾಡಿದ್ದಾರೆ.",
      "ಪ್ರಮುಖ ಕಾನೂನು ಕಚೇರಿಗಳು ಮತ್ತು ಸಂಸ್ಥೆಗಳೊಂದಿಗೆ ಕಾರ್ಯತಂತ್ರದ ಸಹಭಾಗಿತ್ವ ಸ್ಥಾಪಿಸಿದ್ದಾರೆ.",
      "ಆಸ್ತಿ ಮತ್ತು ಸಿವಿಲ್ ವಿವಾದಗಳ ಪರಿಹಾರಕ್ಕೆ ನೇರ ಕ್ಲೈಂಟ್ ಕಾನೂನು ನೆರವು ಶಿಬಿರಗಳನ್ನು ಮುನ್ನಡೆಸಿದ್ದಾರೆ."
    ],
    memberships: "High Court Bar Association Liaison Network • Karnataka Rural Legal Aid Forum"
  }
];

// ── Journey Milestones (Client-Friendly 3-Step Visual Roadmap) ──
const MILESTONES = [
  {
    step: "01",
    year: "2024",
    statusEn: "Completed & Verified",
    statusKn: "ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ",
    statusType: "completed",
    icon: "🏛️",
    titleEn: "Platform Launch & Advocate Verification",
    titleKn: "ವೇದಿಕೆ ಪ್ರಾರಂಭ ಮತ್ತು ವಕೀಲರ ಪರಿಶೀಲನೆ",
    taglineEn: "Founded in Karnataka with our signature 3-tier advocate credential verification protocol.",
    taglineKn: "ಕರ್ನಾಟಕದಲ್ಲಿ 3 ಹಂತದ ಕಟ್ಟುನಿಟ್ಟಿನ ವಕೀಲರ ಪರಿಶೀಲನಾ ವ್ಯವಸ್ಥೆಯೊಂದಿಗೆ ಆರಂಭ.",
    highlightsEn: [
      "50+ State Bar Council Verified Senior Advocates",
      "Seamless English & Kannada Bilingual Support",
      "Transparent, Upfront Fixed Consultation Fees"
    ],
    highlightsKn: [
      "50+ ಬಾರ್ ಕೌನ್ಸಿಲ್ ಮಾನ್ಯತೆ ಪಡೆದ ಹಿರಿಯ ವಕೀಲರು",
      "ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ದ್ವಿಭಾಷಾ ಬೆಂಬಲ",
      "ಪಾರದರ್ಶಕ ಹಾಗೂ ಮುಂಗಡ ನಿಗದಿತ ಶುಲ್ಕ ವ್ಯವಸ್ಥೆ"
    ]
  },
  {
    step: "02",
    year: "2025",
    statusEn: "Active & Scaling",
    statusKn: "ಪ್ರಸ್ತುತ ಸಕ್ರಿಯವಾಗಿದೆ",
    statusType: "active",
    icon: "⚡",
    titleEn: "18+ Districts & Online Legal Drafting",
    titleKn: "18+ ಜಿಲ್ಲೆಗಳಿಗೆ ವಿಸ್ತರಣೆ ಮತ್ತು ದಸ್ತಾವೇಜು ಸೇವೆ",
    taglineEn: "Expanded coverage across 18+ Karnataka cities with instant digital legal document drafting.",
    taglineKn: "ರಾಜ್ಯದ 18ಕ್ಕೂ ಹೆಚ್ಚು ಜಿಲ್ಲೆಗಳಿಗೆ ವಿಸ್ತರಣೆ ಮತ್ತು ಆನ್‌ಲೈನ್ ದಸ್ತಾವೇಜು ಸೇವೆ.",
    highlightsEn: [
      "18+ Karnataka Judicial Districts Covered",
      "Instant Rental Agreements, NDAs & Affidavits",
      "Direct UPI Payments & Instant Invoicing"
    ],
    highlightsKn: [
      "ಕರ್ನಾಟಕದ 18+ ನ್ಯಾಯಾಂಗ ಜಿಲ್ಲೆಗಳ ಸಂಪರ್ಕ",
      "ಬಾಡಿಗೆ ಒಪ್ಪಂದ, ಪ್ರಮಾಣಪತ್ರಗಳ ತ್ವರಿತ ರಚನೆ",
      "ನೇರ ಯುಪಿಐ ಪಾವತಿ ಮತ್ತು ಡಿಜಿಟಲ್ ರಸೀದಿ"
    ]
  },
  {
    step: "03",
    year: "2026",
    statusEn: "Current Innovation",
    statusKn: "ನವೀನ ತಂತ್ರಜ್ಞಾನ",
    statusType: "current",
    icon: "🚀",
    titleEn: "New Criminal Laws & Live Consultations",
    titleKn: "ಹೊಸ ಕ್ರಿಮಿನಲ್ ಕಾನೂನುಗಳು ಮತ್ತು ನೇರ ಸಮಾಲೋಚನೆ",
    taglineEn: "Integrated IPC to BNS/BNSS criminal converter, Supreme Court briefings, and live booking.",
    taglineKn: "ಹೊಸ ಕ್ರಿಮಿನಲ್ ಕಾನೂನುಗಳ ಪರಿವರ್ತಕ ಮತ್ತು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತೀರ್ಪುಗಳ ವಿಶ್ಲೇಷಣೆ.",
    highlightsEn: [
      "IPC / CrPC ➔ BNS / BNSS Criminal Law Converter",
      "Supreme Court & High Court Ratio Precedent Desk",
      "Real-Time 1-Click Online Advocate Booking"
    ],
    highlightsKn: [
      "IPC/CrPC ಇಂದ BNS/BNSS ನೇರ ಪರಿವರ್ತಕ",
      "ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತೀರ್ಪುಗಳ ತ್ವರಿತ ವಿಶ್ಲೇಷಣೆ",
      "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ನೇರ ವಕೀಲರ ಸುಲಭ ಬುಕಿಂಗ್"
    ]
  }
];

// ── Frequently Asked Questions ──
const FAQS = [
  {
    qEn: "How does Advocates Hub verify lawyers before listing them on the platform?",
    qKn: "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ ವಕೀಲರನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸುತ್ತದೆ?",
    aEn:
      "Every practitioner must provide their State Bar Council Enrollment Certificate, Bar Association membership proof, and active practice credentials. Our legal compliance desk verifies their disciplinary standing with the Bar Council of Karnataka before authorizing public consultations.",
    aKn:
      "ಪ್ರತಿಯೊಬ್ಬ ವಕೀಲರು ತಮ್ಮ ರಾಜ್ಯ ಬಾರ್ ಕೌನ್ಸಿಲ್ ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ಸಕ್ರಿಯ ಪ್ರಾಕ್ಟಿಸ್ ವಿವರಗಳನ್ನು ಒದಗಿಸುತ್ತಾರೆ. ನಮ್ಮ ಪರಿಶೀಲನಾ ತಂಡವು ಬಾರ್ ಕೌನ್ಸಿಲ್ ದಾಖಲೆಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿದ ನಂತರವೇ ವೇದಿಕೆಯಲ್ಲಿ ಪ್ರದರ್ಶಿಸುತ್ತದೆ."
  },
  {
    qEn: "Are consultations and client communications legally privileged and confidential?",
    qKn: "ನನ್ನ ಸಮಾಲೋಚನೆ ಮತ್ತು ಪ್ರಕರಣದ ವಿವರಗಳು ಸಂಪೂರ್ಣ ಗೌಪ್ಯವಾಗಿರುತ್ತವೆಯೇ?",
    aEn:
      "Yes. All consultations and document exchanges are protected by statutory Attorney-Client Privilege under Section 126 of the Indian Evidence Act / Section 132 of the Bharatiya Sakshya Adhiniyam, safeguarded with 256-bit bank-grade encryption.",
    aKn:
      "ಖಂಡಿತವಾಗಿ. ವೇದಿಕೆಯಲ್ಲಿನ ಎಲ್ಲಾ ಸಮಾಲೋಚನೆಗಳು ಮತ್ತು ದಾಖಲೆಗಳು ಭಾರತೀಯ ಸಾಕ್ಷ್ಯ ಕಾಯ್ದೆಯ ಅಡಿಯಲ್ಲಿ ವಕೀಲ-ಕ್ಲೈಂಟ್ ಗೌಪ್ಯತೆಯಿಂದ ರಕ್ಷಿಸಲ್ಪಟ್ಟಿದ್ದು, 256-ಬಿಟ್ ಎನ್‌ಕ್ರಿಪ್ಶನ್‌ನೊಂದಿಗೆ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ."
  },
  {
    qEn: "Can I consult an advocate in Kannada as well as English?",
    qKn: "ನಾನು ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಎರಡರಲ್ಲೂ ಕಾನೂನು ಸಲಹೆ ಪಡೆಯಬಹುದೇ?",
    aEn:
      "Absolutely. Advocates Hub is proudly bilingual. Litigants can consult advocates who argue fluently in Kannada and English across the High Court of Karnataka (Bengaluru, Dharwad, Kalaburagi) and all district trial courts.",
    aKn:
      "ಹೌದು. ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ ಸಂಪೂರ್ಣ ಕನ್ನಡ ಬೆಂಬಲವನ್ನು ಹೊಂದಿದೆ. ಹೈಕೋರ್ಟ್ ಮತ್ತು ಜಿಲ್ಲಾ ನ್ಯಾಯಾಲಯಗಳಲ್ಲಿ ಕನ್ನಡದಲ್ಲೇ ನಿರರ್ಗಳವಾಗಿ ವಾದ ಮಂಡಿಸುವ ಮತ್ತು ಸಲಹೆ ನೀಡುವ ಹಿರಿಯ ವಕೀಲರೊಂದಿಗೆ ನೀವು ಮಾತನಾಡಬಹುದು."
  },
  {
    qEn: "How does consultation booking and payment work on Advocates Hub?",
    qKn: "ಸಮಾಲೋಚನೆ ಬುಕಿಂಗ್ ಮತ್ತು ಶುಲ್ಕ ಪಾವತಿ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?",
    aEn:
      "You can filter advocates by legal speciality (Criminal, Civil, Family, Property, Corporate) or city, choose your preferred mode of consultation (phone, video, or in-chamber), pay transparently via instant UPI, and immediately connect with your chosen counsel.",
    aKn:
      "ವಿಷಯ ಅಥವಾ ನಗರದ ಪ್ರಕಾರ ವಕೀಲರನ್ನು ಆಯ್ಕೆಮಾಡಿ, ಫೋನ್ ಅಥವಾ ಚೇಂಬರ್ ಸಮಾಲೋಚನೆಯನ್ನು ನಿಗದಿಪಡಿಸಿ, ಯುಪಿಐ ಮೂಲಕ ನೇರವಾಗಿ ಪಾವತಿಸಿ ತಕ್ಷಣ ಕಾನೂನು ಸಲಹೆ ಪಡೆಯಬಹುದು."
  }
];

export default function AboutUs() {
  const [theme, setTheme] = useState(getTheme);

  // Sync Theme with Global Theme Store
  useEffect(() => {
    const handleThemeChange = (e) => {
      setTheme(e?.detail || getTheme());
    };
    window.addEventListener("law4u_theme_change", handleThemeChange);
    return () => window.removeEventListener("law4u_theme_change", handleThemeChange);
  }, []);

  // Language State: English ('en') or Kannada ('kn')
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

  // Selected Team Member for THE FULL SHOW Dossier Modal
  const [selectedMember, setSelectedMember] = useState(null);

  // Active FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Keyboard shortcut: Escape closes the profile modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedMember) {
        setSelectedMember(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMember]);

  return (
    <div className={`ab-page ${theme === "dark" ? "ab-dark" : "ab-light"}`}>
      {/* ── 1. Prestigious Hero Header ── */}
      <header className="ab-hero">
        <div className="ab-hero-glow"></div>
        <div className="ab-container">
          <div className="ab-hero-content">
            <div className="ab-hero-prestige-badge">
              <span className="ab-badge-beacon"></span>
              <span>
                {isKn
                  ? "🏛️ ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ • ಭಾರತದಾದ್ಯಂತ ಕಾನೂನು ಸೇವೆಯನ್ನು ಸುಲಭಗೊಳಿಸುವುದು"
                  : "🏛️ ADVOCATES HUB • DEMOCRATIZING LEGAL ACCESS ACROSS INDIA"}
              </span>
            </div>

            <h1 className="ab-hero-title">
              {isKn ? (
                <>
                  ವಿಶ್ವಾಸಾರ್ಹ ಮತ್ತು ಪರಿಶೀಲಿತ{" "}
                  <span className="ab-text-gradient">ಕಾನೂನು ಸಲಹೆಯೊಂದಿಗೆ</span> ಪ್ರತಿಯೊಬ್ಬರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು
                </>
              ) : (
                <>
                  Democratizing Access to Justice with{" "}
                  <span className="ab-text-gradient">Integrity, Technology & Transparency</span>
                </>
              )}
            </h1>

            <p className="ab-hero-sub">
              {isKn
                ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ ನಾಗರಿಕರು ಮತ್ತು ಉದ್ಯಮಗಳನ್ನು ಕರ್ನಾಟಕ ಹಾಗೂ ಭಾರತದ ಪ್ರಖ್ಯಾತ, ಪರಿಶೀಲಿತ ವಕೀಲರೊಂದಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸುತ್ತದೆ. ಪಾರದರ್ಶಕ ಶುಲ್ಕ, ವೇಗದ ಸಮಾಲೋಚನೆ ಮತ್ತು ನ್ಯಾಯದ ರಕ್ಷಣೆ ನಮ್ಮ ಪ್ರಮುಖ ಗುರಿ."
                : "AdvocatesHub bridges the gap between individuals, businesses, and certified legal minds across Karnataka and India. Experience radical transparency, instant appointment scheduling, and authoritative legal intelligence."}
            </p>

            {/* Quick Trust Highlights */}
            <div className="ab-trust-strip">
              <div className="ab-ts-item">
                <span className="ab-ts-icon">🛡️</span>
                <span>{isKn ? "100% ಬಾರ್ ಕೌನ್ಸಿಲ್ ಪರಿಶೀಲಿತ" : "100% Bar Council Verified"}</span>
              </div>
              <div className="ab-ts-item">
                <span className="ab-ts-icon">⚡</span>
                <span>{isKn ? "ತ್ವರಿತ ನೇಮಕಾತಿ & ಸಮಾಲೋಚನೆ" : "Instant Booking & Advice"}</span>
              </div>
              <div className="ab-ts-item">
                <span className="ab-ts-icon">🔒</span>
                <span>{isKn ? "256-ಬಿಟ್ ಗೌಪ್ಯತೆ ಸಂರಕ್ಷಣೆ" : "256-Bit Encrypted Data"}</span>
              </div>
              <div className="ab-ts-item">
                <span className="ab-ts-icon">🇮🇳</span>
                <span>{isKn ? "ಕರ್ನಾಟಕ ಮತ್ತು ರಾಷ್ಟ್ರವ್ಯಾಪಿ ಸೇವೆ" : "Pan-Karnataka & National Reach"}</span>
              </div>
            </div>

            {/* Hero CTA Buttons */}
            <div className="ab-hero-actions">
              <Link to="/find-lawyer" className="ab-btn-hero-primary">
                {isKn ? "ವಕೀಲರನ್ನು ಹುಡುಕಿ →" : "Find an Advocate Now →"}
              </Link>
              <Link to="/legal-advice/ask-question" className="ab-btn-hero-secondary">
                {isKn ? "ಉಚಿತ ಕಾನೂನು ಪ್ರಶ್ನೆ ಕೇಳಿ 💬" : "Ask a Free Legal Question 💬"}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── 2. Impact Statistics Grid ── */}
      <section className="ab-stats-section">
        <div className="ab-container">
          <div className="ab-stats-grid">
            {STATS.map((s, idx) => (
              <div key={idx} className="ab-stat-card">
                <div className="ab-stat-icon-wrap">
                  <span className="ab-stat-icon">{s.icon}</span>
                </div>
                <div className="ab-stat-value">{s.value}</div>
                <div className="ab-stat-label">{isKn ? s.labelKn : s.labelEn}</div>
                <div className="ab-stat-desc">{isKn ? s.descKn : s.descEn}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Narrative: Purpose, Problem & Architecture ── */}
      <section className="ab-narrative-section">
        <div className="ab-container">
          <div className="ab-narrative-split">
            <div className="ab-narrative-left">
              <span className="ab-pre-tag">{isKn ? "ನಮ್ಮ ಉದ್ದೇಶ" : "OUR PURPOSE & MISSION"}</span>
              <h2 className="ab-narrative-title">
                {isKn
                  ? "ಕಾನೂನು ಸಹಾಯ ಪಡೆಯುವುದು ಎಂದಿಗೂ ಗೊಂದಲಮಯವಾಗಿರಬಾರದು"
                  : "Finding the Right Advocate Should Never Be Intimidating or Opaque"}
              </h2>
              <p className="ab-narrative-para">
                {isKn
                  ? "ಸಾಂಪ್ರದಾಯಿಕವಾಗಿ, ನ್ಯಾಯಾಲಯದ ವ್ಯವಹಾರಗಳು ಮತ್ತು ಸೂಕ್ತ ವಕೀಲರನ್ನು ಹುಡುಕುವುದು ಕಷ್ಟಕರವಾಗಿತ್ತು. ಶುಲ್ಕದ ಅನಿಶ್ಚಿತತೆ, ಭಾಷೆಯ ತೊಡಕುಗಳು ಮತ್ತು ವಿಳಂಬವು ಜನಸಾಮಾನ್ಯರಿಗೆ ದೊಡ್ಡ ಸವಾಲಾಗಿತ್ತು. ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ ಇದನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಬದಲಾಯಿಸಲು ಹುಟ್ಟಿಕೊಂಡಿದೆ."
                  : "Historically, engaging competent legal counsel in India involved high friction, opaque billing structures, and endless word-of-mouth uncertainty. Litigants were frequently left in the dark about lawyer specializations and courtroom track records."}
              </p>
              <p className="ab-narrative-para">
                {isKn
                  ? "ನಾವು ಕ್ಲೈಂಟ್‌ಗಳಿಗೆ ಅವರ ವಿಷಯ, ನಗರ ಮತ್ತು ಅನುಭವದ ಆಧಾರದ ಮೇಲೆ ವಕೀಲರನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಮುಕ್ತ ಸ್ವಾತಂತ್ರ್ಯ ನೀಡುತ್ತೇವೆ. ಜೊತೆಗೆ ವಕೀಲರಿಗೂ ತಮ್ಮ ಪ್ರಾಕ್ಟಿಸ್ ಅನ್ನು ಗೌರವಯುತವಾಗಿ ಬೆಳೆಸಲು ಆಧುನಿಕ ತಂತ್ರಜ್ಞಾನ ಒದಗಿಸುತ್ತೇವೆ."
                  : "AdvocatesHub eliminates this friction by offering verified lawyer discovery by court, specialization, and language. Concurrently, we equip practitioners with modern digital chambers to handle consultations, review documents, and serve citizens with dignity."}
              </p>

              <div className="ab-checklist">
                <div className="ab-cl-item">
                  <span className="ab-cl-check">✓</span>
                  <span>{isKn ? "ನೈಜ ಬಾರ್ ನೋಂದಣಿ ಮತ್ತು ಸಕ್ರಿಯ ಪ್ರಾಕ್ಟಿಸ್ ಪರಿಶೀಲನೆ" : "Verified State Bar Council Enrollment & Active Standing"}</span>
                </div>
                <div className="ab-cl-item">
                  <span className="ab-cl-check">✓</span>
                  <span>{isKn ? "ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಸಂಪೂರ್ಣ ದ್ವಿಭಾಷಾ ನೆರವು" : "Full English & Kannada Bilingual Capabilities"}</span>
                </div>
                <div className="ab-cl-item">
                  <span className="ab-cl-check">✓</span>
                  <span>{isKn ? "ನೇರ ಯುಪಿಐ ಪಾವತಿ ಮತ್ತು ತ್ವರಿತ ಡಿಜಿಟಲ್ ರಸೀದಿ" : "Instant UPI Digital Payments & Transparent Invoicing"}</span>
                </div>
              </div>
            </div>

            <div className="ab-narrative-right">
              <div className="ab-platform-box">
                <div className="ab-pb-header">
                  <span className="ab-pb-icon">⚖️</span>
                  <div>
                    <h4>{isKn ? "ಸಮಗ್ರ ಕಾನೂನು ಸೇವಾ ವೇದಿಕೆ" : "The Complete Legal Infrastructure"}</h4>
                    <p>{isKn ? "4 ಪ್ರಮುಖ ವಿಭಾಗಗಳು ಒಂದೇ ಸೂರಿನಡಿ" : "4 Pillars Integrated Under One Platform"}</p>
                  </div>
                </div>

                <div className="ab-pb-items">
                  <div className="ab-pbi">
                    <span className="ab-pbi-num">01</span>
                    <div>
                      <strong>{isKn ? "ವಕೀಲರೊಂದಿಗೆ ನೇರ ಸಮಾಲೋಚನೆ" : "Verified Advocate Discovery"}</strong>
                      <p>{isKn ? "ಹೈಕೋರ್ಟ್ ಮತ್ತು ಜಿಲ್ಲಾ ನ್ಯಾಯಾಲಯದ ಪರಿಣಿತರು" : "High Court & District Court Specialists"}</p>
                    </div>
                  </div>
                  <div className="ab-pbi">
                    <span className="ab-pbi-num">02</span>
                    <div>
                      <strong>{isKn ? "ಕಾನೂನು ದಸ್ತಾವೇಜುಗಳ ರಚನೆ" : "Automated Legal Drafting"}</strong>
                      <p>{isKn ? "ಬಾಡಿಗೆ ಒಪ್ಪಂದ, ಎನ್‌ಡಿಎ, ಪವರ್ ಆಫ್ ಅಟಾರ್ನಿ" : "Rental Agreements, NDAs, Affidavits & MOUs"}</p>
                    </div>
                  </div>
                  <div className="ab-pbi">
                    <span className="ab-pbi-num">03</span>
                    <div>
                      <strong>{isKn ? "ಬೇರ್ ಆಕ್ಟ್ಸ್ & ಹೊಸ ಕಾನೂನುಗಳು" : "Bare Acts & Criminal Law Converter"}</strong>
                      <p>{isKn ? "IPC/CrPC ಇಂದ BNS/BNSS ನೇರ ಹೋಲಿಕೆ" : "Instant IPC/CrPC to BNS/BNSS Cross-Mapping"}</p>
                    </div>
                  </div>
                  <div className="ab-pbi">
                    <span className="ab-pbi-num">04</span>
                    <div>
                      <strong>{isKn ? "ನ್ಯಾಯಾಂಗ ತೀರ್ಪುಗಳ ವಿಶ್ಲೇಷಣೆ" : "Authoritative Legal News"}</strong>
                      <p>{isKn ? "ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಹಾಗೂ ಹೈಕೋರ್ಟ್ ತೀರ್ಪುಗಳು" : "Ratio Decidendi & Landmark Precedent Briefs"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Core Operating Principles ── */}
      <section className="ab-pillars-section">
        <div className="ab-container">
          <div className="ab-section-header">
            <span className="ab-pre-tag">{isKn ? "ಮೌಲ್ಯಗಳು" : "INSTITUTIONAL VALUES"}</span>
            <h2 className="ab-section-title">
              {isKn ? "ನಾವು ಪಾಲಿಸುವ ಪ್ರಮುಖ ತತ್ವಗಳು" : "Our Core Operating Principles"}
            </h2>
            <p className="ab-section-subtitle">
              {isKn
                ? "ನ್ಯಾಯ, ಪಾರದರ್ಶಕತೆ ಮತ್ತು ತಂತ್ರಜ್ಞಾನದ ಸಮ್ಮಿಲನವೇ ನಮ್ಮ ಶಕ್ತಿ."
                : "Every feature on Advocates Hub is guided by foundational commitments to integrity, confidentiality, and speed."}
            </p>
          </div>

          <div className="ab-pillars-grid">
            {PILLARS.map((p, idx) => (
              <div key={idx} className="ab-pillar-card">
                <div className="ab-pillar-icon-box">{p.icon}</div>
                <h3 className="ab-pillar-title">{isKn ? p.titleKn : p.titleEn}</h3>
                <p className="ab-pillar-desc">{isKn ? p.descKn : p.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Executive Leadership Team (The 3 Founders & Board) ── */}
      <section className="ab-team-section">
        <div className="ab-container">
          <div className="ab-section-header">
            <span className="ab-pre-tag">{isKn ? "ನಾಯಕತ್ವ" : "LEADERSHIP & GOVERNANCE"}</span>
            <h2 className="ab-section-title">
              {isKn ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನ ಸಂಸ್ಥಾಪಕ ಮಂಡಳಿ" : "The Executive Board Behind Advocates Hub"}
            </h2>
            <p className="ab-section-subtitle">
              {isKn
                ? "ವಕೀಲರ ಜಾಲ, ಕಾನೂನು ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಸೇವಾ ಸಮರ್ಪಣೆಯನ್ನು ಮುನ್ನಡೆಸುತ್ತಿರುವ ನಾಯಕರು. ಪೂರ್ಣ ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಲು ಕಾರ್ಡ್ ಕ್ಲಿಕ್ ಮಾಡಿ."
                : "Meet the visionary technologists, compliance specialists, and partnership leaders transforming Indian legal access. Click any card to open the complete Executive Dossier."}
            </p>
          </div>

          <div className="ab-team-grid">
            {TEAM.map((member) => (
              <article
                key={member.id}
                className="ab-team-card"
                style={{ "--member-accent": member.color }}
              >
                {/* Decorative Top Ambient Banner Glow */}
                <div
                  className="ab-tc-banner-glow"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${member.color}22 0%, transparent 75%)`
                  }}
                ></div>

                {/* Top Badge Strip */}
                <div className="ab-tc-header">
                  <span
                    className="ab-tc-dept-badge"
                    style={{
                      color: member.color,
                      borderColor: member.color + "40",
                      background: member.color + "12"
                    }}
                  >
                    ● {isKn ? member.departmentKn : member.department}
                  </span>
                  <span className="ab-tc-verified-pill">🛡️ {isKn ? "ಪರಿಶೀಲಿತ" : "Verified"}</span>
                </div>

                {/* Avatar Portrait with Active Beacon & Ambient Halo */}
                <div
                  className="ab-tc-avatar-box"
                  onClick={() => setSelectedMember(member)}
                  title="Click to view details"
                >
                  <div
                    className="ab-tc-avatar-glow"
                    style={{ background: member.color }}
                  ></div>
                  <div className="ab-tc-avatar-ring" style={{ borderColor: member.color }}>
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="ab-tc-photo"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="ab-tc-monogram" style={{ background: member.color }}>
                        {member.initials}
                      </div>
                    )}
                  </div>
                </div>

                {/* Identity & Role */}
                <h3 className="ab-tc-name" onClick={() => setSelectedMember(member)}>
                  {member.name}
                </h3>
                <div className="ab-tc-role" style={{ color: member.color }}>
                  {isKn ? member.designationKn : member.designation}
                </div>
                <div className="ab-tc-location">📍 {isKn ? member.locationKn : member.location}</div>

                {/* 1-Line Simple Client Summary */}
                <p className="ab-tc-simple-desc">
                  {isKn ? member.simpleRoleKn : member.simpleRoleEn}
                </p>

                {/* Direct Quick Contact Buttons (1-Tap Call, WhatsApp, Email) */}
                <div className="ab-tc-quick-contacts">
                  <a
                    href={`tel:${member.phone}`}
                    className="ab-tc-qc-btn call"
                    title={`Call ${member.phoneDisplay || "+91 " + member.phone}`}
                  >
                    <span className="ab-qc-icon">📞</span>
                    <span>{isKn ? "ಕರೆ" : "Call"}</span>
                  </a>
                  <a
                    href={`https://wa.me/${member.whatsapp}?text=Hello%20${encodeURIComponent(member.name)},%20I%20am%20reaching%20out%20via%20Advocates%20Hub.`}
                    target="_blank"
                    rel="noreferrer"
                    className="ab-tc-qc-btn whatsapp"
                    title="Chat on WhatsApp"
                  >
                    <span className="ab-qc-icon">💬</span>
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="ab-tc-qc-btn email"
                    title={`Email ${member.email}`}
                  >
                    <span className="ab-qc-icon">✉️</span>
                    <span>{isKn ? "ಇಮೇಲ್" : "Email"}</span>
                  </a>
                </div>

                {/* View Full Profile Trigger Button */}
                <div className="ab-tc-action-bar">
                  <button
                    type="button"
                    className="ab-tc-btn-view"
                    onClick={() => setSelectedMember(member)}
                  >
                    <span>{isKn ? "ಪೂರ್ಣ ವಿವರಗಳು (View Details) →" : "View Full Profile & Bio →"}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Clean, Client-Friendly Executive Modal ── */}
      {selectedMember && (
        <div
          className="ab-modal-backdrop"
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="ab-clean-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ "--member-accent": selectedMember.color }}
          >
            {/* Modal Top Prestige Header */}
            <div className="ab-cm-header">
              <div className="ab-cm-header-left">
                <span className="ab-cm-seal">⚖️</span>
                <span className="ab-cm-badge">
                  {isKn ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್ • ನಾಯಕತ್ವ ಪ್ರೊಫೈಲ್" : "ADVOCATES HUB • LEADERSHIP PROFILE"}
                </span>
              </div>
              <div className="ab-cm-header-right">
                <button
                  type="button"
                  className="ab-cm-btn-close"
                  onClick={() => setSelectedMember(null)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Mobile Sheet Handle */}
            <div className="ab-cm-mobile-handle">
              <div className="ab-cm-handle-pill"></div>
            </div>

            {/* Modal Body */}
            <div className="ab-cm-body">
              {/* Executive Profile Card */}
              <div className="ab-cm-profile-banner">
                <div className="ab-cm-avatar-wrap" style={{ borderColor: selectedMember.color }}>
                  {selectedMember.photo ? (
                    <img
                      src={selectedMember.photo}
                      alt={selectedMember.name}
                      className="ab-cm-photo"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="ab-cm-monogram" style={{ background: selectedMember.color }}>
                      {selectedMember.initials}
                    </div>
                  )}
                </div>

                <div className="ab-cm-profile-info">
                  <div className="ab-cm-meta-top">
                    <span className="ab-cm-status-tag">🛡️ {isKn ? "ಪರಿಶೀಲಿತ ನಾಯಕತ್ವ" : "Verified Leadership"}</span>
                    <span className="ab-cm-loc">📍 {isKn ? selectedMember.locationKn : selectedMember.location}</span>
                  </div>
                  <h2 className="ab-cm-name">{selectedMember.name}</h2>
                  <div className="ab-cm-role" style={{ color: selectedMember.color }}>
                    {isKn ? selectedMember.designationKn : selectedMember.designation}
                  </div>
                  <div className="ab-cm-dept">
                    {isKn ? selectedMember.departmentKn : selectedMember.department}
                  </div>
                </div>
              </div>

              {/* What His Work Is */}
              <div className="ab-cm-work-box" style={{ borderLeftColor: selectedMember.color }}>
                <div className="ab-cm-work-label">
                  <span>💼</span> {isKn ? "ಕಾರ್ಯ ಮತ್ತು ಜವಾಬ್ದಾರಿ" : "Role Focus & Responsibilities"}
                </div>
                <p className="ab-cm-work-text">
                  {isKn ? selectedMember.simpleRoleKn : selectedMember.simpleRoleEn}
                </p>
              </div>

              {/* Executive Direct Communication Desk */}
              <div className="ab-cm-contact-desk">
                <h4 className="ab-cm-desk-title">
                  <span>📞</span> {isKn ? "ನೇರ ಸಂಪರ್ಕ ವಿವರಗಳು" : "Direct Executive Contact"}
                </h4>

                <div className="ab-cm-desk-grid">
                  {/* Phone Call Card */}
                  <a href={`tel:${selectedMember.phone}`} className="ab-cm-desk-card phone">
                    <div className="ab-cmd-icon">📞</div>
                    <div className="ab-cmd-details">
                      <span className="ab-cmd-label">{isKn ? "ದೂರವಾಣಿ ಸಂಖ್ಯೆ" : "Direct Phone Line"}</span>
                      <strong className="ab-cmd-value">{selectedMember.phoneDisplay || "+91 " + selectedMember.phone}</strong>
                      <span className="ab-cmd-action">{isKn ? "ಕರೆ ಮಾಡಿ →" : "Call Now →"}</span>
                    </div>
                  </a>

                  {/* WhatsApp Direct Card */}
                  <a
                    href={`https://wa.me/${selectedMember.whatsapp}?text=Hello%20${encodeURIComponent(selectedMember.name)},%20I%20am%20reaching%20out%20via%20Advocates%20Hub.`}
                    target="_blank"
                    rel="noreferrer"
                    className="ab-cm-desk-card whatsapp"
                  >
                    <div className="ab-cmd-icon">💬</div>
                    <div className="ab-cmd-details">
                      <span className="ab-cmd-label">{isKn ? "ವಾಟ್ಸಾಪ್ ಸಂದೇಶ" : "Official WhatsApp"}</span>
                      <strong className="ab-cmd-value">{selectedMember.phoneDisplay || "+91 " + selectedMember.phone}</strong>
                      <span className="ab-cmd-action">{isKn ? "ಸಂದೇಶ ಕಳುಹಿಸಿ →" : "Chat on WhatsApp →"}</span>
                    </div>
                  </a>

                  {/* Email Card */}
                  <a href={`mailto:${selectedMember.email}`} className="ab-cm-desk-card email">
                    <div className="ab-cmd-icon">✉️</div>
                    <div className="ab-cmd-details">
                      <span className="ab-cmd-label">{isKn ? "ಅಧಿಕೃತ ಇಮೇಲ್" : "Official Email"}</span>
                      <strong className="ab-cmd-value">{selectedMember.email}</strong>
                      <span className="ab-cmd-action">{isKn ? "ಇಮೇಲ್ ಕಳುಹಿಸಿ →" : "Send Email →"}</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Bottom Footer */}
            <div className="ab-cm-footer">
              <button
                type="button"
                className="ab-cm-btn-close-bottom"
                onClick={() => setSelectedMember(null)}
              >
                {isKn ? "ಮುಚ್ಚಿ (Close Profile)" : "Close Profile"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. OUR INSTITUTIONAL ROADMAP (Simple, Client-Friendly 3-Step Journey) ── */}
      <section className="ab-roadmap-section">
        <div className="ab-container">
          <div className="ab-section-header">
            <span className="ab-pre-tag">{isKn ? "ಮೈಲಿಗಲ್ಲುಗಳು" : "OUR INSTITUTIONAL ROADMAP"}</span>
            <h2 className="ab-section-title">
              {isKn ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನ ಬೆಳವಣಿಗೆಯ ಹಾದಿ" : "The Progression of Advocates Hub"}
            </h2>
            <p className="ab-section-subtitle">
              {isKn
                ? "ಸರಳ ಹೆಜ್ಜೆಗಳು, ವಿಶ್ವಾಸಾರ್ಹ ಕಾನೂನು ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ರಾಜ್ಯವ್ಯಾಪಿ ಪ್ರಗತಿಯ ಸ್ಪಷ್ಟ ನೋಟ."
                : "A simple, milestone-driven progression of our platform from founding to statewide legal access."}
            </p>
          </div>

          {/* Visual 3-Card Roadmap Progress Track */}
          <div className="ab-roadmap-track">
            {MILESTONES.map((m, idx) => (
              <div key={idx} className={`ab-roadmap-card status-${m.statusType}`}>
                {/* Top Step & Status Pill */}
                <div className="ab-rmc-top">
                  <div className="ab-rmc-step-pill">
                    <span className="ab-rmc-num">STEP {m.step}</span>
                    <span className="ab-rmc-year">{m.year}</span>
                  </div>
                  <span className={`ab-rmc-status-badge ${m.statusType}`}>
                    {isKn ? m.statusKn : m.statusEn}
                  </span>
                </div>

                {/* Header with Icon & Title */}
                <div className="ab-rmc-header">
                  <div className="ab-rmc-icon">{m.icon}</div>
                  <h3 className="ab-rmc-title">{isKn ? m.titleKn : m.titleEn}</h3>
                </div>

                {/* 1-Line Tagline Description */}
                <p className="ab-rmc-tagline">{isKn ? m.taglineKn : m.taglineEn}</p>

                {/* 3 Simple Highlight Bullets (Easy to get at a glance) */}
                <div className="ab-rmc-highlights">
                  {(isKn ? m.highlightsKn : m.highlightsEn).map((hl, hIdx) => (
                    <div key={hIdx} className="ab-rmc-hl-item">
                      <span className="ab-rmc-hl-check">✓</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Step Connector Line indicator */}
                <div className="ab-rmc-footer-track">
                  <div className="ab-rmc-indicator-bar"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Frequently Asked Questions (FAQ Accordion) ── */}
      <section className="ab-faq-section">
        <div className="ab-container">
          <div className="ab-section-header">
            <span className="ab-pre-tag">{isKn ? "ಸ್ಪಷ್ಟತೆ" : "TRANSPARENCY & COMPLIANCE"}</span>
            <h2 className="ab-section-title">
              {isKn ? "ಸಾಮಾನ್ಯವಾಗಿ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು" : "Frequently Asked Questions"}
            </h2>
            <p className="ab-section-subtitle">
              {isKn
                ? "ಅಡ್ವೊಕೇಟ್ಸ್ ಹಬ್‌ನ ಕಾರ್ಯವೈಖರಿ, ವಕೀಲರ ಪರಿಶೀಲನೆ ಮತ್ತು ಗೌಪ್ಯತೆಯ ಕುರಿತು ಸ್ಪಷ್ಟ ಉತ್ತರಗಳು."
                : "Clear answers on advocate credential verification, attorney-client privilege, and transparent consultations."}
            </p>
          </div>

          <div className="ab-faq-list">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`ab-faq-item ${isOpen ? "active" : ""}`}>
                  <button
                    type="button"
                    className="ab-faq-question-btn"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="ab-faq-q-text">{isKn ? faq.qKn : faq.qEn}</span>
                    <span className="ab-faq-toggle-icon">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="ab-faq-answer">
                      <p>{isKn ? faq.aKn : faq.aEn}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 9. Call to Action Banner ── */}
      <section className="ab-cta-section">
        <div className="ab-container">
          <div className="ab-cta-card">
            <div className="ab-cta-glow"></div>
            <div className="ab-cta-content">
              <span className="ab-cta-pill">
                {isKn ? "⚖️ ಈಗಲೇ ಆರಂಭಿಸಿ" : "⚖️ COMMENCE CONSULTATION"}
              </span>
              <h2 className="ab-cta-title">
                {isKn
                  ? "ನಿಮ್ಮ ಪ್ರಕರಣಕ್ಕೆ ಸೂಕ್ತ ವಕೀಲರನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಸಿದ್ಧರಿದ್ದೀರಾ?"
                  : "Ready to Connect with the Right Advocate for Your Case?"}
              </h2>
              <p className="ab-cta-desc">
                {isKn
                  ? "ವಿಷಯ ಅಥವಾ ನ್ಯಾಯಾಲಯದ ಪ್ರಕಾರ ವಕೀಲರನ್ನು ಹುಡುಕಿ ಮತ್ತು ಕೆಲವೇ ನಿಮಿಷಗಳಲ್ಲಿ ನೇರ ಸಮಾಲೋಚನೆ ಪಡೆಯಿರಿ."
                  : "Search verified advocates by practice area or court jurisdiction, schedule immediate consultations, or draft official legal documents in minutes."}
              </p>

              <div className="ab-cta-btn-row">
                <Link to="/find-lawyer" className="ab-btn-cta-primary">
                  {isKn ? "ವಕೀಲರನ್ನು ಹುಡುಕಿ →" : "Find an Advocate Now →"}
                </Link>
                <Link to="/legal-advice/documents" className="ab-btn-cta-secondary">
                  {isKn ? "ಕಾನೂನು ದಸ್ತಾವೇಜುಗಳು 📄" : "Draft Legal Documents 📄"}
                </Link>
                <Link to="/contact" className="ab-btn-cta-ghost">
                  {isKn ? "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ 📞" : "Contact Our Team 📞"}
                </Link>
              </div>

              {/* Official Company Channels Connect Strip */}
              <div className="ab-cta-company-channels">
                <a
                  href="mailto:advocatehub.in@gmail.com"
                  className="ab-cta-chan-link"
                  title="Official Company Email"
                >
                  <span className="ab-ccl-icon">✉️</span>
                  <span>advocatehub.in@gmail.com</span>
                </a>
                <a
                  href="https://www.instagram.com/advocate__hub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ab-cta-chan-link ab-cta-chan-insta"
                  title="Official Instagram @advocate__hub"
                >
                  <span className="ab-ccl-icon">📸</span>
                  <span>@advocate__hub</span>
                </a>
                <a
                  href="tel:+919108717353"
                  className="ab-cta-chan-link"
                  title="Direct Phone Line"
                >
                  <span className="ab-ccl-icon">📞</span>
                  <span>+91 91087 17353</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}