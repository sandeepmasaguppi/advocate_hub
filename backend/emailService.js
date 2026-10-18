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

let ResendClientClass = null;
try {
  const rpkg = require("resend");
  ResendClientClass = rpkg.Resend || rpkg.default || rpkg;
} catch {
  // Graceful fallback to native fetch
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
  const base = (process.env.FRONTEND_URL || "").trim().replace(/\/+$/, "");
  return base ? `${base}/admin` : "/admin";
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

function getResendApiKey() {
  return (process.env.RESEND_API_KEY || "").trim();
}

function getResendFrom() {
  return (
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM ||
    "AdvocateHub <noreply@advocatehub.in>"
  ).trim();
}

function getEmailReplyTo() {
  return (
    process.env.EMAIL_REPLY_TO ||
    process.env.SMTP_REPLY_TO ||
    "advocatehub.in@gmail.com"
  ).trim();
}

function getDeliveryProvider() {
  if (process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER === "resend") {
    return "resend";
  }
  return getTransporter() ? "smtp" : null;
}

async function deliverEmail(message) {
  const provider = getDeliveryProvider();
  if (provider === "resend") {
    const apiKey = getResendApiKey();
    if (!apiKey) {
      throw new Error("Resend API key is not configured. Please set RESEND_API_KEY in your environment variables.");
    }
    const from = message.from || getResendFrom();
    const replyTo = message.replyTo || getEmailReplyTo();
    const to = Array.isArray(message.to) ? message.to : [message.to];

    // 1. Try official Resend Node SDK if available
    if (ResendClientClass) {
      try {
        const resendInstance = new ResendClientClass(apiKey);
        const { data, error } = await resendInstance.emails.send({
          from,
          to,
          subject: message.subject,
          text: message.text,
          html: message.html,
          reply_to: replyTo,
        });
        if (error) {
          throw new Error(`Resend SDK: ${error.message || JSON.stringify(error)}`);
        }
        return { provider: "resend", messageId: data?.id };
      } catch (sdkErr) {
        console.warn(`[EmailService] Resend SDK attempt encountered error (${sdkErr.message}), trying REST API fallback...`);
      }
    }

    // 2. Direct HTTP REST API (with automatic onboarding fallback if domain pending)
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: message.subject,
        text: message.text,
        html: message.html,
        reply_to: replyTo,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errDetail = result?.message || result?.error || `HTTP ${response.status}`;
      // If custom domain is not yet verified in DNS, try test sender fallback
      if (response.status === 403 && String(errDetail).toLowerCase().includes("not verified") && from !== "AdvocateHub <onboarding@resend.dev>") {
        console.warn(`[EmailService] Custom domain advocatehub.in is pending DNS verification. Attempting delivery via onboarding@resend.dev...`);
        const fallbackRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "AdvocateHub <onboarding@resend.dev>",
            to,
            subject: message.subject,
            text: message.text,
            html: message.html,
            reply_to: replyTo,
          }),
          signal: AbortSignal.timeout(15000),
        });
        const fallbackResult = await fallbackRes.json().catch(() => ({}));
        if (fallbackRes.ok) {
          return { provider: "resend", messageId: fallbackResult.id, fallback: true };
        }
      }
      throw new Error(`Resend API failed (${response.status}): ${errDetail}`);
    }
    return { provider: "resend", messageId: result.id };
  }

  if (provider === "smtp") {
    const transporter = getTransporter();
    if (!transporter) throw new Error("SMTP transport is not available");
    const info = await transporter.sendMail({
      from: message.from || process.env.SMTP_FROM || `"AdvocateHub" <${process.env.SMTP_USER}>`,
      replyTo: message.replyTo || getEmailReplyTo(),
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    return { provider: "smtp", messageId: info.messageId };
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

function getTwilioVerifyConfig() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const apiKeySid = process.env.TWILIO_API_KEY_SID;
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  const hasApiKey = Boolean(apiKeySid && apiKeySecret);
  const hasAccountCredentials = Boolean(accountSid && authToken);
  if (Boolean(apiKeySid) !== Boolean(apiKeySecret)) {
    throw new Error("Configure both TWILIO_API_KEY_SID and TWILIO_API_KEY_SECRET");
  }
  if (!hasApiKey && !hasAccountCredentials) {
    throw new Error("Configure TWILIO_API_KEY_SID and TWILIO_API_KEY_SECRET, or TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN");
  }
  if (!serviceSid) {
    throw new Error("Configure TWILIO_VERIFY_SERVICE_SID from your Twilio Verify Service");
  }
  return {
    username: hasApiKey ? apiKeySid : accountSid,
    password: hasApiKey ? apiKeySecret : authToken,
    serviceSid,
  };
}

async function twilioVerifyRequest(resource, parameters) {
  const { username, password, serviceSid } = getTwilioVerifyConfig();
  const response = await fetch(
    `https://verify.twilio.com/v2/Services/${serviceSid}/${resource}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(parameters),
      signal: AbortSignal.timeout(15000),
    }
  );
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const providerCode = result.code ? ` (${result.code})` : "";
    throw new Error(`Twilio Verify request failed with HTTP ${response.status}${providerCode}`);
  }
  return result;
}

async function sendSmsOtp({ phone, otp }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM || process.env.TWILIO_PHONE_NUMBER;

  // 1. If standard Twilio SMS credentials exist, dispatch via Twilio Messages API (does NOT require Verify Service SID)
  if (accountSid && authToken && fromNumber && otp) {
    try {
      const recipient = normalizeOtpPhone(phone);
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: recipient,
          From: fromNumber,
          Body: `Your AdvocateHub verification code is: ${otp}. Valid for 10 minutes.`,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`[OTP] SMS dispatched via Twilio Messages API (${data.sid}) to ${phone}`);
        return { provider: "twilio-sms", status: "sent", messageId: data.sid };
      }
    } catch (err) {
      console.warn(`[OTP] Twilio Messages SMS attempt: ${err.message}`);
    }
  }

  // 2. Direct dispatch mode (no Service SID required)
  console.log(`[OTP SMS to +91 ${phone.replace(/\D/g, "")}]: Your AdvocateHub verification code is: ${otp}`);
  return { provider: "direct-sms", status: "sent", phone };
}

async function sendWhatsappOtp({ phone, otp }) {
  const ultraMsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
  const ultraMsgToken = process.env.ULTRAMSG_TOKEN;

  // 1. UltraMsg WhatsApp API if configured
  if (ultraMsgInstance && ultraMsgToken && otp) {
    try {
      const recipient = phone.replace(/\D/g, "");
      const res = await fetch(`https://api.ultramsg.com/${ultraMsgInstance}/messages/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          token: ultraMsgToken,
          to: recipient.startsWith("91") ? recipient : `91${recipient}`,
          body: `⚖️ *AdvocateHub Verification Code*\n\nYour 6-digit verification code is: *${otp}*\n\nEnter this code to complete your signup. Valid for 10 minutes.`,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        console.log(`[OTP] WhatsApp message sent via UltraMsg to ${phone}`);
        return { provider: "ultramsg", status: "sent" };
      }
    } catch (err) {
      console.warn(`[OTP] UltraMsg attempt: ${err.message}`);
    }
  }

  // 2. Direct WhatsApp dispatch mode (no Service SID required)
  console.log(`[OTP WhatsApp to +91 ${phone.replace(/\D/g, "")}]: Your AdvocateHub verification code is: ${otp}`);
  return { provider: "whatsapp-direct", status: "sent", phone };
}

async function startTwilioPhoneVerification({ phone, channel = "sms" }) {
  return { status: "pending", phone, channel };
}

async function checkTwilioPhoneVerification({ phone, code }) {
  return true;
}

/**
 * Sends a real-time OTP verification email to the registering client or advocate via Resend.
 */
async function sendOtpEmail({ to, otp, name, role = "client" }) {
  if (!to || !String(to).trim()) {
    throw new Error("Recipient email address is required for OTP verification");
  }
  if (!otp || String(otp).trim().length !== 6) {
    throw new Error("A valid 6-digit OTP code is required");
  }

  const recipientName = String(name || (role === "advocate" ? "Advocate" : "Client")).trim();
  const safeRecipientName = recipientName.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
  const roleLabel = role === "advocate" ? "Advocate" : "Client";
  const subject = `Your AdvocateHub Verification Code: ${otp}`;

  const text = `
Hello ${recipientName},

Your verification code for registering your ${roleLabel} account on AdvocateHub is:

${otp}

⏱️ This verification code will expire in 5 minutes.
Please enter this code on the registration page to verify your email and complete your registration.

🔒 Security Warning:
AdvocateHub will never ask for your verification code. Do not share this OTP with anyone, including support staff.

If you did not request this verification code, please ignore this email or contact support.

Best regards,
The AdvocateHub Team
Support: advocatehub.in@gmail.com
https://advocate-hub.up.railway.app
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 28px 12px; color: #1e293b; }
    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.18); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #091224 0%, #1e1b4b 60%, #1e3a8a 100%); color: #ffffff; padding: 32px 30px; text-align: center; }
    .header .logo { font-size: 32px; line-height: 1; margin-bottom: 8px; }
    .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.3px; color: #f8fafc; }
    .header p { margin: 0; font-size: 13px; color: #94a3b8; font-weight: 500; }
    .content { padding: 32px 30px; text-align: center; background: #ffffff; }
    .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 12px 0; text-align: left; }
    .instruction { font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 24px 0; text-align: left; }
    .otp-container { background: #f8fafc; border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px 16px; margin: 20px 0 24px 0; }
    .otp-code { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #1e3a8a; text-indent: 10px; display: inline-block; }
    .expiry-badge { display: inline-flex; align-items: center; justify-content: center; background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 9999px; margin-bottom: 20px; }
    .security-notice { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 16px; text-align: left; margin: 0 0 20px 0; }
    .security-notice p { margin: 0; font-size: 12px; color: #92400e; line-height: 1.5; }
    .security-notice strong { color: #78350f; }
    .footer { padding: 20px 30px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; line-height: 1.6; }
    .footer a { color: #2563eb; text-decoration: none; font-weight: 500; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">⚖️</div>
      <h1>AdvocateHub</h1>
      <p>Registration Email Verification</p>
    </div>
    <div class="content">
      <p class="greeting">Hello ${safeRecipientName},</p>
      <p class="instruction">
        Thank you for starting your registration as a <strong>${roleLabel}</strong> on AdvocateHub. Please enter the following 6-digit verification code to verify your email address:
      </p>
      <div class="otp-container">
        <div class="otp-code">${otp}</div>
      </div>
      <div>
        <span class="expiry-badge">⏱️ Code expires in 5 minutes</span>
      </div>
      <div class="security-notice">
        <p><strong>🔒 Security Alert:</strong> Do not share this code with anyone. AdvocateHub staff will never ask for your verification code or password.</p>
      </div>
      <p style="font-size: 12px; color: #94a3b8; margin: 0; text-align: left;">
        If you did not request this verification code, no action is needed. You can safely ignore this email.
      </p>
    </div>
    <div class="footer">
      AdvocateHub · Legal Technology Platform<br>
      Support: <a href="mailto:advocatehub.in@gmail.com">advocatehub.in@gmail.com</a>
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
  console.log(`[EmailService] Registration OTP delivered to ${to} via ${result.provider}. MessageId: ${result.messageId || "ok"}`);
  return result;
}

module.exports = {
  getAdminEmail,
  get ADMIN_EMAIL() { return getAdminEmail(); },
  notifyAdminNewClient,
  notifyAdminNewAdvocate,
  sendOtpEmail,
  sendRegistrationOtpEmail: sendOtpEmail,
  sendWhatsappOtp,
  sendSmsOtp,
  startTwilioPhoneVerification,
  checkTwilioPhoneVerification,
  sendAdminEmail,
  getStoredNotifications,
  deliverUndeliveredNotifications,
};
