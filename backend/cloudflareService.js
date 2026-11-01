// ============================================================
//  cloudflareService.js — Cloudflare R2 Object Storage Service
//  Advocate Hub — S3-Compatible Media Storage Layer
//
//  Capabilities:
//   • Client & Advocate profile photo storage (profile-images/*)
//   • Chat message image storage & private attachments (chat-images/*)
//   • S3-Compatible SigV4 REST integration (zero external dependencies)
//   • Short-lived signed URLs & authorized private streaming
//   • Robust fallback to local disk when R2 is not yet configured
//   • Non-destructive old-image cleanup & replacement
// ============================================================

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Default Cloudflare Account ID & Bucket
const DEFAULT_ACCOUNT_ID = "ae7c01580a124e31f7a13aba88731d3e";
const DEFAULT_BUCKET_NAME = "advocate-hub-media";
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB maximum upload size

/**
 * Reads Cloudflare R2 configuration from environment variables.
 * Supports both R2_* (standard S3-compatible) and CLOUDFLARE_* naming.
 */
function getR2Config() {
  const accountId = String(
    process.env.R2_ACCOUNT_ID ||
    process.env.CLOUDFLARE_ACCOUNT_ID ||
    DEFAULT_ACCOUNT_ID
  ).trim();

  const accessKeyId = String(
    process.env.R2_ACCESS_KEY_ID ||
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
    ""
  ).trim();

  const secretAccessKey = String(
    process.env.R2_SECRET_ACCESS_KEY ||
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
    ""
  ).trim();

  const bucketName = String(
    process.env.R2_BUCKET_NAME ||
    process.env.CLOUDFLARE_R2_BUCKET ||
    DEFAULT_BUCKET_NAME
  ).trim();

  const endpoint = String(
    process.env.R2_ENDPOINT ||
    (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : "")
  ).trim().replace(/\/+$/, "");

  const workerUrl = String(
    process.env.CLOUDFLARE_WORKER_URL ||
    process.env.WORKER_URL ||
    ""
  ).trim().replace(/\/+$/, "");

  let publicUrl = String(
    process.env.R2_PUBLIC_URL ||
    process.env.CLOUDFLARE_PUBLIC_DOMAIN ||
    ""
  ).trim().replace(/\/+$/, "");

  const apiToken = String(
    process.env.CLOUDFLARE_API_TOKEN ||
    process.env.R2_API_TOKEN ||
    ""
  ).trim();

  const isS3Configured = Boolean(accountId && accessKeyId && secretAccessKey && bucketName);
  const isRestConfigured = Boolean(accountId && apiToken && bucketName);
  const isWorkerConfigured = Boolean(workerUrl);
  const isConfigured = isS3Configured || isRestConfigured || isWorkerConfigured;

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    endpoint,
    publicUrl,
    publicDomain: publicUrl,
    workerUrl,
    isWorkerConfigured,
    apiToken,
    isS3Configured,
    isRestConfigured,
    isConfigured,
  };
}

// ── Image Validation & Magic Bytes Detection ─────────────────
const MAGIC_SIGNATURES = [
  { mime: "image/jpeg", ext: "jpg", check: (buf) => buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff },
  { mime: "image/png",  ext: "png", check: (buf) => buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 },
  { mime: "image/webp", ext: "webp", check: (buf) => buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP" },
  { mime: "image/gif",  ext: "gif", check: (buf) => buf.length >= 6 && (buf.toString("ascii", 0, 6) === "GIF87a" || buf.toString("ascii", 0, 6) === "GIF89a") },
];

function validateImageBuffer(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Invalid image data: Expected binary buffer");
  }

  if (buffer.length === 0) {
    throw new Error("Uploaded file is empty");
  }

  if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (buffer.length / (1024 * 1024)).toFixed(1);
    throw new Error(`Image size (${sizeMb} MB) exceeds maximum allowed limit of 10 MB`);
  }

  const detected = MAGIC_SIGNATURES.find((sig) => sig.check(buffer));
  if (!detected) {
    throw new Error("Unsupported or invalid image format. Supported formats: JPEG, PNG, WEBP, and GIF.");
  }

  return detected;
}

// ── AWS Signature Version 4 for Cloudflare R2 (Node.js native) ──
function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = crypto.createHmac("sha256", "AWS4" + key).update(dateStamp).digest();
  const kRegion = crypto.createHmac("sha256", kDate).update(regionName).digest();
  const kService = crypto.createHmac("sha256", kRegion).update(serviceName).digest();
  return crypto.createHmac("sha256", kService).update("aws4_request").digest();
}

/**
 * Uploads a binary buffer to Cloudflare R2 using AWS SigV4
 */
async function putObjectToR2ViaS3(buffer, key, contentType, config) {
  const { accountId, bucketName, accessKeyId, secretAccessKey } = config;
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const endpoint = `https://${host}/${bucketName}/${key}`;
  const region = "auto";
  const service = "s3";

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = crypto.createHash("sha256").update(buffer).digest("hex");
  const canonicalUri = `/${bucketName}/${encodeURI(key)}`;
  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest =
    `PUT\n` +
    `${canonicalUri}\n` +
    `\n` +
    `${canonicalHeaders}\n` +
    `${signedHeaders}\n` +
    `${payloadHash}`;

  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign =
    `${algorithm}\n` +
    `${amzDate}\n` +
    `${credentialScope}\n` +
    `${crypto.createHash("sha256").update(canonicalRequest).digest("hex")}`;

  const signingKey = getSignatureKey(secretAccessKey, dateStamp, region, service);
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");
  const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      Host: host,
      "x-amz-date": amzDate,
      "x-amz-content-sha256": payloadHash,
      Authorization: authorizationHeader,
    },
    body: buffer,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Cloudflare R2 S3 PUT failed (${response.status}): ${errText}`);
  }

  return true;
}

/**
 * Uploads to Cloudflare R2 using Cloudflare REST API (token auth)
 */
async function putObjectToR2ViaRest(buffer, key, contentType, config) {
  const { accountId, bucketName, apiToken } = config;
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects/${encodeURIComponent(key)}`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": contentType,
    },
    body: buffer,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Cloudflare R2 REST PUT failed (${response.status}): ${errText}`);
  }

  return true;
}

/**
 * Deletes an object from Cloudflare R2
 */
/**
 * Uploads to Cloudflare R2 via deployed Worker endpoint
 */
async function putObjectToR2ViaWorker(buffer, key, contentType, config) {
  const { workerUrl } = config;
  const endpoint = `${workerUrl}/upload?key=${encodeURIComponent(key)}`;
  const headers = { "Content-Type": contentType };
  if (process.env.AUTH_SECRET) {
    headers["X-Auth-Key"] = process.env.AUTH_SECRET;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: buffer,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Cloudflare Worker PUT failed (${response.status}): ${errText}`);
  }

  return true;
}

async function deleteObjectFromR2(key) {
  const config = getR2Config();
  if (!config.isConfigured || !key) return false;

  try {
    if (config.isS3Configured) {
      const { accountId, bucketName, accessKeyId, secretAccessKey } = config;
      const host = `${accountId}.r2.cloudflarestorage.com`;
      const endpoint = `https://${host}/${bucketName}/${key}`;
      const now = new Date();
      const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
      const dateStamp = amzDate.slice(0, 8);
      const payloadHash = crypto.createHash("sha256").update("").digest("hex");
      const canonicalUri = `/${bucketName}/${encodeURI(key)}`;
      const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
      const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
      const canonicalRequest = `DELETE\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
      const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${dateStamp}/auto/s3/aws4_request\n${crypto.createHash("sha256").update(canonicalRequest).digest("hex")}`;
      const signingKey = getSignatureKey(secretAccessKey, dateStamp, "auto", "s3");
      const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");

      await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Host: host,
          "x-amz-date": amzDate,
          "x-amz-content-sha256": payloadHash,
          Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${dateStamp}/auto/s3/aws4_request, SignedHeaders=${signedHeaders}, Signature=${signature}`,
        },
      });
      return true;
    } else if (config.isRestConfigured) {
      const endpoint = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/r2/buckets/${config.bucketName}/objects/${encodeURIComponent(key)}`;
      await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${config.apiToken}` },
      });
      return true;
    }
  } catch (err) {
    console.warn(`[CloudflareR2] Warning deleting object ${key}:`, err.message);
  }
  return false;
}

/**
 * Downloads or streams an object from Cloudflare R2
 */
async function fetchObjectFromR2(key) {
  const config = getR2Config();
  if (!config.isConfigured || !key) {
    throw new Error("Cloudflare R2 is not configured");
  }

  if (config.isS3Configured) {
    const { accountId, bucketName, accessKeyId, secretAccessKey } = config;
    const host = `${accountId}.r2.cloudflarestorage.com`;
    const endpoint = `https://${host}/${bucketName}/${key}`;
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.slice(0, 8);
    const payloadHash = crypto.createHash("sha256").update("").digest("hex");
    const canonicalUri = `/${bucketName}/${encodeURI(key)}`;
    const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
    const canonicalRequest = `GET\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
    const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${dateStamp}/auto/s3/aws4_request\n${crypto.createHash("sha256").update(canonicalRequest).digest("hex")}`;
    const signingKey = getSignatureKey(secretAccessKey, dateStamp, "auto", "s3");
    const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        Host: host,
        "x-amz-date": amzDate,
        "x-amz-content-sha256": payloadHash,
        Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${dateStamp}/auto/s3/aws4_request, SignedHeaders=${signedHeaders}, Signature=${signature}`,
      },
    });

    if (!res.ok) {
      throw new Error(`R2 fetch failed with status ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const buffer = Buffer.from(await res.arrayBuffer());
    return { buffer, contentType, length: buffer.length };
  } else if (config.isRestConfigured) {
    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/r2/buckets/${config.bucketName}/objects/${encodeURIComponent(key)}`;
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${config.apiToken}` },
    });
    if (!res.ok) throw new Error(`R2 REST fetch failed with status ${res.status}`);
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const buffer = Buffer.from(await res.arrayBuffer());
    return { buffer, contentType, length: buffer.length };
  }

  throw new Error("No valid Cloudflare R2 credentials found");
}

/**
 * Generates a short-lived pre-signed URL for private chat attachments (SigV4 Query Auth)
 */
function generateR2PresignedUrl(key, expiresInSeconds = 3600) {
  const config = getR2Config();
  if (!config.isS3Configured || !key) return null;

  const { accountId, bucketName, accessKeyId, secretAccessKey } = config;
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const region = "auto";
  const service = "s3";

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

  const queryParams = [
    `X-Amz-Algorithm=AWS4-HMAC-SHA256`,
    `X-Amz-Credential=${encodeURIComponent(accessKeyId + "/" + credentialScope)}`,
    `X-Amz-Date=${amzDate}`,
    `X-Amz-Expires=${expiresInSeconds}`,
    `X-Amz-SignedHeaders=host`,
  ];
  queryParams.sort();
  const canonicalQuery = queryParams.join("&");

  const canonicalUri = `/${bucketName}/${encodeURI(key)}`;
  const canonicalHeaders = `host:${host}\n`;
  const canonicalRequest = `GET\n${canonicalUri}\n${canonicalQuery}\n${canonicalHeaders}\nhost\nUNSIGNED-PAYLOAD`;

  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${crypto.createHash("sha256").update(canonicalRequest).digest("hex")}`;
  const signingKey = getSignatureKey(secretAccessKey, dateStamp, region, service);
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");

  return `https://${host}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`;
}

// ── Object Key Builders ──────────────────────────────────────
function buildProfileObjectKey(userType, userId, ext) {
  const cleanType = userType === "client" ? "clients" : "advocates";
  const cleanId = String(userId || "new").replace(/[^a-z0-9_-]/gi, "");
  const uniqueId = crypto.randomBytes(6).toString("hex");
  const timestamp = Date.now();
  return `profile-images/${cleanType}/${cleanId}/avatar-${timestamp}-${uniqueId}.${ext}`;
}

function buildChatObjectKey(conversationKey, ext) {
  const safeConv = String(conversationKey || "chat_general").replace(/[^a-z0-9_-]/gi, "_");
  const uniqueId = crypto.randomBytes(6).toString("hex");
  const timestamp = Date.now();
  return `chat-images/${safeConv}/img-${timestamp}-${uniqueId}.${ext}`;
}

// ── Local Fallback Storage Helper ────────────────────────────
function saveToLocalDisk(buffer, relativeKey, uploadDir) {
  const fullPath = path.join(uploadDir, relativeKey);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, buffer);
  return `/uploads/${relativeKey.replace(/\\/g, "/")}`;
}

/**
 * Uploads a profile photo (client or advocate) to Cloudflare R2
 */
async function uploadProfilePhoto({
  dataUri,
  buffer,
  userType = "advocate",
  userId = "new",
  previousKeyOrUrl = null,
  uploadDir = path.join(__dirname, "uploads"),
}) {
  let fileBuffer = buffer;
  let fileExt = "jpg";
  let fileMime = "image/jpeg";

  if (!fileBuffer && dataUri) {
    const match = String(dataUri).match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/i);
    if (!match) throw new Error("Invalid profile image format (base64 data URI required)");
    fileBuffer = Buffer.from(match[2], "base64");
  }

  // Validate magic bytes and format
  const validated = validateImageBuffer(fileBuffer);
  fileExt = validated.ext;
  fileMime = validated.mime;

  const objectKey = buildProfileObjectKey(userType, userId, fileExt);
  const config = getR2Config();

  // If R2 is configured, upload to Cloudflare R2
  if (config.isConfigured) {
    try {
      if (config.isS3Configured) {
        await putObjectToR2ViaS3(fileBuffer, objectKey, fileMime, config);
      } else {
        if (config.isWorkerConfigured) {
          await putObjectToR2ViaWorker(fileBuffer, objectKey, fileMime, config);
        } else {
          await putObjectToR2ViaRest(fileBuffer, objectKey, fileMime, config);
        }
      }

      const publicUrl = config.publicDomain
        ? `${config.publicDomain}/${objectKey}`
        : `/api/media/${encodeURIComponent(objectKey)}`;

      console.log(`[CloudflareR2] Uploaded ${userType} profile photo to R2: ${objectKey}`);

      // Safely delete previous R2 image if replacing an existing avatar
      if (previousKeyOrUrl && typeof previousKeyOrUrl === "string") {
        const prevKeyMatch = previousKeyOrUrl.match(/profile-images\/(clients|advocates)\/[^/]+\/[^?#]+/);
        if (prevKeyMatch) {
          deleteObjectFromR2(prevKeyMatch[0]).catch(() => {});
        }
      }

      return {
        success: true,
        provider: "r2",
        objectKey,
        url: publicUrl,
        contentType: fileMime,
        size: fileBuffer.length,
      };
    } catch (cfErr) {
      console.warn(`[CloudflareR2] Upload to Cloudflare R2 failed (${cfErr.message}). Using local fallback.`);
    }
  } else {
    console.log(`[CloudflareR2] R2 not configured in environment. Storing locally at /uploads/${objectKey}`);
  }

  // Fallback to local storage
  const localUrl = saveToLocalDisk(fileBuffer, objectKey, uploadDir);
  return {
    success: true,
    provider: "local_fallback",
    objectKey,
    url: localUrl,
    contentType: fileMime,
    size: fileBuffer.length,
  };
}

/**
 * Uploads a chat image (client or advocate) to Cloudflare R2
 */
async function uploadChatImage({
  dataUri,
  buffer,
  conversationKey = "chat_general",
  uploadDir = path.join(__dirname, "uploads"),
}) {
  let fileBuffer = buffer;
  if (!fileBuffer && dataUri) {
    const match = String(dataUri).match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/i);
    if (!match) throw new Error("Invalid chat image format");
    fileBuffer = Buffer.from(match[2], "base64");
  }

  const validated = validateImageBuffer(fileBuffer);
  const objectKey = buildChatObjectKey(conversationKey, validated.ext);
  const config = getR2Config();

  if (config.isConfigured) {
    try {
      if (config.isS3Configured) {
        await putObjectToR2ViaS3(fileBuffer, objectKey, validated.mime, config);
      } else {
        if (config.isWorkerConfigured) {
          await putObjectToR2ViaWorker(fileBuffer, objectKey, validated.mime, config);
        } else {
          await putObjectToR2ViaRest(fileBuffer, objectKey, validated.mime, config);
        }
      }

      // Private chat images: protected authorized endpoint
      const authorizedUrl = `/api/chat/media?key=${encodeURIComponent(objectKey)}`;
      console.log(`[CloudflareR2] Uploaded chat attachment to R2: ${objectKey}`);

      return {
        success: true,
        provider: "r2",
        objectKey,
        url: authorizedUrl,
        contentType: validated.mime,
        size: fileBuffer.length,
        isPrivate: true,
      };
    } catch (cfErr) {
      console.warn(`[CloudflareR2] Chat upload to R2 failed (${cfErr.message}). Using local fallback.`);
    }
  }

  // Fallback to local storage
  const localUrl = saveToLocalDisk(fileBuffer, objectKey, uploadDir);
  return {
    success: true,
    provider: "local_fallback",
    objectKey,
    url: localUrl,
    contentType: validated.mime,
    size: fileBuffer.length,
    isPrivate: true,
  };
}

/**
 * Helper to process any chat attachment (e.g. from /api/messages POST)
 */
async function processChatAttachmentForR2(attachment, conversationKey, uploadDir) {
  if (!attachment || typeof attachment !== "object") return attachment;
  const rawData = attachment.dataUrl || attachment.url || "";
  const isImage = attachment.isImage || String(rawData).startsWith("data:image/");

  if (isImage && String(rawData).startsWith("data:image/")) {
    try {
      const res = await uploadChatImage({
        dataUri: rawData,
        conversationKey,
        uploadDir,  
      });

      if (res && res.url) {
        return {
          ...attachment,
          url: res.url,
          dataUrl: res.url,
          objectKey: res.objectKey,
          storageProvider: res.provider,
          fileSize: `${Math.round(res.size / 1024)} KB`,
        };
      }
    } catch (err) {
      console.warn("[CloudflareR2] Error processing chat image attachment:", err.message);
    }
  }

  return attachment;
}

/**
 * Health check & diagnostic check for Cloudflare R2
 */
async function checkR2Health() {
  const config = getR2Config();
  const summary = {
    configured: config.isConfigured,
    mode: config.isS3Configured ? "s3_compatible" : (config.isRestConfigured ? "rest_api" : "unconfigured"),
    bucket: config.bucketName,
    publicDomain: config.publicDomain || null,
    endpoint: config.endpoint || null,
    connected: false,
    latencyMs: null,
    error: null,
  };

  if (!config.isConfigured) {
    summary.error = "Cloudflare R2 environment variables are not set in Railway (.env)";
    return summary;
  }

  const start = Date.now();
  try {
    const testKey = `healthcheck/ping-${Date.now()}.txt`;
    const pingBuf = Buffer.from("AdvocateHub R2 HealthCheck OK", "utf8");

    if (config.isS3Configured) {
      await putObjectToR2ViaS3(pingBuf, testKey, "text/plain", config);
    } else {
      await putObjectToR2ViaRest(pingBuf, testKey, "text/plain", config);
    }

    summary.latencyMs = Date.now() - start;
    summary.connected = true;

    // Clean up test object
    deleteObjectFromR2(testKey).catch(() => {});
  } catch (err) {
    summary.connected = false;
    summary.error = err.message;
  }

  return summary;
}

module.exports = {
  getR2Config,
  validateImageBuffer,
  uploadProfilePhoto,
  uploadChatImage,
  processChatAttachmentForR2,
  fetchObjectFromR2,
  deleteObjectFromR2,
  generateR2PresignedUrl,
  checkR2Health,
};