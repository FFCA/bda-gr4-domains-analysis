import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

/**
 * Chart containing all information to be displayed.
 */
export class DomainAnalysisChart {
    /**
     * @param x X-axis label to be set.
     * @param y Y-axis label to be set.
     * @return default chart options with labels.
     */
    static defaultOptionsWithLabels(x: string, y: string): any {
        return {
            responsive: true,
            scales: {
                xAxes: [{ scaleLabel: { display: true, labelString: x } }],
                yAxes: [
                    {
                        ticks: { beginAtZero: true, autoSkip: false },
                        scaleLabel: { display: true, labelString: y },
                    },
                ],
            },
        };
    }

    /**
     * @param data Datasets to be displayed.
     * @param titleKey Translation key of the chart title.
     * @param type Chart type.
     * @param labels Chart labels to be displayed.
     * @param options Further chart configurations.
     * @param showLabels True if labels are to be shown, false if not.
     * @param hasData True if the chart data is ont empty.
     * @param size Size of the chart.
     */
    constructor(
        public data: ChartDataSets[],
        public titleKey: string,
        public type: ChartType,
        public labels: Label[],
        public options: ChartOptions,
        public showLabels: boolean,
        public hasData: boolean,
        public size?: 'S' | 'M' | 'XL'
    ) {}
}
