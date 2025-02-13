const express = require("express");
const path = require("path");
const api = require("./routes/api");
const files = require("./routes/files");
const logger = require("morgan");
const app = express();

// log api requests
app.use(logger("dev"))

// Serve static files (Only works locally; Vercel needs `vercel.json`)
if (process.env.NODE_ENV !== "production") {
    app.use(express.static(path.join(__dirname, "public")));
}

// Use API routes
app.use("/", files);
app.use("/", api);

const port = process.env.PORT || 2001;
app.listen(port, () => {
    console.log(`Server running on port ${port}, http://localhost:${port}`);
});

