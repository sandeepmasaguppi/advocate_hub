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
      "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: blob:; connect-src *; font-src * data:; media-src *; frame-src *;"
    );
    res.removeHeader("X-Frame-Options");
    next();
  });
};
