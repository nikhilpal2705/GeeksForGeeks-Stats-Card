const express = require("express");
const path = require("path");
const routes = require("./routes/api");
const app = express();


// Serve static files (Only works locally; Vercel needs `vercel.json`)
if (process.env.NODE_ENV !== "production") {
    app.use(express.static(path.join(__dirname, "public")));
}

// Use API routes
app.use("/", routes);

// Start server only when running locally
if (require.main === module) {
    const port = process.env.PORT || 2001;
    app.listen(port, () => {
        console.log(`Server running on port ${port}, http://localhost:${port}`);
    });
}

// Export app for Vercel (Vercel will handle routing)
module.exports = app;
