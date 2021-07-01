import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Socket } from 'socket.io-client/build/socket';
import { DomainAnalysisChart } from '../model/internal/domain-analysis-chart';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { NoConnectionComponent } from '../components/dialogs/no-connection/no-connection.component';
import { DomainAnalysisKpi } from '../model/internal/domain-analysis-kpi';
import { DomainAnalysisEvent } from 'domain-analysis-types';
import { DisplayedTab } from '../model/internal/displayed-tab';

@Injectable({
    providedIn: 'root',
})
export class StatisticsService {
    displayedTabs: DisplayedTab[] = [];
    private tab0Descriptive!: DisplayedTab;

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
        this.initTabs();
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

        this.socket.on(DomainAnalysisEvent.DOMAIN_COUNT, (data) =>
            this.onDomainCountTriggered(data)
        );

        this.socket.on(DomainAnalysisEvent.A_COUNT_GLOBAL, (data) =>
            this.onACountTriggered(data)
        );

        this.socket.on(DomainAnalysisEvent.MX_COUNT_GLOBAL, (data) =>
            this.onMxCountTriggered(data)
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

    private initTabs(): void {
        this.tab0Descriptive = {
            kpis: [],
            charts: [],
            tabKey: 'dashboard.tab.descriptive',
            tabExplanationKey: 'dashboard.tabExplanation.descriptive', // TODO Add explanation
        };

        // TODO: Rm duplication
        this.displayedTabs = [
            this.tab0Descriptive,
            this.tab0Descriptive,
            this.tab0Descriptive,
        ];
    }

    private initKpis(): void {
        this.domainCount = { translationKey: 'dashboard.kpi.totalDomains' };
        this.tab0Descriptive.kpis = [this.domainCount];
    }

    private initCharts(): void {
        this.initMxGlobalData();
        this.initAGlobalData();
        this.tab0Descriptive.charts = [
            this.mxCountGlobalData,
            this.aCountGlobalData,
        ];
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
            size: this.aCountGlobalData?.size,
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
            size: this.aCountGlobalData?.size,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant('dashboard.chart.aTop10.record'),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }
}
