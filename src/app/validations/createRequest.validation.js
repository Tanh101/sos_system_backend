const Joi = require("joi");

const validator = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });

const requestSchema = Joi.object({
    requestTypeId: Joi.number().required(),
    content: Joi.string().min(10).required(),
    isEmergency: Joi.number().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    address: Joi.string().min(6).required(),
    media: Joi.array().items(Joi.string()),
});

exports.validateCreateRequest = validator(requestSchema);
