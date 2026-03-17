//routes

const express = require('express');
const UrlController = require("../controllers//useControllers.js");

const router = express.Router();

//routes are below
router.post("/shorten", UrlController.shortenUrl);
router.get("urls", UrlController.getAllUrls);
router.get("/:shortUrl", UrlController.redirectUrl);

module.exports = router;