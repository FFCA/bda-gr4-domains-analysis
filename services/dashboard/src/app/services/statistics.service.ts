import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Socket } from 'socket.io-client/build/socket';
import { DomainAnalysisChart } from '../model/internal/domain-analysis-chart';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class StatisticsService {
    private socket!: Socket;

    // TODO: Implement/Add documentation

    private mxCountGlobalData!: DomainAnalysisChart;

    charts: DomainAnalysisChart[] = [];

    /**
     * @param translate Injected translate service.
     */
    constructor(private readonly translate: TranslateService) {
        translate.onLangChange.subscribe(() => {
            this.initCharts();
            if (!this.socket) this.setupSocketConnection();
        });
    }

    private setupSocketConnection(): void {
        this.socket = io(environment.statisticsApi);
        this.socket.on('watch_mx_count_global', (data) => {
            this.mxCountGlobalData.data = [
                { data: data.map((d: any) => d.count) },
            ];
            this.mxCountGlobalData.labels = data.map((d: any) => d.mx_record);
            this.mxCountGlobalData.hasData = data.length;
        });
    }

    private initCharts(): void {
        this.initMxGlobalData();
        this.charts = [this.mxCountGlobalData];
    }

    private initMxGlobalData(): void {
        this.mxCountGlobalData = {
            titleKey: 'dashboard.chart.mxTop10.title',
            data: [],
            labels: [],
            type: 'bar',
            showLabels: false,
            hasData: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant('dashboard.chart.mxTop10.record'),
                this.translate.instant('dashboard.chart.general.number')
            ),
        };
    }
}
