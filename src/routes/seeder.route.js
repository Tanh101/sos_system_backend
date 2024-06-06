const express = require('express');
const router = express.Router();

const seederController = require('../app/controllers/seeder.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware.getAccessToken, authMiddleware.checkAdmin, seederController.seeder);

module.exports = router;
