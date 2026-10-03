// setupProxy.js — Express middleware for webpack-dev-server
// Allows iframe embedding, removes frame restrictions, and enables seamless previewing in mobile simulators

module.exports = function (app) {
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, Authorization");
    // Remove headers that prevent embedding in mobile simulator extensions
    res.removeHeader("X-Frame-Options");
    res.removeHeader("Content-Security-Policy");
    next();
  });
};
