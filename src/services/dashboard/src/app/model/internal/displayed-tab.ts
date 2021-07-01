import { DomainAnalysisChart } from './domain-analysis-chart';
import { DomainAnalysisKpi } from './domain-analysis-kpi';

/**
 * Class for defining tabs to be displayed.
 */
export class DisplayedTab {

    /**
     * @param tabKey Translation key of the tab
     * @param tabExplanationKey Translation key for the explanatory text to be displayed.
     * @param charts Charts to be displayed.
     * @param kpis KPIs to be displayed.
     */
    constructor(
        public tabKey: string,
        public tabExplanationKey: string,
        public charts: DomainAnalysisChart[],
        public kpis: DomainAnalysisKpi[]
    ) {}
}
