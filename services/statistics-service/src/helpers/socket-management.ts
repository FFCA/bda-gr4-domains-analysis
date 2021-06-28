import { Server } from 'http';
import { Socket } from 'socket.io';
import Db from './db-connection';
import { DomainAnalysisEvent } from '../model/domain-analysis-event';
import { performance } from 'perf_hooks';

// TODO: Add documentation
// TODO: Continue with db implementation

let io: any;

const emitTimeout = 2000;
const notificationTsMap = new Map<DomainAnalysisEvent, number>();
const emitMap = new Map<DomainAnalysisEvent, number>();

const onSocketConnected = async (socket: Socket): Promise<void> => {
    console.log('A client connected');
    await sendMxRecordCountData(socket);
    socket.on('disconnect', () => console.log('A client disconnected'));
};

const onARecordCountChanged = (): void => {
    console.log("a-record changes...");
};

const sendMxRecordCountData = async (
    emitPlatform: Socket = io
): Promise<void> => {
    const query = `SELECT * 
                    FROM mx_record_count_global
                    ORDER BY count DESC
                    LIMIT 10`;
    emitPlatform.emit(
        DomainAnalysisEvent.MX_COUNT_GLOBAL,
        (await Db.executeQuery(query)).rows
    );
};

const patientlyEmitAfterTimeout = (
    event: DomainAnalysisEvent,
    emitFn: () => void
) => {
    const now = performance.now();
    notificationTsMap.set(event, now);

    const patientEmitCore = () => {
        const now = performance.now();
        setTimeout(() => {
            if (
                !emitMap.get(event) ||
                now - emitMap.get(event)! > emitTimeout
            ) {
                emitMap.set(event, now);
                if (notificationTsMap.get(event)! > now) patientEmitCore();
                else emitFn();
            }
        }, emitTimeout);
    };

    patientEmitCore();
};

export const initializeSockets = (httpServer: Server) => {
    io = require('socket.io')(httpServer);
    io.on('connection', onSocketConnected);
};

export const initializeNotificationListeners = async (): Promise<void> => {
    await Db.registerNotificationListener(
        DomainAnalysisEvent.A_COUNT_GLOBAL,
        () => onARecordCountChanged()
    );

    await Db.registerNotificationListener(
        DomainAnalysisEvent.MX_COUNT_GLOBAL,
        // TODO: Batch insert and notification payload?
        () => {
            patientlyEmitAfterTimeout(DomainAnalysisEvent.MX_COUNT_GLOBAL, () =>
                sendMxRecordCountData()
            );
        }
    );
};
