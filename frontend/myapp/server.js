const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const BUILD_DIR = path.join(__dirname, "build");
const BACKEND_API_URL = process.env.BACKEND_API_URL;
const MAX_PROXY_BODY = 6 * 1024 * 1024;
const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_PROXY_BODY) {
        reject(Object.assign(new Error("Request body too large"), { status: 413 }));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

async function proxyToBackend(request, response) {
  if (!BACKEND_API_URL) {
    response.writeHead(503, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Backend API URL is not configured" }));
    return;
  }

  const headers = {};
  for (const name of ["accept", "authorization", "content-type"]) {
    if (request.headers[name]) headers[name] = request.headers[name];
  }

  try {
    const body = ["GET", "HEAD"].includes(request.method) ? undefined : await readBody(request);
    const target = new URL(request.url, `${BACKEND_API_URL.replace(/\/+$/, "")}/`);
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body,
      signal: AbortSignal.timeout(20000),
    });
    const responseHeaders = {};
    for (const name of ["cache-control", "content-type", "last-modified"]) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders[name] = value;
    }
    response.writeHead(upstream.status, responseHeaders);
    response.end(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    console.error("Backend proxy request failed:", error.message);
    if (!response.headersSent) {
      response.writeHead(error.status || 502, { "Content-Type": "application/json" });
      response.end(JSON.stringify({
        error: error.status === 413 ? "Request body too large" : "Backend API is unavailable",
      }));
    }
  }
}

function serveFile(response, filePath) {
  response.writeHead(200, {
    "Content-Type": MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    "Cache-Control": path.basename(filePath) === "index.html"
      ? "no-cache"
      : "public, max-age=31536000, immutable",
  });
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  if (
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/uploads/")
  ) {
    proxyToBackend(request, response);
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname).replace(/^\/+/, "");
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  const filePath = path.resolve(BUILD_DIR, decodedPath || "index.html");
  if (filePath !== BUILD_DIR && !filePath.startsWith(`${BUILD_DIR}${path.sep}`)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    serveFile(response, filePath);
    return;
  }
  if (/\.[a-z0-9]+$/i.test(path.basename(decodedPath))) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  serveFile(response, path.join(BUILD_DIR, "index.html"));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Advocates Hub frontend listening on port ${PORT}`);
});
