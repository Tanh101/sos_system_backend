const { validateSignup } = require('../app/validations/signup.validation');
const { validateSignin } = require('../app/validations/signin.validation');
const { validateCreateRequest } = require('../app/validations/createRequest.validation');
const { validatePagination } = require('../app/validations/pagination.validation');

const validationMiddlewares = {
    signup: async (req, res, next) => {
        const { error } = validateSignup(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };
        next();
    },
    signin: async (req, res, next) => {
        const { error } = validateSignin(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };
        next();
    },
    createRequest: async (req, res, next) => {
        const { error } = validateCreateRequest(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };
        next();
    },
    pagination: async (req, res, next) => {
        const { error } = validatePagination(req.query);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };
        next();
    }
}

module.exports = validationMiddlewares;
