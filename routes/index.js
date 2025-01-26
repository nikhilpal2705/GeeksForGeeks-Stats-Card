const express = require("express");
const { getCard } = require("../controller/card");
const router = express.Router();

router.get('/', getCard); // Handle requests to "/"
router.get('/:username', getCard); // Handle requests to "/:username"

module.exports = router;
