const Joi = require("joi");

const validator = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });

const getMessagesSchema = Joi.object({
    receiverId: Joi.number().integer().required(),
});

exports.validateGetMessages = validator(getMessagesSchema);
