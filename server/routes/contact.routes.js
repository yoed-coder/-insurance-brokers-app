const express = require("express");
const router = express.Router();
const { sendContactMessage } = require("../controllers/contact.controller.js");

router.post("/contact", sendContactMessage);

module.exports = router;
