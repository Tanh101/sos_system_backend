const express = require('express');
const router = express.Router();

const requestTypeController = require('../app/controllers/requestType.controller');

const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware.getAccessToken, authMiddleware.checkAuth, requestTypeController.get);

module.exports = router;
