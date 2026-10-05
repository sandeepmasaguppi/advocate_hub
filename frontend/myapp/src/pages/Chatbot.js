// ============================================================
//  Chatbot.js  —  AdvocateHub Professional AI Legal Assistant
//  Features:
//    • Draggable & droppable floating action button across all devices
//      (mobile touch + desktop mouse with smart bounds & persistence)
//    • Enhanced Speech-to-Text / Microphone for mobile Chrome & desktop
//      (real-time interim results, animated equalizer, error recovery)
//    • Empathetic, human-like conversational AI legal assistant
//    • Comprehensive local fallback engine with live clarity & advocates
//    • Bilingual support: English & Kannada (ಕನ್ನಡ)
//    • Mobile-optimized native app bottom-sheet UI with zero keyboard overflow
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAdvocates } from "../data/Advocatesstore";
import defaultClarityData from "../data/clarityguide.json";
import "./Chatbot.css";

const PRIMARY_CHAT_API = "/api/chat";
const FALLBACK_CHAT_API = "/api/chat";

const QUICK_ACTIONS_EN = [
  { label: "⚖️ Bail & Police FIR", msg: "How to apply for anticipatory bail?" },
  { label: "💳 Cheque Bounce (Sec 138)", msg: "What is the procedure for cheque bounce?" },
  { label: "🏠 Property Dispute", msg: "How to resolve land property disputes?" },
  { label: "👨‍👩‍👧 Divorce & Custody", msg: "What are the rules for mutual divorce?" },
  { label: "🚗 Accident & MACT", msg: "How to claim accident compensation?" },
  { label: "📜 Bare Acts Library", msg: "Take me to Bare Acts" },
  { label: "📍 Lawyers in Gokak / Bengaluru", msg: "Find advocates in Bengaluru" },
];

const QUICK_ACTIONS_KN = [
  { label: "⚖️ ಬೇಲ್ & ಎಫ್‌ಐಆರ್ ಸಲಹೆ", msg: "ನಿರೀಕ್ಷಣಾ ಜಾಮೀನು ಪಡೆಯುವುದು ಹೇಗೆ?" },
  { label: "💳 ಚೆಕ್ ಬೌನ್ಸ್ ನಿಯಮಗಳು", msg: "ಚೆಕ್ ಬೌನ್ಸ್ ಕೇಸ್ ಪ್ರಕ್ರಿಯೆ ಏನು?" },
  { label: "🏠 ಆಸ್ತಿ & ಜಮೀನು ವಿವಾದ", msg: "ಜಮೀನು ಆಸ್ತಿ ವಿವಾದ ಇತ್ಯರ್ಥ ಹೇಗೆ?" },
  { label: "👨‍👩‍👧 ವಿಚ್ಛೇದನ & ಜೀವನಾಂಶ", msg: "ಪರಸ್ಪರ ಒಪ್ಪಿಗೆಯ ವಿಚ್ಛೇದನ ನಿಯಮಗಳು" },
  { label: "🚗 ಅಪಘಾತ ಪರಿಹಾರ (MACT)", msg: "ವಾಹನ ಅಪಘಾತ ಪರಿಹಾರ ಕ್ಲೈಮ್ ಮಾಡುವುದು ಹೇಗೆ?" },
  { label: "📜 Bare Acts ಕಾಯ್ದೆಗಳು", msg: "Go to Bare Acts" },
  { label: "📍 ಬೆಂಗಳೂರಿನಲ್ಲಿ ವಕೀಲರು", msg: "ಬೆಂಗಳೂರಿನಲ್ಲಿ ವಕೀಲರನ್ನು ಹುಡುಕಿ" },
];

// ── Advocate result card inside chat ──────────────────────────
function ChatAdvocateCard({ adv, onConsult, onViewProfile }) {
  const loc = adv.place || adv.city || adv.district || "";
  return (
    <div className="cb-adv-card">
      <div className="cb-adv-avatar">
        {adv.avatar ? (
          <img
            src={adv.avatar}
            alt={adv.name}
            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          (adv.name || "?").replace(/^Adv\.\s*/i, "").split(" ").map(n => n[0]).join("").slice(0, 2)
        )}
      </div>
      <div className="cb-adv-info">
        <div className="cb-adv-name-row">
          <span className="cb-adv-name">{adv.name}</span>
          <span className="cb-adv-verified-tag">✓ Verified Bar Member</span>
        </div>
        <div className="cb-adv-spec">
          {adv.speciality || adv.practiceArea || "Legal Counsel"} {loc ? `· 📍 ${loc}` : ""}
        </div>
        <div className="cb-adv-meta">
          ⭐ {adv.rating || "4.9"} · ⏳ {adv.experience || "5+ Years"} · 🏛️ {adv.court || "District Court"}
        </div>
      </div>
      <div className="cb-adv-actions-col">
        <button
          type="button"
          className="cb-adv-consult-btn"
          onClick={() => onConsult(adv)}
          title="Direct Consultation Chat"
        >
          💬 Chat Now
        </button>
        <button
          type="button"
          className="cb-adv-profile-btn"
          onClick={() => onViewProfile(adv)}
        >
          Profile →
        </button>
      </div>
    </div>
  );
}

// ── Single message bubble ─────────────────────────────────────
function MessageBubble({ msg, onConsult, onViewProfile, onNavigate }) {
  const isBot = msg.role === "bot";
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    if (!msg.text) return;
    navigator.clipboard?.writeText(msg.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );
  };

  return (
    <div className={`cb-msg-row ${isBot ? "bot" : "user"}`}>
      {isBot && (
        <div className="cb-bot-avatar">
          <span>⚖️</span>
        </div>
      )}
      <div className={`cb-bubble ${isBot ? "bot-bubble" : "user-bubble"}`}>
        {/* Text */}
        {msg.text && (
          <div className="cb-bubble-text">
            {msg.text.split("\n").map((line, i) => (
              <div key={i}>{renderText(line)}</div>
            ))}
          </div>
        )}

        {/* Advocate cards */}
        {msg.advocates && msg.advocates.length > 0 && (
          <div className="cb-adv-list">
            {msg.advocates.map((adv) => (
              <ChatAdvocateCard
                key={adv.id || adv.name}
                adv={adv}
                onConsult={onConsult}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>
        )}

        {/* Navigate button */}
        {msg.navigate && (
          <button
            type="button"
            className="cb-nav-btn"
            onClick={() => onNavigate(msg.navigate)}
          >
            {msg.navigateLabel || "Explore Page →"}
          </button>
        )}

        {/* Bot Bubble Utility bar */}
        {isBot && msg.text && (
          <div className="cb-bubble-meta">
            <span className="cb-bubble-stamp">AdvocateHub AI</span>
            <button
              type="button"
              className="cb-copy-btn"
              onClick={copyText}
              title="Copy message"
            >
              {copied ? "✓ Copied" : "📋 Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="cb-msg-row bot">
      <div className="cb-bot-avatar">
        <span>⚖️</span>
      </div>
      <div className="cb-bubble bot-bubble cb-typing">
        <span /><span /><span />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//   HUMAN-LIKE CONVERSATIONAL LEGAL ENGINE (Local Fallback)
// ══════════════════════════════════════════════════════════════
function generateHumanAdvice(msgText, currentLang, allAdvocates, clarityList) {
  const isKn = currentLang === "kn" || /[\u0C80-\u0CFF]/.test(msgText);
  const cleanQ = msgText.toLowerCase().replace(/[^\w\s\u0C80-\u0CFF]/g, " ").replace(/\s+/g, " ").trim();

  const formatAdv = (adv) => ({
    id: adv.id,
    name: adv.name || "Advocate",
    speciality: adv.speciality || adv.practiceArea || "General Practice",
    city: adv.city || adv.district || adv.taluk || "",
    district: adv.district || "",
    court: adv.court || "District & Sessions Court",
    rating: adv.rating || 4.9,
    experience: adv.experience || "5+ Years",
    fee: adv.fee || 10,
    avatar: adv.avatar || "",
  });

  const approvedAdvs = (allAdvocates || []).filter(a => a.status === "approved" || !a.status);
  const topAdvs = approvedAdvs.slice(0, 4);

  // 1. Casual Pleasantries & Well-being
  if (/\b(how\s*are\s*you|how\s*r\s*u|how\s*do\s*you\s*do)\b/i.test(cleanQ) || /(ಹೇಗಿದ್ದೀರಾ|ಹೇಗಿದ್ದೀರಿ)/u.test(msgText)) {
    return {
      text: isKn
        ? `👋 **ನಾನು ಉತ್ತಮವಾಗಿದ್ದೇನೆ, ವಿಚಾರಿಸಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು!**\n\nನಾನು ಭಾರತೀಯ ಕಾನೂನುಗಳು ಮತ್ತು Advocates Hub ವಕೀಲರ ಜಾಲದ ಬಗ್ಗೆ ಸದಾ ಸಕ್ರಿಯನಾಗಿದ್ದೇನೆ. ನೀವು ಹೇಗಿದ್ದೀರಿ? ಇಂದು ನಾನು ನಿಮಗೆ ಯಾವ ಕಾನೂನು ವಿಷಯದಲ್ಲಿ ಸಹಾಯ ಮಾಡಲಿ?`
        : `👋 **I'm doing great, thank you for asking!**\n\nI am active and ready 24/7 to assist you with Indian law queries, case guidance, and connecting you with verified advocates. How are you doing today? What legal question can I help you resolve?`,
      type: "text",
    };
  }

  // 2. Gratitude
  if (/\b(thanks|thank\s*you|thx|appreciate\s*it|thank\s*u|dhanyavad)\b/i.test(cleanQ) || /(ಧನ್ಯವಾದ|ಧನ್ಯವಾದಗಳು)/u.test(msgText)) {
    return {
      text: isKn
        ? `😊 **ತುಂಬಾ ಧನ್ಯವಾದಗಳು!**\n\nನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನನಗೆ ಸಂತೋಷವಾಗಿದೆ. ಯಾವುದೇ ಕಾನೂನು ಮಾರ್ಗದರ್ಶನ, ಕಾಯ್ದೆಗಳ ಮಾಹಿತಿ ಅಥವಾ ವಕೀಲರ ಸಮಾಲೋಚನೆ ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ನಾನು ಯಾವಾಗಲೂ ಲಭ್ಯವಿರುತ್ತೇನೆ.\n\nನಿಮ್ಮ ದಿನ ಶುಭವಾಗಿರಲಿ!`
        : `😊 **You are most welcome!**\n\nI'm delighted I could help clarify things for you. Whenever you have legal questions, need case clarity, or wish to consult a verified advocate, I am always here to assist.\n\nWishing you peace of mind and success with your matter!`,
      type: "text",
    };
  }

  // 3. Identity
  if (/\b(who\s*are\s*you|what\s*are\s*you|your\s*name|who\s*made\s*you)\b/i.test(cleanQ) || /(ನೀವು ಯಾರು|ನಿಮ್ಮ ಹೆಸರೇನು)/u.test(msgText)) {
    return {
      text: isKn
        ? `🤖 **ನಾನು Advocates Hub AI ಕಾನೂನು ಸಹಾಯಕ (AI Legal Assistant).**\n\nನನ್ನ ಮುಖ್ಯ ಉದ್ದೇಶ ಜನಸಾಮಾನ್ಯರಿಗೆ ಭಾರತೀಯ ಕಾನೂನುಗಳನ್ನು ಸುಲಭವಾಗಿ ಅರ್ಥಮಾಡಿಸುವುದು ಮತ್ತು ನೈಜ ನ್ಯಾಯಾಲಯ ಪ್ರಕರಣಗಳಿಗಾಗಿ ಪರಿಶೀಲಿತ ಬಾರ್ ಕೌನ್ಸಿಲ್ ವಕೀಲರೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ ಕಲ್ಪಿಸುವುದು.\n\nನಾನು ನಿಮಗೆ ಸಿವಿಲ್, ಕ್ರಿಮಿನಲ್, ಆಸ್ತಿ, ಕೌಟುಂಬಿಕ, ಚೆಕ್ ಬೌನ್ಸ್ ಮತ್ತು ಗ್ರಾಹಕ ಹಕ್ಕುಗಳ ಕುರಿತು ಸಲಹೆ ನೀಡಬಲ್ಲೆ.`
        : `🤖 **I am the Advocates Hub AI Legal Assistant.**\n\nMy purpose is to demystify Indian law for citizens, provide practical situational clarity, and directly connect you with verified Bar Council advocates across India.\n\nI can help you explore rights under BNS/BNSS, bail procedures, property due diligence, matrimonial disputes, NI Act cheque bounce, and much more.`,
      type: "text",
    };
  }

  // 4. Consultation Fees
  if (/\b(fee|fees|cost|charge|charges|pricing|how\s*much|rate|rates)\b/i.test(cleanQ) || /(ಶುಲ್ಕ|ವೆಚ್ಚ|ದರ|ಹಣ)/u.test(msgText)) {
    return {
      text: isKn
        ? `💰 **Advocates Hub ಸಮಾಲೋಚನೆ ವಿವರ:**\n\n1. ⚡ **ಒಂದು ಬಾರಿಯ ಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆ:**\nಪರಿಶೀಲಿತ ವಕೀಲರೊಂದಿಗೆ ನೇರ ಚಾಟ್ ಸಮಾಲೋಚನೆ ಆರಂಭಿಸಲು ಮತ್ತು ಕ್ಲೌಡ್ ಸ್ಟೋರೇಜ್ ನಿರ್ವಹಣೆಗಾಗಿ ಕನಿಷ್ಠ ಶುಲ್ಕವಿರುತ್ತದೆ. ಒಮ್ಮೆ ಸಕ್ರಿಯಗೊಳಿಸಿದರೆ ನಿರಂತರವಾಗಿ ಚಾಟ್ ಮಾಡಬಹುದು.\n\n2. 🏛️ **ವಕೀಲರ ಸಮಾಲೋಚನೆ:**\nವಕೀಲರ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಅವರ ಸಮಾಲೋಚನಾ ವಿವರಗಳು ಲಭ್ಯವಿರುತ್ತವೆ.\n\n3. 🤖 **AI ಸಹಾಯಕ:**\nನನ್ನೊಂದಿಗೆ ಚಾಟ್ ಮಾಡುವುದು ಮತ್ತು ಕಾನೂನು ಮಾರ್ಗದರ್ಶಿಗಳನ್ನು ಓದುವುದು ಸಂಪೂರ್ಣವಾಗಿ ಉಚಿತವಾಗಿದೆ!`
        : `💰 **Advocates Hub Consultation Details:**\n\n1. ⚡ **One-Time Advocate Chat Activation:**\nTo initiate direct confidential chat with any verified advocate and support encrypted cloud storage/maintenance, a nominal activation fee applies. Once activated, continuous consultation is unlocked.\n\n2. 🏛️ **Advocate Consultation:**\nEach advocate lists their consultation details transparently on their profile.\n\n3. 🤖 **AI Legal Assistant:**\nChatting with me for legal clarity, exploring laws, and searching advocates is completely free!`,
      type: "advocates",
      advocates: topAdvs.map(formatAdv),
    };
  }

  // 5. Criminal / Police / Bail / FIR
  if (/\b(criminal|bail|fir|crime|police|arrest|anticipatory|warrant)\b/i.test(cleanQ) || /(ಕ್ರಿಮಿನಲ್|ಬೇಲ್|ಜಾಮೀನು|ಎಫ್‌ಐಆರ್|ಬಂಧನ)/u.test(msgText)) {
    const crimAdvs = approvedAdvs.filter(a => ((a.speciality || "") + " " + (a.practiceArea || "")).toLowerCase().includes("criminal"));
    const list = crimAdvs.length > 0 ? crimAdvs : topAdvs;
    return {
      text: isKn
        ? `⚖️ **ಕ್ರಿಮಿನಲ್ ಮತ್ತು ಜಾಮೀನು (Bail) ಮಾರ್ಗದರ್ಶನ:**\n\nಕ್ರಿಮಿನಲ್ ವಿಷಯಗಳಲ್ಲಿ ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಕ್ರಮ ಕೈಗೊಳ್ಳುವುದು ಅತ್ಯಂತ ಮುಖ್ಯ:\n\n1. 🛡️ **ನಿರೀಕ್ಷಣಾ ಜಾಮೀನು (Anticipatory Bail):** ಬಂಧನದ ಭೀತಿಯಿದ್ದರೆ ಸೆಕ್ಷನ್ 438 CrPC / 482 BNSS ಅಡಿಯಲ್ಲಿ ಸೆಷನ್ಸ್ ಕೋರ್ಟ್ ಅಥವಾ ಹೈಕೋರ್ಟ್‌ನಲ್ಲಿ ಜಾಮೀನು ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.\n2. 📜 **ಎಫ್‌ಐಆರ್ (FIR) ಪ್ರತಿ:** ಪ್ರಥಮ ಮಾಹಿತಿ ವರದಿಯ ದೃಢೀಕೃತ ಪ್ರತಿಯನ್ನು ಪಡೆದುಕೊಳ್ಳಿ. ಅದರಲ್ಲಿರುವ ಸೆಕ್ಷನ್‌ಗಳನ್ನು ಗಮನಿಸಿ.\n3. 🔒 **ಪೊಲೀಸ್ ಹಕ್ಕುಗಳು:** ವಕೀಲರ ಉಪಸ್ಥಿತಿಯಿಲ್ಲದೆ ಖಾಲಿ ಕಾಗದದ ಮೇಲೆ ಸಹಿ ಮಾಡಬೇಡಿ. 24 ಗಂಟೆಗಳ ಒಳಗೆ ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ಮುಂದೆ ಹಾಜರುಪಡಿಸುವುದು ಸಂವಿಧಾನದ ಹಕ್ಕು (Art 22).\n\nಪರಿಶೀಲಿತ ಕ್ರಿಮಿನಲ್ ವಕೀಲರೊಂದಿಗೆ ಕೆಳಗೆ ಸಮಾಲೋಚನೆ ನಡೆಸಿ:`
        : `⚖️ **Criminal Defense & Bail Guidance:**\n\nIn criminal matters, prompt action protects your personal liberty:\n\n1. 🛡️ **Anticipatory Bail:** If there is an apprehension of arrest, apply for Anticipatory Bail under Sec 438 CrPC (or Sec 482 BNSS 2023) before the Sessions Court or High Court.\n2. 📜 **Certified Copy of FIR:** Obtain an immediate certified copy of the FIR/complaint to inspect the exact penal provisions invoked.\n3. 🔒 **Statutory Rights upon Detention:** Under Article 22(1) and Sec 50 CrPC, you have the right to be informed of the grounds of arrest, the right to consult your advocate, and mandatory production before a magistrate within 24 hours.\n\nConnect directly with verified criminal defense advocates below:`,
      type: "advocates",
      advocates: list.slice(0, 6).map(formatAdv),
    };
  }

  // 6. Cheque Bounce (Sec 138 NI Act)
  if (/\b(cheque|check|bounce|138|dishonour|debt|money\s*recovery|promissory)\b/i.test(cleanQ) || /(ಚೆಕ್|ಬೌನ್ಸ್|ಹಣ\s*ವಸೂಲಾತಿ)/u.test(msgText)) {
    const debtAdvs = approvedAdvs.filter(a => ((a.speciality || "") + " " + (a.practiceArea || "")).toLowerCase().includes("civil") || ((a.speciality || "")).toLowerCase().includes("banking"));
    const list = debtAdvs.length > 0 ? debtAdvs : topAdvs;
    return {
      text: isKn
        ? `💳 **ಚೆಕ್ ಬೌನ್ಸ್ (Sec 138 NI Act) ಕಾನೂನು ಹಂತಗಳು:**\n\n1. ⏱️ **ಬ್ಯಾಂಕ್ ಮೆಮೊ:** ಬ್ಯಾಂಕ್‌ನಿಂದ ಚೆಕ್ ಬೌನ್ಸ್ ಆದ ದಿನದಿಂದ 30 ದಿನಗಳ ಒಳಗಾಗಿ ಅಧಿಕೃತ ಕಾನೂನು ನೋಟಿಸ್ ನೀಡಬೇಕು.\n2. 📜 **15 ದಿನಗಳ ಕಾಲಾವಕಾಶ:** ನೋಟಿಸ್ ತಲುಪಿದ 15 ದಿನಗಳಲ್ಲಿ ಹಣ ಪಾವತಿಸಲು ಎದುರು ಪಕ್ಷಕ್ಕೆ ಕಾಲಾವಕಾಶವಿರುತ್ತದೆ.\n3. ⚖️ **ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ಕೋರ್ಟ್‌ನಲ್ಲಿ ಕೇಸ್:** 15 ದಿನಗಳು ಮುಗಿದ ನಂತರ ಮುಂದಿನ 30 ದಿನಗಳೊಳಗೆ ನ್ಯಾಯಾಲಯದಲ್ಲಿ ಕ್ರಿಮಿನಲ್ ದೂರು ದಾಖಲಿಸಬೇಕು.\n\nಚೆಕ್ ಬೌನ್ಸ್ ಮತ್ತು ಹಣ ವಸೂಲಾತಿ ವಕೀಲರೊಂದಿಗೆ ಮಾತನಾಡಿ:`
        : `💳 **Cheque Bounce (Sec 138 NI Act) Legal Procedure:**\n\n1. ⏱️ **Bank Memo Window:** Issue a formal Demand Legal Notice through an advocate within 30 days of receiving the bank's cheque return memo.\n2. 📜 **15-Day Cure Period:** The drawer has 15 statutory days from notice receipt to clear the cheque amount.\n3. ⚖️ **Filing Complaint:** If payment is not made within 15 days, file a Criminal Complaint before the Judicial Magistrate within the next 30 days.\n\nConnect with verified banking and cheque bounce advocates below:`,
      type: "advocates",
      advocates: list.slice(0, 6).map(formatAdv),
    };
  }

  // 7. Property & Land
  if (/\b(property|land|real\s*estate|khata|rtc|mutation|encumbrance|partition|tenant|rent)\b/i.test(cleanQ) || /(ಆಸ್ತಿ|ಜಮೀನು|ಖಾತಾ|ಭಾಗಪತ್ರ|ಬಾಡಿಗೆ)/u.test(msgText)) {
    const propAdvs = approvedAdvs.filter(a => ((a.speciality || "") + " " + (a.practiceArea || "")).toLowerCase().includes("property"));
    const list = propAdvs.length > 0 ? propAdvs : topAdvs;
    return {
      text: isKn
        ? `🏠 **ಆಸ್ತಿ ಮತ್ತು ಭೂವಿವಾದ ಕಾನೂನು ಸಲಹೆ:**\n\n1. 📝 **ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆ:** ಕನಿಷ್ಠ 30 ವರ್ಷಗಳ ಋಣಭಾರ ಪ್ರಮಾಣಪತ್ರ (Encumbrance Certificate - EC), RTC/ಪಹಣಿ, ಖಾತಾ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ಮೂಲ ಕ್ರಯಪತ್ರ ಪರಿಶೀಲಿಸಿ.\n2. 🛡️ **ತಡೆಯಾಜ್ಞೆ (Injunction):** ಅಕ್ರಮ ಅತಿಕ್ರಮಣ ಅಥವಾ ಮಾರಾಟದ ಭೀತಿಯಿದ್ದರೆ ಸಿವಿಲ್ ಕೋರ್ಟ್‌ನಲ್ಲಿ ತಕ್ಷಣ ತಾತ್ಕಾಲಿಕ ತಡೆಯಾಜ್ಞೆ ಅರ್ಜಿ ಹಾಕಿ.\n3. 📑 **ಭಾಗಪತ್ರ (Partition Suit):** ಪಿತ್ರಾರ್ಜಿತ ಆಸ್ತಿಯಲ್ಲಿ ನಿಮ್ಮ ನ್ಯಾಯಯುತ ಹಕ್ಕನ್ನು ಪಡೆಯಲು ಸಿವಿಲ್ ದಾವೆ ಹೂಡಿ.\n\nಪರಿಶೀಲಿತ ಆಸ್ತಿ ವಕೀಲರೊಂದಿಗೆ ಸಮಾಲೋಚನೆ ನಡೆಸಿ:`
        : `🏠 **Property & Real Estate Law Guidance:**\n\n1. 📝 **Title Due Diligence:** Always inspect a minimum 30-year Encumbrance Certificate (EC), RTC/Pahani, revenue mutation records, and parent title deeds before any transaction.\n2. 🛡️ **Temporary Injunction:** In case of unlawful encroachment or illegal sale attempts, file for a civil injunction order (Order 39 CPC) immediately.\n3. 📑 **Partition Suit:** For ancestral coparcenary properties, file a formal civil partition suit to enforce your legal share.\n\nConsult verified real estate and land advocates below:`,
      type: "advocates",
      advocates: list.slice(0, 6).map(formatAdv),
    };
  }

  // 8. Family & Matrimonial
  if (/\b(family|divorce|custody|maintenance|alimony|marriage|matrimonial)\b/i.test(cleanQ) || /(ಕೌಟುಂಬಿಕ|ವಿಚ್ಛೇದನ|ಜೀವನಾಂಶ|ಮಕ್ಕಳ\s*ಪಾಲನೆ)/u.test(msgText)) {
    const famAdvs = approvedAdvs.filter(a => ((a.speciality || "") + " " + (a.practiceArea || "")).toLowerCase().includes("family"));
    const list = famAdvs.length > 0 ? famAdvs : topAdvs;
    return {
      text: isKn
        ? `👨‍👩‍👧 **ಕೌಟುಂಬಿಕ ಮತ್ತು ವಿಚ್ಛೇದನ ಸಲಹೆ:**\n\n1. 🤝 **ಪರಸ್ಪರ ಒಪ್ಪಿಗೆಯ ವಿಚ್ಛೇದನ (Mutual Consent):** ಹಿಂದೂ ವಿವಾಹ ಕಾಯ್ದೆ Sec 13B ಅಡಿಯಲ್ಲಿ ಇಬ್ಬರೂ ಸೌಹಾರ್ದಯುತವಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಶೀಘ್ರ ಇತ್ಯರ್ಥ ಪಡೆಯಬಹುದು.\n2. ⚖️ **ಜೀವನಾಂಶ (Maintenance):** Sec 125 CrPC / BNSS ಅಥವಾ ಕೌಟುಂಬಿಕ ದೌರ್ಜನ್ಯ ಕಾಯ್ದೆಯಡಿ ಪತ್ನಿ ಮತ್ತು ಮಕ್ಕಳು ಮಧ್ಯಂತರ ಹಾಗೂ ಶಾಶ್ವತ ಜೀವನಾಂಶ ಪಡೆಯಲು ಅರ್ಹರು.\n3. 👶 **ಮಕ್ಕಳ ಪಾಲನೆ (Child Custody):** ಮಗುವಿನ ಅತ್ಯುತ್ತಮ ಕಲ್ಯಾಣ ಮತ್ತು ಭವಿಷ್ಯವೇ ನ್ಯಾಯಾಲಯದ ಪ್ರಮುಖ ಮಾನದಂಡ.\n\nಪರಿಶೀಲಿತ ಕೌಟುಂಬಿಕ ವಕೀಲರೊಂದಿಗೆ ಸಮಾಲೋಚಿಸಿ:`
        : `👨‍👩‍👧 **Family & Matrimonial Law Advice:**\n\n1. 🤝 **Mutual Consent Divorce:** Under Section 13B of the Hindu Marriage Act (or Sec 28 Special Marriage Act), parties can jointly petition for an amicable resolution.\n2. ⚖️ **Maintenance & Alimony:** Statutory maintenance under Section 125 CrPC / BNSS ensures financial security and living expenses for spouse and minor children.\n3. 👶 **Child Custody & Visitation:** The paramount welfare and education of the child guide custody and visitation arrangements in Family Court.\n\nConsult verified matrimonial and family advocates below:`,
      type: "advocates",
      advocates: list.slice(0, 6).map(formatAdv),
    };
  }

  // 9. Match City
  const matchedCityAdvs = approvedAdvs.filter(a => {
    const c = (a.city || a.district || a.taluk || a.place || "").toLowerCase();
    return c && cleanQ.includes(c);
  });
  if (matchedCityAdvs.length > 0) {
    return {
      text: isKn
        ? `📍 ನಿಮ್ಮ ಸ್ಥಳದಲ್ಲಿ ಲಭ್ಯವಿರುವ ${matchedCityAdvs.length} ಪರಿಶೀಲಿತ ವಕೀಲರು:`
        : `📍 Found ${matchedCityAdvs.length} verified advocates in your area:`,
      type: "advocates",
      advocates: matchedCityAdvs.slice(0, 6).map(formatAdv),
    };
  }

  // 10. Match Clarity Guide Situations
  if (clarityList && clarityList.length > 0) {
    const qWords = cleanQ.split(/\s+/).filter(w => w.length >= 3);
    let best = null;
    let bestScore = 0;
    for (const item of clarityList.slice(0, 400)) {
      let score = 0;
      const sitEn = (item.situation || "").toLowerCase();
      const sitKn = (item.situationKn || "").toLowerCase();
      const catEn = (item.category || "").toLowerCase();
      const catKn = (item.categoryKn || "").toLowerCase();

      if (cleanQ && (sitEn.includes(cleanQ) || sitKn.includes(cleanQ))) score += 20;
      for (const w of qWords) {
        if (sitEn.includes(w) || sitKn.includes(w)) score += 6;
        if (catEn.includes(w) || catKn.includes(w)) score += 3;
      }
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }

    if (bestScore >= 6 && best) {
      return {
        text: isKn
          ? `⚖️ **ಕಾನೂನು ಮಾರ್ಗದರ್ಶಿ (Clarity Guide):**\n\n📌 **ಪರಿಸ್ಥಿತಿ:** ${best.situationKn || best.situation}\n\n📜 **ಅನ್ವಯವಾಗುವ ಕಾಯ್ದೆ:** ${best.actLawKn || best.actLaw}\n\n👤 **ಆರೋಪಿ / ಎದುರು ಪಕ್ಷ:** ${best.accusedKn || best.accused}\n\n📝 **ಯಾರು ದೂರು ಸಲ್ಲಿಸಬಹುದು:** ${best.whoCanFileKn || best.whoCanFile}\n\n👨‍⚖️ **ಸಲಹೆ ಪಡೆಯಬೇಕಾದ ವಕೀಲರು:** ${best.advocateKn || best.advocate}`
          : `⚖️ **Legal Clarity Guide:**\n\n📌 **Situation:** ${best.situation}\n\n📜 **Applicable Law:** ${best.actLaw}\n\n👤 **Responsible Party / Accused:** ${best.accused}\n\n📝 **Who Can File:** ${best.whoCanFile}\n\n👨‍⚖️ **Recommended Advocate:** ${best.advocate}`,
        type: "advocates",
        advocates: topAdvs.map(formatAdv),
      };
    }
  }

  // Default Empathetic Human Advisory
  return {
    text: isKn
      ? `💡 **ಕಾನೂನು ಸಲಹೆ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ:**\n\nನಾನು ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬಲ್ಲೆ. ಸರಿಯಾದ ಕಾನೂನು ಪರಿಹಾರ ಪಡೆಯಲು ಈ ಕೆಳಗಿನ ಹಂತಗಳನ್ನು ಅನುಸರಿಸಿ:\n\n1. 🔍 **ವಿವರಗಳನ್ನು ಸ್ಪಷ್ಟಪಡಿಸಿ:** ನಿಮ್ಮ ಪ್ರಶ್ನೆಯಲ್ಲಿ ಪ್ರಮುಖ ವಿಷಯವನ್ನು ತಿಳಿಸಿ (ಉದಾ: *'ಬೇಲ್ ಅರ್ಜಿ'*, *'ಚೆಕ್ ಬೌನ್ಸ್'*, *'ಆಸ್ತಿ ವಿವಾದ'*, *'ವಿಚ್ಛೇದನ'*, ಅಥವಾ *'ಅಪಘಾತ ಪರಿಹಾರ'*).\n2. 📍 **ಊರಿನ ಹೆಸರು ತಿಳಿಸಿ:** ಉದಾ: *'Gokak'*, *'Bengaluru'* ನಮೂದಿಸಿ ನಿಮ್ಮ ಹತ್ತಿರದ ವಕೀಲರನ್ನು ಹುಡುಕಿ.\n3. 👨‍⚖️ **ನೇರ ಸಮಾಲೋಚನೆ:** ಕೆಳಗಿರುವ ಪರಿಶೀಲಿತ ವಕೀಲರೊಂದಿಗೆ ನೇರ ಚಾಟ್ ಸಮಾಲೋಚನೆ ಆರಂಭಿಸಿ!\n\nನಿಮ್ಮ ಪ್ರಶ್ನೆ ಅಥವಾ ಪರಿಸ್ಥಿತಿಯನ್ನು ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ!`
      : `💡 **Empathetic Legal Advice & Recommended Next Steps:**\n\nI understand navigating legal matters can feel overwhelming, but you have clear legal rights. Here is how to proceed:\n\n1. 🔍 **Specify your matter:** Type the issue you are facing (e.g. *'anticipatory bail'*, *'cheque bounce notice'*, *'boundary dispute'*, *'divorce mediation'*).\n2. 📍 **Search by City:** Mention your city (e.g. *'Gokak'*, *'Bengaluru'*, *'Belagavi'*) to see local advocates practicing in your jurisdiction.\n3. 👨‍⚖️ **Consult Directly:** Start a confidential direct consultation chat with our verified advocates below.\n\nTell me what happened, or select a verified advocate below!`,
    type: "advocates",
    advocates: topAdvs.map(formatAdv),
  };
}

// ══════════════════════════════════════════════════════════════
//   MAIN CHATBOT COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Chatbot() {
  const navigate = useNavigate();

  const [isOpen,          setIsOpen]          = useState(false);
  const [messages,        setMessages]        = useState([]);
  const [input,           setInput]           = useState("");
  const [loading,         setLoading]         = useState(false);
  const [hasOpened,       setHasOpened]       = useState(false);
  const [unread,          setUnread]          = useState(0);
  const [lang,            setLang]            = useState("en"); // "en" | "kn"
  const [isListening,     setIsListening]     = useState(false);
  const [speechError,     setSpeechError]     = useState("");
  const [isDragging,      setIsDragging]      = useState(false);

  // Floating Action Button coordinates (Drag & Drop across all devices)
  // On mobile screens (<= 768px) or first load, null lets CSS anchor bottom-right perfectly!
  const [fabPos, setFabPos] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const w = window.innerWidth;
        const h = window.innerHeight;
        // On mobile, never use stale desktop coordinates: anchor naturally at bottom-right
        if (w <= 768) {
          localStorage.removeItem("law4u_cb_fab_pos_mobile");
          return null;
        }
        const saved = localStorage.getItem("law4u_cb_fab_pos");
        if (saved) {
          const p = JSON.parse(saved);
          if (
            typeof p.x === "number" &&
            typeof p.y === "number" &&
            p.x >= 10 &&
            p.x <= w - 70 &&
            p.y >= 10 &&
            p.y <= h - 70
          ) {
            return p;
          }
        }
      }
    } catch {}
    return null;
  });

  const bottomRef       = useRef(null);
  const messagesBoxRef  = useRef(null);
  const inputRef        = useRef(null);
  const recognitionRef  = useRef(null);
  const textBeforeVoiceRef = useRef("");
  const dragRef         = useRef({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
    moved: false,
    isDown: false,
    pointerId: null,
  });

  // Clamp FAB position safely within current viewport
  const clampPos = useCallback((x, y) => {
    const w = typeof window !== "undefined" ? window.innerWidth : 360;
    const h = typeof window !== "undefined" ? window.innerHeight : 640;
    const btnSize = 60;
    const pad = 12;
    return {
      x: Math.min(Math.max(pad, x), Math.max(pad, w - btnSize - pad)),
      y: Math.min(Math.max(pad, y), Math.max(pad, h - btnSize - pad)),
    };
  }, []);

  // Window resize & orientation listener to keep FAB in bounds
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w <= 768) {
        // Reset to responsive mobile bottom-right
        setFabPos(null);
      } else {
        setFabPos(prev => (prev ? clampPos(prev.x, prev.y) : null));
      }
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [clampPos]);

  // Pointer Drag Handlers (Unified for Mouse & Touch)
  // Pointer Drag & Tap Handlers (Unified for Mobile Touch & Desktop Mouse)
  const lastToggleRef = useRef(0);

  const toggleChatWindow = useCallback(() => {
    const now = Date.now();
    if (now - lastToggleRef.current < 300) return;
    lastToggleRef.current = now;
    setIsOpen((prev) => !prev);
  }, []);

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = (fabPos && typeof fabPos.x === "number") ? fabPos.x : rect.left;
    const currentY = (fabPos && typeof fabPos.y === "number") ? fabPos.y : rect.top;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentX,
      initY: currentY,
      moved: false,
      isDown: true,
      pointerId: e.pointerId,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDown) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (!dragRef.current.moved && Math.hypot(dx, dy) > 10) {
      dragRef.current.moved = true;
      setIsDragging(true);
    }
    if (dragRef.current.moved) {
      setFabPos(clampPos(dragRef.current.initX + dx, dragRef.current.initY + dy));
    }
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current.isDown) return;
    try {
      e.currentTarget.releasePointerCapture(dragRef.current.pointerId);
    } catch {}
    const wasMoved = dragRef.current.moved;
    dragRef.current.isDown = false;
    setIsDragging(false);

    if (wasMoved) {
      if (typeof window !== "undefined" && window.innerWidth > 768 && fabPos) {
        try {
          localStorage.setItem("law4u_cb_fab_pos", JSON.stringify(fabPos));
        } catch {}
      }
    } else {
      // Direct tap/release without dragging toggles chat window immediately
      toggleChatWindow();
    }
  };

  const handleFabClick = (e) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      return;
    }
    toggleChatWindow();
  };

  const handlePointerCancel = (e) => {
    if (!dragRef.current.isDown) return;
    try {
      e.currentTarget.releasePointerCapture(dragRef.current.pointerId);
    } catch {}
    dragRef.current.isDown = false;
    setIsDragging(false);
  };

  // ── Build welcome message based on language ───────────────
  const getWelcomeMsg = useCallback((currentLang) => {
    if (currentLang === "kn") {
      return {
        id:   Date.now(),
        role: "bot",
        text: "👋 ನಮಸ್ಕಾರ! ನಾನು **AdvocateHub AI ಕಾನೂನು ಸಹಾಯಕ**.\n\nನಿಮ್ಮ ಯಾವುದೇ ಕಾನೂನು ಪ್ರಶ್ನೆ ಅಥವಾ ಸಮಸ್ಯೆಗೆ ನಾನು ಸ್ಪಷ್ಟ ಮಾರ್ಗದರ್ಶನ ನೀಡಬಲ್ಲೆ:\n• ⚖️ **ಕ್ರಿಮಿನಲ್ & ಬೇಲ್:** ನಿರೀಕ್ಷಣಾ ಜಾಮೀನು, ಎಫ್‌ಐಆರ್ ಮತ್ತು ಪೊಲೀಸ್ ನಿಯಮಗಳು\n• 💳 **ಚೆಕ್ ಬೌನ್ಸ್ & ಸಾಲ:** ಸೆಕ್ಷನ್ 138 ನೋಟಿಸ್ ಮತ್ತು ಹಣ ವಸೂಲಾತಿ\n• 🏠 **ಆಸ್ತಿ & ಜಮೀನು:** ಪಹಣಿ/RTC, ಋಣಭಾರ (EC) ಮತ್ತು ತಡೆಯಾಜ್ಞೆ\n• 👨‍👩‍👧 **ಕೌಟುಂಬಿಕ:** ವಿಚ್ಛೇದನ, ಜೀವನಾಂಶ ಮತ್ತು ಮಕ್ಕಳ ಪಾಲನೆ\n• 🎙️ **ಧ್ವನಿ ಮೂಲಕ ಮಾತು:** ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ!\n\nನಿಮ್ಮ ಪ್ರಶ್ನೆ ಅಥವಾ ಪರಿಸ್ಥಿತಿ ಏನು? ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮೈಕ್ ಬಳಸಿ!",
        type: "text",
      };
    }
    return {
      id:   Date.now(),
      role: "bot",
      text: "👋 Hello! I am the **AdvocateHub AI Legal Assistant**.\n\nI can provide you with instant situational legal clarity and connect you with verified advocates:\n• ⚖️ **Bail & Criminal:** Anticipatory bail, FIRs, detention rights (BNS/BNSS)\n• 💳 **Cheque Bounce & Finance:** Section 138 demand notices & recovery\n• 🏠 **Property & Land:** Title due diligence, EC, injunctions & partition\n• 👨‍👩‍👧 **Family & Matrimonial:** Mutual consent divorce, alimony & custody\n• 🎙️ **Voice-to-Text:** Tap the mic below to speak in English or Kannada!\n\nWhat legal issue or question can I help you resolve today?",
      type: "text",
    };
  }, []);

  // ── Welcome message on first open ────────────────────────
  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      setUnread(0);
      setMessages([getWelcomeMsg(lang)]);
      if (typeof window !== "undefined" && window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 120);
      }
    }
    if (isOpen) setUnread(0);
  }, [isOpen, hasOpened, lang, getWelcomeMsg]);

  // ── Language Toggle Handler ──────────────────────────────
  const handleLangToggle = (newLang) => {
    if (newLang === lang) return;
    setLang(newLang);
    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    }
    if (messages.length <= 1) {
      setMessages([getWelcomeMsg(newLang)]);
    }
  };

  // ── Scroll to bottom (Scrolls only inner messages container, never the page window!) ──
  useEffect(() => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTo({
        top: messagesBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // ── Speech Recognition (Voice to Text in Kannada & English) ─
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        lang === "kn"
          ? "ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು Google Chrome ಬಳಸಿ."
          : "Voice recognition is not supported in this browser. Please use Google Chrome or Edge."
      );
      setTimeout(() => setSpeechError(""), 4500);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.abort();
        } catch {}
      }

      // Preserve any text already typed before speech begins
      textBeforeVoiceRef.current = input.trim();

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = lang === "kn" ? "kn-IN" : "en-IN";

      rec.onstart = () => {
        setIsListening(true);
        setSpeechError("");
      };

      rec.onresult = (event) => {
        let finalStr = "";
        let interimStr = "";
        for (let i = 0; i < event.results.length; i++) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalStr += piece + " ";
          } else {
            interimStr += piece;
          }
        }
        const accumulated = (finalStr + interimStr).trim();
        if (accumulated) {
          const base = textBeforeVoiceRef.current;
          const fullText = base ? `${base} ${accumulated}` : accumulated;
          setInput(fullText);
        }
      };

      rec.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          return;
        }
        setIsListening(false);
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          setSpeechError(
            lang === "kn"
              ? "ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಮೈಕ್ ಅನುಮತಿಸಿ."
              : "Microphone permission denied. Tap the lock icon in address bar to allow mic access."
          );
        } else if (event.error === "audio-capture") {
          setSpeechError(
            lang === "kn"
              ? "ಮೈಕ್ರೋಫೋನ್ ಸಿಗಲಿಲ್ಲ. ಸಾಧನವನ್ನು ಪರೀಕ್ಷಿಸಿ."
              : "No microphone detected on your device."
          );
        } else if (event.error === "network") {
          setSpeechError(
            lang === "kn"
              ? "ಧ್ವನಿ ಸೇವೆಯಲ್ಲಿ ನೆಟ್‌ವರ್ಕ್ ದೋಷ ಉಂಟಾಗಿದೆ."
              : "Network error with voice recognition. Check your connection."
          );
        } else {
          setSpeechError(
            lang === "kn" ? "ಧ್ವನಿ ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ." : `Voice recognition: ${event.error}`
          );
        }
        setTimeout(() => setSpeechError(""), 4000);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.start();
      recognitionRef.current = rec;
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setIsListening(false);
      setSpeechError(
        lang === "kn"
          ? "ಮೈಕ್ರೋಫೋನ್ ಆರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
          : "Could not start microphone. Check browser permissions."
      );
      setTimeout(() => setSpeechError(""), 4000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const toggleListening = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // ── Send message (Live server with empathetic human fallback) ─
  const sendMessage = async (textToSend) => {
    const msg = (textToSend || input).trim();
    if (!msg || loading) return;

    // Immediately cancel and detach speech recognition so trailing audio buffers cannot repopulate the input
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
      } catch {}
    }
    setIsListening(false);
    textBeforeVoiceRef.current = "";

    const userMsg = { id: Date.now(), role: "user", text: msg, type: "text" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      let data = null;

      // 1. Try backend /api/chat
      try {
        const resFallback = await fetch(FALLBACK_CHAT_API, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ message: msg, lang }),
        });
        if (resFallback.ok) {
          data = await resFallback.json();
        }
      } catch {}

      // 2. Try port 5001 if configured
      if (!data) {
        try {
          const res = await fetch(PRIMARY_CHAT_API, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ message: msg, lang }),
          });
          if (res.status === 429) {
            const errData = await res.json().catch(() => ({}));
            data = {
              text: `${errData.error || "Too Many Requests 🚨"}\n\n${errData.message || "Rate limit exceeded."}\n${errData.action || "Please slow down and try again later!"}`,
              type: "text",
            };
          } else if (res.ok) {
            data = await res.json();
          }
        } catch {}
      }

      // 3. Fallback to Local Empathetic Conversational Engine if server offline
      if (!data || !data.text) {
        const localAdvocates = getAdvocates() || [];
        data = generateHumanAdvice(msg, lang, localAdvocates, defaultClarityData);
      }

      const botMsg = {
        id:        Date.now() + 1,
        role:      "bot",
        text:      data.text      || "",
        type:      data.type      || "text",
        advocates: data.advocates || null,
        navigate:  data.navigate  || null,
        profileId: data.profileId || null,
      };
      setMessages(prev => [...prev, botMsg]);

      // Auto-navigate if requested
      if (data.type === "navigate" && data.navigate) {
        setTimeout(() => {
          navigate(data.navigate);
          setIsOpen(false);
        }, 1200);
      }

    } catch (err) {
      console.error("Chat error:", err);
      // Emergency human advice
      const localAdvocates = getAdvocates() || [];
      const fallbackData = generateHumanAdvice(msg, lang, localAdvocates, defaultClarityData);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: fallbackData.text,
          type: "advocates",
          advocates: fallbackData.advocates,
        },
      ]);
    } finally {
      setLoading(false);
      if (typeof window !== "undefined" && window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  };

  // ── Navigate from bot response ────────────────────────────
  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // ── Direct Consultation action: opens Client Dashboard or Client Registration ──
  const handleConsultAdvocate = (adv) => {
    if (!adv || !adv.id) return;
    const clientId = Number(
      localStorage.getItem("law4u_client_id") ||
      sessionStorage.getItem("law4u_client_id") ||
      0
    );

    if (clientId > 0) {
      // Client is already registered and logged in
      try {
        sessionStorage.setItem(`law4u_active_chat_${clientId}`, String(adv.id));
        localStorage.setItem(`law4u_active_chat_${clientId}`, String(adv.id));
      } catch {}
      navigate(`/client-dashboard?advocateId=${adv.id}`);
    } else {
      // Client needs to register first: route directly to client signup page with advocate context
      const advName = encodeURIComponent(adv.name || "");
      const redirectUrl = encodeURIComponent(`/client-dashboard?advocateId=${adv.id}`);
      navigate(`/signup?role=client&advocateId=${adv.id}&advocateName=${advName}&redirect=${redirectUrl}`);
    }
    setIsOpen(false);
  };

  // ── Open advocate profile ─────────────────────────────────
  const handleViewProfile = (adv) => {
    if (adv.id) {
      navigate(`/profile/${adv.id}`);
      setIsOpen(false);
    }
  };

  // ── Quick action click ────────────────────────────────────
  const handleQuickAction = (msg) => {
    sendMessage(msg);
  };

  // ── Key handler ───────────────────────────────────────────
  const handleKey = (e) => {
    // Never auto-send while voice recognition is active or during IME composition
    if (isListening || e.isComposing || e.nativeEvent?.isComposing) {
      return;
    }
    // On mobile devices, require tapping the Send button directly
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Clear chat ────────────────────────────────────────────
  const clearChat = () => {
    setMessages([getWelcomeMsg(lang)]);
  };

  const quickActions = lang === "kn" ? QUICK_ACTIONS_KN : QUICK_ACTIONS_EN;

  const fabStyle =
    fabPos && typeof fabPos.x === "number" && typeof fabPos.y === "number"
      ? {
          left: `${fabPos.x}px`,
          top: `${fabPos.y}px`,
          right: "auto",
          bottom: "auto",
        }
      : undefined;

  return (
    <>
      {/* ── Mobile Backdrop Overlay (Smooth dismiss on mobile tap outside) ── */}
      {isOpen && (
        <div
          className="cb-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Draggable Floating Action Button (Mouse + Touch Drag across all devices) ── */}
      <button
        type="button"
        className={`cb-fab ${isOpen ? "cb-fab-open" : ""} ${isDragging ? "cb-fab-dragging" : ""}`}
        style={fabStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClick={handleFabClick}
        title="Tap to chat with AI Legal Assistant · Drag to reposition"
        aria-label="Toggle Legal Chatbot"
      >
        <span className="cb-fab-icon">{isOpen ? "✕" : "⚖️"}</span>
        {!isOpen && unread > 0 && (
          <span className="cb-fab-badge">{unread}</span>
        )}
        {!isOpen && !isDragging && (
          <span className="cb-fab-label">
            {lang === "kn" ? "ಏನಾದರೂ ಕೇಳಿ (AI Chat)" : "Ask AI Legal Assistant"}
          </span>
        )}
      </button>

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="cb-window">

          {/* Mobile Handle Indicator */}
          <div className="cb-mobile-handle" />

          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-header-icon">⚖️</div>
              <div>
                <div className="cb-header-title">
                  {lang === "kn" ? "AdvocateHub AI ಸಹಾಯಕ" : "AdvocateHub Legal AI"}
                </div>
                <div className="cb-header-sub">
                  <span className="cb-online-dot" />
                  <span>{lang === "kn" ? "ಸಕ್ರಿಯ · 24/7 ಕಾನೂನು ನೆರವು" : "Online · 24/7 Legal Help"}</span>
                </div>
              </div>
            </div>

            <div className="cb-header-actions">
              {/* Language Switcher */}
              <div className="cb-lang-toggle-wrap" title="Switch Language / ಭಾಷೆ ಬದಲಿಸಿ">
                <button
                  type="button"
                  className={`cb-lang-btn ${lang === "en" ? "active" : ""}`}
                  onClick={() => handleLangToggle("en")}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={`cb-lang-btn ${lang === "kn" ? "active" : ""}`}
                  onClick={() => handleLangToggle("kn")}
                >
                  ಕನ್ನಡ
                </button>
              </div>

              <button
                type="button"
                className="cb-header-btn"
                onClick={clearChat}
                title="Clear chat"
              >
                🗑
              </button>
              <button
                type="button"
                className="cb-header-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Action Chips (Horizontal scrollable on mobile) */}
          {messages.length <= 2 && (
            <div className="cb-quick-actions">
              <div className="cb-quick-label">
                {lang === "kn" ? "⚡ ತ್ವರಿತ ಕಾನೂನು ಸಲಹೆಗಳು:" : "⚡ Quick Legal Topics:"}
              </div>
              <div className="cb-quick-scroll">
                {quickActions.map((qa) => (
                  <button
                    key={qa.label}
                    type="button"
                    className="cb-quick-chip"
                    onClick={() => handleQuickAction(qa.msg)}
                  >
                    {qa.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="cb-messages" ref={messagesBoxRef}>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                onConsult={handleConsultAdvocate}
                onViewProfile={handleViewProfile}
                onNavigate={handleNavigate}
              />
            ))}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Floating Speech Error Toast (doesn't push texting pad down) */}
          {speechError && (
            <div className="cb-speech-error-toast" role="alert">
              <span>⚠️ {speechError}</span>
            </div>
          )}

          {/* Input Area (Texting pad stays strictly in place) */}
          <div className="cb-input-area">
            {/* Voice to text Mic button */}
            <button
              type="button"
              className={`cb-mic-btn ${isListening ? "listening" : ""}`}
              onClick={toggleListening}
              title={
                isListening
                  ? (lang === "kn" ? "ಧ್ವನಿ ನಿಲ್ಲಿಸಿ (ಕ್ಲಿಕ್ ಮಾಡಿ)" : "Stop listening (Tap to stop)")
                  : (lang === "kn" ? "ಧ್ವನಿ ಮೂಲಕ ಸಂದೇಶ ನೀಡಿ (ಕನ್ನಡ)" : "Voice to text (English / Kannada)")
              }
              disabled={loading}
              aria-label="Microphone Voice Input"
            >
              🎙️
            </button>

            <textarea
              ref={inputRef}
              className={`cb-input ${isListening ? "cb-input-listening" : ""}`}
              rows={1}
              placeholder={
                isListening
                  ? (lang === "kn" ? "🎙️ ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ..." : "🎙️ Listening... Speak naturally now...")
                  : (lang === "kn" ? "ಕಾನೂನು ಪ್ರಶ್ನೆ, ಸಮಸ್ಯೆ, ಅಥವಾ ವಕೀಲರ ಹೆಸರು ಕೇಳಿ..." : "Ask a legal question, situation, or advocate name...")
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />

            <button
              type="button"
              className="cb-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              title="Send message"
              aria-label="Send message"
            >
              {loading ? "⏳" : "➤"}
            </button>
          </div>

          {/* Footer */}
          <div className="cb-footer">
            ⚖️ AdvocateHub AI · {lang === "kn" ? "ಕನ್ನಡ & English ಬೆಂಬಲಿತ" : "Empathetic Legal Guidance & Verified Advocates"}
          </div>
        </div>
      )}
    </>
  );
}