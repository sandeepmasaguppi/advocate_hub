// ============================================================
//  AdvocatesList.js — Find a Lawyer Directory Page
//  Executive verified advocate directory with live city and practice search,
//  multi-criteria sorting, quick practice chips, bilingual EN/ಕನ್ನಡ support,
//  and full Dark & White (Light) theme integration.
// ============================================================

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAdvocates } from "../data/Advocatesstore";
import { assetUrl } from "../data/api";
import { getTheme } from "../data/themeStore";
import "./AdvocatesList.css";

const CITIES = [
  // A
  "Afzalpur", "Alur", "Aland", "Ankola", "Arakalgud", "Arasikere", "Athani", "Aurad", "Anekal",
  // B
  "Bagepalli", "Bagalkot", "Bailhongal", "Baindur", "Banahatti", "Bangarapet", "Bantwal",
  "Basavana Bagewadi", "Basavakalyan", "Belagavi", "Belthangady", "Belur", "Bhadravati",
  "Bhalki", "Bhatkal", "Bilagi", "Byadgi", "Bengaluru", "Bengaluru Rural",
  // C
  "Challakere", "Chamarajanagar", "Channagiri", "Channapatna", "Channarayapatna",
  "Chikkaballapur", "Chikkamagaluru", "Chikkodi", "Chiknayakanhalli", "Chincholi",
  "Chintamani", "Chitapur", "Chitradurga",
  // D
  "Dandeli", "Davangere", "Devanahalli", "Devadurga", "Dharwad", "Doddaballapur",
  // G
  "Gadag", "Gangavathi", "Gauribidanur", "Gokak", "Gudibande", "Gubbi", "Gundlupet",
  // H
  "H.D. Kote", "Hagaribommanahalli", "Haliyal", "Hanagal", "Harihar", "Hassan",
  "Haveri", "Holenarasipura", "Holalkere", "Honnavar", "Hosanagara", "Hospete",
  "Hosadurga", "Hoskote", "Humnabad", "Hukeri", "Hunsur",
  // I, J, K
  "Ilkal", "Indi", "Jagalur", "Jamkhandi", "Jevargi", "Kadaba", "Kadawada", "Kadur",
  "Kalaburagi", "Kalghatgi", "Kamalapura", "Kanakapura", "Karwar", "Khanapur",
  "Kolar", "Kollegal", "Koppa", "Koppal", "Koratagere", "Kotturu", "Kudligi",
  "Kuknur", "Kumta", "Kundapura", "Kundgol", "Kunigal", "Kurgod", "Kushtagi",
  // M
  "Madhugiri", "Madikeri", "Magadi", "Mahalingpur", "Malavalli", "Malur", "Mandya",
  "Mangaluru", "Manvi", "Maski", "Molakalmuru", "Moodbidri", "Muddebihal",
  "Mudhol", "Mudigere", "Mulbagal", "Mundargi", "Mundgod", "Mysuru",
  // N
  "Nagamangala", "Nanjangud", "Narasimharajapura", "Navalgund", "Nelamangala", "Nipani",
  // P, R
  "Pandavapura", "Pavagada", "Ponnampet", "Puttur", "Raichur", "Ramanagara",
  "Ramdurg", "Ranebennur", "Raybag", "Ron",
  // S
  "Sagara", "Sakleshpur", "Sandalaga", "Sandur", "Sankeshwar", "Savanur", "Sedam",
  "Shahabad", "Shahapur", "Shiggaon", "Shikaripura", "Shivamogga", "Shorapur",
  "Shirsi", "Siddapur", "Sindagi", "Sindhanur", "Sira", "Siruguppa", "Sirsi",
  "Somwarpet", "Srinivaspur", "Sringeri", "Srirangapatna", "Sullia",
  // T, U, V, Y
  "Tarikere", "Thirthahalli", "Tiptur", "Tirumakudalu Narasipura", "Tumakuru", "Turuvekere",
  "Udupi", "Vijayapura", "Virajpet", "Yadgir", "Yaragatti", "Yellapur", "Yelburga"
];

const PRACTICE_AREAS = [
  "Divorce", "Criminal", "Property", "Cheque Bounce", "Civil", "GST", "Tax",
  "Corporate", "Family", "Labour", "Consumer", "Cyber", "Immigration", "Banking",
  "Intellectual Property"
];

const POPULAR_SEARCHES = [
  "Divorce", "Criminal", "Property", "Cheque Bounce", "Civil", "GST", "Cyber"
];

const QUICK_FILTER_PILLS = [
  { id: "all", labelEn: "All Practices", labelKn: "ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳು", icon: "⚖️" },
  { id: "Criminal", labelEn: "Criminal Law", labelKn: "ಕ್ರಿಮಿನಲ್ ಕಾನೂನು", icon: "🔒" },
  { id: "Civil", labelEn: "Civil Matters", labelKn: "ಸಿವಿಲ್ ದಾವೆಗಳು", icon: "⚖️" },
  { id: "Family", labelEn: "Family & Divorce", labelKn: "ಕೌಟುಂಬಿಕ & ವಿಚ್ಛೇದನ", icon: "👨‍👩‍👧" },
  { id: "Property", labelEn: "Property & RERA", labelKn: "ಆಸ್ತಿ & ರೇರಾ", icon: "🏠" },
  { id: "Corporate", labelEn: "Corporate & GST", labelKn: "ಕಾರ್ಪೊರೇಟ್ & ತೆರಿಗೆ", icon: "🏢" },
  { id: "Cheque Bounce", labelEn: "Cheque Bounce (138)", labelKn: "ಚೆಕ್ ಬೌನ್ಸ್ (138)", icon: "💳" },
  { id: "Cyber", labelEn: "Cyber Crime", labelKn: "ಸೈಬರ್ ಅಪರಾಧ", icon: "💻" },
];

const CATEGORY_PRACTICES = {
  family: ["Family", "Divorce"],
  criminal: ["Criminal", "Cyber"],
  property: ["Property"],
  civil: ["Civil", "Cheque Bounce", "Banking"],
  corporate: ["Corporate", "GST", "Tax", "Intellectual Property"],
};

const PRACTICE_THEMES = {
  Criminal: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  Civil: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  Family: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Divorce: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Property: { bg: "#faf5ff", color: "#7c3aed", border: "#e9d5ff" },
  Corporate: { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  Tax: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  GST: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Cyber: { bg: "#ecfeff", color: "#0891b2", border: "#a5f3fc" },
  Banking: { bg: "#f0fdfa", color: "#0f766e", border: "#99f6e4" },
  "Cheque Bounce": { bg: "#fdf4ff", color: "#a21caf", border: "#f5d0fe" },
};

const normalize = (value = "") => (value ?? "").toString().trim().toLowerCase();

const getInitials = (name = "") =>
  name
    .replace(/^Adv\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "AD";

const getAvatarColor = (name = "") => {
  const palette = ["#2563eb", "#16a34a", "#7c3aed", "#dc2626", "#ea580c", "#0891b2", "#0f766e", "#9333ea"];
  const sum = name.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return palette[sum % palette.length];
};

function AdvocateAvatar({ advocate }) {
  const [failed, setFailed] = useState(false);
  const avatarSrc = advocate.avatar ? assetUrl(advocate.avatar) : "";

  return (
    <div
      className="fl-card-avatar"
      style={{
        background: !failed && avatarSrc ? "transparent" : getAvatarColor(advocate.name),
      }}
    >
      {!failed && avatarSrc ? (
        <img
          src={avatarSrc}
          alt={advocate.name}
          className="fl-avatar-img"
          onError={() => setFailed(true)}
        />
      ) : (
        getInitials(advocate.name)
      )}
    </div>
  );
}

function CustomSearchDropdown({
  icon,
  placeholder,
  value,
  onChange,
  options,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [showAll, setShowAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowAll(false);
        setActiveIndex(-1);
        if (inputValue.trim()) {
          const match = options.find((opt) => opt.toLowerCase() === inputValue.trim().toLowerCase());
          if (match && match !== inputValue) {
            setInputValue(match);
            onChange(match);
          }
        }
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowAll(false);
        setActiveIndex(-1);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, inputValue, options, onChange]);

  const filteredOptions = useMemo(() => {
    const trimmed = inputValue.trim().toLowerCase();
    if (!trimmed || showAll) {
      return options;
    }
    return options.filter((opt) => opt.toLowerCase().includes(trimmed));
  }, [options, inputValue, showAll]);

  const handleSelect = (val) => {
    onChange(val);
    setInputValue(val);
    setShowAll(false);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setShowAll(false);
    onChange(val);
    setActiveIndex(0);
    if (!isOpen) setIsOpen(true);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setInputValue("");
    setShowAll(true);
    setActiveIndex(-1);
    setIsOpen(true);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleToggleClick = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      setIsOpen(true);
      setShowAll(true);
      if (inputRef.current) inputRef.current.focus();
    } else {
      setIsOpen(false);
      setShowAll(false);
    }
  };

  return (
    <div className={`fl-search-dropdown-wrap ${isOpen ? "is-open" : ""}`} ref={dropdownRef}>
      <div
        className="fl-dropdown-input-bar"
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true);
            setShowAll(true);
            if (inputRef.current) inputRef.current.focus();
          }
        }}
      >
        <span className="fl-dropdown-icon">{icon}</span>
        <input
          ref={inputRef}
          type="text"
          className="fl-dropdown-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (!isOpen) {
              setIsOpen(true);
              setShowAll(true);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
        />
        {inputValue ? (
          <button
            type="button"
            className="fl-dropdown-clear"
            onClick={handleClear}
            title="Clear"
            tabIndex={-1}
          >
            ✕
          </button>
        ) : null}
        <button
          type="button"
          className="fl-dropdown-toggle-arrow"
          onClick={handleToggleClick}
          tabIndex={-1}
          title="Toggle list"
        >
          <span className={`fl-arrow-icon ${isOpen ? "open" : ""}`}>▾</span>
        </button>
      </div>

      {isOpen && (
        <div className="fl-dropdown-menu">
          <ul className="fl-dropdown-list" ref={listRef} role="listbox">
            {(!inputValue.trim() || showAll) && (
              <li
                className={`fl-dropdown-item ${!value ? "selected" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect("");
                }}
                role="option"
                aria-selected={!value}
              >
                <span>{placeholder}</span>
                {!value && <span className="fl-check-mark">✓</span>}
              </li>
            )}
            {filteredOptions.length === 0 ? (
              <li className="fl-dropdown-empty">No matching options found</li>
            ) : (
              filteredOptions.map((opt, idx) => (
                <li
                  key={opt}
                  className={`fl-dropdown-item ${value === opt ? "selected" : ""} ${
                    activeIndex === idx ? "active-item" : ""
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(opt);
                  }}
                  role="option"
                  aria-selected={value === opt}
                >
                  <span>{opt}</span>
                  {value === opt && <span className="fl-check-mark">✓</span>}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function AdvocatesList({ lang: propLang } = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL Query Parameters
  const category = normalize(searchParams.get("cat"));
  const categoryPractices = useMemo(() => CATEGORY_PRACTICES[category] || [], [category]);
  const queryCity = searchParams.get("city") || "";
  const queryPractice = searchParams.get("area") || "";

  // Filter States
  const [city, setCity] = useState(queryCity);
  const [practice, setPractice] = useState(queryPractice);
  const [activeChip, setActiveChip] = useState("all");
  const [sortBy, setSortBy] = useState("rating"); // rating | experience | cases | az
  const [visibleCount, setVisibleCount] = useState(9);

  // Theme Sync
  const [theme, setTheme] = useState(getTheme);
  useEffect(() => {
    const handleThemeChange = (e) => setTheme(e?.detail || getTheme());
    window.addEventListener("law4u_theme_change", handleThemeChange);
    return () => window.removeEventListener("law4u_theme_change", handleThemeChange);
  }, []);

  // Language Sync
  const [lang, setLang] = useState(() => {
    try {
      return propLang || localStorage.getItem("law4u_home_lang") || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    if (propLang) setLang(propLang);
  }, [propLang]);

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

  // Approved Advocates Data
  const [allAdvocates, setAllAdvocates] = useState(() => {
    const list = getAdvocates();
    return Array.isArray(list) ? list.filter((a) => a.status === "approved") : [];
  });

  useEffect(() => {
    const refreshAdvocates = () => {
      const list = getAdvocates();
      setAllAdvocates(Array.isArray(list) ? list.filter((a) => a.status === "approved") : []);
    };
    refreshAdvocates();
    window.addEventListener("law4u_advocates_updated", refreshAdvocates);
    return () => window.removeEventListener("law4u_advocates_updated", refreshAdvocates);
  }, []);

  useEffect(() => {
    setCity(queryCity);
    setPractice(queryPractice);
    setVisibleCount(9);
  }, [queryCity, queryPractice]);

  // Comprehensive Filtering & Sorting Logic
  const filteredAndSortedList = useMemo(() => {
    const targetCity = normalize(city);
    const targetPractice = normalize(practice);
    const targetChip = normalize(activeChip);

    let list = (allAdvocates || []).filter((person) => {
      if (!person) return false;

      // City filter matching
      const pCity = normalize(person.city || "");
      const pDist = normalize(person.district || "");
      const pTaluk = normalize(person.taluk || "");

      const cityMatch =
        !targetCity ||
        pCity === targetCity ||
        pCity.includes(targetCity) ||
        targetCity.includes(pCity) ||
        (pDist && (pDist === targetCity || pDist.includes(targetCity) || targetCity.includes(pDist))) ||
        (pTaluk && (pTaluk === targetCity || pTaluk.includes(targetCity) || targetCity.includes(pTaluk)));

      // Practice Area filter matching
      const personPractice = normalize(person.practiceArea || person.speciality || "");
      let practiceMatch = true;

      if (targetPractice) {
        practiceMatch =
          personPractice === targetPractice ||
          personPractice.includes(targetPractice) ||
          targetPractice.includes(personPractice);
      } else if (categoryPractices.length > 0) {
        practiceMatch = categoryPractices.some((p) => {
          const normP = normalize(p);
          return personPractice === normP || personPractice.includes(normP);
        });
      }

      // Quick Filter Pill matching
      let chipMatch = true;
      if (targetChip && targetChip !== "all") {
        chipMatch = personPractice.includes(targetChip);
      }

      return cityMatch && practiceMatch && chipMatch;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === "rating") {
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      }
      if (sortBy === "experience") {
        const expA = parseInt(a.experience, 10) || 0;
        const expB = parseInt(b.experience, 10) || 0;
        return expB - expA;
      }
      if (sortBy === "cases") {
        const casesA = parseInt(a.cases, 10) || 0;
        const casesB = parseInt(b.cases, 10) || 0;
        return casesB - casesA;
      }
      if (sortBy === "az") {
        return (a.name || "").localeCompare(b.name || "");
      }
      return 0;
    });

    return list;
  }, [allAdvocates, city, practice, activeChip, sortBy, categoryPractices]);

  const displayedAdvocates = filteredAndSortedList.slice(0, visibleCount);

  // Chat Now Handler — Direct connection to client registration or client dashboard
  const handleChatNow = (adv) => {
    const cid = Number(
      localStorage.getItem("law4u_client_id") || sessionStorage.getItem("law4u_client_id") || 0
    );
    if (cid && adv?.id) {
      sessionStorage.setItem(`law4u_active_chat_${cid}`, String(adv.id));
      localStorage.setItem(`law4u_active_chat_${cid}`, String(adv.id));
      navigate(`/client-dashboard?advocateId=${adv.id}`);
    } else if (adv?.id) {
      navigate(`/client-login?redirect=/client-dashboard?advocateId=${adv.id}`);
    } else {
      navigate("/client-login");
    }
  };

  const handleResetFilters = () => {
    setCity("");
    setPractice("");
    setActiveChip("all");
    setVisibleCount(9);
  };

  return (
    <div className={`fl-page ${theme === "dark" ? "fl-dark" : "fl-light"}`}>
      {/* ── HERO BANNER ── */}
      <section className="fl-hero-section">
        <div className="fl-hero-inner">
          <h1 className="fl-hero-title">
            {isKn
              ? "ಪರಿಶೀಲಿತ ಹಿರಿಯ ಮತ್ತು ತಜ್ಞ ವಕೀಲರನ್ನು ಹುಡುಕಿ"
              : "Find & Consult Verified Advocates"}
          </h1>
          <p className="fl-hero-subtitle">
            {isKn
              ? "ಜಿಲ್ಲಾ ನ್ಯಾಯಾಲಯಗಳು, ಕರ್ನಾಟಕ ಹೈಕೋರ್ಟ್ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ನ್ಯಾಯಮಂಡಳಿಗಳ ಪರಿಣಿತ ವಕೀಲರೊಂದಿಗೆ ನೇರ ಸಮಾಲೋಚನೆ ಅಥವಾ ಚಾಟ್ ಆರಂಭಿಸಿ."
              : "Connect directly with top practitioners across District Courts, High Court of Karnataka, and National Tribunals for immediate legal counsel and representation."}
          </p>
        </div>
      </section>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <section className="fl-search-section">
        <div className="fl-search-container">
          <div className="fl-search-bar">
            <div className="fl-search-field">
              <CustomSearchDropdown
                icon="📍"
                placeholder={isKn ? "ನಗರ ಅಥವಾ ತಾಲೂಕು ಆಯ್ಕೆಮಾಡಿ (ಟೈಪ್ ಮಾಡಿ)..." : "Select City / Taluk (type to search...)"}
                value={city}
                onChange={(val) => {
                  setCity(val);
                  setVisibleCount(9);
                }}
                options={CITIES}
              />
            </div>

            <div className="fl-search-field">
              <CustomSearchDropdown
                icon="⚖️"
                placeholder={isKn ? "ವಕಾಲತ್ತು ಕ್ಷೇತ್ರ (ಕ್ರಿಮಿನಲ್, ಸಿವಿಲ್, ವಿಚ್ಛೇದನ...)" : "Practice Area (Criminal, Civil, Divorce...)"}
                value={practice}
                onChange={(val) => {
                  setPractice(val);
                  setVisibleCount(9);
                }}
                options={PRACTICE_AREAS}
              />
            </div>

            <button
              type="button"
              className="fl-search-submit-btn"
              onClick={() => setVisibleCount(9)}
            >
              <span>🔍</span>
              <span>{isKn ? "ಹುಡುಕಿ" : "Search"}</span>
            </button>
          </div>

          {/* Quick Practice Filter Pills */}
          <div className="fl-pills-row">
            {QUICK_FILTER_PILLS.map((pill) => (
              <button
                key={pill.id}
                type="button"
                className={`fl-pill-btn ${activeChip === pill.id ? "active" : ""}`}
                onClick={() => {
                  setActiveChip(pill.id);
                  setVisibleCount(9);
                }}
              >
                <span>{pill.icon}</span>
                <span>{isKn ? pill.labelKn : pill.labelEn}</span>
              </button>
            ))}
          </div>

          {/* Popular Search Keywords */}
          <div className="fl-popular-row">
            <span className="fl-popular-label">
              {isKn ? "ಜನಪ್ರಿಯ ಹುಡುಕಾಟಗಳು:" : "Popular Searches:"}
            </span>
            <div className="fl-popular-tags">
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`fl-popular-tag ${practice === tag ? "active" : ""}`}
                  onClick={() => {
                    setPractice(tag);
                    setVisibleCount(9);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULTS HEADER & SORTING BAR ── */}
      <section className="fl-results-section">
        <div className="fl-results-header">
          <div className="fl-results-meta">
            <h2 className="fl-results-count">
              {isKn ? (
                <>
                  <strong>{filteredAndSortedList.length}</strong> ಪರಿಶೀಲಿತ ವಕೀಲರು ಲಭ್ಯವಿದ್ದಾರೆ
                  {city ? ` · ${city}` : ""}
                  {practice ? ` · ${practice}` : ""}
                </>
              ) : (
                <>
                  Showing <strong>{filteredAndSortedList.length}</strong> Verified Advocates
                  {city ? ` in ${city}` : ""}
                  {practice ? ` for ${practice}` : ""}
                </>
              )}
            </h2>
            {(city || practice || activeChip !== "all") && (
              <button
                type="button"
                className="fl-reset-btn"
                onClick={handleResetFilters}
              >
                ✕ {isKn ? "ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ" : "Reset All Filters"}
              </button>
            )}
          </div>

          {/* Sorting Dropdown */}
          <div className="fl-sort-box">
            <label htmlFor="fl-sort-select">{isKn ? "ವಿಂಗಡಣೆ:" : "Sort by:"}</label>
            <select
              id="fl-sort-select"
              className="fl-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">{isKn ? "⭐ ಗರಿಷ್ಠ ರೇಟಿಂಗ್" : "⭐ Highest Rated"}</option>
              <option value="experience">{isKn ? "⏳ ಹೆಚ್ಚು ಅನುಭವಿ" : "⏳ Most Experienced"}</option>
              <option value="cases">{isKn ? "💼 ಹೆಚ್ಚು ಪ್ರಕರಣಗಳು" : "💼 Most Cases Won"}</option>
              <option value="az">{isKn ? "🔤 ಹೆಸರು (A - Z)" : "🔤 Name (A - Z)"}</option>
            </select>
          </div>
        </div>

        {/* ── ADVOCATES GRID ── */}
        {filteredAndSortedList.length === 0 ? (
          <div className="fl-empty-state">
            <div className="fl-empty-icon">🔍⚖️</div>
            <h3>{isKn ? "ಯಾವುದೇ ವಕೀಲರು ಕಂಡುಬಂದಿಲ್ಲ" : "No Advocates Found"}</h3>
            <p>
              {isKn
                ? "ಆಯ್ಕೆಮಾಡಿದ ನಗರ ಅಥವಾ ವಕಾಲತ್ತು ಕ್ಷೇತ್ರಕ್ಕೆ ಹೊಂದಾಣಿಕೆಯಾಗುವ ವಕೀಲರು ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಿ ಅಥವಾ ತೆರವುಗೊಳಿಸಿ."
                : "No verified advocates match your current filter combination. Try clearing your city or choosing a broader practice area."}
            </p>
            <button
              type="button"
              className="fl-empty-reset-btn"
              onClick={handleResetFilters}
            >
              {isKn ? "ಎಲ್ಲಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ" : "Reset All Filters"}
            </button>
          </div>
        ) : (
          <div className="fl-grid">
            {displayedAdvocates.map((adv) => {
              const specColor = PRACTICE_THEMES[adv.speciality] || PRACTICE_THEMES[adv.practiceArea] || {
                bg: "#eff6ff",
                color: "#2563eb",
                border: "#bfdbfe",
              };

              return (
                <article key={adv.id} className="fl-card">
                  {/* Top Bar Badges */}
                  <div className="fl-card-topbar">
                    
                    {adv.court && (
                      <span className="fl-court-badge" title={adv.court}>
                        🏛️ {adv.court.length > 22 ? adv.court.slice(0, 20) + "…" : adv.court}
                      </span>
                    )}
                  </div>

                  {/* Header: Avatar, Name & Location */}
                  <div className="fl-card-header">
                    <AdvocateAvatar advocate={adv} />
                    <div className="fl-card-info">
                      <h3
                        className="fl-adv-name"
                        onClick={() => navigate(`/profile/${adv.id}`)}
                      >
                        {adv.name}
                      </h3>
                      <div
                        className="fl-adv-speciality"
                        style={{
                          background: specColor.bg,
                          color: specColor.color,
                          borderColor: specColor.border,
                        }}
                      >
                        {adv.speciality || adv.practiceArea || "Legal Counsel"}
                      </div>
                      <div className="fl-adv-location">
                        <span>📍 {adv.city || adv.district || "Karnataka"}</span>
                        {adv.experience && <span>• ⏳ {adv.experience}</span>}
                      </div>
                    </div>
                  </div>

                  {/* 3-Tile Performance Matrix */}
                  <div className="fl-card-matrix">
                    <div className="fl-matrix-tile">
                      <span className="fl-matrix-label">{isKn ? "ರೇಟಿಂಗ್" : "Rating"}</span>
                      <strong className="fl-matrix-val">⭐ {adv.rating || "4.9"}</strong>
                    </div>
                    <div className="fl-matrix-tile">
                      <span className="fl-matrix-label">{isKn ? "ಪ್ರಕರಣಗಳು" : "Cases"}</span>
                      <strong className="fl-matrix-val">💼 {adv.cases ? `${adv.cases}+` : "120+"}</strong>
                    </div>
                    <div className="fl-matrix-tile">
                      <span className="fl-matrix-label">{isKn ? "ಅನುಭವ" : "Experience"}</span>
                      <strong className="fl-matrix-val">{adv.experience || "6+ Yrs"}</strong>
                    </div>
                  </div>

                  {/* Bio Preview */}
                  <p className="fl-card-bio">
                    {adv.bio
                      ? adv.bio.length > 130
                        ? adv.bio.slice(0, 128) + "…"
                        : adv.bio
                      : `${adv.name} is a verified advocate representing clients before the ${adv.court || "District Courts"} with specialization in ${adv.speciality || "comprehensive legal advisory"}.`}
                  </p>

                  {/* Spoken Languages */}
                  <div className="fl-card-languages">
                    <span className="fl-lang-icon">🗣️</span>
                    {(Array.isArray(adv.languages) && adv.languages.length > 0
                      ? adv.languages
                      : ["Kannada", "English", "Hindi"]
                    ).map((langItem) => (
                      <span key={langItem} className="fl-lang-tag">
                        {langItem}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="fl-card-actions">
                    
                    <button
                      type="button"
                      className="fl-btn-profile"
                      onClick={() => navigate(`/profile/${adv.id}`)}
                    >
                      <span>{isKn ? "ಪ್ರೊಫೈಲ್ ನೋಡಿ" : "Profile"}</span>
                      <span>→</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {filteredAndSortedList.length > visibleCount && (
          <div className="fl-load-more-wrap">
            <button
              type="button"
              className="fl-load-more-btn"
              onClick={() => setVisibleCount((prev) => prev + 9)}
            >
              {isKn
                ? `ಇನ್ನಷ್ಟು ವಕೀಲರನ್ನು ತೋರಿಸಿ (${filteredAndSortedList.length - visibleCount} ಉಳಿದಿವೆ) ↓`
                : `Load More Advocates (${filteredAndSortedList.length - visibleCount} remaining) ↓`}
            </button>
          </div>
        )}
      </section>

      {/* ── FOOTER TRUST BANNER ── */}
      <section className="fl-bottom-trust">
        <div className="fl-bottom-inner">
          <div className="fl-bottom-col">
            <span className="fl-bottom-icon">🛡️</span>
            <h4>{isKn ? "೧೦೦% ಬಾರ್ ಕೌನ್ಸಿಲ್ ಪರಿಶೀಲನೆ" : "Bar Council Certified Advocates"}</h4>
            <p>
              {isKn
                ? "ನಮ್ಮ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನಲ್ಲಿರುವ ಪ್ರತಿಯೊಬ್ಬ ವಕೀಲರು ರಾಜ್ಯ ಬಾರ್ ಕೌನ್ಸಿಲ್ ದಾಖಲೆಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿದ್ದಾರೆ."
                : "Every advocate listed is vetted against official State Bar Council enrollment registers."}
            </p>
          </div>
          <div className="fl-bottom-col">
            <span className="fl-bottom-icon">💬</span>
            <h4>{isKn ? "ನೇರ ಹಾಗೂ ಗೌಪ್ಯ ಸಮಾಲೋಚನೆ" : "Direct & Confidential Consultation"}</h4>
            <p>
              {isKn
                ? "ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ವಕೀಲರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ ಅಥವಾ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ."
                : "Connect 1-on-1 with counsel with statutory client-attorney confidentiality protection."}
            </p>
          </div>
          <div className="fl-bottom-col">
            <span className="fl-bottom-icon">⚖️</span>
            <h4>{isKn ? "ನ್ಯಾಯಾಲಯದ ಸಂಪೂರ್ಣ ಪರಿಹಾರ" : "Full Representation & Filing"}</h4>
            <p>
              {isKn
                ? "ಜಿಲ್ಲಾ ನ್ಯಾಯಾಲಯಗಳು, ಹೈಕೋರ್ಟ್ ಮತ್ತು ನ್ಯಾಯಮಂಡಳಿಗಳಲ್ಲಿ ದಾವೆ ಸಲ್ಲಿಕೆ ಮತ್ತು ಪ್ರಾತಿನಿಧ್ಯ."
                : "Complete trial and appellate representation across District Courts, High Court, and Tribunals."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}