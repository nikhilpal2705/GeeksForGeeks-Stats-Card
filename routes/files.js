const express = require("express");
const router = express.Router();
const path = require("path");

// Handle request for favicon
router.get("/favicon.ico", (req, res) => {
    res.redirect(301, "https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_favicon.png");
});

// Serve demo.css
router.get("/demo.css", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/demo.css"));
});

// Handle requests with query parameter (?username=...)
router.get("/", (req, res, next) => {
    if (req.query.username) {
        return next(); // Ensure next middleware is defined to handle this case
    }
    // Serve the HTML file
    res.sendFile(path.join(__dirname, '../pages/demo.html'));
});

module.exports = router;
