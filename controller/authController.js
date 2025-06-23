'use strict';
const { User } = require('../models');
const userValidationSchema = require('../validator/userValidator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Joi = require('joi');
const UserService = require("../services/userServices");
const session = require("express-session");
// Safeguard for User model
if (!User) {
  console.error('User model is not defined. Check models/index.js.');
  throw new Error('User model is not defined.');
}

// app.use(session({
//   secret:'secretkeyhere',
//   resave:false,//check the we we don,t modify the sessions later
//   saveUninitialized:false,
//   cookie:{maxAge: 1000 * 60 * 60}
// }))  




const signup = async (req, res) => {
  try {
    // Normalize email
    if (req.body.email) {
      req.body.email = req.body.email.trim().toLowerCase();
    }

    // Validate with Joi
    const { error } = await userValidationSchema.validateAsync(req.body, { abortEarly: false });
    if (error) {
      console.log('Raw Joi errors:', error.details); // Debug raw errors
      const errors = {};
      error.details.forEach(detail => {
        const field = detail.path[0];
        // Use the last error for each field to avoid duplicates
        errors[field] = detail.message;
      });

      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    const { name, email, password } = req.body;
    console.log(name,email,password)

    // Check if email exists
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'This email is already registered.' });
    }

    // Handle image upload
    let image = null;
    if (req.file) {
      image = req.file.filename;
    }

    // Create user with image
    const user = await UserService.createUser(name, email, password);

    

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });


    // Generate JWT
    //    const token = UserService.generateToken(user);
    // res.status(201).json({
    //   message: 'User registered successfully',
    //   user: {
    //     id: user.id,
    //     name: user.name,
    //     email: user.email,
    //     createdAt: user.createdAt,
    //   },
    //   token,
    // });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'An error occurred while registering the user.',
    });
  }
};

const login = async (req, res) => {
  try {
    // Define login schema
    const loginValidationSchema = Joi.object({
      email: userValidationSchema.extract('email'),
      password: userValidationSchema.extract('password'),
    });

    // Normalize email
    if (req.body.email) {
      req.body.email = req.body.email.trim().toLowerCase();
    }

    // Validate with Joi
    const { error } = await loginValidationSchema.validateAsync(req.body, { abortEarly: false });
    if (error) {
      console.log('Raw Joi errors:', error.details); // Debug raw errors
      const errors = {};
      error.details.forEach(detail => {
        const field = detail.path[0];
        errors[field] = detail.message;
      });
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: { email: { [Op.iLike]: email } },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'Invalid Credentials' });
    }

console.log(user,password)

    // Verify password
   const passwordVerified = UserService.validateUserPassword(user,password);
if(passwordVerified){
    // Generate JWT
   const token = UserService.generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      // token,
    });}
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'An error occurred while logging in.',
    });
  }
};

module.exports = { signup, login };