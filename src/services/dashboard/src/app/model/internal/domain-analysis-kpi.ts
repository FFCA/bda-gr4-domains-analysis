/**
 * KPI class containing information to be displayed.
 */
export class DomainAnalysisKpi {
    /**
     * @param translationKey Translation key of the KPI.
     * @param value Value to be displayed.
     */
    constructor(public translationKey: string, public value?: number) {}
}
