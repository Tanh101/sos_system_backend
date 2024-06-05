const express = require('express');
const router = express.Router();

const requestController = require('../app/controllers/request.controller');
const voteController = require('../app/controllers/vote.controller');
const commentController = require('../app/controllers/comment.controller');

const validationMiddlewares = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware.getAccessToken, authMiddleware.checkAuth, validationMiddlewares.createRequest, requestController.create);
router.put('/:id', authMiddleware.getAccessToken, authMiddleware.checkAuth, requestController.updateRequestStatus);
router.post('/:id/vote', authMiddleware.getAccessToken, authMiddleware.checkAuth, voteController.vote);
router.get('/me', authMiddleware.getAccessToken, authMiddleware.checkAuth, requestController.getUserRequestByStatus);
router.get('/', authMiddleware.getAccessToken, authMiddleware.checkAuth, requestController.get);
router.get('/:id', authMiddleware.getAccessToken, authMiddleware.checkAuth, requestController.getById);
router.get('/:id/comments', authMiddleware.getAccessToken, authMiddleware.checkAuth, commentController.get);

module.exports = router;
