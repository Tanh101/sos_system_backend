const express = require('express');
const router = express.Router();

const authController = require('../app/controllers/auth.controller');
const validationMiddlewares = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', validationMiddlewares.signup, authController.register);
router.post('/login', validationMiddlewares.signin, authController.login);
router.post('/refresh', authMiddleware.getAccessToken, authController.refreshToken);
router.post('/logout', authMiddleware.getAccessToken, authMiddleware.checkAuth, authController.logout);

module.exports = router;
