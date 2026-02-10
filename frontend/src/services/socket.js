import { io } from 'socket.io-client';

// URL del backend Socket.IO
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Crea connessione Socket.IO
const socket = io(SOCKET_URL, {
  autoConnect: false, // Non connette subito
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

// SOCKET SERVICE

export const socketService = {

  connect: () => {
    if (!socket.connected) {
      socket.connect();
    }
  },

  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
    }
  },

  onNewAlarm: (callback) => {
    socket.on('nuovoAllarme', callback);
  },

  offNewAlarm: () => {
    socket.off('nuovoAllarme');
  },
};

export default socket;

