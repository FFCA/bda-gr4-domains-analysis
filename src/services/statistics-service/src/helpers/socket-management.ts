import { Server } from 'http';
import { Socket } from 'socket.io';
import Db from './db-connection';
import {
    DomainAnalysisEvent,
    getDbFunctions,
    getAllEvents,
} from 'domain-analysis-types';
import { performance } from 'perf_hooks';

// TODO: Add documentation
// TODO: Continue with db implementation

let io: any;

const emitTimeout = 2000;
const notificationTsMap = new Map<DomainAnalysisEvent, number>();
const emitMap = new Map<DomainAnalysisEvent, number>();
const eventQueryMap = getDbFunctions();

const onSocketConnected = async (socket: Socket): Promise<void> => {
    console.log('A client connected');

    await Promise.all(
        [...eventQueryMap.keys()].map(async (k) => {
            await emitEventData(k, socket);
        })
    );

    socket.on('disconnect', () => console.log('A client disconnected'));
};

const emitEventData = async (
    event: DomainAnalysisEvent,
    emitPlatform: Socket = io
): Promise<void> => {
    const query = `SELECT * FROM ${eventQueryMap.get(event)}()`;
    emitPlatform.emit(event, (await Db.executeQuery(query)).rows);
};

const patientlyEmitAfterTimeout = (event: DomainAnalysisEvent) => {
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

export const initializeSockets = async (httpServer: Server): Promise<void> => {
    io = require('socket.io')(httpServer);
    io.on('connection', await onSocketConnected);
};

export const initializeNotificationListeners = async (): Promise<void> => {
    await Promise.all(
        getAllEvents().map(async (event) => {
            await Db.registerNotificationListener(event, () =>
                patientlyEmitAfterTimeout(event)
            );
        })
    );
};
