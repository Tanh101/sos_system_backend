const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddlewares = require('../middlewares/validation.middleware');

router.patch('/:id', authMiddleware.getAccessToken, authMiddleware.checkAdmin, userController.acceptOrRejectRescuer);


module.exports = router;
