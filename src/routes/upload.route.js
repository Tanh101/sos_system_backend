const express = require('express');
const router = express.Router();

const uploadController = require('../app/controllers/upload.controller');
const uploadMiddleWare = require('../middlewares/uploads3.middleware');

router.post('', uploadMiddleWare.array('files', 5), uploadController.upload);

module.exports = router;
