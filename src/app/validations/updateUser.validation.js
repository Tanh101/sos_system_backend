const Joi = require("joi");

const validator = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });

const updateUserSchema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required().pattern(/^[0-9]+$/).min(10).max(12),
    address: Joi.string().min(6).max(255),
    dob: Joi.date().max("now"),
    avatar: Joi.string().uri(),
});

exports.validateUpdateUser = validator(updateUserSchema);
