const express = require('express');
const path = require('path');
const routes = require("./routes/api");

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use routes from routes/index.js
app.use("/", routes);

// Start the server
const port = process.env.PORT || 2001;
app.listen(port, () => {
    console.log(`Server running on port ${port}, http://localhost:${port}`);
});
