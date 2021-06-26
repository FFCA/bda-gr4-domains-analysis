import { Server } from 'http';

// TODO: Add documentation

export const initializeSockets = (httpServer: Server) => {
    const io = require('socket.io')(httpServer);
    // TODO: Socket type?
    io.on('connection', (socket: any) => console.log('socket connected'));
};
