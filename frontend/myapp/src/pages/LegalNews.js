// ============================================================
//  LegalNews.js — Advocates Hub Legal News & Supreme Court Updates
//  Part of the 4 Legal Sections:
//    1. Ask a Question  2. Legal Documents  3. Bare Acts  4. Legal News
//  Supports White & Dark Themes with English & Kannada translations
//  Features:
//    • LiveLaw & Bar and Bench caliber judicial reporting
//    • 2024–2026 Supreme Court Constitution Bench & High Court verdicts
//    • Instant search by Case Name, Citation, Judge, Statute (e.g. BNSS 479)
//    • Breaking News Live Ticker + Hero Featured Ruling
//    • Detailed Legal Dossier Modal with Ratio Decidendi & Advocates Impact
//    • Bookmark / Save for Later & Judicial Print layout
// ============================================================

import React, { useState, useMemo, useEffect } from "react";
import { getTheme } from "../data/themeStore";
import {
  NEWS_CATEGORIES_EN,
  NEWS_CATEGORIES_KN,
  LEGAL_NEWS_DATA
} from "../data/legalNewsData";
import "./LegalNews.css";

export { NEWS_CATEGORIES_EN, NEWS_CATEGORIES_KN, LEGAL_NEWS_DATA };

const CATEGORY_COLORS = {
  "Supreme Court": "#dc2626",
  "High Courts": "#2563eb",
  "Criminal Law": "#b91c1c",
  "Constitutional": "#7c3aed",
  "Commercial & Corporate": "#0d9488",
  "Family & Civil": "#16a34a"
};

export default function LegalNews() {
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

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quickFilter, setQuickFilter] = useState("all"); // "all" | "breaking" | "landmark" | "trending" | "saved"
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [shareToast, setShareToast] = useState(false);

  // Bookmarking persisted in localStorage
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("advocates_hub_news_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      try {
        localStorage.setItem("advocates_hub_news_bookmarks", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Safe data array
  const rawArticles = useMemo(() => (Array.isArray(LEGAL_NEWS_DATA) ? LEGAL_NEWS_DATA : []), []);

  // Filter and search logic
  const filteredNews = useMemo(() => {
    return rawArticles.filter((item) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      // Quick tab filter
      let matchesQuick = true;
      if (quickFilter === "breaking") matchesQuick = Boolean(item.isBreaking);
      else if (quickFilter === "landmark") matchesQuick = Boolean(item.isLandmark);
      else if (quickFilter === "trending") matchesQuick = Boolean(item.isTrending);
      else if (quickFilter === "saved") matchesQuick = bookmarks.includes(item.id);

      // Search query
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory && matchesQuick;

      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        (item.titleKn && item.titleKn.toLowerCase().includes(q)) ||
        item.summary.toLowerCase().includes(q) ||
        (item.summaryKn && item.summaryKn.toLowerCase().includes(q)) ||
        (item.court && item.court.toLowerCase().includes(q)) ||
        (item.citation && item.citation.toLowerCase().includes(q)) ||
        (item.bench && item.bench.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q) ||
        (item.statutes && item.statutes.some((s) => s.toLowerCase().includes(q)));

      return matchesCategory && matchesQuick && matchesSearch;
    });
  }, [rawArticles, selectedCategory, quickFilter, searchQuery, bookmarks]);

  // Featured article (first landmark or breaking)
  const featuredArticle = useMemo(() => {
    return rawArticles.find((item) => item.isLandmark) || rawArticles[0];
  }, [rawArticles]);

  // Breaking ticker articles
  const breakingArticles = useMemo(() => {
    return rawArticles.filter((item) => item.isBreaking || item.isTrending);
  }, [rawArticles]);

  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    if (breakingArticles.length <= 1) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % breakingArticles.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [breakingArticles.length]);

  const currentTickerItem = breakingArticles[tickerIndex] || rawArticles[0];

  const handleCopyCitation = (article, e) => {
    if (e) e.stopPropagation();
    const citation = `${article.title} — [${article.court}] — Citation: ${article.citation || "Advocates Hub"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(citation);
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2200);
    }
  };

  const handleShare = (article) => {
    const shareText = `*${article.title}*\n${article.summary}\n\n🏛️ Court: ${article.court}\n📖 Citation: ${article.citation}\nRead full legal brief on Advocates Hub: ${window.location.origin}/legal-advice/news`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2400);
      });
    }
  };

  const handlePrintArticle = (article) => {
    if (!article) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>${article.title}</title>
          <style>
            body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 40px; color: #000; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; }
            .header h1 { font-size: 16pt; margin: 0 0 6px 0; text-transform: uppercase; }
            .meta { font-size: 10pt; color: #444; margin-bottom: 16px; border-bottom: 1px solid #ccc; padding-bottom: 8px; }
            .ratio-box { background: #f4f4f4; border-left: 4px solid #000; padding: 12px 16px; margin-bottom: 20px; font-style: italic; }
            .body { white-space: pre-wrap; font-size: 11.5pt; margin-bottom: 24px; }
            .takeaways { background: #fafafa; border: 1px solid #ddd; padding: 12px 18px; border-radius: 4px; margin-bottom: 24px; }
            .takeaways h3 { margin-top: 0; font-size: 11.5pt; }
            .takeaways ul { margin: 0; padding-left: 20px; font-size: 10pt; }
            .footer { margin-top: 40px; border-top: 1px solid #aaa; font-size: 9pt; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ADVOCATES HUB — JUDICIAL BRIEF & LEGAL REPORT</h1>
            <p>${article.court} · ${article.date}</p>
          </div>
          <h2>${article.title}</h2>
          <div class="meta">
            <strong>Bench:</strong> ${article.bench || "Hon'ble Court"} |
            <strong>Citation:</strong> ${article.citation || "Unreported"} |
            <strong>Statutes:</strong> ${article.statutes ? article.statutes.join(", ") : "N/A"}
          </div>
          <div class="ratio-box">
            <strong>Ratio Decidendi / Summary:</strong><br/>
            ${article.summary}
          </div>
          <div class="body">${article.content}</div>
          ${
            article.keyTakeaways && article.keyTakeaways.length > 0
              ? `<div class="takeaways">
                  <h3>Key Takeaways & Practical Impact for Advocates:</h3>
                  <ul>
                    ${article.keyTakeaways.map((t) => `<li>${t}</li>`).join("")}
                  </ul>
                </div>`
              : ""
          }
          <div class="footer">Certified Legal Intelligence • Advocates Hub (https://advocateshub.in)</div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 350);
  };

  return (
    <div className={`ln-page ${theme === "dark" ? "ln-dark" : "ln-light"}`}>
      {/* ── 1. Hero Header ── */}
      <header className="ln-header">
        <div className="ln-header-content">
          <span className="ln-badge-top">
            {isKn ? "📰 ಅಧಿಕೃತ ಭಾರತೀಯ ನ್ಯಾಯಾಂಗ ಮತ್ತು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ವರದಿ" : "📰 Official Indian Judicial & Supreme Court Dispatch"}
          </span>
          <h1 className="ln-title">
            {isKn ? "ಭಾರತೀಯ ಕಾನೂನು ಸುದ್ದಿಗಳು & ತೀರ್ಪುಗಳು" : "Indian Legal News & Court Judgments"}
          </h1>
          <p className="ln-subtitle">
            {isKn
              ? "ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಸಂವಿಧಾನ ಪೀಠದ ತೀರ್ಪುಗಳು, ಹೈಕೋರ್ಟ್ ಆದೇಶಗಳು ಮತ್ತು ಹೊಸ ಅಪರಾಧ ಕಾಯಿದೆಗಳ (BNS, BNSS, BSA) ನಿಖರ ಕಾನೂನು ವಿಶ್ಲೇಷಣೆ."
              : "Live judicial reporting, constitutional analyses, and landmark rulings directly from the Supreme Court of India, Karnataka High Court, and other appellate courts."}
          </p>

          <div className="ln-header-stats">
            <span>⚖️ {rawArticles.length}+ {isKn ? "ವರದಿಗಳು" : "Judicial Reports"}</span>
            <span>🏛️ {rawArticles.filter((a) => a.isLandmark).length} {isKn ? "ಸಂವಿಧಾನ ಪೀಠದ ತೀರ್ಪುಗಳು" : "Landmark Precedents"}</span>
            <span>⚡ {rawArticles.filter((a) => a.isBreaking).length} {isKn ? "ತಾಜಾ ಪ್ರಕಟಣೆಗಳು" : "Breaking Updates"}</span>
            <span>⭐ {bookmarks.length} {isKn ? "ಉಳಿಸಿದ ಲೇಖನಗಳು" : "Saved Briefs"}</span>
          </div>
        </div>
      </header>

      {/* ── 2. Breaking News Live Ticker ── */}
      {currentTickerItem && (
        <aside className="ln-ticker-container" aria-label="Breaking legal alert">
          <div className="ln-ticker-left">
            <span className="ln-pulse-dot" />
            <span className="ln-ticker-label">
              ⚡ {isKn ? "ತಾಜಾ ಕಾನೂನು ಸುದ್ದಿ" : "BREAKING DISPATCH"}
            </span>
          </div>

          <div
            className="ln-ticker-content"
            onClick={() => setActiveArticle(currentTickerItem)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") setActiveArticle(currentTickerItem);
            }}
          >
            <span className="ln-ticker-court">[{currentTickerItem.court}]</span>
            <span className="ln-ticker-text">
              {isKn && currentTickerItem.titleKn ? currentTickerItem.titleKn : currentTickerItem.title}
            </span>
            <span className="ln-ticker-read">· {currentTickerItem.readTime}</span>
          </div>

          <div className="ln-ticker-nav">
            <button
              type="button"
              className="ln-tnav-btn"
              onClick={() =>
                setTickerIndex((prev) => (prev - 1 + breakingArticles.length) % breakingArticles.length)
              }
              aria-label="Previous headline"
            >
              ◀
            </button>
            <button
              type="button"
              className="ln-tnav-btn"
              onClick={() =>
                setTickerIndex((prev) => (prev + 1) % breakingArticles.length)
              }
              aria-label="Next headline"
            >
              ▶
            </button>
          </div>
        </aside>
      )}

      {/* ── Main Container ── */}
      <main className="ln-container">
        {/* ── 3. Featured Landmark Hero Story ── */}
        {featuredArticle && selectedCategory === "All" && quickFilter === "all" && !searchQuery && (
          <section className="ln-featured-card">
            <div className="ln-fc-badge-strip">
              <span className="ln-badge-featured">
                🏛️ {isKn ? "ಪ್ರಮುಖ ಸಂವಿಧಾನ ಪೀಠದ ತೀರ್ಪು" : "Featured Constitutional Ruling"}
              </span>
              <span className="ln-fc-court">{featuredArticle.court}</span>
              <span className="ln-fc-citation">§ {featuredArticle.citation}</span>
            </div>

            <h2
              className="ln-fc-title"
              onClick={() => setActiveArticle(featuredArticle)}
            >
              {isKn && featuredArticle.titleKn ? featuredArticle.titleKn : featuredArticle.title}
            </h2>

            <p className="ln-fc-summary">
              {isKn && featuredArticle.summaryKn ? featuredArticle.summaryKn : featuredArticle.summary}
            </p>

            <div className="ln-fc-meta">
              <span className="ln-fc-bench">👨‍⚖️ <strong>Coram:</strong> {featuredArticle.bench}</span>
              <span className="ln-fc-date">📅 {featuredArticle.date}</span>
              <span className="ln-fc-time">⏳ {featuredArticle.readTime}</span>
            </div>

            {featuredArticle.statutes && (
              <div className="ln-statute-chips">
                <span className="ln-sc-label">{isKn ? "ಕಾನೂನು ವಿಭಾಗಗಳು:" : "Provisions Invoked:"}</span>
                {featuredArticle.statutes.map((st, i) => (
                  <span key={i} className="ln-statute-chip">
                    {st}
                  </span>
                ))}
              </div>
            )}

            <div className="ln-fc-actions">
              <button
                type="button"
                className="ln-btn-read-featured"
                onClick={() => setActiveArticle(featuredArticle)}
              >
                📖 {isKn ? "ಸಂಪೂರ್ಣ ಕಾನೂನು ವಿಶ್ಲೇಷಣೆ ಓದಿ →" : "Read In-Depth Legal Analysis →"}
              </button>
              <button
                type="button"
                className="ln-btn-copy-citation"
                onClick={(e) => handleCopyCitation(featuredArticle, e)}
              >
                {copiedId === featuredArticle.id ? "✓ Citation Copied" : "📋 Copy Citation"}
              </button>
              <button
                type="button"
                className={`ln-btn-bookmark ${bookmarks.includes(featuredArticle.id) ? "active" : ""}`}
                onClick={(e) => toggleBookmark(featuredArticle.id, e)}
                title="Save for reference"
              >
                {bookmarks.includes(featuredArticle.id) ? "★ Saved" : "☆ Save"}
              </button>
            </div>
          </section>
        )}

        {/* ── 4. Smart Search & Multilevel Filter Bar ── */}
        <section className="ln-controls-bar">
          {/* Search Box */}
          <div className="ln-search-wrapper">
            <span className="ln-search-icon">🔍</span>
            <input
              type="text"
              className="ln-search-input"
              placeholder={
                isKn
                  ? "ಕೇಸ್ ಹೆಸರು, ಜಡ್ಜ್ ಹೆಸರು, ಸೆಕ್ಷನ್ (ಉದಾ: BNSS 479, Sec 138, Art 21) ಅಥವಾ ಕೀವರ್ಡ್ ಹುಡುಕಿ..."
                  : "Search judgements, judges (e.g. Hima Kohli, Chandrachud), citations, or statutes (BNSS 479, Sec 138, Art 21)..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="ln-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Sub-tabs */}
          <div className="ln-quick-filter-row">
            <span className="ln-qf-label">{isKn ? "ವಿಂಗಡಣೆ:" : "Filter:"}</span>
            <button
              type="button"
              className={`ln-qf-btn ${quickFilter === "all" ? "active" : ""}`}
              onClick={() => setQuickFilter("all")}
            >
              {isKn ? "ಎಲ್ಲಾ ಸುದ್ದಿಗಳು" : "All Stories"} ({rawArticles.length})
            </button>
            <button
              type="button"
              className={`ln-qf-btn ${quickFilter === "breaking" ? "active" : ""}`}
              onClick={() => setQuickFilter("breaking")}
            >
              ⚡ {isKn ? "ತಾಜಾ ಸುದ್ದಿಗಳು" : "Breaking News"} ({rawArticles.filter((a) => a.isBreaking).length})
            </button>
            <button
              type="button"
              className={`ln-qf-btn ${quickFilter === "landmark" ? "active" : ""}`}
              onClick={() => setQuickFilter("landmark")}
            >
              🏛️ {isKn ? "ಐತಿಹಾಸಿಕ ತೀರ್ಪುಗಳು" : "Landmark Rulings"} ({rawArticles.filter((a) => a.isLandmark).length})
            </button>
            <button
              type="button"
              className={`ln-qf-btn ${quickFilter === "trending" ? "active" : ""}`}
              onClick={() => setQuickFilter("trending")}
            >
              🔥 {isKn ? "ಹೆಚ್ಚು ಚರ್ಚಿತ" : "Trending"} ({rawArticles.filter((a) => a.isTrending).length})
            </button>
            <button
              type="button"
              className={`ln-qf-btn ${quickFilter === "saved" ? "active" : ""}`}
              onClick={() => setQuickFilter("saved")}
            >
              ⭐ {isKn ? "ಉಳಿಸಿದ ಲೇಖನಗಳು" : "Saved Briefs"} ({bookmarks.length})
            </button>
          </div>

          {/* Category Tabs */}
          <div className="ln-categories-scroll">
            {NEWS_CATEGORIES_EN.map((cat, idx) => {
              const label = isKn ? NEWS_CATEGORIES_KN[idx] || cat : cat;
              const count =
                cat === "All"
                  ? rawArticles.length
                  : rawArticles.filter((a) => a.category === cat).length;
              const isActive = selectedCategory === cat;
              const color = CATEGORY_COLORS[cat] || "#2563eb";

              return (
                <button
                  key={cat}
                  type="button"
                  className={`ln-cat-btn ${isActive ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                  style={
                    isActive && cat !== "All"
                      ? {
                          borderColor: color,
                          background: color + "18",
                          color: color,
                          boxShadow: `0 2px 8px ${color}25`
                        }
                      : {}
                  }
                >
                  <span>{label}</span>
                  <span className="ln-cat-count">{count}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Results Metadata ── */}
        <div className="ln-meta-results">
          {isKn ? (
            <>
              ಒಟ್ಟು <strong>{filteredNews.length}</strong> ನ್ಯಾಯಾಂಗ ವರದಿಗಳು ಲಭ್ಯವಿವೆ
            </>
          ) : (
            <>
              Showing <strong>{filteredNews.length}</strong> authoritative judicial report
              {filteredNews.length !== 1 ? "s" : ""}
            </>
          )}
        </div>

        {/* ── 5. News Grid (Mobile App & Desktop Cards) ── */}
        <section className="ln-grid">
          {filteredNews.map((article) => {
            const catColor = CATEGORY_COLORS[article.category] || "#2563eb";
            const isBookmarked = bookmarks.includes(article.id);

            return (
              <article
                key={article.id}
                className="ln-card"
                onClick={() => setActiveArticle(article)}
                style={{ "--cat-color": catColor, borderLeftColor: catColor }}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveArticle(article);
                  }
                }}
              >
                {/* 1. Header: Category Pill + Read Time */}
                <div className="ln-card-top-row">
                  <span
                    className="ln-card-cat"
                    style={{
                      background: catColor + "18",
                      color: catColor,
                      borderColor: catColor + "40"
                    }}
                  >
                    ● {article.category}
                  </span>
                  <span className="ln-card-read-time">⏱️ {article.readTime}</span>
                </div>

                {/* 2. Court & Bench Strip */}
                <div className="ln-card-court-strip">
                  <span className="ln-card-court">🏛️ {article.court}</span>
                  {article.bench && (
                    <span className="ln-card-bench" title={article.bench}>
                      👨‍⚖️ {article.bench}
                    </span>
                  )}
                </div>

                {/* 3. Headline */}
                <h2 className="ln-card-title">
                  {isKn && article.titleKn ? article.titleKn : article.title}
                </h2>

                {/* 4. Executive Summary */}
                <p className="ln-card-summary">
                  {isKn && article.summaryKn ? article.summaryKn : article.summary}
                </p>

                {/* 5. Key Statutory Enactments */}
                {article.statutes && article.statutes.length > 0 && (
                  <div className="ln-card-statutes">
                    {article.statutes.slice(0, 2).map((st, i) => (
                      <span key={i} className="ln-card-st-chip">
                        § {st}
                      </span>
                    ))}
                    {article.statutes.length > 2 && (
                      <span className="ln-card-st-more">
                        +{article.statutes.length - 2} more
                      </span>
                    )}
                  </div>
                )}

                {/* 6. Card Footer with Date, Citation & 3 Mobile Actions */}
                <div className="ln-card-footer">
                  <div className="ln-cf-meta-bar">
                    <span className="ln-card-date">📅 {article.date}</span>
                    <span className="ln-card-citation" title={article.citation}>
                      ⚖️ {article.citation}
                    </span>
                  </div>

                  <div className="ln-cf-actions">
                    <button
                      type="button"
                      className={`ln-btn-card-bm ${isBookmarked ? "saved" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(article.id, e);
                      }}
                      title={isBookmarked ? "Remove from saved" : "Save article"}
                      aria-label="Save article"
                    >
                      {isBookmarked ? "★" : "☆"}
                    </button>
                    <button
                      type="button"
                      className={`ln-btn-card-copy ${copiedId === article.id ? "copied" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyCitation(article, e);
                      }}
                      title="Copy citation"
                    >
                      {copiedId === article.id ? "✓ Copied" : "📋 Copy"}
                    </button>
                    <button
                      type="button"
                      className="ln-card-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveArticle(article);
                      }}
                    >
                      {isKn ? "ಪೂರ್ಣ ಸುದ್ದಿ →" : "Read Brief →"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {filteredNews.length === 0 && (
          <div className="ln-empty-state">
            <span className="ln-empty-icon">⚖️</span>
            <h3>{isKn ? "ಯಾವುದೇ ನ್ಯಾಯಾಂಗ ವರದಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ" : "No Judicial Reports Found"}</h3>
            <p>
              {isKn
                ? "ದಯವಿಟ್ಟು ಬೇರೆ ಕೀವರ್ಡ್ ಅಥವಾ ವರ್ಗವನ್ನು ಪ್ರಯತ್ನಿಸಿ, ಅಥವಾ ಹುಡುಕಾಟವನ್ನು ತೆರವುಗೊಳಿಸಿ."
                : "Try searching with a broader section number, judge name, or selecting 'All Stories'."}
            </p>
            <button
              type="button"
              className="ln-btn-reset"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setQuickFilter("all");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* ── 6. Legal Dossier Reading Modal ── */}
      {activeArticle && (
        <div
          className="ln-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveArticle(null);
          }}
        >
          <div className="ln-modal-box">
            {/* Native Mobile Sheet Handle Bar */}
            <div className="ln-sheet-handle-bar">
              <div className="ln-sheet-handle"></div>
            </div>

            {/* Modal Top Strip */}
            <div className="ln-modal-top">
              <div className="ln-mt-tags">
                <span
                  className="ln-card-cat"
                  style={{
                    background: (CATEGORY_COLORS[activeArticle.category] || "#2563eb") + "18",
                    color: CATEGORY_COLORS[activeArticle.category] || "#2563eb"
                  }}
                >
                  {activeArticle.category}
                </span>
                <span className="ln-modal-court">🏛️ {activeArticle.court}</span>
                {activeArticle.citation && (
                  <span className="ln-modal-citation">§ {activeArticle.citation}</span>
                )}
              </div>
              <button
                type="button"
                className="ln-modal-close-btn"
                onClick={() => setActiveArticle(null)}
                aria-label="Close article"
              >
                ✕
              </button>
            </div>

            {/* Article Headline */}
            <h2 className="ln-modal-title">
              {isKn && activeArticle.titleKn ? activeArticle.titleKn : activeArticle.title}
            </h2>

            {/* Judicial Coram & Meta */}
            <div className="ln-modal-meta-box">
              <div className="ln-mm-item">
                <span className="ln-mm-label">👨‍⚖️ Judicial Bench:</span>
                <strong>{activeArticle.bench || "Hon'ble Court"}</strong>
              </div>
              <div className="ln-mm-item">
                <span className="ln-mm-label">📅 Date of Judgment:</span>
                <strong>{activeArticle.date}</strong>
              </div>
              <div className="ln-mm-item">
                <span className="ln-mm-label">✍️ Legal Reporting Desk:</span>
                <strong>{activeArticle.author}</strong>
              </div>
              <div className="ln-mm-item">
                <span className="ln-mm-label">⏳ Reading Time:</span>
                <strong>{activeArticle.readTime}</strong>
              </div>
            </div>

            {/* Statutory Provisions Tag List */}
            {activeArticle.statutes && (
              <div className="ln-modal-statutes">
                <span className="ln-ms-label">Statutory Enactments & Sections Invoked:</span>
                <div className="ln-ms-chips">
                  {activeArticle.statutes.map((st, i) => (
                    <span key={i} className="ln-statute-chip">
                      § {st}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ratio Decidendi Box */}
            <div className="ln-ratio-box">
              <div className="ln-rb-header">
                <span>⚖️ Ratio Decidendi & Legal Principle:</span>
              </div>
              <p>
                {isKn && activeArticle.summaryKn ? activeArticle.summaryKn : activeArticle.summary}
              </p>
            </div>

            <hr className="ln-divider" />

            {/* In-Depth Journalistic Text */}
            <div className="ln-modal-body">
              {activeArticle.content.split("\n\n").map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>

            {/* Key Legal Takeaways & Practical Impact for Advocates */}
            {activeArticle.keyTakeaways && activeArticle.keyTakeaways.length > 0 && (
              <div className="ln-takeaways-card">
                <h4>
                  📌 {isKn ? "ವಕೀಲರು ಮತ್ತು ನ್ಯಾಯಾಂಗಕ್ಕೆ ಪ್ರಮುಖ ಅಂಶಗಳು:" : "Key Takeaways & Practical Impact for Advocates:"}
                </h4>
                <ul>
                  {activeArticle.keyTakeaways.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal Action Bar */}
            <div className="ln-modal-footer">
              <div className="ln-mf-tools">
                <button
                  type="button"
                  className="ln-tool-btn"
                  onClick={() => handleCopyCitation(activeArticle)}
                >
                  {copiedId === activeArticle.id ? "✓ Citation Copied" : "📋 Copy Citation"}
                </button>
                <button
                  type="button"
                  className="ln-tool-btn"
                  onClick={() => handleShare(activeArticle)}
                >
                  {shareToast ? "✓ Link & Brief Copied" : "🔗 Share Brief"}
                </button>
                <button
                  type="button"
                  className="ln-tool-btn"
                  onClick={() => handlePrintArticle(activeArticle)}
                >
                  🖨️ Court Print / PDF
                </button>
                <button
                  type="button"
                  className={`ln-tool-btn ${bookmarks.includes(activeArticle.id) ? "active" : ""}`}
                  onClick={() => toggleBookmark(activeArticle.id)}
                >
                  {bookmarks.includes(activeArticle.id) ? "★ Saved in Library" : "☆ Save Article"}
                </button>
              </div>

              <button
                type="button"
                className="ln-done-btn"
                onClick={() => setActiveArticle(null)}
              >
                {isKn ? "ಮುಕ್ತಾಯ" : "Close Brief"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}