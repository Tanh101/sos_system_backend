const Joi = require("joi");

const validator = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });

const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1),
    itemPerPage: Joi.number().integer().min(1),
    status: Joi.number().integer(),
    isEmergency: Joi.number().integer()
});

exports.validatePagination = validator(paginationSchema);
