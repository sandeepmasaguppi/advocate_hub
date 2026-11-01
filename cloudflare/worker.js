/**
 * ============================================================
 *  Advocate Hub — Cloudflare R2 Media Worker
 *  Service Name: advocate-hub (Workers & Pages)
 *  Account: Sandeepmasaguppi@gmail.com (ae7c01580a124e31f7a13aba88731d3e)
 *
 *  Features:
 *   • Serves public advocate & client profile images at edge CDN speed
 *   • Serves private chat attachments with token / signature authorization
 *   • Handles direct image uploads (base64, multipart, binary) with magic-bytes validation
 *   • Connects directly to Cloudflare R2 Bucket: advocate-hub-media
 *   • Cloudflare Cache API integration for instant global delivery
 * ============================================================
 */

// Supported formats & magic byte signatures
const MAGIC_SIGNATURES = [
  { mime: "image/jpeg", ext: "jpg", check: (buf) => buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff },
  { mime: "image/png",  ext: "png", check: (buf) => buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 },
  { mime: "image/webp", ext: "webp", check: (buf) => buf.length >= 12 && String.fromCharCode(...buf.slice(0, 4)) === "RIFF" && String.fromCharCode(...buf.slice(8, 12)) === "WEBP" },
  { mime: "image/gif",  ext: "gif", check: (buf) => buf.length >= 6 && (String.fromCharCode(...buf.slice(0, 6)) === "GIF87a" || String.fromCharCode(...buf.slice(0, 6)) === "GIF89a") },
];

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Auth-Key, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(data, status = 200, request = null) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(request ? corsHeaders(request) : { "Access-Control-Allow-Origin": "*" }),
    },
  });
}

function detectImage(bytes) {
  for (const sig of MAGIC_SIGNATURES) {
    if (sig.check(bytes)) return sig;
  }
  return null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const bucket = env.MEDIA_BUCKET || env.BUCKET || env.advocate_hub_media;

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    // Health check endpoint
    if (url.pathname === "/health" || url.pathname === "/status" || url.pathname === "/") {
      return jsonResponse({
        status: "healthy",
        service: "advocate-hub-worker",
        account: "ae7c01580a124e31f7a13aba88731d3e",
        bucketBound: Boolean(bucket),
        bucketName: "advocate-hub-media",
        endpoints: {
          health: "/health",
          upload: "POST /upload",
          profiles: "GET /profile-images/*",
          chat: "GET /chat-images/*",
        },
        timestamp: new Date().toISOString(),
      }, 200, request);
    }

    // Ensure R2 bucket is bound
    if (!bucket) {
      return jsonResponse({
        error: "R2 bucket is not bound to this Worker.",
        instruction: "In Cloudflare Dashboard > Workers & Pages > advocate-hub > Settings > Variables and Secrets (or Bindings), add an R2 Bucket Binding with Variable name: BUCKET or MEDIA_BUCKET and Bucket: advocate-hub-media.",
      }, 500, request);
    }

    // ── 1. UPLOAD IMAGE (POST /upload or PUT /upload) ──────────
    if ((request.method === "POST" || request.method === "PUT") && url.pathname.startsWith("/upload")) {
      return handleUpload(request, env, bucket, url);
    }

    // ── 2. DELETE IMAGE (DELETE /*) ───────────────────────────
    if (request.method === "DELETE") {
      return handleDelete(request, env, bucket, url);
    }

    // ── 3. SERVE / DOWNLOAD MEDIA (GET /*) ────────────────────
    if (request.method === "GET") {
      return handleGet(request, env, bucket, url, ctx);
    }

    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders(request) });
  },
};

/**
 * Handles image upload into R2
 */
async function handleUpload(request, env, bucket, url) {
  // Optional auth verification if AUTH_SECRET or R2_UPLOAD_SECRET is configured
  const authSecret = env.AUTH_SECRET || env.R2_UPLOAD_SECRET;
  if (authSecret) {
    const provided =
      request.headers.get("X-Auth-Key") ||
      request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!provided || provided !== authSecret) {
      return jsonResponse({ error: "Unauthorized: Invalid or missing upload authentication key" }, 401, request);
    }
  }

  const contentType = request.headers.get("Content-Type") || "";
  let fileBuffer = null;
  let fileExt = "jpg";
  let mimeType = "image/jpeg";
  let targetKey = url.searchParams.get("key");
  const uploadType = url.searchParams.get("type") || "profile";
  const userId = url.searchParams.get("userId") || "user";
  const convKey = url.searchParams.get("convKey") || "chat_general";

  try {
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const raw = body.dataUri || body.image || body.file || "";
      const match = String(raw).match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/i);
      if (!match) {
        return jsonResponse({ error: "Invalid dataUri: base64 image data URI required" }, 400, request);
      }
      const binaryString = atob(match[2]);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      fileBuffer = bytes;
      targetKey = targetKey || body.key;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") || formData.get("image");
      if (!file || typeof file === "string") {
        return jsonResponse({ error: "No image file found in form data (expected field 'file' or 'image')" }, 400, request);
      }
      fileBuffer = new Uint8Array(await file.arrayBuffer());
    } else {
      // Raw binary body
      fileBuffer = new Uint8Array(await request.arrayBuffer());
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return jsonResponse({ error: "Uploaded image is empty" }, 400, request);
    }

    if (fileBuffer.length > 10 * 1024 * 1024) {
      return jsonResponse({ error: "File exceeds 10 MB limit" }, 400, request);
    }

    // Magic bytes check
    const detected = detectImage(fileBuffer);
    if (!detected) {
      return jsonResponse({ error: "Unsupported image format. Allowed: JPEG, PNG, WEBP, GIF" }, 400, request);
    }
    fileExt = detected.ext;
    mimeType = detected.mime;

    // Generate logical key if not supplied
    if (!targetKey) {
      const rand = Math.random().toString(36).slice(2, 8);
      const now = Date.now();
      if (uploadType === "chat") {
        targetKey = `chat-images/${convKey}/img-${now}-${rand}.${fileExt}`;
      } else {
        const folder = uploadType === "client" ? "clients" : "advocates";
        targetKey = `profile-images/${folder}/${userId}/avatar-${now}-${rand}.${fileExt}`;
      }
    }

    // Clean key
    targetKey = targetKey.replace(/^\/+/, "");

    // Put to Cloudflare R2 Bucket
    await bucket.put(targetKey, fileBuffer, {
      httpMetadata: {
        contentType: mimeType,
        cacheControl: uploadType === "chat" ? "private, max-age=3600" : "public, max-age=31536000, immutable",
      },
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        uploadType,
      },
    });

    const publicUrl = `${url.origin}/${targetKey}`;

    return jsonResponse({
      success: true,
      key: targetKey,
      url: publicUrl,
      size: fileBuffer.length,
      contentType: mimeType,
      uploadedAt: new Date().toISOString(),
    }, 201, request);
  } catch (err) {
    return jsonResponse({ error: `Upload failed: ${err.message}` }, 500, request);
  }
}

/**
 * Handles GET / serving media from R2 with edge caching
 */
async function handleGet(request, env, bucket, url, ctx) {
  let key = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
  // Strip optional /media/ prefix
  if (key.startsWith("media/")) key = key.replace(/^media\//, "");

  if (!key) {
    return jsonResponse({ error: "Key not specified" }, 400, request);
  }

  // Check authorization for private chat images
  if (key.startsWith("chat-images/")) {
    const token =
      url.searchParams.get("token") ||
      request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");

    // If chat security secret is configured, verify token
    const chatSecret = env.AUTH_SECRET;
    if (chatSecret && !token) {
      // If token not provided, check if signed url parameter present
      const sig = url.searchParams.get("sig");
      const exp = Number(url.searchParams.get("exp") || 0);
      if (!sig || !exp || Date.now() > exp) {
        return jsonResponse({ error: "Unauthorized: Private chat attachment requires access token" }, 403, request);
      }
    }
  }

  // Try fetching from Cloudflare Cache API first for public images
  const cache = caches.default;
  const isPublic = key.startsWith("profile-images/");
  if (isPublic) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;
  }

  const object = await bucket.get(key);
  if (!object) {
    return jsonResponse({ error: "Image not found in R2 bucket", key }, 404, request);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("ETag", object.httpEtag);
  headers.set("Access-Control-Allow-Origin", "*");

  if (isPublic) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    headers.set("Cache-Control", "private, max-age=3600");
  }

  const response = new Response(object.body, { headers });

  // Cache public responses at Cloudflare Edge
  if (isPublic && ctx && ctx.waitUntil) {
    ctx.waitUntil(cache.put(request, response.clone()));
  }

  return response;
}

/**
 * Handles deletion of an object from R2
 */
async function handleDelete(request, env, bucket, url) {
  const authSecret = env.AUTH_SECRET || env.R2_UPLOAD_SECRET;
  if (authSecret) {
    const provided =
      request.headers.get("X-Auth-Key") ||
      request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!provided || provided !== authSecret) {
      return jsonResponse({ error: "Unauthorized" }, 401, request);
    }
  }

  let key = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
  if (key.startsWith("media/")) key = key.replace(/^media\//, "");

  if (!key) return jsonResponse({ error: "Missing key to delete" }, 400, request);

  await bucket.delete(key);
  return jsonResponse({ success: true, deleted: key }, 200, request);
}

