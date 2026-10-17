// setupProxy.js — Express middleware for webpack-dev-server
// Allows iframe embedding, removes frame restrictions, and enables seamless previewing in mobile simulators

module.exports = function (app) {
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, Authorization");
    // Explicitly set permissive Content-Security-Policy so scripts & simulators are never blocked
    res.setHeader(
      "Content-Security-Policy",
      "default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* http://127.0.0.1:* blob: data:; script-src-elem * 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* http://127.0.0.1:* blob: data:; style-src * 'self' 'unsafe-inline'; img-src * 'self' data: blob:; connect-src * 'self' http://localhost:* ws://localhost:* ws://127.0.0.1:* http://127.0.0.1:*; font-src * 'self' data:; media-src * 'self'; frame-src * 'self'; frame-ancestors *;"
    );
    res.removeHeader("X-Frame-Options");
    next();
  });
};
