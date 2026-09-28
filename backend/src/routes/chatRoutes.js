const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// REST API Endpoints:
router.post('/messages', chatController.sendMessage);
router.get('/messages', chatController.getHistory);
router.get('/users', chatController.getUsers);

// Authentication Endpoints
router.post('/users/register', chatController.register);
router.post('/users/login', chatController.login);
router.post('/users/forgot-password', chatController.forgotPassword);
router.post('/users/reset-password', chatController.resetPassword);

// Mark messages as read
router.patch('/messages/read', chatController.markAsRead);

// Permanent deletion routes
router.post('/messages/clear', chatController.clearChat);
router.delete('/messages/clear', chatController.clearChat);
router.delete('/users/:id', chatController.deleteUser);

module.exports = router;
