const Joi = require("joi");

const validator = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });

const normalRequestSchema = Joi.object({
    requestTypeId: Joi.number().required(),
    content: Joi.string().min(10).max(500).required(),
    isEmergency: Joi.number().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    address: Joi.string().min(6).required(),
    media: Joi.array().items(Joi.string()),
});

const emergecyRequestSchema = Joi.object({
    isEmergency: Joi.number().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    address: Joi.string().min(6).required(),
});

exports.validateCreateNormalRequest = validator(normalRequestSchema);

exports.validateCreateEmergencyRequest = validator(emergecyRequestSchema);
