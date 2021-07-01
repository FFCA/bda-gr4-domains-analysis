import { Component, Input } from '@angular/core';
import { DomainAnalysisKpi } from '../../../../model/internal/domain-analysis-kpi';

/**
 * Component for prominently displaying KPIs.
 */
@Component({
    selector: 'app-kpi-card',
    templateUrl: './kpi-card.component.html',
    styleUrls: ['./kpi-card.component.scss'],
})
export class KpiCardComponent {
    /**
     * KPI to be displayed.
     */
    @Input() kpi!: DomainAnalysisKpi;

    /**
     * Number of the chart.
     */
    @Input() nr!: number;
}
