import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Socket } from 'socket.io-client/build/socket';
import { DomainAnalysisChart } from '../model/internal/domain-analysis-chart';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { NoConnectionComponent } from '../components/dialogs/no-connection/no-connection.component';
import { DomainAnalysisKpi } from '../model/internal/domain-analysis-kpi';
import { DomainAnalysisFunctionName } from 'domain-analysis-types';
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
    private groupedMxCount!: DomainAnalysisChart;
    private groupedACount!: DomainAnalysisChart;

    private mxCheckedCountGlobal!: DomainAnalysisChart;
    private aCheckedCountGlobal!: DomainAnalysisChart;

    private domainCount!: DomainAnalysisKpi;
    private percentageOfMxLocalhost!: DomainAnalysisKpi;

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

        this.socket.on('disconnect', () => this.displayConnectionDialog());

        this.displayConnectionDialog();

        // KPIs:

        this.socket.on(DomainAnalysisFunctionName.DOMAIN_COUNT, (data: any) =>
            this.onDomainCountTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.PERCENTAGE_OF_MX_LOCALHOST,
            (data: any) => this.onMxLocalhostPercentageTriggered(data)
        );

        // Charts:

        this.socket.on(
            DomainAnalysisFunctionName.TOP_10_A_GLOBAL,
            (data: any) => this.onACountTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.TOP_10_MX_GLOBAL,
            (data: any) => this.onMxCountTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.TOP_10_A_CHECKED_GLOBAL,
            (data: any) => this.onACheckedCountTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.TOP_10_MX_CHECKED_GLOBAL,
            (data: any) => this.onMxCheckedCountTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.MX_COUNT_GROUPED,
            (data: any) => this.onGroupedMxCountTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.A_COUNT_GROUPED,
            (data: any) => this.onGroupedACountTriggered(data)
        );
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
            tabExplanationKey: 'dashboard.tabExplanation.checked', // TODO Add explanation
        };

        this.displayedTabs = [this.tab00Descriptive, this.tab01Checked];
    }

    private initKpis(): void {
        this.domainCount = { translationKey: 'dashboard.kpi.totalDomains' };
        this.percentageOfMxLocalhost = {
            translationKey: 'dashboard.kpi.percentageOfMxLocalhost',
            isPercentage: true,
        };
        this.tab00Descriptive.kpis = [
            this.domainCount,
            this.percentageOfMxLocalhost,
        ];
        // this.tab01Checked.kpis = [];
    }

    private initCharts(): void {
        this.initMxGlobalData();
        this.initAGlobalData();
        this.initGroupedMxCount();
        this.initGroupedACount();
        this.tab00Descriptive.charts = [
            this.mxCountGlobal,
            this.aCountGlobal,
            this.groupedMxCount,
            this.groupedACount,
        ];

        this.initMxCheckedGlobalData();
        this.initACheckedGlobalData();
        this.tab01Checked.charts = [
            this.mxCheckedCountGlobal,
            this.aCheckedCountGlobal,
        ];
    }

    // KPIs

    private onDomainCountTriggered(data: any): void {
        this.domainCount.value = data[0].domain_count;
    }

    private onMxLocalhostPercentageTriggered(data: any): void {
        this.percentageOfMxLocalhost.value = data[0].percentage;
    }

    // mxCountGlobal

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

    private onMxCountTriggered(data: any): void {
        this.mxCountGlobal.data = [{ data: data.map((d: any) => d.count) }];
        this.mxCountGlobal.labels = data.map((d: any) => d.mx_record);
        this.mxCountGlobal.hasData = data.length;
    }

    // aCountGlobal

    private initAGlobalData(): void {
        const chart = this.aCountGlobal;
        this.aCountGlobal = {
            titleKey: 'dashboard.chart.aTop10.title',
            data: chart?.data ?? [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'pie',
            showLabels: true,
            options: { responsive: true },
        };
    }

    private onACountTriggered(data: any): void {
        this.aCountGlobal.data = [{ data: data.map((d: any) => d.count) }];
        this.aCountGlobal.labels = data.map((d: any) => d.a_record);
        this.aCountGlobal.hasData = data.length;
    }

    // mxCheckedCountGlobal

    private initMxCheckedGlobalData(): void {
        const chart = this.mxCheckedCountGlobal;
        this.mxCheckedCountGlobal = {
            titleKey: 'dashboard.chart.mxCheckedTop10.title',
            data: chart?.data ?? [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant('dashboard.chart.mxCheckedTop10.record'),
                this.translate.instant('dashboard.general.number')
            ),
        };
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

    // aCheckedCountGlobal

    private initACheckedGlobalData(): void {
        const chart = this.aCheckedCountGlobal;
        this.aCheckedCountGlobal = {
            titleKey: 'dashboard.chart.aCheckedTop10.title',
            data: chart?.data ?? [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'pie',
            showLabels: true,
            options: { responsive: true },
        };
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

    // groupedMxCount

    private initGroupedMxCount(): void {
        const chart = this.groupedMxCount;
        this.groupedMxCount = {
            titleKey: 'dashboard.chart.groupedMxCount.title',
            data: chart?.data ?? [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant('dashboard.chart.groupedMxCount.record'),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }

    private onGroupedMxCountTriggered(data: any): void {
        data = data.sort(
            (a: any, b: any) => a.mx_record_count - b.mx_record_count
        );
        this.groupedMxCount.data = [{ data: data.map((d: any) => d.count) }];
        this.groupedMxCount.labels = data.map((d: any) => {
            return `${this.translate.instant('dashboard.dataLabel.records')}: ${
                d.mx_record_count
            }`;
        });
        this.groupedMxCount.hasData = data.length;
    }

    // groupedACount

    private initGroupedACount(): void {
        const chart = this.groupedACount;
        this.groupedACount = {
            titleKey: 'dashboard.chart.groupedACount.title',
            data: chart?.data ?? [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant('dashboard.chart.groupedACount.record'),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }

    private onGroupedACountTriggered(data: any): void {
        data = data.sort(
            (a: any, b: any) => a.a_record_count - b.a_record_count
        );
        this.groupedACount.data = [{ data: data.map((d: any) => d.count) }];
        this.groupedACount.labels = data.map((d: any) => {
            return `${this.translate.instant('dashboard.dataLabel.records')}: ${
                d.a_record_count
            }`;
        });
        this.groupedACount.hasData = data.length;
    }
}
