const express = require('express');
const router = express.Router();

const seederController = require('../app/controllers/seeder.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/key', authMiddleware.getAccessToken, authMiddleware.checkAdmin, seederController.createOrUpdateKey);
router.get('/key', authMiddleware.getAccessToken, authMiddleware.checkAuth, seederController.getKey);
router.post('/', authMiddleware.getAccessToken, authMiddleware.checkAdmin, seederController.seeder);

module.exports = router;
