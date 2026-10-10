// ============================================================
//  Signup.js  —  Advocate Hub Signup Page
//  Two tabs: Client | Advocate
//  Client and advocate accounts require admin approval before login.
//  Advocate accounts are saved with status "pending" and must
//  be approved on the Admin page before they can log in.
//  After signup → success screen → redirect to login
// ============================================================

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { registerAdvocate, getAdvocateById } from "../data/Advocatesstore";
import { registerClient } from "../data/Clientsstore";
import {
  COURT_LEVELS,
  HIGH_COURT_BENCHES,
  KARNATAKA_DISTRICTS_TALUKS,
  getDistricts,
  getTaluksForDistrict,
  buildTargetCourt,
} from "../data/CourtsData";
import { getTheme, toggleTheme } from "../data/themeStore";
import "./Signup.css";

// ── Data from JSON ────────────────────────────────────────────
const ALL_CITIES = [
  // =====================a====
  // A
  // =========================
  "Afzalpur",
  "Alur",
  "Aland",
  "Ankola",
  "Arakalgud",
  "Arasikere",
  "Athani",
  "Aurad",
  "Anekal",

  // =========================
  // B
  // =========================
  "Bagepalli",
  "Bagalkot",
  "Bailhongal",
  "Baindur",
  "Banahatti",
  "Bangarapet",
  "Bantwal",
  "Basavana Bagewadi",
  "Basavakalyan",
  "Belagavi",
  "Belthangady",
  "Belur",
  "Bhadravati",
  "Bhalki",
  "Bhatkal",
  "Bilagi",
  "Byadgi",
  "Bengaluru",
  "Bengaluru Rural",

  // =========================
  // C
  // =========================
  "Challakere",
  "Chamarajanagar",
  "Channagiri",
  "Channapatna",
  "Channarayapatna",
  "Chikkaballapur",
  "Chikkamagaluru",
  "Chikkodi",
  "Chiknayakanhalli",
  "Chincholi",
  "Chintamani",
  "Chitapur",
  "Chitradurga",

  // =========================
  // D
  // =========================
  "Dandeli",
  "Davangere",
  "Devanahalli",
  "Devadurga",
  "Dharwad",
  "Doddaballapur",

  // =========================
  // G
  // =========================
  "Gadag",
  "Gangavathi",
  "Gauribidanur",
  "Gokak",
  "Gudibande",
  "Gubbi",
  "Gundlupet",

  // =========================
  // H
  // =========================
  "H.D. Kote",
  "Hagaribommanahalli",
  "Haliyal",
  "Hanagal",
  "Harihar",
  "Hassan",
  "Haveri",
  "Holenarasipura",
  "Holalkere",
  "Honnavar",
  "Hosanagara",
  "Hospete",
  "Hosadurga",
  "Hoskote",
  "Humnabad",
  "Hukeri",
  "Hunsur",
  "Hungund",
  "Hirekerur",

  // =========================
  // I
  // =========================
  "Ilkal",
  "Indi",

  // =========================
  // J
  // =========================
  "Jamkhandi",
  "Jevargi",
  "Jagalur",

  // =========================
  // K
  // =========================
  "Kadur",
  "Kagwad",
  "Kalaburagi",
  "Kalghatgi",
  "Kanakapura",
  "Karwar",
  "Karkala",
  "Khanapur",
  "Kittur",
  "Kolar",
  "Kollegal",
  "Koppa",
  "Koratagere",
  "Krishnarajanagara",
  "Krishnarajapete",
  "Kundapura",
  "Kundgol",
  "Kumta",
  "Kushalnagar",
  "Kushtagi",
  "Kudachi",
  "Kudligi",
  "KGF",

  // =========================
  // L
  // =========================
  "Lakshmeshwar",
  "Lingasugur",

  // =========================
  // M
  // =========================
  "Maddur",
  "Madikeri",
  "Magadi",
  "Malavalli",
  "Malur",
  "Manvi",
  "Mangaluru",
  "Mandya",
  "Muddebihal",
  "Mudhol",
  "Mudigere",
  "Mudalagi",
  "Mundagod",
  "Mundargi",
  "Mulbagal",
  "Mysuru",

  // =========================
  // N
  // =========================
  "Nagamangala",
  "Nanjangud",
  "Narasimharajapura",
  "Navalgund",
  "Nelamangala",
  "Nippani",
  "Nargund",

  // =========================
  // P
  // =========================
  "Pandavapura",
  "Pavagada",
  "Periyapatna",
  "Ponnampet",
  "Puttur",

  // =========================
  // R
  // =========================
  "Raibag",
  "Raichur",
  "Ramanagara",
  "Ramdurg",
  "Ranebennur",
  "Ron",

  // =========================
  // S
  // =========================
  "Sagara",
  "Sakleshpur",
  "Sandalaga",
  "Sandur",
  "Sankeshwar",
  "Savanur",
  "Sedam",
  "Shahabad",
  "Shahapur",
  "Shiggaon",
  "Shikaripura",
  "Shivamogga",
  "Shorapur",
  "Shirsi",
  "Siddapur",
  "Sindagi",
  "Sindhanur",
  "Sira",
  "Siruguppa",
  "Sirsi",
  "Somwarpet",
  "Srinivaspur",
  "Sringeri",
  "Srirangapatna",
  "Sullia",

  // =========================
  // T
  // =========================
  "Tarikere",
  "Thirthahalli",
  "Tiptur",
  "Tirumakudalu Narasipura",
  "Tumakuru",
  "Turuvekere",

  // =========================
  // U
  // =========================
  "Udupi",

  // =========================
  // V
  // =========================
  "Vijayapura",
  "Virajpet",

  // =========================
  // Y
  // =========================
  "Yadgir",
  "Yaragatti",
  "Yellapur",
  "Yelburga"
];

const ALL_PRACTICE_AREAS = [
  "Criminal Law","Family Law","Property Law","Civil Law",
  "Corporate Law","Tax Law","Labour Law","Consumer Law",
  "Cyber Law","Immigration","Banking Law","Intellectual Property",
  "Divorce","Cheque Bounce","NRI Matters","Supreme Court",
];

export const CITIES = ALL_CITIES;
export const PRACTICE_AREAS = ALL_PRACTICE_AREAS;

const POPULAR_LEGAL_ISSUES = [
  "Family Law",
  "Property Law",
  "Criminal Law",
  "Civil Law",
  "Divorce",
  "Consumer Law",
  "Cyber Law",
  "Cheque Bounce",
];

const BAR_COUNCILS = [
  "Bar Council of India","Bar Council of Karnataka"
];

const EXPERIENCE_YEARS = [
  "Less than 1 year","1–3 years","3–5 years",
  "5–10 years","10–15 years","15–20 years","20+ years",
];

const ADVOCATES_JSON = [
  { name:"Adv. Rajesh Kumar",  email:"rajesh.kumar@advocatehub.in",  phone:"9876543210", city:"Delhi",     speciality:"Criminal Law",  experience:"10–15 years", barId:"BCI/DL/2012/1234", court:"High Court",     fee:"₹2000/hr", bio:"15 years of experience in criminal defense and bail matters.",   initials:"RK", color:"#2563eb" },
  { name:"Adv. Priya Sharma",  email:"priya.sharma@advocatehub.in",  phone:"9823456781", city:"Bengaluru", speciality:"Family Law",    experience:"5–10 years",  barId:"BCI/KA/2016/4321", court:"Family Court",   fee:"₹1500/hr", bio:"Specialist in divorce, child custody and matrimonial disputes.", initials:"PS", color:"#16a34a" },
  { name:"Adv. Amit Verma",    email:"amit.verma@advocatehub.in",    phone:"9812345670", city:"Mumbai",    speciality:"Property Law",  experience:"15–20 years", barId:"BCI/MH/2008/7654", court:"High Court",     fee:"₹3000/hr", bio:"Expert in property disputes, title verification and RERA.",      initials:"AV", color:"#7c3aed" },
  { name:"Adv. Sneha Nair",    email:"sneha.nair@advocatehub.in",    phone:"9801234567", city:"Chennai",   speciality:"Corporate Law", experience:"5–10 years",  barId:"BCI/TN/2015/2345", court:"High Court",     fee:"₹2500/hr", bio:"Corporate lawyer specializing in company law and compliance.",   initials:"SN", color:"#dc2626" },
  { name:"Adv. Rohit Gupta",   email:"rohit.gupta@advocatehub.in",   phone:"9890123456", city:"Hyderabad", speciality:"Civil Law",     experience:"10–15 years", barId:"BCI/TS/2011/3456", court:"Civil Court",    fee:"₹1800/hr", bio:"Civil suits, injunctions and recovery matters specialist.",      initials:"RG", color:"#ea580c" },
  { name:"Adv. Ananya Singh",  email:"ananya.singh@advocatehub.in",  phone:"9879012345", city:"Pune",      speciality:"Tax Law",       experience:"5–10 years",  barId:"BCI/MH/2017/5678", court:"District Court", fee:"₹2000/hr", bio:"GST, income tax and corporate taxation consultant.",             initials:"AS", color:"#0891b2" },
];

// ── Bilingual UI Dictionary (English & Kannada) ───────────────
const TEXTS = {
  en: {
    backHome: "Back to Home",
    badge: "Official Legal Platform of Karnataka & India",
    title: "Create Your Account",
    subtitle: "India's Most Trusted Legal Platform for Clients & Advocates",
    trustVerified: "Verified Advocates",
    trustSecure: "256-Bit SSL Secured",
    trustInstant: "Direct Consultations",
    trustCompliant: "BCI Compliant",
    step1: "STEP 1 · SELECT ACCOUNT TYPE",
    chooseRole: "Select Your Account Type",
    chooseRoleSubtitle: "Choose whether you are seeking legal assistance or registering as a legal professional.",
    clientRoleTitle: "I'm a Client",
    clientRoleSubtitle: "Seeking legal counsel, dispute resolution, or document assistance",
    clientRoleBadge: "Clients & Public",
    clientPerks: ["Consult verified advocates", "Track case updates", "Legal advice & documents"],
    advocateRoleTitle: "I'm an Advocate",
    advocateRoleSubtitle: "Bar council enrolled legal practitioner providing legal services",
    advocateRoleBadge: "Legal Practitioners",
    advocatePerks: ["Direct client consultations", "Verified advocate badge", "Manage practice profile"],
    selected: "Selected",
    selectRole: "Select Role",
    clientBanner: "Client Account: Sign up in 60 seconds to connect with experienced advocates across Karnataka.",
    advocateBanner: "Advocate Onboarding: Register your Bar enrollment to join our verified panel of advocates.",
    personalInfo: "Personal Information",
    locationLegal: "Location & Legal Needs",
    professionalDetails: "Professional Details & Credentials",
    practiceAreas: "Practice Area & Fields of Expertise",
    courtJurisdiction: "Court Jurisdiction & Location",
    bioPhoto: "Bio & Profile Photo",
    security: "Security & Credentials",
    createClientBtn: "Create Client Account",
    createAdvocateBtn: "Register as Advocate",
    creatingAccount: "Creating account…",
    registering: "Registering…",
    alreadyAccount: "Already have an account?",
    alreadyAdvocate: "Already registered as an advocate?",
    signInHere: "Sign in here",
    themeLight: "Light",
    themeDark: "Dark",
    clientFullName: "Full Name",
    clientPhone: "Mobile Phone Number",
    clientEmail: "Email Address",
    clientCity: "Your City / District",
    clientCitySelect: "-- Select your city / district --",
    clientLegalMatter: "Legal Matter / Category of Concern",
    clientLegalMatterSelect: "-- Select legal concern / area --",
    clientQuickTagsTitle: "Popular Legal Concerns (Click to select):",
    clientInstantTitle: "Instant Legal Counsel & Direct Chat Access",
    clientInstantDesc: "Once registered, browse 100+ verified Karnataka advocates, request case reviews, or start direct chat consultations immediately.",
    clientAgreeText: "I agree to the",
    termsOfService: "Terms of Service",
    andWord: "and",
    privacyPolicy: "Privacy Policy",
  },
  kn: {
    backHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    badge: "ಕರ್ನಾಟಕ ಮತ್ತು ಭಾರತದ ಅಧಿಕೃತ ಕಾನೂನು ವೇದಿಕೆ",
    title: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    subtitle: "ಗ್ರಾಹಕರು ಮತ್ತು ವಕೀಲರಿಗಾಗಿ ಭಾರತದ ಅತ್ಯಂತ ವಿಶ್ವಾಸಾರ್ಹ ಕಾನೂನು ವೇದಿಕೆ",
    trustVerified: "ಪರಿಶೀಲಿತ ವಕೀಲರು",
    trustSecure: "೨೫೬-ಬಿಟ್ ಭದ್ರತೆ",
    trustInstant: "ನೇರ ಸಮಾಲೋಚನೆ",
    trustCompliant: "ಬಾರ್ ಕೌನ್ಸಿಲ್ ನಿಯಮಬದ್ಧ",
    step1: "ಹಂತ ೧ · ಖಾತೆಯ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    chooseRole: "ಖಾತೆಯ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    chooseRoleSubtitle: "ನೀವು ಕಾನೂನು ಸಲಹೆ ಪಡೆಯಲು ಬಯಸುತ್ತೀರಾ ಅಥವಾ ವಕೀಲರಾಗಿ ನೋಂದಾಯಿಸಿಕೊಳ್ಳಲು ಬಯಸುತ್ತೀರಾ ಆಯ್ಕೆಮಾಡಿ.",
    clientRoleTitle: "ನಾನು ಗ್ರಾಹಕ (Client)",
    clientRoleSubtitle: "ಕಾನೂನು ಸಲಹೆ, ವ್ಯಾಜ್ಯ ಪರಿಹಾರ ಅಥವಾ ದಾಖಲೆಗಳ ಸಹಾಯ ಪಡೆಯಲು",
    clientRoleBadge: "ಗ್ರಾಹಕರು ಮತ್ತು ಸಾರ್ವಜನಿಕರು",
    clientPerks: ["ಪರಿಶೀಲಿತ ವಕೀಲರೊಂದಿಗೆ ಸಮಾಲೋಚನೆ", "ಪ್ರಕರಣದ ಮಾಹಿತಿ ಟ್ರ್ಯಾಕಿಂಗ್", "ಕಾನೂನು ಸಲಹೆ ಮತ್ತು ದಾಖಲೆಗಳು"],
    advocateRoleTitle: "ನಾನು ವಕೀಲ (Advocate)",
    advocateRoleSubtitle: "ಬಾರ್ ಕೌನ್ಸಿಲ್ ನೋಂದಾಯಿತ ಕಾನೂನು ವೃತ್ತಿಪರರು",
    advocateRoleBadge: "ಕಾನೂನು ವೃತ್ತಿಪರರು",
    advocatePerks: ["ಗ್ರಾಹಕರಿಂದ ನೇರ ಸಮಾಲೋಚನೆ", "ಪರಿಶೀಲಿತ ವಕೀಲರ ಬ್ಯಾಡ್ಜ್", "ವೃತ್ತಿಪರ ಪ್ರೊಫೈಲ್ ನಿರ್ವಹಣೆ"],
    selected: "ಆಯ್ಕೆಯಾಗಿದೆ",
    selectRole: "ಆಯ್ಕೆಮಾಡಿ",
    clientBanner: "ಗ್ರಾಹಕರ ಖಾತೆ: ಕರ್ನಾಟಕದ ಅನುಭವಿ ವಕೀಲರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಲು ೬೦ ಸೆಕೆಂಡುಗಳಲ್ಲಿ ನೋಂದಾಯಿಸಿ.",
    advocateBanner: "ವಕೀಲರ ನೋಂದಣಿ: ನಮ್ಮ ಪರಿಶೀಲಿತ ವಕೀಲರ ಪ್ಯಾನೆಲ್‌ಗೆ ಸೇರಲು ನಿಮ್ಮ ಬಾರ್ ನೋಂದಣಿ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.",
    personalInfo: "ವೈಯಕ್ತಿಕ ವಿವರಗಳು",
    locationLegal: "ಸ್ಥಳ ಮತ್ತು ಕಾನೂನು ಅಗತ್ಯತೆಗಳು",
    professionalDetails: "ವೃತ್ತಿಪರ ವಿವರಗಳು ಮತ್ತು ರುಜುವಾತುಗಳು",
    practiceAreas: "ಅಭ್ಯಾಸ ಕ್ಷೇತ್ರ ಮತ್ತು ಪರಿಣತಿ",
    courtJurisdiction: "ನ್ಯಾಯಾಲಯದ ವ್ಯಾಪ್ತಿ ಮತ್ತು ಸ್ಥಳ",
    bioPhoto: "ಪರಿಚಯ ಮತ್ತು ಪ್ರೊಫೈಲ್ ಫೋಟೋ",
    security: "ಭದ್ರತೆ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್",
    createClientBtn: "ಗ್ರಾಹಕರ ಖಾತೆ ರಚಿಸಿ",
    createAdvocateBtn: "ವಕೀಲರಾಗಿ ನೋಂದಾಯಿಸಿ",
    creatingAccount: "ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ…",
    registering: "ನೋಂದಾಯಿಸಲಾಗುತ್ತಿದೆ…",
    alreadyAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",
    alreadyAdvocate: "ಈಗಾಗಲೇ ವಕೀಲರಾಗಿ ನೋಂದಾಯಿಸಿದ್ದೀರಾ?",
    signInHere: "ಇಲ್ಲಿ ಲಾಗಿನ್ ಆಗಿ",
    themeLight: "ಬೆಳಕು",
    themeDark: "ಕಪ್ಪು",
    clientFullName: "ಪೂರ್ಣ ಹೆಸರು",
    clientPhone: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    clientEmail: "ಇಮೇಲ್ ವಿಳಾಸ",
    clientCity: "ನಿಮ್ಮ ನಗರ / ಜಿಲ್ಲೆ",
    clientCitySelect: "-- ನಗರ ಅಥವಾ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ --",
    clientLegalMatter: "ಕಾನೂನು ವಿಷಯ / ಪರಿಹಾರದ ಪ್ರಕಾರ",
    clientLegalMatterSelect: "-- ಕಾನೂನು ಸಮಸ್ಯೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ --",
    clientQuickTagsTitle: "ಸಾಮಾನ್ಯ ಕಾನೂನು ವಿಷಯಗಳು (ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ):",
    clientInstantTitle: "ತ್ವರಿತ ಕಾನೂನು ಸಲಹೆ ಮತ್ತು ಚಾಟ್ ಸೌಲಭ್ಯ",
    clientInstantDesc: "ನೋಂದಾಯಿಸಿದ ನಂತರ, ಕರ್ನಾಟಕದ ೧೦೦+ ಪರಿಶೀಲಿತ ವಕೀಲರನ್ನು ಹುಡುಕಿ, ಸಲಹೆ ಪಡೆಯಿರಿ ಅಥವಾ ತಕ್ಷಣ ನೇರ ಚಾಟ್ ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭಿಸಿ.",
    clientAgreeText: "ನಾನು ಸೇವಾ ನಿಯಮಗಳು ಮತ್ತು ಗೌಪ್ಯತಾ ನೀತಿಯನ್ನು ಒಪ್ಪುತ್ತೇನೆ:",
    termsOfService: "ಸೇವಾ ನಿಯಮಗಳು",
    andWord: "ಮತ್ತು",
    privacyPolicy: "ಗೌಪ್ಯತಾ ನೀತಿ",
  }
};

// ── Helpers ───────────────────────────────────────────────────
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isValidPhone(p) { return /^\d{10}$/.test(p.replace(/\s|-/g, "")); }
function formatOtpChannels(channels) {
  const labels = { email: "Email", sms: "SMS", phone: "SMS", whatsapp: "WhatsApp" };
  const expanded = channels.flatMap((channel) => channel === "all" ? ["email", "sms", "whatsapp"] : [channel]);
  return expanded.map((channel) => labels[channel] || channel).join(", ");
}
function maskPhone(p) {
  if (!p) return "";
  const cleaned = p.replace(/\D/g, "");
  if (cleaned.length <= 4) return cleaned;
  const last4 = cleaned.slice(-4);
  return `******${last4}`;
}

function PwStrength({ pw }) {
  if (!pw) return null;
  let s = 0;
  if (pw.length >= 6)           s++;
  if (pw.length >= 10)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const LV = [
    { label:"Very Weak", c:"#ef4444" },
    { label:"Weak",      c:"#f97316" },
    { label:"Fair",      c:"#f59e0b" },
    { label:"Good",      c:"#84cc16" },
    { label:"Strong",    c:"#22c55e" },
  ];
  const lv = LV[Math.min(s, 4)];
  return (
    <div className="su-pw-strength">
      <div className="su-pw-bars">
        {LV.map((_, i) => (
          <div key={i} className="su-pw-bar" style={{ background: i < s ? lv.c : "#e2e8f0" }} />
        ))}
      </div>
      <span style={{ color: lv.c, fontSize: 11, fontWeight: 600 }}>{lv.label}</span>
    </div>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <div className="su-field">
      {label && (
        <label className="su-label">
          {label}{required && <span className="su-req"> *</span>}
        </label>
      )}
      {children}
      {hint  && !error && <p className="su-hint">{hint}</p>}
      {error && <p className="su-field-err">⚠ {error}</p>}
    </div>
  );
}

function Input({ icon, error, type = "text", rightEl, ...props }) {
  return (
    <div className={`su-input-wrap ${error ? "error" : ""}`}>
      {icon && <span className="su-input-icon">{icon}</span>}
      <input type={type} className="su-input" {...props} />
      {rightEl}
    </div>
  );
}

function Select({ icon, error, children, ...props }) {
  return (
    <div className={`su-input-wrap ${error ? "error" : ""}`}>
      {icon && <span className="su-input-icon">{icon}</span>}
      <select className="su-input su-select" {...props}>{children}</select>
    </div>
  );
}

// ── Success Screen ────────────────────────────────────────────
function SuccessScreen({ type, name, onLogin }) {
  const [count, setCount] = useState(type === "advocate" ? 5 : null);
  useEffect(() => {
    if (type !== "advocate") return undefined;
    const t = setInterval(() => setCount(c => {
      if (c <= 1) { clearInterval(t); onLogin(); return 0; }
      return c - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [onLogin, type]);

  return (
    <div className="su-success">
      <div className="su-success-icon">{type === "client" ? "✅" : "🎉"}</div>
      <h2 className="su-success-title">
        {type === "client" ? "Registration Successful" : "Registration Successful!"}
      </h2>
      <p className="su-success-msg">
        Welcome to Advocate Hub, <strong>{name}</strong>!<br />
        {type === "advocate"
          ? "Your advocate profile has been submitted for review. Admin approval is still required before you can access the advocate dashboard."
          : "Your client account is active and you are logged in automatically."}
      </p>
      <div className="su-success-steps">
        <div className="su-ss done">✅ Account created</div>
        <div className="su-ss done">{type === "client" ? "✅ Logged in automatically" : "⏳ Awaiting admin approval"}</div>
      </div>
      {type === "advocate" && (
        <div className="su-success-countdown">
          Redirecting in <strong>{count}</strong> seconds…
        </div>
      )}
      <button className="su-btn-primary su-btn-lg" onClick={onLogin}>
        {type === "client" ? "Continue to Client Portal →" : "Go to Login Now →"}
      </button>
    </div>
  );
}

// ── Advocate Card (from JSON) ─────────────────────────────────
function AdvCard({ adv, onFill }) {
  return (
    <div className="su-adv-card" onClick={() => onFill(adv)}>
      <div className="su-adv-avatar" style={{ background: adv.color }}>{adv.initials}</div>
      <div className="su-adv-info">
        <div className="su-adv-name">{adv.name}</div>
        <div className="su-adv-spec">{adv.speciality} · {adv.city}</div>
        <div className="su-adv-exp">{adv.experience}</div>
      </div>
      <span className="su-adv-fill">Use →</span>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const MAP = {
    success:{ bg:"#dcfce7", c:"#14532d", b:"#bbf7d0", i:"✅" },
    error:  { bg:"#fee2e2", c:"#7f1d1d", b:"#fecaca", i:"❌" },
    info:   { bg:"#dbeafe", c:"#1e3a5f", b:"#bfdbfe", i:"ℹ️" },
  };
  const s = MAP[toast.type] || MAP.info;
  return (
    <div className="su-toast" style={{ background:s.bg, color:s.c, border:`1px solid ${s.b}` }}>
      {s.i} {toast.msg}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN SIGNUP COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role") || searchParams.get("tab") || "";
  const advocateIdParam = searchParams.get("advocateId") || "";
  const advocateNameParam = searchParams.get("advocateName") || "";
  const redirectParam = searchParams.get("redirect") || "";

  const [tab,     setTab]     = useState(() => (roleParam === "advocate" ? "advocate" : "client"));
  const [view,    setView]    = useState("form");      // "form" | "success"
  const [toast,   setToast]   = useState(null);
  const isRoleSelectionView = roleParam === "";
  const showBackToSignup = roleParam === "advocate" || roleParam === "client";
  const [loading, setLoading] = useState(false);
  const [showDemoAdvocates, setShowDemoAdvocates] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [successName, setSuccessName] = useState("");

  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [advOtpSentChannels, setAdvOtpSentChannels] = useState([]);
  const [advOtpChannel, setAdvOtpChannel] = useState("all"); // "all" | "email" | "phone" | "whatsapp"

  useEffect(() => {
    if (!otpStep || resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [otpStep, resendTimer]);

  const [theme, setLocalTheme] = useState(getTheme);
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
    const handleTheme = (e) => {
      setLocalTheme(e?.detail || getTheme());
    };
    window.addEventListener("law4u_lang_change", handleLang);
    window.addEventListener("law4u_theme_change", handleTheme);
    return () => {
      window.removeEventListener("law4u_lang_change", handleLang);
      window.removeEventListener("law4u_theme_change", handleTheme);
    };
  }, []);

  const handleLangToggle = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem("law4u_home_lang", newLang);
      window.dispatchEvent(new CustomEvent("law4u_lang_change", { detail: newLang }));
    } catch {}
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const isKn = lang === "kn";
  const t = TEXTS[lang] || TEXTS.en;

  const targetAdvocate = useMemo(() => {
    if (!advocateIdParam) return null;
    const found = getAdvocateById(advocateIdParam);
    if (found) return found;
    if (advocateNameParam) return { id: advocateIdParam, name: advocateNameParam };
    return null;
  }, [advocateIdParam, advocateNameParam]);

  useEffect(() => {
    if (roleParam === "advocate") {
      setTab("advocate");
    } else if (roleParam === "client" || advocateIdParam) {
      setTab("client");
    }
  }, [roleParam, advocateIdParam]);

  // ── Client form ───────────────────────────────────────────
  const [client, setClient] = useState({
    fullName:"", email:"", phone:"", password:"", confirmPw:"",
    city:"", legalIssue:"", agreeTerms: false,
  });
  const [clientErr, setClientErr] = useState({});

  // ── Advocate form ─────────────────────────────────────────
  const [adv, setAdv] = useState({
    fullName:"", email:"", phone:"", password:"", confirmPw:"",
    barId:"", speciality:"", specialities:[],
    courtLevel:"", district:"", taluk:"", bench:"", court:"",
    barCouncil:"",
    experience:"", city:"", fee:"", bio:"", avatarData:"", agreeTerms: false,
  });
  const [advErr, setAdvErr] = useState({});
  const [customArea, setCustomArea] = useState("");

  const handleCourtLevelChange = (level) => {
    setAdv(prev => {
      let nextDistrict = prev.district;
      let nextTaluk = prev.taluk;
      let nextBench = prev.bench;
      let nextCity = prev.city;

      if (level === "Supreme Court") {
        nextDistrict = "New Delhi";
        nextTaluk = "New Delhi";
        nextBench = "";
        nextCity = "New Delhi";
      } else if (level === "High Court") {
        nextDistrict = "";
        nextTaluk = "";
        if (!nextBench) nextBench = HIGH_COURT_BENCHES[0];
        nextCity = nextBench.includes("Dharwad") ? "Dharwad" : (nextBench.includes("Kalaburagi") ? "Kalaburagi" : "Bengaluru");
      } else {
        nextBench = "";
        if (nextDistrict === "New Delhi") nextDistrict = "";
        if (nextTaluk === "New Delhi") nextTaluk = "";
      }

      const computedCourt = buildTargetCourt({
        courtLevel: level,
        district: nextDistrict,
        taluk: nextTaluk,
        bench: nextBench,
      });

      return {
        ...prev,
        courtLevel: level,
        district: nextDistrict,
        taluk: nextTaluk,
        bench: nextBench,
        court: computedCourt,
        city: nextCity || nextTaluk || nextDistrict || prev.city,
      };
    });
    setAdvErr(p => ({ ...p, courtLevel: "", court: "", district: "", taluk: "" }));
  };

  const handleDistrictChange = (dist) => {
    setAdv(prev => {
      const taluks = getTaluksForDistrict(dist);
      const nextTaluk = taluks.includes(prev.taluk) ? prev.taluk : (taluks.length > 0 ? taluks[0] : "");
      const nextCity = nextTaluk || dist || "";
      const computedCourt = buildTargetCourt({
        courtLevel: prev.courtLevel,
        district: dist,
        taluk: nextTaluk,
        bench: prev.bench,
      });
      return {
        ...prev,
        district: dist,
        taluk: nextTaluk,
        court: computedCourt,
        city: nextCity,
      };
    });
    setAdvErr(p => ({ ...p, district: "", court: "" }));
  };

  const handleTalukChange = (tlk) => {
    setAdv(prev => {
      const computedCourt = buildTargetCourt({
        courtLevel: prev.courtLevel,
        district: prev.district,
        taluk: tlk,
        bench: prev.bench,
      });
      return {
        ...prev,
        taluk: tlk,
        court: computedCourt,
        city: tlk || prev.district || prev.city,
      };
    });
    setAdvErr(p => ({ ...p, taluk: "", court: "" }));
  };

  const handleBenchChange = (bnch) => {
    setAdv(prev => {
      const computedCourt = buildTargetCourt({
        courtLevel: prev.courtLevel,
        district: prev.district,
        taluk: prev.taluk,
        bench: bnch,
      });
      const nextCity = bnch.includes("Dharwad") ? "Dharwad" : (bnch.includes("Kalaburagi") ? "Kalaburagi" : "Bengaluru");
      return {
        ...prev,
        bench: bnch,
        court: computedCourt,
        city: nextCity,
      };
    });
    setAdvErr(p => ({ ...p, court: "" }));
  };

  const handleTogglePracticeArea = (area) => {
    if (!area) return;
    setAdv(prev => {
      const current = Array.isArray(prev.specialities) && prev.specialities.length > 0
        ? prev.specialities
        : (prev.speciality ? prev.speciality.split(/,\s*/).map(s => s.trim()).filter(Boolean) : []);
      const exists = current.includes(area);
      const next = exists ? current.filter(x => x !== area) : [...current, area];
      return {
        ...prev,
        specialities: next,
        speciality: next.join(", "),
      };
    });
    setAdvErr(p => ({ ...p, speciality: "" }));
  };

  const handleAddCustomPracticeArea = (customName) => {
    const trimmed = (customName || "").trim();
    if (!trimmed) return;
    setAdv(prev => {
      const current = Array.isArray(prev.specialities) && prev.specialities.length > 0
        ? prev.specialities
        : (prev.speciality ? prev.speciality.split(/,\s*/).map(s => s.trim()).filter(Boolean) : []);
      if (current.some(x => x.toLowerCase() === trimmed.toLowerCase())) return prev;
      const next = [...current, trimmed];
      return {
        ...prev,
        specialities: next,
        speciality: next.join(", "),
      };
    });
    setAdvErr(p => ({ ...p, speciality: "" }));
  };

  const handleRemovePracticeArea = (area) => {
    setAdv(prev => {
      const current = Array.isArray(prev.specialities) && prev.specialities.length > 0
        ? prev.specialities
        : (prev.speciality ? prev.speciality.split(/,\s*/).map(s => s.trim()).filter(Boolean) : []);
      const next = current.filter(x => x !== area);
      return {
        ...prev,
        specialities: next,
        speciality: next.join(", "),
      };
    });
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg, type = "info") => setToast({ msg, type });

  // ── Set client field ──────────────────────────────────────
  const setC = (k, v) => {
    setClient(p => ({ ...p, [k]: v }));
    setClientErr(p => ({ ...p, [k]: "" }));
  };
  const setA = (k, v) => {
    setAdv(p => ({ ...p, [k]: v }));
    setAdvErr(p => ({ ...p, [k]: "" }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAdvErr((p) => ({ ...p, avatarData: "Please select an image file" }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAdvErr((p) => ({ ...p, avatarData: "Image must be smaller than 2 MB" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setA("avatarData", reader.result);
    reader.readAsDataURL(file);
  };

  // ── Fill from JSON advocate ───────────────────────────────
  const fillAdvocate = (a) => {
    const specs = a.speciality
      ? a.speciality.split(/,\s*|&\s*/).map(s => s.trim()).filter(Boolean)
      : [];
    const courtLevel = a.courtLevel || (a.court?.includes("High Court") ? "High Court" : (a.court?.includes("Supreme Court") ? "Supreme Court" : "Taluk / JMFC / Civil Court"));
    const district = a.district || (a.city && KARNATAKA_DISTRICTS_TALUKS[a.city] ? a.city : "Belagavi");
    const taluk = a.taluk || a.city || "Gokak";
    const computedCourt = a.court || buildTargetCourt({ courtLevel, district, taluk });
    setAdv(p => ({
      ...p,
      fullName:     a.name,
      email:        a.email,
      phone:        a.phone,
      city:         a.city || taluk || district,
      speciality:   a.speciality,
      specialities: specs.length > 0 ? specs : [a.speciality].filter(Boolean),
      experience:   a.experience,
      barId:        a.barId,
      courtLevel,
      district,
      taluk,
      court:        computedCourt,
      fee:          a.fee,
      bio:          a.bio,
    }));
    setAdvErr({});
    setShowDemoAdvocates(false);
    showToast(`Filled details for ${a.name}`, "info");
  };

  // ── Validate client ───────────────────────────────────────
  const validateClient = () => {
    const e = {};
    if (!client.fullName.trim())      e.fullName  = "Full name is required";
    if (!client.email.trim())          e.email     = "Email is required";
    else if (!isValidEmail(client.email)) e.email  = "Invalid email format";
    if (!client.phone.trim())          e.phone     = "Phone is required";
    else if (!isValidPhone(client.phone)) e.phone  = "Enter valid 10-digit phone";
    if (!client.password)              e.password  = "Password is required";
    else if (client.password.length<6) e.password  = "Min 6 characters";
    if (client.password !== client.confirmPw) e.confirmPw = "Passwords do not match";
    if (!client.agreeTerms)            e.agreeTerms = "Please accept terms";
    setClientErr(e);
    return !Object.keys(e).length;
  };

  // ── Validate advocate ─────────────────────────────────────
  const validateAdvocate = () => {
    const e = {};
    if (!adv.fullName.trim())      e.fullName  = "Full name is required";
    if (!adv.email.trim())          e.email     = "Email is required";
    else if (!isValidEmail(adv.email)) e.email  = "Invalid email format";
    if (!adv.phone.trim())          e.phone     = "Phone is required";
    else if (!isValidPhone(adv.phone)) e.phone  = "Enter valid 10-digit phone";
    if (!adv.barId.trim())          e.barId     = "Bar enrollment number is required";
    
    const specsList = (adv.specialities && adv.specialities.length > 0)
      ? adv.specialities
      : (adv.speciality ? adv.speciality.split(/,\s*/).map(s => s.trim()).filter(Boolean) : []);
    if (specsList.length === 0)     e.speciality = "Please select or add at least 1 practice area";
    
    if (!adv.courtLevel)            e.courtLevel = "Select level of court";
    if (adv.courtLevel !== "Supreme Court" && adv.courtLevel !== "High Court" && !adv.district) {
      e.district = "Select district";
    }
    if ((adv.courtLevel === "Taluk / JMFC / Civil Court" || adv.courtLevel === "Revenue Court / Land Tribunal") && !adv.taluk) {
      e.taluk = "Select taluk";
    }
    if (!adv.court)                 e.court      = "Target court is required";
    if (!adv.city && !adv.taluk && !adv.district) e.city = "City or district is required";
    if (!adv.avatarData)            e.avatarData  = "Profile image is required";
    if (!adv.password)              e.password   = "Password is required";
    else if (adv.password.length<6) e.password   = "Min 6 characters";
    if (adv.password !== adv.confirmPw) e.confirmPw = "Passwords do not match";
    if (!adv.agreeTerms)            e.agreeTerms = "Please accept terms";
    setAdvErr(e);
    return !Object.keys(e).length;
  };

  const [showAdvChannelModal, setShowAdvChannelModal] = useState(false);

  // ── Submit — persist locally via advocatesStore / clientsStore ──
  const handleSubmit = (e) => {
    e?.preventDefault();
    const valid = tab === "client" ? validateClient() : validateAdvocate();
    if (!valid) return;

    if (tab === "client") {
      navigate("/client-register");
      return;
    }

    setShowAdvChannelModal(true);
  };

  const handleConfirmAdvChannelAndSend = (selectedChannel) => {
    const channelToUse = selectedChannel || advOtpChannel;
    setAdvOtpChannel(channelToUse);
    setShowAdvChannelModal(false);
    setLoading(true);

    (async () => {
      try {
        const emailLower = adv.email.trim().toLowerCase();
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: adv.fullName.trim(),
            email: emailLower,
            phone: adv.phone.trim(),
            role: "advocate",
            channel: channelToUse,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const errorMessage = data.message || data.error || "Failed to send verification code. Try again.";
          if (res.status === 409) setAdvErr((p) => ({ ...p, email: errorMessage }));
          showToast(errorMessage, "error");
          setLoading(false);
          return;
        }

        const sentChannels = Array.isArray(data.sentChannels)
          ? data.sentChannels
          : [channelToUse === "phone" ? "sms" : channelToUse];
        setAdvOtpSentChannels(sentChannels);
        showToast(
          data.message || `Verification code sent via ${formatOtpChannels(sentChannels)}.`,
          data.failedChannels?.length ? "info" : "success"
        );
        setOtpStep(true);
        setResendTimer(60);
      } catch (err) {
        console.error(err);
        showToast("Could not reach the server. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleResendAdvOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      const emailLower = adv.email.trim().toLowerCase();
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: adv.fullName.trim(),
          email: emailLower,
          phone: adv.phone.trim(),
          role: "advocate",
          channel: advOtpChannel,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const sentChannels = Array.isArray(data.sentChannels)
          ? data.sentChannels
          : [advOtpChannel === "phone" ? "sms" : advOtpChannel];
        setAdvOtpSentChannels(sentChannels);
        showToast(
          data.message || `A new verification code was sent via ${formatOtpChannels(sentChannels)}.`,
          data.failedChannels?.length ? "info" : "success"
        );
        setResendTimer(60);
      } else {
        showToast(data.message || data.error || "Failed to resend code.", "error");
      }
    } catch {
      showToast("Network error during resend.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegisterAdv = async (e) => {
    e?.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setOtpErr("Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    setOtpErr("");

    try {
      const emailLower = adv.email.trim().toLowerCase();
      const specsList = (adv.specialities && adv.specialities.length > 0)
        ? adv.specialities
        : (adv.speciality ? adv.speciality.split(/,\s*/).map(s => s.trim()).filter(Boolean) : []);
      const finalSpeciality = specsList.join(", ");

      await registerAdvocate({
        name:          adv.fullName.trim(),
        email:         emailLower,
        password:      adv.password,
        phone:         adv.phone.trim(),
        barId:         adv.barId.trim(),
        speciality:    finalSpeciality,
        practiceArea:  finalSpeciality,
        practiceAreas: specsList,
        courtLevel:    adv.courtLevel,
        district:      adv.district,
        taluk:         adv.taluk,
        court:         adv.court,
        barCouncil:    adv.barCouncil,
        experience:    adv.experience,
        city:          adv.city || adv.taluk || adv.district,
        fee:           adv.fee || "",
        bio:           adv.bio,
        avatarData:    adv.avatarData,
        otp:           otpCode.trim(),
      });

      setSuccessName(adv.fullName);
      showToast("Email verified & Advocate Profile Approved! 🎉", "success");
      setOtpStep(false);
      setView("success");
    } catch (err) {
      setOtpErr(err.message || "Verification failed.");
      showToast(err.message || "Verification failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    if (tab === "client") {
      navigate("/client-login");
    } else {
      navigate("/login");
    }
  };

  // ── Success view ──────────────────────────────────────────
  if (view === "success") {
    return (
      <div className={`su-page ${theme === "dark" ? "theme-dark su-dark" : "theme-light su-light"}`} data-theme={theme}>
        <Toast toast={toast} />
        <div className="su-card su-success-card">
          <SuccessScreen
            type={tab}
            name={successName}
            onLogin={goToLogin}
          />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  return (
    <div className={`su-page ${theme === "dark" ? "theme-dark su-dark" : "theme-light su-light"}`} data-theme={theme}>
      <Toast toast={toast} />

      {/* Full Screen Advocate OTP Delivery Channel Selection Modal (Mobile App Style) */}
      {showAdvChannelModal && (
        <div className="rg-modal-overlay">
          <div className="rg-modal-card" style={{ maxWidth: 480, textAlign: "center" }}>
            <div className="rg-otp-badge">📲</div>
            <h2 className="su-title" style={{ fontSize: "1.55rem" }}>{isKn ? "ಒಟಿಪಿ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Select OTP Delivery Channel"}</h2>
            <p className="su-subtitle" style={{ fontSize: "0.92rem", margin: "6px 0 20px" }}>
              {isKn ? "ನಿಮ್ಮ ೬-ಅಂಕಿಯ ಪರಿಶೀಲನಾ ಕೋಡ್ ಅನ್ನು ಎಲ್ಲಿ ಕಳುಹಿಸಬೇಕು?" : "How would you like to receive your 6-digit verification code?"}
            </p>

            <div className="rg-channel-card-list">
              <button
                type="button"
                className="rg-channel-option-card chan-email"
                onClick={() => handleConfirmAdvChannelAndSend("email")}
              >
                <div className="rg-channel-icon-avatar">✉️</div>
                <div className="rg-channel-body">
                  <div className="rg-channel-title">Email Address Only</div>
                  <div className="rg-channel-desc">Sent directly to {adv.email}</div>
                </div>
                <div className="rg-channel-arrow">→</div>
              </button>

              <button
                type="button"
                className="rg-channel-option-card chan-sms"
                onClick={() => handleConfirmAdvChannelAndSend("phone")}
              >
                <div className="rg-channel-icon-avatar">📱</div>
                <div className="rg-channel-body">
                  <div className="rg-channel-title">Mobile SMS Message</div>
                  <div className="rg-channel-desc">Sent via SMS to +91 {maskPhone(adv.phone)}</div>
                </div>
                <div className="rg-channel-arrow">→</div>
              </button>

              <button
                type="button"
                className="rg-channel-option-card chan-wa"
                onClick={() => handleConfirmAdvChannelAndSend("whatsapp")}
              >
                <div className="rg-channel-icon-avatar">💬</div>
                <div className="rg-channel-body">
                  <div className="rg-channel-title">WhatsApp Chat Message</div>
                  <div className="rg-channel-desc">Instant OTP to WhatsApp number {maskPhone(adv.phone)}</div>
                </div>
                <div className="rg-channel-arrow">→</div>
              </button>

              <button
                type="button"
                className="rg-channel-option-card chan-all"
                onClick={() => handleConfirmAdvChannelAndSend("all")}
              >
                <div className="rg-channel-icon-avatar">✨</div>
                <div className="rg-channel-body">
                  <div className="rg-channel-title">
                    All Channels <span className="rg-channel-badge">Recommended</span>
                  </div>
                  <div className="rg-channel-desc">Receive code via Email, SMS & WhatsApp simultaneously</div>
                </div>
                <div className="rg-channel-arrow">→</div>
              </button>
            </div>

            <button
              type="button"
              style={{ background: "none", border: 0, color: "var(--rg-muted)", cursor: "pointer", textDecoration: "underline", font: "inherit", fontSize: "0.88rem" }}
              onClick={() => setShowAdvChannelModal(false)}
            >
              ← Cancel & Back to Form
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {otpStep && (
        <div className="rg-modal-overlay">
          <div className="rg-modal-card">
            <div className="rg-otp-badge">🔐</div>
            <h2 className="su-title" style={{ fontSize: "1.6rem" }}>Verify Advocate Account</h2>
            <p className="su-subtitle" style={{ fontSize: "0.95rem", margin: "8px 0 16px" }}>
              Verification code sent via<br />
              <strong style={{ color: "var(--su-accent, #2dd4bf)" }}>
                {formatOtpChannels(advOtpSentChannels.length ? advOtpSentChannels : [advOtpChannel])}
              </strong>
            </p>
            <p style={{ fontSize: "0.82rem", color: "#64748b", background: "rgba(0,0,0,0.04)", padding: "8px 12px", borderRadius: "8px", margin: "0 0 20px" }}>
              Check the listed inboxes/messages and enter the code below to approve your profile.
            </p>

            <form onSubmit={handleVerifyAndRegisterAdv}>
              <div className="su-field">
                <input
                  type="text"
                  className="su-input rg-otp-input"
                  placeholder="000000"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, ""));
                    setOtpErr("");
                  }}
                  autoFocus
                  disabled={loading}
                />
                {otpErr && <p className="su-field-err" style={{ color: "#ef4444", marginTop: 6 }}>⚠ {otpErr}</p>}
              </div>

              <button type="submit" className="su-btn-primary su-btn-lg" style={{ marginTop: 16 }} disabled={loading}>
                {loading ? <><span className="su-spinner" /> Verifying…</> : "Verify & Approve Profile →"}
              </button>
            </form>

            <div style={{ marginTop: 18, fontSize: "0.88rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                style={{ background: "none", border: 0, color: "#94a3b8", cursor: "pointer", textDecoration: "underline", font: "inherit" }}
                onClick={() => setOtpStep(false)}
                disabled={loading}
              >
                ← Edit Form Details
              </button>

              <button
                type="button"
                style={{ background: "none", border: 0, color: resendTimer > 0 ? "#94a3b8" : "#2dd4bf", cursor: resendTimer > 0 ? "default" : "pointer", fontWeight: 700, font: "inherit" }}
                onClick={handleResendAdvOtp}
                disabled={resendTimer > 0 || loading}
              >
                {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : "Resend OTP Code"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="su-card">
        {/* Top Control Bar: Back link, Language switcher, Theme toggle */}
        <div className="su-top-bar">
          {showBackToSignup ? (
            <Link to="/signup" className="su-back-link" style={{ marginRight: "auto" }}>
              <span className="su-back-arrow">←</span> Back to Sign Up Page
            </Link>
          ) : (
            <Link to="/" className="su-back-link" style={{ marginRight: "auto" }}>
              <span className="su-back-arrow">←</span> {t.backHome}
            </Link>
          )}

          <div className="su-top-controls">
            <div className="su-lang-pills">
              <button
                type="button"
                className={`su-lang-btn ${lang === "en" ? "active" : ""}`}
                onClick={() => handleLangToggle("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={`su-lang-btn ${lang === "kn" ? "active" : ""}`}
                onClick={() => handleLangToggle("kn")}
              >
                ಕನ್ನಡ
              </button>
            </div>

            <button
              type="button"
              className="su-theme-btn"
              onClick={handleThemeToggle}
              title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {theme === "dark" ? `☀️ ${t.themeLight}` : `🌙 ${t.themeDark}`}
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="su-header">
          <div className="su-badge-pill">
            <span className="su-badge-sparkle">✨</span> {t.badge}
          </div>

          <div className="su-logo-wrap">
            <Link to="/" className="su-logo" title="Advocate Hub - Home">
              <BrandLogo size={46} wordmark={true} dark={theme === "dark"} />
            </Link>
          </div>

          <h1 className="su-title">{t.title}</h1>
          <p className="su-subtitle">{t.subtitle}</p>
        </div>

        {/* ══ STEP 1: INTERACTIVE ROLE SELECTION DECK ══ */}
        {isRoleSelectionView && <div className="su-role-section">
          <div className="su-role-header">
            <span className="su-role-step-pill">{t.step1}</span>
            <h2 className="su-role-heading">{t.chooseRole}</h2>
            <p className="su-role-subheading">{t.chooseRoleSubtitle}</p>
          </div>

          <div className="su-role-grid">
            {/* Client Card */}
            <div
              className={`su-role-card ${tab === "client" ? "active" : ""}`}
              onClick={() => {
                navigate("/client-register");
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/client-register");
                }
              }}
            >
              <div className="su-role-card-top">
                <div className="su-role-avatar-wrap su-role-client-avatar">
                  <span className="su-role-emoji">👤</span>
                </div>
                <div className="su-role-badge-box">
                  {tab === "client" ? (
                    <span className="su-role-status active">
                      <span className="su-status-dot">●</span> {t.selected}
                    </span>
                  ) : (
                    <span className="su-role-status inactive">
                      {t.selectRole} →
                    </span>
                  )}
                </div>
              </div>

              <div className="su-role-info">
                <span className="su-role-category client">{t.clientRoleBadge}</span>
                <h3 className="su-role-title">{t.clientRoleTitle}</h3>
                <p className="su-role-desc">{t.clientRoleSubtitle}</p>
              </div>

              <div className="su-role-perks">
                {t.clientPerks.map((perk, i) => (
                  <span key={i} className="su-role-perk-item">
                    <span className="su-perk-check">✓</span> {perk}
                  </span>
                ))}
              </div>
            </div>

            {/* Advocate Card */}
            <div
              className={`su-role-card ${tab === "advocate" ? "active" : ""}`}
              onClick={() => {
                navigate("/signup?role=advocate");
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/signup?role=advocate");
                }
              }}
            >
              <div className="su-role-card-top">
                <div className="su-role-avatar-wrap su-role-advocate-avatar">
                  <span className="su-role-emoji">⚖️</span>
                </div>
                <div className="su-role-badge-box">
                  {tab === "advocate" ? (
                    <span className="su-role-status active advocate">
                      <span className="su-status-dot">●</span> {t.selected}
                    </span>
                  ) : (
                    <span className="su-role-status inactive">
                      {t.selectRole} →
                    </span>
                  )}
                </div>
              </div>

              <div className="su-role-info">
                <span className="su-role-category advocate">{t.advocateRoleBadge}</span>
                <h3 className="su-role-title">{t.advocateRoleTitle}</h3>
                <p className="su-role-desc">{t.advocateRoleSubtitle}</p>
              </div>

              <div className="su-role-perks">
                {t.advocatePerks.map((perk, i) => (
                  <span key={i} className="su-role-perk-item">
                    <span className="su-perk-check">✓</span> {perk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Role Context Notification Banner */}
          <div className={`su-role-guidance ${tab === "advocate" ? "advocate" : "client"}`}>
            <span className="su-guidance-icon">{tab === "advocate" ? "💼" : "🔍"}</span>
            <div className="su-guidance-content">
              <strong>{tab === "client" ? (isKn ? "ಗ್ರಾಹಕರ ನೋಂದಣಿ:" : "Client Registration:") : (isKn ? "ವಕೀಲರ ಪ್ರವೇಶ:" : "Advocate Onboarding:")}</strong>{" "}
              {tab === "client" ? t.clientBanner : t.advocateBanner}
            </div>
          </div>
        </div>}

        {/* ══ CLIENT FORM ══ */}
        {roleParam === "client" && tab === "client" && (
          <form className="su-form" onSubmit={handleSubmit} noValidate>

            {/* Target Advocate Direct Consultation Banner */}
            {targetAdvocate && (
              <div className="su-target-adv-banner">
                <div className="su-target-adv-icon">💬</div>
                <div className="su-target-adv-info">
                  <span className="su-target-adv-badge">✓ DIRECT CONSULTATION ACCESS</span>
                  <h3 className="su-target-adv-title">
                    Register Client Account to Chat with <strong>{targetAdvocate.name}</strong>
                  </h3>
                  <p className="su-target-adv-meta">
                    {targetAdvocate.speciality ? `${targetAdvocate.speciality} · ` : ""}
                    {targetAdvocate.city || targetAdvocate.district ? `📍 ${targetAdvocate.city || targetAdvocate.district} · ` : ""}
                    Create your client account to start direct consultation chat.
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Personal Information */}
            <div className="su-form-section-title">
              <span className="su-section-num">1</span> {t.personalInfo}
            </div>

            <div className="su-grid-2">
              <Field label={t.clientFullName} required error={clientErr.fullName}>
                <Input
                  icon="👤"
                  placeholder={isKn ? "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು" : "e.g. Ramesh Kumar"}
                  value={client.fullName}
                  onChange={(e) => setC("fullName", e.target.value)}
                  error={clientErr.fullName}
                  disabled={loading}
                />
              </Field>

              <Field label={t.clientPhone} required error={clientErr.phone}>
                <Input
                  icon="📱"
                  placeholder={isKn ? "೧೦-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ" : "10-digit mobile number"}
                  type="tel"
                  value={client.phone}
                  onChange={(e) => setC("phone", e.target.value)}
                  error={clientErr.phone}
                  disabled={loading}
                  maxLength={10}
                />
              </Field>
            </div>

            <Field label={t.clientEmail} required error={clientErr.email}>
              <Input
                icon="✉️"
                type="email"
                placeholder="your.email@example.com"
                value={client.email}
                onChange={(e) => setC("email", e.target.value)}
                error={clientErr.email}
                disabled={loading}
                rightEl={client.email && isValidEmail(client.email) && <span className="su-valid">✓</span>}
              />
            </Field>

            {/* Step 2: Location & Legal Needs */}
            <div className="su-form-section-title">
              <span className="su-section-num">2</span> {t.locationLegal}
            </div>

            <div className="su-grid-2">
              <Field label={t.clientCity} error={clientErr.city}>
                <Select
                  icon="📍"
                  value={client.city}
                  onChange={(e) => setC("city", e.target.value)}
                  disabled={loading}
                >
                  <option value="">{t.clientCitySelect}</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </Field>

              <Field label={t.clientLegalMatter} error={clientErr.legalIssue}>
                <Select
                  icon="⚖️"
                  value={client.legalIssue}
                  onChange={(e) => setC("legalIssue", e.target.value)}
                  disabled={loading}
                >
                  <option value="">{t.clientLegalMatterSelect}</option>
                  {PRACTICE_AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </Select>
              </Field>
            </div>

            {/* Popular Legal Concerns Quick Pills */}
            <div className="su-client-quick-tags">
              <div className="su-quick-tag-label">{t.clientQuickTagsTitle}</div>
              <div className="su-quick-tag-pills">
                {POPULAR_LEGAL_ISSUES.map((issue) => (
                  <button
                    key={issue}
                    type="button"
                    className={`su-quick-tag-pill ${client.legalIssue === issue ? "active" : ""}`}
                    onClick={() => setC("legalIssue", client.legalIssue === issue ? "" : issue)}
                  >
                    <span>⚖️ {issue}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Security & Credentials */}
            <div className="su-form-section-title">
              <span className="su-section-num">3</span> {t.security}
            </div>

            <div className="su-grid-2">
              <Field label={t.password} required error={clientErr.password}>
                <Input
                  icon="🔒"
                  type={showPw ? "text" : "password"}
                  placeholder={isKn ? "ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳು" : "Min 6 characters"}
                  value={client.password}
                  onChange={(e) => setC("password", e.target.value)}
                  error={clientErr.password}
                  disabled={loading}
                  rightEl={
                    <button
                      type="button"
                      className="su-eye"
                      onClick={() => setShowPw((p) => !p)}
                    >
                      {showPw ? "🙈" : "👁️"}
                    </button>
                  }
                />
                <PwStrength pw={client.password} />
              </Field>

              <Field label={t.confirmPassword} required error={clientErr.confirmPw}>
                <Input
                  icon="🔑"
                  type={showCPw ? "text" : "password"}
                  placeholder={isKn ? "ಪಾಸ್‌ವರ್ಡ್ ಪುನರಾವರ್ತಿಸಿ" : "Re-enter password"}
                  value={client.confirmPw}
                  onChange={(e) => setC("confirmPw", e.target.value)}
                  error={clientErr.confirmPw}
                  disabled={loading}
                  rightEl={
                    client.confirmPw && client.password === client.confirmPw ? (
                      <span className="su-valid">✓</span>
                    ) : (
                      <button
                        type="button"
                        className="su-eye"
                        onClick={() => setShowCPw((p) => !p)}
                      >
                        {showCPw ? "🙈" : "👁️"}
                      </button>
                    )
                  }
                />
              </Field>
            </div>

            {/* Client Instant Advantage Card */}
            <div className="su-client-benefit-card">
              <span className="su-client-benefit-icon">⚡</span>
              <div className="su-client-benefit-body">
                <div className="su-client-benefit-title">{t.clientInstantTitle}</div>
                <div className="su-client-benefit-text">{t.clientInstantDesc}</div>
              </div>
            </div>

            <label className="su-agree">
              <input
                type="checkbox"
                checked={client.agreeTerms}
                onChange={(e) => setC("agreeTerms", e.target.checked)}
              />
              <span>
                {t.clientAgreeText}{" "}
                <a href="/terms" target="_blank" rel="noreferrer">
                  {t.termsOfService}
                </a>{" "}
                {t.andWord}{" "}
                <a href="/privacy" target="_blank" rel="noreferrer">
                  {t.privacyPolicy}
                </a>
              </span>
            </label>
            {clientErr.agreeTerms && <p className="su-field-err">⚠ {clientErr.agreeTerms}</p>}

            <button type="submit" className="su-btn-primary su-btn-lg" disabled={loading}>
              {loading ? (
                <><span className="su-spinner" /> {t.creatingAccount}</>
              ) : (
                <><span>✨</span> {t.createClientBtn} →</>
              )}
            </button>

            <p className="su-login-link">
              {t.alreadyAccount}{" "}
              <Link
                to={
                  redirectParam
                    ? `/client-login?redirect=${encodeURIComponent(redirectParam)}`
                    : targetAdvocate
                    ? `/client-login?redirect=${encodeURIComponent(`/client-dashboard?advocateId=${targetAdvocate.id}`)}`
                    : "/client-login"
                }
              >
                {t.signInHere} →
              </Link>
            </p>
          </form>
        )}

        {/* ══ ADVOCATE FORM ══ */}
        {roleParam === "advocate" && tab === "advocate" && (
          <form className="su-form" onSubmit={handleSubmit} noValidate>

            {/* Demo fill from JSON */}
            <div className="su-demo-section">
              <button
                type="button"
                className="su-demo-toggle"
                onClick={() => setShowDemoAdvocates((p) => !p)}
              >
                <span className="su-demo-toggle-left">
                  <span>⚖️</span>
                  <span>{showDemoAdvocates ? (isKn ? "ಮಾದರಿ ಪ್ರೊಫೈಲ್‌ಗಳನ್ನು ಮರೆಮಾಡಿ" : "Hide Sample Advocate Profiles") : (isKn ? "ಮಾದರಿ ಪ್ರೊಫೈಲ್‌ಗಳನ್ನು ಬಳಸಿ" : "Use Sample Advocate Profiles")}</span>
                </span>
                <span className="su-demo-toggle-badge">{showDemoAdvocates ? "▲ Close" : "▼ Auto-Fill"}</span>
              </button>
              {showDemoAdvocates && (
                <div className="su-demo-list">
                  <div className="su-demo-label" style={{ gridColumn: "1 / -1" }}>
                    {isKn ? "ಫಾರ್ಮ್ ಅನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಭರ್ತಿ ಮಾಡಲು ಪ್ರೊಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ:" : "Select a profile to auto-fill the form:"}
                  </div>
                  {ADVOCATES_JSON.map((a) => (
                    <AdvCard key={a.email} adv={a} onFill={fillAdvocate} />
                  ))}
                </div>
              )}
            </div>

            {/* Step 1: Personal Info */}
            <div className="su-form-section-title">
              <span className="su-section-num">1</span> {t.personalInfo}
            </div>

            <div className="su-grid-2">
              <Field label={t.fullName} required error={advErr.fullName}>
                <Input
                  icon="👤"
                  placeholder={isKn ? "ವಕೀಲರ ಪೂರ್ಣ ಹೆಸರು" : "Adv. Full Name"}
                  value={adv.fullName}
                  onChange={(e) => setA("fullName", e.target.value)}
                  error={advErr.fullName}
                  disabled={loading}
                />
              </Field>

              <Field label={t.phone} required error={advErr.phone}>
                <Input
                  icon="📱"
                  placeholder={isKn ? "೧೦-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ" : "10-digit mobile"}
                  type="tel"
                  value={adv.phone}
                  onChange={(e) => setA("phone", e.target.value)}
                  error={advErr.phone}
                  disabled={loading}
                  maxLength={10}
                />
              </Field>
            </div>

            <Field label={t.email} required error={advErr.email}>
              <Input
                icon="✉️"
                type="email"
                placeholder="advocate@email.com"
                value={adv.email}
                onChange={(e) => setA("email", e.target.value)}
                error={advErr.email}
                disabled={loading}
                rightEl={adv.email && isValidEmail(adv.email) && <span className="su-valid">✓</span>}
              />
            </Field>

            {/* Step 2: Bar Council & Credentials */}
            <div className="su-form-section-title">
              <span className="su-section-num">2</span> {t.professionalDetails}
            </div>

            <div className="su-grid-2">
              <Field
                label={isKn ? "ಬಾರ್ ನೋಂದಣಿ ಸಂಖ್ಯೆ" : "Bar Enrollment Number"}
                required
                error={advErr.barId}
                hint={isKn ? "ಉದಾ: KAR/1234/2018" : "e.g. KAR/1234/2018 or BCI/KA/2016/4321"}
              >
                <Input
                  icon="🪪"
                  placeholder="e.g. KAR/1234/2018"
                  value={adv.barId}
                  onChange={(e) => setA("barId", e.target.value)}
                  error={advErr.barId}
                  disabled={loading}
                />
              </Field>

              <Field label={isKn ? "ಬಾರ್ ಕೌನ್ಸಿಲ್" : "Bar Council"} error={advErr.barCouncil}>
                <Select
                  icon="🏛️"
                  value={adv.barCouncil}
                  onChange={(e) => setA("barCouncil", e.target.value)}
                  disabled={loading}
                >
                  <option value="">{isKn ? "ಬಾರ್ ಕೌನ್ಸಿಲ್ ಆಯ್ಕೆಮಾಡಿ" : "Select bar council"}</option>
                  {BAR_COUNCILS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </Select>
              </Field>
            </div>

            {/* Step 3: Practice Areas & Specialization */}
            <div className="su-form-section-title">
              <span className="su-section-num">3</span> {t.practiceAreas}
            </div>

            <div className="su-practice-box">
              <div className="su-practice-header">
                <label className="su-label" style={{ margin: 0 }}>
                  {isKn ? "ಪರಿಣತಿ ಮತ್ತು ಅಭ್ಯಾಸ ಕ್ಷೇತ್ರಗಳು" : "Practice Area & Fields of Expertise"} <span className="su-req">*</span>
                </label>
                {adv.specialities && adv.specialities.length > 0 && (
                  <span className="su-target-court-verified">
                    ✓ {adv.specialities.length} {adv.specialities.length === 1 ? (isKn ? "ಕ್ಷೇತ್ರ ಆಯ್ಕೆಯಾಗಿದೆ" : "field selected") : (isKn ? "ಕ್ಷೇತ್ರಗಳು ಆಯ್ಕೆಯಾಗಿವೆ" : "fields selected")}
                  </span>
                )}
              </div>

              {/* Selected practice areas displayed as interactive tags */}
              {adv.specialities && adv.specialities.length > 0 ? (
                <div className="su-practice-tags-wrap">
                  {adv.specialities.map((item) => (
                    <span key={item} className="su-practice-tag">
                      <span>⚖️ {item}</span>
                      <button
                        type="button"
                        className="su-practice-remove-btn"
                        onClick={() => handleRemovePracticeArea(item)}
                        title={`Remove ${item}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="su-practice-empty">
                  <span>ℹ️</span>
                  <span>{isKn ? "ಇನ್ನೂ ಯಾವುದೇ ಅಭ್ಯಾಸ ಕ್ಷೇತ್ರಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ. ಕೆಳಗಿನ ಪಟ್ಟಿಯಿಂದ ಆರಿಸಿ ಅಥವಾ ಕಸ್ಟಮ್ ಕ್ಷೇತ್ರ ಸೇರಿಸಿ." : "No practice areas selected yet. Pick from the list below or add a custom field."}</span>
                </div>
              )}

              {/* Selector and Custom Add Row */}
              <div className="su-practice-controls-row">
                <Select
                  icon="⚖️"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleTogglePracticeArea(e.target.value);
                    }
                  }}
                  error={advErr.speciality}
                  disabled={loading}
                >
                  <option value="">{isKn ? "+ ಅಭ್ಯಾಸ ಕ್ಷೇತ್ರವನ್ನು ಸೇರಿಸಿ…" : "+ Choose Practice Area to add…"}</option>
                  {PRACTICE_AREAS.filter((a) => !(adv.specialities || []).includes(a)).map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </Select>

                <div className="su-custom-field-box">
                  <input
                    type="text"
                    className="su-custom-input"
                    placeholder={isKn ? "ಕಸ್ಟಮ್ ಪರಿಣತಿ (ಉದಾ. RERA, NCLT)" : "Or type custom expertise (e.g. RERA, NCLT)"}
                    value={customArea}
                    onChange={(e) => setCustomArea(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (customArea.trim()) {
                          handleAddCustomPracticeArea(customArea);
                          setCustomArea("");
                        }
                      }
                    }}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="su-btn-add-field"
                    onClick={() => {
                      if (customArea.trim()) {
                        handleAddCustomPracticeArea(customArea);
                        setCustomArea("");
                      }
                    }}
                    disabled={loading}
                  >
                    + {isKn ? "ಸೇರಿಸಿ" : "Add Field"}
                  </button>
                </div>
              </div>

              {advErr.speciality && <p className="su-field-err" style={{ marginTop: 8 }}>⚠ {advErr.speciality}</p>}
            </div>

            {/* Step 4: Court Hierarchy & Jurisdiction */}
            <div className="su-form-section-title">
              <span className="su-section-num">4</span> {t.courtJurisdiction}
            </div>

            <div className="su-court-box">
              <div className="su-court-header">
                <div className="su-court-header-left">
                  <span className="su-court-header-icon">🏛️</span>
                  <div>
                    <div className="su-court-header-title">
                      {isKn ? "ನ್ಯಾಯಾಲಯದ ಶ್ರೇಣಿ ಮತ್ತು ವ್ಯಾಪ್ತಿ" : "Court Hierarchy & Jurisdiction"}
                    </div>
                    <div className="su-court-header-sub">
                      {isKn ? "ಕೆಳಗಿನ ಹಂತಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ — ಗುರಿ ನ್ಯಾಯಾಲಯವು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನಿರ್ಧರಿಸಲ್ಪಡುತ್ತದೆ" : "Select the 3 levels below — Target Court is determined automatically"}
                    </div>
                  </div>
                </div>
                <span className="su-court-badge">
                  {isKn ? "೩ ಹಂತಗಳ ಪ್ರಕ್ರಿಯೆ" : "3 Dependent Steps"}
                </span>
              </div>

              <div className="su-court-grid">
                {/* 1st Section: Level of Court */}
                <Field label={isKn ? "ಹಂತ ೧: ನ್ಯಾಯಾಲಯದ ಮಟ್ಟ" : "Step 1: Level of Court"} required error={advErr.courtLevel}>
                  <Select
                    icon="⚖️"
                    value={adv.courtLevel}
                    onChange={(e) => handleCourtLevelChange(e.target.value)}
                    error={advErr.courtLevel}
                    disabled={loading}
                  >
                    <option value="">{isKn ? "-- ನ್ಯಾಯಾಲಯದ ಮಟ್ಟ ಆಯ್ಕೆಮಾಡಿ --" : "-- Choose Court Level --"}</option>
                    {COURT_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </Select>
                </Field>

                {/* Conditional Branch for High Court / Supreme Court or District + Taluk */}
                {adv.courtLevel === "High Court" ? (
                  <div style={{ gridColumn: "span 2" }}>
                    <Field label={isKn ? "ಹಂತ ೨: ಹೈಕೋರ್ಟ್ ಪೀಠ" : "Step 2: High Court Bench"} required>
                      <Select
                        icon="🏛️"
                        value={adv.bench || HIGH_COURT_BENCHES[0]}
                        onChange={(e) => handleBenchChange(e.target.value)}
                        disabled={loading}
                      >
                        {HIGH_COURT_BENCHES.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </Select>
                    </Field>
                  </div>
                ) : adv.courtLevel === "Supreme Court" ? (
                  <div style={{ gridColumn: "span 2" }}>
                    <Field label={isKn ? "ಹಂತ ೨: ವ್ಯಾಪ್ತಿ ಮತ್ತು ಸ್ಥಳ" : "Step 2: Jurisdiction & Location"}>
                      <Input
                        icon="📍"
                        value="Supreme Court of India (New Delhi)"
                        readOnly
                        disabled
                        style={{ fontWeight: 600 }}
                      />
                    </Field>
                  </div>
                ) : (
                  <>
                    {/* 2nd Section: District */}
                    <Field label={isKn ? "ಹಂತ ೨: ಜಿಲ್ಲೆ" : "Step 2: District"} required error={advErr.district}>
                      <Select
                        icon="🗺️"
                        value={adv.district}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        error={advErr.district}
                        disabled={loading}
                      >
                        <option value="">{isKn ? "-- ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ --" : "-- Select District --"}</option>
                        {getDistricts().map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </Select>
                    </Field>

                    {/* 3rd Section: Taluk (Dependent on District) */}
                    <Field
                      label={isKn ? "ಹಂತ ೩: ತಾಲೂಕು" : "Step 3: Taluk"}
                      required={adv.courtLevel === "Taluk / JMFC / Civil Court" || adv.courtLevel === "Revenue Court / Land Tribunal"}
                      error={advErr.taluk}
                      hint={!adv.district ? (isKn ? "ಮೊದಲು ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Choose district first") : undefined}
                    >
                      <Select
                        icon="📍"
                        value={adv.taluk}
                        onChange={(e) => handleTalukChange(e.target.value)}
                        error={advErr.taluk}
                        disabled={loading || !adv.district}
                      >
                        <option value="">
                          {!adv.district ? (isKn ? "ಮೊದಲು ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ" : "Select District first") : (isKn ? "-- ತಾಲೂಕು ಆಯ್ಕೆಮಾಡಿ --" : "-- Select Taluk --")}
                        </option>
                        {getTaluksForDistrict(adv.district).map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Select>
                    </Field>
                  </>
                )}
              </div>

              {/* Target Court Output Banner — Only what was selected! */}
              {adv.court ? (
                <div className="su-target-court-card">
                  <div className="su-target-court-top">
                    <div className="su-target-court-tag">
                      🎯 {isKn ? "ಗುರಿ ನ್ಯಾಯಾಲಯದ ವ್ಯಾಪ್ತಿ (ಲಿಂಕ್ ಮಾಡಲಾಗಿದೆ)" : "Target Court Jurisdiction (Selected & Linked)"}
                    </div>
                    <span className="su-target-court-verified">
                      ✓ {isKn ? "ದೃಢೀಕರಿಸಿದ ವ್ಯಾಪ್ತಿ" : "Verified Jurisdiction"}
                    </span>
                  </div>

                  <div className="su-target-court-name">
                    🏛️ {adv.court}
                  </div>

                  {/* Summary Chips: ONLY what is selected! */}
                  <div className="su-target-court-chips">
                    {adv.courtLevel && (
                      <span className="su-court-chip-item">
                        ⚖️ {isKn ? "ಮಟ್ಟ:" : "Level:"} <strong>{adv.courtLevel}</strong>
                      </span>
                    )}
                    {adv.district && (
                      <span className="su-court-chip-item">
                        🗺️ {isKn ? "ಜಿಲ್ಲೆ:" : "District:"} <strong>{adv.district}</strong>
                      </span>
                    )}
                    {adv.taluk && (
                      <span className="su-court-chip-item">
                        📍 {isKn ? "ತಾಲೂಕು:" : "Taluk:"} <strong>{adv.taluk}</strong>
                      </span>
                    )}
                    {adv.city && (
                      <span className="su-court-chip-item">
                        🏙️ {isKn ? "ಮೂಲ ಸ್ಥಳ:" : "Base Location:"} <strong>{adv.city}</strong>
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="su-target-court-empty">
                  <span>👉</span>
                  <span>{isKn ? "ಗುರಿ ನ್ಯಾಯಾಲಯದ ವ್ಯಾಪ್ತಿಯನ್ನು ಹೊಂದಿಸಲು ದಯವಿಟ್ಟು ಮೇಲೆ ನ್ಯಾಯಾಲಯದ ಮಟ್ಟ ಮತ್ತು ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ." : "Please choose Level of Court and District above to set the target court jurisdiction."}</span>
                </div>
              )}

              {advErr.court && <p className="su-field-err" style={{ marginTop: 8 }}>⚠ {advErr.court}</p>}
            </div>

            {/* Step 5: Location & Experience */}
            <div className="su-form-section-title">
              <span className="su-section-num">5</span> {t.locationLegal}
            </div>

            <div className="su-grid-2">
              <Field
                label={isKn ? "ನಗರ / ಸ್ಥಳದ ಹೆಸರು" : "City / Location Name"}
                required
                error={advErr.city}
                hint={isKn ? "ತಾಲೂಕು/ಜಿಲ್ಲೆಯಿಂದ ಸ್ವಯಂ-ಭರ್ತಿ ಅಥವಾ ಕಸ್ಟಮೈಸ್ ಮಾಡಿ" : "Auto-filled from Taluk/District or customize"}
              >
                <Input
                  icon="📍"
                  placeholder={isKn ? "ಉದಾ: ಗೋಕಾಕ, ಬೆಳಗಾವಿ" : "e.g. Gokak, Belagavi"}
                  value={adv.city}
                  onChange={(e) => setA("city", e.target.value)}
                  error={advErr.city}
                  disabled={loading}
                />
              </Field>

              <Field label={isKn ? "ಅನುಭವದ ವರ್ಷಗಳು" : "Years of Experience"} error={advErr.experience}>
                <Select
                  icon="📅"
                  value={adv.experience}
                  onChange={(e) => setA("experience", e.target.value)}
                  disabled={loading}
                >
                  <option value="">{isKn ? "ಅನುಭವವನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Select experience"}</option>
                  {EXPERIENCE_YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Select>
              </Field>
            </div>

            {/* Step 6: Bio & Profile Image */}
            <div className="su-form-section-title">
              <span className="su-section-num">6</span> {t.bioPhoto}
            </div>

            <Field
              label={isKn ? "ಸಂಕ್ಷಿಪ್ತ ಪರಿಚಯ (Bio)" : "Short Bio"}
              error={advErr.bio}
              hint={isKn ? "ನಿಮ್ಮ ಪರಿಣತಿಯ ಬಗ್ಗೆ ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ (ಗರಿಷ್ಠ ೩೦೦ ಅಕ್ಷರಗಳು)" : "A brief description about your expertise (max 300 chars)"}
            >
              <div className="su-textarea-wrap">
                <textarea
                  className="su-textarea"
                  rows={3}
                  maxLength={300}
                  placeholder={isKn ? "ಉದಾ. ಕ್ರಿಮಿನಲ್ ಕಾನೂನಿನಲ್ಲಿ ೧೦+ ವರ್ಷಗಳ ಅನುಭವ, ಜಾಮೀನು ಅರ್ಜಿಗಳು ಮತ್ತು ಜಿಲ್ಲಾ ನ್ಯಾಯಾಲಯಗಳಲ್ಲಿ ಪರಿಣತಿ…" : "e.g. 10+ years in criminal defense, specializing in bail matters and district courts…"}
                  value={adv.bio}
                  onChange={(e) => setA("bio", e.target.value)}
                  disabled={loading}
                />
                <span className="su-char-count">{adv.bio.length}/300</span>
              </div>
            </Field>

            <Field
              label={isKn ? "ಪ್ರೊಫೈಲ್ ಚಿತ್ರ" : "Profile Image"}
              required
              error={advErr.avatarData}
              hint={isKn ? "೨ MB ವರೆಗಿನ ಸ್ಪಷ್ಟ JPG, PNG, ಅಥವಾ WEBP ಚಿತ್ರವನ್ನು ಬಳಸಿ" : "Use a clear JPG, PNG, or WEBP image up to 2 MB"}
            >
              <div className="su-avatar-upload-card">
                <div className="su-avatar-thumb-box">
                  {adv.avatarData ? (
                    <img
                      src={adv.avatarData}
                      alt="Profile preview"
                      className="su-avatar-thumb-img"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div className="su-avatar-upload-body">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="su-avatar-input"
                    onChange={handleAvatarChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </Field>

            {/* Step 7: Security & Verification */}
            <div className="su-form-section-title">
              <span className="su-section-num">7</span> {t.security}
            </div>

            <div className="su-grid-2">
              <Field label={t.password} required error={advErr.password}>
                <Input
                  icon="🔒"
                  type={showPw ? "text" : "password"}
                  placeholder={isKn ? "ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳು" : "Min 6 characters"}
                  value={adv.password}
                  onChange={(e) => setA("password", e.target.value)}
                  error={advErr.password}
                  disabled={loading}
                  rightEl={
                    <button
                      type="button"
                      className="su-eye"
                      onClick={() => setShowPw((p) => !p)}
                    >
                      {showPw ? "🙈" : "👁️"}
                    </button>
                  }
                />
                <PwStrength pw={adv.password} />
              </Field>

              <Field label={t.confirmPassword} required error={advErr.confirmPw}>
                <Input
                  icon="🔑"
                  type={showCPw ? "text" : "password"}
                  placeholder={isKn ? "ಪಾಸ್‌ವರ್ಡ್ ಪುನರಾವರ್ತಿಸಿ" : "Re-enter password"}
                  value={adv.confirmPw}
                  onChange={(e) => setA("confirmPw", e.target.value)}
                  error={advErr.confirmPw}
                  disabled={loading}
                  rightEl={
                    adv.confirmPw && adv.password === adv.confirmPw ? (
                      <span className="su-valid">✓</span>
                    ) : (
                      <button
                        type="button"
                        className="su-eye"
                        onClick={() => setShowCPw((p) => !p)}
                      >
                        {showCPw ? "🙈" : "👁️"}
                      </button>
                    )
                  }
                />
              </Field>
            </div>

            {/* Advocate verification note */}
            <div className="su-verify-card">
              <span className="su-verify-shield-icon">🛡️</span>
              <div className="su-verify-body">
                <div className="su-verify-title">
                  {isKn ? "ಪರಿಶೀಲನಾ ಪ್ರಕ್ರಿಯೆ" : "Verification Process"}
                </div>
                <div className="su-verify-text">
                  {isKn
                    ? "ನಿಮ್ಮ ಬಾರ್ ನೋಂದಣಿ ಸಂಖ್ಯೆಯನ್ನು ನಮ್ಮ ನಿರ್ವಾಹಕ ತಂಡವು ಪರಿಶೀಲಿಸುತ್ತದೆ. ಅನುಮೋದನೆಯ ನಂತರ ಗ್ರಾಹಕರು ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಬಹುದು ಮತ್ತು ಸಮಾಲೋಚನೆ ವಿನಂತಿಗಳನ್ನು ನೇರವಾಗಿ ಕಳುಹಿಸಬಹುದು."
                    : "Your Bar enrollment number will be verified by our admin team. Once approved on the Admin page, clients can find you and send consultation requests directly."}
                </div>
              </div>
            </div>

            <label className="su-agree">
              <input
                type="checkbox"
                checked={adv.agreeTerms}
                onChange={(e) => setA("agreeTerms", e.target.checked)}
              />
              <span>
                {isKn ? "ನಾನು ಸೇವಾ ನಿಯಮಗಳು, ಗೌಪ್ಯತಾ ನೀತಿ ಮತ್ತು ವಕೀಲರ ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಒಪ್ಪುತ್ತೇನೆ: " : "I agree to the "}
                <a href="/terms" target="_blank" rel="noreferrer">
                  {isKn ? "ಸೇವಾ ನಿಯಮಗಳು" : "Terms of Service"}
                </a>
                ,{" "}
                <a href="/privacy" target="_blank" rel="noreferrer">
                  {isKn ? "ಗೌಪ್ಯತಾ ನೀತಿ" : "Privacy Policy"}
                </a>{" "}
                {isKn ? "ಮತ್ತು " : "and "}
                <a href="/advocate-terms" target="_blank" rel="noreferrer">
                  {isKn ? "ವಕೀಲರ ಮಾರ್ಗಸೂಚಿಗಳು" : "Advocate Guidelines"}
                </a>
              </span>
            </label>
            {advErr.agreeTerms && <p className="su-field-err">⚠ {advErr.agreeTerms}</p>}

            <button type="submit" className="su-btn-advocate su-btn-lg" disabled={loading}>
              {loading ? (
                <><span className="su-spinner" /> {t.registering}</>
              ) : (
                <><span>⚖️</span> {t.createAdvocateBtn} →</>
              )}
            </button>

            <p className="su-login-link">
              {t.alreadyAdvocate}{" "}
              <Link to="/login">
                {t.signInHere} →
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
