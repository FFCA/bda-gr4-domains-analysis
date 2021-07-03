import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StatisticsService } from '../../services/statistics.service';
import { DomainAnalysisChart } from '../../model/internal/domain-analysis-chart';

/**
 * Project's main component listing tabbed charts and KPIs.
 */
@Component({
    selector: 'app-dashboard-main',
    templateUrl: './dashboard-main.component.html',
    styleUrls: ['./dashboard-main.component.scss'],
})
export class DashboardMainComponent {
    /**
     * Charts to be displayed.
     */
    readonly charts: DomainAnalysisChart[] = [];

    /**
     * The selected tab index.
     */
    selectedIndex = 0;

    /**
     * @param statistics Injected statistics service.
     * @param translate Injected translation service.
     */
    constructor(
        readonly statistics: StatisticsService,
        private readonly translate: TranslateService
    ) {}

    /**
     * Sets the {{ selectedIndex }} to the given number smoothly scrolls to the top.
     */
    navigateToIndex(index: number): void {
        this.selectedIndex = index;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
