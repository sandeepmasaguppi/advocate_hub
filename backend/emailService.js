// ============================================================
//  emailService.js — Automated Admin Email Notification Service
//  Sends instant registration alerts to advocatehub.in@gmail.com
//  whenever a Client or Advocate registers on Advocates Hub.
// ============================================================

const fs = require("fs");
const path = require("path");

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m && (process.env[m[1]] === undefined || process.env[m[1]] === "")) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
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

const NOTIFICATIONS_FILE = path.join(__dirname, "data", "admin_notifications.json");

/**
 * Persists an in-app audit record of the notification.
 */
function recordNotification(entry) {
  try {
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
  const user = process.env.SMTP_USER || "sandeepmasaguppi@gmail.com";
  const rawPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "";
  const pass = rawPass.replace(/\s+/g, "");

  if (!pass) {
    return null; // Awaiting user's SMTP password / App password
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

/**
 * Generic dispatch helper with dual-layer delivery:
 * 1. Live SMTP via Nodemailer if SMTP_PASS configured.
 * 2. Persistent storage in admin_notifications.json + Console alert.
 */
async function sendAdminEmail({ subject, text, html, meta = {} }) {
  const timestamp = new Date().toISOString();
  const recipient = getAdminEmail();
  const fromAddr = process.env.SMTP_FROM || `"Advocates Hub" <advocatehub.in@gmail.com>`;
  const replyTo = process.env.SMTP_REPLY_TO || "advocatehub.in@gmail.com";

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

  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromAddr,
        replyTo,
        to: recipient,
        subject,
        text,
        html,
      });
      console.log(`[EmailService] ✅ Email dispatched to ${recipient}. MessageId: ${info.messageId}`);
      notificationRecord.delivered = true;
      notificationRecord.messageId = info.messageId;
      notificationRecord.deliveredAt = new Date().toISOString();
    } catch (err) {
      console.warn(`[EmailService] ⚠️ SMTP delivery to ${recipient} failed: ${err.message}`);
      notificationRecord.error = err.message;
    }
  } else {
    console.log(`[EmailService] 📩 Registration Alert recorded for ${recipient}: "${subject}"`);
    console.log(`[EmailService] ℹ️ To enable live Gmail delivery, add SMTP_PASS=<your_gmail_app_password> to backend/.env`);
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

Admin Portal:  http://localhost:3000/admin
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
        <a href="http://localhost:3000/admin" class="btn">Open Admin Console →</a>
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
  const status = advocate.status || "approved";
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

Review & Manage: http://localhost:3000/admin
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
        <a href="http://localhost:3000/admin" class="btn">Review in Admin Console →</a>
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
    meta: { type: "advocate_registration", advocateId: advocate.id, email: advocate.email },
  });
}

function getStoredNotifications() {
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
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("SMTP credentials not configured (SMTP_PASS is required)");
  }

  if (!fs.existsSync(NOTIFICATIONS_FILE)) return { sent: 0, results: [] };

  let list = [];
  try {
    list = JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, "utf8"));
    if (!Array.isArray(list)) list = [];
  } catch {
    return { sent: 0, results: [] };
  }

  const recipient = getAdminEmail();
  const fromAddr = process.env.SMTP_FROM || `"Advocates Hub" <advocatehub.in@gmail.com>`;
  const replyTo = process.env.SMTP_REPLY_TO || "advocatehub.in@gmail.com";
  let sentCount = 0;
  const results = [];

  for (const item of list) {
    if (!item.delivered) {
      try {
        const targetTo = item.to || recipient;
        const info = await transporter.sendMail({
          from: fromAddr,
          replyTo,
          to: targetTo,
          subject: item.subject,
          text: item.text,
          html: item.html || `<div style="font-family: Arial, sans-serif; white-space: pre-wrap; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">${item.text}</div>`,
        });
        item.delivered = true;
        item.messageId = info.messageId;
        item.deliveredAt = new Date().toISOString();
        delete item.error;
        sentCount++;
        results.push({ id: item.id, status: "delivered", messageId: info.messageId });
        console.log(`[EmailService] ✅ Successfully delivered queued notification ${item.id} to ${targetTo}`);
      } catch (err) {
        console.warn(`[EmailService] ❌ Failed to deliver notification ${item.id}:`, err.message);
        item.error = err.message;
        results.push({ id: item.id, status: "failed", error: err.message });
      }
    }
  }

  if (sentCount > 0 || results.some(r => r.status === "failed")) {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(list, null, 2), "utf8");
  }

  return { sent: sentCount, results };
}

module.exports = {
  getAdminEmail,
  get ADMIN_EMAIL() { return getAdminEmail(); },
  notifyAdminNewClient,
  notifyAdminNewAdvocate,
  sendAdminEmail,
  getStoredNotifications,
  deliverUndeliveredNotifications,
};
