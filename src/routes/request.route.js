const express = require('express');
const router = express.Router();

const requestController = require('../app/controllers/request.controller');
const voteController = require('../app/controllers/vote.controller');

const validationMiddlewares = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware.getAccessToken, authMiddleware.checkAuth, validationMiddlewares.createRequest, requestController.create);
router.post('/:id/vote', authMiddleware.getAccessToken, authMiddleware.checkAuth, voteController.vote);
router.get('/me', authMiddleware.getAccessToken, authMiddleware.checkAuth, requestController.getUserRequestByStatus);
router.get('/', authMiddleware.getAccessToken, authMiddleware.checkAuth, validationMiddlewares.pagination, requestController.get);
router.get('/:id', authMiddleware.getAccessToken, authMiddleware.checkAuth, requestController.getById);

module.exports = router;
