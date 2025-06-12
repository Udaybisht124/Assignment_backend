'use strict';
const Joi = require('joi');

const userValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z ]+$/)
    .required()
    .messages({
      'string.base': 'Name must be a string.',
      'string.empty': 'Name is required.',
      'string.min': 'Name must be at least 3 characters long.',
      'string.max': 'Name cannot exceed 50 characters.',
      'string.pattern.base': 'Name can only contain letters and spaces.',
      'any.required': 'Name is required.',
    }),
  email: Joi.string()
    .trim()
    .lowercase()
    .required()
    .custom((value, helpers) => {
      if (!value.includes('@')) {
        return helpers.error('string.missingAtSymbol');
      }
      return value;
    })
    .email({ minDomainSegments: 2 })
    .messages({
      'string.base': 'Email must be a string.',
      'string.empty': 'Email is required.',
      'string.email': 'Email must be a valid email address (e.g., user@domain.com).',
      'string.missingAtSymbol': 'Email must contain an @ symbol.',
      'any.required': 'Email is required.',
    }),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.base': 'Password must be a string.',
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password cannot exceed 100 characters.',
      'string.pattern.base': 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).',
      'any.required': 'Password is required.',
    }),
});

module.exports = userValidationSchema;