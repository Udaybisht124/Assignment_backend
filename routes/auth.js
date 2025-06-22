const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { signup, login } = require('../controller/authController');
const passport = require('passport');
const multer = require("multer");
const path = require("path")

const router = express.Router();

// Multer storage and file filter for images only
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload');
    },
    filename: function (req, file, cb) {
        // Use unique filename to avoid collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const imageFileFilter = (req, file, cb) => {
    // Accept only jpeg, jpg, png
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only JPEG and PNG images are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Signup Route with image upload
router.post('/signup', upload.single('image'), signup);
//login Route
router.post('/login',login);

// Google OAuth Route
router.get('/google/auth', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback
// router.get('')
module.exports = router;