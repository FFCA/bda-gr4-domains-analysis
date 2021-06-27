import { Server } from 'http';
import { Socket } from 'socket.io';
import { Notification } from 'pg';

// TODO: Add documentation
// TODO: Continue with db implementation

let io: any;

const emitData = (emitPlatform: Socket = io) => {
    emitPlatform.emit('db-change', "there's something happening...");
};

const onSocketConnected = (socket: Socket) => {
    console.log('A client connected');
    emitData(socket);
    socket.on('disconnect', () => console.log('A client disconnected'));
};

export const initializeSockets = (httpServer: Server) => {
    io = require('socket.io')(httpServer);
    io.on('connection', onSocketConnected);
};

export const handleDbChanges = (notification: Notification) => {
    console.log(notification);
    emitData();
};
