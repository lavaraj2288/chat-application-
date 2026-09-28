const Message = require('../models/Message');
const User = require('../models/User');

const chatController = {
  // GET /api/messages - Fetch chat history
  getHistory: async (req, res) => {
    try {
      const { limit = 100, offset = 0, receiverId } = req.query;
      const messages = await Message.getHistory({
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        receiverId
      });

      return res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
      });
    } catch (error) {
      console.error('[API Error] getHistory failed:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch chat history'
      });
    }
  },

  // POST /api/messages - Send a new message via REST API
  sendMessage: async (req, res) => {
    try {
      const { senderId, senderName, text, receiverId = null } = req.body;

      if (!senderId || !senderName || !text || text.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'senderId, senderName, and non-empty text are required'
        });
      }

      const newMessage = await Message.create({
        senderId,
        senderName,
        receiverId,
        text: text.trim(),
        status: 'sent'
      });

      const io = req.app.get('io');
      if (io) {
        io.emit('new_message', newMessage);
      }

      return res.status(201).json({
        success: true,
        data: newMessage
      });
    } catch (error) {
      console.error('[API Error] sendMessage failed:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to send message'
      });
    }
  },

  // GET /api/users - Fetch active users list
  getUsers: async (req, res) => {
    try {
      const users = await User.getAllUsers();
      return res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('[API Error] getUsers failed:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch users list'
      });
    }
  },

  // POST /api/users/register - Account registration (Email, Phone, Password)
  register: async (req, res) => {
    try {
      const { username, email, phone, password } = req.body;

      if (!password || password.trim().length < 4) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 4 characters long'
        });
      }

      if (!email && !phone && !username) {
        return res.status(400).json({
          success: false,
          error: 'Please provide an Email or Mobile Number'
        });
      }

      const newUser = await User.register({ username, email, phone, password });

      const io = req.app.get('io');
      if (io) {
        const users = await User.getAllUsers();
        io.emit('users_list', users);
      }

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: newUser
      });
    } catch (error) {
      console.error('[API Error] register failed:', error.message);
      return res.status(400).json({
        success: false,
        error: error.message || 'Registration failed'
      });
    }
  },

  // POST /api/users/login - Authenticate with Mobile Number or Email + Password
  login: async (req, res) => {
    try {
      const { identifier, username, password } = req.body;
      const targetIdentifier = identifier || username;

      if (!targetIdentifier || targetIdentifier.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Email, Mobile Number, or Username is required'
        });
      }

      // If no password provided, perform quick dummy login fallback
      if (!password || password.trim() === '') {
        const user = await User.findOrCreate(targetIdentifier.trim());
        const io = req.app.get('io');
        if (io) {
          const users = await User.getAllUsers();
          io.emit('users_list', users);
        }
        return res.status(200).json({ success: true, data: user });
      }

      const user = await User.login({ identifier: targetIdentifier, password });

      const io = req.app.get('io');
      if (io) {
        const users = await User.getAllUsers();
        io.emit('users_list', users);
      }

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('[API Error] login failed:', error.message);
      return res.status(401).json({
        success: false,
        error: error.message || 'Login failed'
      });
    }
  },

  // POST /api/users/forgot-password - Generate OTP
  forgotPassword: async (req, res) => {
    try {
      const { identifier } = req.body;
      if (!identifier || identifier.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Please enter your registered Email or Mobile Number'
        });
      }

      const result = await User.generateResetOtp(identifier);
      return res.status(200).json({
        success: true,
        message: 'Reset OTP has been generated',
        otp: result.otp // Returned for easy testing
      });
    } catch (error) {
      console.error('[API Error] forgotPassword failed:', error.message);
      return res.status(400).json({
        success: false,
        error: error.message || 'Failed to process forgot password request'
      });
    }
  },

  // POST /api/users/reset-password - Verify OTP and update password
  resetPassword: async (req, res) => {
    try {
      const { identifier, otp, newPassword } = req.body;

      if (!identifier || !otp || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Identifier, OTP code, and new password are required'
        });
      }

      if (newPassword.trim().length < 4) {
        return res.status(400).json({
          success: false,
          error: 'New password must be at least 4 characters long'
        });
      }

      const result = await User.resetPassword({ identifier, otp, newPassword });
      return res.status(200).json(result);
    } catch (error) {
      console.error('[API Error] resetPassword failed:', error.message);
      return res.status(400).json({
        success: false,
        error: error.message || 'Password reset failed'
      });
    }
  },

  // PATCH /api/messages/read - Mark messages as read
  markAsRead: async (req, res) => {
    try {
      const { messageIds } = req.body;
      if (Array.isArray(messageIds) && messageIds.length > 0) {
        await Message.markAsRead(messageIds);

        const io = req.app.get('io');
        if (io) {
          io.emit('messages_read', { messageIds });
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Messages marked as read'
      });
    } catch (error) {
      console.error('[API Error] markAsRead failed:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to mark messages as read'
      });
    }
  },

  // DELETE /api/messages/clear - Permanently delete chat messages from database
  clearChat: async (req, res) => {
    try {
      const { userId1, userId2, targetId } = req.body;
      await Message.clearChat({ userId1, userId2, targetId });

      const io = req.app.get('io');
      if (io) {
        io.emit('chat_cleared', { targetId, userId1, userId2 });
      }

      return res.status(200).json({
        success: true,
        message: 'Chat messages deleted permanently'
      });
    } catch (error) {
      console.error('[API Error] clearChat failed:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to clear chat'
      });
    }
  },

  // DELETE /api/users/:id - Permanently delete user/contact from database
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const success = await User.deleteUser(id);
      if (!success) {
        return res.status(400).json({ success: false, error: 'Cannot delete default group' });
      }

      const io = req.app.get('io');
      if (io) {
        const users = await User.getAllUsers();
        io.emit('users_list', users);
        io.emit('contact_deleted', { userId: id });
      }

      return res.status(200).json({
        success: true,
        message: 'Contact and messages permanently deleted'
      });
    } catch (error) {
      console.error('[API Error] deleteUser failed:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete contact'
      });
    }
  }
};

module.exports = chatController;
