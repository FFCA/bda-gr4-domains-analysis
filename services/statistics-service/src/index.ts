import express from 'express';
import dotenv from 'dotenv';
import Db from './helpers/db-connection';
import http from 'http';
import {
    initializeSockets,
    initializeNotificationListeners,
} from './helpers/socket-management';

/**
 * Loads the dotenv config on initially loading this file.
 */
dotenv.config();

/**
 * Express based http application server.
 */
const httpServer = http.createServer(express());

/**
 * Host the application is to be run on.
 */
const host = process.env.HOST ?? '0.0.0.0';

/**
 * Port the application is to be run on.
 */
const port = process.env.PORT ? +process.env.PORT : 8089;

/**
 * Connects to the database, initializes sockets and notification listeners and, eventually,
 * starts the server at the specified host/port.
 */
Db.connect().then(() => {
    console.log('Successfully connected to DB');
    initializeSockets(httpServer).then(() => {
        console.log('Successfully initialized socket communication logic');
        initializeNotificationListeners().then(() => {
            console.log('Successfully registered DB notifications listeners');
            httpServer.listen(port, host);
            console.log(`Server is running at ${host}:${port}\n`);
        });
    });
});
