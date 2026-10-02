// ============================================================
//  LegalDocuments.js — Ready-to-Use Legal Templates & Court Petitions
//  Part of the 4 Legal Sections:
//    1. Ask a Question  2. Legal Documents  3. Bare Acts  4. Legal News
//  Supports White & Dark Themes with English & Kannada translations
// ============================================================

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTheme } from "../data/themeStore";
import "./LegalDocuments.css";

export const LEGAL_DOC_CATEGORIES_EN = [
  "All", "Family", "Property", "Criminal", "Civil",
  "Corporate", "Labour", "Consumer", "Banking",
];

export const LEGAL_DOC_CATEGORIES_KN = [
  "ಎಲ್ಲಾ", "ಕೌಟುಂಬಿಕ", "ಆಸ್ತಿ", "ಕ್ರಿಮಿನಲ್", "ಸಿವಿಲ್",
  "ಕಾರ್ಪೊರೇಟ್", "ಕಾರ್ಮಿಕ", "ಗ್ರಾಹಕ", "ಬ್ಯಾಂಕಿಂಗ್",
];

export const CATEGORIES = LEGAL_DOC_CATEGORIES_EN;
export const LEGAL_DOC_CATEGORIES = LEGAL_DOC_CATEGORIES_EN;

export const LEGAL_DOCUMENTS = [
  { id: 1,  icon: "📝", title: "Divorce Petition",               category: "Family",    desc: "Draft a divorce petition under Hindu Marriage Act or Special Marriage Act.", downloads: 12400, free: true,  pages: 4 },
  { id: 2,  icon: "👶", title: "Child Custody Agreement",         category: "Family",    desc: "Legal agreement for child custody, visitation rights and maintenance.", downloads: 8200,  free: true,  pages: 3 },
  { id: 3,  icon: "🤝", title: "Maintenance Agreement",          category: "Family",    desc: "Monthly maintenance agreement between separated spouses.", downloads: 6500,  free: true,  pages: 2 },
  { id: 4,  icon: "🏠", title: "Rental Agreement",               category: "Property",  desc: "Standard residential/commercial rent agreement as per local laws.", downloads: 45000, free: true,  pages: 6 },
  { id: 5,  icon: "🏗️", title: "Sale Deed",                     category: "Property",  desc: "Property sale deed template compliant with Registration Act.", downloads: 23000, free: false, pages: 8 },
  { id: 6,  icon: "📋", title: "Power of Attorney",             category: "Property",  desc: "General and specific power of attorney for property matters.", downloads: 18000, free: false, pages: 3 },
  { id: 7,  icon: "🔒", title: "Bail Application",              category: "Criminal",  desc: "Regular and anticipatory bail application template for district court.", downloads: 9800,  free: true,  pages: 2 },
  { id: 8,  icon: "📄", title: "FIR Complaint Letter",          category: "Criminal",  desc: "Format for complaint letter to police station for filing FIR.", downloads: 15600, free: true,  pages: 1 },
  { id: 9,  icon: "⚖️", title: "Civil Suit Plaint",             category: "Civil",     desc: "Plaint format for filing civil suit in district court.", downloads: 7400,  free: false, pages: 5 },
  { id: 10, icon: "💰", title: "Recovery Suit",                 category: "Civil",     desc: "Suit for recovery of money — NI Act Section 138 cheque bounce.", downloads: 11200, free: true,  pages: 3 },
  { id: 11, icon: "🏢", title: "Partnership Deed",              category: "Corporate", desc: "Partnership firm deed template compliant with Indian Partnership Act.", downloads: 5600,  free: false, pages: 7 },
  { id: 12, icon: "📊", title: "Shareholders Agreement",        category: "Corporate", desc: "Agreement between company shareholders defining rights and obligations.", downloads: 4200,  free: false, pages: 12 },
  { id: 13, icon: "📃", title: "Employment Agreement",          category: "Labour",    desc: "Employer-employee agreement with salary, role, and termination clauses.", downloads: 19800, free: true,  pages: 5 },
  { id: 14, icon: "📬", title: "Legal Notice (General)",        category: "Civil",     desc: "General legal notice format for demand, breach of contract or default.", downloads: 31000, free: true,  pages: 1 },
  { id: 15, icon: "🛒", title: "Consumer Complaint",            category: "Consumer",  desc: "Complaint format for consumer forum against product/service deficiency.", downloads: 8900,  free: true,  pages: 3 },
  { id: 16, icon: "🏦", title: "Loan Agreement",                category: "Banking",   desc: "Personal loan agreement between lender and borrower with repayment terms.", downloads: 6700,  free: false, pages: 4 },
  { id: 17, icon: "📑", title: "Non-Disclosure Agreement (NDA)",category: "Corporate", desc: "Confidentiality and NDA between parties for business dealings.", downloads: 13400, free: false, pages: 3 },
  { id: 18, icon: "🧾", title: "Affidavit",                     category: "Civil",     desc: "General affidavit format notarised before magistrate.", downloads: 28000, free: true,  pages: 1 },
  { id: 19, icon: "🤝", title: "MOU (Memorandum of Understanding)", category: "Corporate", desc: "MOU template for business agreements and joint ventures.", downloads: 9100, free: false, pages: 4 },
  { id: 20, icon: "📰", title: "Will and Testament",            category: "Property",  desc: "Last will and testament format compliant with Indian Succession Act.", downloads: 7800,  free: false, pages: 5 },
];

export const DOCUMENTS = LEGAL_DOCUMENTS;

function downloadDocumentDraft(doc) {
  const content = `===========================================================
ADVOCATES HUB — VERIFIED INDIAN LEGAL DRAFT TEMPLATE
DOCUMENT TITLE: ${doc.title.toUpperCase()}
CATEGORY: ${doc.category}
ESTIMATED LENGTH: ${doc.pages} Pages
===========================================================

IN THE COURT OF THE PRINCIPAL DISTRICT AND SESSIONS JUDGE / COMPETENT TRIBUNAL
AT: ________________________, KARNATAKA / INDIA

IN THE MATTER OF:
${doc.title}

BETWEEN:
1. ________________________________________ (Applicant / Petitioner / First Party)
   Age: ___ Years, S/o, D/o, W/o: __________________________
   Residing at: _____________________________________________
                                                    ... PETITIONER / FIRST PARTY
                                  VERSUS
2. ________________________________________ (Respondent / Second Party)
   Age: ___ Years, S/o, D/o, W/o: __________________________
   Residing at: _____________________________________________
                                                    ... RESPONDENT / SECOND PARTY

MOST RESPECTFULLY SHOWETH:

1. JURISDICTION & PARTIES:
   That the petitioner is a citizen of India residing at the aforesaid address. The cause of action arose within the territorial and pecuniary jurisdiction of this Hon'ble Court / competent authority.

2. FACTS OF THE MATTER:
   (a) That on or about __/__/____, the parties entered into a transaction / relationship regarding ${doc.desc.toLowerCase()}.
   (b) That subsequent events necessitated this formal statutory application / agreement.
   (c) That all statutory notices / communications required under Indian substantive and procedural laws have been duly complied with.

3. STATUTORY GROUNDS & CLAUSES:
   (i) That the applicant has satisfied all conditions precedent required under the relevant Central & State enactments.
   (ii) That no other identical proceedings are pending before any other court of concurrent jurisdiction.
   (iii) That irreparable injury and hardship would be caused if the relief prayed for is not granted.

4. PRAYER:
   Wherefore, in light of the above facts, the Petitioner respectfully prays that this Hon'ble Authority may be pleased to:
   (a) Grant the relief prayed for under ${doc.title};
   (b) Award costs of these proceedings;
   (c) Pass such other and further orders as this Hon'ble Court deems fit in the interest of justice and equity.

VERIFICATION:
I, the above-named Petitioner, do hereby verify and state that the contents of paragraphs 1 to 4 are true and correct to the best of my personal knowledge, belief, and records. Verified on this ___ day of ____________, 2026.

DEPONENT / APPLICANT: _________________________
ADVOCATE FOR APPLICANT: _______________________
Bar Council Reg. No.: __________________________
===========================================================
Generated via Advocates Hub Legal Drafting Suite (https://advocateshub.in)
`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${doc.title.replace(/\s+/g, "_")}_Template.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function DocCard({ doc, onDownload, onPreview, isKn }) {
  return (
    <div className="ld-doc-card">
      <div className="ld-doc-card-top">
        <div className="ld-doc-icon">{doc.icon}</div>
        <div className="ld-doc-meta">
          <span className={`ld-doc-badge ${doc.free ? "free" : "premium"}`}>
            {doc.free ? (isKn ? "ಉಚಿತ" : "FREE") : (isKn ? "ಪ್ರೀಮಿಯಂ" : "PREMIUM")}
          </span>
          <span className="ld-doc-pages">{doc.pages} {isKn ? "ಪುಟಗಳು" : "pages"}</span>
        </div>
      </div>
      <h3 className="ld-doc-title">{doc.title}</h3>
      <p className="ld-doc-desc">{doc.desc}</p>
      <div className="ld-doc-downloads">⬇ {doc.downloads.toLocaleString()} {isKn ? "ಡೌನ್‌ಲೋಡ್‌ಗಳು" : "downloads"}</div>
      <div className="ld-doc-actions">
        <button type="button" className="ld-btn-preview" onClick={() => onPreview(doc)}>
          👁 {isKn ? "ವೀಕ್ಷಿಸಿ" : "Preview"}
        </button>
        <button type="button" className="ld-btn-download" onClick={() => onDownload(doc)}>
          {doc.free ? (isKn ? "⬇ ಉಚಿತ ಡೌನ್‌ಲೋಡ್" : "⬇ Download Free") : (isKn ? "🔒 ಡೌನ್‌ಲೋಡ್" : "🔒 Download")}
        </button>
      </div>
    </div>
  );
}

function PreviewModal({ doc, onClose, onDownload, isKn }) {
  if (!doc) return null;
  return (
    <div className="ld-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ld-modal">
        <div className="ld-modal-header">
          <div>
            <h3>
              {doc.icon} {doc.title}
            </h3>
            <p>
              {doc.category} · {doc.pages} {isKn ? "ಪುಟಗಳು" : "pages"}
            </p>
          </div>
          <button type="button" className="ld-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="ld-modal-body">
          <div className="ld-doc-preview-box">
            <div className="ld-preview-header">
              <div className="ld-preview-logo">ADVOCATES HUB LEGAL TEMPLATE</div>
              <div style={{ textAlign: "right", fontSize: 11 }}>
                <div>Verified Standard Draft</div>
                <div>Indian Judicial Format</div>
              </div>
            </div>
            <h2 className="ld-preview-title">{doc.title.toUpperCase()}</h2>
            <div className="ld-preview-content">
              <p>IN THE COURT OF THE LEARNED ____________________</p>
              <p>AT ____________________, KARNATAKA</p>
              <br />
              <p>
                <strong>Case No.: ____________________ of 2026</strong>
              </p>
              <br />
              <p>
                <strong>Petitioner / Plaintiff:</strong> ____________________
              </p>
              <p>S/o, D/o, W/o: ____________________, Age: ___ Years</p>
              <p>R/o: _________________________________________________</p>
              <br />
              <p>
                <strong>VERSUS</strong>
              </p>
              <br />
              <p>
                <strong>Respondent / Defendant:</strong> ____________________
              </p>
              <p>S/o, D/o, W/o: ____________________, Age: ___ Years</p>
              <p>R/o: _________________________________________________</p>
              <br />
              <p>
                <strong>APPLICATION UNDER THE RELEVANT PROVISIONS OF INDIAN LAW</strong>
              </p>
              <br />
              <p>
                The Applicant most respectfully states that the subject matter of this agreement/petition relates to {doc.desc}. All statutory formalities and territorial prerequisites have been fully complied with.
              </p>
              <div className="ld-preview-blur">
                <p>
                  WHEREAS the parties entered into mutual understanding on terms outlined hereunder...
                </p>
                <p>
                  AND WHEREAS both parties affirm the validity of all clauses and conditions herein...
                </p>
                <p>
                  IN WITNESS WHEREOF the parties have set their signatures on the date first written...
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="ld-modal-footer">
          <div>
            <span className={`ld-doc-badge ${doc.free ? "free" : "premium"}`} style={{ marginRight: 8 }}>
              {doc.free ? "FREE" : "PREMIUM"}
            </span>
            <span style={{ fontSize: 12, opacity: 0.8 }}>
              {isKn ? "ಪೂರ್ಣ ಕರಡು ವರ್ಡ್ ಮತ್ತು ಟೆಕ್ಸ್ಟ್ ರೂಪದಲ್ಲಿ ಲಭ್ಯ" : "Complete clean editable text format"}
            </span>
          </div>
          <button type="button" className="ld-btn-download" onClick={() => onDownload(doc)}>
            ⬇ {isKn ? "ಈಗಲೇ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ" : "Download Draft Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LegalDocuments() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    const handleTheme = (e) => setTheme(e?.detail || getTheme());
    window.addEventListener("law4u_theme_change", handleTheme);
    return () => window.removeEventListener("law4u_theme_change", handleTheme);
  }, []);

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

  const isKn = lang === "kn";

  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const handleDownload = (doc) => {
    downloadDocumentDraft(doc);
    showToast(isKn ? `✅ "${doc.title}" ಡೌನ್‌ಲೋಡ್ ಆರಂಭವಾಗಿದೆ!` : `✅ Downloaded "${doc.title}" template!`);
  };

  const filtered = useMemo(() => {
    let list = [...DOCUMENTS];
    if (activeCat !== "All") list = list.filter((d) => d.category === activeCat);
    if (freeOnly) list = list.filter((d) => d.free);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.desc.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }
    if (sortBy === "popular") list.sort((a, b) => b.downloads - a.downloads);
    if (sortBy === "newest") list.sort((a, b) => b.id - a.id);
    if (sortBy === "az") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [activeCat, search, freeOnly, sortBy]);

  return (
    <div className={`ld-page ${theme === "dark" ? "ld-dark" : "ld-light"}`}>
      {toast && <div className="ld-toast">{toast}</div>}

      {/* Header */}
      <div className="ld-header">
        <div className="ld-header-inner">
          <span className="ld-header-badge">
            {isKn ? "📑 ವಕೀಲರು ಪರಿಶೀಲಿಸಿದ ಕಾನೂನು ಕರಡುಗಳು" : "📑 Verified Drafts & Legal Templates"}
          </span>
          <h1 className="ld-title">
            {isKn ? "ಕಾನೂನು ದಾಖಲೆಗಳು & ಪತ್ರಗಳ ಮಾದರಿ" : "Legal Documents, Agreements & Court Drafts"}
          </h1>
          <p className="ld-subtitle">
            {isKn
              ? "ನ್ಯಾಯಾಲಯದ ಅರ್ಜಿಗಳು, ಬಾಡಿಗೆ ಒಪ್ಪಂದಗಳು, ನೋಟಿಸ್‌ಗಳು ಮತ್ತು ಉಯಿಲುಗಳ ಸಿದ್ಧ ಮಾದರಿಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ."
              : "Download ready-to-use Indian legal formats, contract templates, notices, and court petitions verified by legal experts."}
          </p>
          <div className="ld-header-stats">
            <span>📄 {DOCUMENTS.length}+ {isKn ? "ಮಾದರಿಗಳು" : "Templates"}</span>
            <span>⬇ 2.8 Lakh+ {isKn ? "ಡೌನ್‌ಲೋಡ್‌ಗಳು" : "Downloads"}</span>
            <span>✅ {isKn ? "ವಕೀಲರ ಪರಿಶೀಲನೆ" : "Advocate Verified"}</span>
            <span>🆓 {DOCUMENTS.filter((d) => d.free).length} {isKn ? "ಉಚಿತ ಮಾದರಿಗಳು" : "Free Templates"}</span>
          </div>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="ld-filter-bar">
        <div className="ld-search-wrap">
          <span>🔍</span>
          <input
            className="ld-search"
            placeholder={
              isKn
                ? "ಕಾನೂನು ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಿ (ಉದಾ: Rental Agreement, Bail, Sale Deed)..."
                : "Search legal documents (e.g. Rental Agreement, Bail Application, Sale Deed)..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <label className="ld-free-toggle">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={(e) => setFreeOnly(e.target.checked)}
          />
          <span>{isKn ? "ಉಚಿತ ಮಾದರಿಗಳು ಮಾತ್ರ" : "Free Only"}</span>
        </label>

        <select
          className="ld-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort documents"
        >
          <option value="popular">{isKn ? "ಅತಿ ಹೆಚ್ಚು ಡೌನ್‌ಲೋಡ್" : "Most Downloaded"}</option>
          <option value="newest">{isKn ? "ಹೊಸತು ಮೊದಲು" : "Newest First"}</option>
          <option value="az">{isKn ? "A–Z ಶೀರ್ಷಿಕೆ" : "A–Z Title"}</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="ld-cat-tabs">
        {LEGAL_DOC_CATEGORIES_EN.map((cat, idx) => {
          const label = isKn ? LEGAL_DOC_CATEGORIES_KN[idx] || cat : cat;
          return (
            <button
              key={cat}
              type="button"
              className={`ld-cat-tab ${activeCat === cat ? "active" : ""}`}
              onClick={() => setActiveCat(cat)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Document Grid */}
      <div className="ld-grid">
        {filtered.map((doc) => (
          <DocCard
            key={doc.id}
            doc={doc}
            onDownload={handleDownload}
            onPreview={setPreviewDoc}
            isKn={isKn}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="ld-empty">
          <div style={{ fontSize: 44 }}>📄</div>
          <h3>{isKn ? "ಯಾವುದೇ ದಾಖಲೆ ಕಂಡುಬಂದಿಲ್ಲ" : "No Legal Documents Found"}</h3>
          <p>
            {isKn
              ? "ದಯವಿಟ್ಟು ಬೇರೆ ಹುಡುಕಾಟ ಪದ ಅಥವಾ ವರ್ಗವನ್ನು ಪ್ರಯತ್ನಿಸಿ"
              : "Try searching with a different term or clearing filters."}
          </p>
        </div>
      )}

      {/* CTA Banner */}
      <div className="ld-cta-banner">
        <div className="ld-cta-text">
          <h3>
            {isKn
              ? "ಕಾನೂನು ಕರಡನ್ನು ವಕೀಲರಿಂದ ಪರಿಶೀಲಿಸಬೇಕೇ?"
              : "Need an advocate to draft or review your agreement?"}
          </h3>
          <p>
            {isKn
              ? "ನಮ್ಮ ಪರಿಶೀಲಿತ ವಕೀಲರು ಕರಡುಗಳನ್ನು ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ಸಿದ್ಧಪಡಿಸಿಕೊಡುತ್ತಾರೆ."
              : "Connect with verified Advocates to customize, review, and execute court documents."}
          </p>
        </div>
        <button
          type="button"
          className="ld-cta-btn"
          onClick={() => navigate("/talk-to-advocate")}
        >
          {isKn ? "ವಕೀಲರೊಂದಿಗೆ ಮಾತನಾಡಿ →" : "Consult an Advocate →"}
        </button>
      </div>

      {/* Preview modal */}
      {previewDoc && (
        <PreviewModal
          doc={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onDownload={handleDownload}
          isKn={isKn}
        />
      )}
    </div>
  );
}