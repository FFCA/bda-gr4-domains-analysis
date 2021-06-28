import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

/**
 * Chart containing all information to be displayed.
 */
export class DomainAnalysisChart {
    /**
     * @param data Datasets to be displayed.
     * @param titleKey Translation key of the chart title.
     * @param type Chart type.
     * @param labels Chart labels to be displayed.
     * @param options Further chart configurations.
     * @param showLabels True if labels are to be shown, false if not.
     */
    constructor(
        readonly data: ChartDataSets[],
        readonly titleKey: string,
        readonly type: ChartType,
        readonly labels: Label[],
        readonly options: ChartOptions,
        readonly showLabels: boolean
    ) {}
}
