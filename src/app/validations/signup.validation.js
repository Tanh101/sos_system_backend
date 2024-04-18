const Joi = require("joi");

const validator = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });

const signupSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    repeatPassword: Joi.string().min(6).required(),
    name: Joi.string().required(),
    phoneNumber: Joi.string().required().pattern(/^[0-9]+$/).min(10).max(12),
    address: Joi.string().min(6).max(255),
    dob: Joi.date().max("now"),
});

exports.validateSignup = validator(signupSchema);
