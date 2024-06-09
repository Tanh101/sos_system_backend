const Joi = require("joi");

const validator = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });

const createDangerAreaSchema = Joi.object({
    requestId: Joi.number().integer().required(),
    message: Joi.string().min(10).max(500).required(),
    radius: Joi.number().required().min(1),
    address: Joi.string().min(6).required(),
});

exports.validatecreateDangerArea = validator(createDangerAreaSchema);
