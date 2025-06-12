const express = require('express');
const router = express.Router();

const db = require('../models');
const ContactUs = require('../controller/contactusController');

// POST /contact - handle contact form submissions
router.post('/contact',ContactUs);

module.exports = router;