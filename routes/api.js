const express = require("express");
const { getCard, notFound } = require("../controllers/controller");
const router = express.Router();


// Handle requests with query parameter (?username=...)
router.get("/", getCard);
// Handle requests with username in path (/:username)
router.get("/:username", getCard);
// Catch-all route for not found
router.all("*", notFound);

module.exports = router;
