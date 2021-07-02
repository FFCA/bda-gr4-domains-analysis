import { DomainAnalysisEvent } from '../model/domain-analysis-event';
import { DomainAnalysisFunctionName } from '../model/domain-analysis-function-name';

const eventQueryMap = new Map<
    DomainAnalysisEvent,
    DomainAnalysisFunctionName[]
>([
    [DomainAnalysisEvent.DOMAIN, [DomainAnalysisFunctionName.DOMAIN_COUNT]],
    [
        DomainAnalysisEvent.A_COUNT_GLOBAL,
        [DomainAnalysisFunctionName.TOP_10_A_GLOBAL],
    ],
    [
        DomainAnalysisEvent.MX_COUNT_GLOBAL,
        [DomainAnalysisFunctionName.TOP_10_MX_GLOBAL],
    ],
    [
        DomainAnalysisEvent.A_CHECKED_COUNT_GLOBAL,
        [DomainAnalysisFunctionName.TOP_10_A_CHECKED_GLOBAL],
    ],
    [
        DomainAnalysisEvent.MX_CHECKED_COUNT_GLOBAL,
        [DomainAnalysisFunctionName.TOP_10_MX_CHECKED_GLOBAL],
    ],
    [
        DomainAnalysisEvent.DOMAIN_ENHANCED_BASED_ON_EXISTING,
        [
            DomainAnalysisFunctionName.MX_COUNT_GROUPED,
            DomainAnalysisFunctionName.A_COUNT_GROUPED,
            DomainAnalysisFunctionName.PERCENTAGE_OF_MX_LOCALHOST,
        ],
    ],
]);

export const getDbFunctionByEvent = (event: DomainAnalysisEvent): string[] => {
    return eventQueryMap.get(event)!;
};

export const getDbFunctions = (): Map<DomainAnalysisEvent, string[]> => {
    return eventQueryMap;
};

export const getAllEvents = (): DomainAnalysisEvent[] => {
    return [...eventQueryMap.keys()];
};
