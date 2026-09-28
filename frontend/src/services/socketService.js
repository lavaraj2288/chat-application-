import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/api';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('[Socket Client] Connected with ID:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket Client] Disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket Client] Connection error:', error.message);
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const joinUser = (username, userId) => {
  if (socket && socket.connected) {
    socket.emit('user_join', { username, userId });
  }
};

export const sendSocketMessage = (messageData, callback) => {
  if (socket && socket.connected) {
    socket.emit('send_message', messageData, callback);
  }
};

export const emitTypingStart = () => {
  if (socket && socket.connected) {
    socket.emit('typing_start');
  }
};

export const emitTypingStop = () => {
  if (socket && socket.connected) {
    socket.emit('typing_stop');
  }
};

export const emitCreateGroup = (groupData, callback) => {
  if (socket && socket.connected) {
    socket.emit('create_group', groupData, callback);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
