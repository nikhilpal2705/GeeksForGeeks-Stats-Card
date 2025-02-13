require("dotenv").config();
const express = require("express");
const path = require("path");
const api = require("./routes/api");
const files = require("./routes/files");
const morgan = require("morgan");
const app = express();

// log api requests
if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
} else if (process.env.NODE_ENV == "stage") {
    app.use(morgan("tiny"));
}

// Use API routes
app.use("/", files);
app.use("/", api);

const port = process.env.PORT || 2001;
app.listen(port, () => {
    console.log(`Server running on port ${port}, http://localhost:${port}`);
});

