const Joi = require("joi");

const validator = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });

const signinSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
});

exports.validateSignin = validator(signinSchema);
