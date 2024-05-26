const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/profile', authMiddleware.getAccessToken, authMiddleware.checkAuth, userController.profile);
router.patch('/:id', authMiddleware.getAccessToken, authMiddleware.checkAdmin, userController.updateStatus);
router.get('/', authMiddleware.getAccessToken, authMiddleware.checkAdmin, userController.filterUser);

module.exports = router;
