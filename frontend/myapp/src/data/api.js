// ============================================================
//  api.js — thin fetch wrapper for the AdvocateHub backend.
//  In dev, CRA proxies "/api" and "/uploads" to http://localhost:5000
//  (see "proxy" in package.json). Set REACT_APP_API_BASE for prod.
// ============================================================

export const API_BASE = process.env.REACT_APP_API_BASE || "";

const ADMIN_TOKEN_KEY = "law4u_admin_token";
const ADVOCATE_TOKEN_KEY = "law4u_advocate_token";

export function getAdminToken() { return sessionStorage.getItem(ADMIN_TOKEN_KEY); }
export function setAdminToken(token) {
  if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getAdvocateToken() {
  return localStorage.getItem(ADVOCATE_TOKEN_KEY) || sessionStorage.getItem(ADVOCATE_TOKEN_KEY);
}
export function setAdvocateToken(token, remember) {
  localStorage.removeItem(ADVOCATE_TOKEN_KEY);
  sessionStorage.removeItem(ADVOCATE_TOKEN_KEY);
  if (token) (remember ? localStorage : sessionStorage).setItem(ADVOCATE_TOKEN_KEY, token);
}

export async function api(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await response.json(); } catch { /* empty body */ }

  if (!response.ok) {
    const error = new Error(data?.message || data?.error || `Request failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

// ── Registration Status & Admin Approval Helpers ──────────────
export async function getRegistrationStatus(identifier) {
  const query = String(identifier || "").trim();
  const param = query.includes("@") ? `email=${encodeURIComponent(query)}` : `phone=${encodeURIComponent(query)}`;
  return api(`/api/auth/registration-status?${param}`);
}

export async function getAdminRegistrationRequests() {
  const token = getAdminToken();
  return api("/api/admin/registration-requests", { token });
}

export async function approveRegistrationRequest(id, role) {
  const token = getAdminToken();
  return api(`/api/admin/registration-requests/${id}/approve`, {
    method: "POST",
    body: { role },
    token,
  });
}

export async function rejectRegistrationRequest(id, role, reason) {
  const token = getAdminToken();
  return api(`/api/admin/registration-requests/${id}/reject`, {
    method: "POST",
    body: { role, reason },
    token,
  });
}

// ── Password Reset API Helpers ────────────────────────────────
export async function requestForgotPassword(email) {
  return api("/api/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function verifyResetEmail(email, otp) {
  return api("/api/auth/verify-reset-email", {
    method: "POST",
    body: { email, otp },
  });
}

export async function clientResetPassword({ email, resetToken, otp, password }) {
  return api("/api/auth/client/reset-password", {
    method: "POST",
    body: { email, resetToken, otp, password },
  });
}

export async function verifyResetToken(token) {
  return api(`/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
}

export async function advocateResetPassword({ token, password }) {
  return api("/api/auth/advocate/reset-password", {
    method: "POST",
    body: { token, password },
  });
}

export async function getAdminPasswordResetRequests() {
  const token = getAdminToken();
  return api("/api/admin/password-reset-requests", { token });
}

export async function approvePasswordResetRequest(id) {
  const token = getAdminToken();
  return api(`/api/admin/password-reset-requests/${id}/approve`, {
    method: "POST",
    token,
  });
}

export async function rejectPasswordResetRequest(id, reason) {
  const token = getAdminToken();
  return api(`/api/admin/password-reset-requests/${id}/reject`, {
    method: "POST",
    body: { reason },
    token,
  });
}

export async function getStorageStatus() {
  const token = getAdminToken();
  return api("/api/admin/storage/status", { token });
}

export async function runStorageMigration(options = {}) {
  const token = getAdminToken();
  return api("/api/admin/storage/migrate", {
    method: "POST",
    token,
    body: options,
  });
}

// Avatar paths come back as "/uploads/x.png"; make them absolute when
// the API lives on another origin.
export function assetUrl(p) {
  if (!p || /^(https?:|data:)/.test(p)) return p;
  return `${API_BASE}${p}`;
}
