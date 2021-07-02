/**
 * KPI class containing information to be displayed.
 */
export class DomainAnalysisKpi {
    /**
     * @param translationKey Translation key of the KPI.
     * @param isPercentage True if the value is to be displayed as percentage, false if not.
     * @param value Value to be displayed.
     */
    constructor(
        public translationKey: string,
        public isPercentage?: boolean,
        public value?: number
    ) {}
}
