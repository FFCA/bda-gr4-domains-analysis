import { Server } from 'http';
import { Socket } from 'socket.io';
import Db from './db-connection';
import {
    DomainAnalysisEvent,
    getDbFunctions,
    getAllEvents,
} from 'domain-analysis-types';
import { performance } from 'perf_hooks';

/**
 * Socket IO pool.
 */
let io: any;

/**
 * Max. timeout before emitting/duration in which DB changes subscribed on are not emitted to the clients.
 */
const emitTimeout = 2000;

/**
 * Map containing all events to emit as key and the latest performance-value (performance.now())
 * of when having been received from the server as value.
 */
const notificationTsMap = new Map<DomainAnalysisEvent, number>();

/**
 * Map containing all events emitted to the client as key and the latest emit performance-value (performance.now()) as value.
 */
const emitMap = new Map<DomainAnalysisEvent, number>();

/**
 * Map containing the Domain Analysis Event as key and all triggered functions as values.
 */
const eventQueryMap: Map<DomainAnalysisEvent, string[]> = getDbFunctions();

/**
 * Emits all event data to the given socket and subscribes to a disconnection event.
 * @param socket Socket the data is to be emitted to.
 */
const onSocketConnected = async (socket: Socket): Promise<void> => {
    console.log('A client connected');

    await Promise.all(
        [...eventQueryMap.keys()].map(async (k) => {
            await emitEventData(k, socket);
        })
    );

    socket.on('disconnect', () => console.log('A client disconnected'));
};

/**
 * Requests all data of the functions for a given {{ event }} from the server
 * and emits the received values to the given platform (i.e. one socket or all).
 * The values are emitted using the respective triggered function name as
 * event name.
 *
 * @param event Name of the event the functions for a to be triggered.
 * @param emitPlatform Platform the events are to be emitted to (i.e. one socket or all).
 */
const emitEventData = async (
    event: DomainAnalysisEvent,
    emitPlatform: Socket = io
): Promise<void> => {
    await Promise.all(
        eventQueryMap.get(event)!.map(async (fn) => {
            const query = `SELECT * FROM ${fn}()`;
            emitPlatform.emit(fn, (await Db.executeQuery(query)).rows);
        })
    );
};

/**
 * Emits the data for a given event if no new notifications have been received for it within
 * the last milliseconds specified by {{ emitTimeout }}.
 * @param event
 */
const patientlyEmitAfterTimeout = (event: DomainAnalysisEvent): void => {
    const now = performance.now();
    notificationTsMap.set(event, now);

    const patientEmitCore = () => {
        const now = performance.now();
        setTimeout(async () => {
            if (
                !emitMap.get(event) ||
                now - emitMap.get(event)! > emitTimeout
            ) {
                emitMap.set(event, now);
                if (notificationTsMap.get(event)! > now) patientEmitCore();
                else await emitEventData(event);
            }
        }, emitTimeout);
    };

    patientEmitCore();
};

/**
 * Initializes the sockets.
 *
 * @param httpServer Server socket.io is to be run on.
 */
export const initializeSockets = async (httpServer: Server): Promise<void> => {
    io = require('socket.io')(httpServer);
    io.on('connection', await onSocketConnected);
};

/**
 * Initializes the Database event listeners.
 */
export const initializeNotificationListeners = async (): Promise<void> => {
    await Promise.all(
        getAllEvents().map(async (event) => {
            await Db.registerNotificationListener(event, () =>
                patientlyEmitAfterTimeout(event)
            );
        })
    );
};
