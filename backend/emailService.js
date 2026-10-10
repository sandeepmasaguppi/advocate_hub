// ============================================================
//  emailService.js — Automated Admin Email Notification Service
//  Sends instant registration alerts to advocatehub.in@gmail.com
//  whenever a Client or Advocate registers on Advocates Hub.
// ============================================================

const fs = require("fs");
const path = require("path");
const dataStore = require("./dataStore");

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m && (process.env[m[1]] === undefined || process.env[m[1]] === "")) {
      const value = m[2];
      const quote = value[0];
      process.env[m[1]] = quote && value.endsWith(quote) ? value.slice(1, -1) : value;
    }
  }
}
loadDotEnv(path.join(__dirname, ".env"));

let nodemailer = null;
try {
  nodemailer = require("nodemailer");
} catch {
  // Graceful fallback if nodemailer is unavailable
}

function getAdminEmail() {
  return process.env.ADMIN_NOTIFICATION_EMAIL || "sandeepmasaguppi@gmail.com";
}

function getAdvocateRegistrationEmail() {
  return process.env.ADVOCATE_REGISTRATION_EMAIL || "sandeepmasaguppi@gmail.com";
}

function getAdvocateRegistrationFrom() {
  return process.env.ADVOCATE_REGISTRATION_FROM
    || '"Sandeep Masaguppi" <sandeepmasaguppi@gmail.com>';
}

function getAdminPortalUrl() {
  return `${(process.env.FRONTEND_URL || "https://advocate-hub.up.railway.app").replace(/\/+$/, "")}/admin`;
}

const NOTIFICATIONS_FILE = path.join(
  process.env.APP_DATA_DIR || path.join(__dirname, "data"),
  "admin_notifications.json"
);

/**
 * Persists an in-app audit record of the notification.
 */
function recordNotification(entry) {
  try {
    if (dataStore.isMongoEnabled()) {
      const list = dataStore.getCollection("admin_notifications");
      list.unshift(entry);
      dataStore.setCollection("admin_notifications", list.slice(0, 200));
      return;
    }

    let list = [];
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      try {
        const raw = fs.readFileSync(NOTIFICATIONS_FILE, "utf8");
        list = JSON.parse(raw);
        if (!Array.isArray(list)) list = [];
      } catch {
        list = [];
      }
    }
    list.unshift(entry);
    // Keep last 200 notifications
    if (list.length > 200) list = list.slice(0, 200);
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.warn("[EmailService] Failed to persist notification record:", err.message);
  }
}

/**
 * Returns a configured nodemailer transport instance if SMTP credentials are provided.
 */
function getTransporter() {
  if (!nodemailer) return null;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE !== "false";
  const user = process.env.SMTP_USER;
  const rawPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "";
  const pass = rawPass.replace(/\s+/g, "");

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

function getDeliveryProvider() {
  if (process.env.EMAIL_PROVIDER === "resend" || process.env.RESEND_API_KEY) {
    return process.env.RESEND_API_KEY && process.env.RESEND_FROM ? "resend" : null;
  }
  return getTransporter() ? "smtp" : null;
}

async function deliverEmail(message) {
  const provider = getDeliveryProvider();
  if (provider === "resend") {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
        reply_to: process.env.SMTP_REPLY_TO || undefined,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`Resend API returned ${response.status}: ${result.message || "email delivery failed"}`);
    }
    return { provider, messageId: result.id };
  }

  if (provider === "smtp") {
    const info = await getTransporter().sendMail({
      from: message.from || process.env.SMTP_FROM || `"Advocates Hub" <${process.env.SMTP_USER}>`,
      replyTo: process.env.SMTP_REPLY_TO || "advocatehub.in@gmail.com",
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    return { provider, messageId: info.messageId };
  }

  throw new Error(process.env.EMAIL_PROVIDER === "resend"
    ? "Resend requires RESEND_API_KEY and RESEND_FROM"
    : "No email provider is configured");
}

/**
 * Generic dispatch helper with dual-layer delivery:
 * 1. Resend HTTPS API or SMTP when configured.
 * 2. Persistent storage in admin_notifications.json + Console alert.
 */
async function sendAdminEmail({ subject, text, html, meta = {}, to = getAdminEmail(), from }) {
  const timestamp = new Date().toISOString();
  const recipient = to;
  const fromAddr = process.env.RESEND_FROM
    || from
    || process.env.SMTP_FROM
    || `"Advocates Hub" <advocatehub.in@gmail.com>`;

  const notificationRecord = {
    id: `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    to: recipient,
    from: fromAddr,
    subject,
    text,
    html,
    meta,
    timestamp,
    delivered: false,
  };

  try {
    const result = await deliverEmail({ to: recipient, subject, text, html, from });
    console.log(`[EmailService] Email delivered via ${result.provider}. MessageId: ${result.messageId || "not provided"}`);
    notificationRecord.delivered = true;
    notificationRecord.messageId = result.messageId;
    notificationRecord.provider = result.provider;
    notificationRecord.deliveredAt = new Date().toISOString();
  } catch (err) {
    console.warn("[EmailService] Registration email delivery failed:", err.message);
    notificationRecord.error = err.message;
  }

  recordNotification(notificationRecord);
  return notificationRecord;
}

/**
 * Notifies admin when a new Client signs up.
 */
async function notifyAdminNewClient(client) {
  const name = client.name || "New Client";
  const email = client.email || "No email";
  const phone = client.phone || "Not provided";
  const city = client.city || "Not provided";
  const status = client.status || "approved";
  const issue = client.legalIssue || "General Legal Inquiry";
  const istTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const subject = `🔔 New Client Registration - ${name} (${city})`;

  const text = `
New Client Registration on Advocates Hub
=========================================
Name:          ${name}
Email:         ${email}
Phone:         ${phone}
City:          ${city}
Legal Issue:   ${issue}
Status:        ${status}
Registered At: ${istTime} (IST)

Admin Portal:  ${getAdminPortalUrl()}
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #ffffff; padding: 24px 30px; }
    .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #f8fafc; }
    .header p { margin: 0; font-size: 13px; color: #94a3b8; }
    .content { padding: 28px 30px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: #dbeafe; color: #1d4ed8; margin-bottom: 18px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th, td { padding: 12px 14px; text-align: left; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
    th { color: #64748b; font-weight: 600; width: 35%; background: #f8fafc; }
    td { color: #0f172a; font-weight: 500; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .footer { padding: 16px 30px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>⚖️ Advocates Hub — Admin Alert</h2>
      <p>Automated notification for account registration</p>
    </div>
    <div class="content">
      <span class="badge">👤 New Client Account</span>
      <p style="margin-top: 0; font-size: 15px; line-height: 1.5;">
        A new client has registered on the <strong>Advocates Hub</strong> platform. Here are the details:
      </p>
      <table>
        <tr><th>Full Name</th><td><strong>${name}</strong></td></tr>
        <tr><th>Email Address</th><td><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td></tr>
        <tr><th>Phone Number</th><td>${phone}</td></tr>
        <tr><th>City / Location</th><td>${city}</td></tr>
        <tr><th>Legal Matter</th><td>${issue}</td></tr>
        <tr><th>Account Status</th><td><span style="color: #16a34a; font-weight: 600;">${status}</span></td></tr>
        <tr><th>Registered At</th><td>${istTime} IST</td></tr>
      </table>
      <div style="text-align: center; margin-top: 24px;">
        <a href="${getAdminPortalUrl()}" class="btn">Open Admin Console →</a>
      </div>
    </div>
    <div class="footer">
      Advocates Hub Automated Notification Desk · Sent to ${getAdminEmail()}
    </div>
  </div>
</body>
</html>
`.trim();

  return sendAdminEmail({
    subject,
    text,
    html,
    meta: { type: "client_registration", clientId: client.id, email: client.email },
  });
}

/**
 * Notifies admin when a new Advocate signs up.
 */
async function notifyAdminNewAdvocate(advocate) {
  const name = advocate.name || "Advocate";
  const email = advocate.email || "No email";
  const phone = advocate.phone || "Not provided";
  const barId = advocate.barId || "Not provided";
  const barCouncil = advocate.barCouncil || "Bar Council of Karnataka";
  const speciality = advocate.speciality || advocate.practiceArea || "General Practice";
  const courtLevel = advocate.courtLevel || "Not specified";
  const court = advocate.court || "Not specified";
  const city = advocate.city || advocate.taluk || advocate.district || "Karnataka";
  const experience = advocate.experience ? `${advocate.experience} Years` : "Not specified";
  const fee = advocate.fee ? `₹${advocate.fee}` : "Standard";
  const status = advocate.status || "pending";
  const istTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const subject = `⚖️ New Advocate Registration - Adv. ${name} (${city})`;

  const text = `
New Advocate Registration on Advocates Hub
===========================================
Name:          Adv. ${name}
Email:         ${email}
Phone:         ${phone}
Bar Reg ID:    ${barId}
Bar Council:   ${barCouncil}
Speciality:    ${speciality}
Court Level:   ${courtLevel}
Court:         ${court}
City/District: ${city}
Experience:    ${experience}
Fee:           ${fee}
Status:        ${status}
Registered At: ${istTime} (IST)

Review & Manage: ${getAdminPortalUrl()}
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #09090b 0%, #172554 100%); color: #ffffff; padding: 24px 30px; }
    .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #f8fafc; }
    .header p { margin: 0; font-size: 13px; color: #94a3b8; }
    .content { padding: 28px 30px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: #fef3c7; color: #b45309; margin-bottom: 18px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th, td { padding: 12px 14px; text-align: left; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
    th { color: #64748b; font-weight: 600; width: 35%; background: #f8fafc; }
    td { color: #0f172a; font-weight: 500; }
    .btn { display: inline-block; background: #0f172a; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .footer { padding: 16px 30px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>⚖️ Advocates Hub — Admin Alert</h2>
      <p>Automated advocate onboard registration notification</p>
    </div>
    <div class="content">
      <span class="badge">⚖️ New Advocate Application</span>
      <p style="margin-top: 0; font-size: 15px; line-height: 1.5;">
        A new advocate has registered their practice on <strong>Advocates Hub</strong>:
      </p>
      <table>
        <tr><th>Advocate Name</th><td><strong>Adv. ${name}</strong></td></tr>
        <tr><th>Email Address</th><td><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td></tr>
        <tr><th>Phone Number</th><td>${phone}</td></tr>
        <tr><th>Bar Council ID</th><td><code>${barId}</code></td></tr>
        <tr><th>Bar Council</th><td>${barCouncil}</td></tr>
        <tr><th>Practice Area</th><td>${speciality}</td></tr>
        <tr><th>Court & Level</th><td>${courtLevel} — ${court}</td></tr>
        <tr><th>City / Jurisdiction</th><td>${city}</td></tr>
        <tr><th>Experience</th><td>${experience}</td></tr>
        <tr><th>Consultation Fee</th><td>${fee}</td></tr>
        <tr><th>Application Status</th><td><span style="color: ${status === 'approved' ? '#16a34a' : '#d97706'}; font-weight: 600;">${status.toUpperCase()}</span></td></tr>
        <tr><th>Registered At</th><td>${istTime} IST</td></tr>
      </table>
      <div style="text-align: center; margin-top: 24px;">
        <a href="${getAdminPortalUrl()}" class="btn">Review in Admin Console →</a>
      </div>
    </div>
    <div class="footer">
      Advocates Hub Automated Notification Desk · Sent to ${getAdvocateRegistrationEmail()}
    </div>
  </div>
</body>
</html>
`.trim();

  return sendAdminEmail({
    subject,
    text,
    html,
    to: getAdvocateRegistrationEmail(),
    from: getAdvocateRegistrationFrom(),
    meta: { type: "advocate_registration", advocateId: advocate.id, email: advocate.email },
  });
}

function getStoredNotifications() {
  const stored = dataStore.getCollection("admin_notifications");
  if (stored) return stored;
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      return JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, "utf8"));
    }
  } catch {}
  return [];
}

/**
 * Iterates through all queued/pending notifications in admin_notifications.json
 * that have delivered: false, and delivers them via SMTP.
 */
async function deliverUndeliveredNotifications() {
  if (!getDeliveryProvider()) {
    console.warn("[EmailService] Queued registration emails were not sent: configure RESEND_API_KEY and RESEND_FROM, or SMTP credentials on a Railway plan that allows SMTP.");
    return { sent: 0, results: [], skipped: true };
  }

  let list = dataStore.getCollection("admin_notifications");
  if (!list) {
    if (!fs.existsSync(NOTIFICATIONS_FILE)) return { sent: 0, results: [] };
    try {
      list = JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, "utf8"));
      if (!Array.isArray(list)) list = [];
    } catch {
      return { sent: 0, results: [] };
    }
  }

  const recipient = getAdminEmail();
  let sentCount = 0;
  const results = [];

  for (const item of list) {
    if (!item.delivered) {
      try {
        const targetTo = item.to || recipient;
        const result = await deliverEmail({
          to: targetTo,
          subject: item.subject,
          text: item.text,
          html: item.html || `<div style="font-family: Arial, sans-serif; white-space: pre-wrap; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">${item.text}</div>`,
          from: item.from,
        });
        item.delivered = true;
        item.messageId = result.messageId;
        item.provider = result.provider;
        item.deliveredAt = new Date().toISOString();
        delete item.error;
        sentCount++;
        results.push({ id: item.id, status: "delivered", messageId: result.messageId });
        console.log(`[EmailService] Delivered queued registration notification ${item.id} via ${result.provider}`);
      } catch (err) {
        console.warn(`[EmailService] Failed to deliver queued notification ${item.id}:`, err.message);
        item.error = err.message;
        results.push({ id: item.id, status: "failed", error: err.message });
      }
    }
  }

  if (sentCount > 0 || results.some(r => r.status === "failed")) {
    if (!dataStore.setCollection("admin_notifications", list)) {
      fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(list, null, 2), "utf8");
    }
  }

  return { sent: sentCount, results };
}

function normalizeOtpPhone(phone) {
  const value = String(phone || "").trim();
  const digits = value.replace(/\D/g, "");
  if (value.startsWith("+") && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  throw new Error("A valid phone number with country code is required");
}

async function sendTwilioOtp({ channel, to, body, contentSid, contentVariables }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    throw new Error("Twilio requires TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN");
  }

  const parameters = new URLSearchParams({ To: to });
  if (contentSid) {
    parameters.set("ContentSid", contentSid);
    parameters.set("ContentVariables", JSON.stringify(contentVariables));
  } else {
    parameters.set("Body", body);
  }

  const smsMessagingServiceSid = channel === "sms" && process.env.TWILIO_SMS_MESSAGING_SERVICE_SID;
  const from = channel === "whatsapp"
    ? process.env.TWILIO_WHATSAPP_FROM
    : process.env.TWILIO_SMS_FROM;
  if (smsMessagingServiceSid) {
    parameters.set("MessagingServiceSid", smsMessagingServiceSid);
  } else if (from) {
    parameters.set("From", channel === "whatsapp" && !from.startsWith("whatsapp:")
      ? `whatsapp:${from}`
      : from);
  } else {
    throw new Error(channel === "whatsapp"
      ? "TWILIO_WHATSAPP_FROM is not configured"
      : "Set TWILIO_SMS_FROM or TWILIO_SMS_MESSAGING_SERVICE_SID");
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: parameters,
      signal: AbortSignal.timeout(15000),
    }
  );
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const providerCode = result.code ? ` (${result.code})` : "";
    throw new Error(`Twilio ${channel} delivery failed with HTTP ${response.status}${providerCode}`);
  }
  return { provider: "twilio", messageId: result.sid };
}

async function sendWhatsappOtp({ phone, otp, role = "client" }) {
  const recipient = normalizeOtpPhone(phone);
  const contentSid = process.env.TWILIO_WHATSAPP_CONTENT_SID;
  if (!contentSid) {
    throw new Error("Set an approved TWILIO_WHATSAPP_CONTENT_SID for WhatsApp OTP delivery");
  }
  const result = await sendTwilioOtp({
    channel: "whatsapp",
    to: `whatsapp:${recipient}`,
    contentSid,
    contentVariables: { "1": otp, "2": role === "advocate" ? "Advocate" : "Client" },
  });
  console.log(`[OTP] WhatsApp message accepted by ${result.provider}`);
  return result;
}

async function sendSmsOtp({ phone, otp, role = "client" }) {
  const recipient = normalizeOtpPhone(phone);
  const message = `Advocates Hub ${role === "advocate" ? "Advocate" : "Client"} verification code: ${otp}. Valid for 10 minutes. Do not share it.`;
  const result = await sendTwilioOtp({
    channel: "sms",
    to: recipient,
    body: message,
  });
  console.log(`[OTP] SMS message accepted by ${result.provider}`);
  return result;
}

/**
 * Sends a real-time OTP verification email to the registering client or advocate.
 */
async function sendOtpEmail({ to, otp, name, role = "client" }) {
  const recipientName = name || (role === "advocate" ? "Advocate" : "Client");
  const safeRecipientName = recipientName.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
  const subject = "Your Advocates Hub email verification code";

  const text = `
Hello ${recipientName},

Your verification code for registering your ${role === "advocate" ? "Advocate account" : "Client account"} on Advocates Hub is:

${otp}

This code is valid for 10 minutes. Please enter this OTP on the registration page to complete your signup.

If you did not request this code, please ignore this email.

Best regards,
Advocates Hub Team
advocatehub.in@gmail.com
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #ffffff; padding: 24px 30px; text-align: center; }
    .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #f8fafc; }
    .header p { margin: 0; font-size: 13px; color: #94a3b8; }
    .content { padding: 28px 30px; text-align: center; }
    .otp-box { display: inline-block; background: #f8fafc; border: 2px dashed #2563eb; color: #1e293b; letter-spacing: 8px; font-size: 32px; font-weight: 800; padding: 14px 28px; border-radius: 10px; margin: 20px 0; font-family: monospace; }
    .info { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 20px; }
    .footer { padding: 16px 30px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>⚖️ Advocates Hub</h2>
      <p>Email Verification Code</p>
    </div>
    <div class="content">
      <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 0;">
        Hello ${safeRecipientName},
      </p>
      <p class="info">
        Use the One-Time Password (OTP) below to verify your email and complete your <strong>${role === "advocate" ? "Advocate" : "Client"}</strong> account registration on Advocates Hub:
      </p>
      <div class="otp-box">${otp}</div>
      <p class="info" style="font-size: 13px; color: #ef4444;">
        ⏱️ This code will expire in 10 minutes. Do not share this OTP with anyone.
      </p>
    </div>
    <div class="footer">
      Advocates Hub Verification Desk · <a href="mailto:advocatehub.in@gmail.com" style="color: #2563eb;">advocatehub.in@gmail.com</a>
    </div>
  </div>
</body>
</html>
`.trim();

  const result = await deliverEmail({
    to,
    subject,
    text,
    html,
  });
  console.log(`[EmailService] OTP email delivered via ${result.provider}. MessageId: ${result.messageId || "not provided"}`);
  return result;
}

module.exports = {
  getAdminEmail,
  get ADMIN_EMAIL() { return getAdminEmail(); },
  notifyAdminNewClient,
  notifyAdminNewAdvocate,
  sendOtpEmail,
  sendWhatsappOtp,
  sendSmsOtp,
  sendAdminEmail,
  getStoredNotifications,
  deliverUndeliveredNotifications,
};
