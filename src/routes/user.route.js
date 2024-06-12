const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddlewares = require('../middlewares/validation.middleware');

router.get('/profile', authMiddleware.getAccessToken, authMiddleware.checkAuth, userController.profile);
router.patch('/:id', authMiddleware.getAccessToken, authMiddleware.checkAdmin, userController.updateStatus);
router.get('/', authMiddleware.getAccessToken, authMiddleware.checkAdmin, userController.filterUser);
router.post('/location', authMiddleware.getAccessToken, authMiddleware.checkAuth, userController.createOrUpdateUserLocation)
router.get('/update', authMiddleware.getAccessToken, authMiddleware.checkAuth, userController.getUpdateUser);
router.put('/update', authMiddleware.getAccessToken, authMiddleware.checkAuth, validationMiddlewares.updateUser, userController.updateUser);
router.put('/avatar', authMiddleware.getAccessToken, authMiddleware.checkAuth, userController.updateAvatar);

module.exports = router;
