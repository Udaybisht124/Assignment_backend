'use strict'

const joi = require("joi");


const contactValidationSchema = joi.object().keys({

    name: joi.string().trim().min(4).max(15).pattern(/^[a-zA-Z ]+$/).required()
        .messages({
            'string.base': 'Name must be a string.',
            'string.empty': 'Name is required.',
            'string.min': 'Name must be at least 4 characters long.',
            'string.max': 'Name cannot exceed 20 characters.',
            'string.pattern.base': 'Name can only contain letters and spaces.',
            'any.required': 'Name is required.',
        }),

    message: joi.string().trim().min(10).max(100).required()
        .messages({
            'string.base': 'Message must be a string.',
            'string.empty': 'Message is required.',
            'string.min': 'Message must be at least 10 characters long.',
            'string.max': 'Message cannot exceed 100 characters.',
            'any.required': 'Message is required.',
        }),
});

module.exports = contactValidationSchema