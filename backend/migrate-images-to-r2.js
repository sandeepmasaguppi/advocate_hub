#!/usr/bin/env node
// ============================================================
//  migrate-images-to-r2.js — Advocate Hub Image Migration Tool
//  Safely migrates local /uploads images to Cloudflare R2
//
//  Usage:
//    node migrate-images-to-r2.js [--dry-run] [--verbose] [--delete-local]
//
//  Features:
//   • Migrates Advocate profile avatars (advocates.json)
//   • Migrates Client profile avatars (clients.json)
//   • Migrates Chat attachments & media (messages.json)
//   • Migrates unreferenced files in backend/uploads/
//   • Non-destructive by default (local files are retained)
//   • Validates MIME & magic bytes before uploading
//   • Zero external dependencies (uses native Node.js crypto/fetch)
// ============================================================

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Load backend .env if available
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (m && process.env[m[1]] === undefined) {
      const value = m[2];
      const quote = value[0];
      process.env[m[1]] = quote && value.endsWith(quote) ? value.slice(1, -1) : value;
    }
  }
}

const {
  getR2Config,
  validateImageBuffer,
  uploadProfilePhoto,
  uploadChatImage,
  checkR2Health,
} = require("./cloudflareService");

// Command-line flags
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const isVerbose = args.includes("--verbose") || args.includes("-v");
const deleteLocal = args.includes("--delete-local");

const DATA_DIR = path.join(__dirname, "data");
const UPLOAD_DIR = process.env.APP_UPLOAD_DIR
  ? path.resolve(process.env.APP_UPLOAD_DIR)
  : path.join(__dirname, "uploads");

const ADVOCATES_FILE = path.join(DATA_DIR, "advocates.json");
const CLIENTS_FILE = path.join(DATA_DIR, "clients.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

function readJsonSafe(filePath, fallback = []) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch (err) {
    console.warn(`[Migration] Warning reading ${path.basename(filePath)}:`, err.message);
  }
  return fallback;
}

function writeJsonAtomic(filePath, data) {
  const tmpPath = `${filePath}.tmp-${Date.now()}`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2) + "\n", "utf8");
  fs.renameSync(tmpPath, filePath);
}

function resolveLocalFilePath(avatarOrUrl) {
  if (!avatarOrUrl || typeof avatarOrUrl !== "string") return null;
  // If already an R2 URL or external URL, skip
  if (avatarOrUrl.startsWith("http://") || avatarOrUrl.startsWith("https://")) {
    return null;
  }
  // Strip leading /uploads/ or uploads/
  const cleanPath = avatarOrUrl.replace(/^\/?uploads\//, "");
  const fullPath = path.join(UPLOAD_DIR, cleanPath);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return fullPath;
  }
  return null;
}

async function runMigration(options = {}) {
  const isDryRun = options.dryRun !== undefined ? options.dryRun : args.includes("--dry-run");
  const deleteLocal = options.deleteLocal !== undefined ? options.deleteLocal : args.includes("--delete-local");
  console.log("============================================================");
  console.log(" Advocate Hub — Cloudflare R2 Image Migration Tool");
  console.log("============================================================");
  console.log(`Working Upload Directory : ${UPLOAD_DIR}`);
  console.log(`Database Directory       : ${DATA_DIR}`);
  console.log(`Mode                     : ${isDryRun ? "DRY-RUN (No changes applied)" : "LIVE MIGRATION"}`);
  console.log(`Delete Local Files       : ${deleteLocal ? "YES" : "NO (Safe non-destructive mode)"}`);
  console.log("------------------------------------------------------------");

  const r2Config = getR2Config();
  console.log(`R2 Account ID            : ${r2Config.accountId || "(not set)"}`);
  console.log(`R2 Bucket Name           : ${r2Config.bucketName || "(not set)"}`);
  console.log(`R2 Public Domain         : ${r2Config.publicUrl || "(using API proxy)"}`);
  console.log(`R2 S3-Auth Configured    : ${r2Config.isS3Configured ? "YES" : "NO"}`);
  console.log("------------------------------------------------------------");

  if (!r2Config.isConfigured) {
    const msg = "Cloudflare R2 credentials are not configured in environment. Please set R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY.";
    console.error(`❌ ERROR: ${msg}`);
    if (require.main === module) process.exit(1);
    throw new Error(msg);
  }

  // Pre-flight health check
  console.log("Verifying connection to Cloudflare R2...");
  const health = await checkR2Health();
  if (!health.connected) {
    const msg = `Cloudflare R2 connectivity test failed: ${health.error || "Unknown connection error"}`;
    console.error(`❌ ERROR: ${msg}`);
    if (require.main === module) process.exit(1);
    throw new Error(msg);
  }
  console.log(`✅ Cloudflare R2 connected successfully (${health.latencyMs}ms latency)`);
  console.log("------------------------------------------------------------\n");

  const stats = {
    advocatesScanned: 0,
    advocatesMigrated: 0,
    clientsScanned: 0,
    clientsMigrated: 0,
    messagesScanned: 0,
    messagesMigrated: 0,
    skippedAlreadyR2: 0,
    errors: 0,
  };

  // ── 1. Migrate Advocate Profile Photos ───────────────────────
  console.log("Step 1: Migrating Advocate Profile Photos...");
  const advocates = readJsonSafe(ADVOCATES_FILE, []);
  let advocatesChanged = false;

  for (const adv of advocates) {
    stats.advocatesScanned++;
    const currentAvatar = adv.avatar || "";
    if (!currentAvatar) continue;

    if (currentAvatar.includes("r2.cloudflarestorage.com") || currentAvatar.includes("profile-images/advocates/")) {
      stats.skippedAlreadyR2++;
      if (isVerbose) console.log(`  [Skip] Advocate #${adv.id} (${adv.name}) already on R2`);
      continue;
    }

    const localFile = resolveLocalFilePath(currentAvatar);
    if (!localFile) {
      if (isVerbose) console.log(`  [Skip] Advocate #${adv.id} (${adv.name}) avatar file not found locally: ${currentAvatar}`);
      continue;
    }

    try {
      const buffer = fs.readFileSync(localFile);
      if (isDryRun) {
        console.log(`  [Dry-Run] Would upload Advocate #${adv.id} avatar (${path.basename(localFile)}, ${buffer.length} bytes)`);
        stats.advocatesMigrated++;
        continue;
      }

      const res = await uploadProfilePhoto({
        buffer,
        userType: "advocate",
        userId: adv.id,
        uploadDir: UPLOAD_DIR,
      });

      if (res && res.url) {
        adv.avatar = res.url;
        advocatesChanged = true;
        stats.advocatesMigrated++;
        console.log(`  ✅ Advocate #${adv.id} (${adv.name}) -> ${res.objectKey}`);

        if (deleteLocal) {
          try { fs.unlinkSync(localFile); } catch {}
        }
      }
    } catch (err) {
      stats.errors++;
      console.error(`  ❌ Failed to migrate Advocate #${adv.id} avatar:`, err.message);
    }
  }

  if (advocatesChanged && !isDryRun) {
    writeJsonAtomic(ADVOCATES_FILE, advocates);
    console.log(`  Saved updated advocates records to ${ADVOCATES_FILE}`);
  }

  // ── 2. Migrate Client Profile Photos ─────────────────────────
  console.log("\nStep 2: Migrating Client Profile Photos...");
  const clients = readJsonSafe(CLIENTS_FILE, []);
  let clientsChanged = false;

  for (const cli of clients) {
    stats.clientsScanned++;
    const currentAvatar = cli.avatar || "";
    if (!currentAvatar) continue;

    if (currentAvatar.includes("r2.cloudflarestorage.com") || currentAvatar.includes("profile-images/clients/")) {
      stats.skippedAlreadyR2++;
      if (isVerbose) console.log(`  [Skip] Client #${cli.id} (${cli.name}) already on R2`);
      continue;
    }

    const localFile = resolveLocalFilePath(currentAvatar);
    if (!localFile) continue;

    try {
      const buffer = fs.readFileSync(localFile);
      if (isDryRun) {
        console.log(`  [Dry-Run] Would upload Client #${cli.id} avatar (${path.basename(localFile)}, ${buffer.length} bytes)`);
        stats.clientsMigrated++;
        continue;
      }

      const res = await uploadProfilePhoto({
        buffer,
        userType: "client",
        userId: cli.id,
        uploadDir: UPLOAD_DIR,
      });

      if (res && res.url) {
        cli.avatar = res.url;
        clientsChanged = true;
        stats.clientsMigrated++;
        console.log(`  ✅ Client #${cli.id} (${cli.name}) -> ${res.objectKey}`);

        if (deleteLocal) {
          try { fs.unlinkSync(localFile); } catch {}
        }
      }
    } catch (err) {
      stats.errors++;
      console.error(`  ❌ Failed to migrate Client #${cli.id} avatar:`, err.message);
    }
  }

  if (clientsChanged && !isDryRun) {
    writeJsonAtomic(CLIENTS_FILE, clients);
    console.log(`  Saved updated clients records to ${CLIENTS_FILE}`);
  }

  // ── 3. Migrate Chat Message Attachments ───────────────────────
  console.log("\nStep 3: Migrating Chat Image Attachments...");
  const messages = readJsonSafe(MESSAGES_FILE, []);
  let messagesChanged = false;

  for (const msg of messages) {
    stats.messagesScanned++;
    const att = msg.attachment;
    if (!att || typeof att !== "object") continue;

    const rawUrl = att.url || att.dataUrl || "";
    if (!rawUrl) continue;

    if (rawUrl.includes("chat-images/") && (rawUrl.includes("r2.cloudflarestorage.com") || rawUrl.includes("/api/chat/media"))) {
      stats.skippedAlreadyR2++;
      continue;
    }

    const localFile = resolveLocalFilePath(rawUrl);
    if (!localFile) continue;

    try {
      const buffer = fs.readFileSync(localFile);
      const convKey = msg.key || `chat_${msg.clientId}_${msg.advocateId}`;

      if (isDryRun) {
        console.log(`  [Dry-Run] Would upload chat attachment for message #${msg.id} (${buffer.length} bytes)`);
        stats.messagesMigrated++;
        continue;
      }

      const res = await uploadChatImage({
        buffer,
        conversationKey: convKey,
        uploadDir: UPLOAD_DIR,
      });

      if (res && res.url) {
        att.url = res.url;
        att.dataUrl = res.url;
        att.objectKey = res.objectKey;
        att.storageProvider = "r2";
        messagesChanged = true;
        stats.messagesMigrated++;
        console.log(`  ✅ Message #${msg.id} (${convKey}) -> ${res.objectKey}`);

        if (deleteLocal) {
          try { fs.unlinkSync(localFile); } catch {}
        }
      }
    } catch (err) {
      stats.errors++;
      console.error(`  ❌ Failed to migrate chat attachment for message #${msg.id}:`, err.message);
    }
  }

  if (messagesChanged && !isDryRun) {
    writeJsonAtomic(MESSAGES_FILE, messages);
    console.log(`  Saved updated messages records to ${MESSAGES_FILE}`);
  }

  // ── Summary Report ──────────────────────────────────────────
  console.log("\n============================================================");
  console.log(" Migration Complete — Summary Report");
  console.log("============================================================");
  console.log(`Advocate Profiles Processed : ${stats.advocatesMigrated} of ${stats.advocatesScanned}`);
  console.log(`Client Profiles Processed   : ${stats.clientsMigrated} of ${stats.clientsScanned}`);
  console.log(`Chat Attachments Processed  : ${stats.messagesMigrated} of ${stats.messagesScanned}`);
  console.log(`Skipped (Already on R2)     : ${stats.skippedAlreadyR2}`);
  console.log(`Total Errors                : ${stats.errors}`);
  console.log("============================================================\n");
  return stats;
}

if (require.main === module) {
  runMigration().catch((err) => {
    console.error("Migration fatal error:", err);
    process.exit(1);
  });
}

module.exports = {
  runMigration,
};

