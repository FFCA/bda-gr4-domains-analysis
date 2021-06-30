import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Socket } from 'socket.io-client/build/socket';
import { DomainAnalysisChart } from '../model/internal/domain-analysis-chart';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { NoConnectionComponent } from '../components/dialogs/no-connection/no-connection.component';

@Injectable({
    providedIn: 'root',
})
export class StatisticsService {
    charts: DomainAnalysisChart[] = [];

    private socket!: Socket;

    // TODO: Implement/Add documentation

    private mxCountGlobalData!: DomainAnalysisChart;
    private aCountGlobalData!: DomainAnalysisChart;

    /**
     * @param dialog Injected Material dialog service.
     * @param translate Injected translate service.
     */
    constructor(
        private readonly dialog: MatDialog,
        private readonly translate: TranslateService
    ) {
        translate.onLangChange.subscribe(() => {
            this.initCharts();
            if (!this.socket) this.setupSocketConnection();
        });
    }

    get isConnected(): boolean {
        return this.socket?.connected;
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

        this.socket.on('disconnect', () => this.displayConnectionDialog());

        this.displayConnectionDialog();

        // TODO: handle one - n "no data" => add dialog?
    }

    private displayConnectionDialog(): void {
        setTimeout(() => {
            if (!this.isConnected) {
                this.dialog
                    .open(NoConnectionComponent)
                    .afterClosed()
                    .subscribe(() => this.displayConnectionDialog());
            }
        }, 5000);
    }

    private initCharts(): void {
        this.initMxGlobalData();
        this.charts = [this.mxCountGlobalData];
    }

    private initMxGlobalData(): void {
        this.mxCountGlobalData = {
            titleKey: 'dashboard.chart.mxTop10.title',
            data: this.mxCountGlobalData?.data ?? [],
            labels: this.mxCountGlobalData?.labels ?? [],
            hasData: !!this.mxCountGlobalData?.data?.length,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant('dashboard.chart.mxTop10.record'),
                this.translate.instant('dashboard.chart.general.number')
            ),
        };
    }
}
