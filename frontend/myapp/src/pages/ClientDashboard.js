import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getAdvocates, loadAdvocates, getAdvocateRatingSummary, submitAdvocateRating } from "../data/Advocatesstore";
import { assetUrl, api } from "../data/api";
import { getTheme, setTheme as setGlobalTheme } from "../data/themeStore";
import "./ClientDashboard.css";
const SESSION_KEY = "law4u_client_id";
const CLIENT_OBJ_KEY = "law4u_client";
const CLIENT_TOKEN_KEY = "law4u_client_token";
const LANG_KEY = "law4u_language";


const PAY_I18N = {
  en: {
    modalBadge: "🔒 ONE-TIME ACTIVATION · ₹10",
    purposeNote: "Nominal ₹10 fee for direct consultation chat, app maintenance & secure cloud storage. Pay once, chat continuously.",
    verifyBtn: "✓ I Have Paid ₹10 — Start Chat →",
    verifyingBtn: "⏳ Verifying Payment...",
    successBtn: "✅ Payment Confirmed! Starting Chat...",
    cancelBtn: "Cancel",
  },
  kn: {
    modalBadge: "🔒 ಒಂದು ಬಾರಿಯ ಶುಲ್ಕ · ₹10",
    purposeNote: "ನೇರ ಸಮಾಲೋಚನೆ ಚಾಟ್, ಅಪ್ಲಿಕೇಶನ್ ನಿರ್ವಹಣೆ ಮತ್ತು ಸುರಕ್ಷಿತ ಕ್ಲೌಡ್ ಸಂಗ್ರಹಣೆಗಾಗಿ ₹10 ಶುಲ್ಕ. ಒಮ್ಮೆ ಪಾವತಿಸಿ, ನಿರಂತರವಾಗಿ ಚಾಟ್ ಮಾಡಿ.",
    verifyBtn: "✓ ₹10 ಪಾವತಿಸಲಾಗಿದೆ — ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ →",
    verifyingBtn: "⏳ ಪಾವತಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    successBtn: "✅ ಪಾವತಿ ದೃಢಪಟ್ಟಿದೆ! ಆರಂಭವಾಗುತ್ತಿದೆ...",
    cancelBtn: "ರದ್ದುಮಾಡಿ",
  },
};

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
  } catch (e) { /* ignore audio permission restrictions */ }
}

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialAdvocateId = Number(searchParams.get("advocateId") || 0);
  const initialSearch = initialAdvocateId ? "" : (searchParams.get("search") || searchParams.get("speciality") || "");
  const initialPrefill = searchParams.get("prefill") || "";
  const clientId = Number(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || 0);

  // read client object (saved at login)
  const clientObj = useMemo(() => {
    try {
      const raw = localStorage.getItem(CLIENT_OBJ_KEY) || sessionStorage.getItem(CLIENT_OBJ_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, []);

  const [advocates, setAdvocates] = useState(() => getAdvocates().filter(a => a.status === "approved"));

  useEffect(() => {
    let isMounted = true;
    loadAdvocates().then((list) => {
      if (isMounted && Array.isArray(list)) {
        setAdvocates(list.filter((a) => a.status === "approved"));
      }
    }).catch(() => {});

    const handleUpdate = () => {
      if (isMounted) {
        setAdvocates(getAdvocates().filter((a) => a.status === "approved"));
      }
    };
    window.addEventListener("law4u_advocates_updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("law4u_advocates_updated", handleUpdate);
    };
  }, []);

  const [search, setSearch] = useState(initialSearch);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const filteredAdvocates = useMemo(() => {
    const raw = (search || "").trim().toLowerCase();
    if (!raw) return advocates;

    // Tokenize search query by +, /, &, comma, or whitespace
    const stopWords = new Set(["lawyer", "advocate", "claims", "and", "or", "the", "for", "with", "law", "+", "/", "&", "|", ","]);
    const rawTokens = raw
      .split(/[+,&|\s/]+/)
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 2 && !stopWords.has(t));

    // Expand search keywords with domain aliases
    const targetTerms = new Set(rawTokens);
    if (rawTokens.some(t => t.includes("accident") || t.includes("motor") || t.includes("injury"))) {
      targetTerms.add("civil");
      targetTerms.add("accident");
      targetTerms.add("mact");
    }
    if (rawTokens.some(t => t.includes("tax") || t.includes("gst") || t.includes("income"))) {
      targetTerms.add("tax");
      targetTerms.add("gst");
      targetTerms.add("corporate");
    }
    if (rawTokens.some(t => t.includes("cheque") || t.includes("banking") || t.includes("debt"))) {
      targetTerms.add("civil");
      targetTerms.add("corporate");
    }
    if (rawTokens.some(t => t.includes("divorce") || t.includes("custody") || t.includes("matrimonial"))) {
      targetTerms.add("family");
    }
    if (rawTokens.some(t => t.includes("rera") || t.includes("land") || t.includes("tenant"))) {
      targetTerms.add("property");
    }

    const termsArray = Array.from(targetTerms);

    // Fallback if no specific tokens
    if (termsArray.length === 0) {
      return advocates.filter(a => {
        const full = `${a.name} ${a.city} ${a.speciality || a.practiceArea} ${a.bio}`.toLowerCase();
        return full.includes(raw);
      });
    }

    return advocates.filter(a => {
      const full = `${a.name} ${a.city} ${a.practiceArea} ${a.speciality} ${a.bio}`.toLowerCase();
      return termsArray.some(term => full.includes(term));
    });
  }, [advocates, search]);
  const [messagesVersion, setMessagesVersion] = useState(0);
  const [since] = useState(""); // ISO string from datetime-local

  // displayedAdvocates: sort filtered advocates so those with recent messages appear first
  const displayedAdvocates = useMemo(() => {
    try {
      if (messagesVersion < 0) return [];
      const scores = {};
      if (clientId) {
        filteredAdvocates.forEach(a => {
          const key = `chat_${clientId}_${a.id}`;
          const raw = localStorage.getItem(key);
          if (!raw) { scores[a.id] = 0; return; }
          try {
            const msgs = JSON.parse(raw);
            const last = msgs.length ? msgs[msgs.length - 1] : null;
            scores[a.id] = last && last.t ? new Date(last.t).getTime() : 0;
          } catch { scores[a.id] = 0; }
        });
      }
      // apply "since" filter if provided
      const threshold = since ? (new Date(since)).getTime() : 0;
      return [...filteredAdvocates]
        .map(a => ({ a, t: scores[a.id] || 0 }))
        .filter(x => (threshold ? x.t >= threshold : true))
        .sort((x, y) => {
          if (x.t !== y.t) return y.t - x.t; // recent messages first
          return (x.a.name || "").localeCompare(y.a.name || "");
        })
        .map(x => x.a);
    } catch (e) { return filteredAdvocates; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredAdvocates, clientId, messagesVersion, since]);

  // Read any previously active chat advocate
  const activeChatId = Number(
    sessionStorage.getItem(`law4u_active_chat_${clientId}`) ||
    localStorage.getItem(`law4u_active_chat_${clientId}`) ||
    0
  );
  const activeAdvocate = activeChatId ? advocates.find(a => Number(a.id) === activeChatId) : null;

  // Check if initialPrefill was already sent to this advocate (e.g. user refreshed after sending)
  const isPrefillAlreadySent = useMemo(() => {
    if (!initialPrefill || !activeAdvocate || !clientId) return false;
    try {
      const existing = JSON.parse(localStorage.getItem(`chat_${clientId}_${activeAdvocate.id}`) || "[]");
      return existing.some(m => m.from === "client" && m.text.trim() === initialPrefill.trim());
    } catch {
      return false;
    }
  }, [initialPrefill, activeAdvocate, clientId]);

  // If prefill was already sent, clean URL so refresh keeps the user in conversation view
  useEffect(() => {
    if (isPrefillAlreadySent && (searchParams.get("prefill") || searchParams.get("search"))) {
      navigate('/client-dashboard', { replace: true });
    }
  }, [isPrefillAlreadySent, searchParams, navigate]);

  const targetAdvocateFromParam = initialAdvocateId
    ? advocates.find((a) => Number(a.id) === initialAdvocateId)
    : null;

  // Only show "Choose an Advocate" if this is a fresh unsent case query without a specified advocate
  const hasFreshFilterQuery = !initialAdvocateId && Boolean(initialSearch || initialPrefill || searchParams.get("caseId")) && !isPrefillAlreadySent;

  const [selected, setSelected] = useState(() => {
    if (targetAdvocateFromParam) return targetAdvocateFromParam;
    if (isPrefillAlreadySent && activeAdvocate) return activeAdvocate;
    if (hasFreshFilterQuery) return null;
    return activeAdvocate || advocates[0] || null;
  });

  const [mobileChatActive, setMobileChatActive] = useState(() => {
    if (targetAdvocateFromParam) return true;
    return Boolean(!hasFreshFilterQuery && (activeAdvocate || advocates[0]));
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const [message, setMessage] = useState(() => (isPrefillAlreadySent ? "" : initialPrefill));
  const [messages, setMessages] = useState([]);
  const [editingMsgIndex, setEditingMsgIndex] = useState(null);
  const [editingMsgText, setEditingMsgText] = useState("");
  const [activeMenuMsgIndex, setActiveMenuMsgIndex] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [incomingToast, setIncomingToast] = useState(null);

  const selectedRef = useRef(selected);
  const messagesEndRef = useRef(null);
  const lastAlertedTimeRef = useRef(0);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "nearest" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages.length, selected?.id, scrollToBottom]);

  // Auto-dismiss WhatsApp incoming message toast after 6.5s
  useEffect(() => {
    if (!incomingToast) return;
    const timer = setTimeout(() => {
      setIncomingToast(null);
    }, 6500);
    return () => clearTimeout(timer);
  }, [incomingToast]);

  // Close message context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeMenuMsgIndex !== null && !e.target.closest(".wa-bubble-menu-wrap") && !e.target.closest(".wa-bubble-container")) {
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
  const [ratingMessage, setRatingMessage] = useState("");
  const [ratingDraft, setRatingDraft] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const selectedRating = useMemo(() => {
    if (!selected || messagesVersion < 0) return { rating: 0, count: 0, votes: {} };
    return getAdvocateRatingSummary(selected.id);
  }, [selected, messagesVersion]);

  // Sync draft rating with client's existing vote for the selected advocate
  useEffect(() => {
    if (selected) {
      const myVote = Number(selectedRating.votes?.[String(clientId)] || 0);
      setRatingDraft(myVote);
    } else {
      setRatingDraft(0);
    }
  }, [selected, selectedRating, clientId]);

  // Theme state: 'light' (White Theme) or 'dark' (Black Theme)
  const [theme, setTheme] = useState(getTheme);
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setGlobalTheme(newTheme);
  };

  useEffect(() => {
    const handle = (e) => {
      if (e?.detail) setTheme(e.detail);
    };
    window.addEventListener("law4u_theme_change", handle);
    return () => window.removeEventListener("law4u_theme_change", handle);
  }, []);

  // Language state: 'en' or 'kn'
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || "en");
  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem(LANG_KEY, newLang);
  };
  const pt = PAY_I18N[lang] || PAY_I18N.en;

  // One-time ₹10 consultation fee verification per advocate for this client
  const [, setPaidVersion] = useState(0);
  const isAdvocatePaid = (advId) => {
    if (!advId) return false;
    const cid = clientId || "guest";
    if (localStorage.getItem(`law4u_client_paid_${cid}_adv_${advId}`) === "true") return true;

    // Check if there are already messages exchanged with this advocate
    try {
      const existing = localStorage.getItem(`chat_${cid}_${advId}`);
      if (existing) {
        const msgs = JSON.parse(existing);
        if (Array.isArray(msgs) && msgs.length > 0) {
          localStorage.setItem(`law4u_client_paid_${cid}_adv_${advId}`, "true");
          return true;
        }
      }
    } catch {}

    // Also verify from local/server consultation payments list
    try {
      const raw = localStorage.getItem("law4u_consultation_payments");
      const list = raw ? JSON.parse(raw) : [];
      const cleanPhone = String(clientObj?.phone || "").replace(/\D/g, "").slice(-10);
      const cleanEmail = (clientObj?.email || "").toLowerCase().trim();
      const hasPaid = list.some(p => {
        if (Number(p.advocateId) !== Number(advId)) return false;
        if ((p.status || "").toLowerCase() !== "paid") return false;
        if (cid && (Number(p.clientId) === Number(cid) || String(p.clientId) === String(cid))) return true;
        if (cleanEmail && p.clientEmail && p.clientEmail.toLowerCase().trim() === cleanEmail) return true;
        if (cleanPhone && p.clientPhone && String(p.clientPhone).replace(/\D/g, "").slice(-10) === cleanPhone) return true;
        if (cleanPhone && p.upiId && String(p.upiId).includes(cleanPhone)) return true;
        return false;
      });
      if (hasPaid) {
        localStorage.setItem(`law4u_client_paid_${cid}_adv_${advId}`, "true");
        return true;
      }
    } catch {}

    return false;
  };

  // Sync latest consultation payments from backend server
  useEffect(() => {
    api("/api/consultations")
      .then((serverConsults) => {
        if (!Array.isArray(serverConsults)) return;
        try {
          const raw = localStorage.getItem("law4u_consultation_payments");
          const localList = raw ? JSON.parse(raw) : [];
          const map = new Map();
          serverConsults.forEach(item => map.set(item.id || `${item.clientId}_${item.advocateId}`, item));
          localList.forEach(item => map.set(item.id || `${item.clientId}_${item.advocateId}`, item));
          const merged = Array.from(map.values());
          localStorage.setItem("law4u_consultation_payments", JSON.stringify(merged));
          setPaidVersion(v => v + 1);
        } catch {}
      })
      .catch(() => {});
  }, [clientId]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Avatar state for client
  const [clientAvatar, setClientAvatar] = useState(() => {
    if (clientId) {
      const saved = localStorage.getItem(`law4u_client_avatar_${clientId}`);
      if (saved) return saved;
    }
    if (clientObj?.avatar) return clientObj.avatar;
    if (clientObj?.name && clientObj.name.toLowerCase().includes("chetan")) {
      return "/uploads/chetan.png";
    }
    return "/uploads/chetan.png";
  });

  const [clientMenuOpen, setClientMenuOpen] = useState(false);
  const clientMenuRef = useRef(null);

  // Close profile drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (clientMenuRef.current && clientMenuRef.current.contains(e.target)) return;
      const trigger = document.querySelector(".wa-client-profile");
      if (trigger && trigger.contains(e.target)) return;
      setClientMenuOpen(false);
    };
    if (clientMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clientMenuOpen]);

  const handleSelectClientAvatar = (url) => {
    setClientAvatar(url);
    if (clientId) {
      localStorage.setItem(`law4u_client_avatar_${clientId}`, url);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      handleSelectClientAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Sync advocateId, search and prefill if searchParams change
  useEffect(() => {
    const targetAdvId = Number(searchParams.get("advocateId") || 0);
    if (targetAdvId) {
      const match = advocates.find((a) => Number(a.id) === targetAdvId);
      if (match) {
        setSelected(match);
        setMobileChatActive(true);
        if (clientId) {
          sessionStorage.setItem(`law4u_active_chat_${clientId}`, String(match.id));
          localStorage.setItem(`law4u_active_chat_${clientId}`, String(match.id));
        }
      }
    }

    const q = searchParams.get("search") || searchParams.get("speciality");
    if (q && !targetAdvId) {
      setSearch(q);
      // Only reset selection if this is a fresh inquiry without a targeted advocate
      if (!isPrefillAlreadySent) {
        setSelected(null);
      }
    }
    const pf = searchParams.get("prefill");
    if (pf && !isPrefillAlreadySent) {
      setMessage(pf);
    }
  }, [searchParams, advocates, clientId, isPrefillAlreadySent]);


  useEffect(() => {
    if (!selected) return;
    const key = `chat_${clientId}_${selected.id}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try { setMessages(JSON.parse(raw)); } catch {}
    }
    // Fetch live messages from backend messages.json
    api(`/api/messages?clientId=${clientId}&advocateId=${selected.id}`)
      .then((serverMsgs) => {
        if (Array.isArray(serverMsgs) && serverMsgs.length > 0) {
          localStorage.setItem(key, JSON.stringify(serverMsgs));
          setMessages(serverMsgs);
          scrollToBottom("smooth");
        }
      })
      .catch(() => {});
  }, [selected, clientId, scrollToBottom]);

  // Real-time listener for advocate messages across tabs / BroadcastChannel / intervals with WhatsApp audio chime & popup toast
  useEffect(() => {
    const triggerAdvocateNotification = (payload) => {
      if (!payload) return;
      const msgTime = payload.t ? new Date(payload.t).getTime() : Date.now();
      if (msgTime <= lastAlertedTimeRef.current) return;
      lastAlertedTimeRef.current = msgTime;

      setMessagesVersion(v => v + 1);

      // Play WhatsApp notification chime
      playWhatsAppNotificationSound();

      const curSel = selectedRef.current;
      // If client currently has this advocate's chat open, refresh messages immediately
      if (curSel && Number(curSel.id) === Number(payload.advocateId)) {
        const raw = localStorage.getItem(`chat_${clientId}_${payload.advocateId}`);
        if (raw) {
          setMessages(JSON.parse(raw));
          scrollToBottom("smooth");
        }
      } else {
        // Client is viewing another advocate or list: show popup toast banner!
        const advMatch = advocates.find(a => Number(a.id) === Number(payload.advocateId));
        setIncomingToast({
          advocateId: payload.advocateId,
          advocateName: payload.advocateName || advMatch?.name || "Advocate",
          advocateAvatar: payload.advocateAvatar || advMatch?.avatar || "",
          text: payload.text || "New message",
          t: payload.t || new Date().toISOString()
        });
      }
    };

    // 1. Zero-latency BroadcastChannel
    let channel = null;
    try {
      channel = new BroadcastChannel("law4u_chat_channel");
      channel.onmessage = (event) => {
        const data = event.data;
        if (!data) return;
        if (data.type === "ADVOCATE_MESSAGE" && (Number(data.clientId) === Number(clientId) || !data.clientId)) {
          triggerAdvocateNotification(data);
        } else if (data.type === "CHAT_UPDATED" && (Number(data.clientId) === Number(clientId))) {
          const curSel = selectedRef.current;
          if (curSel && Number(curSel.id) === Number(data.advocateId)) {
            const raw = localStorage.getItem(`chat_${clientId}_${data.advocateId}`);
            if (raw) {
              setMessages(JSON.parse(raw));
              scrollToBottom("smooth");
            }
          }
          setMessagesVersion(v => v + 1);
        }
      };
    } catch (e) {}

    // 2. Custom window events
    const handleAdvocateMsgSent = (e) => {
      const detail = e?.detail;
      if (detail && (!detail.clientId || String(detail.clientId) === String(clientId))) {
        triggerAdvocateNotification(detail);
      }
    };

    const handleChatUpdated = (e) => {
      const detail = e?.detail;
      setMessagesVersion(v => v + 1);
      const curSel = selectedRef.current;
      if (curSel && (detail?.key === `chat_${clientId}_${curSel.id}` || String(detail?.advocateId) === String(curSel.id))) {
        try {
          const raw = localStorage.getItem(`chat_${clientId}_${curSel.id}`);
          if (raw) {
            setMessages(JSON.parse(raw));
            scrollToBottom("smooth");
          }
        } catch {}
      }
    };

    // 3. Storage events
    const handleStorage = (e) => {
      if (!e) return;
      if (e.key === `law4u_notify_client_${clientId}` || e.key === "law4u_latest_advocate_message") {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload && (!payload.clientId || String(payload.clientId) === String(clientId))) {
            triggerAdvocateNotification(payload);
          }
        } catch {}
      } else if (!e.key || e.key.startsWith(`chat_${clientId}_`)) {
        setMessagesVersion(v => v + 1);
        const curSel = selectedRef.current;
        if (curSel) {
          const currentKey = `chat_${clientId}_${curSel.id}`;
          if (!e.key || e.key === currentKey) {
            try {
              const raw = localStorage.getItem(currentKey);
              if (raw) {
                setMessages(JSON.parse(raw));
                scrollToBottom("smooth");
              }
            } catch {}
          }
        }
      }
    };

    window.addEventListener("law4u_advocate_message_sent", handleAdvocateMsgSent);
    window.addEventListener("law4u_chat_updated", handleChatUpdated);
    window.addEventListener("storage", handleStorage);

    // 4. Guaranteed 1000ms polling heartbeat interval (both localStorage and live server messages.json)
    let lastMsgCount = -1;
    let lastAdvId = 0;
    let isPollingServer = false;
    const interval = setInterval(() => {
      const curSel = selectedRef.current;
      if (curSel && curSel.id) {
        const k = `chat_${clientId}_${curSel.id}`;
        try {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (curSel.id !== lastAdvId || parsed.length !== lastMsgCount) {
              lastAdvId = curSel.id;
              lastMsgCount = parsed.length;
              setMessages(parsed);
              setMessagesVersion(v => v + 1);
              scrollToBottom("smooth");
            }
          }
        } catch {}

        // Second-to-second live sync from server backend messages.json
        if (clientId && !isPollingServer) {
          isPollingServer = true;
          api(`/api/messages?clientId=${clientId}&advocateId=${curSel.id}`)
            .then((serverMsgs) => {
              if (Array.isArray(serverMsgs)) {
                const raw = localStorage.getItem(k);
                const localCount = raw ? JSON.parse(raw).length : 0;
                if (serverMsgs.length > localCount) {
                  localStorage.setItem(k, JSON.stringify(serverMsgs));
                  setMessages(serverMsgs);
                  setMessagesVersion(v => v + 1);
                  scrollToBottom("smooth");

                  const latest = serverMsgs[serverMsgs.length - 1];
                  if (latest && latest.from === "advocate") {
                    const msgTime = new Date(latest.t).getTime();
                    if (msgTime > lastAlertedTimeRef.current) {
                      triggerAdvocateNotification(latest);
                    }
                  }
                }
              }
            })
            .catch(() => {})
            .finally(() => {
              isPollingServer = false;
            });
        }
      }
      try {
        const notifRaw = localStorage.getItem(`law4u_notify_client_${clientId}`);
        if (notifRaw) {
          const payload = JSON.parse(notifRaw);
          if (payload && payload.t) {
            const time = new Date(payload.t).getTime();
            if (time > lastAlertedTimeRef.current) {
              triggerAdvocateNotification(payload);
            }
          }
        }
      } catch {}
    }, 1000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("law4u_advocate_message_sent", handleAdvocateMsgSent);
      window.removeEventListener("law4u_chat_updated", handleChatUpdated);
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [clientId, advocates, scrollToBottom]);

  // Emoji & File attachment states for Client chat
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const fileInputRef = useRef(null);

  const EMOJI_LIST = [
    "😊", "😂", "🙏", "⚖️", "📜", "👍",
    "🤝", "📁", "📑", "✅", "📍", "💼",
    "📞", "✉️", "🎯", "⭐", "🔒", "💡"
  ];

  const handleInsertEmoji = (emojiStr) => {
    setMessage((prev) => prev + emojiStr);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const isImg = file.type.startsWith("image/");
    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPendingAttachment({
        fileName: file.name,
        fileSize: sizeFormatted,
        fileType: file.type,
        dataUrl: event.target.result,
        isImage: isImg,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const sendMessage = () => {
    if ((!message.trim() && !pendingAttachment) || !selected) return;
    const textToSend = message.trim();

    // Check if client has already paid the one-time ₹10 fee for this specific advocate
    if (!isAdvocatePaid(selected.id)) {
      setPendingMessage(textToSend);
      setShowPaymentModal(true);
      return;
    }

    executeSendMessage(textToSend);
  };

  const executeSendMessage = (textToSend) => {
    const key = `chat_${clientId}_${selected.id}`;
    const clientAvatar = clientObj?.avatar || localStorage.getItem(`law4u_client_avatar_${clientId}`) || undefined;
    const newMsgObj = {
      from: "client",
      text: textToSend,
      t: new Date().toISOString(),
      clientName: clientObj?.name || undefined,
      clientAvatar: clientAvatar,
      replyTo: replyingTo ? {
        text: replyingTo.text,
        sender: replyingTo.sender,
        from: replyingTo.from
      } : null
    };
    if (pendingAttachment) {
      newMsgObj.attachment = pendingAttachment;
    }
    const next = [...messages, newMsgObj];
    localStorage.setItem(key, JSON.stringify(next));
    setMessages(next);
    setMessage("");
    setPendingAttachment(null);
    setShowEmojiPicker(false);
    setReplyingTo(null);

    // Persist message to backend server messages.json
    api("/api/messages", {
      method: "POST",
      body: {
        clientId,
        advocateId: selected.id,
        key,
        from: "client",
        text: textToSend,
        attachment: pendingAttachment ? { ...pendingAttachment } : null,
        replyTo: newMsgObj.replyTo,
        clientName: clientObj?.name || (clientId ? `Client #${clientId}` : "Client"),
        clientAvatar: clientAvatar || "",
        advocateName: selected?.name || "Advocate",
        advocateAvatar: selected?.avatar || "",
        t: newMsgObj.t,
      },
    }).catch((err) => console.warn("Failed to persist client message to server:", err));

    // Sync with law4u_requests so advocate dashboard updates immediately
    try {
      const allReqsRaw = localStorage.getItem("law4u_requests");
      const allReqs = allReqsRaw ? JSON.parse(allReqsRaw) : {};
      const advId = selected.id;
      const advReqs = allReqs[advId] || [];
      const matchIdx = advReqs.findIndex(r => (r.clientId && String(r.clientId) === String(clientId)) || String(r.id) === String(clientId) || (clientObj?.name && r.clientName === clientObj.name));
      if (matchIdx >= 0) {
        advReqs[matchIdx] = {
          ...advReqs[matchIdx],
          lastMessage: textToSend,
          requestedAt: newMsgObj.t,
          clientName: clientObj?.name || advReqs[matchIdx].clientName,
          clientAvatar: clientAvatar || advReqs[matchIdx].clientAvatar,
          clientPhone: clientObj?.phone || advReqs[matchIdx].clientPhone,
          clientEmail: clientObj?.email || advReqs[matchIdx].clientEmail,
          clientCity: clientObj?.city || advReqs[matchIdx].clientCity
        };
      } else {
        advReqs.unshift({
          id: clientId || Date.now(),
          clientId: clientId || Date.now(),
          clientName: clientObj?.name || (clientId ? `Client #${clientId}` : "Client"),
          clientAvatar: clientAvatar || "",
          clientPhone: clientObj?.phone || "",
          clientEmail: clientObj?.email || "",
          clientCity: clientObj?.city || "Online",
          requestedAt: newMsgObj.t,
          message: textToSend,
          lastMessage: textToSend,
          status: "accepted",
          paymentStatus: "Paid / Completed",
          caseStage: "Start Case",
          fee: selected?.fee || "₹2,000"
        });
      }
      allReqs[advId] = advReqs;
      localStorage.setItem("law4u_requests", JSON.stringify(allReqs));
    } catch (e) { /* ignore */ }

    // Broadcast instant client message event & notification keys for Advocate Dashboard
    try {
      const notifPayload = {
        clientId,
        advocateId: selected.id,
        text: textToSend,
        t: newMsgObj.t,
        clientName: clientObj?.name || (clientId ? `Client #${clientId}` : "Client"),
        clientAvatar: clientAvatar
      };
      localStorage.setItem("law4u_latest_client_message", JSON.stringify(notifPayload));
      localStorage.setItem(`law4u_notify_adv_${selected.id}`, JSON.stringify(notifPayload));

      try {
        const channel = new BroadcastChannel("law4u_chat_channel");
        channel.postMessage({
          type: "CLIENT_MESSAGE",
          clientId,
          advocateId: selected.id,
          clientName: notifPayload.clientName,
          clientAvatar: notifPayload.clientAvatar,
          text: textToSend,
          t: newMsgObj.t,
          replyTo: newMsgObj.replyTo,
          attachment: newMsgObj.attachment
        });
        channel.postMessage({
          type: "CHAT_UPDATED",
          clientId,
          advocateId: selected.id,
          key
        });
        channel.postMessage({
          type: "REQUESTS_UPDATED",
          advocateId: selected.id
        });
        channel.close();
      } catch (bcErr) {}

      window.dispatchEvent(new CustomEvent("law4u_client_message_sent", { detail: notifPayload }));
      window.dispatchEvent(new CustomEvent("law4u_chat_updated", { detail: { key, clientId, advocateId: selected.id } }));
      window.dispatchEvent(new CustomEvent("law4u_requests_updated"));
      window.dispatchEvent(new Event("storage"));
    } catch (e) { /* ignore */ }

    scrollToBottom("smooth");

    // Remember this advocate as active chat
    if (clientId && selected) {
      sessionStorage.setItem(`law4u_active_chat_${clientId}`, String(selected.id));
      localStorage.setItem(`law4u_active_chat_${clientId}`, String(selected.id));
    }

    // Clean URL so browser refresh stays in active chat without re-triggering case setup
    navigate('/client-dashboard', { replace: true });
  };

  // Delete message (WhatsApp style: "🚫 This message was deleted")
  const handleDeleteChatMessage = (msgIndex) => {
    if (!selected) return;
    const key = `chat_${clientId}_${selected.id}`;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const msgs = JSON.parse(raw);
    if (!msgs[msgIndex]) return;

    msgs[msgIndex] = {
      ...msgs[msgIndex],
      isDeleted: true,
      text: "",
      attachment: null,
      deletedAt: new Date().toISOString(),
      deletedBy: "client"
    };

    localStorage.setItem(key, JSON.stringify(msgs));
    setMessages(msgs);

    // Update law4u_requests if this was the last message
    try {
      const allReqsRaw = localStorage.getItem("law4u_requests");
      if (allReqsRaw) {
        const allReqs = JSON.parse(allReqsRaw);
        const advReqs = allReqs[selected.id] || [];
        const mIdx = advReqs.findIndex(r => String(r.clientId || r.id) === String(clientId));
        if (mIdx >= 0) {
          const lastM = msgs[msgs.length - 1];
          advReqs[mIdx].lastMessage = lastM?.isDeleted ? "🚫 This message was deleted" : (lastM?.text || "");
          allReqs[selected.id] = advReqs;
          localStorage.setItem("law4u_requests", JSON.stringify(allReqs));
        }
      }
    } catch {}

    try {
      const channel = new BroadcastChannel("law4u_chat_channel");
      channel.postMessage({
        type: "CHAT_UPDATED",
        clientId,
        advocateId: selected.id,
        key
      });
      channel.close();
    } catch (bcErr) {}

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("law4u_requests_updated"));
    window.dispatchEvent(new CustomEvent("law4u_chat_updated", { detail: { key, clientId, advocateId: selected.id } }));
  };

  // Edit message (adds "Edited" tag and updates text)
  const handleSaveEditChatMessage = (msgIndex, newText) => {
    if (!selected || !newText.trim()) return;
    const key = `chat_${clientId}_${selected.id}`;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const msgs = JSON.parse(raw);
    if (!msgs[msgIndex]) return;

    msgs[msgIndex] = {
      ...msgs[msgIndex],
      text: newText.trim(),
      isEdited: true,
      editedAt: new Date().toISOString()
    };

    localStorage.setItem(key, JSON.stringify(msgs));
    setMessages(msgs);
    setEditingMsgIndex(null);
    setEditingMsgText("");

    // Update law4u_requests if this was the last message
    try {
      const allReqsRaw = localStorage.getItem("law4u_requests");
      if (allReqsRaw) {
        const allReqs = JSON.parse(allReqsRaw);
        const advReqs = allReqs[selected.id] || [];
        const mIdx = advReqs.findIndex(r => String(r.clientId || r.id) === String(clientId));
        if (mIdx >= 0) {
          const lastM = msgs[msgs.length - 1];
          advReqs[mIdx].lastMessage = lastM?.isDeleted ? "🚫 This message was deleted" : (lastM?.text || "");
          allReqs[selected.id] = advReqs;
          localStorage.setItem("law4u_requests", JSON.stringify(allReqs));
        }
      }
    } catch {}

    try {
      const channel = new BroadcastChannel("law4u_chat_channel");
      channel.postMessage({
        type: "CHAT_UPDATED",
        clientId,
        advocateId: selected.id,
        key
      });
      channel.close();
    } catch (bcErr) {}

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("law4u_requests_updated"));
    window.dispatchEvent(new CustomEvent("law4u_chat_updated", { detail: { key, clientId, advocateId: selected.id } }));
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
    const isClient = msg.from === "client";
    const senderName = isClient ? "You" : (selected?.name || "Advocate");
    setReplyingTo({
      text: msg.text || (msg.attachment ? `[Attachment: ${msg.attachment.fileName}]` : "Message"),
      sender: senderName,
      from: msg.from
    });
    setActiveMenuMsgIndex(null);
    setTimeout(() => {
      const inputEl = document.querySelector(".wa-input-box input");
      if (inputEl) inputEl.focus();
    }, 50);
  };

  const handleConfirmPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const cid = clientId || "guest";
      const msg = pendingMessage || message.trim();
      if (selected?.id) {
        localStorage.setItem(`law4u_client_paid_${cid}_adv_${selected.id}`, "true");
        setPaidVersion(v => v + 1);

        // Record consultation payment for admin dashboard
        const payRecord = {
          id: `PAY_${cid}_${selected.id}_${Date.now()}`,
          clientId: cid,
          clientName: clientObj?.name || (clientId ? `Client #${clientId}` : "Client"),
          clientEmail: clientObj?.email || "",
          clientPhone: clientObj?.phone || "",
          clientCity: clientObj?.city || "",
          advocateId: selected.id,
          advocateName: selected.name,
          advocateSpec: selected.speciality || selected.practiceArea || "",
          advocateCity: selected.city || "",
          amount: 10,
          currency: "INR",
          method: "PhonePe UPI",
          upiId: "9108717353-3@ybl",
          status: "Paid",
          paidAt: new Date().toISOString(),
          message: msg,
        };

        try {
          const raw = localStorage.getItem("law4u_consultation_payments");
          const list = raw ? JSON.parse(raw) : [];
          list.unshift(payRecord);
          localStorage.setItem("law4u_consultation_payments", JSON.stringify(list));
        } catch {}

        api("/api/consultations", { method: "POST", body: payRecord }).catch(() => {});
      }
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        if (msg && selected) {
          executeSendMessage(msg);
          setPendingMessage("");
        }
      }, 800);
    }, 1200);
  };

  const handleRatingSubmitClick = async () => {
    if (!selected || !clientId || !ratingDraft) return;
    setIsSubmittingRating(true);
    try {
      const summary = await submitAdvocateRating(selected.id, clientId, ratingDraft, clientObj?.name || "Client");
      setSelected(prev => prev ? { ...prev, rating: summary.rating, ratingCount: summary.count } : prev);
      setRatingMessage(
        lang === "kn"
          ? `✅ ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ${ratingDraft}-ಸ್ಟಾರ್ ರೇಟಿಂಗ್ ಅನ್ನು advocates.json ನಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ. ಹೊಸ ಸರಾಸರಿ: ⭐ ${Number(summary.rating).toFixed(1)} / 5 (${summary.count} ರೇಟಿಂಗ್‌ಗಳು).`
          : `✅ Thank you! Your ${ratingDraft}-star rating was saved to advocates.json. New average: ⭐ ${Number(summary.rating).toFixed(1)} / 5 (${summary.count} rating${summary.count === 1 ? "" : "s"}).`
      );
      setTimeout(() => setRatingMessage(""), 5000);
      setMessagesVersion(v => v + 1);
    } catch (e) {
      console.error(e);
      setRatingMessage(lang === "kn" ? "ರೇಟಿಂಗ್ ಉಳಿಸುವಲ್ಲಿ ದೋಷ ಉಂಟಾಗಿದೆ." : "Error saving rating.");
      setTimeout(() => setRatingMessage(""), 3000);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleLogout = useCallback(() => {
    try {
      // clear client session
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(CLIENT_OBJ_KEY);
      sessionStorage.removeItem(CLIENT_OBJ_KEY);
      localStorage.removeItem(CLIENT_TOKEN_KEY);
      sessionStorage.removeItem(CLIENT_TOKEN_KEY);
    } catch (e) { /* ignore */ }
    navigate('/client-login');
  }, [navigate]);

  const requestLogout = () => setShowLogoutConfirm(true);
  const cancelLogout = () => setShowLogoutConfirm(false);
  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    handleLogout();
  };

  // Validate stored token with backend; if invalid (e.g. password reset), force logout
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem(CLIENT_TOKEN_KEY) || sessionStorage.getItem(CLIENT_TOKEN_KEY);
        if (!token) {
          if (clientId) handleLogout();
          return;
        }
        const res = await fetch(`/api/auth/me`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) handleLogout();
        } else {
          const data = await res.json().catch(() => null);
          // If backend returns a different client id, also logout
          if (!data || data.role !== 'client' || Number(data.client.id) !== Number(clientId)) handleLogout();
        }
      } catch (err) {
        // network issues: don't auto-logout
      }
    })();
  }, [clientId, handleLogout]);

  if (!clientId) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Please sign in as a client</h2>
        <p>
          <Link to="/client-login">Go to Client Login</Link> to access your dashboard and chat with advocates.
        </p>
      </div>
    );
  }
  return (
    <>
      {showLogoutConfirm && (
        <div className="wa-logout-overlay" onClick={cancelLogout}>
          <div className="wa-logout-card" onClick={(e) => e.stopPropagation()}>
            <div className="wa-logout-icon">⏻</div>
            <div className="wa-logout-title">Log out of your account?</div>
            <div className="wa-logout-actions">
              <button type="button" className="wa-logout-btn-cancel" onClick={cancelLogout}>Stay signed in</button>
              <button type="button" className="wa-logout-btn-confirm" onClick={confirmLogout}>Log out</button>
            </div>
          </div>
        </div>
      )}
      {/* Real-time WhatsApp Incoming Message Toast from Advocate */}
      {incomingToast && (
        <div
          className="wa-toast-notification"
          onClick={() => {
            const advMatch = advocates.find(a => Number(a.id) === Number(incomingToast.advocateId));
            if (advMatch) {
              setSelected(advMatch);
              setMobileChatActive(true);
            }
            setIncomingToast(null);
          }}
          role="alert"
        >
          <div className="wa-toast-avatar-box">
            {incomingToast.advocateAvatar ? (
              <img
                src={assetUrl ? assetUrl(incomingToast.advocateAvatar) : incomingToast.advocateAvatar}
                alt={incomingToast.advocateName}
                className="wa-toast-avatar"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = "flex";
                  }
                }}
              />
            ) : null}
            <div
              className="wa-toast-avatar-fallback"
              style={{ display: incomingToast.advocateAvatar ? "none" : "flex" }}
            >
              {(incomingToast.advocateName || "A").charAt(0).toUpperCase()}
            </div>
            <span className="wa-toast-online-pip" />
          </div>
          <div className="wa-toast-content">
            <div className="wa-toast-header">
              <span className="wa-toast-title">{incomingToast.advocateName}</span>
              <span className="wa-toast-tag">WhatsApp Message</span>
            </div>
            <div className="wa-toast-msg">{incomingToast.text}</div>
          </div>
          <div className="wa-toast-actions">
            <button
              type="button"
              className="wa-toast-open-btn"
              onClick={(e) => {
                e.stopPropagation();
                const advMatch = advocates.find(a => Number(a.id) === Number(incomingToast.advocateId));
                if (advMatch) {
                  setSelected(advMatch);
                  setMobileChatActive(true);
                }
                setIncomingToast(null);
              }}
            >
              Reply →
            </button>
            <button
              type="button"
              className="wa-toast-dismiss-btn"
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

      <div className={`wa-top-band ${theme === "dark" ? "wa-dark" : ""}`} />
      <div
        className={`wa-app-shell ${theme === "dark" ? "wa-dark" : ""} ${
          mobileChatActive && selected ? "mobile-show-chat" : "mobile-show-list"
        }`}
        style={{ top: 0 }}
      >
      <aside className="wa-sidebar">
        {/* WhatsApp Web Full-Page Profile Drawer */}
        {clientMenuOpen && (
          <div className="wa-profile-fullpage-drawer" ref={clientMenuRef}>
            <div className="wa-pfd-header">
              <button
                type="button"
                className="wa-pfd-back-btn"
                onClick={() => setClientMenuOpen(false)}
                title={lang === "kn" ? "ಹಿಂದಕ್ಕೆ" : "Back to chats"}
                aria-label="Back to chats"
              >
                ←
              </button>
              <div className="wa-pfd-title">{lang === "kn" ? "ಪ್ರೊಫೈಲ್" : "Profile"}</div>
            </div>

            <div className="wa-pfd-body">
              {/* Profile Avatar Hero */}
              <div className="wa-pfd-avatar-hero">
                <label className="wa-pfd-avatar-circle" title={lang === "kn" ? "ಫೋಟೋ ಬದಲಾಯಿಸಿ" : "Change Profile Photo"}>
                  {clientAvatar ? (
                    <img
                      src={assetUrl(clientAvatar)}
                      alt={clientObj?.name || "Client"}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerText = (clientObj?.name || "C").charAt(0).toUpperCase();
                        }
                      }}
                    />
                  ) : (
                    (clientObj?.name || "C").charAt(0).toUpperCase()
                  )}
                  <div className="wa-pfd-avatar-overlay">
                    <span style={{ fontSize: "28px" }}>📷</span>
                    <span>{lang === "kn" ? "ಫೋಟೋ ಬದಲಾಯಿಸಿ" : "Change Profile Photo"}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>

              {/* Card 1: Your Name */}
              <div className="wa-pfd-card">
                <div className="wa-pfd-label">{lang === "kn" ? "ನಿಮ್ಮ ಹೆಸರು" : "Your name"}</div>
                <div className="wa-pfd-value">{clientObj?.name || "Client"}</div>
              </div>

              {/* Card 2: About & Account */}
              <div className="wa-pfd-card">
                <div className="wa-pfd-label">{lang === "kn" ? "ವಿವರಣೆ (About)" : "About"}</div>
                <div className="wa-pfd-value">
                  {lang === "kn" ? "⚖️ ಸಮಾಲೋಚನೆಗಾಗಿ ಸಿದ್ಧರಾಗಿರುವ ಕ್ಲೈಂಟ್ ಖಾತೆ" : "⚖️ Ready for Legal Consultations & Advice"}
                </div>
              </div>

              {/* Card 3: Theme Mode */}
              <div className="wa-pfd-card">
                <div className="wa-pfd-label">{lang === "kn" ? "ಥೀಮ್ ಮೋಡ್ (Theme)" : "Theme Mode"}</div>
                <div className="wa-pfd-segmented">
                  <button
                    type="button"
                    className={`wa-pfd-seg-btn ${theme === "light" ? "active" : ""}`}
                    onClick={() => handleThemeChange("light")}
                  >
                    ☀️ {lang === "kn" ? "ಲೈಟ್ (White)" : "White (Light)"}
                  </button>
                  <button
                    type="button"
                    className={`wa-pfd-seg-btn ${theme === "dark" ? "active" : ""}`}
                    onClick={() => handleThemeChange("dark")}
                  >
                    🌙 {lang === "kn" ? "ಡಾರ್ಕ್ (Black)" : "Black (Dark)"}
                  </button>
                </div>
              </div>

              {/* Card 4: Language */}
              <div className="wa-pfd-card">
                <div className="wa-pfd-label">{lang === "kn" ? "ಭಾಷೆ (Language)" : "Language"}</div>
                <div className="wa-pfd-segmented">
                  <button
                    type="button"
                    className={`wa-pfd-seg-btn ${lang === "en" ? "active" : ""}`}
                    onClick={() => handleLanguageChange("en")}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    className={`wa-pfd-seg-btn ${lang === "kn" ? "active" : ""}`}
                    onClick={() => handleLanguageChange("kn")}
                  >
                    ಕನ್ನಡ (Kannada)
                  </button>
                </div>
              </div>

              {/* Card 5: Navigation & Account Actions */}
              <div className="wa-pfd-card">
                <div className="wa-pfd-label">{lang === "kn" ? "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು" : "Navigation & Actions"}</div>
                <div className="wa-pfd-actions">
                  
                  <button
                    type="button"
                    className="wa-pfd-btn"
                    onClick={() => {
                      setClientMenuOpen(false);
                      navigate("/client-main");
                    }}
                  >
                     {lang === "kn" ? "ಕ್ಲೈಂಟ್ ಸೇವಾ ಕೇಂದ್ರ & ಸ್ಪಷ್ಟತೆ" : "Client Main Portal & Clarity Hub"}
                  </button>
                 
                  <button
                    type="button"
                    className="wa-pfd-btn wa-pfd-btn-logout"
                    onClick={() => {
                      setClientMenuOpen(false);
                      requestLogout();
                    }}
                  >
                    🚪 {lang === "kn" ? "ಲಾಗ್‌ಔಟ್ ಮಾಡಿ (Logout)" : "Logout Account"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="wa-sidebar-top">
          {/* Profile & Theme Avatar Trigger */}
          <div className="wa-client-profile-wrap">
            <div
              className={`wa-client-profile ${clientMenuOpen ? "active" : ""}`}
              onClick={() => setClientMenuOpen((prev) => !prev)}
              title="Click to view Profile, Themes & Settings"
              role="button"
              tabIndex={0}
            >
              <div className="wa-client-profile-left">
                <div className="wa-client-avatar">
                  {clientAvatar ? (
                    <img
                      src={assetUrl(clientAvatar)}
                      alt={clientObj?.name || "Client"}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerText = (clientObj?.name || "C").charAt(0).toUpperCase();
                        }
                      }}
                    />
                  ) : (
                    (clientObj?.name || "C").charAt(0).toUpperCase()
                  )}
                </div>
                <div className="wa-client-info">
                  <div className="wa-client-name-row">
                    <div className="wa-client-name">{clientObj?.name || "Client"}</div>
                  </div>
                  <div className="wa-client-role">Client Dashboard</div>
                </div>
              </div>
              <div className="wa-profile-menu-trigger" title="Open Profile Menu">
                <span className="wa-profile-menu-dots">⋮</span>
              </div>
            </div>
          </div>
        </div>

        <div className="wa-search-section">
          <div className="wa-search-input-box">
            <span className="wa-search-glyph">🔍</span>
            <input
              placeholder="Search advocates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const first = displayedAdvocates[0];
                  if (first) setSelected(first);
                }
              }}
            />
          </div>

          {search && (
            <div className="wa-search-filter-badge">
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "85%" }}>
                🎯 Filter: <strong>{search}</strong> ({displayedAdvocates.length})
              </span>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="wa-search-filter-clear"
                title="Clear filter"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="wa-advocates-list">
          {displayedAdvocates.length === 0 && <div className="wa-empty-list">No advocates match your search.</div>}
          {displayedAdvocates.map((a) => (
            <div
              key={a.id}
              onClick={() => {
                setSelected(a);
                setMobileChatActive(true);
                if (clientId && a) {
                  sessionStorage.setItem(`law4u_active_chat_${clientId}`, String(a.id));
                  localStorage.setItem(`law4u_active_chat_${clientId}`, String(a.id));
                }
                navigate(`/client-dashboard?advocateId=${a.id}`, { replace: true });
              }}
              className={`wa-advocate-row ${selected && selected.id === a.id ? "selected" : ""}`}
            >
              <div className="wa-avatar-box">
                {a.avatar ? (
                  <img src={assetUrl ? assetUrl(a.avatar) : a.avatar} alt={a.name} className="wa-avatar-img" />
                ) : (
                  <div className="wa-avatar-fallback">{(a.name || "").split(" ").map(s => s[0]).slice(0,2).join("")}</div>
                )}
              </div>
              <div className="wa-advocate-meta">
                <div className="wa-meta-header">
                  <div className="wa-advocate-title">{a.name}</div>
                  <div className="wa-meta-time">{a.city}</div>
                </div>
                <div className="wa-meta-sub">
                  <div className="wa-advocate-desc">{a.speciality || a.practiceArea}</div>
                  <div className={`wa-advocate-fee-chip ${isAdvocatePaid(a.id) ? "paid" : "unpaid"}`}>
                    {isAdvocatePaid(a.id) ? "✓ Active" : "₹10 Chat"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {selected && profileOpen && (
        !isAdvocatePaid(selected.id) ? (
          <div className="wa-profile-overlay" onClick={() => setProfileOpen(false)}>
            <div className={`wa-profile-card wa-profile-card-locked ${theme === "dark" ? "dark" : ""}`} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "460px", textAlign: "center" }}>
              <button className="wa-profile-close" type="button" onClick={() => setProfileOpen(false)}>×</button>
              <div style={{ padding: "30px 16px" }}>
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>🔒</div>
                <h2 style={{ fontSize: "22px", fontWeight: "800", color: theme === "dark" ? "#f8fafc" : "#0f172a", marginBottom: "10px" }}>
                  {lang === "kn" ? "ವಕೀಲರ ಪ್ರೊಫೈಲ್ ಲಾಕ್ ಆಗಿದೆ" : "Advocate Profile Locked"}
                </h2>
                <p style={{ color: theme === "dark" ? "#94a3b8" : "#64748b", fontSize: "14px", lineHeight: "1.6", maxWidth: "340px", margin: "0 auto 24px" }}>
                  {lang === "kn"
                    ? `${selected.name} ಅವರ ಸಂಪೂರ್ಣ ಪ್ರೊಫೈಲ್, ರೇಟಿಂಗ್‌ಗಳು ಮತ್ತು ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ₹10 ಒಂದು ಬಾರಿಯ ಸಮಾಲೋಚನಾ ಶುಲ್ಕ ಪಾವತಿಸಿ.`
                    : `Complete the one-time ₹10 consultation fee to unlock and view ${selected.name}'s verified credentials, bar council record, ratings, and direct contact details.`}
                </p>
                <button
                  type="button"
                  className="wa-pay-confirm-btn"
                  style={{ width: "100%", padding: "13px 20px", fontSize: "15px", fontWeight: "700" }}
                  onClick={() => {
                    setProfileOpen(false);
                    setShowPaymentModal(true);
                  }}
                >
                  ✓ {lang === "kn" ? "₹10 ಪಾವತಿಸಿ ಪ್ರೊಫೈಲ್ ಅನ್‌ಲಾಕ್ ಮಾಡಿ →" : "Pay ₹10 to Unlock Profile Details →"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="wa-profile-overlay" onClick={() => setProfileOpen(false)}>
            <div className={`wa-profile-card ${theme === "dark" ? "dark" : ""}`} onClick={(e) => e.stopPropagation()}>
              <button className="wa-profile-close" type="button" onClick={() => setProfileOpen(false)}>×</button>
              <div className="wa-profile-header">
              <div className="wa-profile-avatar-wrap">
                {selected.avatar ? (
                  <img src={assetUrl ? assetUrl(selected.avatar) : selected.avatar} alt={selected.name} className="wa-profile-avatar" />
                ) : (
                  <div className="wa-profile-avatar-fallback">{(selected.name || "").split(" ").map(s => s[0]).slice(0,2).join("")}</div>
                )}
              </div>
              <div className="wa-profile-header-text">
                <h2>{selected.name}</h2>
                <p>{selected.speciality || selected.practiceArea || "Legal Consultant"}</p>
                <span>{selected.city || "Location not specified"}</span>
              </div>
            </div>

            <div className="wa-profile-stats">
              <div className="wa-profile-stat">
                <strong>{selected.experience || "5+"}</strong>
                <span>Experience</span>
              </div>
              <div className="wa-profile-stat">
                <strong>⭐ {selectedRating.rating ? Number(selectedRating.rating).toFixed(1) : (Number(selected.rating) || 5.0).toFixed(1)}</strong>
                <span>{lang === "kn" ? "ಸರಾಸರಿ ರೇಟಿಂಗ್" : "Avg Rating"} ({selectedRating.count || selected.ratingCount || 0})</span>
              </div>
              <div className="wa-profile-stat">
                <strong>{selected.cases ? `${selected.cases}+` : "100+"}</strong>
                <span>Cases</span>
              </div>
            </div>

            <div className="wa-profile-body">
              <div className="wa-profile-section">
                <div className="wa-rating-header-row">
                  <h3>{lang === "kn" ? "ಈ ವಕೀಲರಿಗೆ ರೇಟಿಂಗ್ ನೀಡಿ" : "Rate this Advocate"}</h3>
                </div>

                <div className="wa-rating-box">
                  {/* Movie style Average Summary Banner */}
                  <div className="wa-rating-summary-card">
                    <div className="wa-rating-score-display">
                      <span className="wa-score-star">⭐</span>
                      <span className="wa-score-val">{Number(selectedRating.rating || selected.rating || 5.0).toFixed(1)}</span>
                      <span className="wa-score-max">/ 5.0</span>
                    </div>
                    <div className="wa-rating-votes-info">
                      <strong>{selectedRating.count || selected.ratingCount || 0}</strong> {((selectedRating.count || selected.ratingCount || 0) === 1) ? (lang === "kn" ? "ಗ್ರಾಹಕರ ರೇಟಿಂಗ್" : "client rating") : (lang === "kn" ? "ಗ್ರಾಹಕರ ರೇಟಿಂಗ್‌ಗಳು" : "client ratings")}
                      <div className="wa-rating-calc-note">
                        {lang === "kn"
                          ? "ಎಲ್ಲಾ ಗ್ರಾಹಕರ ರೇಟಿಂಗ್‌ಗಳ ಸರಾಸರಿ ಲೆಕ್ಕಾಚಾರ (Movie Rating ಶೈಲಿ)"
                          : "Combined average calculated across all client ratings (Movie Rating Model)"}
                      </div>
                    </div>
                  </div>

                  {/* Star Picker */}
                  <div className="wa-star-picker-container">
                    <div className="wa-star-selection-label">
                      {ratingDraft > 0 ? (
                        <span>
                          {lang === "kn" ? "ನಿಮ್ಮ ಆಯ್ಕೆ:" : "Your selection:"} <strong>{ratingDraft} ★</strong>
                          {selectedRating.votes?.[String(clientId)] ? (
                            <span style={{ color: "#64748b", fontSize: "0.82rem", marginLeft: 6 }}>
                              ({lang === "kn" ? "ದಾಖಲೆಯಲ್ಲಿರುವ ರೇಟಿಂಗ್:" : "Current in records:"} {selectedRating.votes[String(clientId)]} ★)
                            </span>
                          ) : null}
                        </span>
                      ) : selectedRating.votes?.[String(clientId)] ? (
                        <span>
                          {lang === "kn" ? "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ರೇಟಿಂಗ್:" : "Your current rating:"} <strong>{selectedRating.votes[String(clientId)]} ★</strong>
                        </span>
                      ) : (
                        <span>{lang === "kn" ? "ನಕ್ಷತ್ರಗಳನ್ನು ಆರಿಸಿ (1 ರಿಂದ 5):" : "Select stars (1 to 5):"}</span>
                      )}
                    </div>

                    <div className="wa-stars" aria-label="Rate advocate from 1 to 5 stars">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isHovered = hoverRating > 0 && star <= hoverRating;
                        const isSelected = !hoverRating && star <= (ratingDraft || Number(selectedRating.votes?.[String(clientId)] || 0));
                        return (
                          <button
                            key={star}
                            type="button"
                            className={`wa-star-btn ${isHovered || isSelected ? "filled" : ""}`}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRatingDraft(star)}
                            aria-label={`Select ${star} stars`}
                          >
                            ★
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="wa-rating-submit-row">
                    <button
                      type="button"
                      className="wa-rating-submit-btn"
                      onClick={handleRatingSubmitClick}
                      disabled={!ratingDraft || isSubmittingRating}
                    >
                      {isSubmittingRating
                        ? (lang === "kn" ? "⏳ ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ..." : "⏳ Submitting Rating...")
                        : (lang === "kn" ? "⭐ ರೇಟಿಂಗ್ ಸಲ್ಲಿಸಿ (Submit Rating)" : "⭐ Submit Rating")}
                    </button>
                    {ratingDraft > 0 && ratingDraft !== Number(selectedRating.votes?.[String(clientId)] || 0) && (
                      <button
                        type="button"
                        className="wa-rating-cancel-btn"
                        onClick={() => setRatingDraft(Number(selectedRating.votes?.[String(clientId)] || 0))}
                      >
                        {lang === "kn" ? "ಮರುಹೊಂದಿಸಿ" : "Reset"}
                      </button>
                    )}
                  </div>

                  {ratingMessage && <div className="wa-rating-message">{ratingMessage}</div>}
                </div>
              </div>
              <div className="wa-profile-section">
                <h3>About</h3>
                <p>{selected.bio || "Experienced legal advocate focused on client support, strategic case guidance, and timely legal advice."}</p>
              </div>

              <div className="wa-profile-section">
                <h3>Practice Areas</h3>
                <div className="wa-profile-tags">
                  {[selected.practiceArea, selected.speciality].filter(Boolean).slice(0, 4).map((item, index) => (
                    <span key={`${item}-${index}`} className="wa-profile-tag">{item}</span>
                  ))}
                </div>
              </div>

              <div className="wa-profile-contact-grid">
                <div className="wa-profile-contact-item">
                  <label>Email</label>
                  <strong>{selected.email || "not provided"}</strong>
                </div>
                <div className="wa-profile-contact-item">
                  <label>Phone</label>
                  <strong>{selected.phone || "not provided"}</strong>
                </div>
              </div>
            </div>

            <div className="wa-profile-actions">
              <button className="wa-profile-btn secondary" type="button" onClick={() => setProfileOpen(false)}>Close</button>
              <button className="wa-profile-btn primary" type="button" onClick={() => setProfileOpen(false)}>Start Chat</button>
            </div>
          </div>
        </div>
        )
      )}

      <main className="wa-chat-panel">
        <div className="wa-chat-header">
          <button
            type="button"
            className="wa-mobile-back-btn"
            onClick={() => setMobileChatActive(false)}
            title={lang === "kn" ? "ವಕೀಲರ ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ" : "Back to advocates list"}
            aria-label="Back to advocates list"
          >
            ‹
          </button>
          {selected ? (
            <div
              className="wa-header-contact-info"
              onClick={() => {
                if (!isAdvocatePaid(selected.id)) {
                  setShowPaymentModal(true);
                  return;
                }
                setProfileOpen(true);
              }}
              title={isAdvocatePaid(selected.id) ? "View Advocate Profile" : "🔒 Complete ₹10 Payment to Unlock Profile Details"}
              style={{ cursor: "pointer" }}
            >
              <div className="wa-header-avatar">
                {selected && selected.avatar ? (
                  <img src={assetUrl ? assetUrl(selected.avatar) : selected.avatar} alt={selected.name} style={{ width:48, height:48, borderRadius:12, objectFit: 'cover' }} />
                ) : (
                  (selected.name||"").split(" ").map(s=>s[0]).slice(0,2).join("")
                )}
              </div>
              <div className="wa-header-text">
                <div className="wa-header-title">{selected.name} <span className="wa-badge-check">✓</span></div>
                <div className="wa-header-subtitle">
                  {selected.speciality || selected.practiceArea} · {isAdvocatePaid(selected.id) ? (
                    <span style={{ color: "#00a884", fontWeight: 700 }}>✓ {lang === "kn" ? "ಸಕ್ರಿಯ ಸಮಾಲೋಚನೆ" : "Consultation Active"}</span>
                  ) : (
                    <span style={{ color: "#7c3aed", fontWeight: 700 }}>🔒 {lang === "kn" ? "₹10 ಒಂದು ಬಾರಿ ಶುಲ್ಕ" : "₹10 Activation"}</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: "var(--wa-text-secondary)", fontWeight: 600, fontSize: "0.95rem" }}>
              👈 {lang === "kn" ? "ಚಾಟ್ ಮಾಡಲು ಎಡಭಾಗದ ಪಟ್ಟಿಯಿಂದ ವಕೀಲರನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Choose an advocate from the filtered list on the left to start chatting"}
            </div>
          )}
        </div>

        <div className={`wa-conversation-canvas ${messages.length === 0 ? "empty-canvas" : ""}`}>
          {!selected ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 32, textAlign: "center" }}>
              <div className="wa-empty-consult-icon">
                ⚖️
              </div>
              <h3 className="wa-empty-consult-title">
                {lang === "kn" ? "ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭಿಸಲು ವಕೀಲರನ್ನು ಆಯ್ಕೆಮಾಡಿ" : "Choose an Advocate to Start Consultation"}
              </h3>
              <p className="wa-empty-consult-desc">
                {search ? (
                  <>Showing advocates filtered for <strong>"{search}"</strong> ({displayedAdvocates.length} matching). Click on any advocate from the list on the left to review their profile and start chatting.</>
                ) : (
                  <>Please choose an advocate from the left sidebar to start your consultation.</>
                )}
              </p>
              <button
                type="button"
                className="wa-mobile-choose-adv-btn"
                onClick={() => setMobileChatActive(false)}
              >
                👥 {lang === "kn" ? "ವಕೀಲರ ಪಟ್ಟಿಯನ್ನು ತೆರೆಯಿರಿ" : "View Advocates List"}
              </button>
              {message && (
                <div className="wa-inquiry-box">
                  <span className="wa-inquiry-tag">
                    Prepared Case Inquiry:
                  </span>
                  <p className="wa-inquiry-msg">
                    "{message}"
                  </p>
                  <span className="wa-inquiry-hint">
                    👈 Click any advocate on the left to select them and send this message.
                  </span>
                </div>
              )}
            </div>
          ) : messages.length === 0 ? (
            !isAdvocatePaid(selected.id) ? (
              <div className="wa-adv-first-consult-box">
                <div className="wa-first-consult-header">
                  <div className="wa-first-consult-avatar">
                    {selected.avatar ? (
                      <img src={assetUrl ? assetUrl(selected.avatar) : selected.avatar} alt="" />
                    ) : (
                      <span>{(selected.name || "A").replace(/^Adv\.\s*/i, "").charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="wa-first-consult-title-wrap">
                    <span className="wa-first-consult-badge">
                      <span>🛡️</span>
                      <span>{lang === "kn" ? "ಅಧಿಕೃತ ವಕೀಲರ ಸಮಾಲೋಚನೆ" : "Verified Advocate Consultation"}</span>
                    </span>
                    <h3 className="wa-first-consult-title">
                      {lang === "kn"
                        ? `${selected.name} ಅವರೊಂದಿಗೆ ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭಿಸಿ`
                        : `Start Consultation with ${selected.name}`}
                    </h3>
                  </div>
                </div>

                <p className="wa-first-consult-desc">
                  {lang === "kn"
                    ? `ಕೆಳಗೆ ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ ಕಳುಹಿಸಿ. ಕೇವಲ ₹10 ಒಂದು ಬಾರಿಯ ಶುಲ್ಕದೊಂದಿಗೆ ನೀವು ${selected.name} ಅವರೊಂದಿಗೆ ನಿರಂತರವಾಗಿ ಚಾಟ್ ಮಾಡಬಹುದು.`
                    : `Type your message below and click Send. A nominal one-time ₹10 fee activates direct chat with ${selected.name}. Once paid, you can chat continuously.`}
                </p>

                <div className="wa-first-consult-features">
                  <div className="wa-fc-feat-item">
                    <span className="wa-fc-feat-icon">⚡</span>
                    <span>{lang === "kn" ? "ತಕ್ಷಣದ ಸಕ್ರಿಯತೆ" : "Instant Activation"}</span>
                  </div>
                  <div className="wa-fc-feat-item">
                    <span className="wa-fc-feat-icon">🔒</span>
                    <span>{lang === "kn" ? "₹10 ಒಂದು ಬಾರಿ" : "₹10 One-Time Fee"}</span>
                  </div>
                  <div className="wa-fc-feat-item">
                    <span className="wa-fc-feat-icon">♾️</span>
                    <span>{lang === "kn" ? "ಅನಿಯಮಿತ ಚಾಟ್" : "Continuous Chat"}</span>
                  </div>
                </div>

                <div className="wa-first-consult-chips">
                  <span className="wa-fc-chips-label">{lang === "kn" ? "ತ್ವರಿತ ಸಂದೇಶಗಳು (ಕ್ಲಿಕ್ ಮಾಡಿ):" : "Quick Starters (Click to fill):"}</span>
                  <div className="wa-fc-chips-list">
                    {[
                      lang === "kn" ? `ನಮಸ್ಕಾರ ವಕೀಲರೇ, ನನಗೆ ${selected.speciality || "ಕಾನೂನು"} ವಿಷಯದಲ್ಲಿ ಸಲಹೆ ಬೇಕಾಗಿದೆ.` : `Hello ${selected.name}, I need legal advice regarding my matter.`,
                      lang === "kn" ? "ನನ್ನ ಪ್ರಕರಣದ ಬಗ್ಗೆ ಚರ್ಚಿಸಲು ಸಮಯ ನಿಗದಿಪಡಿಸಬಹುದೇ?" : "Can we schedule a consultation to discuss my case?",
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="wa-fc-chip-btn"
                        onClick={() => setMessage(chip)}
                      >
                        💬 {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="wa-first-consult-pill">
                  <span>⚡ {lang === "kn" ? "QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮೂಲಕ ತಕ್ಷಣದ ಸಕ್ರಿಯತೆ" : "Instant Activation via QR Scanner"}</span>
                  <span className="wa-fc-dot">•</span>
                  <span>₹10 {lang === "kn" ? "ನಿರ್ವಹಣೆ ಮತ್ತು ಕ್ಲೌಡ್ ಸಂಗ್ರಹಣೆ" : "App Maintenance & Cloud Storage"}</span>
                </div>
              </div>
            ) : (
              <div className="wa-empty-list">No messages yet. Say hi!</div>
            )
          ) : (
            messages.map((m, i) => {
              const isClient = m.from === "client";
              const isEditingThis = editingMsgIndex === i;
              const isDeleted = Boolean(m.isDeleted);
              const isEdited = Boolean(m.isEdited);
              const isMenuActive = activeMenuMsgIndex === i;
              const isNearBottom = i >= messages.length - 2;

              return (
                <div key={i} className={`wa-message-wrapper ${isClient ? "outgoing" : "incoming"} ${isDeleted ? "is-deleted-wrapper" : ""} ${isMenuActive ? "wa-msg-row-active" : ""}`}>
                  <div
                    className={`wa-bubble-container ${isDeleted ? "wa-bubble-deleted" : ""} ${isMenuActive ? "wa-bubble-focused" : ""}`}
                    onClick={() => {
                      if (!isDeleted && !isEditingThis) {
                        setActiveMenuMsgIndex(prev => prev === i ? null : i);
                      }
                    }}
                    style={{ cursor: (!isDeleted && !isEditingThis) ? "pointer" : "default" }}
                  >
                    
                    {/* WhatsApp 3-Dots Action Menu Trigger & Dropdown */}
                    {!isDeleted && !isEditingThis && (
                      <div className="wa-bubble-menu-wrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className={`wa-bubble-trigger-btn ${isMenuActive ? "active" : ""}`}
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
                            className={`wa-bubble-dropdown ${isClient ? "dropdown-outgoing" : "dropdown-incoming"} ${isNearBottom ? "dropdown-upward" : ""}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Reply option */}
                            <button
                              type="button"
                              className="wa-bubble-menu-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReplyMessage(m);
                              }}
                            >
                              <span className="wa-bubble-menu-icon">↩️</span>
                              <span>Reply</span>
                            </button>

                            {/* Edit option - ONLY FOR CLIENT'S OWN SENT MESSAGES */}
                            {isClient && m.text && (
                              <button
                                type="button"
                                className="wa-bubble-menu-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuMsgIndex(null);
                                  setEditingMsgIndex(i);
                                  setEditingMsgText(m.text || "");
                                }}
                              >
                                <span className="wa-bubble-menu-icon">✏️</span>
                                <span>Edit</span>
                              </button>
                            )}

                            {/* Copy option */}
                            {m.text && (
                              <button
                                type="button"
                                className="wa-bubble-menu-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyMessage(m.text);
                                }}
                              >
                                <span className="wa-bubble-menu-icon">📋</span>
                                <span>Copy</span>
                              </button>
                            )}

                            {/* Delete option */}
                            <button
                              type="button"
                              className="wa-bubble-menu-item wa-bubble-menu-item-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuMsgIndex(null);
                                if (window.confirm ? window.confirm("Are you sure you want to delete this message for everyone?") : true) {
                                  handleDeleteChatMessage(i);
                                }
                              }}
                            >
                              <span className="wa-bubble-menu-icon">🗑️</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quoted Reply Block (Message to Message) */}
                    {!isDeleted && m.replyTo && (
                      <div className={`wa-bubble-quote ${isClient ? "quote-outgoing" : "quote-incoming"}`}>
                        <div className="wa-quote-border" />
                        <div className="wa-quote-content">
                          <div className="wa-quote-sender">{m.replyTo.sender}</div>
                          <div className="wa-quote-text">{m.replyTo.text}</div>
                        </div>
                      </div>
                    )}

                    {isDeleted ? (
                      <div className="wa-deleted-msg-box" style={{ display: "flex", alignItems: "center", gap: "6px", fontStyle: "italic", opacity: 0.8, color: "#64748b", padding: "4px 2px" }}>
                        <span style={{ fontSize: "15px" }}>🚫</span>
                        <span>This message was deleted</span>
                      </div>
                    ) : isEditingThis ? (
                      <div className="wa-inline-edit-box" onClick={(e) => e.stopPropagation()}>
                        <textarea
                          className="wa-inline-edit-textarea"
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
                        <div className="wa-inline-edit-actions">
                          <button
                            type="button"
                            className="wa-inline-save-btn"
                            onClick={() => handleSaveEditChatMessage(i, editingMsgText)}
                          >
                            ✓ Save
                          </button>
                          <button
                            type="button"
                            className="wa-inline-cancel-btn"
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
                      <>
                        {m.attachment && (
                          <div className="wa-msg-attachment-box" style={{ marginBottom: m.text ? "8px" : "4px" }}>
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
                              style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", color: isClient ? "#008069" : "#2563eb", fontWeight: "700", marginTop: "4px", textDecoration: "none" }}
                            >
                              ⬇ Download {m.attachment.fileName}
                            </a>
                          </div>
                        )}
                        {m.text && <div className="wa-bubble-text">{m.text}</div>}
                      </>
                    )}

                    <div className="wa-bubble-meta" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                      <div className="wa-bubble-time">{new Date(m.t || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                      {!isDeleted && isEdited && (
                        <span className="wa-edited-badge" title={m.editedAt ? `Edited at ${new Date(m.editedAt).toLocaleTimeString()}` : "Edited"}>
                          ✏️ Edited
                        </span>
                      )}
                      {!isDeleted && isClient && <span style={{ color: "#34b7f1", fontWeight: "bold", fontSize: "11px" }}>✓✓</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {copyFeedback && (
            <div className="wa-copy-toast">
              ✓ Copied to clipboard
            </div>
          )}
          {activeMenuMsgIndex !== null && (
            <div
              className="wa-msg-menu-backdrop"
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenuMsgIndex(null);
              }}
            />
          )}
          <div ref={messagesEndRef} style={{ height: "1px", width: "100%", clear: "both" }} />
        </div>

        {/* Pending Attachment Preview Banner */}
        {pendingAttachment && (
          <div className="wa-client-attachment-preview" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px",
            background: "#f1f5f9",
            borderTop: "1px solid #cbd5e1",
            fontSize: "13px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
              <span>{pendingAttachment.isImage ? "🖼️ Image Attachment:" : "📄 Document Attachment:"}</span>
              <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "260px", color: "#0f172a" }}>
                {pendingAttachment.fileName}
              </strong>
              <span style={{ color: "#64748b", fontSize: "11px" }}>({pendingAttachment.fileSize})</span>
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

        {/* Emoji Picker Popover Overlay */}
        {showEmojiPicker && (
          <div className="wa-client-emoji-popover" style={{
            position: "absolute",
            bottom: "65px",
            left: "14px",
            background: "#ffffff",
            border: "1px solid #cbd5e1",
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
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "6px",
                  fontSize: "18px",
                  cursor: "pointer",
                  lineHeight: "1"
                }}
              >
                {emo}
              </button>
            ))}
          </div>
        )}

        {/* WhatsApp Reply Composer Banner */}
        {replyingTo && (
          <div className="wa-reply-composer-banner">
            <div className="wa-rc-bar" />
            <div className="wa-rc-content">
              <div className="wa-rc-sender">
                Replying to <strong>{replyingTo.sender}</strong>
              </div>
              <div className="wa-rc-text">
                {replyingTo.text}
              </div>
            </div>
            <button
              type="button"
              className="wa-rc-close"
              onClick={() => setReplyingTo(null)}
              title="Cancel reply"
              aria-label="Cancel reply"
            >
              ✕
            </button>
          </div>
        )}

        <div className="wa-input-footer" style={{ position: "relative" }}>
          {/* Hidden Native File Input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
          />

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* Emoji Trigger Button */}
            <button
              type="button"
              className="wa-action-btn wa-emoji-btn"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              title="Add Emoji"
              style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", padding: "6px", borderRadius: "50%" }}
            >
              😊
            </button>

            {/* File Attachment Trigger Button */}
            <button
              type="button"
              className="wa-action-btn wa-attach-btn"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              title="Attach Document / File"
              style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", padding: "6px", borderRadius: "50%" }}
            >
              📎
            </button>
          </div>

          <div className="wa-composer-form" style={{ flex: 1 }}>
            <input
              className="wa-chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={
                selected
                  ? isAdvocatePaid(selected.id)
                    ? `Message ${selected.name}…`
                    : lang === "kn"
                      ? `${selected.name} ಅವರಿಗೆ ಸಂದೇಶ ಬರೆಯಿರಿ (₹10 ಸಮಾಲೋಚನಾ ಶುಲ್ಕ)…`
                      : `Message ${selected.name} (₹10 one-time fee to activate)…`
                  : "Select an advocate"
              }
            />
          </div>
          <button className={`wa-send-action-btn ${(message.trim() || pendingAttachment) ? 'can-send' : ''}`} onClick={sendMessage} disabled={!selected}>Send</button>
        </div>
      </main>
      </div>

      {/* ========================================================
          SIMPLIFIED ELEGANT PAYMENT MODAL (MOBILE & DESKTOP)
          ======================================================== */}
      {showPaymentModal && (
        <div className="wa-pay-overlay" onClick={() => !isProcessingPayment && setShowPaymentModal(false)}>
          <div className={`wa-pay-card ${theme === "dark" ? "dark" : ""}`} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="wa-pay-header">
              <span className="wa-pay-badge">{pt.modalBadge}</span>
              <div className="wa-pay-header-actions">
                <button
                  type="button"
                  className="wa-pay-lang-toggle"
                  onClick={() => handleLanguageChange(lang === "en" ? "kn" : "en")}
                  title={lang === "en" ? "ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ" : "Switch to English"}
                >
                  🌐 {lang === "en" ? "ಕನ್ನಡ" : "English"}
                </button>
                {!isProcessingPayment && (
                  <button
                    type="button"
                    className="wa-pay-close-btn"
                    onClick={() => setShowPaymentModal(false)}
                    title="Close"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Advocate Strip */}
            <div className="wa-pay-adv-strip">
              <div className="wa-pay-adv-left">
                <div className="wa-pay-adv-avatar">
                  {selected?.avatar ? (
                    <img src={assetUrl ? assetUrl(selected.avatar) : selected.avatar} alt="" />
                  ) : (
                    <span>{(selected?.name || "A").replace(/^Adv\.\s*/i, "").charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="wa-pay-adv-info">
                  <div className="wa-pay-adv-name">
                    {selected?.name} <span className="wa-pay-verified-check">✓</span>
                  </div>
                  <div className="wa-pay-adv-spec">
                    {selected?.speciality || selected?.practiceArea || "Legal Consultation"}
                  </div>
                </div>
              </div>
              <div className="wa-pay-fee-badge">₹10</div>
            </div>

            {/* QR Scanner Center */}
            <div className="wa-pay-scanner-wrap">
              <div className="wa-qr-frame">
                <div className="wa-scanner-laser" />
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=9108717353-3@ybl&pn=Chetan&am=10&cu=INR&tn=Advocate%20Hub%20Consultation%20${encodeURIComponent(selected?.name || "Advocate")}`)}`}
                  alt="UPI QR Scanner"
                  className="wa-qr-img"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fb = document.getElementById("wa-qr-fallback-svg");
                    if (fb) fb.style.display = "block";
                  }}
                />
                <svg id="wa-qr-fallback-svg" style={{ display: "none", width: 130, height: 130 }} viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="#ffffff" />
                  <rect x="10" y="10" width="24" height="24" fill="#000" />
                  <rect x="14" y="14" width="16" height="16" fill="#fff" />
                  <rect x="18" y="18" width="8" height="8" fill="#000" />
                  <rect x="66" y="10" width="24" height="24" fill="#000" />
                  <rect x="70" y="14" width="16" height="16" fill="#fff" />
                  <rect x="74" y="18" width="8" height="8" fill="#000" />
                  <rect x="10" y="66" width="24" height="24" fill="#000" />
                  <rect x="14" y="70" width="16" height="16" fill="#fff" />
                  <rect x="18" y="74" width="8" height="8" fill="#000" />
                  <rect x="42" y="14" width="6" height="6" fill="#000" />
                  <rect x="52" y="24" width="6" height="6" fill="#000" />
                  <rect x="42" y="42" width="16" height="16" fill="#5f259f" />
                  <rect x="66" y="46" width="6" height="6" fill="#000" />
                  <rect x="78" y="56" width="6" height="6" fill="#000" />
                  <rect x="42" y="66" width="6" height="6" fill="#000" />
                  <rect x="54" y="74" width="6" height="6" fill="#000" />
                  <rect x="66" y="80" width="14" height="10" fill="#000" />
                </svg>
              </div>
              <div className="wa-scanner-apps">PhonePe · Google Pay · Paytm · UPI</div>
            </div>

            {/* Simple Purpose Note */}
            <div className="wa-pay-purpose-card">
              <span className="wa-pay-purpose-icon">🛠️</span>
              <p className="wa-pay-purpose-text">{pt.purposeNote}</p>
            </div>

            {/* Action Buttons */}
            <div className="wa-pay-actions">
              <button
                type="button"
                className={`wa-pay-confirm-btn ${paymentSuccess ? "success" : ""}`}
                onClick={handleConfirmPayment}
                disabled={isProcessingPayment || paymentSuccess}
              >
                {isProcessingPayment ? pt.verifyingBtn : paymentSuccess ? pt.successBtn : pt.verifyBtn}
              </button>
              {!isProcessingPayment && (
                <button
                  type="button"
                  className="wa-pay-cancel-btn"
                  onClick={() => setShowPaymentModal(false)}
                >
                  {pt.cancelBtn}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
