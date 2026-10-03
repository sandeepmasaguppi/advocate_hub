// ============================================================
//  BareActs.js — Indian Bare Acts & Statutory Enactments Repository
//  Part of the 4 Legal Sections:
//    1. Ask a Question  2. Legal Documents  3. Bare Acts  4. Legal News
//  Supports White & Dark Themes with English & Kannada translations
//  Features:
//    • Complete BNS 2023, BNSS 2023, BSA 2023 Criminal Law Overhaul
//    • Interactive Old ⇄ New Criminal Law Section Converter
//    • Deep Section Explorer with Sub-sections, Punishments & Bail status
//    • Word (.doc) and Text (.txt) Download + Court Print
// ============================================================

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTheme } from "../data/themeStore";
import {
  BARE_ACT_CATEGORIES_EN,
  BARE_ACT_CATEGORIES_KN,
  CAT_COLORS,
  OLD_TO_NEW_CRIMINAL_MAPPING,
  BARE_ACTS_DATA
} from "../data/bareActsData";
import "./BareActs.css";

export const CATEGORIES_EN = BARE_ACT_CATEGORIES_EN;
export const CATEGORIES_KN = BARE_ACT_CATEGORIES_KN;
export const CATEGORIES = BARE_ACT_CATEGORIES_EN;
export const BARE_ACTS = BARE_ACTS_DATA;
export { CAT_COLORS, OLD_TO_NEW_CRIMINAL_MAPPING, BARE_ACTS_DATA };

/**
 * Downloads a structured Bare Act text document
 */
function downloadBareActText(act) {
  let content = `ADVOCATES HUB — OFFICIAL STATUTORY REPOSITORY\n`;
  content += `=========================================================\n`;
  content += `TITLE: ${act.title.toUpperCase()}\n`;
  content += `SHORT NAME / CITATION: ${act.shortName}\n`;
  content += `ACT NUMBER: ${act.actNumber || "Central Enactment"}\n`;
  content += `ENACTMENT / ENFORCEMENT: ${act.enactmentDate || act.year}\n`;
  content += `MINISTRY: ${act.ministry || "Ministry of Law and Justice, Government of India"}\n`;
  content += `CATEGORY: ${act.category}\n`;
  content += `TOTAL PROVISIONS: ${act.sectionsCount} Sections · ${act.chaptersCount || act.chapters?.length || 1} Chapters\n`;
  content += `=========================================================\n\n`;
  content += `LEGISLATIVE OVERVIEW & OBJECTS:\n${act.desc}\n\n`;

  if (act.chapters && act.chapters.length > 0) {
    content += `TABLE OF CHAPTERS & SCHEME OF THE ACT:\n`;
    act.chapters.forEach((ch, i) => {
      content += `  ${i + 1}. ${ch}\n`;
    });
    content += `\n=========================================================\n\n`;
  }

  content += `KEY SECTIONS & STATUTORY PROVISIONS:\n\n`;
  act.sections.forEach((sec) => {
    content += `--- Section ${sec.no}: ${sec.title} ---\n`;
    if (sec.classification) {
      content += `Classification: ${sec.classification.type || ""}\n`;
      if (sec.classification.cognizable && sec.classification.cognizable !== "N/A") {
        content += `Nature: ${sec.classification.cognizable} · Bail: ${sec.classification.bailable} · Triable by: ${sec.classification.triable}\n`;
      }
    }
    content += `\n${sec.content}\n`;
    if (sec.note) {
      content += `Advocate Note / Landmark Precedent: ${sec.note}\n`;
    }
    content += `\n\n`;
  });

  content += `=========================================================\n`;
  content += `Provided for judicial reference, legal education & advocacy by Advocates Hub (https://advocateshub.in)\n`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${act.shortName.replace(/[^a-zA-Z0-9_-]/g, "_")}_Bare_Act.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a professional Word (.doc) Bare Act document
 */
function downloadBareActWord(act) {
  let chaptersHtml = "";
  if (act.chapters && act.chapters.length > 0) {
    chaptersHtml = `
      <div class="chapters-box">
        <h3>Scheme of Chapters</h3>
        <ol>
          ${act.chapters.map((c) => `<li>${c}</li>`).join("")}
        </ol>
      </div>
    `;
  }

  const sectionsHtml = act.sections
    .map(
      (sec) => `
      <div class="sec-block">
        <h4>Section ${sec.no} — ${sec.title}</h4>
        ${
          sec.classification
            ? `<div class="sec-meta">
                <strong>Type:</strong> ${sec.classification.type || "General"} |
                <strong>Nature:</strong> ${sec.classification.cognizable || "Statutory"} |
                <strong>Bail:</strong> ${sec.classification.bailable || "N/A"} |
                <strong>Triable:</strong> ${sec.classification.triable || "Competent Court"}
              </div>`
            : ""
        }
        <div class="sec-body">${sec.content.replace(/\n/g, "<br/>")}</div>
        ${sec.note ? `<div class="sec-note"><strong>Advocate Practice Note:</strong> ${sec.note}</div>` : ""}
      </div>
    `
    )
    .join("");

  const html = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${act.title}</title>
<style>
  body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #0f172a; margin: 40px; }
  .header-box { border: 2px solid #1e3a8a; background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 24px; text-align: center; }
  .header-box h1 { margin: 0 0 6px 0; color: #1e3a8a; font-size: 18pt; text-transform: uppercase; }
  .header-box p { margin: 2px 0; color: #475569; font-size: 10pt; font-weight: bold; }
  .desc-box { background: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 18px; margin-bottom: 24px; font-size: 10.5pt; color: #334155; }
  .chapters-box { background: #fffbeb; border: 1px solid #fde68a; padding: 14px 18px; border-radius: 6px; margin-bottom: 24px; }
  .chapters-box h3 { margin: 0 0 10px 0; color: #b45309; font-size: 12pt; }
  .chapters-box ol { margin: 0; padding-left: 20px; font-size: 9.5pt; color: #78350f; }
  .sec-block { border-bottom: 1px solid #e2e8f0; padding-bottom: 18px; margin-bottom: 20px; }
  .sec-block h4 { color: #1e3a8a; font-size: 12.5pt; margin: 0 0 6px 0; }
  .sec-meta { background: #f1f5f9; padding: 6px 10px; border-radius: 4px; font-size: 9pt; color: #475569; margin-bottom: 10px; }
  .sec-body { font-size: 10.5pt; line-height: 1.65; color: #1e293b; }
  .sec-note { margin-top: 10px; background: #ecfdf5; border-left: 3px solid #10b981; padding: 8px 12px; font-size: 9.5pt; color: #065f46; }
  .footer-note { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 8.5pt; color: #64748b; text-align: center; }
</style>
</head>
<body>
<div class="header-box">
  <h1>ADVOCATES HUB — OFFICIAL STATUTORY COMPENDIUM</h1>
  <p>${act.title.toUpperCase()}</p>
  <p>${act.actNumber || "Central Legislation"} · ${act.enactmentDate || act.year}</p>
</div>

<div class="desc-box">
  <strong>Legislative Objects & Reasons:</strong><br/>
  ${act.desc}
</div>

${chaptersHtml}

<h3>Selected Core Sections & Enacted Provisions</h3>
${sectionsHtml}

<div class="footer-note">
  Compiled via Advocates Hub (https://advocateshub.in) • Official Indian Legal Repository
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${act.shortName.replace(/[^a-zA-Z0-9_-]/g, "_")}_Bare_Act.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Old ⇄ New Law Converter Component
 */
function LawConverter({ isKn }) {
  const [filterQuery, setFilterQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const mappingsList = Array.isArray(OLD_TO_NEW_CRIMINAL_MAPPING) ? OLD_TO_NEW_CRIMINAL_MAPPING : [];
  const matchedMappings = useMemo(() => {
    if (!filterQuery.trim()) return mappingsList.slice(0, 8);
    const q = filterQuery.toLowerCase().trim();
    return mappingsList.filter(
      (m) =>
        m.offence.toLowerCase().includes(q) ||
        m.oldSection.toLowerCase().includes(q) ||
        m.newSection.toLowerCase().includes(q) ||
        m.oldAct.toLowerCase().includes(q) ||
        m.newAct.toLowerCase().includes(q) ||
        m.changeSummary.toLowerCase().includes(q)
    );
  }, [filterQuery, mappingsList]);

  const handleCopyCitation = (item, idx) => {
    const citation = `${item.offence}: Old ${item.oldAct} Sec ${item.oldSection} ➔ New ${item.newAct} Sec ${item.newSection}. Punishment: ${item.punishment}. (${item.cognizable}, ${item.bailable})`;
    navigator.clipboard.writeText(citation);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="ba-converter-card">
      <div className="ba-conv-header">
        <div className="ba-conv-title-wrap">
          <span className="ba-conv-pill">⚡ 2024 Legal Revolution</span>
          <h3>
            {isKn
              ? "ಹೊಸ ಅಪರಾಧ ಕಾಯಿದೆಗಳ ಪರಿವರ್ತಕ (IPC / CrPC / IEA ➔ BNS / BNSS / BSA)"
              : "Old ⇄ New Criminal Law Section Converter (IPC/CrPC ➔ BNS/BNSS/BSA)"}
          </h3>
          <p>
            {isKn
              ? "ಹಳೆಯ ಸೆಕ್ಷನ್ ಸಂಖ್ಯೆ (ಉದಾ: 302, 420, 498A, 154, 438) ಅಥವಾ ಅಪರಾಧವನ್ನು ಹುಡುಕಿ ತಕ್ಷಣ ಹೊಸ ಸೆಕ್ಷನ್ ತಿಳಿಯಿರಿ."
              : "Search any old IPC/CrPC section or offence (e.g. 302, 420, 498A, 154, 438, Murder, Bail, FIR) to get the corresponding 2023 Sanhita provision instantly."}
          </p>
        </div>

        <div className="ba-conv-search-box">
          <span className="ba-conv-search-icon">🔍</span>
          <input
            type="text"
            placeholder={
              isKn
                ? "ಸೆಕ್ಷನ್ ಅಥವಾ ಅಪರಾಧ ಹುಡುಕಿ (ಉದಾ: 302, 420, 498A, 154)..."
                : "Type old section or offence (e.g. 302, 420, 498A, 154, 438, Murder)..."
            }
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
          {filterQuery && (
            <button
              type="button"
              className="ba-conv-clear"
              onClick={() => setFilterQuery("")}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Quick Quick-tags */}
      <div className="ba-quick-pills">
        <span className="ba-qp-label">{isKn ? "ತ್ವರಿತ ಶೋಧ:" : "Popular Searches:"}</span>
        {["302", "420", "498A", "376", "154", "438", "65B", "Mob Lynching", "Snatching"].map((tag) => (
          <button
            key={tag}
            type="button"
            className="ba-qp-btn"
            onClick={() => setFilterQuery(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Comparison Grid */}
      <div className="ba-conv-grid">
        {matchedMappings.map((item, idx) => (
          <div key={idx} className="ba-conv-item">
            <div className="ba-ci-top">
              <span className="ba-ci-offence">{item.offence}</span>
              <button
                type="button"
                className="ba-ci-copy"
                onClick={() => handleCopyCitation(item, idx)}
                title="Copy citation"
              >
                {copiedId === idx ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>

            <div className="ba-ci-comparison">
              <div className="ba-ci-side old">
                <span className="ba-ci-act-tag old">{item.oldAct}</span>
                <span className="ba-ci-sec">Section {item.oldSection}</span>
              </div>
              <div className="ba-ci-arrow">➔</div>
              <div className="ba-ci-side new">
                <span className="ba-ci-act-tag new">{item.newAct} 2023</span>
                <span className="ba-ci-sec">Section {item.newSection}</span>
              </div>
            </div>

            <p className="ba-ci-change">{item.changeSummary}</p>

            <div className="ba-ci-chips">
              <span className="ba-chip pun">⚖️ {item.punishment}</span>
              <span className={`ba-chip ${item.bailable.includes("Non") ? "non-bail" : "bail"}`}>
                {item.bailable}
              </span>
              <span className="ba-chip court">🏛️ {item.triableBy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Act Card Component
 */
function ActCard({ act, onRead, onDownloadText, onDownloadWord, isKn }) {
  return (
    <div className="ba-card">
      <div className="ba-card-top">
        <div className="ba-act-icon">{act.icon}</div>
        <div className="ba-act-badges">
          {act.isNew && (
            <span className="ba-badge new">{isKn ? "🆕 ೨೦೨೩ ಸಂಹಿತೆ" : "🆕 2023 Sanhita"}</span>
          )}
          {act.popular && (
            <span className="ba-badge popular">{isKn ? "🔥 ಜನಪ್ರಿಯ" : "🔥 Most Cited"}</span>
          )}
        </div>
      </div>

      <div className="ba-card-meta-strip">
        <span
          className="ba-short-name"
          style={{ color: CAT_COLORS[act.category] || "#6366f1" }}
        >
          {act.shortName}
        </span>
        <span className="ba-act-number">{act.actNumber || `Enacted ${act.year}`}</span>
      </div>

      <h3 className="ba-act-title">{act.title}</h3>
      <p className="ba-act-desc">{act.desc}</p>

      <div className="ba-act-meta">
        <span className="ba-act-year">📅 {act.year}</span>
        <span className="ba-act-sections">
          📋 {act.sectionsCount || act.sections?.length} {isKn ? "ಸೆಕ್ಷನ್‌ಗಳು" : "Sections"}
        </span>
        <span
          className="ba-act-cat"
          style={{
            background: (CAT_COLORS[act.category] || "#6366f1") + "18",
            color: CAT_COLORS[act.category] || "#6366f1",
          }}
        >
          {act.category}
        </span>
      </div>

      {act.sections && act.sections.length > 0 && (
        <div className="ba-card-sec-preview">
          <span className="ba-csp-label">⚡ {isKn ? "ಪ್ರಮುಖ ಸೆಕ್ಷನ್‌ಗಳು:" : "Key Provisions:"}</span>
          <div className="ba-csp-chips">
            {act.sections.slice(0, 3).map((s, i) => (
              <span key={i} className="ba-csp-chip">
                § {s.no}
              </span>
            ))}
            {act.sections.length > 3 && (
              <span className="ba-csp-more">+{act.sections.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      <div className="ba-card-actions">
        <button type="button" className="ba-btn-read" onClick={() => onRead(act)}>
          📖 {isKn ? "ಕಾಯಿದೆ ಓದಿ & ಅನ್ವೇಷಿಸಿ" : "Read & Explore"}
        </button>

        <div className="ba-btn-dl-group">
          <button
            type="button"
            className="ba-btn-download-word"
            onClick={() => onDownloadWord(act)}
            title="Download formatted Word document (.doc)"
          >
            📥 Word
          </button>
          <button
            type="button"
            className="ba-btn-download-txt"
            onClick={() => onDownloadText(act)}
            title="Download clean plain text (.txt)"
          >
            📄 Text
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Deep Statutory Reading Modal with Tabs, Section Search, Copy, and Print
 */
function ReadModal({ act, onClose, onDownloadText, onDownloadWord, isKn }) {
  const [activeTab, setActiveTab] = useState("sections"); // "sections" | "overview" | "comparison"
  const [selectedSecNo, setSelectedSecNo] = useState(
    act.sections && act.sections.length > 0 ? act.sections[0].no : "1"
  );
  const [secFilter, setSecFilter] = useState("");
  const [copiedSec, setCopiedSec] = useState(false);

  const availableSections = act.sections || [];

  const filteredSections = useMemo(() => {
    if (!secFilter.trim()) return availableSections;
    const q = secFilter.toLowerCase().trim();
    return availableSections.filter(
      (s) =>
        s.no.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q) ||
        (s.note && s.note.toLowerCase().includes(q))
    );
  }, [availableSections, secFilter]);

  const activeSectionObj =
    availableSections.find((s) => s.no === selectedSecNo) || availableSections[0];

  const handleCopySection = () => {
    if (!activeSectionObj) return;
    const textToCopy = `Section ${activeSectionObj.no} — ${activeSectionObj.title}\n(${act.title})\n\n${activeSectionObj.content}\n\nAdvocate Note: ${activeSectionObj.note || "Official Statutory Enactment"}\n(Source: Advocates Hub - https://advocateshub.in)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSec(true);
    setTimeout(() => setCopiedSec(false), 2000);
  };

  const handlePrintSection = () => {
    if (!activeSectionObj) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Section ${activeSectionObj.no} — ${act.shortName}</title>
          <style>
            body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 40px; color: #000; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 24px; }
            .header h2 { margin: 0 0 4px 0; text-transform: uppercase; }
            .sec-title { font-size: 15pt; font-weight: bold; margin-bottom: 12px; }
            .sec-meta { background: #eee; padding: 6px 10px; font-size: 10pt; margin-bottom: 16px; }
            .sec-body { white-space: pre-wrap; margin-bottom: 20px; font-size: 12pt; }
            .sec-note { border-left: 3px solid #000; padding-left: 12px; font-style: italic; font-size: 10.5pt; }
            .footer { margin-top: 40px; border-top: 1px solid #aaa; font-size: 9pt; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>ADVOCATES HUB — STATUTORY PROVISION</h2>
            <p>${act.title} · ${act.actNumber || "Central Act"}</p>
          </div>
          <div class="sec-title">Section ${activeSectionObj.no} — ${activeSectionObj.title}</div>
          ${
            activeSectionObj.classification
              ? `<div class="sec-meta">
                  Classification: ${activeSectionObj.classification.type || "General"} |
                  ${activeSectionObj.classification.cognizable ? `Nature: ${activeSectionObj.classification.cognizable} |` : ""}
                  ${activeSectionObj.classification.bailable ? `Bail: ${activeSectionObj.classification.bailable} |` : ""}
                  ${activeSectionObj.classification.triable ? `Triable By: ${activeSectionObj.classification.triable}` : ""}
                 </div>`
              : ""
          }
          <div class="sec-body">${activeSectionObj.content}</div>
          ${activeSectionObj.note ? `<div class="sec-note">Practice Note: ${activeSectionObj.note}</div>` : ""}
          <div class="footer">Certified Copy via Advocates Hub • Official Legal Platform of Karnataka & India</div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 350);
  };

  const isNewLaw = act.shortName === "BNS" || act.shortName === "BNSS" || act.shortName === "BSA";

  return (
    <div className="ba-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ba-modal ba-modal-lg">
        {/* Header */}
        <div
          className="ba-modal-header"
          style={{ borderBottom: `3px solid ${CAT_COLORS[act.category] || "#6366f1"}` }}
        >
          <div className="ba-mh-left">
            <span
              className="ba-modal-short"
              style={{ color: CAT_COLORS[act.category] || "#6366f1" }}
            >
              {act.shortName}
            </span>
            <h3 className="ba-modal-title">{act.title}</h3>
            <div className="ba-modal-meta">
              <span>🏛️ {act.actNumber || `Act of ${act.year}`}</span>
              <span>📅 {act.enactmentDate || act.year}</span>
              <span>📋 {act.sectionsCount || act.sections?.length} Sections</span>
              <span>🏷️ {act.category}</span>
            </div>
          </div>
          <button type="button" className="ba-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="ba-modal-nav-tabs">
          <button
            type="button"
            className={`ba-mnt-btn ${activeTab === "sections" ? "active" : ""}`}
            onClick={() => setActiveTab("sections")}
          >
            📖 {isKn ? "ಸೆಕ್ಷನ್‌ಗಳ ಪಟ್ಟಿ & ಪೂರ್ಣ ಪಠ್ಯ" : "Section Explorer & Text"}
          </button>
          <button
            type="button"
            className={`ba-mnt-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📑 {isKn ? "ಅಧ್ಯಾಯಗಳು & ಕಾಯಿದೆಯ ರೂಪರೇಖೆ" : "Chapters & Act Profile"}
          </button>
          {isNewLaw && (
            <button
              type="button"
              className={`ba-mnt-btn ${activeTab === "comparison" ? "active" : ""}`}
              onClick={() => setActiveTab("comparison")}
            >
              🔄 {isKn ? "ಹೊಸ ⇄ ಹಳೆಯ ಕಾಯಿದೆ ಹೋಲಿಕೆ" : "New ⇄ Old Law Mapping"}
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="ba-modal-body">
          {/* TAB 1: SECTION EXPLORER */}
          {activeTab === "sections" && (
            <div className="ba-sec-explorer-container">
              {/* Sidebar with Section Picker */}
              <div className="ba-modal-sidebar">
                <div className="ba-sidebar-search">
                  <input
                    type="text"
                    placeholder={isKn ? "ಸೆಕ್ಷನ್ ಹುಡುಕಿ..." : "Filter sections..."}
                    value={secFilter}
                    onChange={(e) => setSecFilter(e.target.value)}
                  />
                  {secFilter && (
                    <button type="button" onClick={() => setSecFilter("")}>
                      ✕
                    </button>
                  )}
                </div>

                <div className="ba-sec-list-scroll">
                  {filteredSections.map((s) => (
                    <button
                      key={s.no}
                      type="button"
                      className={`ba-section-item ${selectedSecNo === s.no ? "active" : ""}`}
                      onClick={() => setSelectedSecNo(s.no)}
                    >
                      <span className="ba-section-no">§ {s.no}</span>
                      <span className="ba-section-name">{s.title}</span>
                    </button>
                  ))}
                  {filteredSections.length === 0 && (
                    <div className="ba-sec-none-found">No sections match filter.</div>
                  )}
                </div>

                <div className="ba-more-sections">
                  Showing {filteredSections.length} of {act.sectionsCount || availableSections.length} statutory provisions
                </div>
              </div>

              {/* Main Reading View */}
              <div className="ba-modal-content">
                {activeSectionObj ? (
                  <div className="ba-sec-detail-card">
                    <div className="ba-sec-card-header">
                      <div>
                        <span className="ba-sec-badge">Section {activeSectionObj.no}</span>
                        <h4 className="ba-content-title">{activeSectionObj.title}</h4>
                      </div>
                      <div className="ba-sec-tools">
                        <button
                          type="button"
                          className="ba-btn-tool"
                          onClick={handleCopySection}
                        >
                          {copiedSec ? "✓ Copied!" : "📋 Copy Section"}
                        </button>
                        <button
                          type="button"
                          className="ba-btn-tool"
                          onClick={handlePrintSection}
                        >
                          🖨️ Court Print
                        </button>
                      </div>
                    </div>

                    {/* Classification Bar */}
                    {activeSectionObj.classification && (
                      <div className="ba-sec-class-bar">
                        <span className="ba-sclass-item type">
                          🏷️ {activeSectionObj.classification.type || "Statutory Provision"}
                        </span>
                        {activeSectionObj.classification.cognizable && (
                          <span
                            className={`ba-sclass-item ${
                              activeSectionObj.classification.cognizable.includes("Non")
                                ? "non-cog"
                                : "cog"
                            }`}
                          >
                            🚨 {activeSectionObj.classification.cognizable}
                          </span>
                        )}
                        {activeSectionObj.classification.bailable && (
                          <span
                            className={`ba-sclass-item ${
                              activeSectionObj.classification.bailable.includes("Non")
                                ? "non-bail"
                                : "bail"
                            }`}
                          >
                            🛡️ {activeSectionObj.classification.bailable}
                          </span>
                        )}
                        {activeSectionObj.classification.triable && (
                          <span className="ba-sclass-item court">
                            🏛️ {activeSectionObj.classification.triable}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Official Text */}
                    <div className="ba-content-text">
                      {activeSectionObj.content.split("\n").map((line, idx) => (
                        <p key={idx} style={{ marginBottom: line.trim() === "" ? 10 : 6 }}>
                          {line}
                        </p>
                      ))}
                    </div>

                    {/* Practice Note / Supreme Court Precedent */}
                    {activeSectionObj.note && (
                      <div className="ba-content-note">
                        <div className="ba-cn-title">⚖️ Advocate Practice Note & Precedent:</div>
                        <p>{activeSectionObj.note}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="ba-empty-sec-notice">Select a section from the left sidebar to view legal text.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CHAPTERS & PROFILE */}
          {activeTab === "overview" && (
            <div className="ba-overview-tab-content">
              <div className="ba-ot-meta-grid">
                <div className="ba-ot-box">
                  <span className="ba-ot-lbl">Official Title:</span>
                  <strong>{act.title}</strong>
                </div>
                <div className="ba-ot-box">
                  <span className="ba-ot-lbl">Statutory Citation:</span>
                  <strong>{act.actNumber || "Central Legislation"}</strong>
                </div>
                <div className="ba-ot-box">
                  <span className="ba-ot-lbl">Enactment / Effective Date:</span>
                  <strong>{act.enactmentDate || act.year}</strong>
                </div>
                <div className="ba-ot-box">
                  <span className="ba-ot-lbl">Administering Ministry:</span>
                  <strong>{act.ministry || "Ministry of Law and Justice, New Delhi"}</strong>
                </div>
              </div>

              <div className="ba-ot-desc-card">
                <h4>Statement of Objects and Reasons</h4>
                <p>{act.desc}</p>
              </div>

              {act.chapters && act.chapters.length > 0 && (
                <div className="ba-ot-chapters-card">
                  <h4>Arrangement of Chapters ({act.chapters.length} Chapters)</h4>
                  <div className="ba-chapters-list">
                    {act.chapters.map((ch, idx) => (
                      <div key={idx} className="ba-ch-row">
                        <span className="ba-ch-num">{idx + 1}</span>
                        <span className="ba-ch-name">{ch}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OLD VS NEW MAPPING */}
          {activeTab === "comparison" && isNewLaw && (
            <div className="ba-comp-tab-content">
              <h4>
                Corresponding Provisions: {act.shortName} (2023) vs Old Codes (IPC / CrPC / IEA)
              </h4>
              <p className="ba-comp-intro">
                The Indian Parliament replaced IPC (1860), CrPC (1973), and Indian Evidence Act (1872) with Bharatiya Nyaya Sanhita, Bharatiya Nagarik Suraksha Sanhita, and Bharatiya Sakshya Adhiniyam effective July 1, 2024.
              </p>

              <div className="ba-comp-table-wrap">
                <table className="ba-comp-table">
                  <thead>
                    <tr>
                      <th>Subject / Offence</th>
                      <th>Old Code Section</th>
                      <th>New {act.shortName} Section</th>
                      <th>Statutory Changes & Penalties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(OLD_TO_NEW_CRIMINAL_MAPPING) ? OLD_TO_NEW_CRIMINAL_MAPPING : [])
                      .filter((m) => m.newAct === act.shortName)
                      .map((m, i) => (
                      <tr key={i}>
                        <td>
                          <strong>{m.offence}</strong>
                        </td>
                        <td>
                          <span className="badge-old">
                            {m.oldAct} § {m.oldSection}
                          </span>
                        </td>
                        <td>
                          <span className="badge-new">
                            {m.newAct} § {m.newSection}
                          </span>
                        </td>
                        <td>
                          <div>{m.changeSummary}</div>
                          <small style={{ color: "#16a34a", fontWeight: "bold" }}>
                            {m.punishment}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="ba-modal-footer">
          <div className="ba-mf-left">
            <span>Official Legal Repository of Advocates Hub · All-India & Karnataka Compliant</span>
          </div>
          <div className="ba-mf-actions">
            <button
              type="button"
              className="ba-btn-download-word"
              onClick={() => onDownloadWord(act)}
            >
              📥 Download Word (.doc)
            </button>
            <button
              type="button"
              className="ba-btn-download-txt"
              onClick={() => onDownloadText(act)}
            >
              📄 Download Text (.txt)
            </button>
            <button type="button" className="ba-btn-close-modal" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BareActs() {
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
  const [showNew, setShowNew] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [readModal, setReadModal] = useState(null);
  const [showConverter, setShowConverter] = useState(true);

  const allActs = Array.isArray(BARE_ACTS_DATA) ? BARE_ACTS_DATA : [];

  const filtered = useMemo(() => {
    let list = [...allActs];

    if (activeCat !== "All") {
      if (activeCat === "New Acts (2023)") list = list.filter((a) => a.isNew);
      else list = list.filter((a) => a.category === activeCat);
    }
    if (showNew) list = list.filter((a) => a.isNew);
    if (showPop) list = list.filter((a) => a.popular);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => {
        const matchesBasic =
          a.title.toLowerCase().includes(q) ||
          a.shortName.toLowerCase().includes(q) ||
          a.desc.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q);

        const matchesSection = a.sections?.some(
          (s) =>
            s.no.toLowerCase().includes(q) ||
            s.title.toLowerCase().includes(q) ||
            s.content.toLowerCase().includes(q) ||
            (s.note && s.note.toLowerCase().includes(q))
        );

        return matchesBasic || matchesSection;
      });
    }

    if (sortBy === "popular") list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    if (sortBy === "year_new") list.sort((a, b) => b.year - a.year);
    if (sortBy === "year_old") list.sort((a, b) => a.year - b.year);
    if (sortBy === "az") list.sort((a, b) => a.shortName.localeCompare(b.shortName));
    if (sortBy === "sections") list.sort((a, b) => (b.sectionsCount || 0) - (a.sectionsCount || 0));

    return list;
  }, [allActs, activeCat, search, showNew, showPop, sortBy]);

  return (
    <div className={`ba-page ${theme === "dark" ? "ba-dark" : "ba-light"}`}>
      {/* Header */}
      <div className="ba-header">
        <div className="ba-header-inner">
          <span className="ba-header-badge">
            {isKn ? "📜 ಭಾರತೀಯ ಅಧಿಕೃತ ಕಾಯ್ದೆಗಳು & ಸಂಹಿತೆಗಳು" : "📜 Official Indian Statutory Repository"}
          </span>
          <h1 className="ba-title">
            {isKn ? "ಭಾರತೀಯ ಕಾಯಿದೆಗಳು ಮತ್ತು ಸಂಹಿತೆಗಳು (Bare Acts)" : "Indian Bare Acts & Central Statutes"}
          </h1>
          <p className="ba-subtitle">
            {isKn
              ? "ಭಾರತೀಯ ನ್ಯಾಯ ಸಂಹಿತೆ (BNS), ನಾಗರಿಕ ಸುರಕ್ಷಾ ಸಂಹಿತೆ (BNSS), ಸಾಕ್ಷ್ಯ ಅಧಿನಿಯಮ (BSA) ಮತ್ತು ಎಲ್ಲಾ ಪ್ರಮುಖ ಕ್ರಿಮಿನಲ್, ಸಿವಿಲ್, ಕೌಟುಂಬಿಕ ಮತ್ತು ವಾಣಿಜ್ಯ ಕಾಯಿದೆಗಳನ್ನು ಓದಿ ಮತ್ತು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ."
              : "Access official enacted Indian legislation including complete text for the 2023 Criminal Sanhitas (BNS, BNSS, BSA), Constitution of India, CPC, HMA, RERA, NI Act, and Corporate codes."}
          </p>
          <div className="ba-header-stats">
            <span>📚 {allActs.length}+ {isKn ? "ಕಾಯಿದೆಗಳು" : "Enacted Acts"}</span>
            <span>🆕 {allActs.filter((a) => a.isNew).length} {isKn ? "ಹೊಸ ಕಾಯಿದೆಗಳು (೨೦೨೩)" : "New Criminal Laws (2023)"}</span>
            <span>🔥 {allActs.filter((a) => a.popular).length} {isKn ? "ಜನಪ್ರಿಯ ಕಾಯಿದೆಗಳು" : "Most Cited Codes"}</span>
            <span style={{ background: "rgba(16, 185, 129, 0.25)", color: "#a7f3d0" }}>
              ⬇ 100% Free Word (.doc) & Text (.txt) Downloads
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Old ⇄ New Law Converter */}
      <div className="ba-converter-toggle-bar">
        <button
          type="button"
          className="ba-btn-toggle-conv"
          onClick={() => setShowConverter(!showConverter)}
        >
          <span>{showConverter ? "▼" : "▶"}</span>
          <span>
            {isKn
              ? "⚡ ಹಳೆಯ ⇄ ಹೊಸ ಅಪರಾಧ ಕಾಯಿದೆಗಳ ಪರಿವರ್ತಕ (BNS / BNSS / BSA Converter)"
              : "⚡ Old ⇄ New Criminal Law Converter (IPC / CrPC / IEA ➔ BNS / BNSS / BSA)"}
          </span>
          <span className="ba-badge-active">{showConverter ? "Active" : "Open"}</span>
        </button>
      </div>

      {showConverter && <LawConverter isKn={isKn} />}

      {/* Search + filter bar */}
      <div className="ba-filter-bar">
        <div className="ba-search-wrap">
          <span>🔍</span>
          <input
            className="ba-search"
            placeholder={
              isKn
                ? "ಕಾಯ್ದೆ, ಸೆಕ್ಷನ್ (ಉದಾ: Section 138, Sec 302, Sec 420) ಅಥವಾ ಕೀವರ್ಡ್ ಹುಡುಕಿ..."
                : "Search acts, sections (e.g. Section 138, 302, 420, 498A, Article 21, Bail)..."
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

        <div className="ba-filter-toggles">
          <label className="ba-toggle">
            <input
              type="checkbox"
              checked={showNew}
              onChange={(e) => setShowNew(e.target.checked)}
            />
            <span>{isKn ? "🆕 ೨೦೨೩ ಹೊಸ ಕಾಯಿದೆಗಳು" : "🆕 2023 New Sanhitas"}</span>
          </label>
          <label className="ba-toggle">
            <input
              type="checkbox"
              checked={showPop}
              onChange={(e) => setShowPop(e.target.checked)}
            />
            <span>{isKn ? "🔥 ಜನಪ್ರಿಯ ಕಾಯಿದೆಗಳು" : "🔥 Most Cited"}</span>
          </label>
        </div>

        <select
          className="ba-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort Bare Acts"
        >
          <option value="popular">{isKn ? "ಜನಪ್ರಿಯ ಮೊದಲು" : "Most Cited First"}</option>
          <option value="year_new">{isKn ? "ಹೊಸ ವರ್ಷ ಮೊದಲು" : "Newest Year First"}</option>
          <option value="year_old">{isKn ? "ಹಳೆಯ ವರ್ಷ ಮೊದಲು" : "Oldest First"}</option>
          <option value="az">{isKn ? "ವರ್ಣಮಾಲೆ A–Z" : "A–Z Short Name"}</option>
          <option value="sections">{isKn ? "ಹೆಚ್ಚು ಸೆಕ್ಷನ್‌ಗಳು" : "Most Sections"}</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="ba-cat-tabs">
        {BARE_ACT_CATEGORIES_EN.map((cat, idx) => {
          const label = isKn ? BARE_ACT_CATEGORIES_KN[idx] || cat : cat;
          const isActive = activeCat === cat;
          return (
            <button
              key={cat}
              type="button"
              className={`ba-cat-tab ${isActive ? "active" : ""}`}
              onClick={() => setActiveCat(cat)}
              style={
                isActive && cat !== "All"
                  ? {
                      borderColor: CAT_COLORS[cat] || "#2563eb",
                      color: CAT_COLORS[cat] || "#2563eb",
                      background: (CAT_COLORS[cat] || "#2563eb") + "18",
                    }
                  : {}
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Main Body Grid */}
      <div className="ba-body">
        <div className="ba-results-bar">
          {isKn ? (
            <>
              ಒಟ್ಟು <strong>{filtered.length}</strong> ಕಾಯ್ದೆಗಳು ಲಭ್ಯವಿವೆ
            </>
          ) : (
            <>
              Showing <strong>{filtered.length}</strong> statutory enactment
              {filtered.length !== 1 ? "s" : ""}
            </>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="ba-empty">
            <div style={{ fontSize: 48 }}>📚</div>
            <h3>{isKn ? "ಯಾವುದೇ ಕಾಯ್ದೆ ಕಂಡುಬಂದಿಲ್ಲ" : "No Bare Acts Found"}</h3>
            <p>
              {isKn
                ? "ದಯವಿಟ್ಟು ಬೇರೆ ಕೀವರ್ಡ್ ಅಥವಾ ವರ್ಗವನ್ನು ಪ್ರಯತ್ನಿಸಿ"
                : "Try searching with a different section number or selecting 'All' category."}
            </p>
          </div>
        ) : (
          <div className="ba-grid">
            {filtered.map((act) => (
              <ActCard
                key={act.id}
                act={act}
                onRead={setReadModal}
                onDownloadText={downloadBareActText}
                onDownloadWord={downloadBareActWord}
                isKn={isKn}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="ba-cta-banner">
        <div className="ba-cta-text">
          <h3>
            {isKn
              ? "ನ್ಯಾಯಾಲಯದ ವ್ಯಾಜ್ಯಗಳಿಗೆ ವಕೀಲರ ನೆರವು ಬೇಕೇ?"
              : "Need legal representation or expert opinion on statutory provisions?"}
          </h3>
          <p>
            {isKn
              ? "ಹೊಸ ಅಪರಾಧ ಕಾಯಿದೆಗಳು ಮತ್ತು ಸಿವಿಲ್ ವ್ಯಾಜ್ಯಗಳಲ್ಲಿ ಪರಿಣಿತ ವಕೀಲರೊಂದಿಗೆ ನೇರವಾಗಿ ಸಮಾಲೋಚಿಸಿ."
              : "Connect directly with verified High Court & District Court advocates for case assessment and legal defense."}
          </p>
        </div>
        <button
          type="button"
          className="ba-cta-btn"
          onClick={() => navigate("/talk-to-advocate")}
        >
          {isKn ? "ವಕೀಲರೊಂದಿಗೆ ಮಾತನಾಡಿ →" : "Consult an Advocate →"}
        </button>
      </div>

      {/* Read Modal */}
      {readModal && (
        <ReadModal
          act={readModal}
          onClose={() => setReadModal(null)}
          onDownloadText={downloadBareActText}
          onDownloadWord={downloadBareActWord}
          isKn={isKn}
        />
      )}
    </div>
  );
}