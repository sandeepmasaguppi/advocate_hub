// ============================================================
//  Chatbot.js  —  AdvocateHub Professional AI Legal Assistant
//  Features:
//    • Draggable floating icon & draggable open chat window header
//      (with viewport bounds clamping & session persistence)
//    • Natural responses for greetings: Hi, Hello, Hey, Good morning, Thank you, Bye
//    • Friendly welcome message on first open
//    • Bilingual support: English & Kannada (ಕನ್ನಡ)
//    • Dual backend connect: Python Flask (port 5001) & Node /api/chat
//      with zero-downtime client-side fallback
//    • Mobile responsive bottom-sheet with safe scrolling
//    • Enter to send, Shift+Enter for new line
//    • Error, retry, and duplicate-prevention state handling
// ============================================================

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAdvocates } from "../data/Advocatesstore";
import defaultClarityData from "../data/clarityguide.json";
import { API_BASE } from "../data/api";
import "./Chatbot.css";

const WELCOME_EN =
  "Hello! 👋 Welcome to AdvocateHub. I’m here to help you find advocates, explore legal services, and navigate the platform. What can I assist you with today?";

const WELCOME_KN =
  "ಹಲೋ! 👋 AdvocateHub ಗೆ ಸ್ವಾಗತ. ವಕೀಲರನ್ನು ಹುಡುಕಲು, ಕಾನೂನು ಸೇವೆಗಳನ್ನು ಅನ್ವೇಷಿಸಲು ಮತ್ತು ವೇದಿಕೆಯನ್ನು ಬಳಸಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?";

const STORAGE_CHAT_KEY = "advocatehub_chat_messages";
const STORAGE_LANG_KEY = "advocatehub_chat_lang";
const STORAGE_FAB_KEY = "advocatehub_fab_pos";
const STORAGE_WIN_KEY = "advocatehub_win_pos";

const QUICK_ACTIONS_EN = [
  { label: "⚖️ Bail & Police FIR", msg: "How to apply for anticipatory bail?" },
  { label: "💳 Cheque Bounce (Sec 138)", msg: "What is the procedure for cheque bounce?" },
  { label: "🏠 Property Dispute", msg: "How to resolve land property disputes?" },
  { label: "👨‍👩‍👧 Divorce & Custody", msg: "What are the rules for mutual divorce?" },
  { label: "🚗 Accident & MACT", msg: "How to claim accident compensation?" },
  { label: "🔍 How to Find Advocates", msg: "How to find an advocate on AdvocateHub?" },
  { label: "💬 How to Request Consultation", msg: "How to request a consultation?" },
  { label: "📜 Bare Acts Library", msg: "Take me to Bare Acts" },
];

const QUICK_ACTIONS_KN = [
  { label: "⚖️ ಬೇಲ್ & ಎಫ್‌ಐಆರ್ ಸಲಹೆ", msg: "ನಿರೀಕ್ಷಣಾ ಜಾಮೀನು ಪಡೆಯುವುದು ಹೇಗೆ?" },
  { label: "💳 ಚೆಕ್ ಬೌನ್ಸ್ ನಿಯಮಗಳು", msg: "ಚೆಕ್ ಬೌನ್ಸ್ ಕೇಸ್ ಪ್ರಕ್ರಿಯೆ ಏನು?" },
  { label: "🏠 ಆಸ್ತಿ & ಜಮೀನು ವಿವಾದ", msg: "ಜಮೀನು ಆಸ್ತಿ ವಿವಾದ ಇತ್ಯರ್ಥ ಹೇಗೆ?" },
  { label: "👨‍👩‍👧 ವಿಚ್ಛೇದನ & ಜೀವನಾಂಶ", msg: "ಪರಸ್ಪರ ಒಪ್ಪಿಗೆಯ ವಿಚ್ಛೇದನ ನಿಯಮಗಳು" },
  { label: "🚗 ಅಪಘಾತ ಪರಿಹಾರ (MACT)", msg: "ವಾಹನ ಅಪಘಾತ ಪರಿಹಾರ ಕ್ಲೈಮ್ ಮಾಡುವುದು ಹೇಗೆ?" },
  { label: "🔍 ವಕೀಲರನ್ನು ಹುಡುಕುವುದು ಹೇಗೆ", msg: "ವಕೀಲರನ್ನು ಹುಡುಕುವುದು ಹೇಗೆ?" },
  { label: "📜 Bare Acts ಕಾಯ್ದೆಗಳು", msg: "Go to Bare Acts" },
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
//   HUMAN-LIKE CONVERSATIONAL LEGAL ENGINE (Robust Local Fallback)
// ══════════════════════════════════════════════════════════════
function generateHumanAdvice(msgText, currentLang, allAdvocates, clarityList) {
  const isKn = currentLang === "kn" || /[\u0C80-\u0CFF]/.test(msgText);
  const cleanQ = (msgText || "").toLowerCase().replace(/[^\w\s\u0C80-\u0CFF]/g, " ").replace(/\s+/g, " ").trim();

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

  // 1. Natural Greeting Intent Responses (Requested exact matches)
  if (["hi", "hii", "hi there", "hi bot", "hi!"].includes(cleanQ) || cleanQ.startsWith("hi ") || cleanQ.startsWith("hii ") || cleanQ === "ಹಾಯ್") {
    return {
      text: isKn ? "ಹಲೋ! 👋 ನಾನು ನಿಮಗೆ ಇಂದು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" : "Hello! 👋 How can I assist you today?",
      type: "text",
    };
  }

  if (["hello", "hello there", "hello advocatehub", "hello bot", "hello!", "helo"].includes(cleanQ) || cleanQ.startsWith("hello ") || cleanQ === "ಹಲೋ") {
    return {
      text: isKn ? "ಹಲೋ! AdvocateHub ಗೆ ಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" : "Hello! Welcome to AdvocateHub. How can I help you?",
      type: "text",
    };
  }

  if (["hey", "hey there", "heyy", "hey bot", "hey!"].includes(cleanQ) || cleanQ.startsWith("hey ") || cleanQ === "ಹೇ") {
    return {
      text: isKn ? "ಹೇ! 😊 ನಾನು ನಿಮಗೆ ಯಾವ ವಿಷಯದಲ್ಲಿ ಸಹಾಯ ಮಾಡಲಿ?" : "Hey there! 😊 What can I help you with?",
      type: "text",
    };
  }

  if (cleanQ.includes("good morning") || ["morning", "shubhodaya", "ಶುಭೋದಯ"].includes(cleanQ)) {
    return {
      text: isKn ? "ಶುಭೋದಯ! AdvocateHub ಗೆ ಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" : "Good morning! Welcome to AdvocateHub. How may I assist you?",
      type: "text",
    };
  }

  if (cleanQ.includes("good afternoon")) {
    return {
      text: isKn ? "ಶುಭ ಮಧ್ಯಾಹ್ನ! AdvocateHub ಗೆ ಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" : "Good afternoon! Welcome to AdvocateHub. How may I assist you?",
      type: "text",
    };
  }

  if (cleanQ.includes("good evening") || ["shubha sanje", "ಶುಭ ಸಂಜೆ"].includes(cleanQ)) {
    return {
      text: isKn ? "ಶುಭ ಸಂಜೆ! AdvocateHub ಗೆ ಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" : "Good evening! Welcome to AdvocateHub. How may I assist you?",
      type: "text",
    };
  }

  if (/\b(thanks|thank\s*you|thx|appreciate\s*it|thank\s*u|dhanyavad|dhanyavadagalu)\b/i.test(cleanQ) || /(ಧನ್ಯವಾದ|ಧನ್ಯವಾದಗಳು|ತುಂಬಾ ಧನ್ಯವಾದ)/u.test(msgText)) {
    return {
      text: isKn ? "ನಿಮಗೆ ಸ್ವಾಗತ! 😊 ಸಹಾಯ ಮಾಡಲು ನನಗೆ ಸಂತೋಷವಾಗಿದೆ." : "You’re welcome! 😊 I’m happy to help.",
      type: "text",
    };
  }

  if (/\b(bye|goodbye|bye\s*bye|see\s*you|cya)\b/i.test(cleanQ) || /(ವಿದಾಯ)/u.test(msgText)) {
    return {
      text: isKn ? "ವಿದಾಯ! ನಿಮ್ಮ ದಿನ ಶುಭವಾಗಿರಲಿ. ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ನಮ್ಮೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಲು ಮುಕ್ತವಾಗಿರಿ." : "Goodbye! Have a great day. Feel free to chat with us anytime.",
      type: "text",
    };
  }

  // 2. AdvocateHub Platform Guidance
  if (/\b(how\s*to\s*find\s*(an\s*)?advocate|how\s*to\s*find\s*(a\s*)?lawyer|find\s*(an\s*)?advocate|search\s*advocate)\b/i.test(cleanQ)) {
    return {
      text: isKn
        ? "🔍 **ವಕೀಲರನ್ನು ಹುಡುಕುವುದು ಹೇಗೆ:**\n\n1. **ಹೆಸರು ಅಥವಾ ಊರಿನ ಮೂಲಕ ಹುಡುಕಿ:** ವಕೀಲರ ಹೆಸರು (ಉದಾ: Adv. Chetan V Chandaragi) ಅಥವಾ ಊರು (ಉದಾ: Gokak, Belagavi, Bengaluru) ಟೈಪ್ ಮಾಡಿ.\n2. **ವಿಭಾಗದ ಪ್ರಕಾರ ಹುಡುಕಿ:** ಕ್ರಿಮಿನಲ್, ಸಿವಿಲ್, ಆಸ್ತಿ, ಅಥವಾ ಕೌಟುಂಬಿಕ ಕಾನೂನು ಎಂದು ಕೇಳಿ.\n3. **ವಕೀಲರ ಪಟ್ಟಿ:** ಮೇಲಿನ ಮೆನುವಿನಲ್ಲಿರುವ **'Find Lawyer'** ಕ್ಲಿಕ್ ಮಾಡಿ ಎಲ್ಲಾ ಪರಿಶೀಲಿತ ವಕೀಲರನ್ನು ನೋಡಿ."
        : "🔍 **How to Find an Advocate on AdvocateHub:**\n\n1. **Search by Name or City:** Type any advocate name (e.g. Adv. Chetan V Chandaragi) or city (e.g. Gokak, Belagavi, Bengaluru).\n2. **Search by Specialization:** Ask for specialists in Criminal Law, Family Law, Property Law, or Corporate Law.\n3. **Browse Directory:** Click **'Find Lawyer'** in the top navigation bar to explore our complete directory of verified advocates.",
      type: "text",
      navigate: "/find-lawyer",
    };
  }

  if (/\b(client\s*portal|client\s*dashboard)\b/i.test(cleanQ)) {
    return {
      text: "📱 **Client Portal & Dashboard:**\n\nIn the Client Portal, you can track active legal cases, communicate directly with your advocate via real-time WhatsApp-style chat, and view booking history. Access it anytime from the top navigation after logging in.",
      type: "text",
      navigate: "/client-dashboard",
    };
  }

  if (/\b(how\s*to\s*request\s*consultation|book\s*consultation|how\s*to\s*consult)\b/i.test(cleanQ)) {
    return {
      text: "💬 **How to Request a Consultation:**\n\n1. Open the **'Find Lawyer'** page or browse advocate profiles.\n2. Click the **'Chat Now'** or **'Book Consultation'** button on the advocate's card.\n3. Complete the quick consultation chit activation.\n4. Your private conversation will open immediately in the Client Portal for bi-directional real-time messaging!",
      type: "text",
      navigate: "/find-lawyer",
    };
  }

  if (/\b(advocate\s*dashboard|advocate\s*portal)\b/i.test(cleanQ)) {
    return {
      text: "⚖️ **Advocate Dashboard:**\n\nThe Advocate Dashboard allows advocates to review client intake requests, conduct real-time chats, update case stages, track consultation earnings, and view scheduled sessions. Access it via Advocate Login.",
      type: "text",
      navigate: "/advocate-dashboard",
    };
  }

  // 3. Match City / District
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

  // 4. Match Clarity Guide Situations
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
          ? `⚖️ **ಕಾನೂನು ಮಾರ್ಗದರ್ಶಿ (Clarity Guide):**\n\n📌 **ಪರಿಸ್ಥಿತಿ:** ${best.situationKn || best.situation}\n\n📜 **ಅನ್ವಯವಾಗುವ ಕಾಯ್ದೆ:** ${best.actLawKn || best.actLaw}\n\n👤 **ಆರೋಪಿ / ಎದುರು ಪಕ್ಷ:** ${best.accusedKn || best.accused}\n\n📝 **ಯಾರು ದೂರು ಸಲ್ಲಿಸಬಹುದು:** ${best.whoCanFileKn || best.whoCanFile}\n\n👨‍⚖️ **ಸಲಹೆ ಪಡೆಯಬೇಕಾದ ವಕೀಲರು:** ${best.advocateKn || best.advocate}\n\n💡 *ಸೂಚನೆ: ಇದು ಸಾಮಾನ್ಯ ಕಾನೂನು ಮಾಹಿತಿಯಾಗಿದೆ. ನಿಮ್ಮ ಪ್ರಕರಣಕ್ಕೆ ನಿರ್ದಿಷ್ಟ ಸಲಹೆಗಾಗಿ ಪರಿಶೀಲಿತ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ.*`
          : `⚖️ **Legal Clarity Guide:**\n\n📌 **Situation:** ${best.situation}\n\n📜 **Applicable Law:** ${best.actLaw}\n\n👤 **Responsible Party / Accused:** ${best.accused}\n\n📝 **Who Can File:** ${best.whoCanFile}\n\n👨‍⚖️ **Recommended Advocate:** ${best.advocate}\n\n💡 *Note: AdvocateHub provides general legal information. For advice specific to your case facts, please consult a qualified advocate.*`,
        type: "advocates",
        advocates: topAdvs.map(formatAdv),
      };
    }
  }

  // 5. Default General Legal Help
  return {
    text: isKn
      ? `💡 **ಕಾನೂನು ಸಲಹೆ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ:**\n\nನಾನು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬಲ್ಲೆ. ಸೂಕ್ತ ಕಾನೂನು ಪರಿಹಾರಕ್ಕಾಗಿ:\n1. 🔍 **ವಿವರಗಳನ್ನು ಸ್ಪಷ್ಟಪಡಿಸಿ:** ಬೇಲ್ ಅರ್ಜಿ, ಚೆಕ್ ಬೌನ್ಸ್, ಆಸ್ತಿ ವಿವಾದ, ಅಥವಾ ವಿಚ್ಛೇದನ ಬಗ್ಗೆ ಕೇಳಿ.\n2. 📍 **ಊರಿನ ಹೆಸರು ತಿಳಿಸಿ:** ಉದಾ: Gokak, Bengaluru ಎಂದು ನಮೂದಿಸಿ ಸ್ಥಳೀಯ ವಕೀಲರನ್ನು ಹುಡುಕಿ.\n3. 👨‍⚖️ **ವಕೀಲರ ನೇರ ಸಮಾಲೋಚನೆ:** ಕೆಳಗಿರುವ ಪರಿಶೀಲಿತ ವಕೀಲರೊಂದಿಗೆ ನೇರ ಚಾಟ್ ಆರಂಭಿಸಿ!\n\n💡 *ಸೂಚನೆ: ಇದು ಸಾಮಾನ್ಯ ಕಾನೂನು ಮಾಹಿತಿಯಾಗಿದೆ. ನಿಮ್ಮ ಪ್ರಕರಣಕ್ಕೆ ನಿರ್ದಿಷ್ಟ ಸಲಹೆಗಾಗಿ ಪರಿಶೀಲಿತ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ.*`
      : `💡 **Legal Advice & Suggested Next Steps:**\n\nI understand navigating legal matters requires clarity. Here is how to proceed:\n1. 🔍 **Specify your matter:** Type the issue you are facing (e.g. 'anticipatory bail', 'cheque bounce notice', 'property dispute', 'mutual divorce').\n2. 📍 **Search by City:** Mention your city (e.g. 'Gokak', 'Bengaluru', 'Belagavi') to see local advocates.\n3. 👨‍⚖️ **Consult Directly:** Start a confidential direct consultation chat with our verified advocates below.\n\n💡 *Note: AdvocateHub provides general legal information. For advice specific to your case facts, please consult a qualified advocate.*`,
    type: "advocates",
    advocates: topAdvs.map(formatAdv),
  };
}

// ══════════════════════════════════════════════════════════════
//   MAIN CHATBOT COMPONENT
// ══════════════════════════════════════════════════════════════
export default function Chatbot() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  // Language state
  const [lang, setLang] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_LANG_KEY) || "en";
    } catch {
      return "en";
    }
  });

  // Preserve messages in state & sessionStorage across page changes
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_CHAT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });

  // Persist messages whenever updated
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  // FAB Drag coordinates
  const [fabPos, setFabPos] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.innerWidth > 768) {
        const saved = sessionStorage.getItem(STORAGE_FAB_KEY) || localStorage.getItem(STORAGE_FAB_KEY);
        if (saved) {
          const p = JSON.parse(saved);
          if (typeof p.x === "number" && typeof p.y === "number") return p;
        }
      }
    } catch {}
    return null;
  });

  // Window Drag coordinates (Desktop header drag)
  const [winPos, setWinPos] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.innerWidth > 768) {
        const saved = sessionStorage.getItem(STORAGE_WIN_KEY);
        if (saved) {
          const p = JSON.parse(saved);
          if (typeof p.x === "number" && typeof p.y === "number") return p;
        }
      }
    } catch {}
    return null;
  });

  const [isFabDragging, setIsFabDragging] = useState(false);
  const [isWinDragging, setIsWinDragging] = useState(false);

  // Speech to Text (Buffer speech; auto-convert 3s after silence; don't continuously update input while speaking)
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [silenceSecondsLeft, setSilenceSecondsLeft] = useState(null);
  const [voiceConverting, setVoiceConverting] = useState(false);

  const bottomRef = useRef(null);
  const messagesBoxRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const textBeforeVoiceRef = useRef("");
  const voiceTranscriptRef = useRef("");
  const silenceTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Refs for dragging
  const fabDragRef = useRef({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
    moved: false,
    isDown: false,
    pointerId: null,
  });

  const winDragRef = useRef({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
    moved: false,
    isDown: false,
    pointerId: null,
  });

  // Clamp helper for FAB
  const clampFabPos = useCallback((x, y) => {
    const w = typeof window !== "undefined" ? window.innerWidth : 360;
    const h = typeof window !== "undefined" ? window.innerHeight : 640;
    const btnSize = 60;
    const pad = 12;
    return {
      x: Math.min(Math.max(pad, x), Math.max(pad, w - btnSize - pad)),
      y: Math.min(Math.max(pad, y), Math.max(pad, h - btnSize - pad)),
    };
  }, []);

  // Clamp helper for Window
  const clampWinPos = useCallback((x, y) => {
    const w = typeof window !== "undefined" ? window.innerWidth : 360;
    const h = typeof window !== "undefined" ? window.innerHeight : 640;
    const winWidth = 390;
    const winHeight = 610;
    const pad = 10;
    return {
      x: Math.min(Math.max(pad, x), Math.max(pad, w - winWidth - pad)),
      y: Math.min(Math.max(pad, y), Math.max(pad, h - winHeight - pad)),
    };
  }, []);

  // Resize handler to keep window & FAB in bounds
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w <= 768) {
        setFabPos(null);
        setWinPos(null);
      } else {
        setFabPos(prev => (prev ? clampFabPos(prev.x, prev.y) : null));
        setWinPos(prev => (prev ? clampWinPos(prev.x, prev.y) : null));
      }
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [clampFabPos, clampWinPos]);

  // Display friendly welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = {
        id: Date.now(),
        role: "bot",
        text: lang === "kn" ? WELCOME_KN : WELCOME_EN,
        type: "text",
      };
      setMessages([welcome]);
      setUnread(0);
      if (typeof window !== "undefined" && window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 120);
      }
    }
    if (isOpen) setUnread(0);
  }, [isOpen, messages.length, lang]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTo({
        top: messagesBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // ── FAB Drag Handlers ─────────────────────────────────────────
  const lastToggleRef = useRef(0);
  const toggleChatWindow = useCallback(() => {
    const now = Date.now();
    if (now - lastToggleRef.current < 250) return;
    lastToggleRef.current = now;
    setIsOpen((prev) => !prev);
  }, []);

  const handleFabPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const curX = fabPos && typeof fabPos.x === "number" ? fabPos.x : rect.left;
    const curY = fabPos && typeof fabPos.y === "number" ? fabPos.y : rect.top;
    fabDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: curX,
      initY: curY,
      moved: false,
      isDown: true,
      pointerId: e.pointerId,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleFabPointerMove = (e) => {
    if (!fabDragRef.current.isDown) return;
    const dx = e.clientX - fabDragRef.current.startX;
    const dy = e.clientY - fabDragRef.current.startY;
    if (!fabDragRef.current.moved && Math.hypot(dx, dy) > 8) {
      fabDragRef.current.moved = true;
      setIsFabDragging(true);
    }
    if (fabDragRef.current.moved) {
      setFabPos(clampFabPos(fabDragRef.current.initX + dx, fabDragRef.current.initY + dy));
    }
  };

  const handleFabPointerUp = (e) => {
    if (!fabDragRef.current.isDown) return;
    try {
      e.currentTarget.releasePointerCapture(fabDragRef.current.pointerId);
    } catch {}
    const wasMoved = fabDragRef.current.moved;
    fabDragRef.current.isDown = false;
    setIsFabDragging(false);

    if (wasMoved) {
      if (typeof window !== "undefined" && window.innerWidth > 768 && fabPos) {
        try {
          sessionStorage.setItem(STORAGE_FAB_KEY, JSON.stringify(fabPos));
        } catch {}
      }
    } else {
      toggleChatWindow();
    }
  };

  const handleFabPointerCancel = () => {
    fabDragRef.current.isDown = false;
    setIsFabDragging(false);
  };

  // ── Chat Window Header Drag Handlers (Desktop header drag) ────
  const handleWinHeaderPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    // Don't drag if user clicked buttons, links, or inputs in the header
    if (e.target.closest("button, a, input, select")) return;
    if (typeof window !== "undefined" && window.innerWidth <= 768) return; // Native bottom-sheet on mobile

    const winEl = e.currentTarget.closest(".cb-window");
    if (!winEl) return;
    const rect = winEl.getBoundingClientRect();
    const curX = winPos && typeof winPos.x === "number" ? winPos.x : rect.left;
    const curY = winPos && typeof winPos.y === "number" ? winPos.y : rect.top;

    winDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: curX,
      initY: curY,
      moved: false,
      isDown: true,
      pointerId: e.pointerId,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleWinHeaderPointerMove = (e) => {
    if (!winDragRef.current.isDown) return;
    const dx = e.clientX - winDragRef.current.startX;
    const dy = e.clientY - winDragRef.current.startY;
    if (!winDragRef.current.moved && Math.hypot(dx, dy) > 6) {
      winDragRef.current.moved = true;
      setIsWinDragging(true);
    }
    if (winDragRef.current.moved) {
      setWinPos(clampWinPos(winDragRef.current.initX + dx, winDragRef.current.initY + dy));
    }
  };

  const handleWinHeaderPointerUp = (e) => {
    if (!winDragRef.current.isDown) return;
    try {
      e.currentTarget.releasePointerCapture(winDragRef.current.pointerId);
    } catch {}
    const wasMoved = winDragRef.current.moved;
    winDragRef.current.isDown = false;
    setIsWinDragging(false);

    if (wasMoved && winPos) {
      try {
        sessionStorage.setItem(STORAGE_WIN_KEY, JSON.stringify(winPos));
      } catch {}
    }
  };

  const handleWinHeaderPointerCancel = () => {
    winDragRef.current.isDown = false;
    setIsWinDragging(false);
  };

  // ── Language Toggle Handler ──────────────────────────────────
  const handleLangToggle = (newLang) => {
    if (newLang === lang) return;
    setLang(newLang);
    try {
      sessionStorage.setItem(STORAGE_LANG_KEY, newLang);
    } catch {}
    if (messages.length <= 1) {
      setMessages([
        {
          id: Date.now(),
          role: "bot",
          text: newLang === "kn" ? WELCOME_KN : WELCOME_EN,
          type: "text",
        },
      ]);
    }
  };

  // ── Reset/Clear Chat Conversation ────────────────────────────
  const clearChat = () => {
    const welcome = {
      id: Date.now(),
      role: "bot",
      text: lang === "kn" ? WELCOME_KN : WELCOME_EN,
      type: "text",
    };
    setMessages([welcome]);
    setLastFailedMessage(null);
    try {
      sessionStorage.removeItem(STORAGE_CHAT_KEY);
    } catch {}
  };

  // ── Voice to Text Recognition (Auto-converts 3s after user stops talking) ──
  const finalizeVoiceInput = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setSilenceSecondsLeft(null);

    const recognized = (voiceTranscriptRef.current || "").trim();
    if (recognized) {
      const base = textBeforeVoiceRef.current || "";
      const combined = base ? `${base} ${recognized}` : recognized;
      setInput(combined);
      setVoiceConverting(true);
      setTimeout(() => setVoiceConverting(false), 2000);
    }
    voiceTranscriptRef.current = "";

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const stopListening = useCallback(() => {
    finalizeVoiceInput();
  }, [finalizeVoiceInput]);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        lang === "kn"
          ? "ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. Google Chrome ಬಳಸಿ."
          : "Voice recognition is not supported in this browser. Please use Google Chrome or Edge."
      );
      setTimeout(() => setSpeechError(""), 4500);
      return;
    }

    try {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setSilenceSecondsLeft(null);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.abort();
        } catch {}
        recognitionRef.current = null;
      }

      textBeforeVoiceRef.current = input.trim();
      voiceTranscriptRef.current = "";

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = lang === "kn" ? "kn-IN" : "en-IN";

      rec.onstart = () => {
        setIsListening(true);
        setSpeechError("");
        setVoiceConverting(false);
        setSilenceSecondsLeft(null);
      };

      const resetSilenceTimer = () => {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }

        setSilenceSecondsLeft(3);
        let secondsRemaining = 3;

        countdownIntervalRef.current = setInterval(() => {
          secondsRemaining -= 1;
          if (secondsRemaining > 0) {
            setSilenceSecondsLeft(secondsRemaining);
          } else {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
          }
        }, 1000);

        // Exactly 3 seconds after speech stops -> convert voice to text
        silenceTimerRef.current = setTimeout(() => {
          finalizeVoiceInput();
        }, 3000);
      };

      rec.onresult = (event) => {
        let finalStr = "";
        let interimStr = "";
        for (let i = 0; i < event.results.length; i++) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalStr += piece + " ";
          else interimStr += piece;
        }
        const accumulated = (finalStr + interimStr).trim();
        if (accumulated) {
          voiceTranscriptRef.current = accumulated;
          // As requested by user:
          // "please dont continues showing"
          // We buffer the transcript and reset the 3-second timer. Input is NOT continuously flashed while talking!
          resetSilenceTimer();
        }
      };

      rec.onspeechend = () => {
        // Speech ended in browser: ensure 3-second timer is ticking down
        resetSilenceTimer();
      };

      rec.onerror = (event) => {
        if (event.error !== "no-speech") {
          setIsListening(false);
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          setSilenceSecondsLeft(null);
          setSpeechError(
            lang === "kn" ? "ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿ ಪರಿಶೀಲಿಸಿ." : `Microphone error: ${event.error}`
          );
          setTimeout(() => setSpeechError(""), 4000);
        }
      };

      rec.onend = () => {
        if (silenceTimerRef.current) {
          // Timer is still running, let it convert when 3 seconds finish
        } else if (voiceTranscriptRef.current) {
          finalizeVoiceInput();
        } else {
          setIsListening(false);
          setSilenceSecondsLeft(null);
        }
      };

      rec.start();
      recognitionRef.current = rec;
    } catch (err) {
      setIsListening(false);
      setSilenceSecondsLeft(null);
    }
  };

  const toggleListening = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isListening) stopListening();
    else startListening();
  };

  // Ensure voice timers are cleaned up on unmount
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // ── Send Message Core Engine ─────────────────────────────────
  const sendMessage = async (textToSend) => {
    // If voice recognition is active, finalize buffered transcript first
    if (isListening && voiceTranscriptRef.current) {
      finalizeVoiceInput();
    }
    const msg = (textToSend || input).trim();
    if (!msg || loading) return;

    // Disconnect voice if active
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setSilenceSecondsLeft(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.abort();
      } catch {}
    }
    setIsListening(false);
    textBeforeVoiceRef.current = "";
    voiceTranscriptRef.current = "";

    const userMsg = { id: Date.now(), role: "user", text: msg, type: "text" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setLastFailedMessage(null);

    try {
      let data = null;

      // 1. Try Flask endpoint directly if on localhost (port 5001)
      if (
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ) {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 2000);
          const flaskRes = await fetch("http://localhost:5001/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg, lang }),
            signal: controller.signal,
          });
          clearTimeout(timer);
          if (flaskRes.ok) {
            data = await flaskRes.json();
          }
        } catch {}
      }

      // 2. Try Node Backend /api/chat (works in dev and production Railway)
      if (!data) {
        try {
          const targetUrl = `${API_BASE || ""}/api/chat`;
          const nodeRes = await fetch(targetUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg, lang }),
          });
          if (nodeRes.ok) {
            data = await nodeRes.json();
          } else if (nodeRes.status === 429) {
            const errData = await nodeRes.json().catch(() => ({}));
            data = {
              text: `${errData.error || "Too Many Requests 🚨"}\n\n${errData.message || "Please slow down and try again shortly."}`,
              type: "text",
            };
          }
        } catch {}
      }

      // 3. Fallback to intelligent local legal engine if server is unreachable
      if (!data || !data.text) {
        const localAdvocates = getAdvocates() || [];
        data = generateHumanAdvice(msg, lang, localAdvocates, defaultClarityData);
      }

      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: data.text || "",
        type: data.type || "text",
        advocates: data.advocates || null,
        navigate: data.navigate || null,
        profileId: data.profileId || null,
      };
      setMessages((prev) => [...prev, botMsg]);

      // Handle auto-navigation if route returned
      if (data.type === "navigate" && data.navigate) {
        setTimeout(() => {
          navigate(data.navigate);
        }, 1200);
      }
    } catch (err) {
      console.error("Chatbot processing error:", err);
      setLastFailedMessage(msg);
    } finally {
      setLoading(false);
      if (typeof window !== "undefined" && window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 80);
      }
    }
  };

  // Keyboard navigation: Enter sends, Shift+Enter newlines
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading) {
        sendMessage();
      }
    }
  };

  // Quick Action Selection
  const handleQuickAction = (actionMsg) => {
    sendMessage(actionMsg);
  };

  // Navigation from bot card
  const handleNavigate = (path) => {
    navigate(path);
  };

  // Consult advocate action: opens Client Dashboard chat with selected advocate
  const handleConsultAdvocate = (adv) => {
    if (!adv || !adv.id) return;
    const clientId = Number(
      localStorage.getItem("law4u_client_id") ||
      sessionStorage.getItem("law4u_client_id") ||
      0
    );

    if (clientId > 0) {
      try {
        sessionStorage.setItem(`law4u_active_chat_${clientId}`, String(adv.id));
        localStorage.setItem(`law4u_active_chat_${clientId}`, String(adv.id));
      } catch {}
      navigate(`/client-dashboard?advocateId=${adv.id}`);
    } else {
      try {
        sessionStorage.setItem("law4u_pending_consult_advocate", JSON.stringify(adv));
      } catch {}
      navigate("/client-login?redirect=consult");
    }
  };

  // View advocate profile
  const handleViewProfile = (adv) => {
    if (!adv || !adv.id) return;
    navigate(`/profile/${adv.id}`);
  };

  const quickActions = lang === "kn" ? QUICK_ACTIONS_KN : QUICK_ACTIONS_EN;

  // Custom positioning styles
  const fabStyle =
    fabPos && typeof fabPos.x === "number" && typeof fabPos.y === "number"
      ? { left: `${fabPos.x}px`, top: `${fabPos.y}px`, bottom: "auto", right: "auto" }
      : undefined;

  const winStyle =
    winPos && typeof winPos.x === "number" && typeof winPos.y === "number"
      ? { left: `${winPos.x}px`, top: `${winPos.y}px`, bottom: "auto", right: "auto" }
      : undefined;

  return (
    <>
      {/* ── Mobile Backdrop (Smooth dismiss on mobile tap outside) ── */}
      {isOpen && (
        <div
          className="cb-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Draggable Floating Action Button ── */}
      <button
        type="button"
        className={`cb-fab ${isOpen ? "cb-fab-open" : ""} ${isFabDragging ? "cb-fab-dragging" : ""}`}
        style={fabStyle}
        onPointerDown={handleFabPointerDown}
        onPointerMove={handleFabPointerMove}
        onPointerUp={handleFabPointerUp}
        onPointerCancel={handleFabPointerCancel}
        title="Chat with AdvocateHub AI · Drag to reposition"
        aria-label="Toggle AdvocateHub AI Chatbot"
      >
        <span className="cb-fab-icon">{isOpen ? "✕" : "⚖️"}</span>
        {!isOpen && unread > 0 && <span className="cb-fab-badge">{unread}</span>}
        {!isOpen && !isFabDragging && (
          <span className="cb-fab-label">
            {lang === "kn" ? "ಏನಾದರೂ ಕೇಳಿ (AI Chat)" : "Ask AdvocateHub AI"}
          </span>
        )}
      </button>

      {/* ── Floating Chat Window ── */}
      {isOpen && (
        <div
          className={`cb-window ${isWinDragging ? "cb-window-dragging" : ""}`}
          style={winStyle}
          role="dialog"
          aria-label="AdvocateHub AI Chatbot"
        >
          {/* Mobile Handle Indicator */}
          <div className="cb-mobile-handle" />

          {/* Draggable Header */}
          <div
            className="cb-header"
            onPointerDown={handleWinHeaderPointerDown}
            onPointerMove={handleWinHeaderPointerMove}
            onPointerUp={handleWinHeaderPointerUp}
            onPointerCancel={handleWinHeaderPointerCancel}
            title="Drag header to move chat window"
          >
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

              {/* Clear Chat */}
              <button
                type="button"
                className="cb-header-btn"
                onClick={clearChat}
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                🗑
              </button>

              {/* Close Window */}
              <button
                type="button"
                className="cb-header-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat window"
                aria-label="Close chat window"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Action Chips (Shown when conversation is fresh) */}
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

          {/* Message History */}
          <div className="cb-messages" ref={messagesBoxRef} role="log" aria-live="polite">
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

          {/* Floating Speech Error Toast */}
          {speechError && (
            <div className="cb-speech-error-toast" role="alert">
              <span>⚠️ {speechError}</span>
            </div>
          )}

          {/* Failed Message Retry Banner */}
          {lastFailedMessage && (
            <div className="cb-error-banner" role="alert">
              <span>Could not deliver message. Check connection.</span>
              <button
                type="button"
                className="cb-retry-btn"
                onClick={() => sendMessage(lastFailedMessage)}
              >
                ↻ Retry
              </button>
            </div>
          )}

          {/* Voice Active In-place Indicator (When user speaks, 3s countdown after silence) */}
          {isListening && (
            <div className="cb-voice-banner">
              <div className="cb-voice-banner-left">
                <span className="cb-voice-pulse-dot" />
                <span className="cb-voice-status-text">
                  {silenceSecondsLeft !== null
                    ? (lang === "kn"
                        ? `🎙️ ಮಾತನಾಡುವುದು ನಿಂತಿದೆ — ${silenceSecondsLeft} ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಪಠ್ಯವಾಗುತ್ತದೆ...`
                        : `🎙️ Speech paused — converting to text in ${silenceSecondsLeft}s...`)
                    : (lang === "kn"
                        ? "🎙️ ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ (ನಿಲ್ಲಿಸಿದ 3 ಸೆಕೆಂಡ್ ನಂತರ ಪಠ್ಯವಾಗುತ್ತದೆ)"
                        : "🎙️ Listening... Speak naturally (converts 3s after you stop talking)")}
                </span>
              </div>
              <button
                type="button"
                className="cb-voice-banner-convert-btn"
                onClick={stopListening}
                title="Convert voice to text right now"
              >
                {lang === "kn" ? "ಈಗಲೇ ಪರಿವರ್ತಿಸಿ ✓" : "Convert Now ✓"}
              </button>
            </div>
          )}

          {/* Input Area */}
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
              enterKeyHint="send"
              placeholder={
                isListening
                  ? (silenceSecondsLeft !== null
                      ? (lang === "kn" ? `🎙️ ಧ್ವನಿ ಪರಿವರ್ತನೆ ${silenceSecondsLeft} ಸೆಕೆಂಡುಗಳಲ್ಲಿ...` : `🎙️ Converting voice in ${silenceSecondsLeft}s...`)
                      : (lang === "kn" ? "🎙️ ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ..." : "🎙️ Listening... Speak naturally now..."))
                  : voiceConverting
                    ? (lang === "kn" ? "✓ ಧ್ವನಿ ಪಠ್ಯವಾಗಿ ಪರಿವರ್ತಿಸಲಾಗಿದೆ!" : "✓ Voice converted to text!")
                    : (lang === "kn" ? "ಕಾನೂನು ಪ್ರಶ್ನೆ, ಸಮಸ್ಯೆ, ಅಥವಾ ವಕೀಲರ ಹೆಸರು ಕೇಳಿ..." : "Ask a legal question, situation, or advocate name...")
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              aria-label="Message Input"
            />

            <button
              type="button"
              className="cb-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              title="Send message (Enter)"
              aria-label="Send message"
            >
              {loading ? "⏳" : "➤"}
            </button>
          </div>

          {/* Footer Branding */}
          <div className="cb-footer">
            ⚖️ AdvocateHub AI · {lang === "kn" ? "ಕನ್ನಡ & English ಬೆಂಬಲಿತ" : "Empathetic Legal Guidance & Verified Advocates"}
          </div>
        </div>
      )}
    </>
  );
}