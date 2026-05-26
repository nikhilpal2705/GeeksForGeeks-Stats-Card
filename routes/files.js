const express = require("express");
const router = express.Router();
const path = require("path");

// Handle request for favicon
router.get("/favicon.ico", (req, res) => {
    res.redirect(301, "https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_favicon.png");
});

// Handle requests with query parameter (?username=...)
router.get("/", (req, res, next) => {
    if (req.query.username) {
        return next(); // Ensure next middleware is defined to handle this case
    }
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    return res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;
