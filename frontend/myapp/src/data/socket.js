// ============================================================
//  socket.js — Socket.IO Real-Time Client for AdvocateHub
// ============================================================

import { io } from "socket.io-client";
import { API_BASE, getAdminToken, getAdvocateToken } from "./api";

let socket = null;
let currentKey = null;

export function getSocket() {
  return socket;
}

export function initSocket(user = {}) {
  if (socket && socket.connected) {
    return socket;
  }

  const token = getAdvocateToken() || getAdminToken() || (typeof localStorage !== "undefined" ? localStorage.getItem("law4u_client_token") : null);
  const serverUrl = API_BASE || (typeof window !== "undefined" ? window.location.origin : "");

  socket = io(serverUrl, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    auth: {
      token: token || undefined,
      role: user.role || (typeof localStorage !== "undefined" && localStorage.getItem("law4u_advocate_id") ? "advocate" : "client"),
      userId: user.id || (typeof localStorage !== "undefined" ? (localStorage.getItem("law4u_advocate_id") || localStorage.getItem("law4u_client_id")) : ""),
    },
  });

  socket.on("connect", () => {
    console.log("[Socket.IO] Connected successfully with ID:", socket.id);
    if (currentKey) {
      socket.emit("join_conversation", currentKey);
    }
  });

  socket.on("connect_error", (err) => {
    console.warn("[Socket.IO] Connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket.IO] Disconnected:", reason);
  });

  return socket;
}

export function joinConversation(key) {
  currentKey = key;
  if (socket) {
    socket.emit("join_conversation", key);
  }
}

export function leaveConversation(key) {
  if (currentKey === key) currentKey = null;
  if (socket) {
    socket.emit("leave_conversation", key);
  }
}

export function emitSendMessage(payload, cb) {
  if (socket && socket.connected) {
    socket.emit("send_message", payload, cb);
  }
}

export function emitEditMessage(payload, cb) {
  if (socket && socket.connected) {
    socket.emit("edit_message", payload, cb);
  }
}

export function emitDeleteForEveryone(payload, cb) {
  if (socket && socket.connected) {
    socket.emit("delete_for_everyone", payload, cb);
  }
}

export function emitDeleteForMe(payload, cb) {
  if (socket && socket.connected) {
    socket.emit("delete_for_me", payload, cb);
  }
}

export function emitForwardMessage(payload, cb) {
  if (socket && socket.connected) {
    socket.emit("forward_message", payload, cb);
  }
}

export function emitTyping(payload) {
  if (socket && socket.connected) {
    socket.emit("typing", payload);
  }
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

