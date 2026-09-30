import { Server as SocketIOServer } from 'socket.io';

let ioInstance = null;

export const initSocket = (httpServer, allowedOrigins = []) => {
  ioInstance = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
          callback(null, true);
        } else {
          callback(new Error(`CORS blocked for origin: ${origin}`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
    pingTimeout: 60000,
  });

  ioInstance.on('connection', (socket) => {
    const userId = socket.handshake.query?.userId || socket.handshake.auth?.userId;
    if (userId) {
      socket.join(`user_${String(userId)}`);
      console.log(`[Socket.io] Client connected & joined user_${userId} (socket ID: ${socket.id})`);
    }

    socket.on('join_user_room', (data) => {
      const uid = data?.userId || data;
      if (uid) {
        socket.join(`user_${String(uid)}`);
        console.log(`[Socket.io] Explicit join room user_${uid}`);
      }
    });

    socket.on('disconnect', () => {
      // Client disconnected
    });
  });

  return ioInstance;
};

export const getIO = () => ioInstance;

export const broadcastUserBlocked = (userId, blockPayload) => {
  if (ioInstance && userId) {
    const cleanId = String(userId);
    ioInstance.to(`user_${cleanId}`).emit('account_blocked', blockPayload);
    ioInstance.emit(`user_blocked_${cleanId}`, blockPayload);
    console.log(`[Socket.io] Real-time account_blocked broadcast to user_${cleanId}`);
  }
};

export const broadcastUserUpdated = (userId, userPayload) => {
  if (ioInstance && userId) {
    const cleanId = String(userId);
    ioInstance.to(`user_${cleanId}`).emit('user_updated', userPayload);
    ioInstance.emit(`user_updated_${cleanId}`, userPayload);
    console.log(`[Socket.io] Real-time user_updated broadcast to user_${cleanId}`);
  }
};

export default {
  initSocket,
  getIO,
  broadcastUserBlocked,
  broadcastUserUpdated,
};
