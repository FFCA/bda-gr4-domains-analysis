import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Socket } from 'socket.io-client/build/socket';
import { DomainAnalysisChart } from '../model/internal/domain-analysis-chart';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { NoConnectionComponent } from '../components/dialogs/no-connection/no-connection.component';
import { DomainAnalysisKpi } from '../model/internal/domain-analysis-kpi';

@Injectable({
    providedIn: 'root',
})
export class StatisticsService {
    charts: DomainAnalysisChart[] = [];
    kpis: DomainAnalysisKpi[] = [];

    private socket!: Socket;

    // TODO: Implement/Add documentation

    private mxCountGlobalData!: DomainAnalysisChart;
    private aCountGlobalData!: DomainAnalysisChart;

    private domainCount!: DomainAnalysisKpi;

    /**
     * @param dialog Injected Material dialog service.
     * @param translate Injected translate service.
     */
    constructor(
        private readonly dialog: MatDialog,
        private readonly translate: TranslateService
    ) {
        this.initKpis();
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
        this.socket.on('watch_mx_count_global', (data) =>
            this.onMxCountTriggered(data)
        );
        this.socket.on('watch_a_count_global', (data) =>
            this.onACountTriggered(data)
        );
        this.socket.on('watch_domain_count', (data) =>
            this.onDomainCountTriggered(data)
        );

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

    private initKpis(): void {
        this.domainCount = { translationKey: 'dashboard.kpi.totalDomains' };
        this.kpis = [this.domainCount];
    }

    private initCharts(): void {
        this.initMxGlobalData();
        this.initAGlobalData();
        this.charts = [this.mxCountGlobalData, this.aCountGlobalData];
    }

    private onDomainCountTriggered(data: any): void {
        this.domainCount.value = data[0].domain_count;
    }

    private onMxCountTriggered(data: any): void {
        this.mxCountGlobalData.data = [{ data: data.map((d: any) => d.count) }];
        this.mxCountGlobalData.labels = data.map((d: any) => d.mx_record);
        this.mxCountGlobalData.hasData = data.length;
    }

    private onACountTriggered(data: any): void {
        this.aCountGlobalData.data = [{ data: data.map((d: any) => d.count) }];
        this.aCountGlobalData.labels = data.map((d: any) => d.a_record);
        this.aCountGlobalData.hasData = data.length;
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
                this.translate.instant('dashboard.general.number')
            ),
        };
    }

    private initAGlobalData(): void {
        this.aCountGlobalData = {
            titleKey: 'dashboard.chart.aTop10.title',
            data: this.aCountGlobalData?.data ?? [],
            labels: this.aCountGlobalData?.labels ?? [],
            hasData: !!this.aCountGlobalData?.data?.length,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant('dashboard.chart.aTop10.record'),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }
}
