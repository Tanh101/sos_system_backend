const Joi = require("joi");

const validator = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });

const createDangerAreaSchema = Joi.object({
    requestId: Joi.number().integer().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    message: Joi.string().min(10).max(500).required(),
    radius: Joi.number().integer().required(),
});

exports.validatecreateDangerArea = validator(createDangerAreaSchema);
