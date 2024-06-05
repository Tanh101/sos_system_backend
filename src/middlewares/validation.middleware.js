const { validateSignup } = require('../app/validations/signup.validation');
const { validateSignin } = require('../app/validations/signin.validation');
const { validateCreateEmergencyRequest,
    validateCreateNormalRequest
} = require('../app/validations/createRequest.validation');
const { validatePagination } = require('../app/validations/pagination.validation');
const { validateGetMessages } = require('../app/validations/getMessages.validation');
const { validateCreateComment } = require('../app/validations/createComment.validation.js');

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
        const { isEmergency } = req.body;

        if (isEmergency === undefined) {
            return res.status(400).json({ message: "isEmergecy filed is required" });
        }

        if (isEmergency) {
            const { error } = validateCreateEmergencyRequest(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            };
        } else {
            const { error } = validateCreateNormalRequest(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            };
        }

        next();
    },

    pagination: async (req, res, next) => {
        const { error } = validatePagination(req.query);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };
        next();
    },
    getMessages: async (req, res, next) => {
        const { error } = validateGetMessages(req.params);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };
        next();
    },
    createComment: async (req, res, next) => {
        const { error } = validateCreateComment(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };
        next();
    }
}

module.exports = validationMiddlewares;
