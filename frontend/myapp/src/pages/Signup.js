/* eslint-disable */
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
    title: "Create Your Account",
    trustVerified: "Verified Advocates",
    trustSecure: "256-Bit SSL Secured",
    trustInstant: "Direct Consultations",
    trustCompliant: "BCI Compliant",
    step1: "STEP 1 · SELECT ACCOUNT TYPE",
    chooseRole: "Select Your Account Type",
    clientRoleTitle: "I'm a Client",
    clientPerks: ["Consult verified advocates", "Track case updates", "Legal advice & documents"],
    advocateRoleTitle: "I'm an Advocate",
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
    title: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    trustVerified: "ಪರಿಶೀಲಿತ ವಕೀಲರು",
    trustSecure: "೨೫೬-ಬಿಟ್ ಭದ್ರತೆ",
    trustInstant: "ನೇರ ಸಮಾಲೋಚನೆ",
    trustCompliant: "ಬಾರ್ ಕೌನ್ಸಿಲ್ ನಿಯಮಬದ್ಧ",
    step1: "ಹಂತ ೧ · ಖಾತೆಯ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    chooseRole: "ಖಾತೆಯ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    clientRoleTitle: "ನಾನು ಗ್ರಾಹಕ (Client)",
    clientPerks: ["ಪರಿಶೀಲಿತ ವಕೀಲರೊಂದಿಗೆ ಸಮಾಲೋಚನೆ", "ಪ್ರಕರಣದ ಮಾಹಿತಿ ಟ್ರ್ಯಾಕಿಂಗ್", "ಕಾನೂನು ಸಲಹೆ ಮತ್ತು ದಾಖಲೆಗಳು"],
    advocateRoleTitle: "ನಾನು ವಕೀಲ (Advocate)",
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

// ── Admin-Style Clean SVG Icons (Matching Admin Page rail system) ──
export const ADMIN_ICONS = {
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  pin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  court: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3L2 10h20L12 3z" />
    </svg>
  ),
  scale: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM7 21h10M12 3v18M3 7h18" />
    </svg>
  ),
  badge: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="7" y1="8" x2="17" y2="8" />
      <line x1="7" y1="12" x2="13" y2="12" />
      <circle cx="16" cy="14" r="2" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  camera: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  key: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  shieldCheck: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  arrowLeft: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  sparkle: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
    </svg>
  ),
};

// ── Helpers ───────────────────────────────────────────────────
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isValidPhone(p) { return /^\d{10}$/.test(p.replace(/\s|-/g, "")); }
function formatOtpChannels(channels) {
  const labels = { email: "Email", sms: "SMS", phone: "SMS", whatsapp: "WhatsApp" };
  const expanded = channels.flatMap((channel) => channel === "all" ? ["email", "sms"] : [channel]);
  return expanded.map((channel) => labels[channel] || channel).join(", ");
}
function maskPhone(p) {
  if (!p) return "";
  const cleaned = p.replace(/\D/g, "");
  if (cleaned.length <= 4) return cleaned;
  const last4 = cleaned.slice(-4);
  return `******${last4}`;
}

function getInitials(name = "") {
  const clean = name.replace(/^adv\.?\s*/i, "").trim();
  if (!clean) return "AD";
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name = "") {
  const palette = ["#2563eb", "#16a34a", "#7c3aed", "#dc2626", "#ea580c", "#0891b2", "#0f766e", "#9333ea"];
  const sum = (name || "Advocate").split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return palette[sum % palette.length];
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
function SuccessScreen({ type, name, onLogin, adv = {}, channel = "email" }) {
  const channelLabel = channel === "whatsapp" ? "WhatsApp" : channel === "sms" ? "SMS" : "Email";

  return (
    <div className="su-success" style={{ maxWidth: 540, margin: "0 auto", textAlign: "center" }}>
      <div className="su-success-icon" style={{ fontSize: "3.2rem", marginBottom: 10 }}>
        {type === "client" ? "✅" : "⏳"}
      </div>
      <h2 className="su-success-title" style={{ fontSize: "1.7rem", marginBottom: 8 }}>
        {type === "client" ? "Registration Successful" : "Registration Submitted · Pending Admin Approval"}
      </h2>
      <p className="su-success-msg" style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--su-muted, #94a3b8)", marginBottom: 18 }}>
        Welcome to Advocate Hub, <strong>{name}</strong>!<br />
        {type === "advocate" ? (
          <>
            Your credentials were verified via <strong>{channelLabel}</strong>. Your advocate profile has been registered and is currently <strong>awaiting administrator approval</strong> before your dashboard is activated.
          </>
        ) : (
          "Your client account has been created successfully."
        )}
      </p>

      {type === "advocate" && (
        <div style={{
          background: "rgba(245, 158, 11, 0.08)",
          border: "1px solid rgba(245, 158, 11, 0.35)",
          borderRadius: 12,
          padding: "18px 20px",
          textAlign: "left",
          margin: "18px 0 22px",
          fontSize: "0.9rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "#d97706", marginBottom: 12 }}>
            <span style={{ fontSize: "1.2rem" }}>⏳</span>
            <span>Status: Awaiting Administrator Review</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", color: "var(--su-text, #e2e8f0)", fontSize: "0.86rem" }}>
            {adv.barId && <div><strong>Bar Council ID:</strong> {adv.barId}</div>}
            {adv.city && <div><strong>Location:</strong> {adv.city}</div>}
            {adv.email && <div style={{ wordBreak: "break-all" }}><strong>Email:</strong> {adv.email}</div>}
            {adv.phone && <div><strong>Mobile:</strong> {adv.phone}</div>}
          </div>

          <hr style={{ border: 0, borderTop: "1px solid rgba(245, 158, 11, 0.2)", margin: "14px 0 10px" }} />
          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--su-muted, #94a3b8)", lineHeight: 1.5 }}>
            🛡️ <strong>Admin Verification:</strong> Our compliance team manually verifies all Bar Council credentials to ensure platform security. Your application is in the admin queue now. Once approved, you will be able to log in to your dashboard. For expedited activation, contact: <a href="mailto:advocatehub.in@gmail.com" style={{ color: "#d97706", fontWeight: 600 }}>advocatehub.in@gmail.com</a>.
          </p>
        </div>
      )}

      <div className="su-success-steps" style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0 24px" }}>
        <div className="su-ss done" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#16a34a" }}>✅</span> Identity Verified via {channelLabel}
        </div>
        <div className="su-ss done" style={{ display: "flex", alignItems: "center", gap: 8, color: "#d97706", fontWeight: 700 }}>
          <span>⏳</span> Bar Council ID Review (Pending Admin Approval)
        </div>
        <div className="su-ss" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--su-muted, #64748b)" }}>
          <span>🔒</span> Advocate Dashboard &amp; Consultations (Unlocks upon approval)
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button className="su-btn-primary su-btn-lg" onClick={onLogin}>
          {type === "client" ? "Continue to Client Portal →" : "Proceed to Advocate Login →"}
        </button>
      </div>
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
export default function Signup({ defaultTab = "" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role") || searchParams.get("tab") || defaultTab || "";
  const advocateIdParam = searchParams.get("advocateId") || "";
  const advocateNameParam = searchParams.get("advocateName") || "";
  const redirectParam = searchParams.get("redirect") || "";

  const [tab,     setTab]     = useState(() => (roleParam === "advocate" || defaultTab === "advocate" ? "advocate" : "client"));
  const [activeStep, setActiveStep] = useState(1);
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
  const [otpChannel, setOtpChannel] = useState("email"); // "email" | "sms" | "whatsapp"
  const [resendTimer, setResendTimer] = useState(60);
  const [advOtpSetupError, setAdvOtpSetupError] = useState("");

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
  const [clientStep, setClientStep] = useState(1);

  const isClientStep1Done = Boolean(client.fullName.trim() && isValidPhone(client.phone) && isValidEmail(client.email));
  const isClientStep2Done = Boolean(client.password && client.password.length >= 6 && client.password === client.confirmPw && client.agreeTerms);

  const validateClientStep1 = () => {
    const e = {};
    if (!client.fullName.trim()) e.fullName = isKn ? "ಪೂರ್ಣ ಹೆಸರು ಅಗತ್ಯವಿದೆ" : "Full name is required";
    if (!client.phone.trim()) e.phone = isKn ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ" : "Phone is required";
    else if (!isValidPhone(client.phone)) e.phone = isKn ? "೧೦-ಅಂಕಿಯ ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ" : "Enter valid 10-digit phone";
    if (!client.email.trim()) e.email = isKn ? "ಇಮೇಲ್ ವಿಳಾಸ ಅಗತ್ಯವಿದೆ" : "Email is required";
    else if (!isValidEmail(client.email)) e.email = isKn ? "ಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ" : "Invalid email format";

    if (Object.keys(e).length > 0) {
      setClientErr((prev) => ({ ...prev, ...e }));
      showToast(isKn ? "ದಯವಿಟ್ಟು ಅಗತ್ಯವಿರುವ ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ" : "Please fill in required personal details", "error");
      return false;
    }
    return true;
  };

  const handleNextClientStep = () => {
    if (validateClientStep1()) {
      setClientStep(2);
    }
  };

  const handlePrevClientStep = () => {
    setClientStep(1);
  };

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
    let firstErrStep = null;
    if (!client.fullName.trim()) { e.fullName = isKn ? "ಪೂರ್ಣ ಹೆಸರು ಅಗತ್ಯವಿದೆ" : "Full name is required"; if (!firstErrStep) firstErrStep = 1; }
    if (!client.phone.trim()) { e.phone = isKn ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ" : "Phone is required"; if (!firstErrStep) firstErrStep = 1; }
    else if (!isValidPhone(client.phone)) { e.phone = isKn ? "೧೦-ಅಂಕಿಯ ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ" : "Enter valid 10-digit phone"; if (!firstErrStep) firstErrStep = 1; }
    if (!client.email.trim()) { e.email = isKn ? "ಇಮೇಲ್ ವಿಳಾಸ ಅಗತ್ಯವಿದೆ" : "Email is required"; if (!firstErrStep) firstErrStep = 1; }
    else if (!isValidEmail(client.email)) { e.email = isKn ? "ಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ" : "Invalid email format"; if (!firstErrStep) firstErrStep = 1; }

    if (!client.password) { e.password = isKn ? "ಪಾಸ್‌ವರ್ಡ್ ಅಗತ್ಯವಿದೆ" : "Password is required"; if (!firstErrStep) firstErrStep = 2; }
    else if (client.password.length < 6) { e.password = isKn ? "ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳಿರಬೇಕು" : "Min 6 characters"; if (!firstErrStep) firstErrStep = 2; }
    if (client.password !== client.confirmPw) { e.confirmPw = isKn ? "ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ" : "Passwords do not match"; if (!firstErrStep) firstErrStep = 2; }
    if (!client.agreeTerms) { e.agreeTerms = isKn ? "ದಯವಿಟ್ಟು ನಿಯಮಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ" : "Please accept terms"; if (!firstErrStep) firstErrStep = 2; }

    setClientErr(e);
    if (firstErrStep) {
      setClientStep(firstErrStep);
      showToast(firstErrStep === 1 ? (isKn ? "ದಯವಿಟ್ಟು ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ" : "Please complete personal details") : (isKn ? "ದಯವಿಟ್ಟು ಭದ್ರತಾ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ" : "Please complete security details"), "error");
      return false;
    }
    return !Object.keys(e).length;
  };

  // ── Validate advocate ─────────────────────────────────────
  const validateAdvocate = () => {
    const e = {};
    let firstErrStep = null;

    if (!adv.fullName.trim()) { e.fullName = isKn ? "ವಕೀಲರ ಪೂರ್ಣ ಹೆಸರು ಅಗತ್ಯವಿದೆ" : "Full name is required"; if (!firstErrStep) firstErrStep = 1; }
    if (!adv.email.trim()) { e.email = isKn ? "ಇಮೇಲ್ ವಿಳಾಸ ಅಗತ್ಯವಿದೆ" : "Email is required"; if (!firstErrStep) firstErrStep = 1; }
    else if (!isValidEmail(adv.email)) { e.email = isKn ? "ಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ" : "Invalid email format"; if (!firstErrStep) firstErrStep = 1; }
    if (!adv.phone.trim()) { e.phone = isKn ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ" : "Phone is required"; if (!firstErrStep) firstErrStep = 1; }
    else if (!isValidPhone(adv.phone)) { e.phone = isKn ? "೧೦-ಅಂಕಿಯ ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ" : "Enter valid 10-digit phone"; if (!firstErrStep) firstErrStep = 1; }

    if (!adv.barId.trim()) { e.barId = isKn ? "ಬಾರ್ ನೋಂದಣಿ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ" : "Bar enrollment number is required"; if (!firstErrStep) firstErrStep = 2; }
    
    const specsList = (adv.specialities && adv.specialities.length > 0)
      ? adv.specialities
      : (adv.speciality ? adv.speciality.split(/,\s*/).map(s => s.trim()).filter(Boolean) : []);
    if (specsList.length === 0) { e.speciality = isKn ? "ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ೧ ಅಭ್ಯಾಸ ಕ್ಷೇತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Please select or add at least 1 practice area"; if (!firstErrStep) firstErrStep = 3; }
    
    if (!adv.courtLevel) { e.courtLevel = isKn ? "ನ್ಯಾಯಾಲಯದ ಮಟ್ಟವನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Select level of court"; if (!firstErrStep) firstErrStep = 4; }
    if (adv.courtLevel !== "Supreme Court" && adv.courtLevel !== "High Court" && !adv.district) {
      e.district = isKn ? "ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Select district";
      if (!firstErrStep) firstErrStep = 4;
    }
    if ((adv.courtLevel === "Taluk / JMFC / Civil Court" || adv.courtLevel === "Revenue Court / Land Tribunal") && !adv.taluk) {
      e.taluk = isKn ? "ತಾಲೂಕನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Select taluk";
      if (!firstErrStep) firstErrStep = 4;
    }
    if (!adv.court) { e.court = isKn ? "ಗುರಿ ನ್ಯಾಯಾಲಯ ಅಗತ್ಯವಿದೆ" : "Target court is required"; if (!firstErrStep) firstErrStep = 4; }
    if (!adv.city && !adv.taluk && !adv.district) { e.city = isKn ? "ನಗರ ಅಥವಾ ಜಿಲ್ಲೆಯ ಹೆಸರು ಅಗತ್ಯವಿದೆ" : "City or district is required"; if (!firstErrStep) firstErrStep = 5; }
    
    // NOTE: Profile image (avatarData) is OPTIONAL per user request! Can be added later in Advocate Dashboard.
    
    if (!adv.password) { e.password = isKn ? "ಪಾಸ್‌ವರ್ಡ್ ಅಗತ್ಯವಿದೆ" : "Password is required"; if (!firstErrStep) firstErrStep = 7; }
    else if (adv.password.length < 6) { e.password = isKn ? "ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳಿರಬೇಕು" : "Min 6 characters"; if (!firstErrStep) firstErrStep = 7; }
    if (adv.password !== adv.confirmPw) { e.confirmPw = isKn ? "ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ" : "Passwords do not match"; if (!firstErrStep) firstErrStep = 7; }
    if (!adv.agreeTerms) { e.agreeTerms = isKn ? "ದಯವಿಟ್ಟು ನಿಯಮಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ" : "Please accept terms"; if (!firstErrStep) firstErrStep = 7; }
    
    setAdvErr(e);
    if (firstErrStep) {
      setActiveStep(firstErrStep);
      showToast(isKn ? "ದಯವಿಟ್ಟು ಅಗತ್ಯವಿರುವ ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ" : "Please complete all required fields", "error");
    }
    return !Object.keys(e).length;
  };

  const validateCurrentStep = (stepNumber) => {
    const e = {};
    if (stepNumber === 1) {
      if (!adv.fullName.trim()) e.fullName = isKn ? "ವಕೀಲರ ಪೂರ್ಣ ಹೆಸರು ಅಗತ್ಯವಿದೆ" : "Full name is required";
      if (!adv.phone.trim()) e.phone = isKn ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ" : "Phone is required";
      else if (!isValidPhone(adv.phone)) e.phone = isKn ? "೧೦-ಅಂಕಿಯ ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ" : "Enter valid 10-digit phone";
      if (!adv.email.trim()) e.email = isKn ? "ಇಮೇಲ್ ವಿಳಾಸ ಅಗತ್ಯವಿದೆ" : "Email is required";
      else if (!isValidEmail(adv.email)) e.email = isKn ? "ಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ" : "Invalid email format";
    } else if (stepNumber === 2) {
      if (!adv.barId.trim()) e.barId = isKn ? "ಬಾರ್ ನೋಂದಣಿ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ" : "Bar enrollment number is required";
    } else if (stepNumber === 3) {
      const specsList = (adv.specialities && adv.specialities.length > 0)
        ? adv.specialities
        : (adv.speciality ? adv.speciality.split(/,\s*/).map(s => s.trim()).filter(Boolean) : []);
      if (specsList.length === 0) e.speciality = isKn ? "ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ೧ ಅಭ್ಯಾಸ ಕ್ಷೇತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Please select or add at least 1 practice area";
    } else if (stepNumber === 4) {
      if (!adv.courtLevel) e.courtLevel = isKn ? "ನ್ಯಾಯಾಲಯದ ಮಟ್ಟವನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Select level of court";
      if (adv.courtLevel !== "Supreme Court" && adv.courtLevel !== "High Court" && !adv.district) {
        e.district = isKn ? "ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Select district";
      }
      if ((adv.courtLevel === "Taluk / JMFC / Civil Court" || adv.courtLevel === "Revenue Court / Land Tribunal") && !adv.taluk) {
        e.taluk = isKn ? "ತಾಲೂಕನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Select taluk";
      }
      if (!adv.court) e.court = isKn ? "ಗುರಿ ನ್ಯಾಯಾಲಯ ಅಗತ್ಯವಿದೆ" : "Target court is required";
    } else if (stepNumber === 5) {
      if (!adv.city && !adv.taluk && !adv.district) e.city = isKn ? "ನಗರ ಅಥವಾ ಸ್ಥಳದ ಹೆಸರು ಅಗತ್ಯವಿದೆ" : "City or location name is required";
    } else if (stepNumber === 6) {
      // Photo and bio are both optional!
    } else if (stepNumber === 7) {
      if (!adv.password) e.password = isKn ? "ಪಾಸ್‌ವರ್ಡ್ ಅಗತ್ಯವಿದೆ" : "Password is required";
      else if (adv.password.length < 6) e.password = isKn ? "ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳಿರಬೇಕು" : "Min 6 characters";
      if (adv.password !== adv.confirmPw) e.confirmPw = isKn ? "ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ" : "Passwords do not match";
      if (!adv.agreeTerms) e.agreeTerms = isKn ? "ದಯವಿಟ್ಟು ನಿಯಮಗಳನ್ನು ಒಪ್ಪಿಕೊಳ್ಳಿ" : "Please accept terms";
    }

    if (Object.keys(e).length > 0) {
      setAdvErr(prev => ({ ...prev, ...e }));
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, 7));
      const formTop = document.querySelector(".su-adv-wizard-content");
      if (formTop) {
        formTop.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      showToast(isKn ? "ಮುಂದುವರಿಯಲು ದಯವಿಟ್ಟು ಅಗತ್ಯವಿರುವ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ" : "Please fill required fields before proceeding", "error");
    }
  };

  const handlePrevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
    const formTop = document.querySelector(".su-adv-wizard-content");
    if (formTop) {
      formTop.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleStepClick = (stepId) => {
    setActiveStep(stepId);
    const formTop = document.querySelector(".su-adv-wizard-content");
    if (formTop) {
      formTop.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ── Submit — Advocate registration via Multi-Channel OTP (Email / SMS / WhatsApp) ──────
  const handleSendAdvOtp = async (channelToUse) => {
    const activeChan = channelToUse || otpChannel || "email";
    setAdvOtpSetupError("");
    setOtpErr("");
    setLoading(true);
    try {
      const emailLower = adv.email.trim().toLowerCase();
      const phoneClean = adv.phone.trim();
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: adv.fullName.trim(),
          email: emailLower,
          phone: phoneClean,
          role: "advocate",
          channel: activeChan,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorMessage = data.message || data.error || "Failed to send verification code. Try again.";
        if (res.status === 409) setAdvErr((p) => ({ ...p, email: errorMessage }));
        setAdvOtpSetupError(errorMessage);
        showToast(errorMessage, "error");
        setLoading(false);
        return;
      }

      setOtpChannel(activeChan);
      const chanLabel = activeChan === "whatsapp" ? "WhatsApp" : activeChan === "sms" ? "SMS" : "Email";
      const targetTxt = activeChan === "email" ? emailLower : `+91 ${phoneClean.replace(/\D/g, "").slice(-10)}`;
      showToast(`Verification code sent via ${chanLabel} to ${targetTxt} 🎉`, "success");
      setOtpStep(true);
      setResendTimer(60);
      setOtpCode("");
    } catch (err) {
      console.error(err);
      showToast("Could not reach the server. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const valid = tab === "client" ? validateClient() : validateAdvocate();
    if (!valid) return;

    if (tab === "client") {
      navigate("/client-register");
      return;
    }

    handleSendAdvOtp(otpChannel);
  };

  const handleResendAdvOtp = async () => {
    if (resendTimer > 0 || loading) return;
    await handleSendAdvOtp(otpChannel);
  };

  const handleVerifyAndRegisterAdv = async (e) => {
    e?.preventDefault();
    const cleanCode = String(otpCode || "").trim();
    if (!cleanCode || cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      setOtpErr("Please enter the 6-digit numeric verification code");
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
        otp:           cleanCode,
        verificationChannel: otpChannel,
      });

      setSuccessName(adv.fullName);
      showToast("Identity verified! Advocate profile submitted for Admin Approval 🎉", "success");
      setOtpStep(false);
      setView("success");
    } catch (err) {
      setOtpErr(err.message || "Verification failed.");
      showToast(err.message || "Verification failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const advocateSteps = [
    {
      id: 1,
      title: isKn ? "ವೈಯಕ್ತಿಕ ವಿವರಗಳು" : "Personal Information",
      shortTitle: isKn ? "ವೈಯಕ್ತಿಕ ವಿವರ" : "Personal Info",
      icon: ADMIN_ICONS.user,
      isCompleted: Boolean(adv.fullName.trim() && isValidPhone(adv.phone) && isValidEmail(adv.email)),
      hasError: Boolean(advErr.fullName || advErr.phone || advErr.email),
      valuePreview: adv.fullName ? adv.fullName : "",
    },
    {
      id: 2,
      title: isKn ? "ವೃತ್ತಿಪರ ವಿವರಗಳು" : "Professional Details",
      shortTitle: isKn ? "ವೃತ್ತಿ ವಿವರ" : "Professional",
      icon: ADMIN_ICONS.badge,
      isCompleted: Boolean(adv.barId.trim()),
      hasError: Boolean(advErr.barId || advErr.barCouncil),
      valuePreview: adv.barId ? adv.barId : "",
    },
    {
      id: 3,
      title: isKn ? "ಅಭ್ಯಾಸ ಕ್ಷೇತ್ರಗಳು" : "Practice Areas",
      shortTitle: isKn ? "ಅಭ್ಯಾಸ ಕ್ಷೇತ್ರ" : "Practice Areas",
      icon: ADMIN_ICONS.scale,
      isCompleted: Boolean((adv.specialities && adv.specialities.length > 0) || adv.speciality),
      hasError: Boolean(advErr.speciality),
      valuePreview: adv.specialities?.length ? `${adv.specialities.length} ${isKn ? "ಕ್ಷೇತ್ರಗಳು" : "Fields"}` : "",
    },
    {
      id: 4,
      title: isKn ? "ನ್ಯಾಯಾಲಯದ ವ್ಯಾಪ್ತಿ" : "Court Jurisdiction",
      shortTitle: isKn ? "ನ್ಯಾಯಾಲಯ ವ್ಯಾಪ್ತಿ" : "Jurisdiction",
      icon: ADMIN_ICONS.court,
      isCompleted: Boolean(adv.courtLevel && adv.court),
      hasError: Boolean(advErr.courtLevel || advErr.district || advErr.taluk || advErr.court),
      valuePreview: adv.courtLevel ? `${adv.courtLevel}` : "",
    },
    {
      id: 5,
      title: isKn ? "ಸ್ಥಳ ಮತ್ತು ಅನುಭವ" : "Location & Experience",
      shortTitle: isKn ? "ಸ್ಥಳ & ಅನುಭವ" : "Location & Exp",
      icon: ADMIN_ICONS.calendar,
      isCompleted: Boolean((adv.city || adv.taluk || adv.district) && adv.experience),
      hasError: Boolean(advErr.city || advErr.experience),
      valuePreview: adv.city ? `${adv.city}` : "",
    },
    {
      id: 6,
      title: isKn ? "ಪರಿಚಯ ಮತ್ತು ಫೋಟೋ" : "Bio & Profile Photo",
      shortTitle: isKn ? "ಪರಿಚಯ & ಫೋಟೋ" : "Bio & Photo",
      icon: ADMIN_ICONS.camera,
      isCompleted: Boolean(adv.avatarData || adv.bio.trim()),
      hasError: Boolean(advErr.avatarData || advErr.bio),
      valuePreview: adv.avatarData ? (isKn ? "ಫೋಟೋ ಸೇರಿಸಲಾಗಿದೆ ✓" : "Photo Added ✓") : (adv.fullName ? getInitials(adv.fullName) : ""),
    },
    {
      id: 7,
      title: isKn ? "ಭದ್ರತೆ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್" : "Security & Credentials",
      shortTitle: isKn ? "ಭದ್ರತೆ & ಲಾಗಿನ್" : "Security",
      icon: ADMIN_ICONS.shield,
      isCompleted: Boolean(adv.password && adv.password.length >= 6 && adv.password === adv.confirmPw && adv.agreeTerms),
      hasError: Boolean(advErr.password || advErr.confirmPw || advErr.agreeTerms),
      valuePreview: (adv.password && adv.agreeTerms) ? (isKn ? "ಸಿದ್ಧವಾಗಿದೆ ✓" : "Ready ✓") : "",
    },
  ];

  const currentStepObj = advocateSteps.find(s => s.id === activeStep) || advocateSteps[0];
  const completedStepsCount = advocateSteps.filter(s => s.isCompleted).length;
  const progressPercent = Math.round((completedStepsCount / 7) * 100);

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
            adv={adv}
            channel={otpChannel}
          />
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  return (
    <div className={`su-page ${theme === "dark" ? "theme-dark su-dark" : "theme-light su-light"}`} data-theme={theme}>
      <Toast toast={toast} />

      {/* Real Multi-Channel OTP Verification Modal */}
      {otpStep && (
        <div className="rg-modal-overlay">
          <div className="rg-modal-card" style={{ maxWidth: 480, textAlign: "center" }}>
            <button
              type="button"
              className="rg-modal-theme-toggle"
              onClick={handleThemeToggle}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <div className="rg-otp-badge" style={{ fontSize: "2.2rem" }}>
              {otpChannel === "whatsapp" ? "🟢" : otpChannel === "sms" ? "💬" : "✉️"}
            </div>
            <h2 className="su-title" style={{ fontSize: "1.55rem", marginTop: 8 }}>
              {otpChannel === "whatsapp"
                ? (isKn ? "WhatsApp ಮೂಲಕ ಪರಿಶೀಲಿಸಿ" : "Verify via WhatsApp")
                : otpChannel === "sms"
                ? (isKn ? "SMS ಮೂಲಕ ಪರಿಶೀಲಿಸಿ" : "Verify via SMS")
                : (isKn ? "ವಕೀಲರ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ" : "Verify Advocate Email")}
            </h2>

            {/* Choose Verification Channel (Email / SMS / WhatsApp) */}
            <div style={{ margin: "14px 0 16px" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--su-muted, #94a3b8)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Select Verification Channel:
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    if (otpChannel !== "email" && !loading) {
                      handleSendAdvOtp("email");
                    }
                  }}
                  disabled={loading}
                  style={{
                    padding: "9px 6px",
                    borderRadius: 10,
                    border: otpChannel === "email" ? "2px solid #3b82f6" : "1px solid #cbd5e1",
                    background: otpChannel === "email" ? "rgba(59, 130, 246, 0.14)" : "transparent",
                    color: otpChannel === "email" ? "#2563eb" : "inherit",
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  ✉️ Email
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (otpChannel !== "sms" && !loading) {
                      handleSendAdvOtp("sms");
                    }
                  }}
                  disabled={loading}
                  style={{
                    padding: "9px 6px",
                    borderRadius: 10,
                    border: otpChannel === "sms" ? "2px solid #059669" : "1px solid #cbd5e1",
                    background: otpChannel === "sms" ? "rgba(5, 150, 105, 0.14)" : "transparent",
                    color: otpChannel === "sms" ? "#059669" : "inherit",
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  💬 SMS
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (otpChannel !== "whatsapp" && !loading) {
                      handleSendAdvOtp("whatsapp");
                    }
                  }}
                  disabled={loading}
                  style={{
                    padding: "9px 6px",
                    borderRadius: 10,
                    border: otpChannel === "whatsapp" ? "2px solid #16a34a" : "1px solid #cbd5e1",
                    background: otpChannel === "whatsapp" ? "rgba(34, 197, 94, 0.14)" : "transparent",
                    color: otpChannel === "whatsapp" ? "#16a34a" : "inherit",
                    fontWeight: 700,
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  🟢 WhatsApp
                </button>
              </div>
            </div>

            <p className="su-subtitle" style={{ fontSize: "0.93rem", margin: "6px 0 14px", color: "var(--rg-muted, #94a3b8)" }}>
              {otpChannel === "email" ? (
                <>
                  {isKn ? "ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸಕ್ಕೆ ೬-ಅಂಕಿಯ ಪರಿಶೀಲನಾ ಕೋಡ್ ಕಳುಹಿಸಲಾಗಿದೆ:" : "We've sent a 6-digit verification code to:"}<br />
                  <strong style={{ color: "var(--su-accent, #2dd4bf)", wordBreak: "break-all" }}>
                    {adv.email.trim()}
                  </strong>
                </>
              ) : (
                <>
                  {isKn ? "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ೬-ಅಂಕಿಯ ಕೋಡ್ ಕಳುಹಿಸಲಾಗಿದೆ:" : `We've sent a 6-digit verification code via ${otpChannel === "whatsapp" ? "WhatsApp" : "SMS"} to:`}<br />
                  <strong style={{ color: "var(--su-accent, #2dd4bf)" }}>
                    +91 {adv.phone.replace(/\D/g, "").slice(-10)}
                  </strong>
                </>
              )}
            </p>
            <div style={{ display: "inline-block", background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: "0.82rem", fontWeight: 600, padding: "5px 14px", borderRadius: 9999, marginBottom: 18 }}>
              ⏱️ {isKn ? "ಕೋಡ್ ೫ ನಿಮಿಷಗಳಲ್ಲಿ ಮುಕ್ತಾಯವಾಗುತ್ತದೆ" : "Code expires in 5 minutes"}
            </div>

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
                  style={{
                    textAlign: "center",
                    letterSpacing: "8px",
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}
                />
                {otpErr && <p className="su-field-err" style={{ color: "#ef4444", marginTop: 6 }}>⚠ {otpErr}</p>}
              </div>

              <button type="submit" className="su-btn-primary su-btn-lg" style={{ marginTop: 16, width: "100%" }} disabled={loading}>
                {loading ? <><span className="su-spinner" /> {isKn ? "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…" : "Verifying Code…"}</> : (isKn ? "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ →" : "Verify & Submit for Approval →")}
              </button>
            </form>

            <div style={{ marginTop: 20, fontSize: "0.88rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                style={{ background: "none", border: 0, color: "#94a3b8", cursor: "pointer", textDecoration: "underline", font: "inherit" }}
                onClick={() => setOtpStep(false)}
                disabled={loading}
              >
                ← {isKn ? "ವಿವರ ಬದಲಾಯಿಸಿ" : "Change Details"}
              </button>

              <button
                type="button"
                style={{
                  background: "none",
                  border: 0,
                  color: resendTimer > 0 ? "#94a3b8" : "var(--su-accent, #2dd4bf)",
                  cursor: resendTimer > 0 ? "default" : "pointer",
                  fontWeight: 700,
                  font: "inherit",
                }}
                onClick={handleResendAdvOtp}
                disabled={resendTimer > 0 || loading}
              >
                {resendTimer > 0 ? `Resend (${resendTimer}s)` : `Resend via ${otpChannel === "whatsapp" ? "WhatsApp" : otpChannel === "sms" ? "SMS" : "Email"}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`su-card ${roleParam === "advocate" && tab === "advocate" ? "su-card-advocate-wizard" : ""} ${isRoleSelectionView ? "su-card-role-select" : ""}`}>
        {/* Top Control Bar: Back link, Language switcher, Theme toggle */}
        <div className="su-top-bar">
          {showBackToSignup ? (
            <Link to="/signup" className="su-back-link" style={{ marginRight: "auto" }}>
              <span className="su-back-arrow">←</span> Back page
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

          <div className="su-logo-wrap">
            <Link to="/" className="su-logo" title="Advocate Hub - Home">
              <BrandLogo size={46} wordmark={true} dark={theme === "dark"} />
            </Link>
          </div>

          <h1 className="su-title">{t.title}</h1>
          <p className="su-subtitle">{t.subtitle}</p>
        </div>

        {/* ══ STEP 1: INTERACTIVE ROLE SELECTION DECK ══ */}
        {isRoleSelectionView && (
          <div className="su-role-section">
            <div className="su-role-header">
              <h2 className="su-role-heading">{t.chooseRole}</h2>
              <p className="su-role-subheading">{t.chooseRoleSubtitle}</p>
            </div>

            <div className="su-role-grid">
              {/* 1. Client Card */}
              <div
                className={`su-role-card su-role-card-client ${tab === "client" ? "selected" : ""}`}
                onClick={() => {
                  setTab("client");
                  navigate("/client-register");
                }}
                onMouseEnter={() => setTab("client")}
                role="button"
                tabIndex={0}
                aria-label={t.clientRoleTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate("/client-register");
                  }
                }}
              >
                <div className="su-role-card-badge-row">
                  <span className="su-role-pill-time">
                    ⚡ {isKn ? "೧ ನಿಮಿಷ ನೋಂದಣಿ" : "1 Min Signup"}
                  </span>
                </div>

                <div className="su-role-hero-row">
                  <div className="su-role-icon-box client">
                    {ADMIN_ICONS.user}
                  </div>
                  <div className="su-role-hero-meta">
                    <h3 className="su-role-card-title">{t.clientRoleTitle}</h3>
                  </div>
                </div>


                <div className="su-role-perks-list">
                  {t.clientPerks.map((perk, i) => (
                    <div key={i} className="su-role-perk-row">
                      <span className="su-role-perk-bullet">{ADMIN_ICONS.check}</span>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                <div className="su-role-card-footer">
                  <button
                    type="button"
                    className="su-role-cta-btn su-role-cta-client"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/client-register");
                    }}
                  >
                    <span>{isKn ? "ಗ್ರಾಹಕರಾಗಿ ಮುಂದುವರಿಯಿರಿ" : "Continue as Client"}</span>
                    {ADMIN_ICONS.arrowRight}
                  </button>
                </div>
              </div>

              {/* 2. Advocate Card */}
              <div
                className={`su-role-card su-role-card-advocate ${tab === "advocate" ? "selected" : ""}`}
                onClick={() => {
                  setTab("advocate");
                  navigate("/signup?role=advocate");
                }}
                onMouseEnter={() => setTab("advocate")}
                role="button"
                tabIndex={0}
                aria-label={t.advocateRoleTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate("/signup?role=advocate");
                  }
                }}
              >

                <div className="su-role-hero-row">
                  <div className="su-role-icon-box advocate">
                    {ADMIN_ICONS.court}
                  </div>
                  <div className="su-role-hero-meta">
                    <h3 className="su-role-card-title">{t.advocateRoleTitle}</h3>
                  </div>
                </div>


                <div className="su-role-perks-list">
                  {t.advocatePerks.map((perk, i) => (
                    <div key={i} className="su-role-perk-row">
                      <span className="su-role-perk-bullet">{ADMIN_ICONS.check}</span>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                <div className="su-role-card-footer">
                  <button
                    type="button"
                    className="su-role-cta-btn su-role-cta-advocate"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/signup?role=advocate");
                    }}
                  >
                    <span>{isKn ? "ವಕೀಲರಾಗಿ ಮುಂದುವರಿಯಿರಿ" : "Continue as Advocate"}</span>
                    {ADMIN_ICONS.arrowRight}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Sign-In Redirect for Returning Users */}
            <div className="su-role-login-redirect">
              <span className="su-role-login-prompt">
                {isKn ? "ಈಗಾಗಲೇ Advocate Hub ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?" : "Already registered on Advocate Hub?"}
              </span>
              <div className="su-role-login-links">
                <Link to="/client-login" className="su-role-login-btn client">
                  {ADMIN_ICONS.user}
                  <span>{isKn ? "ಗ್ರಾಹಕರ ಲಾಗಿನ್ →" : "Client Sign In →"}</span>
                </Link>
                <Link to="/login" className="su-role-login-btn advocate">
                  {ADMIN_ICONS.court}
                  <span>{isKn ? "ವಕೀಲರ ಲಾಗಿನ್ →" : "Advocate Sign In →"}</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ══ CLIENT FORM ══ */}
        {/* ══ CLIENT FORM: 2-STEP TABBED FORM (PERSONAL DETAILS & SECURITY) ══ */}
        {roleParam === "client" && tab === "client" && (
          <form className="su-form su-client-wizard-form" onSubmit={handleSubmit} noValidate>

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

            {/* 2-Step Navigation Tabs Header */}
            <div className="su-client-tabs-nav" role="tablist" aria-label="Client Registration Steps">
              <button
                type="button"
                role="tab"
                aria-selected={clientStep === 1}
                className={`su-client-tab-btn ${clientStep === 1 ? "active" : ""} ${isClientStep1Done ? "completed" : ""}`}
                onClick={() => setClientStep(1)}
              >
                <div className="su-client-step-tab-indicator">
                  {isClientStep1Done && clientStep !== 1 ? (
                    <span className="su-client-step-check">{ADMIN_ICONS.check}</span>
                  ) : (
                    <span className="su-client-step-num">1</span>
                  )}
                </div>
                <div className="su-client-tab-content">
                  <div className="su-client-tab-title">
                    <span className="su-client-tab-icon">{ADMIN_ICONS.user}</span>
                    <span>1. {isKn ? "ವೈಯಕ್ತಿಕ ವಿವರಗಳು" : "Personal Details"}</span>
                  </div>
                  <div className="su-client-tab-sub">
                    {isKn ? "ಹೆಸರು, ಮೊಬೈಲ್, ಇಮೇಲ್ & ಸ್ಥಳ" : "Name, Phone, Email & Location"}
                  </div>
                </div>
                {isClientStep1Done && <span className="su-client-step-done-badge">{isKn ? "ಪೂರ್ಣ" : "Done"}</span>}
              </button>

              <div className="su-client-tab-connector" />

              <button
                type="button"
                role="tab"
                aria-selected={clientStep === 2}
                className={`su-client-tab-btn ${clientStep === 2 ? "active" : ""} ${isClientStep2Done ? "completed" : ""}`}
                onClick={() => {
                  if (validateClientStep1()) {
                    setClientStep(2);
                  }
                }}
              >
                <div className="su-client-step-tab-indicator">
                  {isClientStep2Done ? (
                    <span className="su-client-step-check">{ADMIN_ICONS.check}</span>
                  ) : (
                    <span className="su-client-step-num">2</span>
                  )}
                </div>
                <div className="su-client-tab-content">
                  <div className="su-client-tab-title">
                    <span className="su-client-tab-icon">{ADMIN_ICONS.shield}</span>
                    <span>2. {isKn ? "ಭದ್ರತೆ & ಲಾಗಿನ್" : "Security"}</span>
                  </div>
                  <div className="su-client-tab-sub">
                    {isKn ? "ಪಾಸ್‌ವರ್ಡ್ & ನಿಯಮಗಳ ಒಪ್ಪಿಗೆ" : "Password & Account Terms"}
                  </div>
                </div>
                {isClientStep2Done && <span className="su-client-step-done-badge">{isKn ? "ಪೂರ್ಣ" : "Done"}</span>}
              </button>
            </div>

            {/* STEP 1: Personal Details */}
            {clientStep === 1 && (
              <div className="su-client-step-body su-fade-in">
                <div className="su-form-section-title">
                  <span className="su-client-tab-icon" style={{ marginRight: 6 }}>{ADMIN_ICONS.user}</span>
                  1. {t.personalInfo}
                </div>

                <div className="su-grid-2">
                  <Field label={t.clientFullName} required error={clientErr.fullName}>
                    <Input
                      icon={ADMIN_ICONS.user}
                      placeholder={isKn ? "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು" : "e.g. Ramesh Kumar"}
                      value={client.fullName}
                      onChange={(e) => setC("fullName", e.target.value)}
                      error={clientErr.fullName}
                      disabled={loading}
                    />
                  </Field>

                  <Field label={t.clientPhone} required error={clientErr.phone}>
                    <Input
                      icon={ADMIN_ICONS.phone}
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
                    icon={ADMIN_ICONS.mail}
                    type="email"
                    placeholder="your.email@example.com"
                    value={client.email}
                    onChange={(e) => setC("email", e.target.value)}
                    error={clientErr.email}
                    disabled={loading}
                    rightEl={client.email && isValidEmail(client.email) && <span className="su-valid">{ADMIN_ICONS.check}</span>}
                  />
                </Field>

                <div className="su-form-section-title" style={{ marginTop: 24 }}>
                  <span className="su-client-tab-icon" style={{ marginRight: 6 }}>{ADMIN_ICONS.scale}</span>
                  {t.locationLegal}
                </div>

                <div className="su-grid-2">
                  <Field label={t.clientCity} error={clientErr.city}>
                    <Select
                      icon={ADMIN_ICONS.pin}
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
                      icon={ADMIN_ICONS.scale}
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

                <div className="su-client-step-nav-actions">
                  <div />
                  <button
                    type="button"
                    className="su-client-btn-next"
                    onClick={handleNextClientStep}
                  >
                    <span>{isKn ? "ಮುಂದೆ: ಭದ್ರತೆ (೨/೨)" : "Next: Security (2/2)"}</span>
                    {ADMIN_ICONS.arrowRight}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Security & Credentials */}
            {clientStep === 2 && (
              <div className="su-client-step-body su-fade-in">
                <div className="su-form-section-title">
                  <span className="su-client-tab-icon" style={{ marginRight: 6 }}>{ADMIN_ICONS.shield}</span>
                  2. {t.security}
                </div>

                <div className="su-grid-2">
                  <Field label={t.password} required error={clientErr.password}>
                    <Input
                      icon={ADMIN_ICONS.lock}
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
                      icon={ADMIN_ICONS.key}
                      type={showCPw ? "text" : "password"}
                      placeholder={isKn ? "ಪಾಸ್‌ವರ್ಡ್ ಪುನರಾವರ್ತಿಸಿ" : "Re-enter password"}
                      value={client.confirmPw}
                      onChange={(e) => setC("confirmPw", e.target.value)}
                      error={clientErr.confirmPw}
                      disabled={loading}
                      rightEl={
                        client.confirmPw && client.password === client.confirmPw ? (
                          <span className="su-valid">{ADMIN_ICONS.check}</span>
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

                <div className="su-client-step-nav-actions">
                  <button
                    type="button"
                    className="su-client-btn-prev"
                    onClick={handlePrevClientStep}
                    disabled={loading}
                  >
                    {ADMIN_ICONS.arrowLeft}
                    <span>{isKn ? "ಹಿಂದಿನದು: ವೈಯಕ್ತಿಕ ವಿವರಗಳು" : "Previous: Personal Details"}</span>
                  </button>

                  <button type="submit" className="su-btn-primary su-client-btn-submit" disabled={loading}>
                    {loading ? (
                      <><span className="su-spinner" /> {t.creatingAccount}</>
                    ) : (
                      <>{ADMIN_ICONS.sparkle} <span>{t.createClientBtn}</span> {ADMIN_ICONS.arrowRight}</>
                    )}
                  </button>
                </div>
              </div>
            )}

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

        {/* ══ ADVOCATE FORM: 7-STEP WIZARD WITH LEFT-SIDE STEPPER ══ */}
        {roleParam === "advocate" && tab === "advocate" && (
          <form className="su-form su-adv-wizard-form" onSubmit={handleSubmit} noValidate>
            <div className="su-adv-wizard-layout">
              {/* LEFT SIDE: 7 Steps Navigation Sidebar */}
              <aside className="su-adv-sidebar-stepper" aria-label="Registration Steps">
                <div className="su-adv-stepper-header">
                  
                  <h3 className="su-adv-stepper-title">
                    {isKn ? "ನೋಂದಣಿ ಹಂತಗಳು" : "Registration Steps"}
                  </h3>

                  <div className="su-adv-progress-box">
                    <div className="su-adv-progress-meta">
                      <span>{isKn ? `ಹಂತ ${activeStep} / ೭` : `Step ${activeStep} of 7`}</span>
                      <strong>{progressPercent}% {isKn ? "ಪೂರ್ಣ" : "Done"}</strong>
                    </div>
                    <div className="su-adv-progress-track">
                      <div
                        className="su-adv-progress-fill"
                        style={{ width: `${Math.max(10, progressPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 7 Interactive Step Items */}
                <div className="su-adv-stepper-list">
                  {advocateSteps.map((step) => {
                    const isActive = activeStep === step.id;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        className={`su-adv-step-item ${isActive ? "active" : ""} ${step.isCompleted ? "completed" : ""} ${step.hasError ? "has-error" : ""}`}
                        onClick={() => handleStepClick(step.id)}
                        aria-current={isActive ? "step" : undefined}
                      >
                        <div className="su-adv-step-indicator">
                          {step.isCompleted && !isActive ? (
                            <span className="su-adv-step-check">✓</span>
                          ) : step.hasError ? (
                            <span className="su-adv-step-err-icon">!</span>
                          ) : (
                            <span className="su-adv-step-num">{step.id}</span>
                          )}
                        </div>

                        <div className="su-adv-step-text">
                          <div className="su-adv-step-title-row">
                            <span className="su-adv-step-icon">{step.icon}</span>
                            <span className="su-adv-step-title">{step.id}. {step.title}</span>
                          </div>
                          <div className="su-adv-step-desc">
                            {step.valuePreview ? (
                              <span className="su-adv-step-preview">✓ {step.valuePreview}</span>
                            ) : (
                              step.desc
                            )}
                          </div>
                        </div>

                        <div className="su-adv-step-status-pill">
                          {isActive ? (
                            <span className="su-step-pill-active">{isKn ? "ಪ್ರಸ್ತುತ" : "Active"}</span>
                          ) : step.isCompleted ? (
                            <span className="su-step-pill-done">{isKn ? "ಪೂರ್ಣ" : "Done"}</span>
                          ) : (
                            <span className="su-step-pill-arrow">→</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Sidebar Trust Badges */}
                <div className="su-adv-sidebar-trust">
                  <div className="su-adv-trust-item">
                    <span className="su-adv-trust-icon">{ADMIN_ICONS.court}</span>
                    <span>{isKn ? "ಬಾರ್ ಕೌನ್ಸಿಲ್ ಮಾನ್ಯತೆ" : "Bar Council Compliant"}</span>
                  </div>
                  <div className="su-adv-trust-item">
                    <span className="su-adv-trust-icon">{ADMIN_ICONS.shieldCheck}</span>
                    <span>{isKn ? "೨೫೬-ಬಿಟ್ ಗೂಢಲಿಪೀಕರಣ" : "256-Bit SSL Encrypted"}</span>
                  </div>
                  <div className="su-adv-trust-item">
                    <span className="su-adv-trust-icon">{ADMIN_ICONS.sparkle}</span>
                    <span>{isKn ? "ತ್ವರಿತ ಒಟಿಪಿ ಪರಿಶೀಲನೆ" : "Instant OTP Verification"}</span>
                  </div>
                </div>
              </aside>

              {/* RIGHT SIDE: Active Step Form Content */}
              <div className="su-adv-wizard-content">
                {/* Step Header */}
                <div className="su-adv-step-header">
                  <div className="su-adv-step-badge-row">
                    <span className="su-adv-step-pill-counter">
                      {isKn ? `ಹಂತ ${activeStep} / ೭` : `STEP ${activeStep} OF 7`}
                    </span>
                    <span className="su-adv-step-percent-badge">
                      {completedStepsCount}/7 {isKn ? "ಹಂತಗಳು ಪೂರ್ಣ" : "Steps Completed"} ({progressPercent}%)
                    </span>
                  </div>
                  <h2 className="su-adv-step-heading">
                    <span className="su-adv-heading-icon">{currentStepObj.icon}</span>
                    {currentStepObj.id}. {currentStepObj.title}
                  </h2>
                  <p className="su-adv-step-subheading">
                    {currentStepObj.guidance}
                  </p>
                </div>

                {/* Step Form Fields */}
                <div className="su-adv-step-body">
                  {/* STEP 1: Personal Information */}
                  {activeStep === 1 && (
                    <div className="su-step-section-fields su-fade-in">
                      <div className="su-grid-2">
                        <Field label={t.fullName} required error={advErr.fullName}>
                          <Input
                            icon={ADMIN_ICONS.user}
                            placeholder={isKn ? "ವಕೀಲರ ಪೂರ್ಣ ಹೆಸರು" : "Adv. Full Name"}
                            value={adv.fullName}
                            onChange={(e) => setA("fullName", e.target.value)}
                            error={advErr.fullName}
                            disabled={loading}
                          />
                        </Field>

                        <Field label={t.phone} required error={advErr.phone}>
                          <Input
                            icon={ADMIN_ICONS.phone}
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
                          icon={ADMIN_ICONS.mail}
                          type="email"
                          placeholder="advocate@email.com"
                          value={adv.email}
                          onChange={(e) => setA("email", e.target.value)}
                          error={advErr.email}
                          disabled={loading}
                          rightEl={adv.email && isValidEmail(adv.email) && <span className="su-valid">{ADMIN_ICONS.check}</span>}
                        />
                      </Field>
                    </div>
                  )}

                  {/* STEP 2: Professional Details */}
                  {activeStep === 2 && (
                    <div className="su-step-section-fields su-fade-in">
                      <div className="su-grid-2">
                        <Field
                          label={isKn ? "ಬಾರ್ ನೋಂದಣಿ ಸಂಖ್ಯೆ" : "Bar Enrollment Number"}
                          required
                          error={advErr.barId}
                          hint={isKn ? "ಉದಾ: KAR/1234/2018" : "e.g. KAR/1234/2018 or BCI/KA/2016/4321"}
                        >
                          <Input
                            icon={ADMIN_ICONS.badge}
                            placeholder="e.g. KAR/1234/2018"
                            value={adv.barId}
                            onChange={(e) => setA("barId", e.target.value)}
                            error={advErr.barId}
                            disabled={loading}
                          />
                        </Field>

                        <Field label={isKn ? "ಬಾರ್ ಕೌನ್ಸಿಲ್" : "Bar Council"} error={advErr.barCouncil}>
                          <Select
                            icon={ADMIN_ICONS.court}
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
                    </div>
                  )}

                  {/* STEP 3: Practice Areas & Specialization */}
                  {activeStep === 3 && (
                    <div className="su-step-section-fields su-fade-in">
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

                        <div className="su-practice-controls-row">
                          <Select
                            icon={ADMIN_ICONS.scale}
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
                    </div>
                  )}

                  {/* STEP 4: Court Hierarchy & Jurisdiction */}
                  {activeStep === 4 && (
                    <div className="su-step-section-fields su-fade-in">
                      <div className="su-court-box">
                        <div className="su-court-header">
                          <div className="su-court-header-left">
                            <span className="su-court-header-icon">{ADMIN_ICONS.court}</span>
                            <div>
                              <div className="su-court-header-title">
                                {isKn ? "ನ್ಯಾಯಾಲಯದ ಶ್ರೇಣಿ ಮತ್ತು ವ್ಯಾಪ್ತಿ" : "Court Hierarchy & Jurisdiction"}
                              </div>
                            </div>
                          </div>
                          <span className="su-court-badge">
                            {isKn ? "೩ ಹಂತಗಳ ಪ್ರಕ್ರಿಯೆ" : "3 Dependent Steps"}
                          </span>
                        </div>

                        <div className="su-court-grid">
                          <Field label={isKn ? "ಹಂತ ೧: ನ್ಯಾಯಾಲಯದ ಮಟ್ಟ" : "Step 1: Level of Court"} required error={advErr.courtLevel}>
                            <Select
                              icon={ADMIN_ICONS.scale}
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

                          {adv.courtLevel === "High Court" ? (
                            <div style={{ gridColumn: "span 2" }}>
                              <Field label={isKn ? "ಹಂತ ೨: ಹೈಕೋರ್ಟ್ ಪೀಠ" : "Step 2: High Court Bench"} required>
                                <Select
                                  icon={ADMIN_ICONS.court}
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
                                  icon={ADMIN_ICONS.pin}
                                  value="Supreme Court of India (New Delhi)"
                                  readOnly
                                  disabled
                                  style={{ fontWeight: 600 }}
                                />
                              </Field>
                            </div>
                          ) : (
                            <>
                              <Field label={isKn ? "ಹಂತ ೨: ಜಿಲ್ಲೆ" : "Step 2: District"} required error={advErr.district}>
                                <Select
                                  icon={ADMIN_ICONS.pin}
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

                              <Field
                                label={isKn ? "ಹಂತ ೩: ತಾಲೂಕು" : "Step 3: Taluk"}
                                required={adv.courtLevel === "Taluk / JMFC / Civil Court" || adv.courtLevel === "Revenue Court / Land Tribunal"}
                                error={advErr.taluk}
                                hint={!adv.district ? (isKn ? "ಮೊದಲು ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Choose district first") : undefined}
                              >
                                <Select
                                  icon={ADMIN_ICONS.pin}
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
                          </div>
                        )}

                        {advErr.court && <p className="su-field-err" style={{ marginTop: 8 }}>⚠ {advErr.court}</p>}
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Location & Experience */}
                  {activeStep === 5 && (
                    <div className="su-step-section-fields su-fade-in">
                      <div className="su-grid-2">
                        <Field
                          label={isKn ? "ನಗರ / ಸ್ಥಳದ ಹೆಸರು" : "City / Location Name"}
                          required
                          error={advErr.city}
                          hint={isKn ? "ತಾಲೂಕು/ಜಿಲ್ಲೆಯಿಂದ ಸ್ವಯಂ-ಭರ್ತಿ ಅಥವಾ ಕಸ್ಟಮೈಸ್ ಮಾಡಿ" : "Auto-filled from Taluk/District or customize"}
                        >
                          <Input
                            icon={ADMIN_ICONS.pin}
                            placeholder={isKn ? "ಉದಾ: ಗೋಕಾಕ, ಬೆಳಗಾವಿ" : "e.g. Gokak, Belagavi"}
                            value={adv.city}
                            onChange={(e) => setA("city", e.target.value)}
                            error={advErr.city}
                            disabled={loading}
                          />
                        </Field>

                        <Field label={isKn ? "ಅನುಭವದ ವರ್ಷಗಳು" : "Years of Experience"} error={advErr.experience}>
                          <Select
                            icon={ADMIN_ICONS.calendar}
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
                    </div>
                  )}

                  {/* STEP 6: Bio & Profile Photo (Photo is OPTIONAL, shows Initials when not uploaded!) */}
                  {activeStep === 6 && (
                    <div className="su-step-section-fields su-fade-in">
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
                        label={isKn ? "ಪ್ರೊಫೈಲ್ ಚಿತ್ರ (ಐಚ್ಛಿಕ)" : "Profile Image (Optional)"}
                        error={advErr.avatarData}
                        hint={isKn ? "ಚಿತ್ರ ಐಚ್ಛಿಕವಾಗಿದೆ. ಫೋಟೋ ಸೇರಿಸದಿದ್ದರೆ ನಿಮ್ಮ ಹೆಸರಿನ ಆರಂಭಿಕ ಅಕ್ಷರಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತದೆ. ನಂತರ ಅಡ್ವೊಕೇಟ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಫೋಟೋ ಸೇರಿಸಬಹುದು." : "Photo is optional. If not uploaded now, your initials avatar will be shown, and you can add your photo anytime from the Advocate Dashboard."}
                      >
                        <div className="su-avatar-upload-card">
                          <div
                            className="su-avatar-thumb-box"
                            style={{
                              background: adv.avatarData ? "transparent" : getAvatarColor(adv.fullName || "Advocate"),
                            }}
                          >
                            {adv.avatarData ? (
                              <img
                                src={adv.avatarData}
                                alt="Profile preview"
                                className="su-avatar-thumb-img"
                              />
                            ) : (
                              <span className="su-avatar-initials-text">
                                {getInitials(adv.fullName)}
                              </span>
                            )}
                          </div>

                          <div className="su-avatar-upload-body">
                            <div className="su-avatar-status-pill">
                              {adv.avatarData ? (
                                <span className="su-avatar-badge-success">✓ {isKn ? "ಫೋಟೋ ಸೇರಿಸಲಾಗಿದೆ" : "Photo Selected"}</span>
                              ) : (
                                <span className="su-avatar-badge-initials">
                                  🔤 {isKn ? `ಆರಂಭಿಕ ಅಕ್ಷರಗಳು: "${getInitials(adv.fullName)}"` : `Initials Avatar: "${getInitials(adv.fullName)}"`}
                                </span>
                              )}
                            </div>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              className="su-avatar-input"
                              onChange={handleAvatarChange}
                              disabled={loading}
                            />
                            {adv.avatarData && (
                              <button
                                type="button"
                                className="su-avatar-remove-btn"
                                onClick={() => setA("avatarData", "")}
                                disabled={loading}
                              >
                                ✕ {isKn ? "ಫೋಟೋ ತೆಗೆದುಹಾಕಿ (ಅಕ್ಷರಗಳನ್ನು ಬಳಸಿ)" : "Remove photo (Use initials)"}
                              </button>
                            )}
                          </div>
                        </div>
                      </Field>
                    </div>
                  )}

                  {/* STEP 7: Security & Verification */}
                  {activeStep === 7 && (
                    <div className="su-step-section-fields su-fade-in">
                      <div className="su-grid-2">
                        <Field label={t.password} required error={advErr.password}>
                          <Input
                            icon={ADMIN_ICONS.lock}
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
                            icon={ADMIN_ICONS.key}
                            type={showCPw ? "text" : "password"}
                            placeholder={isKn ? "ಪಾಸ್‌ವರ್ಡ್ ಪುನರಾವರ್ತಿಸಿ" : "Re-enter password"}
                            value={adv.confirmPw}
                            onChange={(e) => setA("confirmPw", e.target.value)}
                            error={advErr.confirmPw}
                            disabled={loading}
                            rightEl={
                              adv.confirmPw && adv.password === adv.confirmPw ? (
                                <span className="su-valid">{ADMIN_ICONS.check}</span>
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

                      <div className="su-verify-card">
                        <span className="su-verify-shield-icon">{ADMIN_ICONS.shieldCheck}</span>
                        <div className="su-verify-body">
                          <div className="su-verify-title">
                            {isKn ? "ಪರಿಶೀಲನಾ ಪ್ರಕ್ರಿಯೆ" : "Verification Process"}
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
                    </div>
                  )}
                </div>

                {/* Navigation Actions Bar */}
                <div className="su-adv-nav-actions">
                  {activeStep > 1 ? (
                    <button
                      type="button"
                      className="su-btn-prev"
                      onClick={handlePrevStep}
                      disabled={loading}
                    >
                      {ADMIN_ICONS.arrowLeft}
                      <span>{isKn ? "ಹಿಂದಿನ ಹಂತ" : "Previous Step"}</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="su-adv-nav-right">
                    {activeStep < 7 ? (
                      <button
                        type="button"
                        className="su-btn-next"
                        onClick={handleNextStep}
                        disabled={loading}
                      >
                        <span>{isKn ? "ಮುಂದಿನ ಹಂತ" : "Next Step"} ({activeStep + 1}/7)</span>
                        {ADMIN_ICONS.arrowRight}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="su-btn-advocate su-btn-submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <><span className="su-spinner" /> {t.registering}</>
                        ) : (
                          <>{ADMIN_ICONS.sparkle} <span>{t.createAdvocateBtn}</span> {ADMIN_ICONS.arrowRight}</>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <p className="su-login-link" style={{ marginTop: 24 }}>
                  {t.alreadyAdvocate}{" "}
                  <Link to="/login">
                    {t.signInHere} →
                  </Link>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
