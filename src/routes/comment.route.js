const express = require('express');
const router = express.Router();

const commentController = require('../app/controllers/comment.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const validationMiddlewares = require('../middlewares/validation.middleware.js');

router.get('/', authMiddleware.getAccessToken, authMiddleware.checkAuth, commentController.get);
router.post('/', authMiddleware.getAccessToken, authMiddleware.checkAuth, validationMiddlewares.createComment, commentController.create);

module.exports = router;
