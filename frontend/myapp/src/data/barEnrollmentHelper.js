// ============================================================
//  barEnrollmentHelper.js — Strict Bar Enrollment Formatter & Validator
//  Standard Format: KAR/1424/2016
//  • Starting 3 capital letters (e.g. KAR)
//  • Slash (/)
//  • Next 4 digits number (e.g. 1424)
//  • Middle slash (/)
//  • Next 4 digits year (e.g. 2016)
//  Total 8 digits of numbers separated by slashes: KAR/1424/2016
// ============================================================

export const BAR_ENROLLMENT_REGEX = /^[A-Z]{3}\/\d{4}\/\d{4}$/;

/**
 * Validates strictly whether value matches KAR/1424/2016 format.
 */
export function isValidBarEnrollment(val) {
  if (!val || typeof val !== "string") return false;
  return BAR_ENROLLMENT_REGEX.test(val.trim());
}

/**
 * Automatically formats user input to KAR/1424/2016 as they type or paste.
 * - Uppercases letters
 * - Disallows invalid characters
 * - Inserts slashes at the 3rd and 7th positions
 * - Limits strictly to 13 characters
 */
export function formatBarEnrollment(raw) {
  if (!raw) return "";

  // Convert to uppercase and strip invalid characters
  const clean = String(raw).toUpperCase().replace(/[^A-Z0-9/]/g, "");

  let letters = "";
  let digits = "";

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (letters.length < 3) {
      if (/[A-Z]/.test(ch)) {
        letters += ch;
      }
    } else {
      if (/[0-9]/.test(ch)) {
        if (digits.length < 8) {
          digits += ch;
        }
      }
    }
  }

  if (letters.length < 3) {
    return letters;
  }

  // Once 3 letters are typed, format as LLL/
  if (digits.length === 0) {
    return clean.includes("/") ? `${letters}/` : letters;
  }

  if (digits.length <= 4) {
    const firstPart = digits;
    if (digits.length === 4 && (clean.endsWith("/") || clean.split("/").length > 2)) {
      return `${letters}/${firstPart}/`;
    }
    return `${letters}/${firstPart}`;
  }

  const firstPart = digits.slice(0, 4);
  const secondPart = digits.slice(4, 8);
  return `${letters}/${firstPart}/${secondPart}`;
}

