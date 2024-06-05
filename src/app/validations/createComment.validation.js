const Joi = require("joi");

const validator = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });

const createCommentsSchema = Joi.object({
    requestId: Joi.number().integer().required(),
    content: Joi.string().min(10).max(500).required(),
});

exports.validateCreateComments = validator(createCommentsSchema);
