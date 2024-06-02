const express = require('express');
const router = express.Router();

const statisticController = require('../app/controllers/statistic.controller');

const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware.getAccessToken, authMiddleware.checkAdmin, statisticController.getStatistic);

module.exports = router;
