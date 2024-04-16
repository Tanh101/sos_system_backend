const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/profile', authMiddleware.getAccessToken, authMiddleware.checkAuth, userController.profile);

module.exports = router;
