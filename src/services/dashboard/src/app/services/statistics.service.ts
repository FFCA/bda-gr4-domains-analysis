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
    private tab00Descriptive!: DisplayedTab;
    private tab01Checked!: DisplayedTab;

    private socket!: Socket;

    // TODO: Implement/Add documentation

    private mxCountGlobal!: DomainAnalysisChart;
    private aCountGlobal!: DomainAnalysisChart;
    private mxCheckedCountGlobal!: DomainAnalysisChart;
    private aCheckedCountGlobal!: DomainAnalysisChart;

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

        this.socket.on(DomainAnalysisEvent.DOMAIN, (data) =>
            this.onDomainCountTriggered(data)
        );

        this.socket.on(DomainAnalysisEvent.A_COUNT_GLOBAL, (data) =>
            this.onACountTriggered(data)
        );

        this.socket.on(DomainAnalysisEvent.MX_COUNT_GLOBAL, (data) =>
            this.onMxCountTriggered(data)
        );

        this.socket.on(DomainAnalysisEvent.A_CHECKED_COUNT_GLOBAL, (data) =>
            this.onACheckedCountTriggered(data)
        );

        this.socket.on(DomainAnalysisEvent.MX_CHECKED_COUNT_GLOBAL, (data) =>
            this.onMxCheckedCountTriggered(data)
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
        this.tab00Descriptive = {
            kpis: [],
            charts: [],
            tabKey: 'dashboard.tab.descriptive',
            tabExplanationKey: 'dashboard.tabExplanation.descriptive', // TODO Add explanation
        };

        this.tab01Checked = {
            kpis: [],
            charts: [],
            tabKey: 'dashboard.tab.checked',
            tabExplanationKey: 'dashboard.tab.checked', // TODO Add explanation
        };

        this.displayedTabs = [this.tab00Descriptive, this.tab01Checked];
    }

    private initKpis(): void {
        this.domainCount = { translationKey: 'dashboard.kpi.totalDomains' };
        this.tab00Descriptive.kpis = [this.domainCount];
        // this.tab01Checked.kpis = [];
    }

    private initCharts(): void {
        this.initMxGlobalData();
        this.initAGlobalData();
        this.initMxCheckedGlobalData();
        this.initACheckedGlobalData();
        this.tab00Descriptive.charts = [this.mxCountGlobal, this.aCountGlobal];
        this.tab01Checked.charts = [
            this.mxCheckedCountGlobal,
            this.aCheckedCountGlobal,
        ];
    }

    private onDomainCountTriggered(data: any): void {
        this.domainCount.value = data[0].domain_count;
    }

    private onMxCountTriggered(data: any): void {
        this.mxCountGlobal.data = [{ data: data.map((d: any) => d.count) }];
        this.mxCountGlobal.labels = data.map((d: any) => d.mx_record);
        this.mxCountGlobal.hasData = data.length;
    }

    private onACountTriggered(data: any): void {
        this.aCountGlobal.data = [{ data: data.map((d: any) => d.count) }];
        this.aCountGlobal.labels = data.map((d: any) => d.a_record);
        this.aCountGlobal.hasData = data.length;
    }

    private onMxCheckedCountTriggered(data: any): void {
        this.mxCheckedCountGlobal.data = [
            { data: data.map((d: any) => d.count) },
        ];
        this.mxCheckedCountGlobal.labels = data.map(
            (d: any) => d.mx_record_checked
        );
        this.mxCheckedCountGlobal.hasData = data.length;
    }

    private onACheckedCountTriggered(data: any): void {
        this.aCheckedCountGlobal.data = [
            { data: data.map((d: any) => d.count) },
        ];
        this.aCheckedCountGlobal.labels = data.map(
            (d: any) => d.a_record_checked
        );
        this.aCheckedCountGlobal.hasData = data.length;
    }

    private initMxGlobalData(): void {
        this.mxCountGlobal = {
            titleKey: 'dashboard.chart.mxTop10.title',
            data: this.mxCountGlobal?.data ?? [],
            labels: this.mxCountGlobal?.labels ?? [],
            hasData: !!this.mxCountGlobal?.data?.length,
            size: this.mxCountGlobal?.size,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant('dashboard.chart.mxTop10.record'),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }

    private initAGlobalData(): void {
        this.aCountGlobal = {
            titleKey: 'dashboard.chart.aTop10.title',
            data: this.aCountGlobal?.data ?? [],
            labels: this.aCountGlobal?.labels ?? [],
            hasData: !!this.aCountGlobal?.data?.length,
            size: this.aCountGlobal?.size,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant('dashboard.chart.aTop10.record'),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }

    private initMxCheckedGlobalData(): void {
        this.mxCheckedCountGlobal = {
            titleKey: 'dashboard.chart.mxCheckedTop10.title',
            data: this.mxCheckedCountGlobal?.data ?? [],
            labels: this.mxCheckedCountGlobal?.labels ?? [],
            hasData: !!this.mxCheckedCountGlobal?.data?.length,
            size: this.mxCheckedCountGlobal?.size,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant('dashboard.chart.mxCheckedTop10.record'),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }

    private initACheckedGlobalData(): void {
        this.aCheckedCountGlobal = {
            titleKey: 'dashboard.chart.aCheckedTop10.title',
            data: this.aCheckedCountGlobal?.data ?? [],
            labels: this.aCheckedCountGlobal?.labels ?? [],
            hasData: !!this.aCheckedCountGlobal?.data?.length,
            size: this.aCheckedCountGlobal?.size,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant('dashboard.chart.aCheckedTop10.record'),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }
}
