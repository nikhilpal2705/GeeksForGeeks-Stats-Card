const express = require("express");
const { getCard, getDemo, notFound } = require("../controller/card");
const router = express.Router();

router.get('/', getCard); // Handle requests to "/"
router.get('/:username', getCard); // Handle requests to "/:username"
router.get('*', getDemo); // Handle requests when no username provided
router.all('*', notFound);

module.exports = router;
