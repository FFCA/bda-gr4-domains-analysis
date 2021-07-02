import { Component, Input, OnInit } from '@angular/core';
import { DomainAnalysisChart } from '../../../../model/internal/domain-analysis-chart';

/**
 * Generically usable component containing a chart incl. title in a Material card.
 */
@Component({
    selector: 'app-chart-card',
    templateUrl: './chart-card.component.html',
    styleUrls: ['./chart-card.component.scss'],
})
export class ChartCardComponent implements OnInit {
    readonly sizes: ('S' | 'M' | 'XL')[] = ['S', 'M', 'XL'];

    /**
     * Chart to be displayed.
     */
    @Input() chart!: DomainAnalysisChart;

    /**
     * Number of the chart.
     */
    @Input() nr!: number;

    /**
     * Sets the chart size to M if undefined.
     */
    ngOnInit(): void {
        this.chart.size = this.chart.size ?? 'S';
    }
}
