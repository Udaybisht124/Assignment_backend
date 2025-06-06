const express = require('express');
const router = express.Router();

const db = require('../models');
const Contact = db.Contact;

// POST /contact - handle contact form submissions
router.post('/contact', async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ message: 'All fields are necessary' });
    }
    const contactMessage = await Contact.create({ name, message });
    return res.status(201).json({
      message: 'Your message was received! Thank you for contacting us.',
      data: contactMessage
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: error.errors.map(e => e.message).join(', ')
      });
    }
    return res.status(500).json({
      message: 'Something went wrong. Please try again later.',
      error: error.message
    });
  }
});

module.exports = router;