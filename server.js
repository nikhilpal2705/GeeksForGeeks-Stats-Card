const express = require('express');
const path = require('path');
const routes = require("./routes/api");
const { track } = require("@vercel/analytics/server");

const app = express();

// Middleware to log analytics for each request
app.use((req, res, next) => {
    if (process.env.NODE_ENV === "production") {
        track("pageview", {
            path: req.path,         // URL path, e.g., "/about"
            method: req.method,     // HTTP method, e.g., "GET"
            userAgent: req.headers['user-agent'], // User device info
        });
    }
    next();
});
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use routes from routes/index.js
app.use("/", routes);

// Start the server
const port = process.env.PORT || 2001;
app.listen(port, () => {
    console.log(`Server running on port ${port}, http://localhost:${port}`);
});
