const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { signup, login } = require('../controller/authController');

const router = express.Router();

// Signup Route
router.post('/signup',signup);
//login Route
router.post('/login',login);


module.exports = router;