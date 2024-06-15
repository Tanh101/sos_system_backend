const { validateSignup } = require('../app/validations/signup.validation');
const { validateSignin } = require('../app/validations/signin.validation');
const { validateCreateEmergencyRequest,
    validateCreateNormalRequest,
    validateUpdateRequest
} = require('../app/validations/createRequest.validation');
const { validatePagination } = require('../app/validations/pagination.validation');
const { validateGetMessages } = require('../app/validations/getMessages.validation');
const { validateCreateComments } = require('../app/validations/createComment.validation.js');
const { validatecreateDangerArea } = require('../app/validations/createDangerArea.validation.js');
const { updateRequest } = require('../services/requestService/request.service.js');
const { validateUpdateUser } = require('../app/validations/updateUser.validation.js');

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

    updateRequest: async (req, res, next) => {
        const { error } = validateUpdateRequest(req.body);
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
    },
    getMessages: async (req, res, next) => {
        const { error } = validateGetMessages(req.params);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };
        next();
    },
    createComment: async (req, res, next) => {
        const { error } = validateCreateComments(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };
        next();
    },
    createDangerArea: async (req, res, next) => {
        const { error } = validatecreateDangerArea(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };
        next();
    },
    updateUser: async (req, res, next) => {
        const { error } = validateUpdateUser(req.body);
        if (error) {
            console.log(error);
            return res.status(400).json({ message: error.details[0].message });
        };
        next();
    }
}

module.exports = validationMiddlewares;
