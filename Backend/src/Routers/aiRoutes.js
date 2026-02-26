const express = require("express");
const router = express.Router();
const { askAI } = require("../controllers/AIController");

router.post("/chat", askAI);

module.exports = router;