import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL;

let socket = null;

export const initSocket = (token) => {
  if (!socket) {
    try {
      socket = io(SOCKET_URL, {
        auth: {
          token: token,
        },
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });

      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      socket.on('reconnect', () => {
        console.log('Socket reconnected');
      });
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  } else {
    socket.auth.token = token;
  }

  return socket;
};

export const getSocket = () => socket;

export const connectSocket = (token) => {
  if (socket) {
    if (token) {
      socket.auth.token = token;
    }
    if (!socket.connected) {
      socket.connect();
    }
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null; // Clear the reference
  }
};
