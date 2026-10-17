// ============================================================
//   AdvocateDashboard.js  —  Advocate Hub Advocate Account Page
// ============================================================

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./AdvocateDashboard.css";
import { getAdvocateById, logoutAdvocate, updateAdvocate } from "../data/Advocatesstore";
import BrandLogo from "../components/BrandLogo";
import { api, assetUrl } from "../data/api";
import { getTheme, toggleTheme } from "../data/themeStore";


const SESSION_KEY  = "law4u_advocate_id";
const REQUESTS_KEY = "law4u_requests";
const EARNINGS_OVERRIDES_KEY = "law4u_earnings_overrides";
const ADVOCATE_SIDEBAR_KEY = "law4u_advocate_sidebar_open";

function loadAllRequests() {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllRequests(all) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(all));
}

function loadEarningsOverrides() {
  try {
    const raw = localStorage.getItem(EARNINGS_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveEarningsOverrides(all) {
  localStorage.setItem(EARNINGS_OVERRIDES_KEY, JSON.stringify(all));
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// Persisted boolean preference (sidebar expanded / collapsed)
function useStoredFlag(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === "1" || saved === "0") return saved === "1";
    } catch { /* storage unavailable */ }
    return initial;
  });
  useEffect(() => {
    try { localStorage.setItem(key, value ? "1" : "0"); } catch { /* ignore */ }
  }, [key, value]);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

// Profile fields the store defines that clients actually see; used for the completeness tile.
const PROFILE_FIELDS = [
  { key: "avatar",    label: "Profile photo" },
  { key: "bio",       label: "Bio" },
  { key: "barId",     label: "Bar Council ID" },
  { key: "court",     label: "Court" },
  { key: "languages", label: "Languages" },
];

// Clean SVG icons matching Admin Page rail design system
const NAV_ICONS = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  requests: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  ),
  chat: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  sessions: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  earnings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <path d="M7 15h2M12 15h5" />
    </svg>
  ),
  profile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" />
    </svg>
  ),
  sun: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  moon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
  bell: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

// `group` only affects the desktop sidebar headings; the mobile drawer ignores it.
const NAV_ITEMS = [
  { key: "dashboard",  label: "Dashboard",             group: "Work",    icon: NAV_ICONS.dashboard },
  { key: "requests",   label: "Client Requests",       group: "Work",    icon: NAV_ICONS.requests },
  { key: "chat",       label: "Clients",               group: "Work",    icon: NAV_ICONS.chat },
  { key: "sessions",   label: "Booked Consultations",  group: "Work",    icon: NAV_ICONS.sessions },
  { key: "earnings",   label: "Earnings",              group: "Work",    icon: NAV_ICONS.earnings },
  { key: "profile",    label: "My Profile",            group: "Account", icon: NAV_ICONS.profile },
];

const CLIENT_AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #1d4ed8, #2563eb)", // Blue
  "linear-gradient(135deg, #0f766e, #14b8a6)", // Teal
  "linear-gradient(135deg, #7c2d12, #ea580c)", // Amber / Orange
  "linear-gradient(135deg, #047857, #10b981)", // Emerald
  "linear-gradient(135deg, #581c87, #8b5cf6)", // Purple
  "linear-gradient(135deg, #831843, #ec4899)", // Pink
  "linear-gradient(135deg, #1e3a8a, #3b82f6)", // Indigo
  "linear-gradient(135deg, #0369a1, #0284c7)", // Sky
];

function getClientBgGradient(clientId, name = "") {
  let hash = 0;
  const str = String(name || clientId || "client");
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return CLIENT_AVATAR_GRADIENTS[Math.abs(hash) % CLIENT_AVATAR_GRADIENTS.length];
}

function playWhatsAppNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;
    
    // Tone 1: High crisp pop
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // Tone 2: Pleasant confirmation pop
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1320, now + 0.13);
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.24);
    gain2.gain.setValueAtTime(0.25, now + 0.13);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.13);
    osc2.stop(now + 0.32);
  } catch (e) {
    // Autoplay fallback
  }
}

function getClientInitials(name, clientId = null) {
  const clean = String(name || "").trim().replace(/^(adv|advocate|client)\.?\s+/i, "");
  if (!clean) {
    return clientId ? `C${clientId}` : "CL";
  }
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    // Name and surname initials (e.g. "Sanika Chandaragi" -> "SC", "Viday C" -> "VC", "Kareppa Patil" -> "KP", "SANDEEP REVAPPA MASAGUPPI" -> "SM")
    const firstInitial = parts[0][0].toUpperCase();
    const lastInitial = parts[parts.length - 1][0].toUpperCase();
    return `${firstInitial}${lastInitial}`;
  } else if (parts.length === 1) {
    const firstInitial = parts[0][0].toUpperCase();
    // If client ID number is present, show initial + number (e.g., "S1", "M3", "V4")
    if (clientId && !isNaN(Number(clientId))) {
      return `${firstInitial}${clientId}`;
    }
    // Otherwise show first two letters of single name
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "CL";
}

function getClientAvatar(clientIdOrObj, fallbackName = "", currentAdvocateId = null) {
  let cid = null;
  let name = fallbackName;
  let explicitAvatar = null;

  if (clientIdOrObj && typeof clientIdOrObj === "object") {
    cid = clientIdOrObj.clientId || clientIdOrObj.id;
    name = clientIdOrObj.clientName || clientIdOrObj.displayName || clientIdOrObj.name || fallbackName;
    explicitAvatar = clientIdOrObj.clientAvatar || clientIdOrObj.avatar || clientIdOrObj.photo;
  } else if (clientIdOrObj) {
    cid = Number(clientIdOrObj);
  }

  // 1. Explicit avatar provided directly on the object/request/conversation (ignore logo badges / signatures)
  if (explicitAvatar && typeof explicitAvatar === "string" && explicitAvatar.trim()) {
    const trimmed = explicitAvatar.trim();
    if (!/karna\.png|anand\.png|sankeerthana\.jpg|manish-mane\.jpg|kotresh\.png/i.test(trimmed)) {
      return trimmed;
    }
  }

  // 2. Client avatar saved in localStorage for this specific clientId
  if (cid) {
    try {
      const saved = localStorage.getItem(`law4u_client_avatar_${cid}`);
      if (saved && typeof saved === "string" && saved.trim()) return saved.trim();
    } catch {}
  }

  // 3. Current active client session in localStorage (if matching clientId or name)
  try {
    const rawClient = localStorage.getItem("law4u_client");
    if (rawClient) {
      const c = JSON.parse(rawClient);
      if (c && (Number(c.id) === Number(cid) || (c.name && name && c.name.toLowerCase() === name.toLowerCase()))) {
        if (c.avatar && !/karna\.png|anand\.png|sankeerthana\.jpg|manish-mane\.jpg|kotresh\.png/i.test(c.avatar)) {
          return c.avatar;
        }
      }
    }
  } catch {}

  // 4. Check if any message in the chat has an avatar attached
  if (cid && currentAdvocateId) {
    try {
      const msgsRaw = localStorage.getItem(`chat_${cid}_${currentAdvocateId}`);
      if (msgsRaw) {
        const msgs = JSON.parse(msgsRaw);
        const withAv = msgs.find(m => m && m.clientAvatar);
        if (withAv && withAv.clientAvatar) return withAv.clientAvatar;
      }
    } catch {}
  }

  // 5. Intelligent match to known verified client photo in /uploads (Sandeep)
  const n = (name || "").toLowerCase().trim();
  if (n.includes("sandeep")) return "/uploads/sandeep.jpeg";

  return null;
}

function ClientAvatarItem({ clientOrId, name, className = "ad-chat-item-avatar ad-wa-avatar", style = {}, advocateId }) {
  const avUrl = getClientAvatar(clientOrId, name, advocateId);
  const displayName = name || (clientOrId && typeof clientOrId === "object" ? (clientOrId.clientName || clientOrId.displayName || clientOrId.name) : "") || "Client";
  const cid = clientOrId && typeof clientOrId === "object" ? (clientOrId.clientId || clientOrId.id) : (clientOrId || null);
  const initials = getClientInitials(displayName, cid);
  const bgGradient = getClientBgGradient(cid, displayName);

  const [imgError, setImgError] = useState(false);
  const [altTried, setAltTried] = useState(false);

  useEffect(() => {
    setImgError(false);
    setAltTried(false);
  }, [avUrl]);

  const handleImgError = (e) => {
    const target = e.currentTarget;
    if (!altTried && avUrl && avUrl.startsWith("/uploads/") && !target.src.includes(":5000")) {
      setAltTried(true);
      target.src = `http://localhost:5000${avUrl}`;
      return;
    }
    setImgError(true);
  };

  const showImg = Boolean(avUrl) && !imgError;

  return (
    <div
      className={className}
      style={{
        background: showImg ? "transparent" : bgGradient,
        color: "#ffffff",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
      title={displayName}
    >
      {showImg ? (
        <img
          src={assetUrl(avUrl)}
          alt=""
          className="ad-client-avatar-img"
          onError={handleImgError}
        />
      ) : (
        <span className="ad-avatar-fallback">
          {initials}
        </span>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const MAP = {
    pending:  { label: "Pending",  bg: "#fef3c7", c: "#92400e" },
    accepted: { label: "Accepted", bg: "#dcfce7", c: "#14532d" },
    declined: { label: "Declined", bg: "#fee2e2", c: "#7f1d1d" },
    "accepted status": { label: "Accepted Status", bg: "#dcfce7", c: "#14532d" },
  };
  const s = MAP[status] || MAP.pending;
  return <span className="ad-status-badge" style={{ background: s.bg, color: s.c }}>{s.label}</span>;
}

function RequestCard({ req, onAccept, onDecline, onSaveStage, onOpenChat, advocateId }) {
  const [caseStage, setCaseStage] = useState(req.caseStage || "Start Case");
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  const handleSaveStage = () => {
    if (onSaveStage) onSaveStage(req.id, caseStage);
    setIsEditing(false);
    setShowSavedAlert(true);
    setTimeout(() => setShowSavedAlert(false), 3000);
  };

  return (
    <div className="ad-request-card">
      <div className="ad-request-top">
        <ClientAvatarItem
          clientOrId={req}
          name={req.clientName}
          advocateId={advocateId}
          className="ad-request-avatar"
        />
        <div className="ad-request-info">
          <div className="ad-request-name">{req.clientName}</div>
          <div className="ad-request-meta">
            {req.clientCity ? `📍 ${req.clientCity} · ` : ""}{formatDate(req.requestedAt)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {req.fee && <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>Fee: {req.fee}</span>}
          <StatusBadge status={req.status} />
        </div>
      </div>

      {(req.clientPhone || req.clientEmail) && (
        <div className="ad-request-contact" style={{ margin: "8px 0", display: "flex", gap: "12px", flexWrap: "wrap", fontSize: "13px" }}>
          {req.clientPhone && <span className="ad-request-contact-item">📱 {req.clientPhone}</span>}
          {req.clientEmail && <span className="ad-request-contact-item">✉️ {req.clientEmail}</span>}
        </div>
      )}

      {req.message && (
        <p className="ad-request-msg" style={{ background: "#f8fafc", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", marginTop: "6px" }}>
          <strong>Case Notes:</strong> {req.message}
        </p>
      )}

      <div className="ad-request-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
        {req.status === "pending" && (
          <>
            <button className="ad-btn-accept" onClick={() => onAccept(req.id)}>✓ Accept</button>
            <button className="ad-btn-decline" onClick={() => onDecline(req.id)}>✕ Decline</button>
          </>
        )}
        {onOpenChat && (
          <button
            type="button"
            className="ad-btn-accept"
            style={{ background: "#25d366", color: "#ffffff", border: "none" }}
            onClick={() => onOpenChat(req)}
          >Chat
          </button>
        )}
      </div>

      {req.status === "accepted" && (
        <div className="ad-case-stage" style={{ marginTop: "12px" }}>
          {!isEditing ? (
            <div className="ad-saved-indicator" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {showSavedAlert && (
                <div className="ad-alert-banner">
                  <span>Successfully saved status!</span>
                  <button onClick={() => setShowSavedAlert(false)} className="ad-alert-close">×</button>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span className={`ad-stage-pill ${(req.caseStage || caseStage).toLowerCase().replace(" ", "-")}`}>
                  ✓ Current Case Status: {req.caseStage || caseStage}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  style={{ background: "transparent", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "2px 8px", cursor: "pointer", fontSize: "12px", color: "#475569" }}
                >
                  ✎ Edit Status
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <select
                value={caseStage}
                onChange={(e) => setCaseStage(e.target.value)}
                style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px" }}
              >
                <option value="Start Case">Start Case</option>
                <option value="Evidence Gathering">Evidence Gathering</option>
                <option value="Court Hearing">Court Hearing</option>
                <option value="Verdict / Completed">Verdict / Completed</option>
              </select>
              <button
                type="button"
                onClick={handleSaveStage}
                style={{ background: "#2563eb", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => { setCaseStage(req.caseStage || "Start Case"); setIsEditing(false); }}
                style={{ background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Main Advocate dashboard component
export default function AdvocateDashboard() {
  // component state and memoized advocate record
  const navigate = useNavigate();
  const advocateId = Number(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || 0);
  const [advocateVersion, setAdvocateVersion] = useState(0);
  const advocate = useMemo(() => (advocateId && advocateVersion >= 0 ? getAdvocateById(advocateId) : null), [advocateId, advocateVersion]);

  // UI state used across the dashboard
  const [theme, setAdTheme] = useState(getTheme);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleTheme = (e) => {
      setAdTheme(e?.detail || getTheme());
    };
    window.addEventListener("law4u_theme_change", handleTheme);
    return () => window.removeEventListener("law4u_theme_change", handleTheme);
  }, []);

  const [ready] = useState(true);
  const [requests, setRequests] = useState([]);
  const [earningsOverrides, setEarningsOverrides] = useState({});
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [mobileChatActive, setMobileChatActive] = useState(false);
  const [convMessages, setConvMessages] = useState([]);
  const [convInput, setConvInput] = useState("");
  const [sessionsSearch, setSessionsSearch] = useState("");
  const [sessionsFilter, setSessionsFilter] = useState("all");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const fileInputRef = useRef(null);

  const EMOJI_LIST = ["😊", "👍", "⚖️", "📋", "📅", "📱", "✉️", "🙏", "💼", "📁", "📄", "✅", "🏛️", "🇮🇳", "🤝", "💡", "📞", "🔒", "⏱️", "⭐", "🎉", "🔥", "💯", "❌"];

  const handleInsertEmoji = (emoStr) => {
    setConvInput(prev => prev + emoStr);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const isImg = file.type.startsWith("image/");
    const formattedSize = file.size > 1024 * 1024 
      ? (file.size / (1024 * 1024)).toFixed(1) + " MB" 
      : Math.round(file.size / 1024) + " KB";

    const reader = new FileReader();
    reader.onload = (evt) => {
      setPendingAttachment({
        fileName: file.name,
        fileSize: formattedSize,
        fileType: file.type,
        dataUrl: evt.target.result,
        isImage: isImg
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const [chatSearchTerm, setChatSearchTerm] = useState("");
  const [chatFilter, setChatFilter] = useState("all");
  const [incomingToast, setIncomingToast] = useState(null);
  const [chatReadVersion, setChatReadVersion] = useState(0);
  const [editingMsgIndex, setEditingMsgIndex] = useState(null);
  const [editingMsgText, setEditingMsgText] = useState("");
  const [activeMenuMsgIndex, setActiveMenuMsgIndex] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  // Auto-dismiss WhatsApp incoming message toast after 6.5s
  useEffect(() => {
    if (!incomingToast) return;
    const timer = setTimeout(() => {
      setIncomingToast(null);
    }, 6500);
    return () => clearTimeout(timer);
  }, [incomingToast]);

  // Close chat message context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeMenuMsgIndex !== null && !e.target.closest(".ad-wa-msg-menu-wrap") && !e.target.closest(".ad-message-bubble")) {
        setActiveMenuMsgIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [activeMenuMsgIndex]);

  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [addClientForm, setAddClientForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    fee: "₹2,000",
    caseStage: "Start Case",
    notes: ""
  });
  const [addClientSuccessMsg, setAddClientSuccessMsg] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, toggleSidebar] = useStoredFlag(ADVOCATE_SIDEBAR_KEY, true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingEarningId, setEditingEarningId] = useState(null);
  const [editForm, setEditForm] = useState({ clientName: "", requestedAt: "", amount: "", paymentStatus: "Paid / Completed" });
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [profileForm, setProfileForm] = useState(null);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const activeConvRef = useRef(activeConv);
  const activeNavRef = useRef(activeNav);
  const advocateIdRef = useRef(advocateId);
  const lastAlertedTimeRef = useRef(0);
  const chatEndRef = useRef(null);

  useEffect(() => { activeConvRef.current = activeConv; }, [activeConv]);
  useEffect(() => { activeNavRef.current = activeNav; }, [activeNav]);
  useEffect(() => { advocateIdRef.current = advocateId; }, [advocateId]);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior, block: "nearest" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [convMessages.length, activeConv?.clientId, scrollToBottom]);

  // Initialize profile form when advocate loads or changes
  useEffect(() => {
    if (!advocate) return;
    setProfileForm({
      name: advocate.name || "",
      city: advocate.city || "",
      phone: advocate.phone || "",
      speciality: advocate.speciality || "",
      practiceArea: advocate.practiceArea || "",
      court: advocate.court || "",
      barCouncil: advocate.barCouncil || "",
      barId: advocate.barId || "",
      experience: advocate.experience || "",
      fee: advocate.fee || "",
      availability: advocate.availability || "",
      bio: advocate.bio || "",
      languages: Array.isArray(advocate.languages) ? advocate.languages.join(", ") : (advocate.languages || ""),
      avatarData: null,
    });
    setIsProfileEditing(false);
  }, [advocate]);

  useEffect(() => {
    const refreshFromCache = () => {
      setAdvocateVersion((v) => v + 1);
    };

    window.addEventListener("law4u_advocates_updated", refreshFromCache);
    return () => window.removeEventListener("law4u_advocates_updated", refreshFromCache);
  }, []);

  useEffect(() => {
    if (ready && advocate && advocate.status !== "approved") {
      logoutAdvocate();
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      navigate("/login");
    }
  }, [ready, advocate, navigate]);

  // Synchronously reload requests and earnings overrides
  const reloadRequestsAndEarnings = useCallback(() => {
    if (!advocateId) return;
    const all = loadAllRequests();
    const list = all[advocateId] || [];
    list.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
    setRequests(list);

    const allOverrides = loadEarningsOverrides();
    setEarningsOverrides(allOverrides[advocateId] || {});
  }, [advocateId]);

  // Master real-time scan: scans requests + all chat_{clientId}_{advocateId} keys and updates state synchronously
  const refreshConversationsAndRequests = useCallback(() => {
    if (!advocateId) return;
    reloadRequestsAndEarnings();

    const list = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || !k.startsWith("chat_")) continue;
        const parts = k.split("_");
        if (parts.length !== 3) continue;
        const clientId = Number(parts[1]);
        const advId = Number(parts[2]);
        if (advId !== Number(advocateId)) continue;
        const raw = localStorage.getItem(k);
        const msgs = raw ? JSON.parse(raw) : [];
        const last = msgs.length ? msgs[msgs.length - 1] : null;
        const clientName = msgs.find((m) => m && m.clientName)?.clientName || null;
        let adminReplyAt = null;
        for (let j = msgs.length - 1; j >= 0; j--) {
          if (msgs[j] && msgs[j].from === "admin") {
            adminReplyAt = msgs[j].t;
            break;
          }
        }
        list.push({ clientId, key: k, lastMsg: last, clientName: clientName || `Client ${clientId}`, adminReplyAt });
      }
    } catch (e) { /* ignore */ }

    const convCompare = (a, b) => {
      const aa = a.adminReplyAt ? new Date(a.adminReplyAt).getTime() : 0;
      const bb = b.adminReplyAt ? new Date(b.adminReplyAt).getTime() : 0;
      if (aa !== bb) return bb - aa;
      const ta = a.lastMsg ? new Date(a.lastMsg.t).getTime() : 0;
      const tb = b.lastMsg ? new Date(b.lastMsg.t).getTime() : 0;
      return tb - ta;
    };
    list.sort(convCompare);
    setConversations(list);
    setChatReadVersion((v) => v + 1);

    // If active conversation is currently open, reload its messages synchronously
    const curConv = activeConvRef.current;
    if (curConv && curConv.key) {
      try {
        const raw = localStorage.getItem(curConv.key);
        if (raw) {
          setConvMessages(JSON.parse(raw));
        }
      } catch (e) {}
    }
  }, [advocateId, reloadRequestsAndEarnings]);

  // Initial load on mount and window focus: sync with backend server messages.json
  useEffect(() => {
    if (!advocateId) return;
    refreshConversationsAndRequests();

    // Fetch full history from server
    api(`/api/messages?advocateId=${advocateId}`)
      .then((serverMsgs) => {
        if (Array.isArray(serverMsgs) && serverMsgs.length > 0) {
          const groups = {};
          for (const m of serverMsgs) {
            const k = m.key || `chat_${m.clientId}_${advocateId}`;
            if (!groups[k]) groups[k] = [];
            groups[k].push(m);
          }
          const allReqs = loadAllRequests();
          const advReqs = allReqs[advocateId] || [];

          for (const [k, msgs] of Object.entries(groups)) {
            localStorage.setItem(k, JSON.stringify(msgs));
            const last = msgs[msgs.length - 1];
            if (!advReqs.some((r) => String(r.clientId || r.id) === String(last.clientId))) {
              advReqs.unshift({
                id: last.clientId,
                clientId: last.clientId,
                clientName: last.clientName || `Client #${last.clientId}`,
                clientAvatar: last.clientAvatar || "",
                clientPhone: "",
                clientEmail: "",
                clientCity: "Online Client",
                requestedAt: last.t,
                message: last.text,
                lastMessage: last.text,
                status: "accepted",
                paymentStatus: "Paid / Completed",
                caseStage: "Start Case",
                fee: advocate?.fee || "₹2,000",
              });
            }
          }
          allReqs[advocateId] = advReqs;
          saveAllRequests(allReqs);
          refreshConversationsAndRequests();
        }
      })
      .catch(() => {});

    window.addEventListener("focus", refreshConversationsAndRequests);
    return () => window.removeEventListener("focus", refreshConversationsAndRequests);
  }, [advocateId, refreshConversationsAndRequests, advocate?.fee]);

  // Helper to determine unread messages in a conversation
  const getConvUnreadCount = useCallback((convKey, cid) => {
    // If advocate currently has this exact conversation open in the chat view, count as 0 unread
    if (activeNav === "chat" && activeConv && (String(activeConv.clientId) === String(cid) || activeConv.key === convKey)) {
      return 0;
    }
    try {
      const raw = localStorage.getItem(convKey);
      if (!raw) return 0;
      const msgs = JSON.parse(raw);
      if (!Array.isArray(msgs) || msgs.length === 0) return 0;

      const lastReadRaw = localStorage.getItem(`law4u_adv_${advocateId}_last_read_${cid}`);
      const lastReadTime = lastReadRaw ? new Date(lastReadRaw).getTime() : 0;

      let unread = 0;
      for (let i = msgs.length - 1; i >= 0; i--) {
        const m = msgs[i];
        if (!m) continue;
        if (m.from === "advocate" || m.from === "admin") {
          break; // Messages prior to advocate's response are treated as handled/read
        }
        if (m.from === "client") {
          const msgTime = m.t ? new Date(m.t).getTime() : 0;
          if (msgTime > lastReadTime) {
            unread++;
          }
        }
      }
      return unread;
    } catch {
      return 0;
    }
  }, [advocateId, activeNav, activeConv]);

  // Merge requests (client connection requests & paid bookings) with chat conversations
  const mergedConversations = useMemo(() => {
    const map = new Map();

    // 1. Process requests (requests created via booking/paying or sending connection requests)
    requests.forEach(req => {
      const cid = req.clientId || req.id;
      const key = `chat_${cid}_${advocateId}`;
      let msgs = [];
      try {
        const raw = localStorage.getItem(key);
        if (raw) msgs = JSON.parse(raw);
      } catch (e) { msgs = []; }

      const lastMsg = msgs.length ? msgs[msgs.length - 1] : (req.message ? { from: "client", text: req.message, t: req.requestedAt } : null);
      const isPaidBooked = req.paymentStatus === "Paid" || req.paymentStatus === "Paid / Completed" || req.isBooked || req.status === "accepted";

      map.set(key, {
        clientId: cid,
        key,
        clientName: req.clientName || `Client ${cid}`,
        clientAvatar: req.clientAvatar || req.avatar || req.photo || "",
        clientPhone: req.clientPhone || "",
        clientEmail: req.clientEmail || "",
        clientCity: req.clientCity || "",
        lastMsg,
        reqStatus: req.status,
        caseStage: req.caseStage || "Start Case",
        isPaidBooked,
        fee: req.fee || advocate?.fee || "₹2,000",
        requestedAt: req.requestedAt || (lastMsg ? lastMsg.t : new Date().toISOString())
      });
    });

    // 2. Include any other chat_ entries from localStorage
    conversations.forEach(conv => {
      if (!map.has(conv.key)) {
        let msgs = [];
        try {
          const raw = localStorage.getItem(conv.key);
          if (raw) msgs = JSON.parse(raw);
        } catch (e) { msgs = []; }
        const lastMsg = msgs.length ? msgs[msgs.length - 1] : conv.lastMsg;
        map.set(conv.key, {
          clientId: conv.clientId,
          key: conv.key,
          clientName: conv.clientName || `Client ${conv.clientId}`,
          clientAvatar: conv.clientAvatar || conv.avatar || conv.photo || "",
          clientPhone: "",
          clientEmail: "",
          clientCity: "",
          lastMsg,
          reqStatus: "accepted",
          caseStage: "Start Case",
          isPaidBooked: true,
          fee: advocate?.fee || "₹2,000",
          requestedAt: lastMsg ? lastMsg.t : new Date().toISOString()
        });
      }
    });

    const arr = Array.from(map.values());
    arr.sort((a, b) => {
      // Prioritize clients with unread messages at the very top of WhatsApp contacts list
      const unreadA = getConvUnreadCount(a.key, a.clientId) > 0 ? 1 : 0;
      const unreadB = getConvUnreadCount(b.key, b.clientId) > 0 ? 1 : 0;
      if (unreadA !== unreadB) {
        return unreadB - unreadA;
      }
      const ta = a.lastMsg ? new Date(a.lastMsg.t).getTime() : new Date(a.requestedAt).getTime();
      const tb = b.lastMsg ? new Date(b.lastMsg.t).getTime() : new Date(b.requestedAt).getTime();
      return tb - ta;
    });

    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests, conversations, advocateId, advocate?.fee, getConvUnreadCount, chatReadVersion]);

  // Open conversation and mark it as viewed/read
  const openConversation = useCallback((conv) => {
    if (!conv) return;
    setActiveConv(conv);
    setMobileChatActive(true);
    const raw = localStorage.getItem(conv.key);
    if (raw) {
      try { setConvMessages(JSON.parse(raw)); } catch {}
    } else {
      setConvMessages(conv.lastMsg ? [conv.lastMsg] : []);
    }
    setActiveNav("chat");
    if (advocateId && conv.clientId) {
      localStorage.setItem(`law4u_adv_${advocateId}_last_read_${conv.clientId}`, new Date().toISOString());
      setChatReadVersion(v => v + 1);

      // Fetch live conversation messages from backend messages.json
      api(`/api/messages?advocateId=${advocateId}&clientId=${conv.clientId}`)
        .then((serverMsgs) => {
          if (Array.isArray(serverMsgs) && serverMsgs.length > 0) {
            localStorage.setItem(conv.key, JSON.stringify(serverMsgs));
            setConvMessages(serverMsgs);
            scrollToBottom("smooth");
          }
        })
        .catch(() => {});
    }
  }, [advocateId, scrollToBottom]);

  // Auto-select first conversation on desktop when navigating to chat if none selected
  useEffect(() => {
    if (activeNav === "chat" && !activeConv && !mobileChatActive && mergedConversations.length > 0 && typeof window !== "undefined" && window.innerWidth >= 992) {
      openConversation(mergedConversations[0]);
    }
  }, [activeNav, activeConv, mobileChatActive, mergedConversations, openConversation]);

  // Open chat tab for a specific client record
  const openChatForClient = (req) => {
    const cid = req.clientId || req.id;
    const key = `chat_${cid}_${advocateId}`;
    const raw = localStorage.getItem(key);
    let msgs = raw ? JSON.parse(raw) : [];
    if (!raw && req.message) {
      msgs = [{ from: "client", text: req.message, t: req.requestedAt || new Date().toISOString(), clientName: req.clientName }];
      localStorage.setItem(key, JSON.stringify(msgs));
    }
    const convObj = {
      clientId: cid,
      key,
      clientName: req.clientName,
      clientPhone: req.clientPhone || "",
      clientEmail: req.clientEmail || "",
      clientCity: req.clientCity || "",
      reqStatus: req.status,
      caseStage: req.caseStage || "Start Case",
      isPaidBooked: req.paymentStatus === "Paid" || req.paymentStatus === "Paid / Completed" || req.isBooked || req.status === "accepted",
      fee: req.fee || advocate?.fee || "₹2,000",
      requestedAt: req.requestedAt
    };
    openConversation(convObj);
  };

  // Send message and sync with client requests store
  const handleSendChatMessage = (msgText) => {
    const textToSend = (msgText || convInput).trim();
    if (!textToSend && !pendingAttachment) return;
    if (!activeConv) return;
    const k = activeConv.key;
    const raw = localStorage.getItem(k);
    const msgs = raw ? JSON.parse(raw) : [];

    const newMsgObj = {
      from: "advocate",
      text: textToSend || (pendingAttachment ? `[Attachment: ${pendingAttachment.fileName}]` : ""),
      t: new Date().toISOString(),
      clientName: activeConv.clientName,
      attachment: pendingAttachment ? { ...pendingAttachment } : null,
      replyTo: replyingTo ? {
        text: replyingTo.text,
        sender: replyingTo.sender,
        from: replyingTo.from
      } : null
    };
    const next = [...msgs, newMsgObj];
    
    // Save chat conversation
    localStorage.setItem(k, JSON.stringify(next));
    setConvMessages(next);
    setConvInput("");
    setPendingAttachment(null);
    setShowEmojiPicker(false);
    setReplyingTo(null);

    // Persist advocate message to backend server messages.json
    api("/api/messages", {
      method: "POST",
      body: {
        clientId: activeConv.clientId,
        advocateId,
        key: k,
        from: "advocate",
        text: textToSend,
        attachment: pendingAttachment ? { ...pendingAttachment } : null,
        replyTo: newMsgObj.replyTo,
        clientName: activeConv.clientName || "",
        clientAvatar: activeConv.clientAvatar || "",
        advocateName: advocate?.name || "Advocate",
        advocateAvatar: advocate?.avatar || "",
        t: newMsgObj.t,
      },
    }).catch((err) => console.warn("Failed to persist advocate message to server:", err));

    // Automatically update or store client request record
    const allReqs = loadAllRequests();
    const advReqs = allReqs[advocateId] || [];
    const matchIdx = advReqs.findIndex(r => (r.clientId && r.clientId === activeConv.clientId) || r.id === activeConv.clientId || r.clientName === activeConv.clientName);
    
    if (matchIdx >= 0) {
      advReqs[matchIdx] = {
        ...advReqs[matchIdx],
        lastMessage: newMsgObj.text,
        requestedAt: newMsgObj.t,
        status: advReqs[matchIdx].status === "pending" ? "accepted" : advReqs[matchIdx].status,
      };
    } else {
      const newReq = {
        id: activeConv.clientId || Date.now(),
        clientId: activeConv.clientId || Date.now(),
        clientName: activeConv.clientName,
        clientPhone: activeConv.clientPhone || "",
        clientEmail: activeConv.clientEmail || "",
        clientCity: activeConv.clientCity || "Online",
        requestedAt: newMsgObj.t,
        message: newMsgObj.text,
        status: "accepted",
        paymentStatus: activeConv.isPaidBooked ? "Paid / Completed" : "Pending",
        caseStage: "Start Case",
        fee: advocate?.fee || "₹2,000"
      };
      advReqs.unshift(newReq);
    }

    allReqs[advocateId] = advReqs;
    saveAllRequests(allReqs);
    setRequests(advReqs);

    // Broadcast instant advocate message event & notification keys for Client Dashboard
    try {
      const notifPayload = {
        clientId: activeConv.clientId,
        advocateId: advocateId,
        advocateName: advocate?.name || "Advocate",
        advocateAvatar: advocate?.avatar || advocate?.photo || "",
        text: newMsgObj.text,
        t: newMsgObj.t
      };
      localStorage.setItem("law4u_latest_advocate_message", JSON.stringify(notifPayload));
      localStorage.setItem(`law4u_notify_client_${activeConv.clientId}`, JSON.stringify(notifPayload));
      try {
        const channel = new BroadcastChannel("law4u_chat_channel");
        channel.postMessage({
          type: "ADVOCATE_MESSAGE",
          clientId: activeConv.clientId,
          advocateId: advocateId,
          advocateName: notifPayload.advocateName,
          advocateAvatar: notifPayload.advocateAvatar,
          text: newMsgObj.text,
          t: newMsgObj.t,
          replyTo: newMsgObj.replyTo,
          attachment: newMsgObj.attachment
        });
        channel.postMessage({
          type: "CHAT_UPDATED",
          clientId: activeConv.clientId,
          advocateId: advocateId,
          key: k
        });
        channel.close();
      } catch (bcErr) {}
      window.dispatchEvent(new CustomEvent("law4u_advocate_message_sent", { detail: notifPayload }));
      window.dispatchEvent(new CustomEvent("law4u_chat_updated", { detail: { key: k, clientId: activeConv.clientId, advocateId } }));
      window.dispatchEvent(new Event("storage"));
    } catch (e) { /* ignore */ }

    // Notify other components & tabs
    window.dispatchEvent(new CustomEvent("law4u_requests_updated"));
    scrollToBottom("smooth");
  };

  // Delete message (WhatsApp style: "🚫 This message was deleted")
  const handleDeleteChatMessage = (msgIndex) => {
    if (!activeConv) return;
    const k = activeConv.key;
    const raw = localStorage.getItem(k);
    if (!raw) return;
    const msgs = JSON.parse(raw);
    if (!msgs[msgIndex]) return;

    msgs[msgIndex] = {
      ...msgs[msgIndex],
      isDeleted: true,
      text: "",
      attachment: null,
      deletedAt: new Date().toISOString(),
      deletedBy: "advocate"
    };

    localStorage.setItem(k, JSON.stringify(msgs));
    setConvMessages(msgs);

    // Update law4u_requests if this was the last message
    try {
      const allReqsRaw = localStorage.getItem("law4u_requests");
      if (allReqsRaw) {
        const allReqs = JSON.parse(allReqsRaw);
        const advReqs = allReqs[advocateId] || [];
        const mIdx = advReqs.findIndex(r => String(r.clientId || r.id) === String(activeConv.clientId));
        if (mIdx >= 0) {
          const lastM = msgs[msgs.length - 1];
          advReqs[mIdx].lastMessage = lastM?.isDeleted ? "🚫 This message was deleted" : (lastM?.text || "");
          allReqs[advocateId] = advReqs;
          localStorage.setItem("law4u_requests", JSON.stringify(allReqs));
          setRequests(advReqs);
        }
      }
    } catch {}

    try {
      const channel = new BroadcastChannel("law4u_chat_channel");
      channel.postMessage({
        type: "CHAT_UPDATED",
        clientId: activeConv.clientId,
        advocateId: advocateId,
        key: k
      });
      channel.close();
    } catch (bcErr) {}

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("law4u_requests_updated"));
    window.dispatchEvent(new CustomEvent("law4u_chat_updated", { detail: { key: k, clientId: activeConv.clientId } }));
  };

  // Edit message (adds "Edited" tag and updates text)
  const handleSaveEditChatMessage = (msgIndex, newText) => {
    if (!activeConv || !newText.trim()) return;
    const k = activeConv.key;
    const raw = localStorage.getItem(k);
    if (!raw) return;
    const msgs = JSON.parse(raw);
    if (!msgs[msgIndex]) return;

    msgs[msgIndex] = {
      ...msgs[msgIndex],
      text: newText.trim(),
      isEdited: true,
      editedAt: new Date().toISOString()
    };

    localStorage.setItem(k, JSON.stringify(msgs));
    setConvMessages(msgs);
    setEditingMsgIndex(null);
    setEditingMsgText("");

    // Update law4u_requests if this was the last message
    try {
      const allReqsRaw = localStorage.getItem("law4u_requests");
      if (allReqsRaw) {
        const allReqs = JSON.parse(allReqsRaw);
        const advReqs = allReqs[advocateId] || [];
        const mIdx = advReqs.findIndex(r => String(r.clientId || r.id) === String(activeConv.clientId));
        if (mIdx >= 0) {
          const lastM = msgs[msgs.length - 1];
          advReqs[mIdx].lastMessage = lastM?.isDeleted ? "🚫 This message was deleted" : (lastM?.text || "");
          allReqs[advocateId] = advReqs;
          localStorage.setItem("law4u_requests", JSON.stringify(allReqs));
          setRequests(advReqs);
        }
      }
    } catch {}

    try {
      const channel = new BroadcastChannel("law4u_chat_channel");
      channel.postMessage({
        type: "CHAT_UPDATED",
        clientId: activeConv.clientId,
        advocateId: advocateId,
        key: k
      });
      channel.close();
    } catch (bcErr) {}

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("law4u_requests_updated"));
    window.dispatchEvent(new CustomEvent("law4u_chat_updated", { detail: { key: k, clientId: activeConv.clientId } }));
  };

  // Copy message text to clipboard
  const handleCopyMessage = (text) => {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {}
    setActiveMenuMsgIndex(null);
  };

  // Reply to a message (WhatsApp style quote reply)
  const handleReplyMessage = (msg) => {
    if (!msg) return;
    const isAdv = msg.from === "advocate";
    const senderName = isAdv ? "You" : (activeConv?.clientName || "Client");
    setReplyingTo({
      text: msg.text || (msg.attachment ? `[Attachment: ${msg.attachment.fileName}]` : "Message"),
      sender: senderName,
      from: msg.from
    });
    setActiveMenuMsgIndex(null);
    setTimeout(() => {
      const inputEl = document.querySelector(".ad-message-composer input");
      if (inputEl) inputEl.focus();
    }, 50);
  };

  // Add Client manually directly into Accepted section & initialize WhatsApp chat
  const handleAddClientSubmit = (e) => {
    e.preventDefault();
    if (!addClientForm.name.trim()) return;

    const newClientId = Date.now();
    const newReqObj = {
      id: newClientId,
      clientId: newClientId,
      clientName: addClientForm.name.trim(),
      clientPhone: addClientForm.phone.trim(),
      clientEmail: addClientForm.email.trim(),
      clientCity: addClientForm.city.trim() || "Local Client",
      requestedAt: new Date().toISOString(),
      message: addClientForm.notes.trim() || "Manually added client profile.",
      status: "accepted", // Automatically added as Accepted!
      paymentStatus: "Paid / Completed",
      caseStage: addClientForm.caseStage || "Start Case",
      fee: addClientForm.fee || advocate?.fee || "₹2,000",
      isSaved: true
    };

    const allReqs = loadAllRequests();
    const advReqs = allReqs[advocateId] || [];
    const updatedList = [newReqObj, ...advReqs];
    allReqs[advocateId] = updatedList;
    saveAllRequests(allReqs);
    setRequests(updatedList);

    // Initialize chat conversation in localStorage
    const chatKey = `chat_${newClientId}_${advocateId}`;
    const initialMsgs = [{
      from: "client",
      text: addClientForm.notes.trim() || "Client profile setup directly by advocate.",
      t: newReqObj.requestedAt,
      clientName: newReqObj.clientName
    }];
    localStorage.setItem(chatKey, JSON.stringify(initialMsgs));

    setShowAddClientModal(false);
    setFilter("accepted"); // Open Accepted tab to show new client immediately!
    setAddClientForm({
      name: "",
      phone: "",
      email: "",
      city: "",
      fee: advocate?.fee || "₹2,000",
      caseStage: "Start Case",
      notes: ""
    });

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("law4u_requests_updated"));

    setAddClientSuccessMsg(`Successfully added ${newReqObj.clientName} directly to Accepted Clients!`);
    setTimeout(() => setAddClientSuccessMsg(""), 4000);
  };

  const updateRequestStatus = (reqId, status, extra = {}) => {
    const all = loadAllRequests();
    const list = (all[advocateId] || []).map(r => r.id === reqId ? { ...r, status, ...extra } : r);
    all[advocateId] = list;
    saveAllRequests(all);
    setRequests(list);
  };

  const saveCaseStage = (reqId, caseStage) => {
    updateRequestStatus(reqId, "accepted", { caseStage, isSaved: true });
  };

  const handleSaveEarningEdit = (reqId) => {
    const allOverrides = loadEarningsOverrides();
    const currentAdvOverrides = allOverrides[advocateId] || {};
    
    const updatedRecord = {
      clientName: editForm.clientName,
      requestedAt: editForm.requestedAt,
      amount: editForm.amount,
      paymentStatus: editForm.paymentStatus,
    };

    currentAdvOverrides[reqId] = updatedRecord;
    allOverrides[advocateId] = currentAdvOverrides;
    saveEarningsOverrides(allOverrides);
    setEarningsOverrides({ ...currentAdvOverrides });
    setEditingEarningId(null);
  };

  // Avatar file -> data URL
  const handleAvatarFileChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileForm(prev => ({ ...(prev||{}), avatarData: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!advocateId || !profileForm) return;
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const payload = {
        name: profileForm.name,
        city: profileForm.city,
        phone: profileForm.phone,
        speciality: profileForm.speciality,
        practiceArea: profileForm.practiceArea,
        court: profileForm.court,
        barCouncil: profileForm.barCouncil,
        barId: profileForm.barId,
        experience: profileForm.experience,
        fee: profileForm.fee,
        availability: profileForm.availability,
        bio: profileForm.bio,
        languages: profileForm.languages ? profileForm.languages.split(",").map(s => s.trim()).filter(Boolean) : [],
      };
      if (profileForm.avatarData) payload.avatarData = profileForm.avatarData;

      await updateAdvocate(advocateId, payload);
      setProfileMsg("Profile updated successfully");
      setAdvocateVersion(v => v + 1);
      // reflect returned values by reloading local form from cache (use getAdvocateById)
      const updated = getAdvocateById(advocateId);
      if (updated) {
        setProfileForm(prev => ({ ...prev, languages: Array.isArray(updated.languages) ? updated.languages.join(", ") : (updated.languages||"") }));
      }
      return true;
    } catch (err) {
      setProfileMsg(err.message || "Save failed");
      return false;
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMsg(""), 3000);
    }
  };

  const handleLogout = () => {
    logoutAdvocate();
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    navigate("/login");
  };

  const requestLogout = () => setShowLogoutConfirm(true);
  const cancelLogout = () => setShowLogoutConfirm(false);
  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    handleLogout();
  };

  const filteredRequests = requests.filter(r => {
    let matchesFilter = true;
    if (filter === "pending") matchesFilter = r.status === "pending";
    else if (filter === "accepted") matchesFilter = r.status === "accepted" && !r.isSaved;
    else if (filter === "declined") matchesFilter = r.status === "declined";
    else if (filter === "accepted status") matchesFilter = r.status === "accepted" && r.isSaved;

    const matchesSearch = r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (r.clientCity && r.clientCity.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const pendingCount = requests.filter(r => r.status === "pending").length;

  const acceptedRequests = useMemo(() => {
    return requests.filter(r => r.status === "accepted" || r.status === "accepted status");
  }, [requests]);

  const filteredSessions = useMemo(() => {
    return acceptedRequests.filter(req => {
      const override = earningsOverrides[req.id] || {};
      const name = (override.clientName || req.clientName || "").toLowerCase();
      const phone = (req.clientPhone || "").toLowerCase();
      const city = (req.clientCity || "").toLowerCase();
      const note = (req.message || "").toLowerCase();
      const stage = (req.caseStage || "Start Case");

      if (sessionsFilter === "start" && stage !== "Start Case") return false;
      if (sessionsFilter === "progress" && (stage === "Start Case" || stage === "Verdict / Completed" || stage === "Close Case")) return false;
      if (sessionsFilter === "closed" && stage !== "Verdict / Completed" && stage !== "Close Case") return false;

      if (!sessionsSearch.trim()) return true;
      const q = sessionsSearch.trim().toLowerCase();
      return name.includes(q) || phone.includes(q) || city.includes(q) || note.includes(q);
    });
  }, [acceptedRequests, earningsOverrides, sessionsFilter, sessionsSearch]);

  // Compute total unread messages from clients and find the most recent unread message
  const { unreadChatCount, latestUnreadMsg } = useMemo(() => {
    let count = 0;
    let latest = null;

    mergedConversations.forEach((conv) => {
      const cid = conv.clientId;
      const unread = getConvUnreadCount(conv.key, cid);
      if (unread > 0) {
        count += unread;
        const msgTime = conv.lastMsg?.t ? new Date(conv.lastMsg.t).getTime() : 0;
        if (!latest || msgTime > new Date(latest.t).getTime()) {
          latest = {
            clientName: conv.clientName || `Client #${cid}`,
            text: conv.lastMsg?.isDeleted ? "🚫 This message was deleted" : (conv.lastMsg?.text || (conv.lastMsg?.attachment ? "📎 Attachment" : "New consultation message received")),
            t: conv.lastMsg?.t || new Date().toISOString(),
            conv,
          };
        }
      }
    });

    return { unreadChatCount: count, latestUnreadMsg: latest };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergedConversations, getConvUnreadCount, chatReadVersion, convMessages]);

  // Auto-mark conversation as read when active in chat view
  useEffect(() => {
    if (activeNav === "chat" && activeConv?.clientId && advocateId) {
      const readKey = `law4u_adv_${advocateId}_last_read_${activeConv.clientId}`;
      localStorage.setItem(readKey, new Date().toISOString());
      setChatReadVersion(v => v + 1);
    }
  }, [activeNav, activeConv, advocateId, convMessages.length]);

  // Real-time listener for client messages across tabs / BroadcastChannel / window events with WhatsApp audio chime & popup toast
  useEffect(() => {
    if (!advocateId) return;

    const triggerClientNotification = (payload) => {
      if (!payload) return;
      const msgTime = payload.t ? new Date(payload.t).getTime() : Date.now();
      if (msgTime <= lastAlertedTimeRef.current) return;
      lastAlertedTimeRef.current = msgTime;

      // Synchronously refresh conversation list and requests so left panel is immediate
      refreshConversationsAndRequests();

      const curActiveConv = activeConvRef.current;
      const curActiveNav = activeNavRef.current;
      const isCurrentChatOpen = (curActiveNav === "chat" && curActiveConv && (String(curActiveConv.clientId) === String(payload.clientId) || Number(curActiveConv.clientId) === Number(payload.clientId)));

      if (isCurrentChatOpen) {
        if (advocateIdRef.current) {
          localStorage.setItem(`law4u_adv_${advocateIdRef.current}_last_read_${payload.clientId}`, new Date().toISOString());
        }
        const raw = localStorage.getItem(`chat_${payload.clientId}_${advocateIdRef.current}`);
        if (raw) {
          setConvMessages(JSON.parse(raw));
        }
        playWhatsAppNotificationSound();
        scrollToBottom("smooth");
      } else {
        // Advocate is on another screen, tab, or viewing another client: play WhatsApp chime and show popup notification toast
        playWhatsAppNotificationSound();
        setIncomingToast({
          clientId: payload.clientId,
          clientName: payload.clientName || `Client #${payload.clientId}`,
          text: payload.text || "New message",
          key: `chat_${payload.clientId}_${advocateIdRef.current}`,
          t: payload.t || new Date().toISOString()
        });
      }
      setChatReadVersion((v) => v + 1);
    };

    // 1. Zero-latency BroadcastChannel
    let channel = null;
    try {
      channel = new BroadcastChannel("law4u_chat_channel");
      channel.onmessage = (event) => {
        const data = event.data;
        if (!data) return;
        if (data.type === "CLIENT_MESSAGE" && (Number(data.advocateId) === Number(advocateId) || !data.advocateId)) {
          triggerClientNotification(data);
        } else if (data.type === "REQUESTS_UPDATED" || data.type === "CHAT_UPDATED") {
          refreshConversationsAndRequests();
        }
      };
    } catch (e) {}

    // 2. Custom window events
    const handleClientMsgSent = (e) => {
      const detail = e?.detail;
      if (detail && (!detail.advocateId || Number(detail.advocateId) === Number(advocateId))) {
        triggerClientNotification(detail);
      }
    };

    const handleChatUpdated = (e) => {
      const detail = e?.detail;
      refreshConversationsAndRequests();
      const curActiveConv = activeConvRef.current;
      if (curActiveConv && (detail?.key === curActiveConv.key || String(detail?.clientId) === String(curActiveConv.clientId))) {
        try {
          const raw = localStorage.getItem(curActiveConv.key);
          if (raw) setConvMessages(JSON.parse(raw));
        } catch {}
      }
    };

    const handleRequestsUpdated = () => {
      refreshConversationsAndRequests();
    };

    // 3. Storage events (cross-tab / storage updates)
    const handleStorage = (e) => {
      if (!e) return;
      if (!e.key || e.key.startsWith("chat_") || e.key.startsWith("law4u_")) {
        refreshConversationsAndRequests();
      }
      if (e.key === `law4u_notify_adv_${advocateId}` || e.key === "law4u_latest_client_message") {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload && (!payload.advocateId || Number(payload.advocateId) === Number(advocateId))) {
            triggerClientNotification(payload);
          }
        } catch {}
      }
    };

    window.addEventListener("law4u_client_message_sent", handleClientMsgSent);
    window.addEventListener("law4u_chat_updated", handleChatUpdated);
    window.addEventListener("law4u_requests_updated", handleRequestsUpdated);
    window.addEventListener("storage", handleStorage);

    // 4. Guaranteed 1000ms polling heartbeat interval (both localStorage and live server messages.json)
    let lastKnownMsgCount = -1;
    let lastKey = "";
    let isPollingAdvServer = false;
    const interval = setInterval(() => {
      const curConv = activeConvRef.current;
      if (curConv && curConv.key) {
        try {
          const raw = localStorage.getItem(curConv.key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (curConv.key !== lastKey || parsed.length !== lastKnownMsgCount) {
              lastKey = curConv.key;
              lastKnownMsgCount = parsed.length;
              setConvMessages(parsed);
              refreshConversationsAndRequests();
            }
          }
        } catch {}
      }
      try {
        const notifRaw = localStorage.getItem(`law4u_notify_adv_${advocateId}`);
        if (notifRaw) {
          const payload = JSON.parse(notifRaw);
          if (payload && payload.t) {
            const time = new Date(payload.t).getTime();
            if (time > lastAlertedTimeRef.current) {
              triggerClientNotification(payload);
            }
          }
        }
      } catch {}

      // Second-to-second live sync from server backend messages.json
      if (advocateId && !isPollingAdvServer) {
        isPollingAdvServer = true;
        api(`/api/messages?advocateId=${advocateId}`)
          .then((serverMsgs) => {
            if (Array.isArray(serverMsgs)) {
              const groups = {};
              for (const m of serverMsgs) {
                const k = m.key || `chat_${m.clientId}_${advocateId}`;
                if (!groups[k]) groups[k] = [];
                groups[k].push(m);
              }

              let hasNewData = false;
              let newestClientMsg = null;
              let maxMsgTime = lastAlertedTimeRef.current;

              for (const [k, msgs] of Object.entries(groups)) {
                const raw = localStorage.getItem(k);
                const localCount = raw ? JSON.parse(raw).length : 0;
                if (msgs.length > localCount) {
                  localStorage.setItem(k, JSON.stringify(msgs));
                  hasNewData = true;
                }
                const last = msgs[msgs.length - 1];
                if (last && last.from === "client") {
                  const t = new Date(last.t).getTime();
                  if (t > maxMsgTime) {
                    maxMsgTime = t;
                    newestClientMsg = last;
                  }
                }
              }

              if (hasNewData) {
                refreshConversationsAndRequests();
                const curConv = activeConvRef.current;
                if (curConv && curConv.key && groups[curConv.key]) {
                  setConvMessages(groups[curConv.key]);
                  scrollToBottom("smooth");
                }
              }

              if (newestClientMsg) {
                triggerClientNotification(newestClientMsg);
              }
            }
          })
          .catch(() => {})
          .finally(() => {
            isPollingAdvServer = false;
          });
      }
    }, 1000);

    // 5. Native continuous SSE socket stream for instant live chat
    let es = null;
    try {
      const sseUrl = `${process.env.REACT_APP_API_BASE || ""}/api/messages/stream?advocateId=${advocateId}`;
      es = new EventSource(sseUrl);
      es.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (!msg || !msg.clientId) return;
          const k = msg.key || `chat_${msg.clientId}_${advocateId}`;
          const raw = localStorage.getItem(k);
          const currentMsgs = raw ? JSON.parse(raw) : [];
          if (!currentMsgs.some((m) => m.id === msg.id || (m.t === msg.t && m.text === msg.text))) {
            const next = [...currentMsgs, msg];
            localStorage.setItem(k, JSON.stringify(next));

            // Ensure client is present in law4u_requests
            const allReqs = loadAllRequests();
            const advReqs = allReqs[advocateId] || [];
            if (!advReqs.some((r) => String(r.clientId || r.id) === String(msg.clientId))) {
              advReqs.unshift({
                id: msg.clientId,
                clientId: msg.clientId,
                clientName: msg.clientName || `Client #${msg.clientId}`,
                clientAvatar: msg.clientAvatar || "",
                clientPhone: "",
                clientEmail: "",
                clientCity: "Online Client",
                requestedAt: msg.t,
                message: msg.text,
                lastMessage: msg.text,
                status: "accepted",
                paymentStatus: "Paid / Completed",
                caseStage: "Start Case",
                fee: advocate?.fee || "₹2,000",
              });
              allReqs[advocateId] = advReqs;
              saveAllRequests(allReqs);
            }

            refreshConversationsAndRequests();
            const curConv = activeConvRef.current;
            if (curConv && (curConv.key === k || String(curConv.clientId) === String(msg.clientId))) {
              setConvMessages(next);
              scrollToBottom("smooth");
            }
            if (msg.from === "client") {
              triggerClientNotification(msg);
            }
          }
        } catch (err) {}
      };
    } catch (err) {}

    return () => {
      if (channel) channel.close();
      if (es) es.close();
      window.removeEventListener("law4u_client_message_sent", handleClientMsgSent);
      window.removeEventListener("law4u_chat_updated", handleChatUpdated);
      window.removeEventListener("law4u_requests_updated", handleRequestsUpdated);
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [advocateId, refreshConversationsAndRequests, scrollToBottom, advocate?.fee]);

  if (!ready) return null;

  if (!advocate) {
    return (
      <div className="ad-page">
        <div className="ad-card ad-notfound">
          <h2>Account not found</h2>
          <p>We couldn't find an advocate profile for this session.</p>
          <button className="ad-btn-primary" onClick={handleLogout}>Back to Login</button>
        </div>
      </div>
    );
  }

  // Dashboard-tile helpers. Available by default unless explicitly marked unavailable.
  const isAvailable = !advocate.availability || (/available/i.test(advocate.availability) && !/not/i.test(advocate.availability));
  const profileDone = PROFILE_FIELDS.filter(f => Boolean(advocate[f.key])).length;

  const filterOptions = [
    { key: "all", label: "All Requests", icon: "📋" },
    { key: "pending", label: "Pending", icon: "⏳" },
    { key: "accepted", label: "Accepted", icon: "✅" },
    { key: "declined", label: "Declined", icon: "❌" },
    { key: "accepted status", label: "Accepted Status", icon: "📂" },
  ];

  return (
    <div className={`ad-page ${theme === "dark" ? "ad-dark" : ""}`} onClick={() => setActiveMenuId(null)}>
      {showLogoutConfirm && (
        <div className="ad-logout-overlay" onClick={cancelLogout}>
          <div className="ad-logout-card" onClick={(e) => e.stopPropagation()}>
            <div className="ad-logout-icon">⏻</div>
            <div className="ad-logout-title">Leave this dashboard?</div>
            <div className="ad-logout-text">Your account will stay active, but you’ll need to sign in again to continue managing requests and chats.</div>
            <div className="ad-logout-actions">
              <button type="button" className="ad-logout-btn-cancel" onClick={cancelLogout}>Stay</button>
              <button type="button" className="ad-logout-btn-confirm" onClick={confirmLogout}>Log out</button>
            </div>
          </div>
        </div>
      )}

      {/* ── WhatsApp Incoming Client Message Toast ── */}
      {incomingToast && (
        <div
          className="ad-wa-toast-notification"
          onClick={() => {
            const matched = mergedConversations.find(c => String(c.clientId) === String(incomingToast.clientId));
            if (matched) {
              openConversation(matched);
            } else {
              openConversation({
                clientId: incomingToast.clientId,
                key: incomingToast.key || `chat_${incomingToast.clientId}_${advocateId}`,
                clientName: incomingToast.clientName,
                isPaidBooked: true,
                reqStatus: "accepted"
              });
            }
            setIncomingToast(null);
          }}
          role="alert"
        >
          <div className="ad-wa-toast-avatar-box">
            <ClientAvatarItem
              clientOrId={incomingToast.clientId}
              name={incomingToast.clientName}
              advocateId={advocateId}
              className="ad-wa-toast-avatar"
            />
            <span className="ad-wa-toast-online-pip" />
          </div>
          <div className="ad-wa-toast-content">
            <div className="ad-wa-toast-header">
              <span className="ad-wa-toast-title">{incomingToast.clientName}</span>
              <span className="ad-wa-toast-tag">WhatsApp Message</span>
            </div>
            <div className="ad-wa-toast-msg">{incomingToast.text}</div>
          </div>
          <div className="ad-wa-toast-actions">
            <button
              type="button"
              className="ad-wa-toast-open-btn"
              onClick={(e) => {
                e.stopPropagation();
                const matched = mergedConversations.find(c => String(c.clientId) === String(incomingToast.clientId));
                if (matched) {
                  openConversation(matched);
                } else {
                  openConversation({
                    clientId: incomingToast.clientId,
                    key: incomingToast.key || `chat_${incomingToast.clientId}_${advocateId}`,
                    clientName: incomingToast.clientName,
                    isPaidBooked: true,
                    reqStatus: "accepted"
                  });
                }
                setIncomingToast(null);
              }}
            >
              Reply →
            </button>
            <button
              type="button"
              className="ad-wa-toast-dismiss-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIncomingToast(null);
              }}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── Top Bar ── */}
      <div className="ad-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="ad-hamburger-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Open Menu">
            ☰
          </button>
          <BrandLogo size={32} />
        </div>

        {/* Upper Section Notification Pill & Actions */}
        <div className="ad-topbar-actions">
          {unreadChatCount > 0 && (
            <button
              type="button"
              className="ad-topbar-notify-pill"
              onClick={() => {
                if (latestUnreadMsg?.conv) {
                  openConversation(latestUnreadMsg.conv);
                } else {
                  setActiveNav("chat");
                }
              }}
              title={`New message from ${latestUnreadMsg?.clientName || "Client"} - click to open chat`}
            >
              <span className="ad-notify-bell" style={{ display: "inline-flex", alignItems: "center", width: 16, height: 16 }}>
                {NAV_ICONS.bell}
              </span>
              <span className="ad-notify-text">
                <b>{latestUnreadMsg?.clientName}</b>: <em>"{latestUnreadMsg?.text?.slice(0, 28)}{latestUnreadMsg?.text?.length > 28 ? "…" : ""}"</em>
              </span>
              <span className="ad-topbar-badge">{unreadChatCount}</span>
            </button>
          )}

          <button
            type="button"
            className="ad-theme-toggle-btn"
            onClick={() => toggleTheme()}
            title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
            aria-label="Toggle theme"
            style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", width: 16, height: 16 }}>
              {theme === "dark" ? NAV_ICONS.sun : NAV_ICONS.moon}
            </span>
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileMenuOpen && (
        <div className="ad-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="ad-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="ad-drawer-header">
              <h3>Navigation Menu</h3>
              <button className="ad-drawer-close" onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>
            <div className="ad-drawer-body">
              <nav className="ad-drawer-nav-list">
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.key}
                    className={`ad-drawer-nav-item ${activeNav === item.key ? "active" : ""}`}
                    onClick={() => {
                      setActiveNav(item.key);
                      setMobileMenuOpen(false);
                      if (item.key === "chat" && latestUnreadMsg?.conv) {
                        openConversation(latestUnreadMsg.conv);
                      }
                    }}
                  >
                    <span className="ad-link-icon">{item.icon}</span> <span>{item.label}</span>
                    {item.key === "requests" && pendingCount > 0 && (
                      <span className="ad-badge-count">{pendingCount}</span>
                    )}
                    {item.key === "chat" && unreadChatCount > 0 && (
                      <span className="ad-badge-count ad-badge-chat">{unreadChatCount}</span>
                    )}
                  </button>
                ))}
              </nav>
              <hr className="ad-divider" />
              <button
                type="button"
                className="ad-drawer-theme-btn"
                onClick={() => toggleTheme()}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "8px",
                  background: "var(--ad-bg-sub)",
                  color: "var(--ad-text-main)",
                  border: "1px solid var(--ad-border)",
                  borderRadius: "8px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", width: 18, height: 18 }}>
                  {theme === "dark" ? NAV_ICONS.sun : NAV_ICONS.moon}
                </span>
                <span>{theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}</span>
              </button>
              <button
                className="ad-drawer-logout"
                onClick={() => { setMobileMenuOpen(false); requestLogout(); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", width: 18, height: 18 }}>
                  {NAV_ICONS.logout}
                </span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Dashboard Layout ── */}
      <div className={`ad-dashboard-layout ${activeNav === "chat" ? "ad-chat-active-layout" : ""}`}>
        
        {/* Left Sidebar Navigation (Desktop) */}
        <aside className={`ad-sidebar-nav ${sidebarOpen ? "ad-sidebar-open" : "ad-sidebar-collapsed"}`}>
          <nav className="ad-sidebar-menu">
            {NAV_ITEMS.map((item, index) => (
              <div key={item.key} className="ad-sidebar-item">
                {(index === 0 || NAV_ITEMS[index - 1].group !== item.group) && (
                  <div className="ad-sidebar-group">{item.group}</div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav(item.key);
                    if (item.key === "chat" && latestUnreadMsg?.conv) {
                      openConversation(latestUnreadMsg.conv);
                    }
                  }}
                  className={`ad-sidebar-link ${activeNav === item.key ? "active" : ""} ${item.key === "chat" && unreadChatCount > 0 ? "has-notify" : ""}`}
                  title={item.label}
                  aria-label={item.label}
                >
                  <span className="ad-link-icon">{item.icon}</span>
                  <span className="ad-link-label">{item.label}</span>
                  {item.key === "requests" && pendingCount > 0 && (
                    <span className="ad-badge-count">{pendingCount}</span>
                  )}
                  {item.key === "chat" && unreadChatCount > 0 && (
                    <span className="ad-badge-count ad-badge-chat" title={`${unreadChatCount} new message${unreadChatCount > 1 ? "s" : ""}`}>
                      {unreadChatCount}
                    </span>
                  )}
                  {item.key === "dashboard" && (unreadChatCount > 0 || pendingCount > 0) && (
                    <span className="ad-badge-dot" title="New activity / messages" />
                  )}
                </button>
              </div>
            ))}
          </nav>

          <div className="ad-sidebar-spacer" />

          <div className="ad-sidebar-user-brief" title={advocate.name}>
            <div className="ad-sidebar-avatar">
              {(profileForm?.avatarData || advocate?.avatar || advocate?.photo) ? (
                <img
                  src={profileForm?.avatarData || (assetUrl ? assetUrl(advocate.avatar || advocate.photo) : (advocate.avatar || advocate.photo))}
                  alt={advocate.name}
                  className="ad-sidebar-avatar-img"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : (
                advocate.name.replace(/^Adv\.\s*/i, "").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
              )}
            </div>
            <div className="ad-sidebar-user-text">
              <div className="ad-sidebar-name">{advocate.name}</div>
              <div className="ad-sidebar-role">
                <i className={`ad-sidebar-dot ${isAvailable ? "on" : ""}`} />
                {advocate.availability && !/not/i.test(advocate.availability) ? advocate.availability : "Available"}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="ad-sidebar-link ad-sidebar-logout-btn"
            onClick={requestLogout}
            title="Log out"
            aria-label="Log out"
          >
            <span className="ad-link-icon">{NAV_ICONS.logout}</span>
            <span className="ad-link-label">Log out</span>
          </button>

          <button
            type="button"
            className="ad-sidebar-link ad-sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={sidebarOpen}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <span className="ad-link-icon">
              {sidebarOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
              )}
            </span>
            <span className="ad-link-label">Collapse</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className={`ad-container ${activeNav === "chat" ? "ad-chat-active-container" : ""}`}>

          {/* Upper Section Notification Alert Banner */}
          {unreadChatCount > 0 && activeNav !== "chat" && (
            <div
              className="ad-upper-notify-alert"
              onClick={() => {
                if (latestUnreadMsg?.conv) {
                  openConversation(latestUnreadMsg.conv);
                } else {
                  setActiveNav("chat");
                }
              }}
              title="Click to view message in Chat"
            >
              <div className="ad-notify-alert-icon">💬</div>
              <div className="ad-notify-alert-body">
                <div className="ad-notify-alert-title">
                  <span className="ad-notify-tag">NEW MESSAGE</span>
                  <strong>{latestUnreadMsg?.clientName}</strong> sent you a message in Chat
                </div>
                <div className="ad-notify-alert-snippet">
                  "{latestUnreadMsg?.text}"
                </div>
              </div>
              <button type="button" className="ad-notify-alert-btn">
                Open Chat ({unreadChatCount}) →
              </button>
            </div>
          )}
          
          {/* VIEW: DASHBOARD */}
          {activeNav === "dashboard" && (
            <div className="ad-fade-in">
              <div className="ad-bento">
                {/* Identity tile */}
                <div className="ad-tile ad-tile-id">
                  <div className="ad-tile-id-top">
                    <div className="ad-avatar ad-tile-avatar" style={{ background: advocate.avatar ? "transparent" : "#14b8a6" }}>
                      {advocate.avatar ? (
                        <img src={advocate.avatar} alt={advocate.name} className="ad-avatar-img" />
                      ) : (
                        advocate.name.replace("Adv. ", "").split(" ").map(n => n[0]).join("")
                      )}
                    </div>
                    <div className="ad-rating-pill ad-tile-rating">⭐ {advocate.rating}</div>
                  </div>
                  <h1 className="ad-tile-name">{advocate.name}</h1>
                  <p className="ad-tile-sub">{advocate.speciality} · {advocate.city}</p>
                  {advocate.bio && advocate.bio.length > 3 && <p className="ad-tile-bio">{advocate.bio}</p>}
                  <div className="ad-tile-id-bottom">
                    <span className={`ad-avail-pill ${isAvailable ? "on" : ""}`}>
                      <i /> {advocate.availability && !/not/i.test(advocate.availability) ? advocate.availability : "Available"}
                    </span>
                    {!isAvailable && <span className="ad-tile-hint">Currently unavailable for bookings</span>}
                  </div>
                </div>

                <div className="ad-tile"><div className="ad-tile-label">Cases handled</div><div className="ad-tile-value">{advocate.cases}</div></div>
                <div className="ad-tile"><div className="ad-tile-label">Experience</div><div className="ad-tile-value">{advocate.experience}</div></div>
                <div className="ad-tile"><div className="ad-tile-label">Fee</div><div className="ad-tile-value">{advocate.fee} <small>/ session</small></div></div>
                <div className="ad-tile ad-tile-click" onClick={() => setActiveNav("requests")} role="button" tabIndex={0}>
                  <div className="ad-tile-label">Pending requests</div>
                  <div className={`ad-tile-value ${pendingCount > 0 ? "warn" : ""}`}>{pendingCount}</div>
                </div>
                <div className="ad-tile ad-tile-click" onClick={() => setActiveNav("chat")} role="button" tabIndex={0} title="View clients in Chat">
                  <div className="ad-tile-label">Accepted clients</div>
                  <div className="ad-tile-value">{acceptedRequests.length}</div>
                </div>
                <div className="ad-tile"><div className="ad-tile-label">Rating</div><div className="ad-tile-value">{Number(advocate.rating) > 0 ? advocate.rating : "—"} <small>{Number(advocate.rating) > 0 ? "" : "no reviews"}</small></div></div>

                {/* Upcoming sessions: latest accepted requests */}
                <div className="ad-tile ad-tile-wide ad-tile-tall">
                  <div className="ad-tile-head">
                    <span className="ad-tile-label">Upcoming sessions</span>
                    {acceptedRequests.length > 0 && (
                      <button className="ad-tile-link" onClick={() => setActiveNav("sessions")}>View all</button>
                    )}
                  </div>
                  {acceptedRequests.length === 0 ? (
                    <div className="ad-tile-empty">
                      No sessions yet. Accept a client request and it appears here with the client, date and note.
                    </div>
                  ) : (
                    <ul className="ad-tile-list">
                      {acceptedRequests.slice(0, 3).map(req => {
                        const override = earningsOverrides[req.id] || {};
                        return (
                          <li key={req.id}>
                            <div>
                              <b>{override.clientName || req.clientName}</b>
                              <span>{req.clientCity ? `${req.clientCity} · ` : ""}{formatDate(override.requestedAt || req.requestedAt)}</span>
                            </div>
                            <span className={`ad-stage-pill ${(req.caseStage || "Start Case").toLowerCase().replace(" ", "-")}`}>
                              {req.caseStage || "Start Case"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Profile completeness, derived from the fields the store defines */}
                <div className="ad-tile ad-tile-tall ad-tile-span2">
                  <div className="ad-tile-head">
                    <span className="ad-tile-label">Finish your profile</span>
                    <span className="ad-tile-meta">{profileDone}/{PROFILE_FIELDS.length}</span>
                  </div>
                  <ul className="ad-tile-checks">
                    {PROFILE_FIELDS.map(f => {
                      const ok = Boolean(advocate[f.key]);
                      return (
                        <li key={f.key}>
                          <span>{f.label}</span>
                          <b className={ok ? "ok" : "todo"}>{ok ? "Done" : "Add"}</b>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="ad-tile-progress"><div style={{ width: `${(profileDone / PROFILE_FIELDS.length) * 100}%` }} /></div>
                </div>

                {/* Latest pending requests */}
                <div className="ad-tile ad-tile-wide">
                  <div className="ad-tile-head">
                    <span className="ad-tile-label">Recent requests</span>
                    <button className="ad-tile-link" onClick={() => setActiveNav("requests")}>Open inbox</button>
                  </div>
                  {pendingCount === 0 ? (
                    <div className="ad-tile-empty">Nothing waiting. New client requests will show here first.</div>
                  ) : (
                    <ul className="ad-tile-list">
                      {requests.filter(r => r.status === "pending").slice(0, 3).map(req => (
                        <li key={req.id}>
                          <div>
                            <b>{req.clientName}</b>
                            <span>{req.clientCity ? `${req.clientCity} · ` : ""}{formatDate(req.requestedAt)}</span>
                          </div>
                          <StatusBadge status={req.status} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="ad-tile ad-tile-span2">
                  <div className="ad-tile-label">Quick actions</div>
                  <div className="ad-tile-actions">
                    <button className="ad-btn-secondary" onClick={() => setActiveNav("profile")}>Edit profile</button>
                    <button className="ad-btn-secondary" onClick={() => setActiveNav("earnings")}>Earnings</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: CLIENT REQUESTS */}
          {activeNav === "requests" && (
            <div className="ad-fade-in">
              <div className="ad-card ad-requests-card">
                <div className="ad-requests-header">
                  <h2>Client Connection Requests</h2>
                  <div className="ad-filter-pills">
                    {filterOptions.map(f => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setFilter(f.key)}
                        className={`ad-pill-btn ${filter === f.key ? "active" : ""}`}
                      >
                        {f.icon} {f.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="ad-pill-btn"
                      style={{
                        background: "linear-gradient(135deg, #16a34a, #15803d)",
                        color: "#ffffff",
                        fontWeight: "700",
                        border: "none",
                        boxShadow: "0 4px 10px rgba(22, 163, 74, 0.25)",
                        cursor: "pointer",
                        marginLeft: "6px"
                      }}
                      onClick={() => setShowAddClientModal(true)}
                    >
                      ➕ Add Client
                    </button>
                  </div>
                </div>

                {addClientSuccessMsg && (
                  <div className="ad-alert-banner" style={{ background: "#dcfce7", color: "#14532d", border: "1px solid #86efac", marginBottom: "16px" }}>
                    <span>✓ {addClientSuccessMsg}</span>
                    <button onClick={() => setAddClientSuccessMsg("")} className="ad-alert-close">×</button>
                  </div>
                )}

                <div style={{ marginBottom: "16px" }}>
                  <input
                    type="text"
                    placeholder="🔍 Search client by name or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ad-search-input"
                  />
                </div>

                {filteredRequests.length === 0 ? (
                  <div className="ad-empty">
                    {requests.length === 0
                      ? "No consultation requests yet."
                      : "No matching client requests found for this filter."}
                  </div>
                ) : (
                  <div className="ad-requests-list">
                    {filteredRequests.map(req => (
                      <RequestCard
                        key={req.id}
                        req={req}
                        advocateId={advocateId}
                        onAccept={(id) => updateRequestStatus(id, "accepted")}
                        onDecline={(id) => updateRequestStatus(id, "declined")}
                        onSaveStage={saveCaseStage}
                        onOpenChat={openChatForClient}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: BOOKED CONSULTATIONS & CLIENT SESSIONS */}
          {activeNav === "sessions" && (
            <div className="ad-fade-in ad-sessions-view">
              {/* Context Header */}
              <div className="ad-sessions-header">
                <div className="ad-sessions-header-left">
                  <h2 className="ad-sessions-title">
                    <span>📅</span> Booked Consultations &amp; Sessions
                    <span className="ad-sessions-count-pill">{acceptedRequests.length} Scheduled</span>
                  </h2>
                  <p className="ad-sessions-subtitle">
                    Scheduled consultation appointments, ₹10 PhonePe chat chits, and legal case progress for all confirmed clients.
                  </p>
                </div>

                {/* Quick Search & Filter Controls */}
                <div className="ad-sessions-controls">
                  <div className="ad-sessions-search-wrapper">
                    <span className="ad-sessions-search-icon">🔍</span>
                    <input
                      type="text"
                      className="ad-sessions-search-input"
                      placeholder="Search client, mobile, city, or case issue…"
                      value={sessionsSearch}
                      onChange={(e) => setSessionsSearch(e.target.value)}
                    />
                    {sessionsSearch && (
                      <button
                        type="button"
                        className="ad-sessions-search-clear"
                        onClick={() => setSessionsSearch("")}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="ad-sessions-filter-tabs">
                    {[
                      { id: "all", label: `All (${acceptedRequests.length})` },
                      { id: "start", label: `Start Case (${acceptedRequests.filter(r => (r.caseStage || "Start Case") === "Start Case").length})` },
                      { id: "progress", label: `In Progress (${acceptedRequests.filter(r => (r.caseStage || "") !== "Start Case" && (r.caseStage || "") !== "Close Case" && (r.caseStage || "") !== "Verdict / Completed").length})` },
                      { id: "closed", label: `Closed (${acceptedRequests.filter(r => (r.caseStage || "") === "Close Case" || (r.caseStage || "") === "Verdict / Completed").length})` },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        className={`ad-sessions-tab-btn ${sessionsFilter === tab.id ? "active" : ""}`}
                        onClick={() => setSessionsFilter(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sessions Mini Stats */}
              <div className="ad-sessions-stats-grid">
                <div className="ad-session-stat-card tone-navy">
                  <div className="ad-stat-icon">📅</div>
                  <div>
                    <div className="ad-stat-val">{acceptedRequests.length}</div>
                    <div className="ad-stat-lbl">Confirmed Sessions</div>
                  </div>
                </div>
                <div className="ad-session-stat-card tone-teal">
                  <div className="ad-stat-icon">💬</div>
                  <div>
                    <div className="ad-stat-val">
                      {acceptedRequests.filter(r => r.paymentStatus === "Paid" || r.paymentStatus === "Paid / Completed" || r.isPaidBooked).length}
                    </div>
                    <div className="ad-stat-lbl">₹10 Paid Consultations</div>
                  </div>
                </div>
                <div className="ad-session-stat-card tone-amber">
                  <div className="ad-stat-icon">⏳</div>
                  <div>
                    <div className="ad-stat-val">
                      {acceptedRequests.filter(r => (r.caseStage || "Start Case") === "Start Case").length}
                    </div>
                    <div className="ad-stat-lbl">Initial Stage Cases</div>
                  </div>
                </div>
                <div className="ad-session-stat-card tone-green">
                  <div className="ad-stat-icon">✅</div>
                  <div>
                    <div className="ad-stat-val">
                      {acceptedRequests.filter(r => (r.caseStage || "") === "Verdict / Completed" || (r.caseStage || "") === "Close Case").length}
                    </div>
                    <div className="ad-stat-lbl">Verdict / Completed</div>
                  </div>
                </div>
              </div>

              {/* Sessions Cards List */}
              {filteredSessions.length === 0 ? (
                <div className="ad-empty ad-sessions-empty">
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>📅</div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--ad-text-main)" }}>
                    {sessionsSearch ? `No sessions matching "${sessionsSearch}"` : "No consultation sessions found"}
                  </h3>
                  <p style={{ color: "var(--ad-text-muted)", maxWidth: "360px", marginTop: "6px", fontSize: "14px" }}>
                    Accept client consultation requests from the "Client Requests" tab to schedule sessions here.
                  </p>
                </div>
              ) : (
                <div className="ad-sessions-list">
                  {filteredSessions.map((req) => {
                    const override = earningsOverrides[req.id] || {};
                    const displayName = override.clientName || req.clientName;
                    const displayDate = override.requestedAt || req.requestedAt;
                    const isPaid = req.paymentStatus === "Paid" || req.paymentStatus === "Paid / Completed" || req.isPaidBooked;
                    const currentStage = req.caseStage || "Start Case";

                    return (
                      <div key={req.id} className="ad-session-card">
                        {/* Card Top Row: Avatar, Name, Badges & Stage */}
                        <div className="ad-session-card-header">
                          <div className="ad-session-client-meta">
                            <ClientAvatarItem
                              clientOrId={req}
                              name={displayName}
                              advocateId={advocateId}
                              className="ad-session-avatar"
                            />
                            <div>
                              <div className="ad-session-name-row">
                                <h3 className="ad-session-client-name">{displayName}</h3>
                                <span className="ad-session-id-tag">ID #{req.clientId || req.id}</span>
                                <span className="ad-session-status-badge">✅ Accepted</span>
                                {isPaid ? (
                                  <span className="ad-session-paid-badge">
                                    ✓ ₹10 Paid Chat
                                  </span>
                                ) : (
                                  <span className="ad-session-pending-badge">
                                    PhonePe UPI
                                  </span>
                                )}
                              </div>
                              <div className="ad-session-sub-meta">
                                <span>📍 <b>{req.clientCity || "Karnataka"}</b></span>
                                <span>•</span>
                                <span>🗓️ Consultation Date: <b>{formatDate(displayDate)}</b></span>
                              </div>
                            </div>
                          </div>

                          {/* Stage Pill & Selector */}
                          <div className="ad-session-stage-wrapper">
                            <span className={`ad-stage-pill ${currentStage.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                              {currentStage}
                            </span>
                            <select
                              className="ad-session-stage-select"
                              value={currentStage}
                              onChange={(e) => saveCaseStage(req.id, e.target.value)}
                              title="Update Case Stage"
                            >
                              <option value="Start Case">Start Case</option>
                              <option value="Document Verification">Document Verification</option>
                              <option value="Notice / Filing">Notice / Filing</option>
                              <option value="Court Hearing">Court Hearing</option>
                              <option value="Verdict / Completed">Verdict / Completed</option>
                              <option value="Close Case">Close Case</option>
                            </select>
                          </div>
                        </div>

                        {/* Card Contact Grid */}
                        <div className="ad-session-details-grid">
                          <div className="ad-session-detail-item">
                            <span className="ad-detail-lbl">📅 Scheduled Date</span>
                            <strong className="ad-detail-val date-val">{formatDate(displayDate)}</strong>
                          </div>
                          <div className="ad-session-detail-item">
                            <span className="ad-detail-lbl">📱 Mobile Number</span>
                            {req.clientPhone ? (
                              <a href={`tel:${req.clientPhone}`} className="ad-detail-val phone-link">
                                📞 {req.clientPhone}
                              </a>
                            ) : (
                              <span className="ad-detail-val muted">—</span>
                            )}
                          </div>
                          <div className="ad-session-detail-item">
                            <span className="ad-detail-lbl">✉️ Email Address</span>
                            {req.clientEmail ? (
                              <a href={`mailto:${req.clientEmail}`} className="ad-detail-val email-link">
                                📧 {req.clientEmail}
                              </a>
                            ) : (
                              <span className="ad-detail-val muted">—</span>
                            )}
                          </div>
                          <div className="ad-session-detail-item">
                            <span className="ad-detail-lbl">📍 Location</span>
                            <strong className="ad-detail-val">{req.clientCity || "Gokak, Karnataka"}</strong>
                          </div>
                        </div>

                        {/* Client Note / Legal Query Box */}
                        {req.message && (
                          <div className="ad-session-note-box">
                            <div className="ad-session-note-header">
                              <span>📝 Consultation Issue / Client Note:</span>
                            </div>
                            <div className="ad-session-note-text">
                              "{req.message}"
                            </div>
                          </div>
                        )}

                        {/* Action Buttons Bar */}
                        <div className="ad-session-actions-bar">
                          <button
                            type="button"
                            className="ad-session-chat-btn"
                            onClick={() => {
                              const key = `chat_${req.clientId || req.id}_${advocateId}`;
                              openConversation({
                                key,
                                clientId: req.clientId || req.id,
                                clientName: displayName,
                                clientCity: req.clientCity,
                                clientPhone: req.clientPhone,
                                clientEmail: req.clientEmail,
                                isPaidBooked: true,
                                reqStatus: req.status
                              });
                            }}
                          >
                            <span className="ad-chat-icon">💬</span>
                            Open  Chat
                          </button>

                          {req.clientPhone && (
                            <a
                              href={`tel:${req.clientPhone}`}
                              className="ad-session-call-btn"
                            >
                              📞 Call Client
                            </a>
                          )}

                          <div className="ad-session-spacer" />

                          <div className="ad-session-quick-stage">
                            <span style={{ fontSize: "12px", color: "var(--adm-muted)", fontWeight: 600 }}>Stage:</span>
                            <span className="ad-stage-mini-pill">{currentStage}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW: CHAT (WhatsApp Style Client Messaging & Booked Consultations) */}
          {activeNav === "chat" && (
            <div className={`ad-fade-in ad-chat-shell ad-wa-chat-shell ${mobileChatActive && activeConv ? "mobile-show-chat" : "mobile-show-list"}`}>
              {/* Left Contacts Sidebar */}
              <aside className="ad-chat-contacts ad-wa-contacts-panel">
                <div className="ad-chat-contacts-header ad-wa-header">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", color: "var(--ad-text-main)" }}>
                      <span style={{ color: "#25d366", fontSize: "22px" }}>💬</span> Client Chat
                      {unreadChatCount > 0 && (
                        <span className="ad-wa-header-unread-pill" title={`${unreadChatCount} new unread message${unreadChatCount > 1 ? "s" : ""}`}>
                          {unreadChatCount} new
                        </span>
                      )}
                    </h2>
                    <span className="ad-wa-badge-count">{mergedConversations.length}</span>
                  </div>

                  {/* Contact Search Input */}
                  <div className="ad-wa-search-wrap">
                    <input
                      type="text"
                      className="ad-wa-search-input"
                      placeholder="🔍 Search clients by name, phone or city..."
                      value={chatSearchTerm}
                      onChange={(e) => setChatSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="ad-wa-filter-row">
                    <button
                      type="button"
                      className={`ad-wa-filter-btn ${chatFilter === "all" ? "active" : ""}`}
                      onClick={() => setChatFilter("all")}
                    >
                      All ({mergedConversations.length})
                    </button>
                    <button
                      type="button"
                      className={`ad-wa-filter-btn ${chatFilter === "unread" ? "active" : ""}`}
                      onClick={() => setChatFilter("unread")}
                    >
                      🟢 Unread ({mergedConversations.filter(c => getConvUnreadCount(c.key, c.clientId) > 0).length})
                    </button>
                    <button
                      type="button"
                      className={`ad-wa-filter-btn ${chatFilter === "paid" ? "active" : ""}`}
                      onClick={() => setChatFilter("paid")}
                    >
                      💳 Paid ({mergedConversations.filter(c => c.isPaidBooked).length})
                    </button>
                    <button
                      type="button"
                      className={`ad-wa-filter-btn ${chatFilter === "pending" ? "active" : ""}`}
                      onClick={() => setChatFilter("pending")}
                    >
                      ⏳ Pending ({mergedConversations.filter(c => c.reqStatus === "pending").length})
                    </button>
                  </div>
                </div>

                {/* Contacts List */}
                <div className="ad-chat-list ad-wa-list" style={{ width: "100%", flex: "1 1 auto", minHeight: 0 }}>
                  {mergedConversations
                    .filter(conv => {
                      const q = chatSearchTerm.toLowerCase();
                      const matchesSearch = (conv.clientName || "").toLowerCase().includes(q) ||
                                            (conv.clientCity || "").toLowerCase().includes(q) ||
                                            (conv.clientPhone || "").includes(q);
                      let matchesFilter = true;
                      if (chatFilter === "unread") matchesFilter = getConvUnreadCount(conv.key, conv.clientId) > 0;
                      if (chatFilter === "paid") matchesFilter = conv.isPaidBooked;
                      if (chatFilter === "pending") matchesFilter = conv.reqStatus === "pending";
                      return matchesSearch && matchesFilter;
                    })
                    .length === 0 ? (
                      <div className="ad-empty" style={{ padding: "30px 15px", textAlign: "center", color: "var(--ad-text-muted)" }}>
                        No matching clients or messages found.
                      </div>
                    ) : (
                      mergedConversations
                        .filter(conv => {
                          const q = chatSearchTerm.toLowerCase();
                          const matchesSearch = (conv.clientName || "").toLowerCase().includes(q) ||
                                                (conv.clientCity || "").toLowerCase().includes(q) ||
                                                (conv.clientPhone || "").includes(q);
                          let matchesFilter = true;
                          if (chatFilter === "unread") matchesFilter = getConvUnreadCount(conv.key, conv.clientId) > 0;
                          if (chatFilter === "paid") matchesFilter = conv.isPaidBooked;
                          if (chatFilter === "pending") matchesFilter = conv.reqStatus === "pending";
                          return matchesSearch && matchesFilter;
                        })
                        .map(conv => {
                          const isSelected = activeConv && activeConv.key === conv.key;
                          const cUnread = getConvUnreadCount(conv.key, conv.clientId);
                          return (
                            <button
                              key={conv.key}
                              type="button"
                              className={`ad-chat-item ad-wa-contact-item ${isSelected ? "active" : ""} ${cUnread > 0 ? "has-unread ad-wa-contact-unread" : ""}`}
                              onClick={() => {
                                openConversation(conv);
                              }}
                              style={{ width: "100%", boxSizing: "border-box" }}
                            >
                              <div style={{ position: "relative", flexShrink: 0 }}>
                                <ClientAvatarItem
                                  clientOrId={conv}
                                  name={conv.clientName}
                                  advocateId={advocateId}
                                  className="ad-chat-item-avatar ad-wa-avatar"
                                />
                                {cUnread > 0 && <span className="ad-wa-avatar-unread-dot" title="New unread message" />}
                              </div>
                              <div className="ad-chat-item-meta" style={{ display: "flex", flexDirection: "column", gap: "2px", flex: "1 1 auto", minWidth: 0, textAlign: "left" }}>
                                <div className="ad-chat-item-row">
                                  <span className={`ad-chat-name ${cUnread > 0 ? "ad-name-unread" : ""}`}>{conv.clientName}</span>
                                  <span className={`ad-chat-time ${cUnread > 0 ? "ad-time-unread" : ""}`}>
                                    {conv.lastMsg ? new Date(conv.lastMsg.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                                  </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                                  <div className={`ad-chat-snippet ${cUnread > 0 ? "ad-snippet-unread" : ""}`} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                                    {conv.lastMsg ? (conv.lastMsg.isDeleted ? "🚫 This message was deleted" : (conv.lastMsg.text || (conv.lastMsg.attachment ? "📎 Attachment" : "Start conversation"))) : "Start conversation"}
                                  </div>
                                  {cUnread > 0 && (
                                    <span className="ad-wa-unread-badge" title={`${cUnread} unread`}>{cUnread}</span>
                                  )}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px", flexWrap: "wrap" }}>
                                  {conv.isPaidBooked && <span className="ad-wa-paid-tag">✓ Paid Booked</span>}
                                  {conv.reqStatus === "pending" && <span className="ad-wa-pending-tag">⏳ Pending</span>}
                                  {conv.clientCity && <span style={{ fontSize: "11px", color: "var(--ad-text-muted)" }}>📍 {conv.clientCity}</span>}
                                </div>
                              </div>
                            </button>
                          );
                        })
                    )}
                </div>
              </aside>

              {/* Right WhatsApp Chat Canvas */}
              <section className="ad-conversation-panel ad-wa-conversation-panel">
                {!activeConv ? (
                  <div className="ad-empty ad-empty-chat ad-wa-placeholder">
                    <div style={{ fontSize: "56px", marginBottom: "12px" }}>💬</div>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--ad-text-main)" }}> Client Portal</h3>
                    <p style={{ color: "var(--ad-text-muted)", maxWidth: "340px", marginTop: "6px", fontSize: "14px" }}>
                      Select a client from the left menu to view messages, manage booked appointments, and send real-time consultation responses.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* WhatsApp Header Bar */}
                    <div className="ad-conversation-header ad-wa-chat-topbar">
                      <button
                        type="button"
                        className="ad-wa-mobile-back-btn"
                        onClick={() => setMobileChatActive(false)}
                        title="Back to client list"
                        aria-label="Back to client list"
                      >
                        ‹
                      </button>
                      <ClientAvatarItem
                        clientOrId={activeConv}
                        name={activeConv.clientName}
                        advocateId={advocateId}
                        className="ad-chat-item-avatar ad-chat-header-avatar ad-wa-avatar"
                      />
                      <div className="ad-conversation-header-text">
                        <div className="ad-conversation-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {activeConv.clientName}
                        </div>
                        <div className="ad-conversation-subtitle">
                          {activeConv.clientPhone ? `📱 ${activeConv.clientPhone} · ` : ""}
                        </div>
                      </div>
                      <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
                        {activeConv.reqStatus === "pending" && (
                          <button
                            type="button"
                            className="ad-btn-accept"
                            onClick={() => {
                              updateRequestStatus(activeConv.clientId, "accepted");
                              setActiveConv(prev => prev ? { ...prev, reqStatus: "accepted", isPaidBooked: true } : null);
                            }}
                          >
                            ✓ Accept Request
                          </button>
                        )}
                        <span className="ad-stage-pill ad-stage-status-pill">
                          Status: {activeConv.caseStage || "Start Case"}
                        </span>
                      </div>
                    </div>

                    {/* WhatsApp Message Body Container */}
                    <div className="ad-conversation-body ad-wa-chat-body">
                      {convMessages.length === 0 ? (
                        <div className="ad-empty ad-empty-chat" style={{ color: "var(--ad-text-muted)", background: "var(--ad-bg-card)", border: "1px solid var(--ad-border)", padding: "12px 20px", borderRadius: "20px" }}>
                          No messages yet with {activeConv.clientName}. Send a reply below.
                        </div>
                      ) : (
                        convMessages.map((m, i) => {
                          const isAdv = m.from === "advocate";
                          const isEditingThis = editingMsgIndex === i;
                          const isDeleted = Boolean(m.isDeleted);
                          const isEdited = Boolean(m.isEdited);
                          const isMenuActive = activeMenuMsgIndex === i;
                          const isNearBottom = i >= convMessages.length - 2;

                          return (
                            <div key={i} className={`ad-message-row ${isAdv ? "outgoing" : "incoming"} ${isDeleted ? "is-deleted-row" : ""} ${isMenuActive ? "ad-msg-row-active" : ""}`}>
                              <div
                                className={`ad-message-bubble ${isAdv ? "outgoing ad-wa-bubble-outgoing" : "incoming ad-wa-bubble-incoming"} ${isDeleted ? "ad-wa-bubble-deleted" : ""} ${isMenuActive ? "ad-wa-bubble-focused" : ""}`}
                                onClick={() => {
                                  if (!isDeleted && !isEditingThis) {
                                    setActiveMenuMsgIndex(prev => prev === i ? null : i);
                                  }
                                }}
                                style={{ cursor: (!isDeleted && !isEditingThis) ? "pointer" : "default" }}
                              >
                                
                                {/* WhatsApp 3-Dots Action Menu Trigger & Dropdown */}
                                {!isDeleted && !isEditingThis && (
                                  <div className="ad-wa-msg-menu-wrap" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      className={`ad-wa-msg-trigger-btn ${isMenuActive ? "active" : ""}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuMsgIndex(prev => prev === i ? null : i);
                                      }}
                                      title="Message options"
                                      aria-label="Message options"
                                    >
                                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                      </svg>
                                    </button>

                                    {activeMenuMsgIndex === i && (
                                      <div
                                        className={`ad-wa-msg-dropdown ${isAdv ? "dropdown-outgoing" : "dropdown-incoming"} ${isNearBottom ? "dropdown-upward" : ""}`}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {/* Reply option */}
                                        <button
                                          type="button"
                                          className="ad-wa-menu-item"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleReplyMessage(m);
                                          }}
                                        >
                                          <span className="ad-wa-menu-icon">↩️</span>
                                          <span>Reply</span>
                                        </button>

                                        {/* Edit option - ONLY FOR ADVOCATE'S OWN SENT MESSAGES */}
                                        {isAdv && m.text && (
                                          <button
                                            type="button"
                                            className="ad-wa-menu-item"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setActiveMenuMsgIndex(null);
                                              setEditingMsgIndex(i);
                                              setEditingMsgText(m.text || "");
                                            }}
                                          >
                                            <span className="ad-wa-menu-icon">✏️</span>
                                            <span>Edit</span>
                                          </button>
                                        )}

                                        {/* Copy option */}
                                        {m.text && (
                                          <button
                                            type="button"
                                            className="ad-wa-menu-item"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCopyMessage(m.text);
                                            }}
                                          >
                                            <span className="ad-wa-menu-icon">📋</span>
                                            <span>Copy</span>
                                          </button>
                                        )}

                                        {/* Delete option */}
                                        <button
                                          type="button"
                                          className="ad-wa-menu-item ad-wa-menu-item-delete"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenuMsgIndex(null);
                                            if (window.confirm ? window.confirm("Are you sure you want to delete this message for everyone?") : true) {
                                              handleDeleteChatMessage(i);
                                            }
                                          }}
                                        >
                                          <span className="ad-wa-menu-icon">🗑️</span>
                                          <span>Delete</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Quoted Reply Block (Message to Message) */}
                                {!isDeleted && m.replyTo && (
                                  <div className={`ad-wa-bubble-quote ${isAdv ? "quote-outgoing" : "quote-incoming"}`}>
                                    <div className="ad-wa-quote-border" />
                                    <div className="ad-wa-quote-content">
                                      <div className="ad-wa-quote-sender">{m.replyTo.sender}</div>
                                      <div className="ad-wa-quote-text">{m.replyTo.text}</div>
                                    </div>
                                  </div>
                                )}

                                {/* Deleted message view */}
                                {isDeleted ? (
                                  <div className="ad-wa-deleted-msg">
                                    <span className="ad-wa-deleted-icon">🚫</span>
                                    <span className="ad-wa-deleted-text">This message was deleted</span>
                                  </div>
                                ) : isEditingThis ? (
                                  /* Inline editing mode */
                                  <div className="ad-wa-inline-edit-box" onClick={(e) => e.stopPropagation()}>
                                    <textarea
                                      className="ad-wa-inline-edit-textarea"
                                      value={editingMsgText}
                                      onChange={(e) => setEditingMsgText(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                          e.preventDefault();
                                          handleSaveEditChatMessage(i, editingMsgText);
                                        } else if (e.key === "Escape") {
                                          setEditingMsgIndex(null);
                                          setEditingMsgText("");
                                        }
                                      }}
                                      rows={2}
                                      autoFocus
                                    />
                                    <div className="ad-wa-inline-edit-actions">
                                      <button
                                        type="button"
                                        className="ad-wa-inline-save-btn"
                                        onClick={() => handleSaveEditChatMessage(i, editingMsgText)}
                                      >
                                        ✓ Save
                                      </button>
                                      <button
                                        type="button"
                                        className="ad-wa-inline-cancel-btn"
                                        onClick={() => {
                                          setEditingMsgIndex(null);
                                          setEditingMsgText("");
                                        }}
                                      >
                                        ✕ Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  /* Active message content */
                                  <>
                                    {m.attachment && (
                                      <div className="ad-wa-msg-attachment" style={{ marginBottom: m.text ? "8px" : "4px" }}>
                                        {m.attachment.isImage ? (
                                          <div style={{ borderRadius: "8px", overflow: "hidden", marginBottom: "4px" }}>
                                            <img
                                              src={m.attachment.dataUrl}
                                              alt={m.attachment.fileName}
                                              style={{ maxWidth: "100%", maxHeight: "240px", objectFit: "cover", display: "block" }}
                                            />
                                          </div>
                                        ) : (
                                          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,0,0,0.06)", padding: "8px 12px", borderRadius: "8px" }}>
                                            <span style={{ fontSize: "24px" }}>📄</span>
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                              <div style={{ fontWeight: "700", fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {m.attachment.fileName}
                                              </div>
                                              <div style={{ fontSize: "11px", opacity: 0.75 }}>{m.attachment.fileSize}</div>
                                            </div>
                                          </div>
                                        )}
                                        <a
                                          href={m.attachment.dataUrl}
                                          download={m.attachment.fileName}
                                          onClick={(e) => e.stopPropagation()}
                                          style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", color: isAdv ? "var(--ad-accent-hover, #1d4ed8)" : "var(--ad-accent, #2563eb)", fontWeight: "700", marginTop: "4px", textDecoration: "none" }}
                                        >
                                          ⬇ Download {m.attachment.fileName}
                                        </a>
                                      </div>
                                    )}
                                    {m.text && <div className="ad-wa-msg-text">{m.text}</div>}
                                  </>
                                )}

                                <div className="ad-message-time" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "5px" }}>
                                  <span>{new Date(m.t || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                  {!isDeleted && isEdited && (
                                    <span className="ad-wa-edited-label" title={m.editedAt ? `Edited at ${new Date(m.editedAt).toLocaleTimeString()}` : "Edited"}>
                                      ✏️ Edited
                                    </span>
                                  )}
                                  {!isDeleted && isAdv && <span style={{ color: "var(--ad-chat-bubble-out-check, #34b7f1)", fontWeight: "bold" }}>✓✓</span>}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      {copyFeedback && (
                        <div className="ad-wa-copy-toast">
                          ✓ Copied to clipboard
                        </div>
                      )}
                      {activeMenuMsgIndex !== null && (
                        <div
                          className="ad-wa-msg-menu-backdrop"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuMsgIndex(null);
                          }}
                        />
                      )}
                      <div ref={chatEndRef} style={{ height: "1px", width: "100%", clear: "both" }} />
                    </div>

                    {/* Pending Attachment Preview Banner */}
                    {pendingAttachment && (
                      <div className="ad-wa-attachment-preview" style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 16px",
                        background: "var(--ad-bg-sub)",
                        borderTop: "1px solid var(--ad-border)",
                        fontSize: "13px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                          <span>{pendingAttachment.isImage ? "🖼️ Image Attachment:" : "📄 Document Attachment:"}</span>
                          <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "260px", color: "var(--ad-text-main)" }}>
                            {pendingAttachment.fileName}
                          </strong>
                          <span style={{ color: "var(--ad-text-muted)", fontSize: "11px" }}>({pendingAttachment.fileSize})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPendingAttachment(null)}
                          style={{ background: "transparent", border: "none", cursor: "pointer", color: "#dc2626", fontWeight: "bold", fontSize: "16px" }}
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Emoji Picker Popover */}
                    {showEmojiPicker && (
                      <div className="ad-wa-emoji-popover" style={{
                        position: "absolute",
                        bottom: "65px",
                        left: "14px",
                        background: "var(--ad-bg-card)",
                        border: "1px solid var(--ad-border)",
                        borderRadius: "14px",
                        padding: "10px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                        display: "grid",
                        gridTemplateColumns: "repeat(6, 1fr)",
                        gap: "6px",
                        zIndex: 100,
                        width: "240px"
                      }}>
                        {EMOJI_LIST.map((emo, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleInsertEmoji(emo)}
                            style={{
                              background: "transparent",
                              border: "none",
                              fontSize: "20px",
                              cursor: "pointer",
                              padding: "6px",
                              borderRadius: "6px",
                              transition: "background 0.15s"
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            {emo}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileSelect}
                      accept="image/*,application/pdf,.doc,.docx,.txt"
                    />

                    {/* WhatsApp Reply Composer Banner */}
                    {replyingTo && (
                      <div className="ad-wa-reply-composer-banner">
                        <div className="ad-wa-rc-bar" />
                        <div className="ad-wa-rc-content">
                          <div className="ad-wa-rc-sender">
                            Replying to <strong>{replyingTo.sender}</strong>
                          </div>
                          <div className="ad-wa-rc-text">
                            {replyingTo.text}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="ad-wa-rc-close"
                          onClick={() => setReplyingTo(null)}
                          title="Cancel reply"
                          aria-label="Cancel reply"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* WhatsApp Message Composer Input */}
                    <div className="ad-message-composer ad-wa-composer">
                      <button
                        type="button"
                        className="ad-wa-icon-btn"
                        title="Add Emoji"
                        onClick={() => setShowEmojiPicker(prev => !prev)}
                      >
                        😊
                      </button>
                      <button
                        type="button"
                        className="ad-wa-icon-btn"
                        title="Attach Document / File"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      >
                        📎
                      </button>
                      <input
                        value={convInput}
                        onChange={(e) => setConvInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendChatMessage();
                          }
                        }}
                        placeholder={`Message ${activeConv.clientName}…`}
                        className="ad-chat-input ad-wa-input"
                      />
                      <button
                        type="button"
                        className="ad-chat-send-btn ad-wa-send-btn"
                        onClick={() => handleSendChatMessage()}
                      >
                        Send ➤
                      </button>
                    </div>
                  </>
                )}
              </section>
            </div>
          )}


          {/* VIEW: EARNINGS */}
          {activeNav === "earnings" && (
            <div className="ad-fade-in">
              <div className="ad-card">
                <h2>💰 Earnings & Consultation Fees</h2>
                <p style={{ color: "var(--ad-text-muted)", fontSize: "14px", marginTop: "4px", marginBottom: "20px" }}>
                  Ledger of accepted clients and consultation fees. Click the 3 dots on any row to edit client details, date, custom amount, or payment status.
                </p>

                {acceptedRequests.length === 0 ? (
                  <div className="ad-empty">No earnings data available yet.</div>
                ) : (
                  <div style={{ overflowX: "auto", overflowY: "visible" }}>
                    <table className="ad-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                      <thead>
                        <tr className="ad-table-head-row" style={{ borderBottom: "1px solid var(--ad-border)" }}>
                          <th style={{ padding: "12px" }}>Client Name</th>
                          <th style={{ padding: "12px" }}>Date Accepted</th>
                          <th style={{ padding: "12px" }}>Consultation Fee</th>
                          <th style={{ padding: "12px" }}>Payment Status</th>
                          <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {acceptedRequests.map(req => {
                          const override = earningsOverrides[req.id] || {};
                          const displayName = override.clientName !== undefined ? override.clientName : req.clientName;
                          const displayDate = override.requestedAt !== undefined ? override.requestedAt : req.requestedAt;
                          const displayAmount = override.amount !== undefined && override.amount !== "" ? override.amount : advocate.fee;
                          const displayStatus = override.paymentStatus !== undefined ? override.paymentStatus : "Paid / Completed";

                          const isEditingRow = editingEarningId === req.id;

                          return (
                            <tr key={req.id} style={{ borderBottom: "1px solid var(--ad-border)" }}>
                              {isEditingRow ? (
                                <>
                                  <td style={{ padding: "10px" }}>
                                    <input
                                      type="text"
                                      value={editForm.clientName}
                                      onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                                      style={{ padding: "6px", width: "100%", borderRadius: "4px", border: "1px solid var(--ad-border)", background: "var(--ad-bg-sub)", color: "var(--ad-text-main)" }}
                                    />
                                  </td>
                                  <td style={{ padding: "10px" }}>
                                    <input
                                      type="date"
                                      value={editForm.requestedAt ? editForm.requestedAt.split("T")[0] : ""}
                                      onChange={(e) => setEditForm({ ...editForm, requestedAt: e.target.value })}
                                      style={{ padding: "6px", width: "100%", borderRadius: "4px", border: "1px solid var(--ad-border)", background: "var(--ad-bg-sub)", color: "var(--ad-text-main)" }}
                                    />
                                  </td>
                                  <td style={{ padding: "10px" }}>
                                    <input
                                      type="text"
                                      value={editForm.amount}
                                      placeholder="e.g. ₹2,500"
                                      onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                                      style={{ padding: "6px", width: "100%", borderRadius: "4px", border: "1px solid var(--ad-border)", background: "var(--ad-bg-sub)", color: "var(--ad-accent)", fontWeight: "600" }}
                                    />
                                  </td>
                                  <td style={{ padding: "10px" }}>
                                    <select
                                      value={editForm.paymentStatus}
                                      onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })}
                                      style={{ padding: "6px", width: "100%", borderRadius: "4px", border: "1px solid var(--ad-border)", background: "var(--ad-bg-sub)", color: "var(--ad-text-main)" }}
                                    >
                                      <option value="Paid / Completed">Paid / Completed</option>
                                      <option value="Pending">Pending</option>
                                      <option value="Failed">Failed</option>
                                    </select>
                                  </td>
                                  <td style={{ padding: "10px", textAlign: "center" }}>
                                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                      <button
                                        onClick={() => handleSaveEarningEdit(req.id)}
                                        style={{ background: "#2563eb", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "600", fontSize: "12px" }}
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingEarningId(null)}
                                        style={{ background: "var(--ad-bg-sub)", color: "var(--ad-text-main)", border: "1px solid var(--ad-border)", padding: "6px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td style={{ padding: "12px", fontWeight: "600", color: "var(--ad-text-main)" }}>{displayName}</td>
                                  <td style={{ padding: "12px", color: "var(--ad-text-muted)" }}>{formatDate(displayDate)}</td>
                                  <td style={{ padding: "12px", fontWeight: "600", color: "var(--ad-accent)" }}>{displayAmount}</td>
                                  <td style={{ padding: "12px" }}>
                                    <span style={{ 
                                      background: displayStatus === "Paid / Completed" ? "#dcfce7" : displayStatus === "Pending" ? "#fef3c7" : "#fee2e2", 
                                      color: displayStatus === "Paid / Completed" ? "#166534" : displayStatus === "Pending" ? "#92400e" : "#991b1b", 
                                      padding: "4px 8px", 
                                      borderRadius: "4px", 
                                      fontSize: "12px", 
                                      fontWeight: "600" 
                                    }}>
                                      {displayStatus}
                                    </span>
                                  </td>
                                  <td style={{ padding: "12px", textAlign: "center", position: "relative" }}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuId(activeMenuId === req.id ? null : req.id);
                                      }}
                                      style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "18px", fontWeight: "bold", color: "var(--ad-text-muted)", padding: "4px 8px" }}
                                    >
                                      ⋮
                                    </button>

                                    {activeMenuId === req.id && (
                                      <div style={{
                                        position: "absolute",
                                        right: "20px",
                                        top: "40px",
                                        background: "var(--ad-bg-card)",
                                        border: "1px solid var(--ad-border)",
                                        borderRadius: "6px",
                                        boxShadow: "var(--ad-shadow-lg)",
                                        zIndex: 10,
                                        width: "140px",
                                        textAlign: "left"
                                      }}>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingEarningId(req.id);
                                            setEditForm({
                                              clientName: displayName,
                                              requestedAt: displayDate,
                                              amount: displayAmount,
                                              paymentStatus: displayStatus,
                                            });
                                            setActiveMenuId(null);
                                          }}
                                          style={{
                                            background: "none",
                                            border: "none",
                                            padding: "8px 12px",
                                            width: "100%",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            color: "var(--ad-text-main)",
                                            fontWeight: "500"
                                          }}
                                        >
                                          ✎ Edit Record
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: PROFILE */}
          {activeNav === "profile" && (
            <div className="ad-fade-in">
              <div className="ad-card" style={{ padding: "24px" }}>
                <h2 style={{ marginTop: 0 }}>My Profile</h2>
                <p style={{ color: "var(--ad-text-muted)", marginTop: "4px" }}>Update your public profile. Click Save to persist changes.</p>

                {!profileForm ? (
                  <div className="ad-empty" style={{ marginTop: 20 }}>Loading profile…</div>
                ) : (
                  <div className="ad-profile-grid" style={{ marginTop: 16 }}>
                    <div style={{ gridColumn: "1 / 2", display: "flex", flexDirection: "column", gap: 8 }}>
                      <label className="ad-label">Full name</label>
                      <input className="ad-input" disabled={!isProfileEditing} value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />

                      <label className="ad-label">City</label>
                      <input className="ad-input" disabled={!isProfileEditing} value={profileForm.city} onChange={e => setProfileForm({...profileForm, city: e.target.value})} />

                      <label className="ad-label">Phone</label>
                      <input className="ad-input" disabled={!isProfileEditing} value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />

                      <label className="ad-label">Speciality</label>
                      <input className="ad-input" disabled={!isProfileEditing} value={profileForm.speciality} onChange={e => setProfileForm({...profileForm, speciality: e.target.value})} />

                      <label className="ad-label">Practice area</label>
                      <input className="ad-input" disabled={!isProfileEditing} value={profileForm.practiceArea} onChange={e => setProfileForm({...profileForm, practiceArea: e.target.value})} />

                      <label className="ad-label">Court</label>
                      <input className="ad-input" disabled={!isProfileEditing} value={profileForm.court} onChange={e => setProfileForm({...profileForm, court: e.target.value})} />

                      <label className="ad-label">Bar Council</label>
                      <input className="ad-input" disabled={!isProfileEditing} value={profileForm.barCouncil} onChange={e => setProfileForm({...profileForm, barCouncil: e.target.value})} />

                      <label className="ad-label">Bar ID</label>
                      <input className="ad-input" disabled={!isProfileEditing} value={profileForm.barId} onChange={e => setProfileForm({...profileForm, barId: e.target.value})} />
                    </div>

                    <div style={{ gridColumn: "2 / 3", display: "flex", flexDirection: "column", gap: 8 }}>
                      <label className="ad-label">Experience</label>
                      <input className="ad-input" disabled={!isProfileEditing} value={profileForm.experience} onChange={e => setProfileForm({...profileForm, experience: e.target.value})} />

                      <label className="ad-label">Fee</label>
                      <input className="ad-input" disabled={!isProfileEditing} value={profileForm.fee} onChange={e => setProfileForm({...profileForm, fee: e.target.value})} />

                      <label className="ad-label">Availability</label>
                      <input className="ad-input" disabled={!isProfileEditing} value={profileForm.availability} onChange={e => setProfileForm({...profileForm, availability: e.target.value})} />

                      <label className="ad-label">Languages (comma separated)</label>
                      <input className="ad-input" disabled={!isProfileEditing} value={profileForm.languages} onChange={e => setProfileForm({...profileForm, languages: e.target.value})} />

                      <label className="ad-label">Bio</label>
                      <textarea className="ad-input" rows={6} disabled={!isProfileEditing} value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} />

                      <label className="ad-label">Profile photo</label>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="file" accept="image/*" disabled={!isProfileEditing} onChange={(e) => handleAvatarFileChange(e.target.files && e.target.files[0])} />
                        {profileForm.avatarData ? (
                          <img src={profileForm.avatarData} alt="preview" style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover" }} />
                        ) : (advocate && advocate.avatar) ? (
                          <img src={assetUrl ? assetUrl(advocate.avatar) : advocate.avatar} alt="avatar" style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: 64, height: 64, borderRadius: 8, background: "var(--ad-bg-sub)", border: "1px solid var(--ad-border)", color: "var(--ad-text-main)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>{(advocate?.name || "").split(" ").map(s=>s[0]).slice(0,2).join("")}</div>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
                        <button
                          className="ad-btn-primary"
                          onClick={async () => {
                            if (!isProfileEditing) { setIsProfileEditing(true); return; }
                            const saved = await handleSaveProfile();
                            if (saved) setIsProfileEditing(false);
                          }}
                          disabled={profileSaving}
                        >
                          {isProfileEditing ? (profileSaving ? "Saving…" : "Save") : "Edit Profile"}
                        </button>

                        {isProfileEditing ? (
                          <button className="ad-btn-secondary" onClick={() => {
                            // revert local edits
                            setProfileForm({
                              name: advocate.name || "",
                              city: advocate.city || "",
                              phone: advocate.phone || "",
                              speciality: advocate.speciality || "",
                              practiceArea: advocate.practiceArea || "",
                              court: advocate.court || "",
                              barCouncil: advocate.barCouncil || "",
                              barId: advocate.barId || "",
                              experience: advocate.experience || "",
                              fee: advocate.fee || "",
                              availability: advocate.availability || "",
                              bio: advocate.bio || "",
                              languages: Array.isArray(advocate.languages) ? advocate.languages.join(", ") : (advocate.languages || ""),
                              avatarData: null,
                            });
                            setIsProfileEditing(false);
                          }}>Cancel</button>
                        ) : (
                          <button className="ad-btn-secondary" onClick={() => setActiveNav("dashboard")}>Return to Dashboard</button>
                        )}
                      </div>
                      {profileMsg && <div style={{ marginTop: 8, color: profileMsg.includes("failed") ? "#991b1b" : "#166534" }}>{profileMsg}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* ── Add Client Modal ── */}
          {showAddClientModal && (
            <div className="ad-logout-overlay" onClick={() => setShowAddClientModal(false)}>
              <div
                className="ad-logout-card"
                style={{ width: "min(100%, 540px)", textAlign: "left", borderRadius: "20px", padding: "24px", background: "var(--ad-bg-card)", border: "1px solid var(--ad-border)", color: "var(--ad-text-main)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--ad-border)", paddingBottom: "12px" }}>
                  <h3 style={{ margin: 0, fontSize: "20px", color: "var(--ad-text-main)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#16a34a" }}>➕</span> Add New Client Directly
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddClientModal(false)}
                    style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "var(--ad-text-muted)" }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddClientSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "var(--ad-text-main)", marginBottom: "4px" }}>
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={addClientForm.name}
                      onChange={(e) => setAddClientForm({ ...addClientForm, name: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--ad-border)", background: "var(--ad-bg-sub)", color: "var(--ad-text-main)", fontSize: "14px", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "var(--ad-text-main)", marginBottom: "4px" }}>
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +91 9876543210"
                        value={addClientForm.phone}
                        onChange={(e) => setAddClientForm({ ...addClientForm, phone: e.target.value })}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--ad-border)", background: "var(--ad-bg-sub)", color: "var(--ad-text-main)", fontSize: "14px", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "var(--ad-text-main)", marginBottom: "4px" }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. client@gmail.com"
                        value={addClientForm.email}
                        onChange={(e) => setAddClientForm({ ...addClientForm, email: e.target.value })}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--ad-border)", background: "var(--ad-bg-sub)", color: "var(--ad-text-main)", fontSize: "14px", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "var(--ad-text-main)", marginBottom: "4px" }}>
                        City / Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru"
                        value={addClientForm.city}
                        onChange={(e) => setAddClientForm({ ...addClientForm, city: e.target.value })}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--ad-border)", background: "var(--ad-bg-sub)", color: "var(--ad-text-main)", fontSize: "14px", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "var(--ad-text-main)", marginBottom: "4px" }}>
                        Consultation Fee
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹2,500"
                        value={addClientForm.fee}
                        onChange={(e) => setAddClientForm({ ...addClientForm, fee: e.target.value })}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--ad-border)", background: "var(--ad-bg-sub)", color: "var(--ad-text-main)", fontSize: "14px", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "var(--ad-text-main)", marginBottom: "4px" }}>
                      Case Stage / Status
                    </label>
                    <select
                      value={addClientForm.caseStage}
                      onChange={(e) => setAddClientForm({ ...addClientForm, caseStage: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--ad-border)", background: "var(--ad-bg-sub)", color: "var(--ad-text-main)", fontSize: "14px", boxSizing: "border-box" }}
                    >
                      <option value="Start Case">Start Case</option>
                      <option value="Evidence Gathering">Evidence Gathering</option>
                      <option value="Court Hearing">Court Hearing</option>
                      <option value="Verdict / Completed">Verdict / Completed</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "var(--ad-text-main)", marginBottom: "4px" }}>
                      Client Notes / Case Summary
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter initial consultation note or case summary..."
                      value={addClientForm.notes}
                      onChange={(e) => setAddClientForm({ ...addClientForm, notes: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--ad-border)", background: "var(--ad-bg-sub)", color: "var(--ad-text-main)", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                    <button
                      type="button"
                      className="ad-logout-btn-cancel"
                      onClick={() => setShowAddClientModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ad-btn-primary"
                      style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", border: "none", padding: "10px 20px" }}
                    >
                      ✓ Save & Add to Accepted
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}