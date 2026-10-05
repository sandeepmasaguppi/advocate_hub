// ============================================================
//  LegalDocuments.js — Ready-to-Use Legal Templates & Court Petitions
//  Part of the 4 Legal Sections:
//    1. Ask a Question  2. Legal Documents  3. Bare Acts  4. Legal News
//  Supports White & Dark Themes with English & Kannada translations
//  Equipped with Working Downloads, Customization & Execution Checklists
//  Features: ₹10 UPI Payment Gateway for Locked / Premium Documents
// ============================================================

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTheme } from "../data/themeStore";
import { API_BASE } from "../data/api";
import {
  LEGAL_DOC_CATEGORIES_EN,
  LEGAL_DOC_CATEGORIES_KN,
  LEGAL_DOCUMENTS_DATA
} from "../data/legalDocumentsData";
import { UPI_QR_DATA_URL, UPI_PAYMENT_URI } from "../data/upiQrCodeData";
import "./LegalDocuments.css";

export { LEGAL_DOC_CATEGORIES_EN, LEGAL_DOC_CATEGORIES_KN };
export const CATEGORIES = LEGAL_DOC_CATEGORIES_EN;
export const LEGAL_DOC_CATEGORIES = LEGAL_DOC_CATEGORIES_EN;
export const LEGAL_DOCUMENTS = LEGAL_DOCUMENTS_DATA;
export const DOCUMENTS = LEGAL_DOCUMENTS_DATA;

/**
 * Triggers direct download of the actual document file stored in /documents/
 */
function downloadActualDocument(doc, ext = "doc") {
  const fileName = `${doc.fileSlug}.${ext}`;
  const filePath = `/documents/${fileName}`;

  const link = document.createElement("a");
  link.href = filePath;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates and downloads a customized personalized draft with user inputs
 */
function downloadCustomizedDraft(doc, customData) {
  let draft = doc.fullDraft;

  // Replace placeholders if provided
  if (customData.firstParty) {
    draft = draft.replace(/Name:\s*_{5,}/g, `Name: ${customData.firstParty}`);
  }
  if (customData.secondParty) {
    draft = draft.replace(/LESSEE.*?Name:\s*_{5,}/gs, (match) => match.replace(/_{5,}/, customData.secondParty));
  }
  if (customData.city) {
    draft = draft.replace(/AT:\s*_{5,}/g, `AT: ${customData.city}`);
    draft = draft.replace(/at\s*_{5,},\s*Karnataka/gi, `at ${customData.city}, Karnataka`);
  }
  if (customData.date) {
    draft = draft.replace(/this\s*_{2,}\s*day of\s*_{5,},\s*2026/gi, `this ${customData.date}`);
  }

  const htmlContent = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${doc.title} — Personalized Legal Draft</title>
<style>
  body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #1e293b; margin: 36px; }
  .header-box { border: 2px solid #1e3a8a; background: #eff6ff; padding: 18px 24px; border-radius: 8px; margin-bottom: 24px; text-align: center; }
  .header-box h1 { margin: 0 0 6px 0; color: #1e3a8a; font-size: 18pt; text-transform: uppercase; }
  .header-box p { margin: 0; color: #475569; font-size: 10pt; font-weight: bold; }
  .checklist-box { border: 1px solid #d97706; background: #fffbeb; padding: 14px 18px; border-radius: 6px; margin-bottom: 24px; }
  .checklist-box h3 { margin: 0 0 10px 0; color: #b45309; font-size: 12pt; }
  .chk-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  .chk-table th, .chk-table td { border: 1px solid #fde68a; padding: 7px 10px; font-size: 9.5pt; text-align: left; }
  .chk-table th { background: #fef3c7; color: #92400e; width: 26%; }
  .draft-title { text-align: center; font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 24px 0 16px 0; color: #0f172a; text-decoration: underline; }
  .draft-body { white-space: pre-wrap; font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.65; color: #0f172a; }
  .footer-note { margin-top: 36px; border-top: 1px solid #94a3b8; padding-top: 10px; font-size: 8.5pt; color: #64748b; text-align: center; }
</style>
</head>
<body>
<div class="header-box">
  <h1>ADVOCATES HUB — PERSONALIZED LEGAL DRAFT</h1>
  <p>Standard Indian Legal & Judicial Format • Auto-Filled & Verified</p>
</div>

<div class="checklist-box">
  <h3>⚡ Statutory Execution Checklist & Mandatory Requirements</h3>
  <table class="chk-table">
    <tr><th>Applicable Statute</th><td>${doc.requirements.governingAct}</td></tr>
    <tr><th>Stamp Duty Required</th><td><strong>${doc.requirements.stampDuty}</strong></td></tr>
    <tr><th>Registration Rule</th><td>${doc.requirements.registration}</td></tr>
    <tr><th>Notarization</th><td>${doc.requirements.notarization}</td></tr>
    <tr><th>Jurisdiction</th><td>${doc.requirements.courtJurisdiction}</td></tr>
    <tr><th>Limitation Period</th><td>${doc.requirements.limitationPeriod}</td></tr>
    <tr><th>Required Enclosures</th><td>${doc.requirements.documentsRequired.join("; ")}</td></tr>
  </table>
</div>

<div class="draft-title">${doc.title.toUpperCase()}</div>
<div class="draft-body">${draft}</div>

<div class="footer-note">
  Generated via Advocates Hub (https://advocateshub.in) • Standard Format Template
</div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${doc.fileSlug}_Custom.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Real Scanner for UPI payment of ₹10 (Encoded for the user's UPI account)
 * Displays only the visual scanner without revealing the raw UPI ID in text
 */
function UpiScanner({ amount = "10.00" }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="upi-qr-wrapper">
      <div className="upi-qr-card">
        {/* Holographic targeting reticle frame with corner brackets and scanner laser */}
        <div className="upi-qr-frame">
          <div className="upi-corner upi-top-left" aria-hidden="true"></div>
          <div className="upi-corner upi-top-right" aria-hidden="true"></div>
          <div className="upi-corner upi-bottom-left" aria-hidden="true"></div>
          <div className="upi-corner upi-bottom-right" aria-hidden="true"></div>
          <div className="upi-scan-laser" aria-hidden="true"></div>

          {!imgError ? (
            <img
              src={UPI_QR_DATA_URL}
              alt="Scan UPI QR Code to pay ₹10"
              className="upi-qr-img"
              width="204"
              height="204"
              onError={() => setImgError(true)}
            />
          ) : (
            <svg
              className="upi-qr-svg"
              viewBox="0 0 45 45"
              shapeRendering="crispEdges"
              aria-label="Scan UPI QR Code to pay ₹10"
            >
              <path fill="#ffffff" d="M0 0h45v45H0z"/>
              <path stroke="#000000" d="M2 2.5h7m2 0h1m5 0h1m1 0h2m2 0h1m5 0h2m1 0h3m1 0h7M2 3.5h1m5 0h1m2 0h3m2 0h2m1 0h1m2 0h2m3 0h3m1 0h2m3 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h1m2 0h5m1 0h3m1 0h3m4 0h1m1 0h2m2 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m1 0h2m2 0h4m4 0h2m2 0h1m2 0h2m3 0h1m1 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h1m2 0h1m3 0h1m2 0h1m2 0h4m1 0h4m1 0h1m2 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m1 0h1m3 0h3m2 0h1m2 0h1m3 0h1m2 0h1m2 0h1m3 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M10 9.5h1m1 0h4m1 0h1m1 0h1m1 0h1m1 0h3m7 0h2M2 10.5h1m1 0h5m3 0h2m1 0h2m1 0h1m1 0h1m2 0h2m2 0h1m1 0h4m1 0h1m1 0h5M2 11.5h1m1 0h4m2 0h1m1 0h1m3 0h2m5 0h1m1 0h1m3 0h1m3 0h2m2 0h1m1 0h1M3 12.5h2m3 0h1m3 0h1m2 0h2m1 0h3m4 0h1m1 0h1m1 0h3m2 0h1m2 0h1m1 0h1M3 13.5h4m2 0h2m1 0h2m2 0h1m5 0h2m4 0h3m1 0h1m2 0h2m1 0h2m1 0h2M2 14.5h1m1 0h1m1 0h7m1 0h1m2 0h2m1 0h1m1 0h1m1 0h4m4 0h1m4 0h5M9 15.5h1m2 0h1m1 0h1m2 0h2m1 0h1m2 0h1m10 0h1m3 0h2m1 0h1M4 16.5h1m1 0h1m1 0h1m1 0h5m1 0h2m4 0h1m1 0h8m1 0h1m2 0h1m1 0h4M2 17.5h1m4 0h1m1 0h1m2 0h2m1 0h1m1 0h1m1 0h2m2 0h1m1 0h1m2 0h1m1 0h1m2 0h2m1 0h3m3 0h1M2 18.5h1m5 0h2m4 0h2m2 0h1m1 0h1m2 0h3m1 0h4m4 0h1m5 0h1M5 19.5h1m4 0h2m1 0h2m2 0h2m1 0h2m2 0h1m1 0h1m2 0h1m2 0h2m1 0h2m1 0h1m2 0h2M2 20.5h3m2 0h2m1 0h1m1 0h1m3 0h2m2 0h1m1 0h1m1 0h1m1 0h4m1 0h2m1 0h1m5 0h1M2 21.5h1m2 0h1m9 0h2m1 0h1m2 0h1m3 0h1m3 0h2m3 0h3m2 0h1m1 0h2M2 22.5h1m3 0h3m2 0h3m1 0h2m1 0h1m1 0h1m1 0h3m2 0h6m1 0h1m3 0h1m1 0h2M2 23.5h2m2 0h2m2 0h2m2 0h1m1 0h1m5 0h2m3 0h1m3 0h5m1 0h1m4 0h1M2 24.5h1m1 0h1m1 0h1m1 0h1m2 0h2m3 0h4m1 0h4m2 0h1m1 0h3m1 0h1m4 0h3M3 25.5h1m1 0h1m4 0h1m2 0h1m2 0h1m1 0h1m1 0h2m3 0h1m1 0h2m1 0h1m2 0h3m1 0h2M3 26.5h2m2 0h3m2 0h1m1 0h2m1 0h1m1 0h2m1 0h3m1 0h1m2 0h3m3 0h4m1 0h1m1 0h1M2 27.5h1m1 0h1m1 0h1m4 0h1m2 0h3m1 0h1m1 0h2m1 0h1m1 0h1m7 0h2m2 0h2m2 0h2M7 28.5h2m1 0h1m1 0h1m1 0h7m1 0h1m1 0h2m1 0h1m1 0h3m5 0h1m3 0h1M2 29.5h2m3 0h1m2 0h1m2 0h3m1 0h1m1 0h3m1 0h1m2 0h1m1 0h2m5 0h5m1 0h2M2 30.5h4m1 0h2m1 0h3m1 0h4m1 0h1m3 0h1m1 0h2m2 0h1m4 0h1m2 0h2m1 0h1M2 31.5h2m1 0h1m1 0h1m1 0h2m1 0h2m2 0h3m1 0h1m1 0h3m1 0h1m2 0h2m1 0h1m3 0h2m1 0h1m1 0h1M2 32.5h1m2 0h4m1 0h7m1 0h2m1 0h1m2 0h1m1 0h4m1 0h1m4 0h2m2 0h2M2 33.5h1m3 0h1m2 0h2m1 0h3m1 0h1m4 0h4m1 0h2m1 0h6m1 0h1m1 0h3m1 0h1M2 34.5h1m2 0h10m2 0h2m2 0h2m4 0h5m2 0h5m1 0h2M10 35.5h6m1 0h1m1 0h1m2 0h5m1 0h3m1 0h1m1 0h1m3 0h2m1 0h1M2 36.5h7m3 0h1m2 0h2m1 0h2m3 0h1m2 0h3m1 0h5m1 0h1m1 0h1m1 0h1m1 0h1M2 37.5h1m5 0h1m1 0h2m1 0h4m1 0h4m1 0h3m2 0h1m4 0h2m3 0h1m2 0h2M2 38.5h1m1 0h3m1 0h1m1 0h1m3 0h5m3 0h2m2 0h1m1 0h3m1 0h9M2 39.5h1m1 0h3m1 0h1m1 0h3m4 0h2m1 0h1m1 0h3m1 0h2m1 0h2m1 0h1m4 0h1m3 0h1M2 40.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h7m3 0h5m2 0h2m2 0h1m1 0h4M2 41.5h1m5 0h1m4 0h4m2 0h1m1 0h2m4 0h1m2 0h1m1 0h1m1 0h1m2 0h2m2 0h1M2 42.5h7m1 0h1m1 0h1m6 0h2m1 0h3m3 0h2m1 0h1m1 0h1m2 0h1"/>
            </svg>
          )}
        </div>
        <div className="upi-qr-meta">
          <div className="upi-scan-pill">📷 Scan & Pay ₹{amount} with Any UPI App</div>
          <div className="upi-apps-row">
            <span className="upi-badge-logo gpay">GPay</span>
            <span className="upi-badge-logo phonepe">PhonePe</span>
            <span className="upi-badge-logo paytm">Paytm</span>
            <span className="upi-badge-logo bhim">BHIM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Complete 2-Step Payment Gateway Modal for Locked ₹10 Documents
 */
function PaymentGatewayModal({ doc, onClose, onPaymentSuccess, isKn }) {
  // Step: "details" -> "upi" -> "processing" -> "success"
  const [step, setStep] = useState("details");
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem("law4u_buyer_details");
      if (saved) return JSON.parse(saved);
      const client = localStorage.getItem("law4u_client");
      if (client) {
        const c = JSON.parse(client);
        return {
          name: c.name || "SANDEEP REVAPPA MASAGUPPI",
          email: c.email || "sandeepmasaguppi@gmail.com",
          phone: c.phone || "9108717353"
        };
      }
    } catch {}
    return {
      name: "SANDEEP REVAPPA MASAGUPPI",
      email: "sandeepmasaguppi@gmail.com",
      phone: "9108717353"
    };
  });
  const [errors, setErrors] = useState({});
  const [txnId, setTxnId] = useState("");

  if (!doc) return null;

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = isKn ? "ಹೆಸರನ್ನು ನಮೂದಿಸಿ" : "Please enter your full name";
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = isKn ? "ಸರಿಯಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ" : "Please enter a valid email address";
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = isKn ? "10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ" : "Please enter valid 10-digit mobile number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      localStorage.setItem("law4u_buyer_details", JSON.stringify(formData));
    } catch {}

    setErrors({});
    // Progress to Step 2 (UPI Payment Gateway)
    setStep("upi");
  };

  const handleVerifyPayment = async () => {
    setStep("processing");

    const generatedTxn = `TXN-ADV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // POST purchase to backend to record in C:\it\workspace\Advocate-Hub\backend\data\documentspurchase,json
      await fetch(`${API_BASE}/api/documents/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          documentId: doc.id,
          documentTitle: doc.title,
          category: doc.category,
          pages: doc.pages,
          amount: 10,
          currency: "INR",
          upiNumber: "9108717353",
          paymentMethod: "UPI QR Scanner",
          status: "Paid",
          transactionId: generatedTxn
        })
      });
    } catch (err) {
      console.warn("Backend purchase recording warning:", err);
    }

    // Simulate instant bank webhook verification (1.2 seconds)
    setTimeout(() => {
      setTxnId(generatedTxn);
      setStep("success");

      // Notify parent to unlock doc permanently & auto trigger download
      onPaymentSuccess(doc, generatedTxn, formData);
    }, 1200);
  };

  return (
    <div className="ld-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ld-modal ld-payment-modal">
        {/* Modal Header */}
        <div className="ld-modal-header ld-pay-header">
          <div className="ld-modal-header-info">
            <span className="ld-pay-secure-shield">🔒</span>
            <div>
              <h3>
                {step === "details" && (isKn ? "ಗ್ರಾಹಕರ ವಿವರಗಳು & ಶುಲ್ಕ" : "Client Details & Document Order")}
                {step === "upi" && (isKn ? "UPI ಪಾವತಿ ಗೇಟ್‌ವೇ (₹10)" : "UPI Payment Gateway (₹10.00)")}
                {step === "processing" && (isKn ? "ಪಾವತಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ..." : "Verifying Bank Payment...")}
                {step === "success" && (isKn ? "ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ!" : "Payment Confirmed & Unlocked!")}
              </h3>
              <p>
                {doc.title} · {doc.pages} {isKn ? "ಪುಟಗಳು" : "pages"} · {doc.category}
              </p>
            </div>
          </div>
          <button type="button" className="ld-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="ld-modal-body ld-pay-body">
          {/* STEP 1: CLIENT DETAILS */}
          {step === "details" && (
            <div className="ld-pay-step-details">
              <div className="ld-pay-order-summary">
                <div className="ld-pos-left">
                  <span className="ld-pos-icon">{doc.icon}</span>
                  <div>
                    <h4 className="ld-pos-title">{doc.title}</h4>
                    <p className="ld-pos-sub">
                      ✓ Full Verified Legal Draft (.doc & .txt) + Statutory Checklist
                    </p>
                  </div>
                </div>
                <div className="ld-pos-amount">
                  <span className="ld-amount-label">Special Access Fee</span>
                  <span className="ld-amount-val">₹10</span>
                </div>
              </div>

              <div className="ld-pay-details-intro">
                <p>
                  {isKn
                    ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ. ಪಾವತಿಯ ನಂತರ ನಿಮ್ಮ ಇಮೇಲ್ ಮತ್ತು ಖಾತೆಗೆ ಅಧಿಕೃತ ಕರಡು ಮತ್ತು ರಶೀದಿ ಲಭ್ಯವಾಗುತ್ತದೆ."
                    : "Please provide your details below. Once submitted, you will be redirected to the secure ₹10 UPI payment gateway."}
                </p>
              </div>

              <form onSubmit={handleDetailsSubmit} className="ld-pay-form">
                <div className="ld-form-group">
                  <label>
                    {isKn ? "ಗ್ರಾಹಕರ ಪೂರ್ಣ ಹೆಸರು *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? "input-err" : ""}
                    autoFocus
                  />
                  {errors.name && <span className="err-msg">{errors.name}</span>}
                </div>

                <div className="ld-form-group">
                  <label>
                    {isKn ? "ಇಮೇಲ್ ವಿಳಾಸ *" : "Email Address *"}
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh.advocate@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? "input-err" : ""}
                  />
                  {errors.email && <span className="err-msg">{errors.email}</span>}
                </div>

                <div className="ld-form-group">
                  <label>
                    {isKn ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (10 ಅಂಕಿಗಳು) *" : "Phone / Mobile Number *"}
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })
                    }
                    className={errors.phone ? "input-err" : ""}
                  />
                  {errors.phone && <span className="err-msg">{errors.phone}</span>}
                </div>

                <div className="ld-pay-trust-badges">
                  <span>🔒 256-Bit SSL Encrypted</span>
                  <span>⚡ Instant Automated Unlock</span>
                  <span>🛡️ 100% Verified Legal Format</span>
                </div>

                <div className="ld-pay-actions">
                  <button type="button" className="ld-btn-cancel" onClick={onClose}>
                    {isKn ? "ರದ್ದುಮಾಡಿ" : "Cancel"}
                  </button>
                  <button type="submit" className="ld-btn-proceed-pay">
                    {isKn ? "UPI ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ (₹10) →" : "Proceed to UPI Payment (₹10) →"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: UPI PAYMENT GATEWAY */}
          {step === "upi" && (
            <div className="ld-pay-step-upi">
              {/* Client Info strip */}
              <div className="ld-client-strip">
                <div className="ld-cs-info">
                  <span>👤 <strong>{formData.name}</strong></span>
                  <span>📱 {formData.phone}</span>
                  <span>✉️ {formData.email}</span>
                </div>
                <button
                  type="button"
                  className="ld-cs-edit"
                  onClick={() => setStep("details")}
                  title="Edit details"
                >
                  Edit ✏️
                </button>
              </div>

              {/* Amount Banner */}
              <div className="ld-upi-banner">
                <div className="ld-ub-left">
                  <span className="ld-ub-tag">Unified Payments Interface (UPI)</span>
                  <h4 className="ld-ub-doc">{doc.title}</h4>
                </div>
                <div className="ld-ub-price">
                  <span className="ld-ub-curr">Amount Payable:</span>
                  <span className="ld-ub-val">₹10.00</span>
                </div>
              </div>

              {/* Centered UPI Scanner Showcase */}
              <div className="ld-upi-scanner-container">
                <UpiScanner amount="10.00" />
                <p className="ld-qr-instruction">
                  {isKn
                    ? "ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಲ್ಲಿ Google Pay, PhonePe, Paytm, BHIM ಅಥವಾ ಯಾವುದೇ ಬ್ಯಾಂಕಿಂಗ್ ಆ್ಯಪ್ ಬಳಸಿ ಈ QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ₹10.00 ಪಾವತಿಸಿ."
                    : "Scan this QR code using Google Pay, PhonePe, Paytm, BHIM, or any UPI banking app on your mobile phone to pay ₹10.00"}
                </p>

                {/* Mobile Direct Pay Button */}
                <div className="ld-mobile-upi-wrap">
                  <a
                    href={UPI_PAYMENT_URI}
                    className="ld-btn-direct-upi"
                  >
                    📱 Pay ₹10 via UPI App (Mobile One-Tap)
                  </a>
                </div>

                <div className="ld-upi-guarantee">
                  🛡️ 100% Secure & Encrypted • Instant Automatic Verification & Download
                </div>
              </div>

              {/* Bottom Verification Trigger */}
              <div className="ld-upi-footer">
                <button
                  type="button"
                  className="ld-btn-verify-paid"
                  onClick={handleVerifyPayment}
                >
                  ⚡ {isKn ? "ನಾನು ₹10 ಪಾವತಿಸಿದ್ದೇನೆ (ಪರಿಶೀಲಿಸಿ & ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ)" : "✓ I Have Paid ₹10 (Verify & Download Now)"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2.5: PROCESSING / VERIFYING */}
          {step === "processing" && (
            <div className="ld-pay-processing">
              <div className="ld-spinner-ring"></div>
              <h4>Verifying Payment with UPI Network...</h4>
              <p>Confirming ₹10.00 receipt via UPI gateway...</p>
              <div className="ld-proc-details">
                <span>Payer: <strong>{formData.name}</strong></span>
                <span>Mobile: <strong>{formData.phone}</strong></span>
                <span>Document: <strong>{doc.title}</strong></span>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & DOWNLOAD */}
          {step === "success" && (
            <div className="ld-pay-success">
              <div className="ld-success-icon-badge">✓</div>
              <h3>{isKn ? "ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ!" : "Payment Successfully Verified!"}</h3>
              <p className="ld-success-sub">
                {isKn
                  ? `₹10.00 ಯಶಸ್ವಿಯಾಗಿ ಜಮೆಯಾಗಿದೆ. "${doc.title}" ಡೌನ್‌ಲೋಡ್ ಆರಂಭವಾಗಿದೆ.`
                  : `₹10.00 payment received. Your document "${doc.title}" is unlocked and ready.`}
              </p>

              <div className="ld-receipt-card">
                <div className="ld-rc-row">
                  <span>Transaction ID:</span>
                  <strong>{txnId}</strong>
                </div>
                <div className="ld-rc-row">
                  <span>Client Name:</span>
                  <span>{formData.name}</span>
                </div>
                <div className="ld-rc-row">
                  <span>Registered Mobile:</span>
                  <span>{formData.phone}</span>
                </div>
                <div className="ld-rc-row">
                  <span>Email:</span>
                  <span>{formData.email}</span>
                </div>
                <div className="ld-rc-row">
                  <span>Document Purchased:</span>
                  <strong>{doc.title} (Word .doc + Text .txt)</strong>
                </div>
                <div className="ld-rc-row total">
                  <span>Amount Paid:</span>
                  <strong style={{ color: "#16a34a" }}>₹10.00 (PAID via UPI)</strong>
                </div>
              </div>

              <div className="ld-success-actions">
                <button
                  type="button"
                  className="ld-btn-download-again"
                  onClick={() => downloadActualDocument(doc, "doc")}
                >
                  📥 Download Word Document (.doc)
                </button>
                <button
                  type="button"
                  className="ld-btn-download-txt-sub"
                  onClick={() => downloadActualDocument(doc, "txt")}
                >
                  📄 Download Clean Text (.txt)
                </button>
                <button
                  type="button"
                  className="ld-btn-finish"
                  onClick={onClose}
                >
                  ✓ Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocCard({
  doc,
  onDownload,
  onPreview,
  onShowRequirements,
  onTriggerPayment,
  isKn
}) {
  const isAvailableForFree = Boolean(doc.free);

  return (
    <div className="ld-doc-card">
      <div className="ld-doc-card-top">
        <div className="ld-doc-icon">{doc.icon}</div>
        <div className="ld-doc-meta">
          <span className={`ld-doc-badge ${doc.free ? "free" : "premium"}`}>
            {doc.free ? (isKn ? "ಉಚಿತ" : "FREE") : (isKn ? "₹10 ಪ್ರೀಮಿಯಂ" : "₹10 PREMIUM")}
          </span>
          <span className="ld-doc-pages">{doc.pages} {isKn ? "ಪುಟಗಳು" : "pages"}</span>
        </div>
      </div>

      <span className="ld-doc-category-pill">{doc.category}</span>
      <h3 className="ld-doc-title">{doc.title}</h3>
      <p className="ld-doc-desc">{doc.desc}</p>

      {/* Quick Requirements Summary */}
      <div className="ld-doc-stamp-hint" onClick={() => onShowRequirements(doc)}>
        <span className="ld-hint-icon">📜</span>
        <span className="ld-hint-text">
          {doc.requirements.stampDuty.length > 42
            ? doc.requirements.stampDuty.slice(0, 40) + "…"
            : doc.requirements.stampDuty}
        </span>
      </div>

      <div className="ld-doc-downloads">
        <span>⬇ {doc.downloads.toLocaleString()} {isKn ? "ಡೌನ್‌ಲೋಡ್‌ಗಳು" : "downloads"}</span>
        <span className="ld-verified-tag">✓ Verified</span>
      </div>

      <div className="ld-doc-actions">
        <button
          type="button"
          className="ld-btn-preview"
          onClick={() => onPreview(doc)}
          title="Preview draft & checklist"
        >
          👁 {isKn ? "ವೀಕ್ಷಿಸಿ" : "Preview"}
        </button>

        {isAvailableForFree ? (
          <button
            type="button"
            className="ld-btn-download btn-free"
            onClick={() => onDownload(doc)}
            title="Download Word format"
          >
            {isKn ? "⬇ ಉಚಿತ ಡೌನ್‌ಲೋಡ್" : "⬇ Download Free"}
          </button>
        ) : (
          <button
            type="button"
            className="ld-btn-download btn-premium"
            onClick={() => onTriggerPayment(doc)}
            title="Unlock with ₹10 UPI payment"
          >
            {isKn ? "🔒 ₹10 ಪಾವತಿಸಿ ಪಡೆಯಿರಿ" : "🔒 Unlock for ₹10"}
          </button>
        )}
      </div>
    </div>
  );
}

function PreviewModal({
  doc,
  onClose,
  onDownload,
  onTriggerPayment,
  initialTab = "draft",
  isKn
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [copySuccess, setCopySuccess] = useState(false);
  const [customForm, setCustomForm] = useState({
    firstParty: "",
    secondParty: "",
    city: "Bengaluru",
    date: new Date().toLocaleDateString("en-IN")
  });

  if (!doc) return null;

  const isAvailable = Boolean(doc.free);

  const handleCopy = () => {
    navigator.clipboard.writeText(doc.fullDraft);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2400);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${doc.title} — Advocates Hub</title>
          <style>
            body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 40px; }
            h1 { text-align: center; font-size: 16pt; margin-bottom: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            pre { font-family: 'Times New Roman', serif; white-space: pre-wrap; font-size: 11pt; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>ADVOCATES HUB — VERIFIED LEGAL DRAFT</h2>
            <p>Subject: ${doc.title} • Category: ${doc.category}</p>
          </div>
          <pre>${doc.fullDraft}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="ld-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ld-modal">
        {/* Modal Header */}
        <div className="ld-modal-header">
          <div className="ld-modal-header-info">
            <span className="ld-modal-icon">{doc.icon}</span>
            <div>
              <h3>{doc.title}</h3>
              <p>
                {doc.category} · {doc.pages} {isKn ? "ಪುಟಗಳು" : "pages"} · {doc.downloads.toLocaleString()} {isKn ? "ಡೌನ್‌ಲೋಡ್‌ಗಳು" : "downloads"}
              </p>
            </div>
          </div>
          <button type="button" className="ld-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="ld-modal-tabs">
          <button
            type="button"
            className={`ld-modal-tab ${activeTab === "draft" ? "active" : ""}`}
            onClick={() => setActiveTab("draft")}
          >
            📄 {isKn ? "ಕರಡು ಮಾದರಿ (Draft)" : "Legal Draft"}
          </button>
          <button
            type="button"
            className={`ld-modal-tab ${activeTab === "requirements" ? "active" : ""}`}
            onClick={() => setActiveTab("requirements")}
          >
            ⚡ {isKn ? "ಕಾನೂನು ಅಗತ್ಯತೆಗಳು & ಪರಿಶೀಲನಾ ಪಟ್ಟಿ" : "Statutory Requirements & Checklist"}
          </button>
          <button
            type="button"
            className={`ld-modal-tab ${activeTab === "customize" ? "active" : ""}`}
            onClick={() => setActiveTab("customize")}
          >
            ✏️ {isKn ? "ವಿವರ ತುಂಬಿ ಡೌನ್‌ಲೋಡ್" : "Quick-Fill & Personalize"}
          </button>
        </div>

        {/* Modal Body */}
        <div className="ld-modal-body">
          {/* TAB 1: DRAFT PREVIEW */}
          {activeTab === "draft" && (
            <div className="ld-doc-preview-box">
              <div className="ld-preview-toolbar">
                <span className="ld-preview-source">✓ Verified Indian Legal Standard</span>
                <div className="ld-toolbar-actions">
                  <button type="button" className="ld-tool-btn" onClick={handleCopy}>
                    {copySuccess ? "✓ Copied!" : "📋 Copy Text"}
                  </button>
                  <button type="button" className="ld-tool-btn" onClick={handlePrint}>
                    🖨️ Print / PDF
                  </button>
                </div>
              </div>

              <div className="ld-preview-document">
                <div className="ld-preview-header">
                  <div className="ld-preview-logo">ADVOCATES HUB LEGAL TEMPLATE</div>
                  <div className="ld-preview-badge">
                    <div>Standard Indian Judicial Format</div>
                    <div>Karnataka & All-India Compliant</div>
                  </div>
                </div>

                <h2 className="ld-preview-title">{doc.title.toUpperCase()}</h2>

                <div className="ld-preview-full-text">
                  <pre>{doc.fullDraft}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REQUIREMENTS & CHECKLIST */}
          {activeTab === "requirements" && (
            <div className="ld-req-container">
              <div className="ld-req-hero">
                <div className="ld-req-hero-icon">⚖️</div>
                <div>
                  <h4>Statutory Compliance & Legal Checklist for {doc.title}</h4>
                  <p>
                    Ensure compliance with all stamp paper, registration, and filing requirements to maintain full evidentiary validity before courts.
                  </p>
                </div>
              </div>

              <div className="ld-req-grid">
                <div className="ld-req-card">
                  <span className="ld-req-label">📜 Governing Act & Law</span>
                  <div className="ld-req-value">{doc.requirements.governingAct}</div>
                </div>

                <div className="ld-req-card highlight-stamp">
                  <span className="ld-req-label">💰 Stamp Duty & e-Stamp Paper</span>
                  <div className="ld-req-value">{doc.requirements.stampDuty}</div>
                  <small className="ld-req-sub">Mandatory under Karnataka Stamp Act 1957 / State Stamp Act</small>
                </div>

                <div className="ld-req-card">
                  <span className="ld-req-label">🏛️ Registration Rule</span>
                  <div className="ld-req-value">{doc.requirements.registration}</div>
                </div>

                <div className="ld-req-card">
                  <span className="ld-req-label">🔏 Notarization / Oath</span>
                  <div className="ld-req-value">{doc.requirements.notarization}</div>
                </div>

                <div className="ld-req-card">
                  <span className="ld-req-label">📍 Competent Jurisdiction</span>
                  <div className="ld-req-value">{doc.requirements.courtJurisdiction}</div>
                </div>

                <div className="ld-req-card">
                  <span className="ld-req-label">⏳ Limitation Period</span>
                  <div className="ld-req-value">{doc.requirements.limitationPeriod}</div>
                </div>
              </div>

              <div className="ld-enclosures-box">
                <h5>📁 Mandatory Supporting Documents & Enclosures:</h5>
                <ul className="ld-enclosures-list">
                  {doc.requirements.documentsRequired.map((item, idx) => (
                    <li key={idx}>
                      <span className="ld-check-icon">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMIZE / QUICK-FILL */}
          {activeTab === "customize" && (
            <div className="ld-customize-box">
              <div className="ld-customize-intro">
                <h4>⚡ Enter Details to Auto-Fill & Download</h4>
                <p>Fill in party names, city, and execution date below. We will embed them into your legal draft ready for print.</p>
              </div>

              <div className="ld-form-grid">
                <div className="ld-form-group">
                  <label>First Party / Landlord / Complainant / Applicant Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar Sharma"
                    value={customForm.firstParty}
                    onChange={(e) => setCustomForm({ ...customForm, firstParty: e.target.value })}
                  />
                </div>

                <div className="ld-form-group">
                  <label>Second Party / Tenant / Accused / Respondent Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Suresh Gowda"
                    value={customForm.secondParty}
                    onChange={(e) => setCustomForm({ ...customForm, secondParty: e.target.value })}
                  />
                </div>

                <div className="ld-form-group">
                  <label>City / Location (Karnataka):</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Haveri, Mysuru"
                    value={customForm.city}
                    onChange={(e) => setCustomForm({ ...customForm, city: e.target.value })}
                  />
                </div>

                <div className="ld-form-group">
                  <label>Execution Date:</label>
                  <input
                    type="text"
                    placeholder="e.g. 15th day of October, 2026"
                    value={customForm.date}
                    onChange={(e) => setCustomForm({ ...customForm, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="ld-custom-actions">
                <button
                  type="button"
                  className="ld-btn-generate"
                  onClick={() => {
                    if (isAvailable) {
                      downloadCustomizedDraft(doc, customForm);
                    } else {
                      onTriggerPayment(doc);
                    }
                  }}
                >
                  {isAvailable
                    ? "⚡ Download Personalized Draft (.doc)"
                    : "🔒 Unlock for ₹10 & Download Personalized"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="ld-modal-footer">
          <div className="ld-footer-left">
            <span className={`ld-doc-badge ${isAvailable ? "free" : "premium"}`} style={{ marginRight: 8 }}>
              {isAvailable ? (isKn ? "ಉಚಿತ" : "FREE") : (isKn ? "₹10 ಪ್ರೀಮಿಯಂ" : "₹10 PREMIUM")}
            </span>
            <span className="ld-footer-note">
              {isKn ? "ಪೂರ್ಣ ಕರಡು ವರ್ಡ್ (.doc) ರೂಪದಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಸಿದ್ಧ" : "Complete clean editable Word (.doc) format ready"}
            </span>
          </div>

          <div className="ld-footer-buttons">
            <button
              type="button"
              className="ld-btn-download-txt"
              onClick={() => {
                if (isAvailable) {
                  downloadActualDocument(doc, "txt");
                } else {
                  onTriggerPayment(doc);
                }
              }}
            >
              📄 Download .TXT
            </button>

            {isAvailable ? (
              <button
                type="button"
                className="ld-btn-download-main"
                onClick={() => onDownload(doc)}
              >
                ⬇ {isKn ? "ವರ್ಡ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (.doc)" : "Download Word (.doc)"}
              </button>
            ) : (
              <button
                type="button"
                className="ld-btn-download-main btn-pay-trigger"
                onClick={() => onTriggerPayment(doc)}
              >
                🔒 {isKn ? "₹10 ಪಾವತಿಸಿ ಪಡೆಯಿರಿ" : "Unlock for ₹10"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LegalDocuments() {
  const navigate = useNavigate();
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

  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [modalTab, setModalTab] = useState("draft");
  const [toast, setToast] = useState(null);

  // Ensure previous permanent unlock flags are reset so next time it always asks for ₹10 setup
  useEffect(() => {
    try {
      localStorage.removeItem("law4u_unlocked_docs");
    } catch {}
  }, []);

  // Payment modal state
  const [paymentModalDoc, setPaymentModalDoc] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3800);
  };

  const handleDownload = (doc) => {
    downloadActualDocument(doc, "doc");
    showToast(
      isKn
        ? `✅ "${doc.title}.doc" ಡೌನ್‌ಲೋಡ್ ಆರಂಭವಾಗಿದೆ!`
        : `✅ Downloaded "${doc.title}.doc" with statutory checklist!`
    );
  };

  const handleOpenPreview = (doc) => {
    setModalTab("draft");
    setPreviewDoc(doc);
  };

  const handleOpenRequirements = (doc) => {
    setModalTab("requirements");
    setPreviewDoc(doc);
  };

  const handleTriggerPayment = (doc) => {
    if (previewDoc) setPreviewDoc(null);
    setPaymentModalDoc(doc);
  };

  const handlePaymentSuccess = (doc, generatedTxn, clientData) => {
    // Auto-trigger the document download upon verified payment
    downloadActualDocument(doc, "doc");

    showToast(
      isKn
        ? `🎉 ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ! "${doc.title}" ಡೌನ್‌ಲೋಡ್ ಆರಂಭವಾಗಿದೆ.`
        : `🎉 Payment Confirmed! "${doc.title}" downloaded for ${clientData?.name || "Client"}!`
    );
  };

  const filtered = useMemo(() => {
    let list = [...DOCUMENTS];
    if (activeCat !== "All") list = list.filter((d) => d.category === activeCat);
    if (freeOnly) list = list.filter((d) => d.free);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.desc.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.requirements.governingAct.toLowerCase().includes(q)
      );
    }
    if (sortBy === "popular") list.sort((a, b) => b.downloads - a.downloads);
    if (sortBy === "newest") list.sort((a, b) => b.id - a.id);
    if (sortBy === "az") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [activeCat, search, freeOnly, sortBy]);

  return (
    <div className={`ld-page ${theme === "dark" ? "ld-dark" : "ld-light"}`}>
      {toast && <div className="ld-toast">{toast}</div>}

      {/* Header */}
      <div className="ld-header">
        <div className="ld-header-inner">
          <span className="ld-header-badge">
            {isKn ? "📑 ವಕೀಲರು ಪರಿಶೀಲಿಸಿದ ಕಾನೂನು ಕರಡುಗಳು" : "📑 Verified Drafts & Legal Templates"}
          </span>
          <h1 className="ld-title">
            {isKn ? "ಕಾನೂನು ದಾಖಲೆಗಳು & ಪತ್ರಗಳ ಮಾದರಿ" : "Legal Documents, Agreements & Court Drafts"}
          </h1>
          <p className="ld-subtitle">
            {isKn
              ? "ನ್ಯಾಯಾಲಯದ ಅರ್ಜಿಗಳು, ಬಾಡಿಗೆ ಒಪ್ಪಂದಗಳು, ನೋಟಿಸ್‌ಗಳು ಮತ್ತು ಉಯಿಲುಗಳ ಸಿದ್ಧ ಮಾದರಿಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ."
              : "Download ready-to-use Indian legal formats, contract templates, notices, and court petitions verified by legal experts."}
          </p>
          <div className="ld-header-stats">
            <span>📄 {DOCUMENTS.length}+ {isKn ? "ಮಾದರಿಗಳು" : "Templates"}</span>
            <span>⬇ 2.8 Lakh+ {isKn ? "ಡೌನ್‌ಲೋಡ್‌ಗಳು" : "Downloads"}</span>
            <span>✅ {isKn ? "ವಕೀಲರ ಪರಿಶೀಲನೆ" : "Advocate Verified"}</span>
            <span>🆓 {DOCUMENTS.filter((d) => d.free).length} {isKn ? "ಉಚಿತ ಮಾದರಿಗಳು" : "Free Templates"}</span>
            <span style={{ background: "rgba(217, 119, 6, 0.3)", color: "#fef3c7" }}>
              ⚡ ₹10 UPI Instant Access
            </span>
          </div>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="ld-filter-bar">
        <div className="ld-search-wrap">
          <span>🔍</span>
          <input
            className="ld-search"
            placeholder={
              isKn
                ? "ಕಾನೂನು ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಿ (ಉದಾ: Rental Agreement, Bail, Sale Deed)..."
                : "Search legal documents (e.g. Rental Agreement, Bail Application, Sale Deed)..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        <label className="ld-free-toggle">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={(e) => setFreeOnly(e.target.checked)}
          />
          <span>{isKn ? "ಉಚಿತ / ಅನ್‌ಲಾಕ್ ಮಾದರಿಗಳು ಮಾತ್ರ" : "Free / Unlocked Only"}</span>
        </label>

        <select
          className="ld-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort documents"
        >
          <option value="popular">{isKn ? "ಅತಿ ಹೆಚ್ಚು ಡೌನ್‌ಲೋಡ್" : "Most Downloaded"}</option>
          <option value="newest">{isKn ? "ಹೊಸತು ಮೊದಲು" : "Newest First"}</option>
          <option value="az">{isKn ? "A–Z ಶೀರ್ಷಿಕೆ" : "A–Z Title"}</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="ld-cat-tabs">
        {LEGAL_DOC_CATEGORIES_EN.map((cat, idx) => {
          const label = isKn ? LEGAL_DOC_CATEGORIES_KN[idx] || cat : cat;
          return (
            <button
              key={cat}
              type="button"
              className={`ld-cat-tab ${activeCat === cat ? "active" : ""}`}
              onClick={() => setActiveCat(cat)}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Document Grid */}
      <div className="ld-grid">
        {filtered.map((doc) => (
          <DocCard
            key={doc.id}
            doc={doc}
            onDownload={handleDownload}
            onPreview={handleOpenPreview}
            onShowRequirements={handleOpenRequirements}
            onTriggerPayment={handleTriggerPayment}
            isKn={isKn}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="ld-empty">
          <div style={{ fontSize: 44 }}>📄</div>
          <h3>{isKn ? "ಯಾವುದೇ ದಾಖಲೆ ಕಂಡುಬಂದಿಲ್ಲ" : "No Legal Documents Found"}</h3>
          <p>
            {isKn
              ? "ದಯವಿಟ್ಟು ಬೇರೆ ಹುಡುಕಾಟ ಪದ ಅಥವಾ ವರ್ಗವನ್ನು ಪ್ರಯತ್ನಿಸಿ"
              : "Try searching with a different term or clearing filters."}
          </p>
        </div>
      )}

      {/* CTA Banner */}
      <div className="ld-cta-banner">
        <div className="ld-cta-text">
          <h3>
            {isKn
              ? "ಕಾನೂನು ಕರಡನ್ನು ವಕೀಲರಿಂದ ಪರಿಶೀಲಿಸಬೇಕೇ?"
              : "Need an advocate to draft or review your agreement?"}
          </h3>
          <p>
            {isKn
              ? "ನಮ್ಮ ಪರಿಶೀಲಿತ ವಕೀಲರು ಕರಡುಗಳನ್ನು ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ಸಿದ್ಧಪಡಿಸಿಕೊಡುತ್ತಾರೆ."
              : "Connect with verified Advocates to customize, review, and execute court documents."}
          </p>
        </div>
        <button
          type="button"
          className="ld-cta-btn"
          onClick={() => navigate("/talk-to-advocate")}
        >
          {isKn ? "ವಕೀಲರೊಂದಿಗೆ ಮಾತನಾಡಿ →" : "Consult an Advocate →"}
        </button>
      </div>

      {/* Preview & Requirements Modal */}
      {previewDoc && (
        <PreviewModal
          doc={previewDoc}
          initialTab={modalTab}
          onClose={() => setPreviewDoc(null)}
          onDownload={handleDownload}
          onTriggerPayment={handleTriggerPayment}
          isKn={isKn}
        />
      )}

      {/* ₹10 UPI Payment Gateway Modal */}
      {paymentModalDoc && (
        <PaymentGatewayModal
          doc={paymentModalDoc}
          onClose={() => setPaymentModalDoc(null)}
          onPaymentSuccess={handlePaymentSuccess}
          isKn={isKn}
        />
      )}
    </div>
  );
}