import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StatisticsService } from '../../services/statistics.service';
import { DomainAnalysisChart } from '../../model/internal/domain-analysis-chart';

@Component({
    selector: 'app-dashboard-main',
    templateUrl: './dashboard-main.component.html',
    styleUrls: ['./dashboard-main.component.scss'],
})
export class DashboardMainComponent implements OnInit {
    // TODO: take real data / add documentation / move to sub-components?
    // TODO: Use magic grid and option to make diagrams smaller/bigger?

    /**
     * Charts to be displayed.
     */
    readonly charts: DomainAnalysisChart[] = [];

    private readonly labels =
        'The quick brown fox jumps over the lazy dog'.split(/\s/);

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

    /**
     * @param statistics Injected statistics service.
     * @param translate Injected translation service.
     */
    constructor(
        readonly statistics: StatisticsService,
        private readonly translate: TranslateService
    ) {}

    ngOnInit(): void {
        this.charts.push(
            this.exampleLine,
            this.exampleMultiLine,
            this.exampleBar,
            this.exampleMultiBar,
            this.examplePolar,
            this.exampleDynamicData,
            this.examplePie,
            this.exampleDoughnut,
            this.exampleScatter,
            this.exampleScatterMulti
        );
        this.charts.sort((a, b) => (Math.random() > 0.5 ? -1 : 1));
    }

    private get exampleScatter(): DomainAnalysisChart {
        return {
            titleKey: 'Some customized scatter',
            data: [
                {
                    label: 'Scatter data',
                    backgroundColor: '#8aba18',
                    pointBackgroundColor: '#8aba18',
                    pointHoverBackgroundColor: '#8aba18',
                    pointHoverBorderColor: '#8aba18',
                    pointRadius: 7,
                    pointHoverRadius: 10,
                    data: Array.from({ length: 50 }, () => ({
                        x: +(Math.random() * 10).toFixed(3),
                        y: +(Math.random() * 10).toFixed(3),
                    })),
                },
            ],
            labels: [],
            type: 'scatter',
            showLabels: false,
            hasData: true,
            options: {
                responsive: true,
                scales: {
                    xAxes: [
                        {
                            type: 'linear',
                            position: 'bottom',
                        },
                    ],
                },
            },
        };
    }

    private get exampleScatterMulti(): DomainAnalysisChart {
        return {
            titleKey:
                'Some customized (more or less) default scatter with multiple datasets',
            data: [
                {
                    label: 'First scatter data set',
                    backgroundColor: '#8aba18',
                    pointBackgroundColor: '#8aba18',
                    pointHoverBackgroundColor: '#8aba18',
                    pointHoverBorderColor: '#8aba18',
                    data: Array.from({ length: 20 }, () => ({
                        x: +(Math.random() * 10).toFixed(3),
                        y: +(Math.random() * 10).toFixed(3),
                    })),
                },
                {
                    label: 'Second scatter data set',
                    backgroundColor: '#5b18ba',
                    pointBackgroundColor: '#5b18ba',
                    pointHoverBackgroundColor: '#5b18ba',
                    pointHoverBorderColor: '#5b18ba',
                    data: Array.from({ length: 20 }, () => ({
                        x: +(Math.random() * 10).toFixed(3),
                        y: +(Math.random() * 10).toFixed(3),
                    })),
                },
            ],
            labels: [],
            type: 'scatter',
            showLabels: true,
            hasData: true,
            options: {
                responsive: true,
                scales: {
                    xAxes: [
                        {
                            type: 'linear',
                            position: 'bottom',
                        },
                    ],
                },
            },
        };
    }

    private get exampleDoughnut(): DomainAnalysisChart {
        return {
            titleKey: 'Some doughnut chart. Hmmmmm doughnuts...',
            data: [
                {
                    data: Array.from({ length: 3 }, () =>
                        Math.floor(Math.random() * 20)
                    ),
                },
            ],
            hasData: true,
            labels: ['quick', 'brown', 'fox'],
            type: 'doughnut',
            showLabels: true,
            options: { responsive: true },
        };
    }

    private get examplePie(): DomainAnalysisChart {
        return {
            titleKey: 'Some pie chart',
            data: [
                {
                    data: Array.from({ length: 3 }, () =>
                        Math.floor(Math.random() * 20)
                    ),
                },
            ],
            labels: ['quick', 'brown', 'fox'],
            type: 'pie',
            showLabels: true,
            hasData: true,
            options: { responsive: true },
        };
    }

    private get exampleDynamicData(): DomainAnalysisChart {
        const data = {
            data: Array.from({ length: 10 }, () =>
                Math.floor(Math.random() * 20)
            ),
            label: 'Crazy dynamic data',
        };

        const reload = () =>
            setTimeout(() => {
                data.data = Array.from({ length: 10 }, () =>
                    Math.floor(Math.random() * 20)
                );
                reload();
            }, 3000);

        reload();

        return {
            titleKey:
                'Dynamic data (re-randomized each 3s) - Async for a similar effect?',
            data: [data],
            labels: this.labels,
            type: 'line',
            hasData: true,
            showLabels: false,
            options: this.defaultOptions,
        };
    }

    private get examplePolar(): DomainAnalysisChart {
        return {
            titleKey: 'Some pretty interesting polar chart',
            data: [
                {
                    data: Array.from({ length: 3 }, () =>
                        Math.floor(Math.random() * 20)
                    ),
                    label: 'Polar dataset',
                },
            ],
            labels: ['quick', 'brown', 'fox'],
            type: 'polarArea',
            showLabels: true,
            hasData: true,
            options: { responsive: true },
        };
    }

    private get exampleMultiBar(): DomainAnalysisChart {
        return {
            titleKey: 'Some chart with multiple bars',
            data: [
                {
                    data: Array.from({ length: 10 }, () =>
                        Math.floor(Math.random() * 20)
                    ),
                    label: 'First bar dataset',
                },
                {
                    data: Array.from({ length: 10 }, () =>
                        Math.floor(Math.random() * 20)
                    ),
                    label: 'Second bar dataset',
                },
            ],
            labels: this.labels,
            type: 'bar',
            hasData: true,
            showLabels: true,
            options: this.defaultOptions,
        };
    }

    private get exampleBar(): DomainAnalysisChart {
        return {
            titleKey: 'Some bar chart',
            data: [
                {
                    data: Array.from({ length: 10 }, () =>
                        Math.floor(Math.random() * 20)
                    ),
                    label: 'Some bar data',
                },
            ],
            labels: this.labels,
            type: 'bar',
            showLabels: false,
            hasData: true,
            options: this.defaultOptions,
        };
    }

    private get exampleMultiLine(): DomainAnalysisChart {
        return {
            titleKey: 'Multiple lines (definitely crossing at "fox")',
            data: [
                {
                    data: Array.from({ length: 10 }, () =>
                        Math.floor(Math.random() * 20)
                    ).map((v, i) => (i === 3 ? 10 : v)),
                    fill: false,
                    label: 'Pink data',
                },
                {
                    data: Array.from({ length: 10 }, () =>
                        Math.floor(Math.random() * 20)
                    ).map((v, i) => (i === 3 ? 10 : v)),
                    fill: false,
                    label: 'Blue data',
                },
                {
                    data: Array.from({ length: 10 }, () =>
                        Math.floor(Math.random() * 20)
                    ).map((v, i) => (i === 3 ? 10 : v)),
                    fill: false,
                    label: 'Yellow data',
                },
            ],
            labels: this.labels,
            type: 'line',
            showLabels: true,
            hasData: true,
            options: this.defaultOptions,
        };
    }

    private get exampleLine(): DomainAnalysisChart {
        return {
            titleKey: 'Some interesting line chart in HTW color',
            data: [
                {
                    data: Array.from({ length: 10 }, () =>
                        Math.floor(Math.random() * 20)
                    ),
                    borderColor: '#8aba18',
                    backgroundColor: 'rgba(138,186,24,0.6)',
                    pointBackgroundColor: '#8aba18',
                    label: 'data label',
                },
            ],
            labels: this.labels,
            hasData: true,
            type: 'line',
            showLabels: false,
            options: this.defaultOptions,
        };
    }
}