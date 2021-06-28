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

    private readonly defaultOptions = {
        responsive: true,
        scales: {
            yAxes: [
                {
                    ticks: { beginAtZero: true, autoSkip: false },
                    scaleLabel: { display: true, labelString: 'Some Y-Label' },
                },
            ],
            xAxes: [
                { scaleLabel: { display: true, labelString: 'Some X-Label' } },
            ],
        },
    };

    mxCountGlobalData: any = {
        titleKey: 'async top 10 MX-records chart',
        data: [],
        labels: [],
        type: 'bar',
        showLabels: false,
        options: this.defaultOptions,
    };

    setupSocketConnection(): void {
        this.socket = io(environment.statisticsApi);
        this.socket.on('watch_mx_count_global', (data) => {
            this.mxCountGlobalData.data = [{ data: data.map((d: any) => d.count) }];
            this.mxCountGlobalData.labels = data.map((d: any) => d.mx_record);
        });
    }
}
