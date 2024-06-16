const express = require('express');
const router = express.Router();

const conversationController = require('../app/controllers/conversation.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const validationMiddlewares = require('../middlewares/validation.middleware.js');

router.get('/chatbot', authMiddleware.getAccessToken, authMiddleware.checkAuth, conversationController.getChatbotConversation);
router.post('/chatbot', authMiddleware.getAccessToken, authMiddleware.checkAuth, conversationController.createConversationWithChatbot);
router.get('/', authMiddleware.getAccessToken, authMiddleware.checkAuth, conversationController.get);
router.get('/:receiverId', authMiddleware.getAccessToken, authMiddleware.checkAuth, validationMiddlewares.getMessages, conversationController.getMessages);
module.exports = router;
