import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Socket } from 'socket.io-client/build/socket';

@Injectable({
    providedIn: 'root',
})
export class StatisticsService {
    socket!: Socket;

    // TODO: Implement/Add documentation

    setupSocketConnection() {
        this.socket = io(environment.statisticsApi);
    }
}
