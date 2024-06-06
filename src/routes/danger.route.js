const express = require('express');
const router = express.Router();

const dangerAreaController = require('../app/controllers/dangerArea.controller');
const requestController = require('../app/controllers/request.controller');

const validationMiddlewares = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware.getAccessToken, authMiddleware.checkAuth, validationMiddlewares.createDangerArea, dangerAreaController.create);
router.put('/', authMiddleware.getAccessToken, authMiddleware.checkRescuer, dangerAreaController.updateStatus);
router.get('/request', authMiddleware.getAccessToken, authMiddleware.checkRescuer, requestController.getRequestFromDangerArea);
router.get('/', authMiddleware.getAccessToken, authMiddleware.checkAuth, dangerAreaController.getByStatus);

module.exports = router;
