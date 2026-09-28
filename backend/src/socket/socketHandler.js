const Message = require('../models/Message');
const User = require('../models/User');

// In-memory mapping of socketId -> User profile
const activeSockets = new Map();

/**
 * Socket.io Real-Time Event Handlers
 */
function initSocketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] New client connected: ${socket.id}`);

    // Event: User joins chat (registers socket with username/userId)
    socket.on('user_join', async (userData) => {
      try {
        if (!userData || !userData.username) return;

        const user = await User.findOrCreate(userData.username);
        
        // Save socket mapping
        activeSockets.set(socket.id, user);
        socket.userId = user.id;
        socket.username = user.username;

        console.log(`[Socket.io] User registered: ${user.username} (${socket.id})`);

        // Notify client of successful registration
        socket.emit('login_success', user);

        // Broadcast updated users list to everyone
        const allUsers = await User.getAllUsers();
        io.emit('users_list', allUsers);

        // Broadcast system announcement
        io.emit('user_joined', {
          user,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('[Socket Error] user_join failed:', err);
        socket.emit('socket_error', { message: 'Failed to register user' });
      }
    });

    // Event: Create New Group
    socket.on('create_group', async (groupData, ackCallback) => {
      try {
        const { name, memberIds = [], color = '#00A884' } = groupData;
        const newGroup = await User.createGroup({ name, memberIds, color });
        const allUsers = await User.getAllUsers();
        io.emit('users_list', allUsers);
        io.emit('group_created', newGroup);

        if (typeof ackCallback === 'function') {
          ackCallback({ success: true, data: newGroup });
        }
      } catch (err) {
        console.error('[Socket Error] create_group failed:', err);
        if (typeof ackCallback === 'function') {
          ackCallback({ success: false, error: 'Failed to create group' });
        }
      }
    });

    // Event: Send Message real-time
    socket.on('send_message', async (data, ackCallback) => {
      try {
        const { text, senderId, senderName, receiverId = null } = data;

        if (!text || text.trim() === '') {
          if (typeof ackCallback === 'function') {
            ackCallback({ success: false, error: 'Message text cannot be empty' });
          }
          return;
        }

        // Persist message to SQLite Database
        const savedMessage = await Message.create({
          senderId: senderId || socket.userId,
          senderName: senderName || socket.username || 'Anonymous',
          receiverId,
          text: text.trim(),
          status: 'sent'
        });

        console.log(`[Socket.io] Message from ${savedMessage.sender_name}: "${savedMessage.text}"`);

        // Broadcast to ALL connected socket clients instantly (Deliver without page refresh)
        io.emit('new_message', savedMessage);

        // Acknowledge sender with success status
        if (typeof ackCallback === 'function') {
          ackCallback({ success: true, data: savedMessage });
        }
      } catch (err) {
        console.error('[Socket Error] send_message failed:', err);
        if (typeof ackCallback === 'function') {
          ackCallback({ success: false, error: 'Failed to send message' });
        }
        socket.emit('socket_error', { message: 'Failed to send message' });
      }
    });

    // Event: Typing Indicator Start
    socket.on('typing_start', () => {
      if (socket.username) {
        socket.broadcast.emit('user_typing', {
          userId: socket.userId,
          username: socket.username
        });
      }
    });

    // Event: Typing Indicator Stop
    socket.on('typing_stop', () => {
      if (socket.username) {
        socket.broadcast.emit('user_stopped_typing', {
          userId: socket.userId,
          username: socket.username
        });
      }
    });

    // Event: Mark messages as read
    socket.on('mark_read', async ({ messageIds }) => {
      try {
        if (Array.isArray(messageIds) && messageIds.length > 0) {
          await Message.markAsRead(messageIds);
          io.emit('messages_read', { messageIds });
        }
      } catch (err) {
        console.error('[Socket Error] mark_read failed:', err);
      }
    });

    // Event: Clear chat permanently
    socket.on('clear_chat', async ({ userId1, userId2, targetId }) => {
      try {
        await Message.clearChat({ userId1, userId2, targetId });
        io.emit('chat_cleared', { targetId, userId1, userId2 });
      } catch (err) {
        console.error('[Socket Error] clear_chat failed:', err);
      }
    });

    // Event: Delete contact permanently
    socket.on('delete_contact', async ({ userId }) => {
      try {
        await User.deleteUser(userId);
        const allUsers = await User.getAllUsers();
        io.emit('users_list', allUsers);
        io.emit('contact_deleted', { userId });
      } catch (err) {
        console.error('[Socket Error] delete_contact failed:', err);
      }
    });

    // Event: Disconnect gracefully
    socket.on('disconnect', async () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
      const user = activeSockets.get(socket.id);
      
      if (user) {
        activeSockets.delete(socket.id);

        // Check if user has any other active connections open
        let hasOtherConnections = false;
        for (const [sId, u] of activeSockets.entries()) {
          if (u.id === user.id) {
            hasOtherConnections = true;
            break;
          }
        }

        if (!hasOtherConnections) {
          // Update DB status to offline
          await User.updateStatus(user.id, 'offline');
          
          // Broadcast offline update
          const allUsers = await User.getAllUsers();
          io.emit('users_list', allUsers);
          io.emit('user_left', {
            userId: user.id,
            username: user.username,
            timestamp: new Date().toISOString()
          });
        }
      }
    });
  });
}

module.exports = { initSocketHandler };
