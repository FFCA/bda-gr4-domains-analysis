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

/**
 * Module for managing asynchronously passed statistic data.
 * Please note that due to the very similar pattern for event subscriptions and being trivial code,
 * event subscriptions are only described generically in this module. Everything else and everything that is public is, of course,
 * documented using TypeScript documentation at the attribute/method.
 */
@Injectable({
    providedIn: 'root',
})
export class StatisticsService {
    /**
     * Tabs to be displayed.
     */
    displayedTabs: DisplayedTab[] = [];

    // Objects for each tab to be displayed:
    private tab00Descriptive!: DisplayedTab;
    private tab01Checked!: DisplayedTab;
    private tab02Redirect!: DisplayedTab;
    private tab03MxGeo!: DisplayedTab;
    private tab04ipv6Soa!: DisplayedTab;

    // Objects for each chart to be displayed:
    private mxCountGlobal!: DomainAnalysisChart;
    private aCountGlobal!: DomainAnalysisChart;
    private groupedMxCount!: DomainAnalysisChart;
    private groupedACount!: DomainAnalysisChart;
    private mxCheckedCountGlobal!: DomainAnalysisChart;
    private aCheckedCountGlobal!: DomainAnalysisChart;
    private domainAccessStatusCodes!: DomainAnalysisChart;
    private topTenRedirectedTo!: DomainAnalysisChart;
    private topTenMxAsn!: DomainAnalysisChart;
    private topTenMxCities!: DomainAnalysisChart;
    private topTenMxCountries!: DomainAnalysisChart;
    private soaNameserversCountWhereNoErr!: DomainAnalysisChart;
    private topTenSoaAsn!: DomainAnalysisChart;
    private topTenSoaCities!: DomainAnalysisChart;
    private topTenSoaCountries!: DomainAnalysisChart;

    // Objects for each KPI to be displayed
    private domainCount!: DomainAnalysisKpi;
    private percentageOfMxLocalhost!: DomainAnalysisKpi;
    private percentageOfRedirections!: DomainAnalysisKpi;
    private percentageOfRedirections200!: DomainAnalysisKpi;
    private percentageOfMxOutsideOfGermany!: DomainAnalysisKpi;
    private percentageOfIpV6!: DomainAnalysisKpi;
    private avgSoaMinimum!: DomainAnalysisKpi;
    private avgSoaRefresh!: DomainAnalysisKpi;
    private percentageOfSoaOutsideOfGermany!: DomainAnalysisKpi;

    /**
     * Socket for asynchronous communication.
     * @private
     */
    private socket!: Socket;

    /**
     * Initializes tabs and KPIs and subscribes to i18n changes in which case the
     * charts are (re-)initialized (necessary in order to localize labels etc.) and,
     * if not yet initialized, {{ socket }} is initialized.
     *
     * @param dialog Injected Material dialog service.
     * @param translate Injected translation service.
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

    /**
     * True if the current socket exists and is connected, false if not.
     */
    get isConnected(): boolean {
        return this.socket?.connected;
    }

    /**
     * Sets up a socket connection, i.e. declares all functions to be executed in case of receiving a notification.
     * Furthermore, it is checked whether 5s after calling this function the service is connected and if not,
     * an information dialog is shown.
     * @private
     */
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

        this.socket.on(
            DomainAnalysisFunctionName.PERCENTAGE_OF_REDIRECTIONS,
            (data: any) => this.onPercentageOfRedirectionsTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.PERCENTAGE_OF_REDIRECTIONS_CODE_200,
            (data: any) => this.onPercentageOfRedirections200Triggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.PERCENTAGE_MX_PROVIDERS_OUTSIDE_OF_GER,
            (data: any) => this.onPercentageOfMxOutsideOfGermanyTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.PERCENTAGE_HAS_IP_V6,
            (data: any) => this.onPercentageOfIpV6Triggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.AVG_SOA_MINIMUM,
            (data: any) => this.onAvgSoaMinimumTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.AVG_SOA_REFRESH,
            (data: any) => this.onAvgSoaRefreshTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.SOA_OUTSIDE_GER,
            (data: any) => this.onPercentageSoaOutsideOfGermanyTriggered(data)
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

        this.socket.on(
            DomainAnalysisFunctionName.DOMAIN_ACCESS_STATUS_CODES,
            (data: any) => this.onDomainAccessStatusCodesTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.TOP_10_REDIRECTED_TO,
            (data: any) => this.onTopTenRedirectedToTriggered(data)
        );

        this.socket.on(DomainAnalysisFunctionName.TOP_10_MX_ASN, (data: any) =>
            this.onTopTenMxAsnTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.TOP_10_MX_CITIES,
            (data: any) => this.onTopTenMxCitiesTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.TOP_10_MX_COUNTRIES,
            (data: any) => this.onTopTenMxCountriesTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.SOA_NAMESERVERS_COUNT_WHERE_NO_ERR,
            (data: any) => this.onSoaNameserversCountWhereNoErrTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.SOA_TOP_TEN_ASN,
            (data: any) => this.onTopTenSoaAsnTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.TOP_10_MX_CITIES,
            (data: any) => this.onTopTenSoaCitiesTriggered(data)
        );

        this.socket.on(
            DomainAnalysisFunctionName.TOP_10_MX_COUNTRIES,
            (data: any) => this.onTopTenSoaCountriesTriggered(data)
        );
    }

    /**
     * Opens a dialog informing about not being connected to a client.
     * After closure, this dialog is re-opened after 5s if no connection could be established yet.
     *
     * @private
     */
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

    /**
     * Initializes the tabs to be displayed.
     * @private
     */
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
            tabExplanationKey: 'dashboard.tabExplanation.checked',
        };

        this.tab02Redirect = {
            kpis: [],
            charts: [],
            tabKey: 'dashboard.tab.redirect',
            tabExplanationKey: 'dashboard.tabExplanation.redirect',
        };

        this.tab03MxGeo = {
            kpis: [],
            charts: [],
            tabKey: 'dashboard.tab.mxGeo',
            tabExplanationKey: 'dashboard.tabExplanation.mxGeo',
        };

        this.tab04ipv6Soa = {
            kpis: [],
            charts: [],
            tabKey: 'dashboard.tab.ipv6soa',
            tabExplanationKey: 'dashboard.tabExplanation.ipv6soa',
        };

        this.displayedTabs = [
            this.tab00Descriptive,
            this.tab01Checked,
            this.tab02Redirect,
            this.tab03MxGeo,
            this.tab04ipv6Soa,
        ];
    }

    /**
     * Initializes the KPIs to be displayed and pushes them to their respective tab object.
     * @private
     */
    private initKpis(): void {
        this.domainCount = { translationKey: 'dashboard.kpi.totalDomains' };
        this.percentageOfMxLocalhost = {
            translationKey: 'dashboard.kpi.percentageOfMxLocalhost',
            isPercentage: true,
        };

        this.percentageOfRedirections = {
            translationKey: 'dashboard.kpi.percentageOfRedirections',
            isPercentage: true,
        };

        this.percentageOfRedirections200 = {
            translationKey: 'dashboard.kpi.percentageOfRedirections200',
            isPercentage: true,
        };

        this.percentageOfMxOutsideOfGermany = {
            translationKey: 'dashboard.kpi.percentageOfMxOutsideOfGermany',
            isPercentage: true,
        };

        this.percentageOfIpV6 = {
            translationKey: 'dashboard.kpi.percentageOfIpV6ExcludingErrors',
            isPercentage: true,
        };

        this.avgSoaMinimum = {
            translationKey: 'dashboard.kpi.soaAvgMinimumInS',
        };

        this.avgSoaRefresh = {
            translationKey: 'dashboard.kpi.soaAvgRefreshInS',
        };

        this.percentageOfSoaOutsideOfGermany = {
            translationKey: 'dashboard.kpi.percentageOfSoaOutsideOfGermany',
            isPercentage: true,
        };

        this.tab00Descriptive.kpis = [
            this.domainCount,
            this.percentageOfMxLocalhost,
        ];

        // this.tab01Checked.kpis = [];

        this.tab02Redirect.kpis = [
            this.percentageOfRedirections,
            this.percentageOfRedirections200,
        ];

        this.tab03MxGeo.kpis = [this.percentageOfMxOutsideOfGermany];

        this.tab04ipv6Soa.kpis = [
            this.percentageOfIpV6,
            this.avgSoaMinimum,
            this.avgSoaRefresh,
            this.percentageOfSoaOutsideOfGermany,
        ];
    }

    /**
     * Initializes the charts to be displayed and pushes them to their respective tab object.
     * @private
     */
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

        this.initDomainAccessStatusCodes();
        this.initTopTenRedirectedTo();
        this.tab02Redirect.charts = [
            this.domainAccessStatusCodes,
            this.topTenRedirectedTo,
        ];

        this.initTopTenMxAsn();
        this.initTopTenMxCities();
        this.initTopTenMxCountries();
        this.tab03MxGeo.charts = [
            this.topTenMxAsn,
            this.topTenMxCities,
            this.topTenMxCountries,
        ];

        this.initTopTenMxAsn();
        this.initTopTenMxCities();
        this.initTopTenMxCountries();
        this.tab03MxGeo.charts = [
            this.topTenMxAsn,
            this.topTenMxCities,
            this.topTenMxCountries,
        ];

        this.initSoaNameserversCountWhereNoErr();
        this.initTopTenSoaAsn();
        this.initTopTenSoaCities();
        this.initTopTenSoaCountries();
        this.tab04ipv6Soa.charts = [
            this.soaNameserversCountWhereNoErr,
            this.topTenSoaAsn,
            this.topTenSoaCities,
            this.topTenSoaCountries,
        ];
    }

    // Functions called on KPI changes, implemented using the following schema:
    // data => <kpi>.value = data[<property to be shown>]

    private onDomainCountTriggered(data: any): void {
        this.domainCount.value = data[0].domain_count;
    }

    private onMxLocalhostPercentageTriggered(data: any): void {
        this.percentageOfMxLocalhost.value = data[0].percentage;
    }

    private onPercentageOfRedirectionsTriggered(data: any): void {
        this.percentageOfRedirections.value = data[0].percentage;
    }

    private onPercentageOfRedirections200Triggered(data: any): void {
        this.percentageOfRedirections200.value = data[0].percentage;
    }

    private onPercentageOfMxOutsideOfGermanyTriggered(data: any): void {
        this.percentageOfMxOutsideOfGermany.value = data[0].percentage;
    }

    private onPercentageOfIpV6Triggered(data: any): void {
        this.percentageOfIpV6.value = data[0].percentage;
    }

    private onAvgSoaMinimumTriggered(data: any): void {
        this.avgSoaMinimum.value = data[0].avg;
    }

    private onAvgSoaRefreshTriggered(data: any): void {
        this.avgSoaRefresh.value = data[0].avg;
    }

    private onPercentageSoaOutsideOfGermanyTriggered(data: any): void {
        this.percentageOfSoaOutsideOfGermany.value = data[0].percentage;
    }

    // Initialization functions and functions called in case of chart data changes.
    // init<...> => Initialization of the chart considering already existing object (in order to avoid reset in case of language changes)
    // on<...>Triggered => set labels, data and hasData for the respective chart.

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
        data = data.sort((a: any, b: any) => b.count - a.count);
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
        data = data.sort((a: any, b: any) => b.count - a.count);
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

    // domainAccessStatusCodes

    private initDomainAccessStatusCodes(): void {
        const chart = this.domainAccessStatusCodes;
        this.domainAccessStatusCodes = {
            titleKey: 'dashboard.chart.domainAccessCodes.title',
            data: chart?.data.length
                ? chart.data.map((d, i) => ({
                      ...d,
                      label: this.translate.instant(
                          i === 0
                              ? 'dashboard.chart.domainAccessCodes.notRedirected'
                              : 'dashboard.chart.domainAccessCodes.redirected'
                      ),
                  }))
                : [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'bar',
            showLabels: true,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant(
                    'dashboard.chart.domainAccessCodes.record'
                ),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }

    private onDomainAccessStatusCodesTriggered(data: any): void {
        data = data.sort((a: any, b: any) => a.status_code - b.status_code);
        this.domainAccessStatusCodes.data = [
            {
                data: data.map((d: any) => d.not_redirected_count),
                label: this.translate.instant(
                    'dashboard.chart.domainAccessCodes.notRedirected'
                ),
            },
            {
                data: data.map((d: any) => d.redirected_count),
                label: this.translate.instant(
                    'dashboard.chart.domainAccessCodes.redirected'
                ),
            },
        ];
        this.domainAccessStatusCodes.labels = data.map(
            (d: any) => d.status_code
        );
        this.domainAccessStatusCodes.hasData = data.length;
    }

    // topTenRedirectedTo

    private initTopTenRedirectedTo(): void {
        const chart = this.topTenRedirectedTo;
        this.topTenRedirectedTo = {
            titleKey: 'dashboard.chart.topTenRedirectedTo.title',
            data: chart?.data ?? [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'pie',
            showLabels: true,
            options: { responsive: true },
        };
    }

    private onTopTenRedirectedToTriggered(data: any): void {
        data = data.sort((a: any, b: any) => b.count - a.count);
        this.topTenRedirectedTo.data = [
            { data: data.map((d: any) => d.count) },
        ];
        this.topTenRedirectedTo.labels = data.map((d: any) => d.redirection);
        this.topTenRedirectedTo.hasData = data.length;
    }

    // topTenMxAsn

    private initTopTenMxAsn(): void {
        const chart = this.topTenMxAsn;
        this.topTenMxAsn = {
            titleKey: 'dashboard.chart.topTenMxAsn.title',
            data: chart?.data ?? [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant('dashboard.chart.topTenMxAsn.record'),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }

    private onTopTenMxAsnTriggered(data: any): void {
        this.topTenMxAsn.data = [{ data: data.map((d: any) => d.count) }];
        this.topTenMxAsn.labels = data.map(
            (d: any) => `${d.autonomous_system_organization} (${d.iso_code})`
        );
        this.topTenMxAsn.hasData = data.length;
    }

    // topTenMxCities

    private initTopTenMxCities(): void {
        const chart = this.topTenMxCities;
        this.topTenMxCities = {
            titleKey: 'dashboard.chart.topTenMxCities.title',
            data: chart?.data ?? [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'pie',
            showLabels: true,
            options: { responsive: true },
        };
    }

    private onTopTenMxCitiesTriggered(data: any): void {
        this.topTenMxCities.data = [{ data: data.map((d: any) => d.count) }];
        this.topTenMxCities.labels = data.map(
            (d: any) => `${d.city} (${d.iso_code})`
        );
        this.topTenMxCities.hasData = data.length;
    }

    // topTenMxCountries

    private initTopTenMxCountries(): void {
        const chart = this.topTenMxCountries;
        this.topTenMxCountries = {
            titleKey: 'dashboard.chart.topTenMxCountries.title',
            data: chart?.data ?? [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant(
                    'dashboard.chart.topTenMxCountries.record'
                ),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }

    private onTopTenMxCountriesTriggered(data: any): void {
        this.topTenMxCountries.data = [{ data: data.map((d: any) => d.count) }];
        this.topTenMxCountries.labels = data.map((d: any) => d.iso_code);
        this.topTenMxCountries.hasData = data.length;
    }

    // soaNameserversCountWhereNoErr

    private initSoaNameserversCountWhereNoErr(): void {
        const chart = this.soaNameserversCountWhereNoErr;
        this.soaNameserversCountWhereNoErr = {
            titleKey: 'dashboard.chart.soaNameserversCountWhereNoErr.title',
            data: chart?.data ?? [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant(
                    'dashboard.chart.soaNameserversCountWhereNoErr.record'
                ),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }

    private onSoaNameserversCountWhereNoErrTriggered(data: any): void {
        data = data.sort((a: any, b: any) => b.count - a.count);
        this.soaNameserversCountWhereNoErr.data = [
            { data: data.map((d: any) => d.count) },
        ];
        this.soaNameserversCountWhereNoErr.labels = data.map((d: any) => {
            return `${this.translate.instant(
                'dashboard.dataLabel.nameservers'
            )}: ${d.nameservers_cont}`;
        });
        this.soaNameserversCountWhereNoErr.hasData = data.length;
    }

    // topTenSoaAsn

    private initTopTenSoaAsn(): void {
        const chart = this.topTenSoaAsn;
        this.topTenSoaAsn = {
            titleKey: 'dashboard.chart.topTenSoaAsn.title',
            data: chart?.data ?? [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant('dashboard.chart.topTenSoaAsn.record'),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }

    private onTopTenSoaAsnTriggered(data: any): void {
        this.topTenSoaAsn.data = [{ data: data.map((d: any) => d.count) }];
        this.topTenSoaAsn.labels = data.map(
            (d: any) => `${d.autonomous_system_organization} (${d.iso_code})`
        );
        this.topTenSoaAsn.hasData = data.length;
    }

    // topTenSoaCities

    private initTopTenSoaCities(): void {
        const chart = this.topTenSoaCities;
        this.topTenSoaCities = {
            titleKey: 'dashboard.chart.topTenSoaCities.title',
            data: chart?.data ?? [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'pie',
            showLabels: true,
            options: { responsive: true },
        };
    }

    private onTopTenSoaCitiesTriggered(data: any): void {
        this.topTenSoaCities.data = [{ data: data.map((d: any) => d.count) }];
        this.topTenSoaCities.labels = data.map(
            (d: any) => `${d.city} (${d.iso_code})`
        );
        this.topTenSoaCities.hasData = data.length;
    }

    // topTenSoaCountries

    private initTopTenSoaCountries(): void {
        const chart = this.topTenSoaCountries;
        this.topTenSoaCountries = {
            titleKey: 'dashboard.chart.topTenSoaCountries.title',
            data: chart?.data ?? [],
            labels: chart?.labels ?? [],
            hasData: !!chart?.data?.length,
            size: chart?.size,
            type: 'bar',
            showLabels: false,
            options: DomainAnalysisChart.defaultOptionsWithLabels(
                this.translate.instant(
                    'dashboard.chart.topTenSoaCountries.record'
                ),
                this.translate.instant('dashboard.general.number')
            ),
        };
    }

    private onTopTenSoaCountriesTriggered(data: any): void {
        this.topTenSoaCountries.data = [
            { data: data.map((d: any) => d.count) },
        ];
        this.topTenSoaCountries.labels = data.map((d: any) => d.iso_code);
        this.topTenSoaCountries.hasData = data.length;
    }
}
